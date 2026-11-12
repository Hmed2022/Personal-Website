<script>
  // New landmark explorer (Landmark.svelte is kept). Pick a governorate on the map (or the
  // list on phones), filter by city or category, open any landmark in a larger view.
  import { geoMercator, geoPath } from 'd3-geo';
  import { freehandFor } from './freehand.js';   // Dali's hand-drawn borders
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
  const freehand = freehandFor(projection);
  // Grand Tunis is tiny on this map: a zoomed circle on the right shows (and lets you click) its four governorates
  const GRAND_TUNIS = new Set(['Tunis', 'Ariana', 'Ben Arous', 'Manouba']);
  const ZOOM_W = 92;                                   // extra room on the right of the map for the circle
  const items = landmarks.map((l, id) => ({ ...l, id, ...parseBill(l.bill) }));
  const byGov = {};
  for (const l of items) (byGov[l.gov] = byGov[l.gov] || []).push(l);

  const govs = Tun.features
    .map((f) => {
      const [cx, cy] = path.centroid(f);
      const name = f.properties.gouv_fr;
      const list = byGov[name] || [];
      // the capital's governorate is written تونس العاصمة, so it is not confused with the country
      return { name, ar: name === 'Tunis' ? 'تونس العاصمة' : f.properties.gouv_ar, count: f.properties.landmarks, list, cities: [...new Set(list.map((l) => l.city))].sort(), d: freehand(f), cx, cy, b: path.bounds(f) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // "Tunisia": every landmark of every governorate, first in the dropdown
  const ALL = { name: 'Tunisia', ar: 'تونس', all: true, count: items.length, list: items, cities: [...new Set(items.map((l) => l.city))].sort() };
  const choices = [ALL, ...govs];
  const GT = govs.filter((g) => GRAND_TUNIS.has(g.name));
  const gtB = GT.map((g) => g.b).reduce((a, b) => [[Math.min(a[0][0], b[0][0]), Math.min(a[0][1], b[0][1])], [Math.max(a[1][0], b[1][0]), Math.max(a[1][1], b[1][1])]]);
  const GX = (gtB[0][0] + gtB[1][0]) / 2, GY = (gtB[0][1] + gtB[1][1]) / 2, GR = Math.max(gtB[1][0] - gtB[0][0], gtB[1][1] - gtB[0][1]) / 2 + 2;
  const ICX = W + ZOOM_W / 2 - 4, ICY = 92, IR = 44, ZK = (IR - 4) / GR;
  const zp = (x, y) => [ICX + (x - GX) * ZK, ICY + (y - GY) * ZK];
  const connector = `M${(GX + GR * .8).toFixed(1)},${(GY - GR * .5).toFixed(1)} Q${((GX + ICX) / 2).toFixed(1)},${(Math.min(GY, ICY) - 30).toFixed(1)} ${(ICX - IR * .92).toFixed(1)},${(ICY - IR * .3).toFixed(1)}`;
  const govAr = (name) => govs.find((g) => g.name === name)?.ar || name;

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
  // hover: the governorate gets a red outline and a small tooltip by the cursor (name + landmarks)
  let tipX = 0, tipY = 0, pageEl;
  function hoverAt(e, g) { hovered = g; const r = pageEl.getBoundingClientRect(); tipX = e.clientX - r.left; tipY = e.clientY - r.top; }
  let city = 'All';
  let cat = 'All';
  function pick(g) { selected = g; city = 'All'; cat = 'All'; }

  $: catsHere = [...new Set(selected.list.map((l) => l.tag))];
  // a filter that would leave nothing (given the other filter) is greyed out
  $: cityHas = (c) => selected.list.some((l) => (c === 'All' || l.city === c) && (cat === 'All' || l.tag === cat));
  $: catHas = (tk) => selected.list.some((l) => (city === 'All' || l.city === city) && (tk === 'All' || l.tag === tk));
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
    <!-- Dali's map again, on a taped notebook page -->
    <div class="lx-page" bind:this={pageEl}>
    <span class="lx-tape" aria-hidden="true"></span>
    <svg dir="ltr" viewBox="0 0 {W + ZOOM_W} {H}" role="group" aria-label={$t('lxChoose')}>
      <defs>
        <filter id="lx-marker" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.4" result="b" />
          <feComponentTransfer in="b"><feFuncA type="table" tableValues="0 0 .9 1 1" /></feComponentTransfer>
        </filter>
        <!-- pencil strokes over the colours, so they look coloured in by hand -->
        <pattern id="lx-pencil" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="1.5" x2="6" y2="1.5" stroke="#FFFDF6" stroke-width="1.3" opacity=".55" />
          <line x1="0" y1="4.4" x2="6" y2="4.4" stroke="#3D2A22" stroke-width=".7" opacity=".12" />
        </pattern>
      </defs>
      {#each govs as g (g.name)}
        <path d={g.d} fill={g === selected ? '#1E5B8C' : fillOf(g.count)}
              class="gov" class:sel={g === selected}
              on:click={() => pick(g)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(g)}
              on:pointermove={(e) => hoverAt(e, g)} on:pointerleave={() => (hovered = null)}
              tabindex="0" role="button" aria-pressed={g === selected} aria-label={`${$pickLang(g.name, g.ar)}, ${$t('lmLandmarks', { n: g.count })}`}>
        </path>
      {/each}
      <g aria-hidden="true" style="pointer-events:none">{#each govs as g (g.name)}<path d={g.d} fill="url(#lx-pencil)" />{/each}</g>
      <g class="lx-ink" filter="url(#lx-marker)" aria-hidden="true">{#each govs as g (g.name)}<path d={g.d} />{/each}</g>
      {#if hovered}<path d={hovered.d} class="lx-hover" filter="url(#lx-marker)" aria-hidden="true" />{/if}
      <!-- Grand Tunis, zoomed and clickable -->
      <g class="gt">
        <clipPath id="lx-gt-clip"><circle cx={ICX} cy={ICY} r={IR} /></clipPath>
        <circle cx={ICX} cy={ICY} r={IR} fill="#FFFDF6" />
        <g clip-path="url(#lx-gt-clip)"><g transform="translate({ICX} {ICY}) scale({ZK}) translate({-GX} {-GY})">
          {#each GT as g (g.name)}
            <path d={g.d} fill={g === selected ? '#1E5B8C' : fillOf(g.count)} class="gov" class:sel={g === selected}
                  on:click={() => pick(g)} on:pointermove={(e) => hoverAt(e, g)} on:pointerleave={() => (hovered = null)}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(g)}
                  tabindex="0" role="button" aria-label={`${$pickLang(g.name, g.ar)}, ${$t('lmLandmarks', { n: g.count })}`} />
          {/each}
          {#each GT as g (g.name)}<path d={g.d} class="gt-ink" vector-effect="non-scaling-stroke" class:hot={g === hovered} />{/each}
        </g></g>
        <g filter="url(#lx-marker)" aria-hidden="true">
          <circle cx={ICX} cy={ICY} r={IR} class="gt-ring" />
          <circle cx={GX} cy={GY} r={GR} class="gt-ring" />
          <path d={connector} class="gt-ring" />
        </g>
        <text x={ICX} y={ICY + IR + 15} class="gt-cap" aria-hidden="true">{$t('lxGrandTunis')}</text>
      </g>
    </svg>
    {#if hovered}
      <div class="lx-tip" style="left:{tipX}px; top:{tipY}px" aria-hidden="true">
        <b>{$pickLang(hovered.name, hovered.ar)}</b>
        <span>{hovered.count} {hovered.count === 1 ? $t('lxLandmark') : $t('lxLandmarks')}</span>
      </div>
    {/if}
    </div>
    <p class="map-hover">{$t('lxClick')}</p>
    <div class="scale" aria-hidden="true">
      <span><i style="background:#FFFFFF"></i>0</span><span><i style="background:#EBD9C1"></i>1</span>
      <span><i style="background:#DBC1A0"></i>2</span><span><i style="background:#C9A277"></i>3–4</span>
      <span><i style="background:#A9754B"></i>26</span>
    </div>

    <!-- filters sit under the map -->
    {#if selected.list.length}
      <!-- two dropdowns: city and type -->
      <div class="filters">
        {#if selected.cities.length > 1 && !selected.all}
          <label class="dd">
            <span>{$t('lxCityLbl')}</span>
            <select bind:value={city}>
              {#each ['All', ...selected.cities] as c}
                <option value={c} disabled={!cityHas(c)}>{c === 'All' ? $t('lxAllCities') : cityName(c)}</option>
              {/each}
            </select>
          </label>
        {/if}
        {#if catsHere.length > 1}
          <label class="dd" style="--tc:{cat === 'All' ? '#1E5B8C' : TAG_COLOR[cat]}">
            <span>{$t('lxCatLbl')}</span>
            <span class="dd-box">
              {#if cat !== 'All'}<img src={icon(cat)} alt="" style="background:{TAG_COLOR[cat]}" />{/if}
              <select bind:value={cat}>
                <option value="All">{$t('lxAllTypes')}</option>
                {#each catsHere as tk}<option value={tk} disabled={!catHas(tk)}>{catName(tk)}</option>{/each}
              </select>
            </span>
          </label>
        {/if}
      </div>
    {/if}

    <!-- phones: a list instead of tapping tiny governorates -->
    <label class="gov-select">
      <span>{$t('lxGov')}</span>
      <select value={selected.name} on:change={(e) => pick(choices.find((g) => g.name === e.target.value))}>
        {#each choices as g}<option value={g.name}>{$pickLang(g.name, g.ar)} ({g.count})</option>{/each}
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
              <select aria-label={$t('lxGov')} value={selected.name} on:change={(e) => pick(choices.find((g) => g.name === e.target.value))}>
                {#each choices as g}<option value={g.name}>{$pickLang(g.name, g.ar)} ({g.count})</option>{/each}
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

      <div class="grid">
        {#each shown as l, i (l.id)}
          <button type="button" class="card" animate:flip={{ duration: 300 }} in:scale={{ duration: 250, start: .92 }}
                  on:click={() => (open = i)} aria-label={`${lmName(l.landmark)}, ${l.value} ${$t('dt')} ${l.year}`}>
            <span class="pic"><img src={card(l.img)} alt="" loading="lazy" /></span>
            <span class="bill">{l.value} <small>{$t('dt')}</small> · {l.year}</span>
            <span class="body">
              <span class="name">{lmName(l.landmark)}</span>
              <span class="where">{cityName(l.city)}{#if selected.all}{$isAr ? '، ' : ', '}{$isAr ? govAr(l.gov) : l.gov}{/if}</span>
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
          <p>{cityName(current.city)}{$isAr ? '،' : ','} {$isAr ? govAr(current.gov) : current.gov} · <b>{$money(current.value === '½' ? 0.5 : +current.value)}, {current.year}</b></p>
          {#if current.tag}<span class="tag" style="--tc:{TAG_COLOR[current.tag]}"><img src={icon(current.tag)} alt="" />{catName(current.tag)}</span>{/if}
        </div>
        {#if current.url}<a href={current.url} target="_blank" rel="noopener noreferrer">{$t('lxReadMore')}</a>{/if}
      </figcaption>
    </figure>
  </div>
{/if}

<style>
  .lx {
    display: grid; grid-template-columns: minmax(240px, 380px) 1fr; gap: 2rem;
    max-width: 1100px; margin: 1.5rem auto 3rem; padding: 0 1rem; box-sizing: border-box;
    font-family: Quicksand, sans-serif; color: #3D2A22;
  }

  /* ---- side ---- */
  .side { position: sticky; top: 1rem; align-self: start; text-align: center; }
  svg { width: 100%; height: auto; max-height: 70vh; display: block; }
  .gov { stroke: none; cursor: pointer; transition: fill .2s; outline: none; }
  .gov.sel { stroke: none; }
  .gt-ink { fill: none; stroke: #24394D; stroke-width: 1.8; stroke-linejoin: round; pointer-events: none; }
  .gt-ink.hot { stroke: #C62F2F; stroke-width: 3; }
  .gt-ring { fill: none; stroke: #C62F2F; stroke-width: 2; stroke-linecap: round; pointer-events: none; }
  .gt-cap { font: 700 13px Caveat, 'Segoe Print', cursive; fill: #C62F2F; text-anchor: middle; pointer-events: none; }
  .lx-hover { fill: none; stroke: #C62F2F; stroke-width: 3.4; stroke-linejoin: round; pointer-events: none; }
  .lx-tip {
    position: absolute; z-index: 5; transform: translate(-50%, calc(-100% - 12px)); pointer-events: none; white-space: nowrap;
    display: flex; flex-direction: column; align-items: center; padding: .3rem .65rem; border-radius: 8px;
    background: #FFFBF1; border: 1.5px solid #C62F2F; box-shadow: 0 4px 12px rgba(74, 46, 37, .2); font-family: Quicksand, sans-serif;
  }
  .lx-tip b { font: 700 1.15rem/1.1 Caveat, 'Segoe Print', cursive; color: #1E3F5C; }
  .lx-tip span { font-size: .72rem; font-weight: 700; color: #8C4D3F; }
  .lx-ink path { fill: none; stroke: #24394D; stroke-width: 2.4; stroke-linejoin: round; stroke-linecap: round; }
  /* a page from Dali's notebook, taped down */
  .lx-page {
    position: relative; padding: 1.6rem .8rem .8rem 2.4rem; margin-top: .6rem; transform: rotate(-.6deg);
    background-color: #FFFDF6;
    background-image:
      linear-gradient(90deg, transparent 1.6rem, rgba(181, 82, 59, .4) 1.6rem, rgba(181, 82, 59, .4) calc(1.6rem + 1.5px), transparent calc(1.6rem + 1.5px)),
      repeating-linear-gradient(transparent 0 1.6rem, rgba(30, 91, 140, .28) 1.6rem calc(1.6rem + 1.2px));
    background-position: 0 0, 0 .9rem;
    box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 10px 26px -8px rgba(74, 46, 37, .32);
  }
  .lx-tape { position: absolute; top: -.7rem; left: 50%; width: 6rem; height: 1.5rem; transform: translateX(-50%) rotate(2deg); background: rgba(233, 214, 170, .8); box-shadow: 0 1px 2px rgba(74, 46, 37, .15); }
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
  .filters { display: grid; gap: .5rem; margin: 1rem 0 1.1rem; text-align: start; }
  .dd { display: grid; gap: .2rem; text-align: start; }
  .dd > span:first-child { font: 700 .7rem Quicksand, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #8C6A5C; }
  .dd-box { position: relative; display: flex; align-items: center; }
  .dd-box img { position: absolute; left: .55rem; width: 1.1rem; height: 1.1rem; border-radius: 3px; pointer-events: none; }
  .dd-box img + select { padding-left: 2.1rem; }
  .dd select {
    width: 100%; appearance: none; -webkit-appearance: none; cursor: pointer;
    font: 700 .92rem Quicksand, sans-serif; color: var(--tc, #1E5B8C); background: #FFFBF1;
    border: 1.5px solid #D9C9B1; border-radius: 10px; padding: .5rem 2rem .5rem .75rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%238C4D3F' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .7rem center; background-size: .7rem;
  }
  .dd select:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 2px; }
  :global([dir="rtl"]) .dd select { background-position: left .7rem center; padding: .5rem .75rem .5rem 2rem; }

  /* ---- cards ---- */
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }   /* always 3 per row on wide screens */
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
  /* fills its frame (same 4:3 as the cards) and crops what doesn't fit, instead of black bars */
  .lb figure > img { display: block; width: 100%; aspect-ratio: 4 / 3; max-height: 70vh; object-fit: cover; object-position: center; background: #EEE4D6; }
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
    .lb figcaption { flex-direction: column; align-items: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) {
    .card, .pic img, .gov { transition: none; }
  }
</style>
