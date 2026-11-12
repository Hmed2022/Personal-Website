<script>
  // Closing section: three takeaways and a last line.
  import { t, isAr } from '../i18n.js';
  import { strayNote } from '../Data Viz/Timeline/strayStore.js';   // did you give Dali the $20 / €20?
  import daliFull from './dali-full.svg';
  export let missed = [];   // strings keys of the topics you never asked about
  const CARDS = [
    { k: 1, ink: '#025E73', num: '1 → 11' },
    { k: 2, ink: '#5B8C3E', num: '25 / 60' },
    { k: 3, ink: '#B5523B', num: '−87%' },
  ];
</script>

<div class="end">
  <p class="lead">{$t('pEnd')}</p>
  <div class="cards">
    {#each CARDS as c}
      <article style="--ec:{c.ink}">
        <span class="num" dir="ltr">{c.num}</span>
        <h4>{$t(`end${c.k}T`)}</h4>
        <p>{$t(`end${c.k}`)}</p>
      </article>
    {/each}
  </div>
  <!-- saying goodbye to Dali -->
  <div class="bye">
    <img class="bye-dali" src={daliFull} alt={$t('daliAlt')} draggable="false" />
    <div class="bye-talk">
      <div class="bubble">
        <p class="who">{$t('insLabel')}</p>
        <p class="last">{$t('endLast')}</p>
        {#if missed.length}<p class="thanks">{$t(missed.length > 1 ? 'endMissedMany' : 'endMissed', { topic: $t(missed[0]), n: missed.length })}</p>{/if}
        {#if $strayNote.choice === 'gave'}<p class="thanks">{$t('endThanks', { note: $strayNote.tag })}</p>{/if}
      </div>
      <div class="jot" class:ar={$isAr}>
        <span class="tape" aria-hidden="true"></span>
        <p class="jot-k">{$t('insNoteLabel')}</p>
        <p class="jot-t">{@html $t('endYou')}</p>
      </div>
    </div>
  </div>
</div>

<style>
  .end { font-family: Quicksand, sans-serif; color: #3D2A22; text-align: center; }
  .lead { margin: 0 auto 1.3rem; max-width: 40rem; font-size: 1.05rem; }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: start; }
  article { background: color-mix(in srgb, var(--ec) 9%, transparent); border: 1px solid color-mix(in srgb, var(--ec) 22%, transparent); border-top: 5px solid var(--ec); border-radius: 12px; padding: 1rem 1.1rem 1.1rem; }
  .num { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 800; color: var(--ec); line-height: 1.1; }
  h4 { margin: .3rem 0 .4rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: #1E3F5C; }
  article p { margin: 0; font-size: .9rem; line-height: 1.55; }
  .bye { display: flex; align-items: flex-end; justify-content: center; gap: 1.6rem; max-width: 52rem; margin: 2.4rem auto 0; text-align: start; }
  .bye-dali { flex: 0 0 auto; width: 150px; height: auto; filter: drop-shadow(0 6px 10px rgba(74, 46, 37, .18)); }
  .bye-talk { flex: 1 1 auto; display: grid; gap: 1.4rem; }
  .bubble { position: relative; padding: 1rem 1.3rem; border-radius: 14px; background: #F6ECD4; border: 0; border-inline-start: 4px solid #A4731C; box-shadow: none; color: #3D2A22; }
  .bubble::before { display: none; }
  .who { margin: 0 0 .3rem; font-weight: 800; font-size: .9rem; color: #A4731C; }
  .last { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-style: italic; line-height: 1.5; color: #1E3F5C; }
  .thanks { margin: .6rem 0 0; font-size: .95rem; font-weight: 700; color: #A4731C; }
  /* your last notebook slip: you're going to Tunisia */
  .jot { position: relative; justify-self: end; width: fit-content; max-width: 30rem; padding: 1rem 1.2rem .7rem; transform: rotate(-1.4deg);
    background: repeating-linear-gradient(transparent 0 1.55rem, rgba(30, 91, 140, .2) 1.55rem calc(1.55rem + 1px)), #FFFDF6; background-position: 0 .55rem;
    box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 8px 18px -8px rgba(74, 46, 37, .3); }
  .jot::before { content: ''; position: absolute; top: 0; bottom: 0; inset-inline-start: 1.4rem; border-inline-start: 1px solid rgba(181, 82, 59, .35); }
  .tape { position: absolute; top: -.6rem; left: 50%; width: 5rem; height: 1.2rem; transform: translateX(-50%) rotate(2deg); background: rgba(233, 214, 170, .8); }
  .jot-k { margin: 0; padding-inline-start: 1rem; font: 700 .66rem Quicksand, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #B5523B; }
  .jot-t { margin: 0; padding-inline-start: 1rem; font: 500 1.5rem/1.55rem Caveat, 'Segoe Print', cursive; color: #1E3F5C; }
  .jot-t :global(b) { color: #C62F2F; }
  .jot.ar { transform: rotate(1.4deg); }
  .jot.ar .jot-t { font-family: 'Aref Ruqaa', Tajawal, serif; font-size: 1.25rem; }
  @media (max-width: 640px) { .bye { flex-direction: column; align-items: center; } .bye-dali { width: 110px; } .bubble::before { display: none; } .jot { justify-self: center; } }
  @media (max-width: 820px) { .cards { grid-template-columns: minmax(0, 1fr); } }
</style>
