<script>
  // Mind mode: "Forgot? Look inside the piles" — the three dealt piles shown as
  // three rows of face-up cards, so the visitor can find their card and answer here.
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { getCardSrc } from '../../stores/deck.js';

  export let piles = [[], [], []];   // cards of pile 1, 2, 3 (in dealt order)

  const dispatch = createEventDispatcher();
</script>

<div class="backdrop" transition:fade|local={{ duration: 180 }} on:click|self={() => dispatch('close')}>
  <div class="panel" role="dialog" aria-label="The three piles">
    <button type="button" class="close" on:click={() => dispatch('close')} aria-label="Close">×</button>
    <p class="title">Find your card, then tap its pile</p>

    {#each piles as pile, p}
      <div class="row">
        <button type="button" class="pick" on:click={() => dispatch('choose', p + 1)}>
          It's in pile {p + 1}
        </button>
        <div class="cards">
          {#each pile as card (card.value + '_' + card.suit)}
            <img src={getCardSrc(card)} alt={`${card.value} of ${card.suit}`} draggable="false" />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .backdrop {
    position: absolute;
    inset: 0;
    z-index: 1300;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(63, 48, 117, .45);
  }
  .panel {
    position: relative;
    background: #E5DEFF;
    color: #3F3075;
    border-radius: 1rem;
    padding: 1.4rem 1.8rem 1.2rem;
    /* card width: as big as the screen allows (both width and height), 3rem-4.6rem */
    --cw: clamp(3rem, min(5.2cqw, 8.2cqh), 4.6rem);
    font-family: 'Kumbh Sans', sans-serif;
    box-shadow: 0 10px 30px rgba(35, 25, 70, .35);
    max-width: 95%;
  }
  .title { margin: 0 0 1rem; font-size: 1.6rem; font-weight: 700; text-align: center; }
  .close {
    position: absolute; top: .4rem; right: .6rem;
    border: none; background: none; font-size: 1.8rem; line-height: 1;
    color: #5B4E88; cursor: pointer;
  }
  .row { display: flex; align-items: center; gap: 1.1rem; margin: .6rem 0; }
  .pick {
    flex: 0 0 auto;
    font-family: inherit; font-weight: 800; font-size: 1.15rem;
    color: #fff; background: #5B4E88;
    border: none; border-radius: .7rem; padding: .7rem 1rem;
    cursor: pointer; white-space: nowrap;
  }
  .pick:hover, .pick:focus-visible { background: #3F3075; }
  .cards { display: grid; grid-template-columns: repeat(9, var(--cw)); gap: .35rem; }
  .cards img { width: var(--cw); height: calc(var(--cw) * 1.53); object-fit: contain; }
</style>
