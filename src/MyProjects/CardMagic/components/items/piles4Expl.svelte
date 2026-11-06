<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { get } from "svelte/store";
    import { crossfade, scale, fade } from "svelte/transition";
    import { cycle3array, cycle2array, cycle1array, arrayCards, statuscard, lockedCard, resetKey } from "../../stores/misc.js";
    import { isTouchDevice } from "../../stores/layout.js";
    import Up from '../items/JustUpArrow.svelte'

    const dispatch = createEventDispatcher();

    // "The secret": how the possible positions shrink (27 -> 9 -> 3 -> 1).
    // from/to are 0-based positions; each row links to the math slide that shows it.
    const funnelRows = [
      { count: 27, from: 0,  to: 26, x: 0, slide: 'Pick a card' },
      { count: 9,  from: 9,  to: 17, x: 3, slide: 'Gathering I' },
      { count: 3,  from: 12, to: 14, x: 5, slide: 'Gathering II' },
      { count: 1,  from: 13, to: 13, x: 7, slide: 'Gathering III' },
    ];

    // First the explanation (funnel), then "See it with your cards" shows the dealing
    let view = 'funnel';

    // Small summary pills under the funnel (each links to the math slide that shows it)
    const funnelSteps = [
      { count: 27, where: 'anywhere',        x: 0, slide: 'Pick a card' },
      { count: 9,  where: 'positions 10–18', x: 3, slide: 'Gathering I' },
      { count: 3,  where: 'positions 13–15', x: 5, slide: 'Gathering II' },
      { count: 1,  where: 'position 14',     x: 7, slide: 'Gathering III' },
    ];

    // Tooltips: which card sat at each position at each stage
    // (row 27 = starting order, then the order after deal 1, 2 and 3)
    const NAMES = { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' };
    const cardName = (c) => (c ? `${NAMES[c.value] ?? c.value} of ${c.suit}` : '');
    $: stageOrders = [
      [...($arrayCards || [])].sort((a, b) => a.index - b.index),
      [...($cycle1array || [])].sort((a, b) => a.cycle1pos - b.cycle1pos),
      [...($cycle2array || [])].sort((a, b) => a.cycle2pos - b.cycle2pos),
      [...($cycle3array || [])].sort((a, b) => a.cycle3pos - b.cycle3pos),
    ];
    function tip(r, i) {
      const c = stageOrders[r]?.[i];
      if (!c) return `Position ${i + 1}`;
      return `Position ${i + 1} · ${cardName(c)}${c.selected ? ' (your card)' : ''}`;
    }
    function jumpToCards() {
      dispatch('goto', { y: 0, x: 0 }); // the magic "Pick a card" slide
    }
    // If you need to force-bundle assets, keep this import:
  
    // Your helper
    function getCardSrc(card) {
      if (!card) return "";
      const fileSuit = { Clubs: "club", Diamonds: "diam", Hearts: "heart", Spades: "spade" };
      return `/assets/CardMagic/Cards2PNG/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }
  
    const [send, receive] = crossfade({ duration: 300, fallback: scale });
  
    let leftPile = [];
    let midPile = [];
    let lastCard = null;
    const SR_NAMES = { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' };
    const srName = (c) => (c ? `${SR_NAMES[c.value] ?? c.value} of ${c.suit}` : '');
    let showExplain = false;

    let dealEl;

    function playDeal() {
      if (isTouchDevice) return; // iOS lags rapid sounds: skip on phones
    if (!dealEl) return;
    try {
      dealEl.pause();                 // make re-triggers snappy
      dealEl.currentTime = 0;
      const p = dealEl.play();
      p?.catch(() => {});            // ignore autoplay promise errors
    } catch {}
  }
  
    $: count = midPile.length;
  
    // Initialize from your store (first 27 cards; ensure index 0..26)
    // Reload whenever a NEW final order arrives (a new play), not only when empty:
    // otherwise a replay could keep dealing the previous play's cards.
    let seededFrom = null;
    $: if ($cycle3array?.length && $cycle3array !== seededFrom) {
      seededFrom = $cycle3array;
      view = 'funnel';                 // every new play starts with the explanation
      leftPile = $cycle3array.slice(0, 27).map((c, i) => ({ ...c, cycle3pos: i }));
      midPile = [];
      lastCard = null;
      showExplain = false;
    }
  
    async function drawOne() {
      if (!leftPile.length || midPile.length >= 14) return;
      playDeal();
      const card = leftPile[0];
      leftPile = leftPile.slice(1);
      midPile = [...midPile, card];
      lastCard = card;
    }
  
    let dealing = false;
    async function dealToFifteen() {
      if (dealing) return;
      dealing = true;
      showExplain = true;
      while (midPile.length < 14 && leftPile.length) {
        drawOne();
        await new Promise(r => setTimeout(r, 250));
      }
      dealing = false;
    }
  
    // Manual "Reset" button: re-shuffle back to the full 27-card deal for
    // the *current* pick, so the user can redo Draw/Deal without picking a
    // new card. Safe to read $cycle3array here — nothing else is mutating
    // it concurrently when this is a deliberate in-place click.
    function reset() {
      if ($cycle3array?.length) {
        leftPile = $cycle3array.slice(0, 27).map((c, i) => ({ ...c, cycle3pos: i }));
      } else {
        leftPile = [];
      }
      midPile = [];
      lastCard = null;
      showExplain = false;
    }

    // Hard-clear only — never re-seed leftPile from $cycle3array here. This
    // runs off the shared resetKey, whose subscriber order relative to
    // cards.svelte's own hardReset() isn't guaranteed, so $cycle3array may
    // still hold the *previous* pick's data at this exact instant. Clearing
    // both leftPile and midPile to empty lets the dedicated reactive block
    // above (`$cycle3array?.length && leftPile.length === 0 && ...`) do the
    // seeding once a genuinely new $cycle3array arrives.
    function hardClear() {
      leftPile = [];
      midPile = [];
      lastCard = null;
      showExplain = false;
    }

    // Reset this pile's local state whenever the app-wide reset fires (e.g.
    // picking a new card from the End screen), so a stale drawn pile / a
    // stale revealed card don't linger when this slide is revisited.
    let lastSeenReset = -1;
    onMount(() => {
      lastSeenReset = get(resetKey);
      const unsub = resetKey.subscribe((v) => {
        if (v !== lastSeenReset) {
          lastSeenReset = v;
          view = 'funnel';
          hardClear();
        }
      });
      return unsub;
    });
  </script>

<audio src="/assets/CardMagic/deal.ogg"      bind:this={dealEl} preload="auto" />
{#if $statuscard}
  <main class="stage">

    <header class="header">
      <h1><u>Revealing Your Card</u></h1>
      <p>
        There's no trickery here! Your choice was completely random, and no card
        was ever forced. The real secret: after each deal, <b>slide the pile holding your
        card between the other two</b>, subtly enough that no one notices. Do that
        three times, and your card lands exactly in the middle of the deck.
      </p>

    </header>

    <!-- Funnel and dealing share one grid cell, so cross-fading them doesn't jump -->
    <div class="swap">
    {#if view === 'funnel'}
      <section class="secret" in:fade={{ duration: 350, delay: 250 }} out:fade={{ duration: 250 }}>
        <p class="secret-title">Every answer cuts the suspects by 3</p>

        <div class="steps" aria-label="How the possible positions of your card shrink">
          {#each funnelSteps as step, i}
            {#if i > 0}<span class="arrow" aria-hidden="true">→</span>{/if}
            <button type="button" class="step" class:last={i === funnelSteps.length - 1}
                    title={`Go to ${step.slide}`}
                    on:click={() => dispatch('goto', { y: 1, x: step.x })}>
              <b>{step.count}</b> {step.count === 1 ? 'card' : 'cards'}<small>{step.where}</small>
            </button>
          {/each}
        </div>

        <div class="rows">
          <div class="pos-head" aria-hidden="true">
            <span class="count"></span>
            <span class="squares">{#each Array(27) as _, i}<span class="pos-num">{i + 1}</span>{/each}</span>
          </div>
          {#each funnelRows as row, r}
            <button type="button" class="row" style="--r:{r}" title={`Go to ${row.slide}`}
                    on:click={() => dispatch('goto', { y: 1, x: row.x })}>
              <span class="count">{row.count}</span>
              <span class="squares" aria-hidden="true">
                {#each Array(27) as _, i}
                  <span class="sq" class:on={i >= row.from && i <= row.to} class:mine={stageOrders[r]?.[i]?.selected} data-tip={tip(r, i)}></span>
                {/each}
              </span>
            </button>
          {/each}
        </div>


        <p class="why">
          <b>3 × 3 × 3 = 27.</b> Three questions with three answers each can tell apart exactly
          27 cards. Putting your pile in the middle pushes your card to position 14.
        </p>

        <button type="button" class="see" on:click={() => (view = 'deal')}>See it with your cards →</button>
      </section>
    {:else}
      <div class="dealview" in:fade={{ duration: 350, delay: 250 }} out:fade={{ duration: 250 }}>
        <button type="button" class="back-link" on:click={() => (view = 'funnel')}>← Back to the explanation</button>
        <!-- Left column: the two piles + controls. Right column: the reveal, stacked. -->
        <div class="board">
          <div class="left">
            <div class="piles">
              <!-- Pile 1 (full deck at start) -->
              <section class="pile">
                <div class="title">All Cards</div>
                <div class="stack">
                  {#each leftPile as card, i (card.cycle3pos)}
                    <div
                      class="cardwrap"
                      style="--i:{i}; --z:{1000 - i};"
                      out:send={{ key: card.cycle3pos, ...(isTouchDevice ? { duration: 0 } : {}) }}>
                      <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
                    </div>
                  {/each}
                </div>
              </section>

              <!-- Drawn pile + count -->
              <section class="pile">
                <div class="title">Count: {count}</div>
                <div class="stack">
                  {#each midPile as card, i (card.cycle3pos)}
                    <div
                      class="cardwrap2"
                      style="--i:{i}; --z:{1000 + i};"
                      in:receive={{ key: card.cycle3pos }}>
                      <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
                    </div>
                  {/each}
                </div>
              </section>
            </div>

            <div class="controls">
              <button on:click={drawOne} disabled={count >= 14 || !leftPile.length}>Draw one</button>
              <button on:click={dealToFifteen} disabled={count >= 14 || dealing}>Deal to 14</button>
              <button on:click={reset}>Reset</button>
            </div>
          </div>

          <!-- Last card drawn + explanation -->
          <section class="reveal">
            <div class="badge">Your Card is :</div>
            <p class="sr-only" aria-live="polite">{count === 14 && lastCard ? `Your card is the ${srName(lastCard)}` : ''}</p>
            <div class="bigcard-wrap">
              {#if lastCard}
                <img
                  class="bigcard-front"
                  src={getCardSrc(lastCard)}
                  alt={`Card ${lastCard.value} of ${lastCard.suit}`}
                  in:receive={{ key: lastCard.cycle3pos }} />
              {:else}
                <div class="bigcard placeholder"></div>
              {/if}
            </div>

            <div class="explain-box" class:visible={showExplain} aria-hidden={!showExplain}>
              Doesn’t matter if you deal from the top or the bottom — you always end up
              holding the middle card. In a 27-card pile, that’s always position 14.
            </div>
          </section>
        </div>
      </div>
    {/if}
    </div>

  </main>
  {:else}
  <div class='else'> <p>
    Click the <b>Top Arrow or press</b>
    <Up enableKeyboard={false} on:tap={jumpToCards}/>
    <b>to jump</b> to the <b>Deck</b>,<br />
    {$lockedCard ? 'press “Lock it in!” on the card you clicked,' : 'pick a card,'} then reveal it!
  </p> </div>
{/if}
 
  
  <style>

    .else{
  min-height: 100%;          /* give it vertical space */
  display: grid;             /* easy centering */
  place-items: center;       /* center both axes */
  text-align: center;
  font-size: 2rem;
  font-family: 'Kumbh Sans', sans-serif;
  color: #A34C48;
}

    .stage {
      display: flex;
      flex-direction: column;
      /* one fluid base size; everything below is in em so the whole slide
         grows on big screens instead of floating small in the middle */
      font-size: clamp(14px, calc(0.55cqw + 0.85cqh), 26px);
      gap: 1.1em;
      width: 100%;
      max-width: 62em;
      padding: 1.2em 2em;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      color: #A34C49;
      box-sizing: border-box;
    }

    .header {
      text-align: center;
      margin-bottom: 1.5em;   /* more room between the explanation and the cards */
    }
    .header h1 {
      margin: 0 0 0.5em;
      font-size: 1.6em;
      font-weight: bold;
    }
    .header p {
      margin: 0 auto;
      max-width: 34em;
      font-size: 1.3em;
      font-weight: 300;
      line-height: 1.5;
    }


    .board {
      display: grid;
      grid-template-columns: 2fr 1fr;
      align-items: start;
      gap: 2.5em;
    }
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5em;
    }
    .piles {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-items: center;
      align-items: end;
      width: 100%;
    }

    /* stage narrower than 900px (see cq-* classes in Demo.Slider) */
    :global(.cq-900) .board { grid-template-columns: 1fr; justify-items: center; }

    .explain-box {
      max-width: 17em;
      background: #874c47;
      color: #FDD4D4;
      font-size: .9em;
      line-height: 1.35;
      padding: .9em;
      border-radius: 10px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .explain-box.visible {
      opacity: 1;
    }
  
    .pile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
    }
    .title {
      font-size: 1.35em;
      font-weight: 700;
      margin-bottom: .8em;

    }

    /* Pile stack area — controls card height; images follow width 130px */
    .stack {
      position: relative;
      width: 9em;      /* room for fanned overlap */
      height: 15em;    /* controls .card-front height (100%) */
    }
  
    /* wrapper that moves with crossfade */
    .cardwrap {
      position: absolute;
      inset: 0;
      transform: translateX(calc(var(--i) * .45em)); /* slight horizontal fan */
      z-index: var(--z, 1);
      display: grid;
      place-items: center;
    }

    .cardwrap2 {
      position: absolute;
      inset: 0;
      transform: translateX(calc(var(--i) * .45em)); /* slight horizontal fan */
      z-index: var(--z, 1);
      display: grid;
      place-items: center;
    }
  
    /* Your card component sizing */
    .card-front {
      height: 100%;
      width: 100%;
      max-width: 7.5em;
      object-fit: contain;
      /* filter: drop-shadow(0 10px 14px rgba(0,0,0,.18)); */
    }
  
    /* Right column: badge, card, explanation stacked (never overlapping) */
    .reveal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .75em;
    }
    .badge {
      background: #A34C49;
      color: #fff;
      font-weight: 800;
      font-size: 1em;
      padding: .4em .8em;
      border-radius: 10px;
    }
    .bigcard-wrap {
      height: 14em;
      aspect-ratio: 2 / 3;
      display: grid;
      place-items: center;
    }
    .bigcard-front {
      height: 100%;
      width: 100%;
      object-fit: contain;                         /* bigger reveal */
      /* filter: drop-shadow(0 12px 16px rgba(0,0,0,.22)); */
    }
    .bigcard.placeholder {
      height: 100%;
      width: auto;
      border-radius: 28px;
      /* background: rgba(0,0,0,.06); */
    }
    .controls {
      display: flex;
      gap: .75em;
    }
    .controls button {
      font-size: .9em;
      padding: .6em 1.1em;
      border: 0;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      background: #A34C49;
      color: #fff;
    }
    .controls button[disabled] { opacity: .5; cursor: not-allowed; }
  
    /* ---- "The secret": funnel first, dealing after the button ---- */
    .swap { display: grid; }
    .swap > * { grid-area: 1 / 1; }

    .secret { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .secret-title { margin: 0 0 1em; font-size: 1.5em; font-weight: 800; line-height: 1.2; }

    .rows { display: flex; flex-direction: column; gap: .55em; }
    .row {
      display: flex; align-items: center; gap: .8em;
      border: none; background: none; padding: .15em .3em; border-radius: .4em;
      font-family: inherit; font-size: inherit; color: inherit; cursor: pointer;   /* same em as the numbers row */
      opacity: 0; animation: rowIn .45s ease-out forwards;
      animation-delay: calc(var(--r) * .35s + .3s);
    }
    .row:hover, .row:focus-visible { background: rgba(163, 76, 73, .08); }
    .count { width: 1.8em; text-align: right; font-weight: 800; font-size: 1em; }
    .squares { display: grid; grid-template-columns: repeat(27, 1em); gap: .18em; }
    /* three steps from the math row's palette: unlit / lit / your card */
    .sq { width: 1em; height: 1.35em; border-radius: .2em; background: #F7C6C3; }
    .sq.on { background: #D47D79; }                                 /* coral, as the math arrow keys */
    /* the visitor's card, at its position in each row (darker shade of the same colour) */
    .sq.mine { background: #874C47; box-shadow: 0 0 0 .15em rgba(135, 76, 71, .3); }  /* dark, as the explanation boxes */
    @keyframes rowIn { from { opacity: 0; transform: translateY(.4em); } to { opacity: 1; transform: none; } }

    /* position numbers 1-27 above the columns */
    .pos-head { display: flex; align-items: flex-end; gap: .8em; padding: 0 .3em; margin-bottom: -.2em; }
    /* same grid as the squares below; each number is centred in its column */
    .pos-num { justify-self: center; font-size: .55em; font-weight: 700; opacity: .75; }

    /* tooltip: which card was at this position at this stage */
    .sq { position: relative; }
    .sq:hover::after {
      content: attr(data-tip);
      position: absolute; bottom: calc(100% + .45em); left: 50%; transform: translateX(-50%);
      white-space: nowrap; z-index: 5; pointer-events: none;
      background: #3D1F1D; color: #FDD4D4;
      font-size: .8em; font-weight: 700; padding: .35em .6em; border-radius: .4em;
      box-shadow: 0 4px 10px rgba(0, 0, 0, .25);
    }
    .sq:hover { outline: 2px solid #3D1F1D; outline-offset: 1px; }

    /* summary pills under the funnel */
    .steps { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: .5em; margin: 0 0 1.2em; }
    .step {
      display: flex; flex-direction: column; align-items: center;
      background: #F9BEBA; border: none; border-radius: .6em;
      padding: .35em .95em; font-family: inherit; color: inherit; font-size: 1.02em; line-height: 1.2;
      cursor: pointer; transition: transform .15s, filter .15s;
    }
    .step:hover, .step:focus-visible { transform: translateY(-2px); filter: brightness(1.05); }
    .step b { font-size: 1.3em; }
    .step small { font-size: .82em; opacity: .9; }
    .arrow { font-weight: 700; font-size: 1.2em; }
    .step.last { background: #A34C49; color: #FDD4D4; }
    .why { max-width: 32em; margin: 1.1em 0 1.2em; line-height: 1.5; font-size: 1em; }
    .see {
      font-family: inherit; font-weight: 800; font-size: 1.05em;
      color: #FDD4D4; background: #874C47;
      border: none; border-radius: .7em; padding: .75em 1.6em; cursor: pointer;
      transition: transform .15s;
    }
    .see:hover, .see:focus-visible { transform: scale(1.04); }

    .dealview { display: flex; flex-direction: column; }
    /* the key instruction in the intro (a global style resets <b> to normal weight) */
    .header p b { font-weight: 700; }

    .back-link {
      align-self: center; margin: 0 0 .6em;
      border: none; background: none; padding: 0;
      font-family: inherit; font-size: .9em; font-weight: 700; color: #A34C49;
      text-decoration: underline; cursor: pointer;
    }
</style>
  