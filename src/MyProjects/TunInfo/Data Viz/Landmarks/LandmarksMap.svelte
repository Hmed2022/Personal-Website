<script>
  // Interactive version of the five landmark maps (map1-5.png, kept in Assets/Maps).
  // The scroll step decides what the map shows; every governorate has a tooltip with
  // its landmarks on banknotes (thumbnail, name, note), or the proposed landmark if none.
  //   step 0  governorates with a landmark on a banknote
  //   step 1  + how many landmarks each
  //   step 2  coastal vs inland
  //   step 3  the 8 governorates never shown
  //   step 4  landmark categories (icons)
  import { geoMercator, geoPath, geoContains } from 'd3-geo';
  import { line, curveCatmullRom, curveCatmullRomClosed } from 'd3-shape';
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

  // counts come from the landmark list, like the explorer (the map file's own counts were out of date)
  // Drawn from memory: borders are simplified hard and redrawn as smooth curves. Neighbouring
  // governorates share their borders, so each stretch of border (between two points where borders
  // meet) is simplified and curved once, the same way for both sides: no gaps, no overlaps.
  const SIMPLIFY = 0.11;   // degrees; bigger = blobbier
  function rdp(pts, eps) {
    if (pts.length < 3) return pts;
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
    let max = 0, idx = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i];
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
      const dist = len ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len : Math.hypot(px - ax, py - ay);
      if (dist > max) { max = dist; idx = i; }
    }
    if (max <= eps) return [pts[0], pts[pts.length - 1]];
    return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
  }
  const polysOf = (f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);
  const KEY = (c) => c[0].toFixed(6) + ',' + c[1].toFixed(6);
  const owners = new Map();   // point -> governorates that use it
  Tun.features.forEach((f, fi) => polysOf(f).forEach((poly) => poly.forEach((r) => r.forEach((c) => {
    const k = KEY(c); if (!owners.has(k)) owners.set(k, new Set()); owners.get(k).add(fi);
  }))));
  const sig = (c) => [...owners.get(KEY(c))].sort().join('|');
  // split a ring at the points where the set of neighbours changes
  function segmentsOf(r) {
    const pts = r.slice(0, -1), n = pts.length;
    const junction = pts.map((c, i) => { const s0 = sig(c); return owners.get(KEY(c)).size > 2 || s0 !== sig(pts[(i - 1 + n) % n]) || s0 !== sig(pts[(i + 1) % n]); });
    const start = junction.indexOf(true);
    if (start < 0) return null;   // an island or a ring with no neighbours: draw it as one closed loop
    const segs = []; let cur = [pts[start]];
    for (let k = 1; k <= n; k++) { const i = (start + k) % n; cur.push(pts[i]); if (junction[i]) { segs.push(cur); cur = [pts[i]]; } }
    return segs;
  }
  // simplify in one fixed direction so both neighbours get exactly the same points
  function simplifySeg(seg) {
    const flip = KEY(seg[0]) > KEY(seg[seg.length - 1]);
    const a = flip ? [...seg].reverse() : seg;
    const out = rdp(a, SIMPLIFY);
    return flip ? out.reverse() : out;
  }
  const open = line().curve(curveCatmullRom.alpha(0.5));
  const closed = line().curve(curveCatmullRomClosed.alpha(0.5));
  function freehand(f) {
    return polysOf(f).map((poly) => poly.map((r) => {
      const segs = segmentsOf(r);
      if (!segs) {
        let pts = rdp(r, SIMPLIFY / 2).slice(0, -1);
        if (pts.length < 4) pts = r.filter((_, i) => i % Math.max(1, Math.floor(r.length / 6)) === 0);
        return closed(pts.map((p) => projection(p)));
      }
      return segs.map((seg, i) => {
        const d = open(simplifySeg(seg).map((p) => projection(p)));
        return i === 0 ? d : d.replace(/^M/, 'L');
      }).join('') + 'Z';
    }).join('')).join('');
  }
  const govs = Tun.features.map((f) => {
    const name = f.properties.gouv_fr;
    const items = byGov[name] || [];
    const [cx, cy] = path.centroid(f);
    return { name, ar: f.properties.gouv_ar, count: items.length, items, d: freehand(f), cx, cy, coastal: COASTAL.has(name), f };
  });
  // a stretch of border is on the outside if, just beside its middle, one side is in no governorate at all
  function isCoast(seg) {
    const k = Math.max(0, Math.floor((seg.length - 1) / 2) - (seg.length > 2 ? 0 : 0));
    const a = seg[k], b = seg[Math.min(seg.length - 1, k + 1)];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const e = 0.012, nx = (-dy / L) * e, ny = (dx / L) * e;
    const inAny = (pt) => Tun.features.some((f) => geoContains(f, pt));
    return !inAny([mx + nx, my + ny]) || !inAny([mx - nx, my - ny]);
  }
  // the country's outer border only
  // islands (rings with no neighbours: Djerba, Kerkennah...) are kept apart, Dali adds them on their own
  const islandParts = [];
  const outlinePath = (() => {
    const out = [];
    Tun.features.forEach((f) => polysOf(f).forEach((poly) => poly.forEach((r) => {
      const segs = segmentsOf(r);
      if (!segs) {
        let pts = rdp(r, SIMPLIFY / 2).slice(0, -1);
        if (pts.length < 4) pts = r.filter((_, i) => i % Math.max(1, Math.floor(r.length / 6)) === 0);
        islandParts.push(closed(pts.map((p) => projection(p))));
        return;
      }
      for (const seg of segs) {
        if (isCoast(seg)) out.push(open(simplifySeg(seg).map((p) => projection(p))));
      }
    })));
    return out.join('');
  })();
  const islandPath = islandParts.join('');
  // Dali draws: outline, then governorates biggest first, then Grand Tunis, then the sea, then he colours it in
  const GRAND_TUNIS = new Set(['Tunis', 'Ariana', 'Ben Arous', 'Manouba']);
  const ORDER = govs.filter((g) => !GRAND_TUNIS.has(g.name)).sort((a, b) => path.area(b.f) - path.area(a.f)).map((g) => g.name);
  const GOV_STEP = 170;                        // ms between two governorates
  const delayOf = (g) => (GRAND_TUNIS.has(g.name) ? 0 : ORDER.indexOf(g.name) * GOV_STEP);
  // drawStep is set by the page (scroll / arrows): 0 blank · 1 outline · 2 islands · 3 governorates ·
  // 4 Grand Tunis (with a zoom) · 5 sea and neighbours · 6 finished
  export let drawStep = 6;
  $: stage = [0, 1, 1, 2, 3, 4, 5][drawStep] ?? 5;
  $: islands = drawStep >= 2;
  $: narr = drawStep >= 1 && drawStep <= 5 ? ['', 'lmD1', 'lmDIsl', 'lmD2', 'lmD3', 'lmD4'][drawStep] : (drawStep === 6 && step === 0 ? 'lmP1' : '');
  // the Grand Tunis zoom: a circle in the sea showing the four little governorates up close
  const GT = govs.filter((g) => GRAND_TUNIS.has(g.name));
  const gtB = GT.map((g) => path.bounds(g.f)).reduce((a, b) => [[Math.min(a[0][0], b[0][0]), Math.min(a[0][1], b[0][1])], [Math.max(a[1][0], b[1][0]), Math.max(a[1][1], b[1][1])]]);
  const GX = (gtB[0][0] + gtB[1][0]) / 2, GY = (gtB[0][1] + gtB[1][1]) / 2, GR = Math.max(gtB[1][0] - gtB[0][0], gtB[1][1] - gtB[0][1]) / 2 + 3;
  const ICX = W - 22, ICY = 128, IR = 60, ZK = (IR - 6) / GR;
  const inset = (x, y) => [ICX + (x - GX) * ZK, ICY + (y - GY) * ZK];
  const GT_NUDGE = { Tunis: [12, -2], Manouba: [-10, 2], Ariana: [0, -4], 'Ben Arous': [4, 4] };   // keep the four names apart
  const connector = (() => {
    const [x1, y1] = [GX + GR * 0.8, GY - GR * 0.6], [x2, y2] = [ICX - IR * 0.9, ICY - IR * 0.35];
    return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)},${(Math.min(y1, y2) - 40).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  })();
  // small governorates around Tunis: nudge their labels so the numbers don't overlap
  const NUDGE = { Tunis: [22, -22], Ariana: [4, -12], 'Ben Arous': [14, 10], Manouba: [-1, 7], Monastir: [12, 2], Sousse: [-4, -4], Mahdia: [4, 4] };
  // a quick red-marker loop around a governorate: an oval that overshoots where it started
  function loop(g, i) {
    const [[x0, y0], [x1, y1]] = path.bounds(g.f);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const rx = Math.max(9, (x1 - x0) / 2 * 0.5), ry = Math.max(9, (y1 - y0) / 2 * 0.5);
    const tilt = ((i * 37) % 30 - 15) * Math.PI / 180, pts = [];
    for (let k = 0; k <= 30; k++) {
      const a = -Math.PI / 2 + (k / 26) * Math.PI * 2;          // a bit more than a full turn
      const wob = 1 + 0.06 * Math.sin(k * 1.7 + i);
      const ex = rx * wob * Math.cos(a), ey = ry * wob * Math.sin(a) * (1 + k * 0.004);
      pts.push([cx + ex * Math.cos(tilt) - ey * Math.sin(tilt), cy + ex * Math.sin(tilt) + ey * Math.cos(tilt)]);
    }
    return line().curve(curveCatmullRom.alpha(0.5))(pts);
  }
  // counts are red marker numbers; where a governorate is too small, the number sits outside
  // (in the sea, or above the map) with a hand-drawn arrow pointing at it
  const CALLOUT = { Tunis: [72, -36], 'Ben Arous': [70, 6], Manouba: [-30, -58], Sousse: [66, -30], Monastir: [60, 4], Mahdia: [56, 26] };
  function arrow(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const sx = x1 + ux * 13, sy = y1 + uy * 13, ex = x2 - ux * 4, ey = y2 - uy * 4;
    const mx = (sx + ex) / 2 - uy * L * 0.18, my = (sy + ey) / 2 + ux * L * 0.18;   // a slight bow, like a quick pen stroke
    const ang = Math.atan2(ey - my, ex - mx), h = 7;
    const a1 = [ex - h * Math.cos(ang - 0.55), ey - h * Math.sin(ang - 0.55)], a2 = [ex - h * Math.cos(ang + 0.55), ey - h * Math.sin(ang + 0.55)];
    const f = (n) => n.toFixed(1);
    return `M${f(sx)},${f(sy)}Q${f(mx)},${f(my)} ${f(ex)},${f(ey)}M${f(a1[0])},${f(a1[1])}L${f(ex)},${f(ey)}L${f(a2[0])},${f(a2[1])}`;
  }

  // Dali colours his map in with dashed hatching (no solid fills); 'off' = left blank, the paper shows
  const C = { on: '#24394D', onInland: '#3F7FB8', off: 'transparent', never: '#D27A3E', stroke: '#91B4BA', hover: '#9D6D79' };
  const HATCH = ['on', 'onInland', 'never', 'hover'];
  const fillUrl = (key) => (key === 'off' ? 'transparent' : `url(#lm-hatch-${key})`);
  function fillKey(g, step) {
    const on = g.count > 0;
    if (step === 3) return on ? (g.coastal ? 'on' : 'onInland') : 'off';   // same colours as step 2; the 8 blanks get circled
    if (step === 2) return on ? (g.coastal ? 'on' : 'onInland') : 'off';
    return on ? 'on' : 'off';
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

<div class="lmap" class:st1={stage >= 1} class:st2={stage >= 2} class:st3={stage >= 3} class:st4={stage >= 4} class:st5={stage >= 5} dir="ltr">
  {#key narr}{#if narr}<p class="narr" dir={$dir} transition:fade={{ duration: 300 }}>{@html $t(narr)}</p>{/if}{/key}
  <svg viewBox="0 0 {W} {H}" role="img" aria-label={$t('lmAria')}>
    <defs>
      <!-- Dali's hand: a slight wobble on every line, like a map drawn with a pen -->
      <filter id="lm-sketch" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="3.2" />
      </filter>
      <!-- dashed hatching, one pattern per colour -->
      <!-- inland: coloured in with a blue pencil (dense, slightly uneven strokes over a light wash) -->
      <pattern id="lm-hatch-onInland" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <rect width="6" height="6" fill="#9CC3E6" opacity=".55" />
        <line x1="0" y1="1.5" x2="6" y2="1.5" stroke="#3F7FB8" stroke-width="1.6" opacity=".75" />
        <line x1="0" y1="4.4" x2="6" y2="4.4" stroke="#5B95C9" stroke-width="1.1" opacity=".6" />
      </pattern>
      <!-- never on a note: coloured in with a red pencil -->
      <pattern id="lm-hatch-never" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <rect width="6" height="6" fill="#EBA49A" opacity=".55" />
        <line x1="0" y1="1.5" x2="6" y2="1.5" stroke="#C62F2F" stroke-width="1.6" opacity=".7" />
        <line x1="0" y1="4.4" x2="6" y2="4.4" stroke="#D85A4E" stroke-width="1.1" opacity=".55" />
      </pattern>
      {#each HATCH.filter((k) => k !== 'onInland' && k !== 'never') as k}
        <pattern id="lm-hatch-{k}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
          <line x1="0" y1="3.5" x2="7" y2="3.5" stroke={C[k]} stroke-width="2.1" stroke-dasharray="4.5 2.5" stroke-linecap="round" />
        </pattern>
      {/each}
      <pattern id="lm-hatch-sea" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
        <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="#7FAFC0" stroke-width="1.6" stroke-dasharray="5 4" stroke-linecap="round" />
      </pattern>
      <!-- marker outlines: a little wobble, then blurred and re-sharpened so corners come out rounded, like felt tip -->
      <filter id="lm-marker" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" result="d" />
        <feGaussianBlur in="d" stdDeviation="1.7" result="b" />
        <feComponentTransfer in="b"><feFuncA type="table" tableValues="0 0 .9 1 1" /></feComponentTransfer>
      </filter>
      <!-- the sea stops at the coast: Tunisia is cut out of it -->
      <mask id="lm-no-land" maskUnits="userSpaceOnUse" x={-BX} y={-BY} width={W + 2 * BX} height={H + 2 * BY}>
        <rect x={-BX} y={-BY} width={W + 2 * BX} height={H + 2 * BY} fill="#fff" />
        {#each govs as g}<path d={g.d} fill="#000" stroke="#000" stroke-width="2" />{/each}
      </mask>
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
      <path d={seaPath} class="water" fill="url(#lm-hatch-sea)" mask="url(#lm-no-land)" />
    </g>
    <!-- hatching (and the hover / click area) -->
    <g>
    {#each govs as g (g.name)}
      <path d={g.d} fill={fillUrl(active === g ? 'hover' : fillKey(g, step))} class="gov" class:hot={active === g}
            on:pointermove={(e) => move(e, g)} on:pointerleave={() => (hovered = null)} on:click={() => openCard(g)}
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openCard(g)} tabindex="0" role="button" aria-label={`${$pick(g.name, g.ar)}: ${$t('lmLandmarks', { n: g.count })}`} />
    {/each}
    </g>
    <!-- Grand Tunis, zoomed (only while Dali talks about it) -->
    <g class="gt-zoom" class:on={drawStep === 4} aria-hidden="true">
      <defs><clipPath id="gt-clip"><circle cx={ICX} cy={ICY} r={IR} /></clipPath></defs>
      <circle cx={ICX} cy={ICY} r={IR} class="gt-paper" />
      <g filter="url(#lm-marker)">
        <g clip-path="url(#gt-clip)"><g transform="translate({ICX} {ICY}) scale({ZK}) translate({-GX} {-GY})">
          {#each GT as g (g.name)}<path d={g.d} class="gt-ink" vector-effect="non-scaling-stroke" />{/each}
        </g></g>
        <circle cx={ICX} cy={ICY} r={IR} class="gt-ring" />
        <circle cx={GX} cy={GY} r={GR} class="gt-ring" />
        <path d={connector} class="gt-ring" />
      </g>
    </g>
    <!-- marker outlines on top (not interactive) -->
    <g class="ink" filter="url(#lm-marker)" aria-hidden="true">
      <path d={outlinePath} class="outline" pathLength="1" />
      <path d={islandPath} class="island" class:on={islands} />
      {#each govs as g (g.name)}<path d={g.d} pathLength="1" class:gt={GRAND_TUNIS.has(g.name)} style="--d:{delayOf(g)}ms" />{/each}
    </g>

    <!-- steps 1 and 2: counts (kept on the coastal vs inland map) -->
    {#if step === 1 || step === 2}
      <g transition:fade={{ duration: 250 }} class="labels">
        {#each govs.filter((g) => g.count > 0) as g}
          {@const co = CALLOUT[g.name]}
          {@const lx = g.cx + (co ? co[0] : 0)}
          {@const ly = g.cy + (co ? co[1] : 0)}
          {#if co}<path d={arrow(lx, ly, g.cx, g.cy)} class="arrow" />{/if}
          <text x={lx} y={ly} class="count halo" class:big={g.count > 9} transform="rotate(-5 {lx} {ly})">{g.count}</text>
          <text x={lx} y={ly} class="count" class:big={g.count > 9} transform="rotate(-5 {lx} {ly})">{g.count}</text>
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
    <!-- step 3: Dali circles the eight governorates that were never on a note, in red marker -->
    {#if step === 3}
      <g class="circles" filter="url(#lm-marker)" transition:fade={{ duration: 300 }} aria-hidden="true">
        {#each govs.filter((g) => g.count === 0) as g, i}
          <path d={loop(g, i)} class="loop" style="--d:{i * 120}ms" />
        {/each}
      </g>
      <g transition:fade={{ duration: 300 }} aria-hidden="true">
        {#each govs.filter((g) => g.name === 'Sidi Bouzid') as g}
          <text x={g.cx + 70} y={g.cy - 6} class="never-txt" transform="rotate(-10 {g.cx + 70} {g.cy - 6})">{$t('lmNeverScribble')}</text>
          <path d={arrow(g.cx + 66, g.cy - 8, g.cx + 12, g.cy)} class="arrow" />
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
      <span><i style="--h:{C.on}"></i>{$t('lmLegCoast')}</span>
      <span><i class="inland"></i>{$t('lmLegInland')}</span>
      <span><i class="blank"></i>{$t('lmLegNever')}</span>
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
  .gov { stroke: none; cursor: pointer; transition: fill .35s; outline: none; }
  .gov.hot { stroke: #9D6D79; stroke-width: 2; stroke-linejoin: round; }
  .ink path { fill: none; stroke: #24394D; stroke-width: 2.8; stroke-linejoin: round; stroke-linecap: round; }
  .gov:focus-visible { stroke: #1E5B8C; stroke-width: 2.4; }
  .labels { pointer-events: none; font-family: Quicksand, sans-serif; }
  /* slate-teal badges, the same blue-grey as the map borders and the section text */
  .badge { fill: #557C81; stroke: #FDF6F5; stroke-width: 1.5; filter: drop-shadow(0 1px 1.5px rgba(40, 60, 66, .3)); }
  .badge.big { fill: #2F4F5A; stroke-width: 2; }
  .count { font: 700 31px Caveat, 'Segoe Print', cursive; fill: #C62F2F; text-anchor: middle; dominant-baseline: middle;
    stroke: #C62F2F; stroke-width: 1.4px; stroke-linejoin: round; }
  .count.halo { stroke: #FFFDF6; stroke-width: 6px; fill: #FFFDF6; }
  .count.big { font-size: 40px; }
  /* drawing it: the marker traces the outlines, then the colouring and the labels come in */
  .ink path { stroke-dasharray: 1; stroke-dashoffset: 1; }
  .ink .outline { transition: stroke-dashoffset 2.2s cubic-bezier(.45, .1, .3, 1); }
  .ink path:not(.outline) { transition: stroke-dashoffset .75s ease-out var(--d, 0ms); }
  .st1 .ink .outline, .st2 .ink path:not(.gt):not(.island), .st3 .ink path.gt { stroke-dashoffset: 0; }
  /* islands pop in, drawn small and quick */
  .ink .island { stroke-dasharray: none; stroke-dashoffset: 0; opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(.4); transition: opacity .5s ease, transform .6s cubic-bezier(.3, 1.6, .5, 1); }
  .ink .island.on { opacity: 1; transform: none; }
  .st3 .ink path.gt { transition-delay: 0ms; }
  .surround, .geo { opacity: 0; transition: opacity 1s ease; pointer-events: none; }   /* decoration: never catches the mouse */
  .lmap:not(.st5) svg, .lmap:not(.st5) .hint { pointer-events: none; }   /* nothing to hover until it's drawn */
  .st4 .surround, .st4 .geo { opacity: 1; }
  .gov, .labels:not(.geo), .icons, .legend, .hint, .circles { opacity: 0; transition: opacity .8s ease; }
  .st5 .gov, .st5 .labels:not(.geo), .st5 .icons, .st5 .legend, .st5 .hint, .st5 .circles { opacity: 1; }
  .lmap:not(.st5) .gov { pointer-events: none; }
  .st5 .ink path { stroke-dashoffset: 0; }
  /* Dali's running commentary while he draws, in his red marker */
  .narr { position: absolute; left: 0; right: 0; bottom: -.2rem; z-index: 3; margin: 0 auto; max-width: 18rem; padding: .2rem .5rem;
    font: 700 1.3rem/1.3 Caveat, 'Segoe Print', cursive; color: #C62F2F; text-align: center; transform: rotate(-2deg);
    background: rgba(255, 253, 246, .85); border-radius: 6px; pointer-events: none; }
  .narr :global(b) { color: #C62F2F; background: linear-gradient(transparent 55%, rgba(227, 167, 42, .45) 55%, rgba(227, 167, 42, .45) 92%, transparent 92%); padding: 0 .1em; }
  :global(.tn-ar) .narr { font-family: 'Aref Ruqaa', Tajawal, serif; font-size: 1.1rem; }
  @media (prefers-reduced-motion: reduce) { .ink path, .surround, .geo, .gov, .labels, .icons, .legend, .hint, .circles { transition: none !important; } }
  .gt-zoom { opacity: 0; transition: opacity .6s ease; pointer-events: none; }
  .gt-zoom.on { opacity: 1; }
  .gt-paper { fill: #FFFDF6; }
  .gt-ink { fill: none; stroke: #24394D; stroke-width: 2.2; stroke-linejoin: round; }
  .gt-ring { fill: none; stroke: #C62F2F; stroke-width: 2.4; stroke-linecap: round; }
  .gt-name { font: 700 13px Caveat, 'Segoe Print', cursive; fill: #C62F2F; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke: #FFFDF6; stroke-width: 3px; }
  .loop { fill: none; stroke: #C62F2F; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 600; stroke-dashoffset: 600; animation: draw-loop .7s ease-out forwards; animation-delay: var(--d); }
  @keyframes draw-loop { to { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: reduce) { .loop { animation: none; stroke-dashoffset: 0; } }
  .never-txt { font: 700 28px Caveat, 'Segoe Print', cursive; fill: #C62F2F; text-anchor: start; paint-order: stroke; stroke: #FFFDF6; stroke-width: 4px; }
  .arrow { fill: none; stroke: #C62F2F; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .name { font-size: 11px; font-weight: 800; fill: #8C4D3F; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke: #FDF6F5; stroke-width: 3px; }
  .neighbours { fill: transparent; }   /* the notebook page shows around the country */
  .water { stroke: none; }
  .sea { font: 600 22px Caveat, 'Segoe Print', cursive; fill: #3F6E7B; text-anchor: middle; }
  .land { font: 700 23px Caveat, 'Segoe Print', cursive; fill: #8A6A4C; text-anchor: middle; }
  .icons { pointer-events: none; }
  .legend { display: flex; flex-wrap: wrap; gap: .3rem .9rem; justify-content: center; font: 700 .75rem Quicksand, sans-serif; color: #4D6473; margin-top: .3rem; }
  .legend i.inland { background: #9CC3E6 repeating-linear-gradient(-52deg, #3F7FB8 0 1.5px, transparent 1.5px 3.5px); }
  .legend i { display: inline-block; width: .9rem; height: .9rem; border: 1.5px solid #24394D; border-radius: 3px; margin-inline-end: .3rem; vertical-align: -.15rem;
    background: repeating-linear-gradient(-48deg, var(--h) 0 2px, transparent 2px 5px); }
  .legend i.blank { background: transparent; }
  .hint { position: relative; margin: .3rem 0 0; font: 500 1.15rem/1.25 Caveat, 'Segoe Print', cursive; color: #1E3F5C; text-align: center; transform: rotate(-1deg); }
  :global(.tn-ar) .hint { font-family: 'Aref Ruqaa', Tajawal, serif; font-size: 1rem; }

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
