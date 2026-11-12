<script>
  // "What's your banknote worth?": the dinar's value in US dollars, 1958 – today,
  // computed from the timeline data (ValueDayofIssue / ValueEndofCirculation ÷ the note's value).
  import { scaleLinear } from 'd3-scale';
  import { line, curveMonotoneX } from 'd3-shape';
  import data from './Data/data.js';
  import { t, money, isAr } from '../../i18n.js';
  import { fade } from 'svelte/transition';

  const NOW = 2023;
  // one point per note at issue and at withdrawal (or today)
  let pts = [];
  for (const n of data) {
    if (+n.ValueDayofIssue) pts.push({ y: n.Issued, v: n.ValueDayofIssue / n.Value });
    if (+n.ValueEndofCirculation) pts.push({ y: n.Active === 'Yes' ? NOW : n.EndofCirculation, v: n.ValueEndofCirculation / n.Value });
  }
  // a 10 DT note withdrawn in 2012 is recorded at $0.34 per dinar (the rate that year was about $0.64): a data slip, left out
  pts = pts.filter((p) => !(p.y === 2012 && p.v < 0.4));

  // yearly median, for the line
  const byYear = {};
  for (const p of pts) (byYear[p.y] = byYear[p.y] || []).push(p.v);
  const series = Object.entries(byYear).map(([y, vs]) => {
    const s = vs.slice().sort((a, b) => a - b);
    return { y: +y, v: s[Math.floor(s.length / 2)] };
  }).sort((a, b) => a.y - b.y);
  function valueAt(year) {
    if (year <= series[0].y) return series[0].v;
    for (let i = 1; i < series.length; i++) {
      const a = series[i - 1], b = series[i];
      if (year <= b.y) return a.v + ((year - a.y) / (b.y - a.y)) * (b.v - a.v);
    }
    return series[series.length - 1].v;
  }

  const ERAS = [
    { key: 'eraBourguiba', from: 1956, to: 1987, tint: 'rgba(3, 136, 166, .08)', ink: '#025E73' },
    { key: 'eraBenAli', from: 1987, to: 2011, tint: 'rgba(124, 74, 140, .09)', ink: '#7C4A8C' },
    { key: 'eraRevolution', from: 2011, to: 2024, tint: 'rgba(191, 86, 48, .08)', ink: '#BF5630' },
  ];
  const eraLoss = ERAS.map((e) => {
    const a = valueAt(Math.max(1958, e.from)), b = valueAt(Math.min(NOW, e.to));
    return { ...e, p: Math.round((1 - b / a) * 100) };
  });

  // ---------- chart ----------
  let w = 800;
  const h = 380, m = { top: 30, right: 20, bottom: 30, left: 46 };
  $: x = scaleLinear().domain([1956, 2024]).range([m.left, w - m.right]);
  $: y = scaleLinear().domain([0, 2.6]).range([h - m.bottom, m.top]);
  $: path = line().x((d) => x(d.y)).y((d) => y(d.v)).curve(curveMonotoneX)(series);
  $: area = `${path} L${x(series[series.length - 1].y)},${y(0)} L${x(series[0].y)},${y(0)} Z`;
  const yTicks = [0, 0.5, 1, 1.5, 2, 2.5];
  const xTicks = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

  let hoverYear = null;
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const yr = Math.round(x.invert(e.clientX - r.left));
    hoverYear = yr >= 1958 && yr <= NOW ? yr : null;
  }
  $: readYear = hoverYear ?? NOW;
  // clicking the chart sets the calculator's year (the slider stops one year before today)
  function pickYear(e) { move(e); if (hoverYear != null) year = Math.min(hoverYear, NOW - 1); }
  $: readVal = valueAt(readYear);

  // ---------- calculator ----------
  const AMOUNTS = [0.5, 1, 5, 10, 20, 30, 50];
  let amount = 20;
  let year = 1980;
  $: then = amount * valueAt(year);
  $: now = amount * valueAt(NOW);
  $: ratio = Math.round((now / then) * 100);
  const usd = (v) => v.toFixed(2);

  // real notes to show under the calculator (local images, same as the timeline)
  import { noteImage, noteSrc } from './noteImage.js';
  $: imgOf = (n) => $noteSrc(n, noteImage(n));
  const inUse = (n, yr) => n.Issued <= yr && (n.Active === 'Yes' || yr < n.EndofCirculation);
  $: noteThen = data.filter((n) => n.Value === amount && inUse(n, year)).sort((a, b) => b.Issued - a.Issued)[0];
  $: noteNow = data.filter((n) => n.Value === amount && n.Active === 'Yes').sort((a, b) => b.Issued - a.Issued)[0];
  $: valuesThen = [...new Set(data.filter((n) => inUse(n, year)).map((n) => n.Value))].sort((a, b) => a - b);
  $: dt = (v) => `${v === 0.5 ? '½' : v} ${$t('dt')}`;
</script>

