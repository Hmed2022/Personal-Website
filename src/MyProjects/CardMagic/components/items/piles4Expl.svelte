<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { get } from "svelte/store";
    import { crossfade, scale } from "svelte/transition";
    import { cycle3array, statuscard, resetKey } from "../../stores/misc.js";
    import Up from '../items/JustUpArrow.svelte'

    const dispatch = createEventDispatcher();
    function jumpToCards() {
      dispatch('goto', { y: 1, x: 0 });
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
    let showExplain = false;

    let dealEl;

    function playDeal() {
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
    $: if ($cycle3array?.length && leftPile.length === 0 && midPile.length === 0) {
      leftPile = $cycle3array.slice(0, 27).map((c, i) => ({ ...c, cycle3pos: i }));
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
        There's no trickery here — your choice was completely random, and no card
        was ever forced. The real secret: each round, slide the pile holding your
        card between the other two, subtly enough that no one notices. Do that
        three times, and your card lands exactly in the middle of the deck.
      </p>
    </header>

    <div class="row">
      <!-- Left: Pile 1 (full deck at start) -->
      <section class="pile">
        <div class="title">All Cards</div>
        <div class="stack">
          {#each leftPile as card, i (card.cycle3pos)}
            <div
              class="cardwrap"
              style="--i:{i}; --z:{1000 - i};"
              out:send={{ key: card.cycle3pos }}>
              <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
            </div>
          {/each}
        </div>
      </section>

      <!-- Middle: Drawn pile + count -->
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

      <!-- Right: Last card drawn -->
      <section class="reveal">
        <div class="badge">Your Card is :</div>
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
      </section>
    </div>

    <div class="bottom-row">
      <div class="controls">
        <button on:click={drawOne} disabled={count >= 14 || !leftPile.length}>Draw one</button>
        <button on:click={dealToFifteen} disabled={count >= 14 || dealing}>Deal to 14</button>
        <button on:click={reset}>Reset</button>
      </div>

      <div class="explain-box" class:visible={showExplain} aria-hidden={!showExplain}>
        Doesn’t matter if you deal from the top or the bottom — you always end up
        holding the middle card. In a 27-card pile, that’s always position 14.
      </div>
    </div>

  </main>
  {:else}
  <div class='else'> <p>
    Click the <b>Top Arrow or press</b>
    <Up enableKeyboard={false} on:tap={jumpToCards}/>
    <b>to jump</b> to the <b>Deck</b>,<br />
    And Reveal your card!
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
      gap: clamp(1rem, 4vh, 2.5rem);
      width: 100%;
      max-width: 1100px;
      padding: clamp(1rem, 4vh, 2rem) 2rem;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      color: #A34C49;
      box-sizing: border-box;
    }

    .header {
      text-align: center;
    }
    .header h1 {
      margin: 0 0 0.75rem;
      font-size: clamp(1.3rem, 4vh, 2rem);
      font-weight: bold;
    }
    .header p {
      margin: 0 auto;
      max-width: 42rem;
      font-size: clamp(0.9rem, 2.6vh, 1.3rem);
      font-weight: 300;
      line-height: 1.5;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: end;
      justify-items: center;
      gap: clamp(1rem, 4vh, 3rem);
    }

    .bottom-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: start;
      gap: clamp(1rem, 4vh, 3rem);
    }
    .controls {
      grid-column: 1 / span 2;
      justify-self: center;
    }
    .explain-box {
      grid-column: 3;
      justify-self: center;
    }

    @media (max-width: 900px) {
      .row {
        grid-template-columns: 1fr;
        justify-items: center;
      }
      .bottom-row {
        grid-template-columns: 1fr;
        justify-items: center;
        gap: 1.5rem;
      }
      .controls,
      .explain-box {
        grid-column: 1;
      }
    }

    .explain-box {
      max-width: 16rem;
      background: #874c47;
      color: #FDD4D4;
      font-size: clamp(0.85rem, 2.2vh, 1rem);
      line-height: 1.35;
      padding: clamp(0.6rem, 2.2vh, 1rem);
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
      font-size: clamp(1.1rem, 3.2vh, 1.8rem);
      font-weight: 700;
      margin-bottom: 1rem;

    }

    /* Pile stack area — controls card height; images follow width 130px */
    .stack {
      position: relative;
      width: clamp(110px, 15vw, 170px);      /* room for fanned overlap */
      height: clamp(180px, 34vh, 320px);     /* controls .card-front height (100%) */
    }
  
    /* wrapper that moves with crossfade */
    .cardwrap {
      position: absolute;
      inset: 0;
      transform: translateX(calc(var(--i) *8px)); /* slight horizontal fan */
      z-index: var(--z, 1);
      display: grid;
      place-items: center;
    }

    .cardwrap2 {
      position: absolute;
      inset: 0;
      transform: translateX(calc(var(--i) * 8px)); /* slight horizontal fan */
      z-index: var(--z, 1);
      display: grid;
      place-items: center;
    }
  
    /* Your card component sizing */
    .card-front {
      height: 100%;
      width: 100%;
      max-width: 130px;
      object-fit: contain;
      /* filter: drop-shadow(0 10px 14px rgba(0,0,0,.18)); */
    }
  
    /* Right-side reveal */
    .reveal {
      display: grid;
      grid-template-rows: auto 1fr;
      align-items: center;
      justify-items: center;
      gap: 0.5rem;
    }
    .badge {
      background: #A34C49;
      color: #fff;
      font-weight: 800;
      font-size: clamp(0.95rem, 2.6vh, 1.2rem);
      padding: .6rem 1rem;
      border-radius: 10px;
    }
    .bigcard-wrap {
      height: clamp(150px, 32vh, 300px);
      width: clamp(110px, 17vw, 210px);
      display: grid;
      place-items: center;
    }
    .bigcard-front {
      height: 100%;
      width: 80%;  
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
      gap: .75rem;
    }
    .controls button {
      padding: .6rem 1rem;
      border: 0;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      background: #A34C49;
      color: #fff;
    }
    .controls button[disabled] { opacity: .5; cursor: not-allowed; }
  </style>
  