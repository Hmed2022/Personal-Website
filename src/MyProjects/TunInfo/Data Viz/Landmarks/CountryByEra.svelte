<script>
  // "What kind of country do the notes show?": the 60 landmarks, one square each,
  // grouped by the era of the note they appeared on and coloured by category.
  import { landmarks } from './landmarksMap.js';
  import { CATEGORIES, TAG_COLOR, TAG_ICON } from './landmarkMeta.js';
  import { CATEGORIES_AR, lmAr } from './landmarksAr.js';
  import { t, isAr, money } from '../../i18n.js';
  import { parseBill } from './landmarkMeta.js';

  const THUMB = import.meta.glob('./thumbs/*.webp', { eager: true, as: 'url' });
  const icon = (tag) => TAG_ICON[tag];
  const ORDER = ['infra', 'indus', 'nat', 'roman', 'islam', 'urban', 'cult', 'gov'];

  const ERAS = [
    { key: 'eraBourguiba', from: 0, to: 1987, ink: '#025E73', tint: 'rgba(3, 136, 166, .10)', blurb: 'ccB' },
    { key: 'eraBenAli', from: 1987, to: 2011, ink: '#7C4A8C', tint: 'rgba(124, 74, 140, .10)', blurb: 'ccBA' },
    { key: 'eraRevolution', from: 2011, to: 9999, ink: '#BF5630', tint: 'rgba(191, 86, 48, .10)', blurb: 'ccR' },
  ];
  const items = landmarks.map((l) => ({ ...l, ...parseBill(l.bill) }));
  const groups = ERAS.map((e) => {
    const list = items.filter((l) => +l.year >= e.from && +l.year < e.to).sort((a, b) => ORDER.indexOf(a.tag) - ORDER.indexOf(b.tag));
    const n = (tags) => list.filter((l) => tags.includes(l.tag)).length;
    return {
      ...e, list,
      vars: e.blurb === 'ccB' ? { p: Math.round((n(['infra', 'indus']) / list.length) * 100) }
          : e.blurb === 'ccBA' ? { p: Math.round((n(['roman', 'islam', 'cult', 'urban']) / list.length) * 100) }
          : { a: n(['roman']), b: n(['cult', 'gov']) },
    };
  });
  const present = ORDER.filter((tag) => items.some((l) => l.tag === tag));

  let hotTag = null;
  let hotItem = null;
  $: catName = (k) => ($isAr ? CATEGORIES_AR[k] : CATEGORIES[k]);
</script>

<div class="cc">
  <div class="legend" on:pointerleave={() => (hotTag = null)}>
    {#each present as tag}
      <button type="button" class="leg" class:dim={hotTag && hotTag !== tag} style="--tc:{TAG_COLOR[tag]}"
              on:pointerenter={() => (hotTag = tag)} on:focus={() => (hotTag = tag)} on:blur={() => (hotTag = null)}>
        <img src={icon(tag)} alt="" />{catName(tag)}
      </button>
    {/each}
  </div>
  <p class="hint">{$t('ccHint')}</p>

  <div class="eras">
    {#each groups as g}
      <section class="era" style="--ec:{g.ink}; --et:{g.tint}">
        <h4>{$t(g.key)}</h4>
        <p class="count">{$t('ccLandmarks', { n: g.list.length })}</p>
        <div class="grid" on:pointerleave={() => (hotItem = null)}>
          {#each g.list as l}
            <button type="button" class="sq" class:dim={(hotTag && l.tag !== hotTag) || (hotItem && hotItem !== l)}
                    style="--tc:{TAG_COLOR[l.tag]}" on:pointerenter={() => (hotItem = l)} on:focus={() => (hotItem = l)}
                    aria-label={`${$isAr ? lmAr(l.landmark) : l.landmark}, ${l.year}`}>
              <img src={icon(l.tag)} alt="" />
            </button>
          {/each}
        </div>
        <p class="readout">
          {#if hotItem && g.list.includes(hotItem)}
            <b>{$isAr ? lmAr(hotItem.landmark) : hotItem.landmark}</b> · {$money(hotItem.value === '½' ? 0.5 : +hotItem.value)}, {hotItem.year}
          {:else}
            {@html $t(g.blurb, g.vars)}
          {/if}
        </p>
      </section>
    {/each}
  </div>
</div>

<style>
  .cc { font-family: Quicksand, sans-serif; color: #3D2A22; }
  .legend { display: flex; flex-wrap: wrap; gap: .35rem .5rem; justify-content: center; }
  .leg { display: inline-flex; align-items: center; gap: .35rem; padding: .25rem .6rem .25rem .3rem; border-radius: 999px; border: 1.5px solid color-mix(in srgb, var(--tc) 35%, transparent); background: color-mix(in srgb, var(--tc) 12%, transparent); font: 700 .78rem Quicksand, sans-serif; color: var(--tc); cursor: default; transition: opacity .2s; }
  .leg img { width: 1.1rem; height: 1.1rem; border-radius: 4px; background: var(--tc); }
  .leg.dim { opacity: .35; }
  .hint { margin: .4rem 0 1.1rem; text-align: center; font-size: .78rem; color: #7A8B92; }

  .eras { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 1rem; align-items: start; }
  .era { background: var(--et); border: 1px solid color-mix(in srgb, var(--ec) 25%, transparent); border-top: 5px solid var(--ec); border-radius: 12px; padding: .9rem 1rem 1rem; }
  .era h4 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: var(--ec); }
  .count { margin: .1rem 0 .7rem; font-size: .8rem; font-weight: 700; color: #7A8B92; }
  .grid { display: flex; flex-wrap: wrap; gap: 5px; }
  .sq { width: 30px; height: 30px; padding: 4px; border: none; border-radius: 6px; background: var(--tc); cursor: pointer; transition: opacity .2s, transform .15s; }
  .sq img { width: 100%; height: 100%; display: block; }
  .sq:hover, .sq:focus-visible { transform: scale(1.15); }
  .sq.dim { opacity: .18; }
  .readout { margin: .8rem 0 0; min-height: 3em; font-size: .86rem; line-height: 1.5; }
  .readout :global(b) { color: #3D2A22; }

  @media (max-width: 820px) {
    .eras { grid-template-columns: minmax(0, 1fr); }
    .sq { width: 26px; height: 26px; }
  }
</style>
