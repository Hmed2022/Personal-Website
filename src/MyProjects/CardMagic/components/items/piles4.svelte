<script>
    import { onMount, tick, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    // "Yes!" under "Is this your card?" -> the end slide ("That's the trick!")
    const goToEnd = () => dispatch("goto", { y: 0, x: 5 });
    import { get } from "svelte/store";
    import { crossfade, scale } from "svelte/transition";
    import { cycle3array, reveal, resetKey } from "../../stores/misc.js";
    import { logEvent } from "../../stores/db.js";
    import { isTouchDevice } from "../../stores/layout.js";
    import cardback from '../../svg/Cards_png/back.png'
    // If you need to force-bundle assets, keep this import:
  
    // Your helper
    function getCardSrc(card) {
      if (!card) return "";
      const fileSuit = { Clubs: "club", Diamonds: "diam", Hearts: "heart", Spades: "spade" };
      return `/assets/CardMagic/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }

  
    const [send, receive] = crossfade({ duration: 300, fallback: scale });
  
    let leftPile = [];
    let midPile = [];
    let lastCard = null;
  
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
      $reveal = true;
      if (dealing) return;
      dealing = true;
      while (midPile.length < 14 && leftPile.length) {
        drawOne();
        await new Promise(r => setTimeout(r, 250));
      }
      dealing = false;
    }
  
    // Replay the reveal: put every card back in the deck and deal to 14 again.
    // (Safe to re-seed here: it only runs from the button, with the current
    // pick's $cycle3array — unlike reset() below, which races resetKey.)
    async function revealAgain() {
      if (dealing) return;
      leftPile = [];
      midPile = [];
      lastCard = null;
      revealFlipped = false;
      await tick();                                  // reactive block re-seeds leftPile
      await new Promise((r) => setTimeout(r, 450));  // let the big card flip back first
      dealToFifteen();
    }

    // Hard-clear only — never re-seed leftPile from $cycle3array here. This
    // runs off the shared resetKey, whose subscriber order relative to
    // cards.svelte's own hardReset() isn't guaranteed, so $cycle3array may
    // still hold the *previous* pick's data at this exact instant. Clearing
    // both leftPile and midPile to empty lets the dedicated reactive block
    // above (`$cycle3array?.length && leftPile.length === 0 && ...`) do the
    // seeding once a genuinely new $cycle3array arrives — that guarantees
    // fresh data instead of racing to read the store early.
    function reset() {
      leftPile = [];
      midPile = [];
      lastCard = null;
      revealFlipped = false;
      $reveal = false;
    }

    // Reset this pile's local state whenever the app-wide reset fires (e.g.
    // picking a new card from the End screen), so stale drawn piles / a
    // stale revealed card don't linger when this slide is revisited.
    let lastSeenReset = -1;
    onMount(() => {
      lastSeenReset = get(resetKey);
      const unsub = resetKey.subscribe((v) => {
        if (v !== lastSeenReset) {
          lastSeenReset = v;
          reset();
        }
      });
      return unsub;
    });

    import facedown from "../../svg/Cards_png/back.png"; // back image
  let flipEl;  
  let dealEl;                   
  let revealFlipped = false;       // controls the flip of the right card

    // flip automatically when we've dealt 15
    // flip automatically when we've dealt 15
  $: if (count === 14 && lastCard && !revealFlipped) {
    setTimeout(() => {
      revealFlipped = true;
      logEvent('finished', null, { once: true });

      if (flipEl) {
        try {
          flipEl.pause?.();           // ok to use ?. on a call
          flipEl.currentTime = 0;     // guarded assignment ✅
          const p = flipEl.play();
          p?.catch(() => {});          // avoid unhandled promise error
        } catch {}
      }
    }, 250);
  }
  $: lastIndex = midPile.length - 1;

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
  </script>


<audio src="/assets/CardMagic/flipcard.wav" bind:this={flipEl} preload="auto" />
<audio src="/assets/CardMagic/deal.ogg"      bind:this={dealEl} preload="auto" />

  <div class="reveal-text" class:visible={revealFlipped}>
    <p class="question">Is this <span class="first">your card</span>?</p>
    <p class="joke">Of course it is. Nothing was left to chance...</p>
    <!-- always in the layout (hidden with the rest of .reveal-text until the flip),
         so the cards below don't drop down when it appears -->
    <button class="yes-btn" on:click={goToEnd} tabindex={revealFlipped ? 0 : -1}>Yes!</button>
  </div>

  <main class="stage">
    <!-- Left: Pile 1 (full deck at start) -->
    <section class="pile">
      <div class="title">All cards</div>
      <div class="stack">
        {#each leftPile as card, i (card.cycle3pos)}
          <div
            class="cardwrap"
            style="--i:{i}; --z:{1000 - i};"
            out:send={{ key: card.cycle3pos, ...(isTouchDevice ? { duration: 0 } : {}) }}>
            <img class="card-front" src={cardback} alt={`Card ${card.value} of ${card.suit}`} />
          </div>
        {/each}
      </div>
    </section>
  
    <!-- Middle: Drawn pile + count -->
    <section class="pile">
        <div class="title">Final Pile</div>
        <div class="stack with-perspective">
          {#each midPile as card, i (card.cycle3pos)}
            <div
              class="cardwrap2"
              style="--i:{i}; --z:{1000 + i};"
              in:receive={{ key: card.cycle3pos }}>
              <!-- back shows first; front after flip when it's the last card -->
              <div class="flip3d" class:is-flipped={revealFlipped && i === lastIndex}>
                <img class="face back"  src={cardback}           alt="Card back" />
                <img class="face front" src={getCardSrc(card)}   alt={`Card ${card.value} of ${card.suit}`} />
              </div>
            </div>
          {/each}
        </div>
      </section>
  
    <!-- Right: Last card drawn -->
    <section class="reveal">
        <div class="badge">Your Card is :</div>
        <div class="bigcard-wrap">
          <div class="reveal-card {revealFlipped ? 'is-flipped' : ''}">
            <!-- back (visible first) -->
            <img class="reveal-back" src={facedown} alt="Card back" />
            <!-- front (shown after flip) -->
            {#if lastCard}
              <img
                class="reveal-front"
                src={getCardSrc(lastCard)}
                alt={`Card ${lastCard.value} of ${lastCard.suit}`} />
            {/if}
          </div>
        </div>
      </section>

  </main>
  
  <div class="controls">
    <!-- <button on:click={drawOne} disabled={count >= 15 || !leftPile.length}>Draw one</button> -->
    {#if revealFlipped}
      <button on:click={revealAgain}>Reveal it again ↺</button>
    {:else}
      <button on:click={dealToFifteen} disabled={count >= 14 || dealing}> Reveal The Card!</button>
    {/if}
    <!-- <button on:click={reset}>Reset</button> -->
  </div>

  <style>
    .stage {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: end;
      justify-items: center;
      gap: 3rem;
      width: 100%;
      max-width: 1100px;
      padding: 2rem;
      box-sizing: border-box;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      color: #5B4E88;
    }

    /* stage narrower than 900px (see cq-* classes in Demo.Slider) */
    :global(.cq-900) .stage {
        grid-template-columns: 1fr;
        justify-items: center;
      }
  
    .pile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
    }
    .title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1rem;

    }
  
    /* Pile stack area — controls card height; images follow width 130px */
    .stack {
      position: relative;
      width: 170px;                          /* room for fanned overlap */
      height: 320px;                         /* controls .card-front height (100%) */
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
      width: 130px;                          /* your requirement */
      object-fit: contain;
      /* filter: drop-shadow(0 10px 14px rgba(0,0,0,.18)); */
    }
  
    /* Right-side reveal */
 
    /* plain label (not button-like), with room between it and the big card */
    .badge {
      color: #5B4E88;
      font-weight: 800;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .bigcard-wrap {
      height: clamp(220px, 34cqw, 380px);
      width: clamp(160px, 26cqw, 280px);
      display: grid;
      place-items: center;
    }

    .reveal-card {
    position: relative;
    height: 100%;
    width: 80%;
    transform-style: preserve-3d;
    transition: transform 700ms;
    }

    .reveal{
        justify-items: center;
    }

    .reveal-card.is-flipped { transform: rotateY(180deg); }

    .reveal-front,
    .reveal-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    width: 100%;
    height: 100%;
    object-fit: contain;
    }

    /* front starts rotated so the back shows first */
    .reveal-front { transform: rotateY(180deg); }

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
      justify-content: center;
      padding: 1.25rem 0 2rem;
    }
    .controls button {
      padding: .6rem 1rem;
      border: 0;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      background: #5B4E88;
      color: #fff;
    }
    .controls button[disabled] { opacity: .5; cursor: not-allowed; }

    .reveal-text {
      text-align: center;
      max-width: 30rem;
      margin: 0 auto 2rem;
      padding: 0 1rem;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      color: #5B4E88;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .reveal-text.visible {
      visibility: visible;
      opacity: 1;
    }
    .question {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }
    .question .first {
      background-color: #5B4D88;
      color: #E5DEFE;
      padding: 0.1em 0.5em;
      border-radius: 0.3em;
      font-weight: 900;
    }
    .yes-btn {
      margin-top: .8rem;
      font-family: inherit;
      font-size: 1.2rem;
      font-weight: 800;
      padding: .45em 1.4em;
      border: none;
      border-radius: 10px;
      background: #D47D79;
      color: #FCD4D4;
      cursor: pointer;
      transition: transform .15s;
    }
    .reveal-text.visible .yes-btn {
      animation: yesPop .4s ease-out, heartbeat 1.3s ease-in-out .6s infinite;
    }
    .yes-btn:hover, .yes-btn:focus-visible { animation-play-state: paused; }
    @keyframes heartbeat {
      0%, 40%, 100% { transform: scale(1); }
      10%           { transform: scale(1.14); }
      20%           { transform: scale(1); }
      30%           { transform: scale(1.1); }
    }
    .yes-btn:hover, .yes-btn:focus-visible { transform: scale(1.06); }
    @keyframes yesPop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .joke {
      font-size: 1.05rem;
      font-weight: 400;
      font-style: italic;
      opacity: 0.85;
      margin: 0;
    }

    .stack.with-perspective { perspective: 1000px; }

.cardwrap2 {
  position: absolute;
  inset: 0;
  transform: translateX(calc(var(--i) * 8px));
  z-index: var(--z, 1);
  display: grid;
  place-items: center;
}

/* flip container */
.flip3d {
  position: relative;
  width: 130px;      /* your card width */
  height: 100%;      /* follows .stack height */
  transform-style: preserve-3d;
  transition: transform 700ms;
}
.flip3d.is-flipped { transform: rotateY(180deg); }

.face {
  position: absolute;
  inset: 0;
  width: 130px;
  height: 100%;
  object-fit: contain;
  backface-visibility: hidden;
}
.face.front { transform: rotateY(180deg); }

  
    /* Short screens (e.g. 695px-tall laptops): everything follows the stage height
       so the whole reveal fits ("Is this your card?" was cut off at the top).
       Each clamp's max is the original size, reached on ~900px+ tall screens. */
    .stage { gap: clamp(1rem, 4.5cqh, 3rem); padding: clamp(.5rem, 3cqh, 2rem) 2rem; }
    .title { font-size: clamp(1.2rem, 2.7cqh, 1.8rem); margin-bottom: clamp(.4rem, 1.5cqh, 1rem); }
    .stack { height: clamp(170px, 36cqh, 320px); }
    .badge { font-size: clamp(1.15rem, 2.5cqh, 1.5rem); margin-bottom: clamp(.5rem, 1.8cqh, 1rem); }
    .bigcard-wrap { height: clamp(190px, min(32cqw, 39cqh), 350px); }  /* a little smaller than before */
    .reveal-text { margin-bottom: clamp(.4rem, 2.5cqh, 2rem); }
    .question { font-size: clamp(1.2rem, 2.9cqh, 1.6rem); }
    .joke { font-size: clamp(.85rem, 1.9cqh, 1.05rem); }
    .yes-btn { font-size: clamp(1rem, 2.2cqh, 1.2rem); margin-top: clamp(.35rem, 1.2cqh, .8rem); }
    .controls { padding: clamp(.5rem, 1.6cqh, 1.25rem) 0 clamp(.5rem, 2.6cqh, 2rem); }
</style>
  