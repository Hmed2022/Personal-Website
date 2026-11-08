<script>
  // Governorate profile, opened by clicking a governorate on the landmark map:
  // its outline (and where it is in Tunisia), banknote stats, and why it was featured.
  import { geoMercator, geoPath } from 'd3-geo';
  import { fly } from 'svelte/transition';
  import GOV_INFO from '../Map/Data/Governorates.json';
  import { CATEGORIES, TAG_COLOR, TAG_ICON, PROPOSED, parseBill } from './landmarkMeta.js';
  import { WHY, NEVER, COASTAL } from './govStories.js';
  import { t, isAr, lang } from '../../i18n.js';
  import { FACTS } from './govFacts.js';
  import { WHY_AR, NEVER_AR, PROPOSED_AR, CATEGORIES_AR, lmAr, cityAr } from './landmarksAr.js';

  export let open = false;
  export let gov = null;          // { name, ar, count, items, f }
  export let allCounts = [];      // landmark counts of every governorate (for the rank)

  const THUMB = import.meta.glob('./thumbs/*.webp', { eager: true, as: 'url' });
  const thumb = (n) => THUMB[`./thumbs/${n}.webp`];

  let dialog;
  $: if (dialog) { if (open && gov && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }

  // the governorate outline, fitted to its own box
  const OW = 260, OH = 220;
  $: outline = gov ? geoPath(geoMercator().fitExtent([[10, 10], [OW - 10, OH - 10]], gov.f))(gov.f) : '';

  $: items = (gov?.items || []).map((l) => ({ ...l, ...parseBill(l.bill) }));
  $: years = items.map((l) => +l.year).filter(Boolean);
  $: firstYear = years.length ? Math.min(...years) : null;
  $: lastYear = years.length ? Math.max(...years) : null;
  $: values = [...new Set(items.map((l) => l.value))].sort((a, b) => parseFloat(a.replace('½', '.5')) - parseFloat(b.replace('½', '.5')));
  $: cities = [...new Set(items.map((l) => l.city))];
  $: cats = Object.entries(items.reduce((m, l) => ((m[l.tag] = (m[l.tag] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  $: n = items.length;
  $: rank = n ? 1 + allCounts.filter((c) => c > n).length : null;
  $: tied = n ? allCounts.filter((c) => c === n).length > 1 : false;
  $: info = gov && GOV_INFO.governorates.find((g) => g.Name === gov.name);
  $: coastal = gov && COASTAL.has(gov.name);
  $: fmtPop = (p) => (p >= 1e6 ? `${(p / 1e6).toFixed(1)} ${$isAr ? 'مليون' : 'million'}` : `${Math.round(p / 1000)},000`);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (open = false)} on:click|self={() => dialog.close()}>
  {#if gov}
    {#key gov.name}
      <article class="gc" in:fly={{ y: 10, duration: 250 }}>
        <button type="button" class="close" on:click={() => dialog.close()} aria-label={$t('close')}>×</button>

        <div class="top">
          <!-- outline -->
          <figure class="shape">
            <svg viewBox="0 0 {OW} {OH}" class="outline" aria-hidden="true">
              <path d={outline} class:on={gov.count > 0} />
            </svg>
          </figure>

          <div class="head">
            <p class="kicker">{coastal ? $t('gcCoastal') : $t('gcInland')}</p>
            <h3>{gov.name} <span class="ar" lang="ar" dir="rtl">{gov.ar}</span></h3>
            {#if gov.count}
              <div class="stats">
                <div><b>{items.length}</b><span>{$t('gcOnNotes')}</span></div>
                {#if rank}<div><b>#{rank}</b><span>{$t('gcOf24')}{tied ? $t('gcTied') : ''}</span></div>{/if}
                {#if firstYear}<div><b dir="ltr">{firstYear === lastYear ? firstYear : `${firstYear}–${String(lastYear).slice(2)}`}</b><span>{firstYear === lastYear ? $t('gcIn') : $t('gcFrom')}</span></div>{/if}
              </div>
            {:else}
              <p class="never">{$isAr ? NEVER_AR : NEVER}</p>
            {/if}
            {#if info}<p class="pop">{$t('gcPop', { n: fmtPop(info.Population) })}</p>{/if}
          </div>
        </div>

        <!-- why -->
        {#if WHY[gov.name]}
          <section class="why">
            <h4>{$t('gcWhy')}</h4>
            <p>{$isAr ? WHY_AR[gov.name] : WHY[gov.name]}</p>
          </section>
        {:else if PROPOSED[gov.name]}
          <section class="why none">
            <h4>{$t('gcCould')}</h4>
            <p>{($isAr ? PROPOSED_AR[gov.name] : PROPOSED[gov.name]).join(' · ')}</p>
          </section>
        {/if}

        {#if FACTS[gov.name]}
          <section class="fact">
            <span class="fact-ico" aria-hidden="true">✦</span>
            <div><h5>{$t('gcFact')}</h5><p>{$isAr ? FACTS[gov.name].ar : FACTS[gov.name].en}</p></div>
          </section>
        {/if}

        {#if items.length}
          <!-- banknote details -->
          <section class="chips-row">
            <div>
              <h5>{$t('gcValues')}</h5>
              <div class="chips">{#each values as v}<span class="chip val">{v} {$t('dt')}</span>{/each}</div>
            </div>
            <div>
              <h5>{cities.length === 1 ? $t('gcCity') : $t('gcCities')}</h5>
              <div class="chips">{#each cities as c}<span class="chip">{$isAr ? cityAr(c) : c}</span>{/each}</div>
            </div>
          </section>
          <section>
            <h5>{$t('gcTypes')}</h5>
            <div class="cats">
              {#each cats as [tg, cnt]}
                <span class="cat" style="--tc:{TAG_COLOR[tg]}"><img src={TAG_ICON[tg]} alt="" />{$isAr ? CATEGORIES_AR[tg] : CATEGORIES[tg]} <b>{cnt}</b></span>
              {/each}
            </div>
          </section>

        {/if}
      </article>
    {/key}
  {/if}
</dialog>

<style>
  dialog {
    pointer-events: auto;   /* the map layer it lives in has pointer-events: none */
    width: min(720px, calc(100vw - 1.5rem)); max-height: calc(100vh - 2rem); padding: 0; border: none; border-radius: 16px;
    background: #FFFBF4; color: #3D2A22; box-shadow: 0 24px 60px rgba(0, 0, 0, .35); overflow: auto;
  }
  dialog::backdrop { background: rgba(30, 22, 18, .5); backdrop-filter: blur(2px); }
  dialog[open] { animation: pop .3s cubic-bezier(.34, 1.56, .64, 1); }
  @keyframes pop { from { transform: scale(.95); opacity: 0; } to { transform: none; opacity: 1; } }

  .gc { position: relative; padding: 1.2rem 1.3rem 1.3rem; text-align: start; font-family: Quicksand, sans-serif; border-top: 6px solid #1E5B8C; }
  .close { position: absolute; top: .8rem; inset-inline-end: .8rem; width: 2.1rem; height: 2.1rem; border: none; border-radius: 50%; background: #F1E8DC; font-size: 1.3rem; line-height: 1; cursor: pointer; color: #3D2A22; }

  .top { display: grid; grid-template-columns: 230px 1fr; gap: 1.2rem; align-items: center; }
  .shape { position: relative; margin: 0; background: #F6EEE3; border-radius: 14px; padding: .4rem; }
  .outline { display: block; width: 100%; height: auto; }
  .outline path { fill: #FFFFFF; stroke: #557C81; stroke-width: 2; stroke-linejoin: round; }
  .outline path.on { fill: #DBC1A0; }

  .kicker { margin: 0; font-size: .7rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #B5523B; }
  h3 { margin: .15rem 0 .6rem; font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; color: #1E3F5C; display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap; }
  h3 .ar { font-size: 1.15rem; color: #B5523B; font-weight: 400; }
  .stats { display: flex; flex-wrap: wrap; gap: .5rem; }
  .stats div { display: flex; flex-direction: column; padding: .45rem .7rem; border-radius: 10px; background: #F6EEE3; min-width: 5.5rem; }
  .stats b { font-size: 1.35rem; color: #1E3F5C; line-height: 1.1; }
  .stats span { font-size: .7rem; font-weight: 700; color: #8A7A6B; }
  .never { margin: 0; padding: .55rem .75rem; border-radius: 10px; background: #FBEFF1; color: #9D4F62; font-weight: 700; font-size: .88rem; }
  .pop { margin: .5rem 0 0; font-size: .8rem; color: #7A8B92; }

  section { margin-top: 1.1rem; }
  .why { padding: .8rem 1rem; border-radius: 12px; background: #EEF4F6; border-inline-start: 4px solid #1E5B8C; }
  .why.none { background: #FBEFF1; border-inline-start-color: #D9669B; }
  h4 { margin: 0 0 .3rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; color: #1E3F5C; }
  .why p { margin: 0; font-size: .92rem; line-height: 1.55; }
  h5 { margin: 0 0 .4rem; font-size: .7rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #8A7A6B; }
  .chips-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .chips { display: flex; flex-wrap: wrap; gap: .35rem; }
  .chip { padding: .2rem .6rem; border-radius: 999px; background: #FFFFFF; border: 1px solid #E6DCCF; font-size: .8rem; font-weight: 700; color: #4D6473; }
  .chip.val { color: #8C4D3F; }
  .cats { display: flex; flex-wrap: wrap; gap: .4rem .9rem; }
  .cat { display: inline-flex; align-items: center; gap: .35rem; font-size: .8rem; font-weight: 700; color: var(--tc); }
  .cat img { width: 1.1rem; height: 1.1rem; border-radius: 3px; background: var(--tc); }
  .cat b { color: #3D2A22; }
  .fact { display: flex; gap: .7rem; align-items: flex-start; padding: .8rem 1rem; border-radius: 12px; background: #FBF3E2; border: 1px dashed #D9A441; }
  .fact-ico { flex: 0 0 auto; width: 2rem; height: 2rem; border-radius: 50%; display: grid; place-items: center; background: #D9A441; color: #FFFFFF; font-size: 1rem; }
  .fact h5 { margin: 0 0 .2rem; color: #A4731C; }
  .fact p { margin: 0; font-size: .92rem; line-height: 1.55; }
  .lms { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: .6rem; }
  .lm { margin: 0; border-radius: 10px; overflow: hidden; background: #FFFFFF; border: 1px solid #EADFD3; }
  .lm img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #EEE4D6; }
  .lm figcaption { display: flex; flex-direction: column; padding: .4rem .5rem .5rem; font-size: .74rem; line-height: 1.3; }
  .lm figcaption span { color: #8C4D3F; font-weight: 700; margin-top: .1rem; }

  @media (max-width: 600px) {
    .top { grid-template-columns: 1fr; }
    .shape { max-width: 260px; margin: 0 auto; }
    h3 { font-size: 1.6rem; }
    .chips-row { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
</style>
