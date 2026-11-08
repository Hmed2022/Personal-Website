<script>
  // New landmark explorer (Landmark.svelte is kept). Pick a governorate on the map (or the
  // list on phones), filter by city or category, open any landmark in a larger view.
  import { geoMercator, geoPath } from 'd3-geo';
  import { fade, scale, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import Tun from '../Map/Data/Tunisia.geojson.json';
  import { landmarks } from './landmarksMap.js';
  import { CATEGORIES, TAG_COLOR, TAG_ICON, PROPOSED, parseBill } from './landmarkMeta.js';
  import { t, isAr, money, pick as pickLang } from '../../i18n.js';
  import { lmAr, cityAr, CATEGORIES_AR, PROPOSED_AR } from './landmarksAr.js';
  $: catName = (k) => ($isAr ? CATEGORIES_AR[k] : CATEGORIES[k]);
  $: lmName = (n) => ($isAr ? lmAr(n) : n);
  $: cityName = (c) => ($isAr ? cityAr(c) : c);

  const CARD = import.meta.glob('./cards/*.webp', { eager: true, as: 'url' });
  const THUMB = import.meta.glob('./thumbs/*.webp', { eager: true, as: 'url' });
  const card = (n) => CARD[`./cards/${n}.webp`];
  const icon = (tag) => TAG_ICON[tag];

  // ---------- map ----------
  const W = 300, H = 480;
  const projection = geoMercator().fitExtent([[8, 8], [W - 8, H - 8]], Tun);
  const path = geoPath(projection);
  const items = landmarks.map((l, id) => ({ ...l, id, ...parseBill(l.bill) }));
  const byGov = {};
  for (const l of items) (byGov[l.gov] = byGov[l.gov] || []).push(l);

  const govs = Tun.features
    .map((f) => {
      const name = f.properties.gouv_fr;
      const list = byGov[name] || [];
      return { name, ar: f.properties.gouv_ar, count: f.properties.landmarks, list, cities: [...new Set(list.map((l) => l.city))].sort(), d: path(f) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // warm ramp by number of landmarks (0 = paper white)
  function fillOf(n) {
    if (!n) return '#FFFFFF';
    if (n === 1) return '#EBD9C1';
    if (n === 2) return '#DBC1A0';
    if (n <= 4) return '#C9A277';
    return '#A9754B';
  }

  let selected = govs.find((g) => g.name === 'Tunis');
  let hovered = null;
  let city = 'All';
  let cat = 'All';
  function pick(g) { selected = g; city = 'All'; cat = 'All'; }

  $: catsHere = [...new Set(selected.list.map((l) => l.tag))];
  $: shown = selected.list.filter((l) => (city === 'All' || l.city === city) && (cat === 'All' || l.tag === cat));
  $: years = selected.list.map((l) => +l.year).filter(Boolean);
  $: span = years.length ? (Math.min(...years) === Math.max(...years) ? `${years[0]}` : `${Math.min(...years)} – ${Math.max(...years)}`) : '';

  // ---------- lightbox ----------
  let open = null;   // index in `shown`
  $: current = open != null ? shown[open] : null;
  function step(d) { open = (open + d + shown.length) % shown.length; }
  function onKey(e) {
    if (open == null) return;
    if (e.key === 'Escape') open = null;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  }
</script>

<svelte:window on:keydown={onKey} />

<section class="lx">
  <!-- ===== left: map + governorate ===== -->
  <aside class="side">
    <svg dir="ltr" viewBox="0 0 {W} {H}" role="group" aria-label={$t('lxChoose')}>
      {#each govs as g (g.name)}
        <path d={g.d} fill={g === selected ? '#1E5B8C' : g === hovered ? '#9D6D79' : fillOf(g.count)}
              class="gov" class:sel={g === selected}
              on:click={() => pick(g)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(g)}
              on:pointerenter={() => (hovered = g)} on:pointerleave={() => (hovered = null)}
              tabindex="0" role="button" aria-pressed={g === selected} aria-label={`${$pickLang(g.name, g.ar)}, ${$t('lmLandmarks', { n: g.count })}`}>
          <title>{$pickLang(g.name, g.ar)}: {g.count}</title>
        </path>
      {/each}
    </svg>
    <p class="map-hover">{hovered ? `${$pickLang(hovered.name, hovered.ar)} · ${hovered.count} ${hovered.count === 1 ? $t('lxLandmark') : $t('lxLandmarks')}` : $t('lxClick')}</p>
    <div class="scale" aria-hidden="true">
      <span><i style="background:#FFFFFF"></i>0</span><span><i style="background:#EBD9C1"></i>1</span>
      <span><i style="background:#DBC1A0"></i>2</span><span><i style="background:#C9A277"></i>3–4</span>
      <span><i style="background:#A9754B"></i>26</span>
    </div>

    <!-- phones: a list instead of tapping tiny governorates -->
    <label class="gov-select">
      <span>{$t('lxGov')}</span>
      <select value={selected.name} on:change={(e) => pick(govs.find((g) => g.name === e.target.value))}>
        {#each govs as g}<option value={g.name}>{$pickLang(g.name, g.ar)} ({g.count})</option>{/each}
      </select>
    </label>
  </aside>

  <!-- ===== right: details ===== -->
  <div class="main">
    {#key selected}
      <header class="g-head" in:fly={{ y: 8, duration: 250 }}>
        <div>
          <h3>
            <label class="name-pick" title={$t('lxOther')}>
              <span class="name-text" lang="en">{selected.name}</span>
              <svg class="caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" /></svg>
              <select aria-label={$t('lxGov')} value={selected.name} on:change={(e) => pick(govs.find((g) => g.name === e.target.value))}>
                {#each govs as g}<option value={g.name}>{$pickLang(g.name, g.ar)} ({g.count})</option>{/each}
              </select>
            </label>
            <span class="ar" lang="ar" dir="rtl">{selected.ar}</span>
          </h3>
          {#if selected.count}
            <p class="stats">
              <span><b>{selected.list.length}</b> {selected.list.length === 1 ? $t('lxLandmark') : $t('lxLandmarks')}</span>
              <span><b>{selected.cities.length}</b> {selected.cities.length === 1 ? $t('lxCity') : $t('lxCities')}</span>
              {#if span}<span>{$t('lxFrom')} <b dir="ltr">{span}</b></span>{/if}
            </p>
          {/if}
        </div>
      </header>
    {/key}

    {#if selected.list.length}
      <div class="filters">
        {#if selected.cities.length > 1}
          <div class="chips" role="group" aria-label={$t('lxCityLbl')}>
            {#each ['All', ...selected.cities] as c}
              <button type="button" class="chip" class:on={city === c} on:click={() => (city = c)}>{c === 'All' ? $t('lxAllCities') : cityName(c)}</button>
            {/each}
          </div>
        {/if}
        {#if catsHere.length > 1}
          <div class="chips" role="group" aria-label={$t('lxCatLbl')}>
            <button type="button" class="chip" class:on={cat === 'All'} on:click={() => (cat = 'All')}>{$t('lxAllTypes')}</button>
            {#each catsHere as tk}
              <button type="button" class="chip cat" class:on={cat === tk} style="--tc:{TAG_COLOR[tk]}" on:click={() => (cat = tk)}>
                <img src={icon(tk)} alt="" style="background:{TAG_COLOR[tk]}" />{catName(tk)}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="grid">
        {#each shown as l, i (l.id)}
          <button type="button" class="card" animate:flip={{ duration: 300 }} in:scale={{ duration: 250, start: .92 }}
                  on:click={() => (open = i)} aria-label={`${lmName(l.landmark)}, ${l.value} ${$t('dt')} ${l.year}`}>
            <span class="pic"><img src={card(l.img)} alt="" loading="lazy" /></span>
            <span class="bill">{l.value} <small>{$t('dt')}</small> · {l.year}</span>
            <span class="body">
              <span class="name">{lmName(l.landmark)}</span>
              <span class="where">{cityName(l.city)}</span>
              {#if l.tag}<span class="tag" style="--tc:{TAG_COLOR[l.tag]}"><img src={icon(l.tag)} alt="" />{catName(l.tag)}</span>{/if}
            </span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="empty" in:fade>
        <p class="never">{$t('lxNever', { g: $pickLang(selected.name, selected.ar) })}</p>
        {#if PROPOSED[selected.name]}
          <p class="could"><span>{$t('lxCould')}</span> {$isAr ? PROPOSED_AR[selected.name].join('، ') : PROPOSED[selected.name].join(', ')}</p>
        {/if}
      </div>
    {/if}
  </div>
</section>

<!-- ===== lightbox ===== -->
{#if current}
  <!-- svelte-ignore a11y-click-events-have-key-events (Escape closes it, see onKey) -->
  <div class="lb" transition:fade={{ duration: 150 }} on:click|self={() => (open = null)} role="dialog" aria-modal="true" aria-label={lmName(current.landmark)}>
    <figure in:scale={{ duration: 200, start: .95 }}>
      <button type="button" class="lb-close" on:click={() => (open = null)} aria-label={$t('close')}>×</button>
      {#if shown.length > 1}
        <button type="button" class="lb-nav prev" on:click={() => step(-1)} aria-label={$t('lxPrev')}>‹</button>
        <button type="button" class="lb-nav next" on:click={() => step(1)} aria-label={$t('lxNext')}>›</button>
        <span class="lb-count">{open + 1} / {shown.length}</span>
      {/if}
      {#key current.id}<img src={card(current.img)} alt={lmName(current.landmark)} in:fade={{ duration: 200 }} />{/key}
      <figcaption>
        <div>
          <h4>{lmName(current.landmark)}</h4>
          <p>{cityName(current.city)}{$isAr ? '،' : ','} {$isAr ? (govs.find((g) => g.name === current.gov)?.ar || current.gov) : current.gov} · <b>{$money(current.value === '½' ? 0.5 : +current.value)}, {current.year}</b></p>
          {#if current.tag}<span class="tag" style="--tc:{TAG_COLOR[current.tag]}"><img src={icon(current.tag)} alt="" />{catName(current.tag)}</span>{/if}
        </div>
        {#if current.url}<a href={current.url} target="_blank" rel="noopener noreferrer">{$t('lxReadMore')}</a>{/if}
      </figcaption>
    </figure>
  </div>
{/if}

<style>
  .lx {
    display: grid; grid-template-columns: minmax(220px, 300px) 1fr; gap: 2rem;
    max-width: 1100px; margin: 1.5rem auto 3rem; padding: 0 1rem; box-sizing: border-box;
    font-family: Quicksand, sans-serif; color: #3D2A22;
  }

  /* ---- side ---- */
  .side { position: sticky; top: 1rem; align-self: start; text-align: center; }
  svg { width: 100%; height: auto; max-height: 70vh; display: block; }
  .gov { stroke: #91B4BA; stroke-width: 1; cursor: pointer; transition: fill .2s; outline: none; }
  .gov.sel { stroke: #0F3553; stroke-width: 1.8; }
  .gov:focus-visible { stroke: #B5523B; stroke-width: 2.4; }
  .map-hover { margin: .3rem 0 .4rem; font-size: .85rem; font-weight: 700; color: #4D6473; min-height: 1.2em; }
  .scale { display: flex; justify-content: center; gap: .55rem; font-size: .7rem; font-weight: 700; color: #4D6473; }
  .scale i { display: inline-block; width: .75rem; height: .75rem; border: 1px solid #91B4BA; border-radius: 2px; margin-inline-end: .2rem; vertical-align: -.1rem; }
  .gov-select { display: none; }

  /* ---- header ---- */
  .g-head h3 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 2.1rem; font-weight: 800; color: #1E3F5C; display: flex; align-items: baseline; gap: .7rem; flex-wrap: wrap; }
  /* the governorate name is itself a dropdown: a native <select> laid invisibly over it */
  .name-pick { position: relative; display: inline-flex; align-items: center; gap: .45rem; cursor: pointer; border-radius: 10px; padding: 0 .35rem 0 0; transition: background .15s; }
  .name-pick:hover, .name-pick:focus-within { background: #EEF4F6; }
  .name-pick:focus-within { outline: 2px solid #1E5B8C; outline-offset: 2px; }
  .caret { width: .9rem; height: .6rem; margin-top: .2rem; fill: none; stroke: #1E5B8C; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .name-pick select { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; font-size: 1rem; }
  .g-head .ar { font-family: 'HacenSaudi', sans-serif; font-size: 1.3rem; font-weight: 400; color: #B5523B; }
  .stats { display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; margin: .35rem 0 0; font-size: .9rem; color: #4D6473; }
  .stats b { font-size: 1.15rem; color: #B5523B; }

  /* ---- filters ---- */
  .filters { display: grid; gap: .5rem; margin: 1rem 0 1.1rem; }
  .chips { display: flex; flex-wrap: wrap; gap: .4rem; }
  .chip {
    font: 700 .8rem Quicksand, sans-serif; color: #4D6473; cursor: pointer;
    background: rgba(255, 255, 255, .45); border: 1.5px solid #C8D9DC; border-radius: 999px; padding: .3rem .75rem;
    display: inline-flex; align-items: center; gap: .35rem; transition: background .15s, color .15s, border-color .15s;
  }
  .chip:hover { border-color: #91B4BA; }
  .chip.on { background: #1E5B8C; border-color: #1E5B8C; color: #FFFFFF; }
  .chip.cat.on { background: var(--tc); border-color: var(--tc); }
  .chip img { width: 1rem; height: 1rem; border-radius: 3px; }

  /* ---- cards ---- */
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1rem; }
  .card {
    position: relative; display: flex; flex-direction: column; padding: 0; text-align: left; cursor: pointer;
    background: rgba(140, 77, 63, .05); border: 1px solid rgba(140, 77, 63, .16); border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 8px rgba(61, 42, 34, .08); font-family: inherit; color: inherit;
    transition: transform .2s, box-shadow .2s;
  }
  .card:hover, .card:focus-visible { transform: translateY(-4px); box-shadow: 0 10px 22px rgba(61, 42, 34, .16); }
  .pic { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #EEE4D6; }
  .pic img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
  .card:hover .pic img { transform: scale(1.05); }
  .bill {
    position: absolute; top: .55rem; right: .55rem; padding: .15rem .5rem; border-radius: 999px;
    background: rgba(253, 246, 245, .94); color: #8C4D3F; font-size: .78rem; font-weight: 800; box-shadow: 0 1px 4px rgba(0, 0, 0, .15);
  }
  .bill small { font-size: .65rem; }
  .body { display: flex; flex-direction: column; gap: .2rem; padding: .7rem .8rem .8rem; }
  .name { font-weight: 800; font-size: .95rem; line-height: 1.3; color: #1E3F5C; }
  .where { font-size: .8rem; font-weight: 600; color: #8C4D3F; }
  .tag { display: inline-flex; align-items: center; gap: .3rem; margin-top: .2rem; font-size: .72rem; font-weight: 700; color: var(--tc); }
  .tag img { width: .95rem; height: .95rem; border-radius: 3px; background: var(--tc); }

  .empty { margin-top: 1.2rem; padding: 1.3rem 1.4rem; border-radius: 12px; background: #FBEFF1; border: 1px dashed #E6A9B6; }
  .never { margin: 0; font-weight: 700; color: #9D4F62; }
  .could { margin: .5rem 0 0; }
  .could span { font-weight: 700; color: #1E5B8C; }

  /* ---- lightbox ---- */
  .lb { position: fixed; inset: 0; z-index: 2000; background: rgba(20, 28, 36, .78); display: grid; place-items: center; padding: 1rem; }
  .lb figure { position: relative; margin: 0; width: min(860px, 100%); background: #FFFBF4; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, .4); }
  .lb figure > img { display: block; width: 100%; max-height: 70vh; object-fit: contain; background: #1B1B1B; }
  .lb figcaption { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; padding: .9rem 1.1rem 1rem; font-family: Quicksand, sans-serif; }
  .lb h4 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #1E3F5C; }
  .lb p { margin: .2rem 0 .3rem; font-size: .88rem; color: #4D6473; }
  .lb p b { color: #8C4D3F; }
  .lb a { flex: 0 0 auto; font-weight: 700; font-size: .85rem; color: #1E5B8C; }
  .lb-close { position: absolute; top: .5rem; right: .6rem; z-index: 2; width: 2.2rem; height: 2.2rem; border: none; border-radius: 50%; background: rgba(255, 255, 255, .9); font-size: 1.4rem; line-height: 1; cursor: pointer; }
  .lb-nav { position: absolute; top: 35%; z-index: 2; width: 2.6rem; height: 2.6rem; border: none; border-radius: 50%; background: rgba(255, 255, 255, .9); font-size: 1.6rem; line-height: 1; cursor: pointer; }
  .lb-nav.prev { left: .6rem; } .lb-nav.next { right: .6rem; }
  .lb-count { position: absolute; top: .7rem; left: .8rem; padding: .1rem .5rem; border-radius: 999px; background: rgba(0, 0, 0, .55); color: #FFF; font: 700 .75rem Quicksand, sans-serif; }

  /* ---- phones ---- */
  @media (max-width: 760px) {
    .lx { grid-template-columns: 1fr; gap: 1rem; }
    .side { position: static; display: grid; grid-template-columns: 38% 1fr; gap: .8rem; align-items: center; text-align: left; }
    .side svg { grid-row: span 2; max-height: 40vh; }
    .map-hover { display: none; }
    .scale { justify-content: flex-start; flex-wrap: wrap; }
    /* .gov-select { display: grid; ... }  replaced by the dropdown on the governorate name */
    .gov-select select { font: 700 1rem Quicksand, sans-serif; color: #1E5B8C; background: #FFFFFF; border: 1.5px solid #C8D9DC; border-radius: 8px; padding: .45rem .5rem; }
    .g-head h3 { font-size: 1.6rem; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .7rem; }
    .name { font-size: .85rem; }
    .chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: .2rem; scrollbar-width: none; }
    .chip { flex: 0 0 auto; }
    .lb figcaption { flex-direction: column; align-items: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) {
    .card, .pic img, .gov { transition: none; }
  }
</style>
