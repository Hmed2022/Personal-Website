<script>
  import { rect } from '../../stores/layout.js';
  import { onMount, onDestroy, tick, createEventDispatcher } from "svelte";
  const browser = typeof window !== "undefined";               // SSR guard
  import { get } from "svelte/store";
  import Arrow from "../items/Arrow.svelte";
  import CurlyBraceCoords from "../items/Brace.svelte";
  import { statuscard, lockedCard, cycle3array, annotations, positions, positionsHint, buttonClicked, slideChange } from "../../stores/misc.js";
  import Up from "../items/JustUpArrow.svelte";
  import ButtonHint from "../items/ButtonHint.svelte";

  const dispatch = createEventDispatcher();
  function jumpToCards() {
    dispatch('goto', { y: 0, x: 0 }); // the magic "Pick a card" slide
  }

  // -------- three-way toggle: annotations -> positions -> details -------
  let mode = "annotations"; // "annotations" | "positions" | "details"
  // back to annotations whenever the slide changes
  $: $slideChange, resetMode();
  function resetMode() { mode = "annotations"; }
  $: annotations.set(mode === "annotations");
  $: positions.set(mode === "positions");
  $: modeBtnLabel =
    mode === "annotations" ? "More Details!"  :
    mode === "details"     ? "Show Positions" : "Show Annotations";

  function cycleMode() {
    mode = mode === "annotations" ? "details" : mode === "details" ? "positions" : "annotations";
    positionsHint.set(false);
      buttonClicked.update((n) => n + 1); // don't spotlight this button again
    // force a fresh layout re-measure once the DOM/crossfade has settled
    setTimeout(invalidate, 350);
  }

  // ------- helpers -------
  const DisplaySuit = (suit) =>
    suit === "Hearts" ? "♥" :
    suit === "Diamonds" ? "♦" :
    suit === "Clubs" ? "♣" :
    suit === "Spades" ? "♠" : suit;

  const DisplayValue = (v) =>
    v === 11 ? "Jack" :
    v === 12 ? "Queen" :
    v === 13 ? "King" :
    v === 1  ? "Ace"  : v;

  // If your unique key is not `index`, change this to `card.currentIndex`
  const getId = (card) => card.index;

  // -------- overlay logic (braces & arrow) --------
  let board;            // stage
  let containerEl;      // stack container
  let note;             // "The Selected card" label

  const elMap = new Map();   // id -> DOM element
  let layoutVersion = 0;
  let selectedEl = null;

  let p1 = null, p2 = null, p3 = null; // brace coordinates
  const invalidate = () => { layoutVersion += 1; };

  // action to register each card node — batched with microtask
  function collect(node, card){
    let id = getId(card);
    elMap.set(id, node);
    if (card.selected) selectedEl = node;
    queueMicrotask(invalidate);

    return {
      update(newCard){
        const newId = getId(newCard);
        if (newId !== id) {
          elMap.delete(id);
          id = newId;
          elMap.set(id, node);
        }
        if (newCard.selected) selectedEl = node;
        else if (!newCard.selected && selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      },
      destroy(){
        elMap.delete(id);
        if (selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      }
    };
  }

  // If your piles are 0-based, switch calls below to (0,1,2)
  function pileBounds(pileNo){
    if (!browser || !board) return null;
    const b = rect(board);
    let y1 = Infinity, y2 = -Infinity;
    let xLeft = Infinity, xRight = -Infinity;
    let any = false;

    const arr = get(cycle3array); // snapshot
    for (const card of arr) {
      if (card.cycle3pile !== pileNo) continue;
      const el = elMap.get(getId(card));
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
  $: layoutVersion, p1 = pileBounds(1);  // change to 0 if using 0-based
  $: layoutVersion, p2 = pileBounds(2);  // change to 1 if using 0-based
  $: layoutVersion, p3 = pileBounds(3);  // change to 2 if using 0-based
  $: get(cycle3array), queueMicrotask(invalidate);
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
    const arr = get(cycle3array);
    for (let p = 0; p < 27; p++) {
      const card = arr.find(d => d.cycle3pos === p);
      if (!card) continue;
      const el = elMap.get(getId(card));
      if (!el) continue;
      const r = rect(el);
      const y = (r.top + r.bottom) / 2 - b.top; // card center
      marks.push({ x, y, text: ord(p + 1) });
    }
    return marks;
  }

  $: if ($positions) posMarks = computePosMarks();
  $: layoutVersion, $positions && (posMarks = computePosMarks());
  $: get(cycle3array), $positions && (posMarks = computePosMarks());

  // -------- explicit store reactivity for selection & matching --------
  $: c3 = $cycle3array;
  $: selected = (c3 ?? []).find(c => c?.selected) ?? null;
  $: selC1 = selected?.cycle1pile ?? null;
  $: selC2 = selected?.cycle2pile ?? null;
  $: selC3 = selected?.cycle3pile ?? null;

  function comboClass(card){
    const m1 = selC1 != null && card?.cycle1pile === selC1; // I
    const m2 = selC2 != null && card?.cycle2pile === selC2; // II
    const m3 = selC3 != null && card?.cycle3pile === selC3; // III
    if (m1 && m2 && m3) return "m123";
    if (m1 && m2) return "m12";
    if (m1 && m3) return "m13";
    if (m2 && m3) return "m23";
    if (m1) return "m1";
    if (m2) return "m2";
    if (m3) return "m3";
    return "";
  }

  // -------- "More Details" mode: the 2 cards eliminated in cycle 3 (matched
  // cycle-1 & cycle-2 but not cycle-3) plus the selected card itself --------
  function computeEliminatedEls() {
    const arr = get(cycle3array);
    return arr
      .filter((c) => comboClass(c) === "m12")
      .map((c) => elMap.get(getId(c)))
      .filter(Boolean);
  }
  let eliminatedEls = [];
  $: layoutVersion, get(cycle3array), eliminatedEls = computeEliminatedEls();

  function cardCenterY(el) {
    if (!board || !el) return null;
    const b = rect(board);
    const r = rect(el);
    return (r.top + r.bottom) / 2 - b.top;
  }

  // .container is centered inside a wider, responsive .stage, so the detail
  // captions need its *actual* measured edges (relative to .stage) rather
  // than a guessed fixed pixel offset
  function containerBounds() {
    if (!board || !containerEl) return null;
    const b = rect(board);
    const c = rect(containerEl);
    return { left: c.left - b.left, right: c.right - b.left };
  }
  let cBounds = null;
  $: layoutVersion, cBounds = containerBounds();

  let detailNote1, detailNote2, detailNote3;

  // -------- observers & mount timing (fonts-ready + ticks + RAF, SSR-guarded) --------
  let ro;
  function onWinResize() { invalidate(); }

  onMount(async () => {
    if (!browser) return;

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => invalidate());
      [document.documentElement, board, containerEl].forEach(el => el && ro.observe(el));
    }
    window.addEventListener("resize", onWinResize);

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
    window.removeEventListener("resize", onWinResize);
  });
</script>

<main class="body">
  {#if $statuscard}
    {#if $annotations}
      <div class="descPos">
        <div class="desc">
          Deal 3 adds a purple “III” band (bands stack from the right: I, II, III).
          Your card is the only one with all three bands. Gathering one last time
          with its pile in the middle puts it at position 14.
        </div>
      </div>
    {/if}

    <div class="stage" bind:this={board}>
      <div class="container" bind:this={containerEl}>
        {#each $cycle3array as card (getId(card))}
          <div
            class="card {card.selected ? 'selected' : ''} {comboClass(card)} {card.cycle3pos >= 9 && card.cycle3pos <= 17 && !card.selected ? 'cycle-range' : ''}"
            use:collect={card}
            style="top: calc({card.cycle3pos} * 3.5%); margin-bottom: {card.cycle3pos === 8 || card.cycle3pos === 17 ? '10%' : '0'};"
          >
            <!-- Right-side bands (shown/stacked via combo classes) -->
            <span class="band band-i"   aria-hidden="true">I</span>
            <span class="band band-ii"  aria-hidden="true">II</span>
            <span class="band band-iii" aria-hidden="true">III</span>

            {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
          </div>
        {/each}
      </div>

      <!-- Positions overlay -->
      {#if $positions}
        <svg class="positions-layer" aria-hidden="true">
          {#each posMarks as m (m.text)}
            {#if m.text === '14th'}
              <!-- purple highlight behind "14th" (label is ~47×32px, right-aligned at m.x) -->
              <rect x={m.x - 54} y={m.y - 17} width="60" height="31" rx="5" class="pos14-bg" />
            {/if}
            <text x={m.x} y={m.y} class="pos-label-svg" class:pos14-svg={m.text === '14th'}>
              {m.text === '1st' ? `Card Position : ${m.text}` : m.text}
            </text>
          {/each}
        </svg>
      {/if}

      <!-- Pile braces: "positions" mode (Pile 1 & 2 on the right) -->
      {#if $positions}
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

      <!-- Pile braces: "details" mode (Pile 1 & 2 on the left) -->
      {#if mode === "details"}
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

      <!-- Braces + arrow (annotation mode) -->
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

      <!-- More Details mode: the two cards eliminated in cycle 3, plus the selected card -->
      {#if mode === "details" && cBounds}
        {#if eliminatedEls[0]}
          <div
            class="detail-note detail-note-left"
            bind:this={detailNote1}
            style="top:{cardCenterY(eliminatedEls[0])}px; left:{cBounds.left - 30}px;"
          >
            This card was in your pile in the first two deals, but not in the third one, so it's out.
          </div>
        {/if}
        {#if selectedEl}
          <div
            class="detail-note detail-note-left"
            bind:this={detailNote2}
            style="top:{cardCenterY(selectedEl)}px; left:{cBounds.left - 30}px;"
          >
            Your card is the only card that's been in your pile in all three deals.
          </div>
        {/if}
        {#if eliminatedEls[1]}
          <div
            class="detail-note detail-note-left"
            bind:this={detailNote3}
            style="top:{cardCenterY(eliminatedEls[1])}px; left:{cBounds.left - 30}px;"
          >
            This card was also in your pile in the first two deals, but not in the third one, so it's out.
          </div>
        {/if}

        {#if detailNote1 && eliminatedEls[0]}
          {#key layoutVersion}
            <Arrow
              mode="container"
              container={board}
              fromEl={detailNote1}
              toEl={eliminatedEls[0]}
              fromAnchor="right"
              toAnchor="left"
              headAt="end"
              curvature={0.5}
              bulge={0.1}
              bulgeDir="auto"
              width={4}
              color="#D288CA"
            />
          {/key}
        {/if}
        {#if detailNote2 && selectedEl}
          {#key layoutVersion}
            <Arrow
              mode="container"
              container={board}
              fromEl={detailNote2}
              toEl={selectedEl}
              fromAnchor="right"
              toAnchor="left"
              headAt="end"
              curvature={0.5}
              bulge={0.1}
              bulgeDir="auto"
              width={3}
              color="#D288CA"
            />
          {/key}
        {/if}
        {#if detailNote3 && eliminatedEls[1]}
          {#key layoutVersion}
            <Arrow
              mode="container"
              container={board}
              fromEl={detailNote3}
              toEl={eliminatedEls[1]}
              fromAnchor="right"
              toAnchor="left"
              headAt="end"
              curvature={0.5}
              bulge={0.1}
              bulgeDir="auto"
              width={4}
              color="#D288CA"
            />
          {/key}
        {/if}
      {/if}
    </div>

    {#if $positions}
      <div class="descPos1">
        <p>
          After the third deal, only one card has been in your pile all three
          times (I, II and III): your card. It now sits exactly in the middle
          of the deck, at the <span class="pos14">14th</span> position.
        </p>
      </div>
    {/if}

    {#if $annotations}
      <div class="note-cycle">
        purple "III" = your pile in deal 3, with green "II" and blue "I" from before.
      </div>
    {/if}

    <div class="details-cont">
      <button class="details-btn" on:click={cycleMode}>{modeBtnLabel}</button>
      <div class="details-hint">click me!</div>
      {#if $positionsHint}
        <ButtonHint text={
          mode === "annotations" ? "Click here for more details on each card" :
          mode === "details"     ? "Click here to see each card's position in the pile" :
                                   "Click here to go back to the annotations"} />
      {/if}
    </div>
    <div class="footer"><p>Gathering III</p></div>
  {:else}
    <div class="else">
      <p>
        Click the <b>Top Arrow or press</b>
        <Up enableKeyboard={false} on:tap={jumpToCards}/>
        <b>to jump</b> to the <b>Cards</b>
        {$lockedCard ? 'and press “Lock it in!” on the card you clicked!' : 'and pick one!'}
      </p>
    </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

  .body:has(.else) { justify-content: center; text-align: center; }

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
    position:absolute; width:100%; height:23px;
    background-color:#F09D99; /* base only; bands are separate elements */
    display:flex; align-items:center; justify-content:center;
    font-size:0.8rem; font-weight:700; color:#fff; transition: transform 0.2s ease;
    border-radius:6px;
    isolation:isolate;     /* own stacking context for children */
    overflow:visible;
  }

  /* Selected card tint */
  .card.selected{ color:#A34C48; }

  /* Highlight middle-pile range if you want the blue background like in cycle1 */
  .card.cycle-range{
    background-image: linear-gradient(to right, #F09D99 0 90%, #558ABB 90% 100%);
  }

  /* ====== Right-side bands (I, II, III) ====== */
  .band{
    position:absolute; top:0; height:100%; width:10%;
    display:none; align-items:center; justify-content:center;
    color:#fff; font-weight:900; pointer-events:none;
  }
  .band-i   { background:#558ABB; } /* I  (cycle1)  blue  */
  .band-ii  { background:#55993D; } /* II (cycle2)  green */
  .band-iii { background:#d187c9; } /* III(cycle3)  purple*/

  /* Single matches */
  .card.m1  .band-i   { display:flex; right:0; }
  .card.m2  .band-ii  { display:flex; right:0; }
  .card.m3  .band-iii { display:flex; right:0; }

  /* Double matches (stack from right) */
  .card.m12 .band-i   { display:flex; right:0; }      /* 90–100% */
  .card.m12 .band-ii  { display:flex; right:10%; }    /* 80–90%  */

  .card.m13 .band-i   { display:flex; right:0; }
  .card.m13 .band-iii { display:flex; right:10%; }

  .card.m23 .band-ii  { display:flex; right:0; }
  .card.m23 .band-iii { display:flex; right:10%; }

  /* Triple match */
  .card.m123 .band-i   { display:flex; right:0; }      /* 90–100% */
  .card.m123 .band-ii  { display:flex; right:10%; }    /* 80–90%  */
  .card.m123 .band-iii { display:flex; right:20%; }    /* 70–80%  */

  /* ---- overlay layers ---- */
  .brace-layer{
    position:absolute;
    inset:0;
    pointer-events:none;
    z-index:1100; /* above cards & positions text */
  }

  .positions-layer{
    position:absolute; inset:0; width:100%; height:100%;
    pointer-events:none; overflow:visible; z-index:1000;
  }
  .pos-label-svg{
    font-family:"Nanum Pen Script", cursive;
    font-size:2rem;
    fill:#D288CA;
    dominant-baseline:middle;
    text-anchor:end;
  }

  .note{
    /* position:absolute; */
    left: calc(100% + 40px);
    top:50%;
    transform:translateY(-40%);
    color:#5a80c0;
    font-weight:900;
    font-size:2rem;
    font-family: "Nanum Pen Script", cursive;
  }

  .details-cont{
    position:absolute;
    top:0; right:0;
    margin-top:2%; margin-right:4%;
    z-index:1200; /* above the brace layer (1100) so the spotlight can dim it */
    text-align:center;
  }

  .details-btn{
    font-family:'Kumbh Sans', sans-serif;
    font-size:1.3rem;
    background-color:#F09D99;
    color:#874C47;
    border:none;
    padding:0.4rem;
    cursor:pointer;
  }

  .details-hint{
    font-family:"Nanum Pen Script", cursive;
    color:#558ABB;
    font-size:1.6rem;
    text-align:center;
  }

  .detail-note{
    position:absolute;
    max-width:14rem;
    color:#D288CA;
    font-weight:900;
    font-size:1.8rem;
    line-height:0.7;
    font-family:"Nanum Pen Script", cursive;
    text-align:center;
  }
  .detail-note-right{ transform:translateY(-50%); }
  .detail-note-left{ transform:translate(-100%, -50%); }

  /* "14th" position label in the SVG column: same highlight */
  .pos14-bg{ fill:#D288CA; }
  .pos-label-svg.pos14-svg{ fill:#FCD5D4; }

  /* "14th" in the positions note: purple highlight, pink text */
  .pos14{
    background:#D288CA;
    color:#FCD5D4;
    padding:0 .2em;
    border-radius:.2em;
  }

  .descPos1{
    font-family: "Nanum Pen Script", cursive;
    font-size:1.8rem;
    line-height: 0.7;   /* same spacing as the "More Details" notes */
    max-width: 14rem;
    text-align: center;
    color:#D288CA;   /* same purple as the position labels and the III band */
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

  .desc{ background:#874c47; color:#FDD4D4; font-size:1.1rem;
         padding:1rem; max-width:18rem; margin:1rem auto; text-align:center; }
  .descPos{ position:absolute; top:0; left:0; margin-top:3rem; margin-left:3rem; }
  /* stage narrower than 1100px (tablets): keep the box clear of the pile labels */
  :global(.cq-1100) .descPos{ margin-left:1rem; margin-top:1.5rem; }
  :global(.cq-1100) .desc{ max-width:10rem; font-size:.85rem; padding:.7rem; }

  .footer{ position:absolute; right:0; bottom:0; margin:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; }
</style>
