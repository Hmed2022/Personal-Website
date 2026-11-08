<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  const dispatch = createEventDispatcher();

  // your code
  import { get } from 'svelte/store';
  import { allCards } from './cards.js';
  import { arrayCards, currentCard, assembly1, resetKey, drawn, mode } from '../../stores/misc.js';
  import { answerPile } from '../../stores/mindCycles.js';
  import PilePeek from './PilePeek.svelte';
  import { logEvent } from '../../stores/db.js';
  import { isTouchDevice } from '../../stores/layout.js';

  // Short message after picking the wrong pile
  let wrongPick = false;
  let wrongTimer;

  const [send, receive] = crossfade({
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `transform: ${transform} scale(${t});`
      };
    }
  });

  const spreadFactor = 7;

  let audioEl;     // deal sound
  let errorAudio;  // wrong answer sound

  // keep cards reactive to the store
  $: cards = $arrayCards || [];

  let animationDelay = 400;
  let showButtons = false;
  let animationStarted = false;

  // success state
  let success = false;
  let successPile = null;

  // Get the selected card's pile number (1/2/3) from your data
  function getSelectedCycle1PileNumber() {
    const selectedCard = $arrayCards.find((c) => c.selected === true);
    if (!selectedCard) return null;

    // Preferred: flat number like "cycle1pile: 3" (matches your screenshot)
    if (typeof selectedCard.cycle1pile === 'number') return selectedCard.cycle1pile;

    // Fallbacks: nested or string like 'pile2'
    const p = selectedCard?.cycle1?.pile;
    if (typeof p === 'number') return p;
    const m = /pile(\d+)/i.exec(String(p ?? ''));
    if (m) return Number(m[1]);

    return null;
  }

  async function moveCardsToPiles() {
    $assembly1 = true;
    animationStarted = true;
    for (let i = 0; i < cards.length; i++) {
      if (audioEl && !isTouchDevice) audioEl.play().catch(() => {}); // iOS lags rapid sounds: skip on phones

      // mark dealt + assign pile in round-robin
      cards[i].dealt1 = true;
      cards[i].pile = (i % 3) + 1;
      cards[i].zIndex = i + 1;

      await new Promise((r) => setTimeout(r, animationDelay));
    }
    showButtons = true;
  }

  function getCardSrc(card) {
    if (!card) return '';
    const fileSuit = { Clubs: 'club', Diamonds: 'diam', Hearts: 'heart', Spades: 'spade' };
    return `/assets/CardMagic/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? '0' : ''}${card.value}.png`;
  }

  // Handle pile button clicks
  // Mind mode: the visitor's answer is always accepted; the next order is computed from it
  let peekOpen = false;
  $: peekPiles = [1, 2, 3].map((p) => cards.filter((d) => d.dealt1 && d.pile === p));
  function answerMind(pileNumber) {
    peekOpen = false;
    success = true;
    successPile = pileNumber;
    answerPile(1, pileNumber);
    drawn.update((d) => ({ ...d, 1: true })); // unlock → for this cycle
  }

  // Gather: the three piles slide together into one deck (the order isn't shown,
  // so the "your pile goes in the middle" secret stays hidden), then move on.
  let gathering = false;
  let gatherTimer;
  function gatherThen(next) {
    if (gathering) return;
    gathering = true;
    gatherTimer = setTimeout(() => {
      next();
      setTimeout(() => (gathering = false), 700);   // reset after the slide has moved away
    }, 1500);
  }

  function onPick(pileNumber, e) {
    if (success && pileNumber === successPile) {
      gatherThen(() => dispatch('goto', { y: 0, x: 2 }));   // short gather, then the next step
      return;
    }

    if ($mode === 'mind') { answerMind(pileNumber); return; }

    const selectedPile = getSelectedCycle1PileNumber();
    if (selectedPile == null) return;

    if (pileNumber === selectedPile) {
      success = true;
      successPile = pileNumber;
      drawn.update((d) => ({ ...d, 1: true })); // unlock → for this cycle
      console.log("You're right");
    } else {
      // Shake only the clicked button and play error sound
      const btn = e.currentTarget;
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 820);

      if (errorAudio) {
        errorAudio.currentTime = 0;
        errorAudio.play();
      }
      console.log('Try again');
      wrongPick = true;
      clearTimeout(wrongTimer);
      wrongTimer = setTimeout(() => (wrongPick = false), 1800);
      logEvent('wrong_pile', 1);
    }
  }

  // Reset this cycle's local state whenever the app-wide reset fires (e.g.
  // picking a new card from the End screen), so a stale dealt pile / stuck
  // success state don't linger when this slide is revisited.
  let lastSeenReset = -1;
  onMount(() => {
    lastSeenReset = get(resetKey);
    const unsub = resetKey.subscribe((v) => {
      if (v !== lastSeenReset) {
        lastSeenReset = v;
        gathering = false;
        clearTimeout(gatherTimer);
        peekOpen = false;
        wrongPick = false;
        animationStarted = false;
        showButtons = false;
        success = false;
        successPile = null;
      }
    });
    return unsub;
  });
