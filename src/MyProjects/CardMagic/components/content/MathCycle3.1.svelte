<script>
  import { onMount, onDestroy, tick } from 'svelte';
  const browser = typeof window !== 'undefined';
  import { arrayCards, statuscard, cycle2array } from '../../stores/misc.js';
  import Arrow from '../items/Arrow.svelte';
  import Up from '../items/JustUpArrow.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  function jumpToCards() {
    dispatch('goto', { y: 1, x: 0 });
  }

  let showDetails = false;
  function toggleDetails() {
    showDetails = !showDetails;
    // force a fresh layout re-measure once the DOM/crossfade has settled
    setTimeout(invalidate, 350);
  }

  let detailNote;

  let rows = [];

  // Get selected card's cycle1 and cycle2 piles
  const getSelectedCycle1Pile = () => {
    for (const row of rows) for (const card of row) if (card.selected) return card.cycle1pile;
    return null;
  };
  const getSelectedCycle2Pile = () => {
    for (const row of rows) for (const card of row) if (card.selected) return card.cycle2pile;
    return null;
  };

  const inCycle1 = (card) => {
    const sel = getSelectedCycle1Pile();
    return sel != null && card.cycle1pile === sel;
  };
  const inCycle2 = (card) => {
    const sel = getSelectedCycle2Pile();
    return sel != null && card.cycle2pile === sel;
  };

  // build 9 rows × 3 cols from the store (Cycle 3 view uses cycle2array)
  $: if ($statuscard) {
    rows = Array.from({ length: 9 }, (_, i) => $cycle2array.slice(i * 3, i * 3 + 3));
  } else {
    rows = [];
  }

  function DisplayValue(v) {
    if (v === 11) return 'Jack';
    if (v === 12) return 'Queen';
    if (v === 13) return 'King';
    if (v === 1) return 'Ace';
    return v;
  }
  function DisplaySuit(s) {
    if (s === 'Hearts') return '♥';
    if (s === 'Diamonds') return '♦';
    if (s === 'Clubs') return '♣';
    if (s === 'Spades') return '♠';
    return s;
  }

  // arrow wiring
  let selectedEl = null;
  let note;
  let board;
  const elMap = new Map();
  let layoutVersion = 0;
  const invalidate = () => { layoutVersion += 1; };

  function collect(node, card) {
    elMap.set(card.index, node);
    if (card.selected) selectedEl = node;
    queueMicrotask(invalidate);
    return {
      update(newCard) {
        if (newCard.index !== card.index) {
          elMap.delete(card.index);
          elMap.set(newCard.index, node);
        }
        if (newCard.selected) selectedEl = node;
        else if (!newCard.selected && selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      },
      destroy() {
        elMap.delete(card.index);
        if (selectedEl === node) selectedEl = null;
        queueMicrotask(invalidate);
      }
    };
  }

  // the three cards matching both cycle-1 and cycle-2 piles, for the details arrows
  let bothEls = [];
  $: {
    layoutVersion;
    bothEls = rows.flat()
      .filter((c) => inCycle1(c) && inCycle2(c))
      .map((c) => elMap.get(c.index))
      .filter(Boolean);
  }

  // -------- settle timing: re-measure once fonts/layout are done --------
  let ro;
  function onWinResize() { invalidate(); }

  onMount(async () => {
    if (!browser) return;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => invalidate());
      [document.documentElement, board].forEach((el) => el && ro.observe(el));
    }
    window.addEventListener('resize', onWinResize);

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
    <div class="details-cont">
      <button class="details-btn" on:click={toggleDetails}>
        {showDetails ? 'Less Details!' : 'More Details!'}
      </button>
      <div class="details-hint">click me!</div>
    </div>

    <header class="header">
      <h1><u>The Third Cycle</u></h1>
      <div class="header-text">
        {#if !showDetails}
          <p in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
            Let's have a look at the cards inside the piles. <br />Here's where your card went.
          </p>
        {:else}
          <p class="detail-text" bind:this={detailNote} in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
            Since these cards were in consecutive positions right in the middle
            of the whole deck, dividing it into three piles means we can be
            confident that each one is now the middle card of its own pile.
          </p>
        {/if}
      </div>
    </header>

    <div class="container" bind:this={board}>
      {#each rows as row}
        <div class="row">
          {#each row as card}
            <div
              class="rectangle
                     {card.selected ? 'selected' : ''}
                     {inCycle1(card) && inCycle2(card) ? 'in-both'
                       : inCycle2(card) ? 'in-c2'
                       : inCycle1(card) ? 'in-c1' : ''}"
              use:collect={card}
            >
              {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
            </div>
          {/each}
        </div>
      {/each}

      {#if !showDetails && selectedEl && note}
        <Arrow
          mode="container"
          container={board}
          fromEl={selectedEl}
          toEl={note}
          fromAnchor="right"
          toAnchor="top"
          headAt="start"
          curvature={0.22}
          bulge={0.16}
          bulgeDir="up"
          width={4}
          color="#5a80c0"
          version={layoutVersion}
        />
      {/if}

      {#if showDetails && detailNote}
        {#each bothEls as el, i (i)}
          {#if el}
            {#key layoutVersion}
              <Arrow
                mode="container"
                container={board}
                fromEl={detailNote}
                toEl={el}
                fromAnchor="bottom"
                toAnchor="top"
                headAt="end"
                curvature={0.15}
                bulge={0.12}
                bulgeDir="down"
                width={4}
                color="#55993D"
              />
            {/key}
          {/if}
        {/each}
      {/if}
    </div>

    <div class="note" class:note-hidden={showDetails} bind:this={note}>The Selected card</div>

    <div class="footer"></div>
    <div class="footer2"><p>Division III</p></div>
  {:else}
    <div class='else'>
      <p>
        Click the <b>Top Arrow or press</b>
        <Up enableKeyboard={false} on:tap={jumpToCards}/>
        <b>to jump</b> to the <b>Cards</b>
        and pick one!
      </p>
    </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .body:has(.else) { justify-content: center;  text-align: center; }
  .else{ font-size: 2rem;  font-family: 'Kumbh Sans', sans-serif; color: #A34C48; }

  .body{
    height:100%; background:#FDD4D4;
    display:flex; flex-direction:column; align-items:center; justify-content:space-between;
    font-family:'Kumbh Sans',sans-serif; color:#A34C48;
  }

  .details-cont{
    position:absolute;
    top:0; right:0;
    margin-top:2%; margin-right:4%;
    z-index:1000;
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

  .header{ text-align:center; margin-top:4rem; height:9rem; width:100%; }
  .header h1{ position:absolute; margin-top:3rem; margin-left:5rem; font-size:2rem; font-weight:bold; left:0; top:0; }
  .header-text{ position:relative; height:100%; }
  .header p{
    position:absolute; top:1rem; left:0; right:0;
    margin:0; font-size:2rem; font-weight:300;
  }
  .header p.detail-text{
    font-family:"Nanum Pen Script", cursive;
    font-size:1.9rem;
    font-weight:700;
    color:#55993D;
    max-width:56rem;
    top:1.4rem;
    margin-left:auto; margin-right:auto;
  }

  .container{
    position:relative;                       /* needed for Arrow mode="container" */
    display:flex; flex-direction:column-reverse;
    gap:10px; width:75%; align-items:center;
  }

  .row{ display:flex; justify-content:center; gap:2%; width:100%; }

  .note{
    color:#5a80c0; font-weight:900; font-size:2rem; font-family:"Nanum Pen Script", cursive;
    opacity:1; transition:opacity .2s;
  }
  .note.note-hidden{ opacity:0; }

  .rectangle{
    position:relative;                        /* for the right caps (::before/::after) */
    flex:1; max-width:27%; aspect-ratio:8 / 1;
    background:#F09D99;                       /* base pink */
    display:flex; align-items:center; justify-content:center;
    font-weight:bold; color:#fff; text-align:center;
    border-radius:6px; overflow:hidden;       /* keep caps rounded */
    transition:transform .2s ease;
  }

  /* ── CYCLE 1 ONLY: pink → blue (last 10%), blue cap with “I” ───────────── */
  .rectangle.in-c1:not(.in-both){
    background: linear-gradient(to right, #F09D99 0 90%, #558ABB 90% 100%);
  }
  .rectangle.in-c1:not(.in-both)::after{
    content:"I";
    position:absolute; right:0; top:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }

  /* ── CYCLE 2 ONLY: pink → green (last 10%), green cap with “II” ────────── */
  .rectangle.in-c2:not(.in-both){
    background: linear-gradient(to right, #F09D99 0 90%, #55993D 90% 100%);
  }
  .rectangle.in-c2:not(.in-both)::after{
    content:"II";
    position:absolute; right:0; top:0;
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }

  /* ── BOTH: pink → green (80–90%) → blue (90–100%)
         green cap shows “II”, blue cap shows “I” ─────────────────────────── */
  .rectangle.in-both{
    background: linear-gradient(
      to right,
      #F09D99 0 80%,
      #55993D 80% 90%,
      #558ABB 90% 100%
    );
  }
  /* green band marker (II) */
  .rectangle.in-both::before{
    content:"II";
    position:absolute; right:10%; top:0;           /* sits over the 80–90% band */
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }
  /* blue band marker (I) */
  .rectangle.in-both::after{
    content:"I";
    position:absolute; right:0; top:0;             /* sits over 90–100% band */
    width:10%; height:100%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900;
    pointer-events:none;
  }

  /* Optional: emphasize the selected card but keep its caps/gradients */
  .rectangle.selected{
    /* outline: 3px solid #5a80c0;
    outline-offset: -3px; */
    color:#A34C48;
  }

  .footer{ margin-bottom:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; }
  .footer2{ position:absolute; margin-right:4rem; margin-bottom:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; right:0; bottom:0; }
</style>
