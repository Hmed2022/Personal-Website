<script>
    import { createEventDispatcher } from 'svelte';
    import { arrayCards, statuscard, lockedCard } from '../../stores/misc.js';
    import Arrow from '../items/Arrow.svelte';
    import Up from '../items/JustUpArrow.svelte'

    const dispatch = createEventDispatcher();
    function jumpToCards() {
      dispatch('goto', { y: 0, x: 0 }); // the magic "Pick a card" slide
    }
  
    $: rows = Array.from({ length: 9 }, (_, i) => $arrayCards.slice(i * 3, i * 3 + 3));
  
    function DisplayValue(v) {
      if (v === 11) return 'Jack';
      if (v === 12) return 'Queen';
      if (v === 13) return 'King';
      if (v === 1)  return 'Ace';
      return v;
    }
    function DisplaySuit(suit) {
      if (suit === 'Hearts') return '♥\uFE0E';
      if (suit === 'Diamonds') return '♦\uFE0E';
      if (suit === 'Clubs') return '♣\uFE0E';
      if (suit === 'Spades') return '♠\uFE0E';
      return suit;
    }
  
    let selectedEl = null;
    let note;
    let board;
    const elMap = new Map();
  
    let layoutVersion = 0;
    const invalidate = () => { layoutVersion += 1; };
  
    function collect(node, card) {
      elMap.set(card.index, node);
      if (card.selected) selectedEl = node;
      invalidate();
  
      return {
        update(newCard) {
          if (newCard.index !== card.index) {
            elMap.delete(card.index);
            elMap.set(newCard.index, node);
          }
          // If selection changed, update selectedEl both ways
          if (newCard.selected) {
            selectedEl = node;
          } else if (!newCard.selected && selectedEl === node) {
            selectedEl = null;
          }
          card = newCard;
          invalidate();
        },
        destroy() {
          elMap.delete(card.index);
          if (selectedEl === node) selectedEl = null;
          invalidate();
        }
      };
    }
  </script>
  
  <main class="body">
    {#if $statuscard}
      <header class="header">
        <h1><u>The First Deal</u></h1>
        <p>We deal one card at a time into piles 1, 2, 3, 1, 2, 3… <br> so each pile gets every 3rd card. Here's where your card went.</p>
      </header>
  
      <div class="container" bind:this={board}>
        {#if selectedEl && note}
          <!-- if Arrow expects container-relative layout, use mode="container" -->
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
  
        {#each rows as row}
          <div class="row">
            {#each row as card}
              <div class="rectangle {card.selected ? 'selected' : ''}" use:collect={card}>
                {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="note" bind:this={note}>Your card</div>

      <div class="footer"></div>
      <div class="footer2"><p>Dealing I</p></div>
      {:else}
      <div class='else'> <p>
        Click the <b>Top Arrow or press</b>
        <Up enableKeyboard={false} on:tap={jumpToCards}/>
        <b>to jump</b> to the <b>Cards</b>
        {$lockedCard ? 'and press “Lock it in!” on the card you clicked!' : 'and pick one!'}
      </p>  </div>
    {/if}
  </main>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    .body:has(.else) { justify-content: center;  text-align: center; }


    .else{
      font-size: 2rem; 
      font-family: 'Kumbh Sans', sans-serif;
      color: #A34C48;
     
    }

    .body {
      height: 100%;
      background-color: #FDD4D4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;  /* header top, cards middle, note bottom (like Dealing II) */
      font-family: 'Kumbh Sans', sans-serif;
      color: #A34C48;
    }
  
    .header { text-align: center;
         margin-top: 4rem; height: 9rem; width: 100%; }

    .header h1 { position: absolute;
         margin-top: 3rem;
          margin-left: 5rem; 
          font-size: 2rem; 
          font-weight: bold; 
          left: 0;
           top: 0; }

    .header p { margin-top: 1rem; 
        margin-bottom: 0;
         font-size: 2rem;
          font-weight: 300; }
  
    .container {
      position: relative;      /* 🔑 let Arrow place itself relative to this */
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      width: 75%;
      align-items: center;
    }
  
    .row { display: flex; justify-content: center; gap: 2%; width: 100%; }
  
    .rectangle {
      flex: 1;
      max-width: 27%;
      aspect-ratio: 8 / 1;
      background-color: #F09D99;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      text-align: center;
      border-radius:6px;
      transition: transform 0.2s ease;
    }
    .rectangle.selected { color: #A34C48; }
  
    .note {
      color: #5a80c0;
      font-weight: 900;
      font-size: 2rem;
      font-family: "Nanum Pen Script", cursive;
    }
    .footer{ margin-bottom:4rem; }
    .footer2{ position:absolute; margin-right:4rem; margin-bottom:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; right:0; bottom:0; }
 
  
  /* Short screens (e.g. 695px-tall laptops): sizes follow the stage height so the
     text never runs into the piles. Each clamp's max is the original size, reached
     at ~1000px tall, so big screens look the same as before. */
  .header{ margin-top: clamp(1rem, 6.4cqh, 4rem); height: clamp(5.5rem, 14.5cqh, 9rem); }
  .header h1{ font-size: clamp(1.4rem, 3.2cqh, 2rem); margin-top: clamp(1rem, 4.8cqh, 3rem); }
  .header p{ font-size: clamp(1.15rem, 3.2cqh, 2rem); }
  .container{ width: min(75%, 125cqh); }
  .note{ font-size: clamp(1.3rem, 3.2cqh, 2rem); }
  .footer{ margin-bottom: clamp(1rem, 6.4cqh, 4rem); }
</style>
  