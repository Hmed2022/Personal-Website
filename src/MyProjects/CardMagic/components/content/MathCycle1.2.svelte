<script>
  import { rect } from '../../stores/layout.js';
  import { onMount, onDestroy, tick } from "svelte";
  const browser = typeof window !== "undefined";
  import { get } from "svelte/store";
  import Arrow from "../items/Arrow.svelte";
  import Annotations from "../items/Annotations.svelte";
  import CurlyBraceCoords from "../items/Brace.svelte";
  import { statuscard, lockedCard, cycle1array, annotations, positions } from "../../stores/misc.js";
  // the pile (1-3) that held the selected card in cycle 1
  $: selectedPile = $cycle1array.find((c) => c.selected)?.cycle1pile;
  import Up from '../items/JustUpArrow.svelte'
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  function jumpToCards() {
    dispatch('goto', { y: 0, x: 0 }); // the magic "Pick a card" slide
  }

  // ------- helpers -------
  function DisplaySuit (suit) {
    if (suit === 'Hearts') return '♥\uFE0E';
    if (suit === 'Diamonds') return '♦\uFE0E';
    if (suit === 'Clubs') return '♣\uFE0E';
    if (suit === 'Spades') return '♠\uFE0E';
    return suit;
  }
  function DisplayValue(v) {
    if (v === 11) return 'Jack';
    if (v === 12) return 'Queen';
    if (v === 13) return 'King';
    if (v === 1) return 'Ace';
    return v;
  }

  // -------- overlay logic (braces & arrow) --------
  let board;
  let containerEl;           // bind to the stack container
  let note;

  const elMap = new Map();   // card.index -> DOM element
  let layoutVersion = 0;
  let selectedEl = null;

  let p1 = null, p2 = null, p3 = null; // brace coordinates

  const invalidate = () => { layoutVersion += 1; };

  // action to register each card node — batched invalidation
  function collect(node, card){
    elMap.set(card.index, node);
    if (card.selected) selectedEl = node;
    queueMicrotask(invalidate);
    return {
      update(newCard){
        if (newCard.index !== card.index) {
          elMap.delete(card.index);
          elMap.set(newCard.index, node);
        }
        if (newCard.selected) selectedEl = node;
        card = newCard;
        queueMicrotask(invalidate);
      },
      destroy(){
        elMap.delete(card.index);
        if (selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      }
    };
  }

  function pileBounds(pileNo){
    if (!browser || !board) return null;
    const b = rect(board);
    let y1 = Infinity, y2 = -Infinity;
    let xLeft = Infinity, xRight = -Infinity;
    let any = false;

    const arr = get(cycle1array);              // snapshot store
    for (const card of arr) {
      if (card.cycle1pile !== pileNo) continue;
      const el = elMap.get(card.index);
      if (!el) continue;
      const r = rect(el);
      y1 = Math.min(y1, r.top - b.top);
      y2 = Math.max(y2, r.bottom - b.top);
      xLeft  = Math.min(xLeft,  r.left  - b.left);
      xRight = Math.max(xRight, r.right - b.left);
      any = true;
    }
    if (!any) return null;

    const GAP = 16;
    return { y1, y2, leftX: xLeft - GAP, rightX: xRight + GAP };
  }
  
  // recompute when layout/data change
  $: layoutVersion, p1 = pileBounds(1);
  $: layoutVersion, p2 = pileBounds(2);
  $: layoutVersion, p3 = pileBounds(3);
  $: get(cycle1array), queueMicrotask(invalidate);
  $: if ($annotations) queueMicrotask(invalidate);

  // -------- positions overlay (labels only) --------
  const ord = n => {
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  let posMarks = [];  // [{x, y, text}]
  let posX = 0;

  function computePosMarks(){
    if (!browser || !board || !containerEl) return [];
    const b = rect(board);
    const c = rect(containerEl);
    const x = c.left - b.left - 28;     // column left of the stack
    posX = x;

    const marks = [];
    // use existing rectangles: one label per cycle1pos
    const arr = get(cycle1array);
    for (let p = 0; p < 27; p++) {
      const card = arr.find(d => d.cycle1pos === p);
      if (!card) continue;
      const el = elMap.get(card.index);
      if (!el) continue;
      const r = rect(el);
      const y = (r.top + r.bottom) / 2 - b.top; // card center
      marks.push({ x, y, text: ord(p + 1) });
    }
    return marks;
  }

  $: if ($positions) posMarks = computePosMarks();
  $: layoutVersion, $positions && (posMarks = computePosMarks());
  $: get(cycle1array), $positions && (posMarks = computePosMarks());
  

  // -------- observers & mount timing (Option 1 with SSR guards) --------
  let ro;
  function onWinResize() { invalidate(); }

  onMount(async () => {
    if (!browser) return;

    // Observe size changes (document root + stage + container)
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => invalidate());
      [document.documentElement, board, containerEl].forEach(el => el && ro.observe(el));
    }
    window.addEventListener('resize', onWinResize);

    // Wait for DOM & fonts before measuring
    await tick();
    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch {}
    }
    await tick();
    requestAnimationFrame(() => invalidate());
  });

  onDestroy(() => {
    if (!browser) return;
    ro && ro.disconnect();
    window.removeEventListener('resize', onWinResize);
  });
