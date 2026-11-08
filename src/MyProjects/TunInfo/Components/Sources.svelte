<script>
  // Sources and method, at the very end of the piece.
  import { t } from '../i18n.js';
  const GROUPS = [
    { h: 'srcData', items: ['srcData1', 'srcData2', 'srcData3'] },
    { h: 'srcImages', items: ['srcImg1', 'srcImg2'] },
    { h: 'srcMethod', items: ['srcM1', 'srcM2', 'srcM3', 'srcM4'] },
  ];
</script>

<div class="src">
  {#each GROUPS as g}
    <section>
      <h4>{$t(g.h)}</h4>
      <ul>{#each g.items as k}<li>{$t(k)}</li>{/each}</ul>
    </section>
  {/each}
  <p class="upd">{$t('srcUpdated')}</p>
</div>

<style>
  .src { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 1.4rem; font-family: Quicksand, sans-serif; color: #4D5A60; padding: 1.2rem 1.3rem; border-radius: 14px; background: rgba(30, 63, 92, .05); border: 1px solid rgba(30, 63, 92, .12); }
  h4 { margin: 0 0 .4rem; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #1E3F5C; }
  ul { margin: 0; padding-inline-start: 1.1rem; display: grid; gap: .35rem; }
  li { font-size: .82rem; line-height: 1.5; }
  .upd { grid-column: 1 / -1; margin: 0; font-size: .78rem; font-weight: 700; color: #8A7A6B; }
  @media (max-width: 820px) { .src { grid-template-columns: minmax(0, 1fr); } }
</style>
