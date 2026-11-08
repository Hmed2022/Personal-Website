<script>
  // New "Size of the bill" (Scatter.svelte / Graph.svelte are kept).
  // Every note drawn to scale from the same corner, like a stack of real notes on a table.
  import { fade } from 'svelte/transition';
  import raw from './Data/data.js';
  import { t, money, pick } from '../../i18n.js';

  const LOCAL = import.meta.glob('../Timeline/BanknotesSmall/*.webp', { eager: true, as: 'url' });
  function imageOf(n) {
    const m = /baknote-(\d+)\.png/i.exec(n.Preview || '');
    return (m && LOCAL[`../Timeline/BanknotesSmall/Banknote-${m[1].padStart(2, '0')}.webp`]) || null;
  }
  const COLOR = { 0.5: '#0388A6', 1: '#025E73', 5: '#005C53', 10: '#BF5630', 20: '#8C4D3F', 30: '#AB7E56', 50: '#C9A46F' };
  const label = (v) => (v === 0.5 ? '½' : String(v));

  // two values in data.js look mislabelled (checked against the timeline data)
  const FIX = { 'Abou El Kacem Chebbi-1997': 30, 'Abu Hasan Ibn Rachiq-2011': 50 };
  const notes = raw.map((n, id) => ({
    id, value: FIX[`${n.ObserveInEnglish}-${n.Issued}`] ?? n.Value, who: n.ObserveInEnglish, whoAr: n.ObserveInArabic, year: n.Issued,
    long: n.Width, short: n.Height, img: imageOf(n), modern: n.ObserveInEnglish !== 'Habib Bourguiba',
  }));

  let mode = 'all';
  $: list = notes.filter((n) => mode === 'all' || n.modern).sort((a, b) => b.long * b.short - a.long * a.short);
  $: values = [...new Set(list.map((n) => n.value))].sort((a, b) => a - b);
  $: avg = values.map((v) => {
    const g = list.filter((n) => n.value === v);
    return { v, long: Math.round(g.reduce((s, n) => s + n.long, 0) / g.length), short: Math.round(g.reduce((s, n) => s + n.short, 0) / g.length), n: g.length };
  });
  const lenX = (mm) => ((mm - 132) / (186 - 132)) * 100;
  $: largest = list[0];
  $: smallest = list[list.length - 1];

  // ---------- drawing ----------
  let w = 600;
  const MAX_L = 190, MAX_S = 100;               // mm
  $: k = Math.min(w / (MAX_L + 4), 4.2);         // px per mm
  let hot = null;       // hovered note
  let hotValue = null;  // hovered legend value
  // the outline nearest to the pointer (they are nested from one corner, so pick by closest edge)
  function nearest(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - r.left - 2) / k, my = (e.clientY - r.top - 2) / k;
    let best = null, bestD = 6;   // within 6 mm of an edge
    for (const n of list) {
      if (mx > n.long + 2 || my > n.short + 2) continue;
      const d = Math.min(Math.abs(n.long - mx), Math.abs(n.short - my));
      if (d < bestD) { bestD = d; best = n; }
    }
    hot = best;
  }
  $: isOn = (n) => (hot ? hot === n : hotValue != null ? n.value === hotValue : true);
</script>