</script>

<main class="body">
  {#if $statuscard}
      {#if $annotations}
      <div class="descPos">
          <div class="desc">
          When gathering, the pile with your card always goes in the middle. That's the secret, and it isn't shown in the trick: whichever pile it was in, your card is now somewhere in positions 10–18.
          </div>
      </div>
      {/if}

    <div class="stage" bind:this={board}>
      <div class="container" bind:this={containerEl}>
        {#each $cycle1array as card (card.index)}
          <div
            class="card {card.selected ? 'selected' : ''} {card.cycle1pos >= 9 && card.cycle1pos <= 17 && !card.selected ? 'cycle-range' : ''}"
            use:collect={card}
            style="top: calc({card.cycle1pos} * 3.5%); margin-bottom: {card.cycle1pos === 8 || card.cycle1pos === 17 ? '10%' : '0'};"
          >
            {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
          </div>
        {/each}
      </div>

      <!-- Brace and arrow overlays -->
      {#if $annotations}
        <div class="note" bind:this={note}>Your card</div>

        <div class="brace-layer" aria-hidden="true">
          {#if p1}
            {#key layoutVersion}
              <CurlyBraceCoords side="right"  x={p1.leftX}  y1={p1.y1} y2={p1.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 1"/>
            {/key}
          {/if}
          {#if p2}
            {#key layoutVersion}
              <CurlyBraceCoords side="left" x={p2.rightX} y1={p2.y1} y2={p2.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 2"/>
            {/key}
          {/if}
          {#if p3}
            {#key layoutVersion}
              <CurlyBraceCoords side="right" x={p3.leftX} y1={p3.y1} y2={p3.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 3"/>
            {/key}
          {/if}
        </div>

        {#if selectedEl && note}
          <Arrow
            mode="viewport" 
            container={board} 
            fromEl={note}
            toEl={selectedEl}
            fromAnchor="left" 
            toAnchor="left" 
            headAt="end"
            curvature={0.22}
            bulge={0.16} 
            bulgeDir="auto"
            width={4} 
            color="#5a80c0"
          />
        {/if}
      {/if}

      {#if $positions}
        <svg class="positions-layer" aria-hidden="true">
          {#each posMarks as m (m.text)}
            <text x={m.x} y={m.y} class="pos-label-svg">
              {m.text === '1st' ? `Card Position : ${m.text}` : m.text}
            </text>
          {/each}
        </svg>

        <div class="brace-layer" aria-hidden="true">
          {#if p1}
            {#key layoutVersion}
              <CurlyBraceCoords side="left"  x={p1.rightX}  y1={p1.y1} y2={p1.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 1"/>
            {/key}
          {/if}
          {#if p2}
            {#key layoutVersion}
              <CurlyBraceCoords side="left" x={p2.rightX} y1={p2.y1} y2={p2.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 2"/>
            {/key}
          {/if}
          {#if p3}
            {#key layoutVersion}
              <CurlyBraceCoords side="left" x={p3.rightX} y1={p3.y1} y2={p3.y2}
                                stroke="#b25555" strokeWidth={4} w={26} q={0.6} label="Pile 3"/>
            {/key}
          {/if}
        </div>
      {/if}
    </div>

    {#if $positions}
    <div class='descPos1'>
      <p>
          After the first deal, your card is one of 9 cards:
          your pile (Pile {selectedPile}), now sitting in positions <span class="pos-hl">10</span> to <span class="pos-hl">18</span>.
      </p>
    </div>
    {/if}

    {#if $annotations}
    <div class="note-cycle">
      we mark the cards of your pile with a blue "I" to follow them through the next deals.
    </div>
    {/if}
  

    <Annotations/>
    <div class="footer"><p>Gathering I</p></div>
    {:else}
      <div class='else'>
        <p>
          Click the <b>Top Arrow or press</b>
          <Up enableKeyboard={false} on:tap={jumpToCards}/>
          <b>to jump</b> to the <b>Cards</b>
          {$lockedCard ? 'and press “Lock it in!” on the card you clicked!' : 'and pick one!'}
        </p> </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

  .body:has(.else) { justify-content: center;  text-align: center; }

  .else{
    font-size: 2rem; 
    font-family: 'Kumbh Sans', sans-serif;
    color: #A34C48;
  }

  .body{
    height:100%; background:#FDD4D4;
    display:flex; flex-direction:column; align-items:center; justify-content:space-between;
    font-family:'Kumbh Sans',sans-serif; color:#A34C48;
  }

  .stage{ position:relative; width:min(780px, 92cqw); height:90cqh; margin:2rem auto; }

  .container{
    position:relative; width:280px; height:100%; margin:0 auto;
    display:flex; flex-direction:column-reverse; gap:10px; align-items:center;
  }

  .card{
    position:absolute; width:100%; height:23px; background:#F09D99;
    display:flex; align-items:center; justify-content:center;
    font-size:0.8rem; font-weight:700; color:#fff; transition: transform 0.2s ease;
    border-radius:6px;
  }
  .card.cycle-range{ background: linear-gradient(to right, #F09D99 0 90%, #558ABB 90% 100%);}

  .card.cycle-range::after{ content:"I";
    position:absolute; right:0; top:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;}

  .card.selected{    color:#A34C48;
      background: linear-gradient(to right, #F09D99 0 90%, #558ABB 90% 100%);}

  .card.selected::after{content:"I";
    position:absolute; right:0; top:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
      }

  .note{
      left: calc(100% + 40px); 
      top:50%; 
      transform:translateY(-40%); 
      color:#5a80c0;
      font-weight:900; 
      font-size:2rem;
      font-family: "Nanum Pen Script", cursive; 
      /* position: absolute; */
  }

  /* position numbers in the positions note: highlighted like the 14th on Gathering III */
  .pos-hl{
    background:#548ABB;
    color:#FCD5D4;
    padding:0 .2em;
    border-radius:.2em;
  }

  .descPos1{
      font-family: "Nanum Pen Script", cursive; 
      font-size:1.8rem;
      line-height: 0.7;   /* same spacing as the Gathering III note */
      max-width: 14rem;
      text-align: center;
      color:#548ABB;
      position: absolute;
      left: clamp(12px, 6cqw, 120px);
      top: 48%;
      transform: translateY(-40%);
  }

  .note-cycle{
      font-family: "Nanum Pen Script", cursive; 
      font-size:1.8rem;
      line-height: 0.7;   /* same spacing as the positions notes */
      max-width: 13rem;
      text-align: center;
      color:#548ABB;
      position: absolute;
      right: clamp(50px, 20cqw, 80px);
      top: 48%;
      transform: translateY(-40%);
  }

  /* ---- overlays ---- */
  .brace-layer{
    position:absolute;
    inset:0;
    pointer-events:none;
    z-index:1100; /* above positions-layer and cards */
  }

  .positions-layer{
    position:absolute; inset:0; width:100%; height:100%;
    pointer-events:none; overflow:visible; z-index:1000;
  }
  .pos-label-svg{
    font-family:"Nanum Pen Script", cursive;
    font-size:2rem;
    fill:#558ABB;
    dominant-baseline:middle;
    text-anchor:end;
  }
  .pos-title{
    position:absolute;
    top:16px;
    font-family:"Nanum Pen Script", cursive;
    font-size:2.2rem;
    color:#4973B0;
    pointer-events:none;
    z-index:1001;
  }

  .desc{ background:#874c47; color:#FDD4D4; font-size:1.1rem;
        padding:1rem; max-width:18rem; margin:1rem auto; text-align:center; }
  .descPos{ position:absolute; top:0; left:0; margin-top:3rem; margin-left:3rem; }
  /* stage narrower than 1100px (tablets): keep the box clear of the pile labels */
  :global(.cq-1100) .descPos{ margin-left:1rem; margin-top:1.5rem; }
  :global(.cq-1100) .desc{ max-width:10rem; font-size:.85rem; padding:.7rem; }

  .footer{ position:absolute; right:0; bottom:0; margin:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; }
</style>