</script>

<audio src="/assets/CardMagic/deal2.ogg" bind:this={audioEl} />
<audio src="/assets/CardMagic/error.mp3" bind:this={errorAudio} preload="auto" />

<div class="cycle"><p>I</p></div>

<div class="centered-wrapper">
  <div class="deck-container">
    <div class="divtext">
      {#if showButtons}
{#if $mode === 'mind'}
          <div class="question">
            <p class="q-step">Question 1 of 3
              <span class="dots" aria-hidden="true">{#each [1, 2, 3] as d}<span class:on={d <= 1}></span>{/each}</span>
            </p>
            <p class="q-text">Which pile is your card in?</p>
          </div>
        {:else}
        <p class="picktext">{wrongPick ? "Not that one, look again!" : "Pick the pile containing your card"}</p>
        {/if}
      {/if}
    </div>

    {#each cards.filter((d) => !d.dealt1) as card, i (`${card.value}_${card.suit}`)}
      <div
        id={`${card.value}_${card.suit}`}
        class="card {showButtons ? 'hover-enabled' : ''}"
        style="--spread: {i * spreadFactor - (spreadFactor * 27) / 2}px; --index: {i}; z-index: {27 - i};"
        animate:flip
        in:receive|local={{ key: `${card.value}_${card.suit}` }}
        out:send|local={{ key: `${card.value}_${card.suit}`, ...(isTouchDevice ? { duration: 0 } : {}) }}
      >
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
      </div>
    {/each}
  </div>

  <div class="containerButton">
    {#if !animationStarted}
      <p class="description">
        <span class="first">First</span>, we'll split the deck into three face-up piles. Remember to keep an eye on which pile your card ends up in!
      </p>
      <button on:click={moveCardsToPiles}>Start Drawing</button>
    {/if}
  </div>

  {#if gathering}
    <p class="gather-msg"><b>Gathering…</b></p>
  {/if}
  <div class="piles-container" class:gathering>
    {#each [1, 2, 3] as pileI}
      <div class={`pile-${pileI}`}>
        {#each cards.filter((d) => d.dealt1 && d.pile === pileI) as card, i (`${card.value}_${card.suit}`)}
          <div
            id={`${card.value}_${card.suit}`}
            class="card {showButtons ? 'hover-enabled' : ''}"
            style="--spread: {i * spreadFactor - (spreadFactor * 9) / 2}px; --index: {i}; z-index: {card.zIndex + 100};"
            animate:flip
            in:receive|local={{ key: `${card.value}_${card.suit}` }}
            out:send|local={{ key: `${card.value}_${card.suit}`, ...(isTouchDevice ? { duration: 0 } : {}) }}
          >
            <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
          </div>
        {/each}

        {#if showButtons}
          <div class="buttons">
            <button
              id={"pile-btn-" + pileI}
              data-pile={pileI}
              on:click={(e) => onPick(pileI, e)}
              disabled={success && pileI !== successPile}
            >
              {#if success && pileI === successPile}
                {#if $mode === 'mind'}<span class="success-label">Next question →</span>{:else}<span class="success-label">Great, let's do it again</span>{/if}
              {:else}
                Pile {pileI}
              {/if}
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if $mode === 'mind' && showButtons && !success}
    <button type="button" class="forgot" on:click={() => (peekOpen = true)}>Forgot? Look inside the piles</button>
  {/if}
</div>

{#if peekOpen}
  <PilePeek piles={peekPiles} on:choose={(e) => answerMind(e.detail)} on:close={() => (peekOpen = false)} />
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .cycle {
    top: 0;
    right: 0;
    margin-top: 1%;
    margin-right: 4%;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 500;
    color: #5B4D88;
    font-size: 4rem;
    position: absolute;
  }

  .first {
    background-color: #5B4D88;
    color: #E5DEFE;
    padding-left: 5px;
    padding-right: 5px;
    font-weight: 900;
  }

  .centered-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 800px;
  }

  .divtext { text-align: center; }

  .picktext {
    color: #BFAFF7;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 500;
    text-align: center;
    font-size: 2em;
    padding: 0.2em 0.5em;
    margin: auto;
    display: inline-block;
    background-color: #5B4E88;
    border-radius: 5px;
  }

  .deck-container {
    position: relative;
    width: 100%;
    height: 200px;
  }

  .piles-container {
    position: relative;
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
  }

  .card {
    height: 100%;
    width: 130px;
    position: absolute;
    left: 50%;
    transform: translate(calc(-50% + var(--spread)), 0);
  }

  .pile-1, .pile-2, .pile-3 {
    width: 33%;
    position: relative;
  }

  .pile-1 .card, .pile-2 .card, .pile-3 .card {
    position: absolute;
    left: 50%;
    transform: translate(calc(-50% + var(--spread)), 0);
  }

  img { height: 100%; }

  .buttons {
    margin-top: -50%;
    display: flex;
    justify-content: space-around;
  }

  .description {
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 500;
    text-align: center;
    color: #5B4E88;
    font-size: 1.7em;
  }

  .containerButton {
    justify-items: center;
    text-align: center;
    margin-top: 6cqh;
  }

  /* smaller text inside the picked pile's button, without <p> margins,
     so it stays the same height as the other Pile buttons */
  .success-label {
    display: block;
    font-size: 0.7em;
    line-height: 1.2;
  }

  button {
    padding: 15px;
    font-size: 1.7em;
    background-color: #E5DEFF;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    color: #5B4E88;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 900;
  }

  /* Shake animation */
  :global(.shake) {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }

  /* mind mode: the pile question */
  .question { text-align: center; font-family: 'Kumbh Sans', sans-serif; color: #3F3075; }
  .q-step {
    margin: 0; font-size: 1.05em; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase; color: #5B4E88;
    display: inline-flex; align-items: center; gap: .6em;
  }
  .dots { display: inline-flex; gap: .3em; }
  .dots span { width: .7em; height: .7em; border-radius: 50%; background: rgba(91, 78, 136, .3); }   /* no outline */
  .dots span.on { background: #5B4E88; }
  .q-text { margin: .15em 0 0; font-size: 2.3em; font-weight: 800; }
  /* out of the layout (the wrapper is vertically centred), so the piles don't
     shift up when the link appears, or back down when it disappears */
  .forgot {
    position: absolute; left: 50%; top: calc(100% + 1.2rem);
    transform: translateX(-50%); white-space: nowrap; margin: 0;
    background: none; border: none; padding: 0;
    font-size: 1.05rem; font-weight: 700; color: #5B4E88;
    text-decoration: underline; cursor: pointer;
  }

  /* gather: piles 1 and 3 slide onto pile 2 into a single deck, buttons fade out */
  .piles-container.gathering .pile-1,
  .piles-container.gathering .pile-3 { transition: transform .55s cubic-bezier(.5, 0, .2, 1); }
  .piles-container.gathering .pile-1 { transform: translateX(100%); }
  .piles-container.gathering .pile-3 { transform: translateX(-100%); }
  .piles-container.gathering .buttons { opacity: 0; transition: opacity .2s; pointer-events: none; }
  .gather-msg {
    position: absolute; left: 0; right: 0; top: calc(100% + 1.4rem); margin: 0;
    text-align: center; font-family: 'Kumbh Sans', sans-serif; font-size: 1.4rem; color: #3F3075;
    animation: gatherIn .3s ease-out;
  }
  @keyframes gatherIn { from { opacity: 0; transform: translateY(.4rem); } to { opacity: 1; transform: none; } }
</style>