<div class="sz">
  <div class="modes" role="tablist" aria-label={$t('szWhich')}>
    <button type="button" role="tab" aria-selected={mode === 'all'} class:on={mode === 'all'} on:click={() => { mode = 'all'; hot = null; }}>{$t('szAll')}</button>
    <button type="button" role="tab" aria-selected={mode === 'modern'} class:on={mode === 'modern'} on:click={() => { mode = 'modern'; hot = null; }}>{$t('szModern')}</button>
  </div>

  <div class="layout">
    <!-- notes to scale -->
    <div class="table" dir="ltr" bind:clientWidth={w}>
      <!-- svelte-ignore a11y-click-events-have-key-events (mouse/touch exploration; the same facts are in the panel beside it) -->
      <svg width={w} height={(MAX_S + 6) * k} on:pointerleave={() => (hot = null)} on:pointermove={nearest} on:click={nearest} role="img" aria-label={$t('szDrawn')}>
        <!-- millimetre ruler -->
        {#each [0, 50, 100, 150] as mm}
          <line x1={2 + mm * k} x2={2 + mm * k} y1={(MAX_S + 6) * k - 6} y2={(MAX_S + 6) * k} class="tick" />
          <text x={4 + mm * k} y={(MAX_S + 6) * k - 8} class="mm">{mm} {$t('mm')}</text>
        {/each}
        {#each list as n (n.id)}
          <rect x="2" y="2" width={n.long * k} height={n.short * k} rx={3}
                class="note" class:on={isOn(n)} class:hot={hot === n}
                style="--c:{COLOR[n.value]}" />
        {/each}
        {#if hot}
          {#if hot.img}
            <image href={hot.img} x="2" y="2" width={hot.long * k} height={hot.short * k} preserveAspectRatio="none" opacity=".92" transition:fade={{ duration: 150 }} />
          {/if}
          <rect x="2" y="2" width={hot.long * k} height={hot.short * k} rx="3" class="frame" style="stroke:{COLOR[hot.value]}" />
        {/if}
      </svg>
      <p class="readout" dir="auto">
        {#if hot}
          <b style="color:{COLOR[hot.value]}">{$money(hot.value)} · {hot.year}</b> · {$pick(hot.who, hot.whoAr)} · {hot.long} × {hot.short} {$t('mm')}
        {:else}
          {$t('szHint')}
        {/if}
      </p>
    </div>

    <!-- facts -->
    <aside class="facts">
      <div class="fact">
        <span class="tag">{$t('szLargest')}</span>
        <b style="color:{COLOR[largest.value]}">{$money(largest.value)} ({largest.year})</b>
        <span>{largest.long} × {largest.short} {$t('mm')}</span>
      </div>
      <div class="fact">
        <span class="tag">{$t('szSmallest')}</span>
        <b style="color:{COLOR[smallest.value]}">{$money(smallest.value)} ({smallest.year})</b>
        <span>{smallest.long} × {smallest.short} {$t('mm')}</span>
      </div>

      <h5>{$t('szLength')}</h5>
      <p class="key"><span class="k-dot"></span> {$t('szKeyNote')} <span class="k-mean"></span> {$t('szKeyAvg')} <span class="k-hint">{$t('szKeyHint')}</span></p>
      <div class="dots" on:pointerleave={() => { hotValue = null; hot = null; }}>
        {#each avg as a (a.v)}
          <div class="row" on:pointerenter={() => (hotValue = a.v)}>
            <b>{label(a.v)} <small>{$t('dt')}</small></b>
            <div class="track" dir="ltr">
              {#each list.filter((n) => n.value === a.v) as n (n.id)}
                <button type="button" class="dot" class:hot={hot === n} class:faded={hot && hot !== n}
                        style="left:{lenX(n.long)}%; --c:{COLOR[a.v]}"
                        on:pointerenter={() => (hot = n)} on:focus={() => (hot = n)} on:click={() => (hot = n)}
                        aria-label={`${$money(n.value)} ${n.year}, ${n.long} ${$t('mm')}`}></button>
                {#if hot === n}<span class="dot-label" style="left:{lenX(n.long)}%">{n.year} · {n.long} {$t('mm')}</span>{/if}
              {/each}
              <span class="mean" style="left:{lenX(a.long)}%; --c:{COLOR[a.v]}" title={$t('szAvgTitle', { n: a.long })}></span>
            </div>
          </div>
        {/each}
        <div class="row axis"><b></b><div class="track" dir="ltr">{#each [135, 150, 165, 180] as tk}<span style="left:{lenX(tk)}%">{tk}</span>{/each}</div></div>
      </div>
      <p class="takeaway">
        {@html mode === 'all' ? $t('szTakeAll') : $t('szTakeMod')}
      </p>
    </aside>
  </div>
</div>

<style>
  .sz { font-family: Quicksand, sans-serif; color: #3D2A22; text-align: start; }
  .modes { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1rem; }
  .modes button { font: 700 .85rem Quicksand, sans-serif; color: #4D6473; cursor: pointer; background: rgba(255, 255, 255, .45); border: 1.5px solid #C8D9DC; border-radius: 999px; padding: .35rem .9rem; }
  .modes button.on { background: #1E5B8C; border-color: #1E5B8C; color: #FFFFFF; }

  .layout { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 1.5rem; align-items: start; }
  .table { background: #F3EBDD; border-radius: 14px; padding: .9rem; box-shadow: inset 0 0 0 1px rgba(61, 42, 34, .06); }
  svg { display: block; overflow: visible; }
  .note { fill: none; stroke: var(--c); stroke-width: 1.6; stroke-opacity: .8; transition: stroke-opacity .2s; pointer-events: none; }
  svg { cursor: crosshair; }
  .note:not(.on) { stroke-opacity: .12; }
  .frame { fill: none; stroke-width: 3; pointer-events: none; }
  image { pointer-events: none; }
  .tick { stroke: #A39582; }
  .mm { font-size: 10px; font-weight: 700; fill: #A39582; }
  .readout { margin: .6rem 0 0; font-size: .82rem; color: #4D6473; min-height: 2.4em; }

  .facts { display: grid; gap: .6rem; }
  .fact { display: grid; gap: .05rem; padding: .6rem .8rem; background: rgba(140, 77, 63, .05); border: 1px solid rgba(140, 77, 63, .16); border-radius: 10px; }
  .fact .tag { font-size: .68rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #8A9AA0; }
  .fact b { font-size: 1rem; }
  .fact span:last-child { font-size: .8rem; color: #4D6473; }
  h5 { margin: .4rem 0 0; font-size: .8rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #4D6473; }
  .dots { display: grid; gap: .3rem; }
  .row { display: grid; grid-template-columns: 2.6rem 1fr; align-items: center; gap: .4rem; }
  .row > b { font-size: .8rem; }
  .row > b small { font-size: .6rem; opacity: .7; }
  .track { position: relative; height: 16px; border-bottom: 1px solid #E6DCCF; }
  .dot { position: absolute; top: 50%; z-index: 2; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; padding: 0; border: none; border-radius: 50%; background: var(--c); opacity: .6; cursor: pointer; transition: transform .15s, opacity .15s; }
  .dot::before { content: ''; position: absolute; inset: -5px; border-radius: 50%; }   /* bigger hit area */
  .dot:hover, .dot.hot { opacity: 1; transform: scale(1.6); box-shadow: 0 0 0 2px #FFF, 0 1px 4px rgba(0, 0, 0, .3); z-index: 3; }
  .dot.faded { opacity: .25; }
  .dot-label { position: absolute; bottom: 100%; z-index: 4; transform: translate(-50%, -4px); white-space: nowrap; padding: .05rem .4rem; border-radius: 4px; background: #1E2A30; color: #FFF; font-size: .66rem; font-weight: 700; pointer-events: none; }
  .mean { position: absolute; top: 1px; bottom: 1px; width: 3px; margin-left: -1.5px; border-radius: 2px; background: var(--c); opacity: .9; }
  .key { display: flex; flex-wrap: wrap; align-items: center; gap: .3rem; margin: -.1rem 0 .3rem; font-size: .72rem; color: #7A8B92; }
  .k-dot { width: 8px; height: 8px; border-radius: 50%; background: #8A9AA0; }
  .k-mean { width: 3px; height: 12px; border-radius: 2px; background: #4D6473; margin-left: .5rem; }
  .k-hint { color: #A39582; }
  .row.axis .track { border: none; height: 14px; }
  .row.axis span { position: absolute; transform: translateX(-50%); font-size: .65rem; font-weight: 700; color: #8A9AA0; }
  .takeaway { margin: .2rem 0 0; font-size: .85rem; line-height: 1.5; }

  @media (max-width: 820px) {
    .layout { grid-template-columns: minmax(0, 1fr); }
  }
</style>
