<script>
  // Text for one step of PortraitStory (used by the scrolling steps on desktop and below the chart on phones).
  import { t } from '../../i18n.js';
  import daliImg from '../../Components/dali.svg';   // Dali walks you through each view
  export let k = 0;
  export let bourguibaNotes, women, total, women2005, since2005;
</script>

<div class="card">
{#if k === 0}
  <p class="who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
  <h3>{$t('pc0Title')}</h3>
  <p>{@html $t('pc0P1', { n: bourguibaNotes })}</p>
  <p>{@html $t('pc0P2')}</p>
  <p>{@html $t('pc0P3')}</p>
{:else if k === 1}
  <p class="who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
  <h3>{$t('pc1Title', { w: women, t: total })}</h3>
  <p>{@html $t('pc1P1', { a: Math.round((women / total) * 100), b: Math.round((women2005 / since2005) * 100) })}</p>
  <p>{@html $t('pc1P2')}</p>
{:else if k === 2}
  <p class="who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
  <h3>{$t('pc2Title')}</h3>
  <p>{@html $t('pc2P1')}</p>
  <p>{@html $t('pc2P2')}</p>
  <p>{@html $t('pc2P3')}</p>
{/if}
</div>

<style>
  .card {
    background: #F6ECD4; border: 0; border-inline-start: 4px solid #A4731C; box-shadow: none; color: #3D2A22; border-radius: 14px; padding: 1.1rem 1.4rem;
    font-family: Quicksand, sans-serif;
  }
  .who { display: flex; align-items: center; gap: .45rem; margin: 0 0 .2rem; font-weight: 800; font-size: .95rem; color: #A4731C; }
  .who img { width: 2.6rem; height: 2.8rem; object-fit: contain; object-position: 50% 0; }
  .kicker { margin: 0; font-size: .72rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #B5523B; }
  h3 { margin: .1rem 0 .5rem; font-family: Quicksand, sans-serif; font-weight: 800; font-size: 1.1rem; color: #A4731C; }
  p { margin: 0 0 .6rem; font-size: .95rem; line-height: 1.6; }
  p:last-child { margin-bottom: 0; }
  .card :global(.c1) { color: #025E73; } .card :global(.c2) { color: #7C4A8C; } .card :global(.c3) { color: #BF5630; } .card :global(.pink) { color: #B8457A; }
  .c1 { color: #025E73; } .c2 { color: #7C4A8C; } .c3 { color: #BF5630; } .pink { color: #B8457A; }
  @media (max-width: 860px) {
    .card { padding: 1rem 1.1rem; }
    h3 { font-size: 1.25rem; }
    p { font-size: .9rem; }
  }
</style>
