<script>
  // Closing section: three takeaways and a last line.
  import { t } from '../i18n.js';
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
  <p class="last">{$t('endLast')}</p>
</div>

<style>
  .end { font-family: Quicksand, sans-serif; color: #3D2A22; text-align: center; }
  .lead { margin: 0 auto 1.3rem; max-width: 40rem; font-size: 1.05rem; }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: start; }
  article { background: color-mix(in srgb, var(--ec) 9%, transparent); border: 1px solid color-mix(in srgb, var(--ec) 22%, transparent); border-top: 5px solid var(--ec); border-radius: 12px; padding: 1rem 1.1rem 1.1rem; }
  .num { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 800; color: var(--ec); line-height: 1.1; }
  h4 { margin: .3rem 0 .4rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: #1E3F5C; }
  article p { margin: 0; font-size: .9rem; line-height: 1.55; }
  .last { margin: 1.6rem auto 0; max-width: 34rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; font-style: italic; color: #1E3F5C; }
  @media (max-width: 820px) { .cards { grid-template-columns: minmax(0, 1fr); } }
</style>
