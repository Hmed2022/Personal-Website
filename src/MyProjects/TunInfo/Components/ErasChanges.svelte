<script>
  // New "Changes Between Eras" visuals (the arrow images and Propaganda.svelte are kept in TunInfo.svelte).
  //  1. before/after sliders: drag to wipe the purple Ben Ali-era note into its 2011 re-issue
  //  2. the backs of four Ben Ali-era notes, with a switch that isolates the 7 November symbols
  import { t, money, lang } from '../i18n.js';
  import backs from './eras/back-baknotes-06.webp';
  import symbols from './eras/back-baknotes-07.webp';
  // photos of the real notes (from the PathF links in the timeline data, saved locally)
  import real20a from './eras/real-20-1992.webp';
  import real20b from './eras/real-20-2011.webp';
  import real50a from './eras/real-50-2008.webp';
  import real50b from './eras/real-50-2011.webp';

  const NOTE = import.meta.glob('../Data Viz/Timeline/Banknotes/Banknote-*.png', { eager: true, as: 'url' });
  const note = (n) => NOTE[`../Data Viz/Timeline/Banknotes/Banknote-${n}.png`];

  const PAIRS = [
    { before: note('06'), after: note('02'), realBefore: real20a, realAfter: real20b, value: 20, from: 1992, to: 2011, who: 'whoKheireddine' },
    { before: note('14'), after: note('01'), realBefore: real50a, realAfter: real50b, value: 50, from: 2008, to: 2011, who: 'whoRachiq' },
  ];
  let real = false;   // illustrations or photos of the real notes
  let split = PAIRS.map(() => 50);   // % of the "before" note still showing

  // the four backs, in the order they sit in the composite image (2 x 2)
  const BACKS = [
    { pos: '0% 0%', value: 20, year: 1992, text: 'ecBack0' },
    { pos: '100% 0%', value: 5, year: 1993, text: 'ecBack1' },
    { pos: '0% 100%', value: 10, year: 1994, text: 'ecBack2' },
    { pos: '100% 100%', value: 10, year: 1994, text: 'ecBack3' },
  ];
  let highlight = false;
  let hot = null;
</script>