<div class="dv">
  <div class="chart-card">
    <div class="head">
      <h4>{$t('dvTitle')}</h4>
      <p class="read">{@html $t('dvRead', { y: readYear, v: usd(readVal) })}</p>
    </div>
    <div class="chart" dir="ltr" bind:clientWidth={w}>
      <svg width={w} height={h} on:pointermove={move} on:pointerleave={() => (hoverYear = null)} on:click={pickYear} style="cursor:pointer" role="img" aria-label={$t('dvTitle')}>
        {#each ERAS as e}
          <rect x={x(e.from)} y={m.top} width={x(e.to) - x(e.from)} height={h - m.top - m.bottom} fill={e.tint} />
          <text class="era" x={x(e.from) + 6} y={m.top - 6} style="fill:{e.ink}">{$t(e.key)}</text>
        {/each}
        {#each yTicks as v}
          <line class="grid" x1={m.left} x2={w - m.right} y1={y(v)} y2={y(v)} />
          <text class="ylab" x={m.left - 6} y={y(v) + 4}>${v.toFixed(v % 1 ? 1 : 0)}</text>
        {/each}
        {#each xTicks as yr}<text class="xlab" x={x(yr)} y={h - 8}>{yr}</text>{/each}
        <path d={area} class="area" />
        <path d={path} class="line" />
        {#each pts as p}<circle cx={x(p.y)} cy={y(p.v)} r="3" class="pt" />{/each}
        <!-- start / end labels -->
        <circle cx={x(1958)} cy={y(series[0].v)} r="6" class="end" />
        <text class="big" x={x(1958) + 10} y={y(series[0].v) + 22}>$2.38</text>
        <circle cx={x(NOW)} cy={y(valueAt(NOW))} r="6" class="end" />
        <text class="big" x={x(NOW) - 8} y={y(valueAt(NOW)) - 14} text-anchor="end">${usd(valueAt(NOW))}</text>
        {#if hoverYear}
          <line class="cursor" x1={x(hoverYear)} x2={x(hoverYear)} y1={m.top} y2={h - m.bottom} />
          <circle cx={x(hoverYear)} cy={y(readVal)} r="5" class="hot" />
          {@const right = x(hoverYear) > w - 110}
          <g transform="translate({x(hoverYear) + (right ? -10 : 10)} {y(readVal) - 14})">
            <rect x={right ? -86 : 0} y="-16" width="86" height="34" rx="6" class="bubble" />
            <text x={right ? -43 : 43} y="-2" class="b-val">${usd(readVal)}</text>
            <text x={right ? -43 : 43} y="12" class="b-yr">{hoverYear}</text>
          </g>
        {/if}
      </svg>
    </div>
    <div class="losses">
      {#each eraLoss as e}<p style="--ec:{e.ink}">{@html $t('dvLost', { era: $t(e.key), p: e.p })}</p>{/each}
    </div>
    <p class="note">{$t('dvNote')}</p>
  </div>

  <!-- calculator -->
  <div class="calc">
    <h4>{$t('dvCalcTitle')}</h4>
    <div class="row">
      <span class="lbl">{$t('dvAmount')}</span>
      <div class="chips">
        {#each AMOUNTS as a}<button type="button" class:on={amount === a} on:click={() => (amount = a)}>{a === 0.5 ? '½' : a} {$t('dt')}</button>{/each}
      </div>
    </div>
    <div class="row">
      <span class="lbl">{$t('dvYear')}</span>
      <input type="range" min="1958" max={NOW - 1} bind:value={year} dir="ltr" aria-label={$t('dvYear')} />
      <b class="yr">{year}</b>
    </div>
    <div class="compare">
      <div class="side">
        <span>{$t('dvThen', { y: year })}</span>
        <b>{$money(amount)}</b>
        <em>{$t('dvWorth', { v: usd(then) })}</em>
      </div>
      <span class="arrow" aria-hidden="true">{$isAr ? '←' : '→'}</span>
      <div class="side now">
        <span>{$t('dvNow')}</span>
        <b>{$money(amount)}</b>
        <em>{$t('dvWorth', { v: usd(now) })}</em>
      </div>
    </div>
    <p class="verdict">{@html ratio <= 100 ? $t('dvSame', { p: ratio, y: year }) : $t('dvMore', { p: ratio - 100, y: year })}</p>

    <!-- the actual notes -->
    <div class="notes">
      <figure>
        <figcaption>{$t('dvNoteThen', { v: dt(amount), y: year })}</figcaption>
        {#if noteThen}
          {#key noteThen}<img src={imgOf(noteThen)} alt={`${$money(amount)}, ${noteThen.Issued}`} in:fade={{ duration: 250 }} />{/key}
          <span class="who">{$isAr ? noteThen.ObserveInArabic : noteThen.ObserveInEnglish} · {noteThen.Issued}</span>
        {:else}
          <p class="none">{$t('dvNoNote', { v: dt(amount), y: year, list: valuesThen.map(dt).join(', ') })}</p>
        {/if}
      </figure>
      <figure>
        <figcaption>{$t('dvNoteNow', { v: dt(amount) })}</figcaption>
        {#if noteNow}
          <img src={imgOf(noteNow)} alt={`${$money(amount)}, ${noteNow.Issued}`} />
          <span class="who">{$isAr ? noteNow.ObserveInArabic : noteNow.ObserveInEnglish} · {noteNow.Issued}</span>
        {:else}
          <p class="none">{$t('dvNoNow', { v: dt(amount) })}</p>
        {/if}
      </figure>
    </div>
  </div>
</div>

<style>
  .dv { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 1.2rem; font-family: Quicksand, sans-serif; color: #3D2A22; }
  .chart-card, .calc { background: rgba(181, 82, 59, .06); border: 1px solid rgba(181, 82, 59, .18); border-radius: 14px; padding: 1rem 1.1rem; box-shadow: 0 4px 16px rgba(61, 42, 34, .06); }
  .head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: .3rem 1rem; }
  h4 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: #1E3F5C; }
  .read { margin: 0; font-size: .9rem; color: #4D6473; }
  .read :global(b) { color: #B5523B; font-size: 1.05rem; }
  .chart { margin-top: .5rem; }
  svg { display: block; overflow: visible; cursor: crosshair; }
  .era { font-size: 11px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
  .grid { stroke: rgba(77, 100, 115, .15); stroke-dasharray: 3 4; }
  .ylab { font-size: 11px; font-weight: 700; fill: #7A8B92; text-anchor: end; }
  .xlab { font-size: 11px; font-weight: 700; fill: #7A8B92; text-anchor: middle; }
  .area { fill: rgba(181, 82, 59, .12); }
  .line { fill: none; stroke: #B5523B; stroke-width: 3; stroke-linejoin: round; }
  .pt { fill: #FFFFFF; stroke: #B5523B; stroke-width: 1.2; opacity: .7; }
  .end { fill: #B5523B; stroke: #FFFFFF; stroke-width: 2; }
  .big { font-size: 15px; font-weight: 800; fill: #3D2A22; paint-order: stroke; stroke: #FFFFFF; stroke-width: 4px; }
  .cursor { stroke: #1E3F5C; stroke-width: 1.5; stroke-dasharray: 3 3; }
  .bubble { fill: #1E3F5C; }
  .b-val { fill: #FFFFFF; font-size: 14px; font-weight: 800; text-anchor: middle; }
  .b-yr { fill: rgba(255,255,255,.75); font-size: 10px; font-weight: 700; text-anchor: middle; }
  .hot { fill: #1E3F5C; stroke: #FFFFFF; stroke-width: 2; }
  .losses { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; margin-top: .6rem; }
  .losses p { margin: 0; padding: .45rem .6rem; border-radius: 8px; background: color-mix(in srgb, var(--ec) 8%, transparent); border-inline-start: 4px solid var(--ec); font-size: .8rem; line-height: 1.4; }
  .losses :global(b) { color: var(--ec); }
  .losses :global(.e) { display: block; font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--ec); }
  .note { margin: .6rem 0 0; font-size: .72rem; color: #9C8B7B; }

  .calc h4 { margin-bottom: .8rem; }
  .row { display: flex; align-items: center; gap: .6rem; margin-bottom: .8rem; flex-wrap: wrap; }
  .lbl { width: 3.2rem; font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8A7A6B; }
  .chips { display: flex; flex-wrap: wrap; gap: .3rem; flex: 1; }
  .chips button { font: 700 .8rem Quicksand, sans-serif; color: #4D6473; background: rgba(255, 255, 255, .45); border: 1.5px solid #D9CFC2; border-radius: 999px; padding: .2rem .55rem; cursor: pointer; }
  .chips button.on { background: #B5523B; border-color: #B5523B; color: #FFFFFF; }
  .row input { flex: 1; accent-color: #B5523B; }
  .yr { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; color: #B5523B; }
  .compare { display: flex; align-items: center; gap: .5rem; margin-top: .4rem; }
  .side { flex: 1; display: flex; flex-direction: column; gap: .1rem; padding: .7rem; border-radius: 10px; background: rgba(181, 82, 59, .08); text-align: center; }
  .side span { font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #8A7A6B; }
  .side b { font-size: 1.05rem; }
  .side em { font-style: normal; font-size: 1.15rem; font-weight: 800; color: #2E7D5B; }
  .side.now em { color: #B8454E; }
  .arrow { font-size: 1.3rem; color: #9C8B7B; }
  .verdict { margin: .8rem 0 0; font-size: .9rem; line-height: 1.5; }
  .verdict :global(b) { color: #B8454E; }
  .notes { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-top: 1rem; padding-top: .9rem; border-top: 1px dashed #E6DCCF; }
  .notes figure { margin: 0; display: flex; flex-direction: column; gap: .3rem; }
  .notes figcaption { font-size: .7rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #8A7A6B; }
  .notes img { width: 100%; height: auto; border-radius: 6px; box-shadow: 0 3px 10px rgba(61, 42, 34, .18); }
  .who { font-size: .78rem; font-weight: 600; color: #4D6473; }
  .none { margin: 0; padding: .6rem; border-radius: 8px; background: #F6EEE3; font-size: .78rem; line-height: 1.45; color: #6B5D50; }

  @media (max-width: 860px) {
    .dv { grid-template-columns: minmax(0, 1fr); }
    .losses { grid-template-columns: 1fr; }
  }
</style>
