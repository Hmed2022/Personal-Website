<script>
  // Mind mode, first slide: all 27 cards face up in a fan. The visitor picks one in
  // their head; a Mac-Dock-style magnifier makes each card readable under the
  // mouse (or finger). "I've got it!" unlocks → and starts the deal.
  import { onMount, createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';
  import { arrayCards, mindReady, resetKey } from '../../stores/misc.js';
  import { newDeck, getCardSrc } from '../../stores/deck.js';
  import { stageScale, rect, isTouchDevice } from '../../stores/layout.js';
  import { startSession } from '../../stores/db.js';

  const dispatch = createEventDispatcher();

  // a fresh, fairly shuffled deck on load and on every "play again".
  // Created right away (not in onMount): the cycle slides read it while they're built.
  if (!$arrayCards?.length) $arrayCards = newDeck();
  let lastSeenReset = -1;
  onMount(() => {
    lastSeenReset = get(resetKey);
    return resetKey.subscribe((v) => {
      if (v !== lastSeenReset) {
        lastSeenReset = v;
        $arrayCards = newDeck();
        pointerX = null;
      }
    });
  });

  $: cards = $arrayCards || [];

  // ---- Dock magnifier ----
  const MAX_EXTRA_SCALE = 0.45;  // hovered card grows to 1.45x
  const REACH = 2;               // how many card-widths the effect spreads over
  let fanEl;
  let fanWidth = 0;              // unscaled px (clientWidth ignores the stage transform)
  let cardWidth = 0;
  let pointerX = null;           // pointer position along the fan, unscaled px; null = idle

  function track(e) {
    const r = rect(fanEl);                       // unscaled
    pointerX = e.clientX / (get(stageScale) || 1) - r.left;
  }
  function onDown(e) {
    if (e.pointerType !== 'mouse') fanEl.setPointerCapture?.(e.pointerId);
    track(e);
  }
  function onMove(e) {
    if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) track(e);
  }
  function onEnd() { pointerX = null; }

  $: step = cards.length > 1 ? (fanWidth - cardWidth) / (cards.length - 1) : 0;
  $: looks = cards.map((_, i) => {
    if (pointerX == null || !cardWidth) return { scale: 1, lift: 0, z: i };
    const center = i * step + cardWidth / 2;
    const d = Math.abs(pointerX - center) / (cardWidth * REACH);
    const f = d >= 1 ? 0 : Math.cos(d * Math.PI / 2);      // 1 under the pointer -> 0 at the edge
    return { scale: 1 + MAX_EXTRA_SCALE * f, lift: f, z: f > 0 ? 100 + Math.round(f * 100) : i };
  });

  // 'fan' (Dock magnifier) or 'grid' (3 rows of 9, every card fully visible)
  let view = 'fan';
  function toggleView() {
    view = view === 'fan' ? 'grid' : 'fan';
    pointerX = null;
  }

  function gotIt() {
    $mindReady = true;
    startSession();                     // a new play starts here
    dispatch('goto', { y: 0, x: 1 });   // straight to the first deal
  }
</script>

<div class="mind">
  {#if view === 'fan'}
  <!-- touchstart/end stop here so dragging along the fan doesn't trigger a slide swipe -->
  <div
    class="fan"
    bind:this={fanEl}
    bind:clientWidth={fanWidth}
    on:pointerdown={onDown}
    on:pointermove={onMove}
    on:pointerup={onEnd}
    on:pointercancel={onEnd}
    on:pointerleave={onEnd}
    on:touchstart|stopPropagation
    on:touchend|stopPropagation
    role="list"
    aria-label="The 27 cards"
  >
    {#each cards as card, i (card.index)}
      <img
        class="card"
        role="listitem"
        src={getCardSrc(card)}
        alt={`${card.value} of ${card.suit}`}
        draggable="false"
        style="--i:{i}; --n:{cards.length}; --s:{looks[i]?.scale ?? 1}; --lift:{looks[i]?.lift ?? 0}; z-index:{looks[i]?.z ?? i};"
      />
    {/each}
    <!-- invisible box the size of one card, to know the card width in px -->
    <div class="measure" bind:clientWidth={cardWidth} aria-hidden="true"></div>
  </div>

  <p class="how">
    {isTouchDevice ? 'Slide your finger along the cards to see them up close.' : 'Move your mouse along the cards to see them up close.'}
  </p>
  {:else}
  <div class="grid" role="list" aria-label="The 27 cards">
    {#each cards as card (card.index)}
      <img class="grid-card" role="listitem" src={getCardSrc(card)} alt={`${card.value} of ${card.suit}`} draggable="false" />
    {/each}
  </div>
  {/if}

  <button type="button" class="view-toggle" on:click={toggleView}>
    {view === 'fan' ? 'Show all cards' : 'Back to the fan'}
  </button>

  <button type="button" class="got-it" on:click={gotIt}>I've got it!</button>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .mind {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Kumbh Sans', sans-serif;
    color: #5B4E88;
  }

  /* same footprint as the pick-mode spread; sizes in em follow the slide's fluid base */
  .fan {
    position: relative;
    width: 100%;
    max-width: 42.5em;
    height: 17em;                /* headroom so the magnified card never reaches the text */
    touch-action: none;          /* finger drags magnify instead of scrolling */
    cursor: zoom-in;
    user-select: none;
  }

  .card {
    position: absolute;
    top: 5.5em;
    left: calc(var(--i) / (var(--n) - 1) * (100% - 6.5em));
    width: 6.5em;
    height: 10em;
    object-fit: contain;
    transform-origin: 50% 100%;
    transform: translateY(calc(var(--lift) * -.9em)) scale(var(--s));
    transition: transform .14s ease-out;
    will-change: transform;
  }

  .measure { position: absolute; width: 6.5em; height: 0; visibility: hidden; }

  .how {
    margin: .2em 0 0;
    font-size: .9em;
    opacity: .8;
  }

  /* option B: 3 rows of 9, every card fully visible */
  .grid {
    display: grid;
    grid-template-columns: repeat(9, 4em);
    gap: .45em .4em;
    justify-content: center;
    margin: .6em 0 .2em;
  }
  .grid-card {
    width: 4em;
    height: 6.15em;
    object-fit: contain;
    transition: transform .12s ease-out;
  }
  .grid-card:hover { transform: scale(1.12); }

  .view-toggle {
    margin-top: .5em;
    font-family: inherit;
    font-size: .85em;
    font-weight: 700;
    color: #5B4E88;
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
  }

  .got-it {
    margin-top: 1em;
    font-family: inherit;
    font-size: 1.4em;
    font-weight: 700;
    color: #5B4E88;
    background: #E5DEFF;
    border: none;
    border-radius: .5em;
    padding: .45em 1.1em;
    cursor: pointer;
    transition: transform .15s;
  }
  .got-it:hover, .got-it:focus-visible { transform: scale(1.05); }
</style>
