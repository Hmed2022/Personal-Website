<script>
  // Before/after slider for the 5 dinars: 1958 (Eastern Arabic ٥) and its 1 November 1960 reprint (Western 5).
  // Same look as the sliders in ErasChanges.svelte. The 1960 illustration is the 1958 one with the digits swapped.
  import { t, money, lang } from '../i18n.js';
  import illus58 from './eras/illus-5-1958.webp';
  import illus60 from './eras/illus-5-1960.webp';
  import real58 from './eras/real-5-1958.webp';
  import real60 from './eras/real-5-1960.webp';

  import { realNotes, realPhoto } from '../Data Viz/Timeline/noteImage.js';
  $: real = $realNotes;   // same switch as the rest of the piece
  let split = 50;
</script>

<figure class="nw">
  <div class="view" role="tablist" aria-label={$t('ecShow')}>
    <button type="button" role="tab" aria-selected={!real} class:on={!real} on:click={() => realNotes.set(false)}>{$t('ecIllus')}</button>
    <button type="button" role="tab" aria-selected={real} class:on={real} on:click={() => realNotes.set(true)}>{$t('ecReal')}</button>
  </div>
  <div class="wipe" dir="ltr" style="--split:{split}%">
    <img class="after" src={real ? real60 : illus60} alt={`${$money(5)}, 1960`} draggable="false" />
    <img class="before" src={real ? real58 : illus58} alt={`${$money(5)}, 1958`} draggable="false" />
    <span class="handle" aria-hidden="true"><i>‹ ›</i></span>
    <span class="tag l">1958 · ٥</span>
    <span class="tag r">1960 · 5</span>
    <input type="range" min="0" max="100" step="1" bind:value={split} aria-label={$t('ecCompare', { v: $money(5), a: 1958, b: 1960 })} />
  </div>
  <figcaption><b>{$money(5)}</b> · {$t('nwCap')} · 1958 {$lang === 'ar' ? '←' : '→'} 1960</figcaption>
  <p class="hint">{$t('nwHint')}{#if real} <span class="credit">{$t('nwCredit')}</span>{/if}</p>
</figure>

<style>
  .nw { margin: 0 auto; max-width: 640px; font-family: Quicksand, sans-serif; color: #3D2A22; text-align: start; }
  .view { display: inline-flex; gap: .25rem; padding: .25rem; margin-bottom: .9rem; border-radius: 999px; background: #EFE6DA; }
  .view button { font: 700 .85rem Quicksand, sans-serif; color: #4D6473; background: none; border: none; border-radius: 999px; padding: .35rem .9rem; cursor: pointer; }
  .view button.on { background: #FFFFFF; color: #1E3F5C; box-shadow: 0 1px 4px rgba(61, 42, 34, .18); }
  .wipe { position: relative; aspect-ratio: 1963 / 1110; border-radius: 10px; overflow: hidden; background: #F3EBDD; box-shadow: 0 6px 18px rgba(61, 42, 34, .18); user-select: none; touch-action: pan-y; }
  .wipe img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .wipe .before { clip-path: inset(0 calc(100% - var(--split)) 0 0); }
  .handle { position: absolute; top: 0; bottom: 0; left: var(--split); width: 3px; margin-left: -1.5px; background: #FFFFFF; box-shadow: 0 0 6px rgba(0, 0, 0, .35); pointer-events: none; }
  .handle i {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2.4rem; height: 2.4rem; border-radius: 50%;
    display: grid; place-items: center; background: #FFFFFF; color: #1E5B8C; font: 800 .9rem/1 Quicksand, sans-serif; font-style: normal; box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
  }
  .tag { position: absolute; top: .5rem; padding: .1rem .5rem; border-radius: 999px; background: rgba(30, 42, 48, .72); color: #FFFFFF; font-size: .75rem; font-weight: 800; pointer-events: none; }
  .tag.l { left: .5rem; } .tag.r { right: .5rem; }
  .wipe input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; }
  .wipe:focus-within { outline: 3px solid #1E5B8C; outline-offset: 3px; }
  figcaption { margin-top: .5rem; font-size: .85rem; color: #4D6473; }
  figcaption b { color: #8C4D3F; }
  .hint { margin: .5rem 0 0; font-size: .8rem; color: #7A8B92; }
  .credit { margin-inline-start: .4rem; font-size: .72rem; color: #A39582; }
</style>
