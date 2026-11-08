<script>
  // Interactive version of the five landmark maps (map1-5.png, kept in Assets/Maps).
  // The scroll step decides what the map shows; every governorate has a tooltip with
  // its landmarks on banknotes (thumbnail, name, note), or the proposed landmark if none.
  //   step 0  governorates with a landmark on a banknote
  //   step 1  + how many landmarks each
  //   step 2  coastal vs inland
  //   step 3  the 8 governorates never shown
  //   step 4  landmark categories (icons)
  import { geoMercator, geoPath } from 'd3-geo';
  import { fade } from 'svelte/transition';
  import Tun from '../Map/Data/Tunisia.geojson.json';
  import { landmarks } from './landmarksMap.js';
  import GovernorateCard from './GovernorateCard.svelte';
  import { t, lang, dir, isAr, money, pick } from '../../i18n.js';
  import { lmAr, cityAr, CATEGORIES_AR, PROPOSED_AR } from './landmarksAr.js';
  import { parseBill } from './landmarkMeta.js';
  const billText = (bill, m) => { const b = parseBill(bill); return b.value ? `${m(b.value === '½' ? 0.5 : +b.value)} (${b.year})` : bill; };

  export let step = 0;

  const THUMB = import.meta.glob('./thumbs/*.webp', { eager: true, as: 'url' });
  const thumb = (n) => THUMB[`./thumbs/${n}.webp`];

  import { CATEGORIES, TAG_COLOR, TAG_ICON, PROPOSED } from './landmarkMeta.js';
  const COASTAL = new Set(['Jendouba', 'Bizerte', 'Ariana', 'Tunis', 'Ben Arous', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Gabes', 'Medenine']);

  const W = 400, H = 640;
  const BX = 130, BY = 50;   // how far the sea / land background reaches beyond the map
  const projection = geoMercator().fitExtent([[12, 12], [W - 12, H - 12]], Tun);
  const path = geoPath(projection);

  // Sea and neighbours. There is no Algeria/Libya geometry, so the whole view is painted as
  // land and a sea shape is laid over it. The sea follows the Algerian coast up to the border
  // at Tabarka and the Libyan coast from Ras Ajdir; between those two points it runs under
  // Tunisia (drawn on top), so Tunisia's own outline becomes the land/sea/border line.
  const SEA = [
    [3, 40], [3, 36.95], [6, 37.0], [7.0, 37.05], [7.8, 36.95], [8.25, 36.95], [8.62, 36.94],
    [9.0, 36.0], [9.3, 35.0], [9.6, 34.0], [10.0, 33.5], [10.8, 33.3], [11.56, 33.17],   // inland, hidden under Tunisia
    [12.1, 32.92], [13.2, 32.88], [14.5, 32.45], [16.5, 31.6], [20, 31.6], [20, 40],
  ];
  const seaPath = 'M' + SEA.map((p) => projection(p).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';

  const byGov = {};
  for (const l of landmarks) (byGov[l.gov] = byGov[l.gov] || []).push(l);

  const govs = Tun.features.map((f) => {
    const name = f.properties.gouv_fr;
    const items = byGov[name] || [];
    const [cx, cy] = path.centroid(f);
    return { name, ar: f.properties.gouv_ar, count: f.properties.landmarks, items, d: path(f), cx, cy, coastal: COASTAL.has(name), f };
  });
  // small governorates around Tunis: nudge their labels so the numbers don't overlap
  const NUDGE = { Tunis: [22, -22], Ariana: [4, -12], 'Ben Arous': [14, 10], Manouba: [-1, 7], Monastir: [12, 2], Sousse: [-4, -4], Mahdia: [4, 4] };

  const C = { on: '#DBC1A0', onInland: '#8FB3B8', off: '#FFFFFF', never: '#E8B48A', stroke: '#91B4BA', hover: '#9D6D79' };
  function fillOf(g, step) {
    const on = g.count > 0;
    if (step === 3) return on ? C.off : C.never;
    if (step === 2) return on ? (g.coastal ? C.on : C.onInland) : C.off;
    return on ? C.on : C.off;
  }

  // category icons laid out in a little grid on each governorate (step 4)
  function iconGrid(g) {
    const n = g.items.length, per = Math.min(5, Math.max(1, Math.ceil(Math.sqrt(n)))), s = n > 6 ? 9 : 13;
    const rows = Math.ceil(n / per);
    const [nx, ny] = g.name === 'Tunis' ? [26, -30] : [0, 0];
    return g.items.map((it, i) => ({
      tag: it.tag, s,
      x: g.cx + nx + ((i % per) - (per - 1) / 2) * (s + 1.5) - s / 2,
      y: g.cy + ny + (Math.floor(i / per) - (rows - 1) / 2) * (s + 1.5) - s / 2,
    }));
  }

  // ---------- tooltip ----------
  let hovered = null, pinned = null, tipX = 0, tipY = 0;
  $: active = pinned || hovered;
  function move(e, g) {
    if (e.pointerType !== 'mouse') return;
    hovered = g; tipX = e.clientX; tipY = e.clientY;
  }
  // click / tap opens the governorate profile
  let cardOpen = false, cardGov = null;
  const allCounts = govs.map((g) => g.items.length);   // same source as the profile's landmark list
  function openCard(g) { hovered = null; pinned = null; cardGov = g; cardOpen = true; }
  function tap(e, g) {
    tipX = e.clientX; tipY = e.clientY;
    pinned = pinned === g ? null : g;
  }
  $: flip = tipX > (typeof window !== 'undefined' ? window.innerWidth : 1200) - 320;
  $: below = tipY < 260;

  // render the tooltip on <body> so the scrolling text panels can't cover it
  function portal(node) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }
  $: summary = active && (active.count > 0
    ? (active.count === 1 ? $t('lmOnNotes1') : $t('lmOnNotes', { n: active.count }))
    : $t('lmNever'));
</script>

<svelte:window on:scroll={() => { hovered = null; pinned = null; }} />

<div class="lmap" dir="ltr">
  <svg viewBox="0 0 {W} {H}" role="img" aria-label={$t('lmAria')}>
    <defs>
      <!-- the sea and neighbours fade into the page instead of ending in a hard frame -->
      <!-- the background reaches beyond the map box (BX / BY on each side) and fades out in an oval -->
      <radialGradient id="lm-fade-g" gradientUnits="userSpaceOnUse" cx={W / 2} cy={H / 2} r={H / 2 + BY} gradientTransform={`translate(${W / 2} ${H / 2}) scale(${(W + 2 * BX) / (H + 2 * BY)} 1) translate(${-W / 2} ${-H / 2})`}>
        <stop offset="62%" stop-color="#fff" />
        <stop offset="86%" stop-color="#fff" stop-opacity=".55" />
        <stop offset="100%" stop-color="#000" />
      </radialGradient>
      <mask id="lm-fade" maskUnits="userSpaceOnUse" x={-BX} y={-BY} width={W + 2 * BX} height={H + 2 * BY}>
        <rect x={-BX} y={-BY} width={W + 2 * BX} height={H + 2 * BY} fill="url(#lm-fade-g)" />
      </mask>
    </defs>
    <g mask="url(#lm-fade)" class="surround" aria-hidden="true">
      <rect x={-BX} y={-BY} width={W + 2 * BX} height={H + 2 * BY} class="neighbours" />
      <path d={seaPath} class="water" />
    </g>
    {#each govs as g (g.name)}
      <path d={g.d} fill={active === g ? C.hover : fillOf(g, step)} class="gov" class:hot={active === g}
            on:pointermove={(e) => move(e, g)} on:pointerleave={() => (hovered = null)} on:click={() => openCard(g)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openCard(g)} tabindex="0" role="button" aria-label={`${$pick(g.name, g.ar)}: ${$t('lmLandmarks', { n: g.count })}`} />
    {/each}

    <!-- step 1: counts -->
    {#if step === 1}
      <g transition:fade={{ duration: 250 }} class="labels">
        {#each govs.filter((g) => g.count > 0) as g}
          {@const nd = NUDGE[g.name] || [0, 0]}
          {@const r = g.count > 9 ? 18 : 12.5}
          <circle cx={g.cx + nd[0]} cy={g.cy + nd[1]} r={r} class="badge" class:big={g.count > 9} />
          <text x={g.cx + nd[0]} y={g.cy + nd[1] + .5} class="count" class:big={g.count > 9}>{g.count}</text>
        {/each}
      </g>
    {/if}

    <!-- step 2: neighbours and sea -->
      <g class="labels geo">
        <!-- placed in open sea / open land, clear of Tunisia's border -->
        <text x={W - 10} y={300} class="sea" style="text-anchor:end">{$t('lmSea')}</text>
        <text x={W - 10} y={318} class="sea" style="text-anchor:end">{$t('lmSea2')}</text>
        <text x={52} y={520} class="land">{$t('lmAlgeria')}</text>
        <text x={W - 42} y={H - 70} class="land">{$t('lmLibya')}</text>
      </g>

    <!-- step 3: names of the governorates never shown -->
    {#if step === 3}
      <g transition:fade={{ duration: 250 }} class="labels">
        {#each govs.filter((g) => g.count === 0) as g}
          <text x={g.cx + (g.name === 'Ariana' ? 14 : 0)} y={g.cy + (g.name === 'Ariana' ? -14 : 0)} class="name">{$pick(g.name, g.ar)}</text>
        {/each}
      </g>
    {/if}

    <!-- step 4: category icons -->
    {#if step === 4}
      <g transition:fade={{ duration: 250 }} class="icons">
        {#each govs as g}
          {#each iconGrid(g) as ic}
            <rect x={ic.x} y={ic.y} width={ic.s} height={ic.s} rx="1.5" fill={TAG_COLOR[ic.tag]} />
            <image href={TAG_ICON[ic.tag]} x={ic.x} y={ic.y} width={ic.s} height={ic.s} />
          {/each}
        {/each}
      </g>
    {/if}
  </svg>

  {#if step === 2}
    <div class="legend" dir={$dir} transition:fade={{ duration: 200 }}>
      <span><i style="background:{C.on}"></i>{$t('lmLegCoast')}</span>
      <span><i style="background:{C.onInland}"></i>{$t('lmLegInland')}</span>
      <span><i style="background:{C.off}"></i>{$t('lmLegNever')}</span>
    </div>
  {/if}
  <p class="hint" dir={$dir}>{@html $t('lmHint')}</p>
</div>

<GovernorateCard bind:open={cardOpen} gov={cardGov} {allCounts} />

{#if active}
  <div class="lm-tip" use:portal class:tn-ar={$isAr} lang={$lang} dir={$dir} class:flip class:below style="left:{tipX}px; top:{tipY}px" transition:fade={{ duration: 120 }}>
    <div class="tip-head">
      <b>{active.name}</b><span class="ar" lang="ar" dir="rtl">{active.ar}</span>
    </div>
    <p class="tip-sum" class:none={active.count === 0}>{summary}</p>

    {#if active.items.length}
      <ul class="tip-list">
        {#each active.items.slice(0, active.items.length > 5 ? 4 : 5) as it}
          <li>
            <img src={thumb(it.img)} alt="" />
            <span class="txt">
              <span class="lm">{$isAr ? lmAr(it.landmark) : it.landmark}</span>
              <span class="meta">{it.city ? ($isAr ? cityAr(it.city) : it.city) + ' · ' : ''}{billText(it.bill, $money)}</span>
              {#if step === 4 && it.tag}<span class="cat"><img src={TAG_ICON[it.tag]} alt="" style="background:{TAG_COLOR[it.tag]}" />{$isAr ? CATEGORIES_AR[it.tag] : CATEGORIES[it.tag]}</span>{/if}
            </span>
          </li>
        {/each}
      </ul>
      {#if active.items.length > 5}
        <div class="more">
          {#each active.items.slice(4, 16) as it}<img src={thumb(it.img)} alt={$isAr ? lmAr(it.landmark) : it.landmark} title={$isAr ? lmAr(it.landmark) : it.landmark} />{/each}
          <span>{$t('lmMore', { n: active.items.length - 4 })}</span>
        </div>
      {/if}
    {:else if PROPOSED[active.name]}
      <p class="proposed"><span>{$t('lmCould')}</span> {$isAr ? PROPOSED_AR[active.name].join('، ') : PROPOSED[active.name].join(', ')}</p>
    {/if}
  </div>
{/if}

<style>
  .lmap { position: relative; pointer-events: auto; display: inline-block; }
  svg { display: block; height: min(560px, 78vh); width: auto; max-width: 100%; overflow: visible; }
  @media (max-width: 760px) { svg { height: 52vh; margin: 0 auto; } .hint { display: none; } }
  .gov { stroke: #91B4BA; stroke-width: 1.2; cursor: pointer; transition: fill .35s; outline: none; }
  .gov.hot { stroke: #5C3E46; stroke-width: 1.6; }
  .gov:focus-visible { stroke: #1E5B8C; stroke-width: 2.4; }
  .labels { pointer-events: none; font-family: Quicksand, sans-serif; }
  /* slate-teal badges, the same blue-grey as the map borders and the section text */
  .badge { fill: #557C81; stroke: #FDF6F5; stroke-width: 1.5; filter: drop-shadow(0 1px 1.5px rgba(40, 60, 66, .3)); }
  .badge.big { fill: #2F4F5A; stroke-width: 2; }
  .count { font-size: 15px; font-weight: 800; fill: #FFFFFF; text-anchor: middle; dominant-baseline: middle; }
  .count.big { font-size: 18px; }
  .name { font-size: 11px; font-weight: 800; fill: #8C4D3F; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke: #FDF6F5; stroke-width: 3px; }
  .neighbours { fill: #E0D2BD; }
  .water { fill: #C3DCE5; stroke: #A9CAD4; stroke-width: 1; }
  .sea { font-size: 15px; font-weight: 700; fill: #5F8E9B; text-anchor: middle; font-style: italic; }
  .land { font-size: 15px; font-weight: 700; fill: #A88A6C; text-anchor: middle; letter-spacing: .08em; }
  .icons { pointer-events: none; }
  .legend { display: flex; flex-wrap: wrap; gap: .3rem .9rem; justify-content: center; font: 700 .75rem Quicksand, sans-serif; color: #4D6473; margin-top: .3rem; }
  .legend i { display: inline-block; width: .8rem; height: .8rem; border: 1px solid #91B4BA; border-radius: 2px; margin-inline-end: .3rem; vertical-align: -.1rem; }
  .hint { position: relative; margin: .3rem 0 0; font: 600 .78rem/1.5 Quicksand, sans-serif; color: rgba(77, 100, 115, .75); text-align: center; }

  /* tooltip lives on <body>, so its styles are global */
  :global(.lm-tip) {
    position: fixed; z-index: 1000; width: 18rem; transform: translate(16px, -40%); pointer-events: none;
    background: #FFFBF4; border: 1px solid #C9B79C; border-radius: 10px; padding: .7rem .8rem;
    box-shadow: 0 10px 28px rgba(61, 42, 34, .22); font-family: Quicksand, sans-serif; color: #3D2A22;
  }
  :global(.lm-tip.flip) { transform: translate(calc(-100% - 16px), -40%); }
  :global(.lm-tip.below) { transform: translate(16px, 10px); }
  :global(.lm-tip.flip.below) { transform: translate(calc(-100% - 16px), 10px); }
  :global(.lm-tip .tip-head) { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; }
  :global(.lm-tip .tip-head b) { font-size: 1.05rem; color: #1E3F5C; }
  :global(.lm-tip .ar) { font-size: .95rem; color: #B5523B; }
  :global(.lm-tip .tip-sum) { margin: .1rem 0 .5rem; font-size: .8rem; font-weight: 700; color: #4D6473; }
  :global(.lm-tip .tip-sum.none) { color: #9D4F62; }
  :global(.lm-tip .tip-list) { list-style: none; margin: 0; padding: 0; display: grid; gap: .45rem; }
  :global(.lm-tip .tip-list li) { display: grid; grid-template-columns: 3.6rem 1fr; gap: .55rem; align-items: center; }
  :global(.lm-tip .tip-list > li > img) { width: 3.6rem; height: 2.6rem; object-fit: cover; border-radius: 5px; background: #EEE4D6; }
  :global(.lm-tip .txt) { display: flex; flex-direction: column; line-height: 1.25; }
  :global(.lm-tip .lm) { font-size: .8rem; font-weight: 700; }
  :global(.lm-tip .meta) { font-size: .72rem; color: #8C4D3F; font-weight: 600; }
  :global(.lm-tip .cat) { display: flex; align-items: center; gap: .25rem; font-size: .68rem; color: #4D6473; margin-top: .1rem; }
  :global(.lm-tip .cat img) { width: .95rem; height: .95rem; border-radius: 2px; }
  :global(.lm-tip .more) { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem; margin-top: .5rem; }
  :global(.lm-tip .more img) { width: 1.9rem; height: 1.4rem; object-fit: cover; border-radius: 3px; }
  :global(.lm-tip .more span) { font-size: .72rem; font-weight: 700; color: #8C4D3F; margin-left: .2rem; }
  :global(.lm-tip .proposed) { margin: 0; font-size: .8rem; line-height: 1.4; }
  :global(.lm-tip .proposed span) { font-weight: 700; color: #1E5B8C; }
</style>
