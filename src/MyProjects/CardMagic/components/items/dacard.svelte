<script>
    import { onDestroy } from 'svelte';
    import { lockedCard } from '../../stores/misc.js';
    import facedown from '../../svg/Cards_png/back.png';

    $: card = $lockedCard;

    // The selected card stays face down (so the reveal still surprises);
    // "Peek" flips it for a couple of seconds for anyone who forgot it.
    const PEEK_MS = 2000;
    let peeking = false;
    let peekTimer;

    function peek() {
      peeking = true;
      clearTimeout(peekTimer);
      peekTimer = setTimeout(() => (peeking = false), PEEK_MS);
    }

    onDestroy(() => clearTimeout(peekTimer));

    function getCardSrc(card) {
      if (!card) return '';
      const fileSuit = { "Clubs": "club", "Diamonds": "diam", "Hearts": "heart", "Spades": "spade" };
      return `/assets/CardMagic/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }
  </script>

  {#if card}
    <div class="locked-card">
      <div class="flip" class:peeking>
        <img class="face back" src={facedown} alt="Your card, face down">
        <img class="face front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
      </div>
      <p>Your card</p>
      <button type="button" class="peek" on:click={peek} disabled={peeking}>
        {peeking ? 'Peeking…' : 'Peek'}
      </button>
    </div>
  {/if}

  <style>

@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    .locked-card {
      position: absolute;
      top: 0;
      left: 0;
      margin-top: 2%;
      margin-left: 2%;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      perspective: 600px;
    }

    .flip {
      position: relative;
      width: 60px;
      aspect-ratio: 2 / 3;
      transform-style: preserve-3d;
      transition: transform 0.4s ease;
    }
    .flip.peeking { transform: rotateY(180deg); }

    .face {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      backface-visibility: hidden;
    }
    .front { transform: rotateY(180deg); }

    p {
      color: #5B4E88;
      margin: 0;
      font-family: 'Kumbh Sans', sans-serif;
      font-weight: 900;
      text-align: center;
    }

    .peek {
      font-family: 'Kumbh Sans', sans-serif;
      font-weight: 700;
      font-size: .85rem;
      color: #5B4E88;
      background: #E5DEFF;
      border: none;
      border-radius: 10px;
      padding: 4px 10px;
      cursor: pointer;
    }
    .peek:hover:not(:disabled) { background: #fff; }
    .peek:disabled { opacity: .7; cursor: default; }
  </style>