<div class="ec">
  <!-- ===== 1. purple out ===== -->
  <div class="view" role="tablist" aria-label={$t('ecShow')}>
    <button type="button" role="tab" aria-selected={!real} class:on={!real} on:click={() => (real = false)}>{$t('ecIllus')}</button>
    <button type="button" role="tab" aria-selected={real} class:on={real} on:click={() => (real = true)}>{$t('ecReal')}</button>
  </div>
  <div class="pairs">
    {#each PAIRS as p, i}
      <figure class="pair">
        <div class="wipe" dir="ltr" style="--split:{split[i]}%">
          <img class="after" src={real ? p.realAfter : p.after} alt={`${$money(p.value)}, ${p.to}`} draggable="false" />
          <img class="before" src={real ? p.realBefore : p.before} alt={`${$money(p.value)}, ${p.from}`} draggable="false" />
          <span class="handle" aria-hidden="true"><i>‹ ›</i></span>
          <span class="tag l">{p.from}</span>
          <span class="tag r">{p.to}</span>
          <input type="range" min="0" max="100" step="1" bind:value={split[i]} aria-label={$t('ecCompare', { v: $money(p.value), a: p.from, b: p.to })} />
        </div>
        <figcaption><b>{$money(p.value)}</b> · {$t(p.who)} · {p.from} {$lang === 'ar' ? '←' : '→'} {p.to}</figcaption>
      </figure>
    {/each}
  </div>
  <p class="hint">{$t('ecHint')}{#if real} <span class="credit">{$t('ecCredit')}</span>{/if}</p>

  <!-- ===== 2. propaganda on the backs ===== -->
  <div class="prop-head">
    <h4>{$t('ecPropTitle')}</h4>
    <button type="button" class="switch" class:on={highlight} role="switch" aria-checked={highlight} on:click={() => (highlight = !highlight)}>
      <span class="knob"></span>{$t('ecPropSwitch')}
    </button>
  </div>
  <div class="backs">
    {#each BACKS as b, i}
      <button type="button" class="back" class:lit={highlight || hot === i}
              on:pointerenter={() => (hot = i)} on:pointerleave={() => (hot = null)}
              on:focus={() => (hot = i)} on:blur={() => (hot = null)}
              aria-label={`${$money(b.value)}, ${b.year}: ${$t(b.text)}`}>
        <span class="art">
          <span class="layer notes" style="background-image:url({backs}); background-position:{b.pos}"></span>
          <span class="layer marks" style="background-image:url({symbols}); background-position:{b.pos}"></span>
        </span>
        <span class="cap"><b>{$money(b.value)} · {b.year}</b>{$t(b.text)}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .ec { font-family: Quicksand, sans-serif; color: #3D2A22; text-align: start; }

  /* ---- sliders ---- */
  .view { display: inline-flex; gap: .25rem; padding: .25rem; margin-bottom: .9rem; border-radius: 999px; background: #EFE6DA; }
  .view button { font: 700 .85rem Quicksand, sans-serif; color: #4D6473; background: none; border: none; border-radius: 999px; padding: .35rem .9rem; cursor: pointer; }
  .view button.on { background: #FFFFFF; color: #1E3F5C; box-shadow: 0 1px 4px rgba(61, 42, 34, .18); }
  .credit { margin-inline-start: .4rem; font-size: .72rem; color: #A39582; }
  .pairs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  .pair { margin: 0; }
  .wipe { position: relative; aspect-ratio: 1914 / 950; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 18px rgba(61, 42, 34, .18); user-select: none; touch-action: pan-y; }
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

  /* ---- propaganda ---- */
  .prop-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .6rem; margin: 2.4rem 0 .9rem; }
  .prop-head h4 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; color: #1E3F5C; }
  .switch { display: inline-flex; align-items: center; gap: .5rem; font: 700 .85rem Quicksand, sans-serif; color: #4D6473; background: rgba(255, 255, 255, .45); border: 1.5px solid #C8D9DC; border-radius: 999px; padding: .3rem .8rem .3rem .35rem; cursor: pointer; }
  .knob { position: relative; width: 2.1rem; height: 1.2rem; border-radius: 999px; background: #C8D9DC; transition: background .2s; }
  .knob::after { content: ''; position: absolute; top: .15rem; left: .15rem; width: .9rem; height: .9rem; border-radius: 50%; background: #FFFFFF; transition: transform .2s; }
  .switch.on { border-color: #A93925; color: #A93925; }
  .switch.on .knob { background: #A93925; }
  .switch.on .knob::after { transform: translateX(.9rem); }

  .backs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .back { display: flex; flex-direction: column; padding: 0; text-align: left; border: 1px solid #E6DCCF; border-radius: 12px; overflow: hidden; background: rgba(140, 77, 63, .05); cursor: pointer; font-family: inherit; color: inherit; box-shadow: 0 2px 8px rgba(61, 42, 34, .07); }
  .art { position: relative; display: block; aspect-ratio: 1353 / 681; background: #F3EBDD; }
  .layer { position: absolute; inset: 0; background-size: 200% 200%; background-repeat: no-repeat; transition: opacity .4s, filter .4s; }
  .marks { opacity: 0; }
  .back.lit .notes { opacity: .22; filter: grayscale(1); }
  .back.lit .marks { opacity: 1; filter: drop-shadow(0 0 6px rgba(169, 57, 37, .55)); }
  .cap { display: flex; flex-direction: column; gap: .15rem; padding: .65rem .8rem .75rem; font-size: .82rem; line-height: 1.45; }
  .cap b { color: #A93925; font-size: .85rem; }

  @media (max-width: 760px) {
    .pairs, .backs { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) { .layer, .knob, .knob::after { transition: none; } }
</style>
