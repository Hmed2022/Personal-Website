<script>
  // New version of the "who is on the notes" scrollytelling (Graph.svelte / Beeswarm.svelte kept).
  // Every banknote portrait is a small face on the chart; the three scroll steps re-arrange or
  // re-colour the same faces:
  //   0  occupation  - notes stacked by year of issue, ringed by profession
  //   1  gender      - the two women stand out
  //   2  years       - how long after their death people were honoured (Bourguiba: while alive)
  import { scaleLinear } from 'd3-scale';
  import { fade } from 'svelte/transition';
  import Scroll from './Scrolly.svelte';
  import { t, money, pick, lang } from '../../i18n.js';
  import PortraitCard from './PortraitCard.svelte';
  import { realNotes } from '../Timeline/noteImage.js';
  import raw from './Data/data.js';

  const FACE = import.meta.glob('../../Components/portraits/*-d.webp', { eager: true, as: 'url' });
  const drawn = (k) => FACE[`../../Components/portraits/${k}-d.webp`];
  // "Real notes": the engraved face from the note. Variants without their own photo use the closest one
  // (each Bourguiba note -> young or old Bourguiba, the 1992 Kheireddine -> Kheireddine...).
  const REAL = import.meta.glob('../../Components/portraits/*-r.webp', { eager: true, as: 'url' });
  const realOf = (k) => {
    const r = (x) => REAL[`../../Components/portraits/${x}-r.webp`];
    if (r(k)) return r(k);
    const m = /^bourguiba-[\d.]+-(\d{4})$/.exec(k);
    if (m) return r(+m[1] < 1980 ? 'bourguiba-young' : 'bourguiba-old');
    return r(k.replace(/-brown$|\d{4}$/, ''));
  };
  $: face = (k) => ($realNotes && realOf(k)) || drawn(k);

  // ---------- data ----------
  const OCC = {
    President: { label: 'occPresident', color: '#025E73' },
    'General Military': { label: 'occMilitary', color: '#8C4D3F' },
    Philosopher: { label: 'occPhilosopher', color: '#AB7E56' },
    Poet: { label: 'occPoet', color: '#7C4A8C' },
    Founder: { label: 'occFounder', color: '#C9A46F' },
    Unionist: { label: 'occUnionist', color: '#BF5630' },
    Doctor: { label: 'occDoctor', color: '#D9669B' },
    Agronomist: { label: 'occAgronomist', color: '#5B8C3E' },
    'Governor of Central Bank': { label: 'occGovernor', color: '#3E558E' },
  };
  const ERAS = [
    { name: 'eraBourguiba', short: 'eraBourguibaShort', from: 1956, to: 1987, tint: 'rgba(3, 136, 166, .08)', ink: '#025E73' },
    { name: 'eraBenAli', short: 'eraBenAliShort', from: 1987, to: 2011, tint: 'rgba(124, 74, 140, .09)', ink: '#7C4A8C' },
    { name: 'eraRevolution', short: 'eraRevolutionShort', from: 2011, to: 2024, tint: 'rgba(191, 86, 48, .08)', ink: '#BF5630' },
  ];
  const eraOf = (y) => ERAS.find((e) => y >= e.from && y < e.to) || ERAS[2];

  function person(name, year, value) {
    const n = name.toLowerCase();
    // each Bourguiba face is cropped from the illustration of its own note (bourguiba-<value>-<year>-d.webp)
    const own = `bourguiba-${value}-${year}`;
    if (n.includes('bourguiba')) return { key: drawn(own) ? own : year < 1980 ? 'bourguiba-young' : 'bourguiba-old', name: 'Habib Bourguiba', ar: 'الحبيب بورقيبة' };
    if (n.includes('amami')) return { key: 'amami', name: 'Slaheddine El Amami', ar: 'صلاح الدين العمامي' };
    if (n.includes('hached')) return { key: 'hached', name: 'Farhat Hached', ar: 'فرحات حشاد' };
    if (n.includes('chebbi')) return { key: year < 2000 ? 'chebbi30' : 'chebbi10', name: 'Abou El Kacem Chebbi', ar: 'أبو القاسم الشابي' };
    if (n.includes('khaldoun') || n.includes('khaidoun')) return { key: 'khaldoun', name: 'Ibn Khaldoun', ar: 'ابن خلدون' };
    if (n.includes('hannibal')) return { key: year < 2000 ? 'hannibal-old' : 'hannibal-new', name: 'Hannibal', ar: 'حنبعل' };
    if (n.includes('kheireddine')) return { key: year < 2011 ? 'kheireddine1992' : 'kheireddine', name: 'Kheireddine Pacha', ar: 'خير الدين باشا' };
    if (n.includes('elissa')) return { key: 'elissa', name: 'Elissa (Dido)', ar: 'عليسة (ديدون)' };
    if (n.includes('rachiq')) return { key: year < 2011 ? 'rachiq2008' : 'rachiq', name: 'Ibn Rachiq', ar: 'ابن رشيق' };
    if (n.includes('tawhida')) return { key: 'tawhida', name: 'Tawhida Ben Cheikh', ar: 'توحيدة بن الشيخ' };
    if (n.includes('nouira')) return { key: 'nouira', name: 'Hedi Nouira', ar: 'الهادي نويرة' };
    return { key: null, name: name.replace(/'/g, '').trim() };
  }

  let khaldouns = 0;   // two 10 dinars of 1994 share the same data: the first is the blue note, the second the brown one
  const notes = raw.map((d, id) => {
    const year = +String(d.issued).slice(0, 4);
    const p = person(d.name, year, d.value);
    if (p.key === 'khaldoun' && khaldouns++ > 0) p.key = 'khaldoun-brown';
    let gap = d['honor-years'] != null ? +d['honor-years'] : NaN;
    if (Number.isNaN(gap) && p.name === 'Habib Bourguiba') gap = year - 2000;   // he died in 2000
    return { id, year, value: d.value, occ: d.occupation, gender: d.gender, gap, era: eraOf(year), ...p };
  }).sort((a, b) => a.year - b.year || a.value - b.value);

  const total = notes.length;
  const women = notes.filter((n) => n.gender === 'female');
  const since2005 = notes.filter((n) => n.year >= 2005);
  const women2005 = since2005.filter((n) => n.gender === 'female');
  const occCounts = Object.keys(OCC).map((k) => ({ k, ...OCC[k], n: notes.filter((d) => d.occ === k).length })).filter((o) => o.n);

  // ---------- steps ----------
  let step = 0;          // from scrolling
  let picked = null;     // from the tabs (cleared when the visitor scrolls to another step)
  let lastStep = 0;
  $: if (step !== undefined && step !== lastStep) { lastStep = step; picked = null; }
  $: view = picked ?? step ?? 0;
  const TABS = ['psTabs0', 'psTabs1', 'psTabs2'];

  // ---------- layout ----------
  let w = 700, h = 460;
  $: small = w < 520;
  let scaleMode = 'true';
  // smaller faces on the true scale, where everyone near zero is packed together
  $: rBase = small ? 9.5 : w < 760 ? 13 : 18;
  $: r = view === 2 && scaleMode === 'true' ? Math.round(rBase * 0.6) : rBase;
  $: m = { top: 34, right: 16, bottom: 34, left: view === 2 ? (small ? 52 : 74) : 16 };
  $: x = scaleLinear().domain([1955, 2025]).range([m.left, w - m.right]);
  // y scale for "years until honoured":
  //  'true'  = one linear scale (honest distances; the modern figures end up squeezed at the bottom)
  //  'zoom'  = broken axis: linear -60..150 years at the bottom, linear 500..3000 at the top, a marked gap between
  const LOW = [-60, 150], HIGH = [500, 3000];
  $: yTop = m.top + r;
  $: yBot = h - m.bottom - r;
  $: span = yBot - yTop;
  $: yLin = scaleLinear().domain([-60, 3000]).range([yBot, yTop]);
  $: yLow = scaleLinear().domain(LOW).range([yBot, yBot - span * 0.62]);
  $: yHigh = scaleLinear().domain(HIGH).range([yTop + span * 0.30, yTop]);
  $: breakY = (yBot - span * 0.62 + yTop + span * 0.30) / 2;
  $: yGap = scaleMode === 'true' ? yLin : (g) => (g <= LOW[1] ? yLow(g) : g >= HIGH[0] ? yHigh(g) : breakY);

  // beeswarm around a middle line: each face takes the closest free spot above or below it
  function dodge(list, X, mid, rad) {
    const placed = [];
    return list.map((d) => {
      const px = X(d.year + .5);
      let py = mid;
      for (let k = 0; k < 120; k++) {
        const off = Math.ceil(k / 2) * 3 * (k % 2 ? -1 : 1);
        const hit = placed.some((p) => (p.x - px) ** 2 + (p.y - (mid + off)) ** 2 < (2 * rad + 1.5) ** 2);
        if (!hit) { py = mid + off; break; }
      }
      placed.push({ x: px, y: py });
      return { x: px, y: py };
    });
  }
  // nudge faces apart where they sit on top of each other (years view)
  function relax(pos, rad) {
    const p = pos.map((q) => ({ ...q }));
    for (let it = 0; it < 80; it++) {
      for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) {
        const dx = p[j].x - p[i].x, dy = p[j].y - p[i].y, d = Math.hypot(dx, dy) || .01, min = 2 * rad + 1;
        if (d < min) {
          const push = (min - d) / 2, ux = dx / d, uy = dy / d || (j % 2 ? 1 : -1) * .2;
          p[i].x -= ux * push; p[i].y -= uy * push; p[j].x += ux * push; p[j].y += uy * push;
        }
      }
    }
    return p;
  }
  $: stackPos = dodge(notes, x, (m.top + h - m.bottom) / 2 + 10, r);
  $: gapPos = relax(notes.map((d) => ({ x: x(d.year + .5), y: yGap(d.gap) })), r);
  $: pos = view === 2 ? gapPos : stackPos;

  const decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
  $: gapTicks = scaleMode === 'true' ? [0, 500, 1000, 1500, 2000, 2500, 3000] : [-40, 0, 25, 50, 100, 150, 500, 1000, 2000, 3000];
  const ringOf = (d, v) => v === 1 ? (d.gender === 'female' ? '#D9669B' : '#B7C9CC') : v === 2 ? d.era.ink : OCC[d.occ]?.color || '#888';
  $: fmtGap = (g) => g < 0 ? $t('psGapAlive', { n: -g }) : $t('psGapAfter', { n: g.toLocaleString() });

  // annotation anchors
  $: topOf = (test) => Math.min(...notes.map((d, i) => (test(d) ? pos[i]?.y ?? Infinity : Infinity)));
  $: bourgTop = topOf((d) => d.name === 'Habib Bourguiba');
  $: recentTop = topOf((d) => d.year >= 2013);
  $: idx = (name, year) => notes.findIndex((d) => d.name === name && (!year || d.year === year));

  // ---------- legend hover: highlight the matching faces ----------
  let legendHot = null;   // occupation key, 'female' / 'male', or an era name, depending on the view
  $: view, (legendHot = null);
  const matches = (d, v, k) => v === 0 ? d.occ === k : v === 1 ? (k === 'female') === (d.gender === 'female') : d.era.name === k;
  const hl = (k) => ({ enter: () => (legendHot = k), leave: () => (legendHot = null) });

  // ---------- tooltip ----------
  let tip = null;
  function show(e, d) {
    const box = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    tip = { d, x: e.clientX - box.left, y: e.clientY - box.top, flip: e.clientX - box.left > w - 230 };
  }
</script>

<section class="ps">
  <div class="sticky">
    <div class="tabs" role="tablist" aria-label={$t('psChoose')}>
      {#each TABS as tab, i}
        <button type="button" role="tab" aria-selected={view === i} class:on={view === i} on:click={() => (picked = i)}>{$t(tab)}</button>
      {/each}
    </div>

    <!-- legend for the current view -->
    <div class="legend">
      {#if view === 0}
        {#each occCounts as o}<span class="lg" class:on={legendHot === o.k} tabindex="0" role="button" on:pointerenter={hl(o.k).enter} on:pointerleave={hl(o.k).leave} on:focus={hl(o.k).enter} on:blur={hl(o.k).leave}><i style="border-color:{o.color}"></i>{$t(o.label)} <b>{o.n}</b></span>{/each}
      {:else if view === 1}
        <span class="lg" class:on={legendHot === 'female'} tabindex="0" role="button" on:pointerenter={hl('female').enter} on:pointerleave={hl('female').leave} on:focus={hl('female').enter} on:blur={hl('female').leave}><i style="border-color:#D9669B"></i>{$t('psWomen')} <b>{women.length}</b></span>
        <span class="lg" class:on={legendHot === 'male'} tabindex="0" role="button" on:pointerenter={hl('male').enter} on:pointerleave={hl('male').leave} on:focus={hl('male').enter} on:blur={hl('male').leave}><i style="border-color:#B7C9CC"></i>{$t('psMen')} <b>{total - women.length}</b></span>
      {:else}
        {#each ERAS as e}<span class="lg" class:on={legendHot === e.name} tabindex="0" role="button" on:pointerenter={hl(e.name).enter} on:pointerleave={hl(e.name).leave} on:focus={hl(e.name).enter} on:blur={hl(e.name).leave}><i style="border-color:{e.ink}"></i>{$t(e.name)}</span>{/each}
      {/if}
    </div>
    {#if view === 2}
      <div class="scale-row" transition:fade={{ duration: 200 }}>
        <div class="scale-toggle" role="radiogroup" aria-label={$t('psScaleAria')}>
          <button type="button" role="radio" aria-checked={scaleMode === 'true'} class:on={scaleMode === 'true'} on:click={() => (scaleMode = 'true')}>{$t('psScaleTrue')}</button>
          <button type="button" role="radio" aria-checked={scaleMode === 'zoom'} class:on={scaleMode === 'zoom'} on:click={() => (scaleMode = 'zoom')}>{$t('psScaleZoom')}</button>
        </div>
        <span class="scale-note">{scaleMode === 'true' ? $t('psScaleNoteTrue') : $t('psScaleNoteZoom')}</span>
      </div>
    {/if}

    <div class="chart" dir="ltr" bind:clientWidth={w} bind:clientHeight={h}>
      <svg width={w} height={h} role="img" aria-label={$t('psChart')}>
        <defs><clipPath id="ps-face" clipPathUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5" /></clipPath></defs>

        <!-- era bands -->
        {#each ERAS as e}
          <rect x={x(e.from)} y={m.top - 22} width={x(e.to) - x(e.from)} height={h - m.bottom - m.top + 22} fill={e.tint} />
          <text class="era" x={x(e.from) + 6} y={m.top - 9}>{small ? $t(e.short) : $t(e.name)}</text>
        {/each}

        <!-- x axis -->
        <line class="axis" x1={m.left} x2={w - m.right} y1={h - m.bottom} y2={h - m.bottom} />
        {#each decades as tk}
          <line class="tick" x1={x(tk)} x2={x(tk)} y1={h - m.bottom} y2={h - m.bottom + 5} />
          <text class="tick-label" x={x(tk)} y={h - m.bottom + 19}>{small ? `'${String(tk).slice(2)}` : tk}</text>
        {/each}

        <!-- years view: y axis + "still alive" band -->
        {#if view === 2}
          <g transition:fade={{ duration: 300 }}>
            <rect x={m.left} y={yGap(0)} width={w - m.left - m.right} height={h - m.bottom - yGap(0)} class="alive" />
            {#if scaleMode === 'zoom'}<text class="alive-label" x={w - m.right - 8} y={yGap(0) + 16}>{small ? $t('psAliveShort') : $t('psAlive')}</text>{/if}
            {#each gapTicks as tk}
              <line class="grid" x1={m.left} x2={w - m.right} y1={yGap(tk)} y2={yGap(tk)} />
              <text class="y-label" x={m.left - 6} y={yGap(tk) + 4}>{tk < 0 ? $t('psBefore', { n: -tk }) : tk === 0 ? $t('psDeath') : tk.toLocaleString()}</text>
            {/each}
            <text class="y-title" transform="translate({small ? 11 : 14} {(m.top + h - m.bottom) / 2}) rotate(-90)">{$t('psYearsAfter')}</text>
            {#if scaleMode === 'zoom'}
              <!-- axis break: the scale skips from 150 to 500 years -->
              <rect x={m.left} y={breakY - 9} width={w - m.left - m.right} height="18" class="break-band" />
              <path class="break-zig" d={`M${m.left - 14} ${breakY - 3} l7 -6 l7 12 l7 -6`} />
              <path class="break-zig" d={`M${m.left - 14} ${breakY + 5} l7 -6 l7 12 l7 -6`} />
            {/if}
          </g>
        {/if}

        <!-- faces -->
        {#each notes as d, i (d.id)}
          {@const p = pos[i] || { x: 0, y: 0 }}
          {@const dim = legendHot != null ? !matches(d, view, legendHot) : view === 1 && d.gender !== 'female'}
          <g class="face" class:dim class:hot={tip?.d === d}
             style="transform: translate({p.x}px, {p.y}px)"
             on:pointerenter={(e) => show(e, d)} on:pointermove={(e) => show(e, d)} on:pointerleave={() => (tip = null)}
             on:click={(e) => show(e, d)} on:keydown={(e) => e.key === 'Enter' && show(e, d)}
             tabindex="0" role="button" aria-label={`${$pick(d.name, d.ar)}, ${$t(OCC[d.occ]?.label)}, ${$money(d.value)}, ${d.year}`}>
            <circle r={view === 1 && d.gender === 'female' ? r * 1.25 : r} class="bg" />
            {#if d.key}
              {@const rr = view === 1 && d.gender === 'female' ? r * 1.25 : r}
              <image href={face(d.key)} x={-rr} y={-rr} width={rr * 2} height={rr * 2} clip-path="url(#ps-face)" preserveAspectRatio="xMidYMin slice" />
            {/if}
            <circle r={view === 1 && d.gender === 'female' ? r * 1.25 : r} class="ring" style="stroke:{ringOf(d, view)}" />
          </g>
        {/each}

        <!-- annotations -->
        {#key `${view}-${w}`}
          <g class="notes" in:fade={{ duration: 400, delay: 500 }}>
            {#if view === 0 && !small}
              <text x={x(1971)} y={bourgTop - r - 12} class="ann">{$t('psOneFace')}</text>
              <text x={x(2018)} y={recentTop - r - 12} class="ann">{$t('psSince2013')}</text>
            {:else if view === 1}
              {#each women as wd}
                {@const i = idx(wd.name, wd.year)}
                {@const p = pos[i]}
                {#if p}
                  <line x1={p.x} y1={p.y - r * 1.25} x2={p.x} y2={p.y - r * 1.25 - 26} class="lead" />
                  <text x={p.x} y={p.y - r * 1.25 - 32} class="ann pink">{$pick(wd.name, wd.ar).split(' (')[0]} · {wd.year}</text>
                {/if}
              {/each}
            {:else if view === 2}
              {#each [['Elissa (Dido)', 2005, 'psElissa', 'psElissa'], ['Hannibal', 1993, 'psHannibal', 'psHannibal'], ['Tawhida Ben Cheikh', 2020, 'psTawhida', 'psTawhidaShort']].filter((a) => scaleMode === 'zoom' || a[1] !== 2020) as [nm, yr, lbl, lblShort]}
                {@const i = idx(nm, yr)}
                {@const p = pos[i]}
                {#if p}
                  {@const left = p.x > w * .55}
                  <text x={p.x + (left ? -r - 6 : r + 6)} y={p.y + 4} class="ann side" style="text-anchor:{left ? 'end' : 'start'}">{small ? $t(lblShort) : $t(lbl)}</text>
                {/if}
              {/each}
            {/if}
          </g>
        {/key}
      </svg>

      {#if tip}
        <div class="tip" class:flip={tip.flip} style="left:{tip.x}px; top:{tip.y}px" transition:fade={{ duration: 100 }}>
          {#if tip.d.key}<img src={face(tip.d.key)} alt="" />{/if}
          <div>
            <b>{$pick(tip.d.name, tip.d.ar)}</b>
            <span>{$t(OCC[tip.d.occ]?.label)}</span>
            <span class="v">{$money(tip.d.value)} · {tip.d.year}</span>
            <span class="g">{fmtGap(tip.d.gap)}</span>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- phones: the text for the chosen tab, under the chart (no scrolling steps) -->
  <div class="mobile-text">
    {#key view}<div in:fade={{ duration: 250 }}><PortraitCard k={view} bourguibaNotes={notes.filter((d) => d.name === 'Habib Bourguiba').length} women={women.length} {total} women2005={women2005.length} since2005={since2005.length} /></div>{/key}
  </div>

  <!-- ===== scrolling text ===== -->
  <div class="steps">
    <Scroll bind:value={step}>
      <div class="step" class:active={view === 0}><PortraitCard k={0} bourguibaNotes={notes.filter((d) => d.name === 'Habib Bourguiba').length} women={women.length} {total} women2005={women2005.length} since2005={since2005.length} /></div>
      <div class="step" class:active={view === 1}><PortraitCard k={1} bourguibaNotes={notes.filter((d) => d.name === 'Habib Bourguiba').length} women={women.length} {total} women2005={women2005.length} since2005={since2005.length} /></div>
      <div class="step" class:active={view === 2}><PortraitCard k={2} bourguibaNotes={notes.filter((d) => d.name === 'Habib Bourguiba').length} women={women.length} {total} women2005={women2005.length} since2005={since2005.length} /></div>
    </Scroll>
  </div>
</section>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

  .ps {
    display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 2rem;
    width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 1rem; box-sizing: border-box;
    font-family: Quicksand, sans-serif; color: #3D2A22;
  }
  .sticky { position: sticky; top: 4vh; height: 90vh; display: flex; flex-direction: column; align-self: start; }

  .tabs { display: flex; flex-wrap: wrap; gap: .4rem; justify-content: center; }
  .tabs button {
    font: 700 .85rem Quicksand, sans-serif; color: #4D6473; cursor: pointer;
    background: rgba(255, 255, 255, .45); border: 1.5px solid #C8D9DC; border-radius: 999px; padding: .35rem .9rem;
  }
  .tabs button.on { background: #1E5B8C; border-color: #1E5B8C; color: #FFFFFF; }

  .legend { display: flex; flex-wrap: wrap; justify-content: center; gap: .3rem .85rem; margin: .7rem 0 .2rem; min-height: 2.6rem; font-size: .76rem; font-weight: 600; color: #4D6473; }
  .legend i { display: inline-block; width: .7rem; height: .7rem; border-radius: 50%; border: 3px solid; background: #FFF; margin-inline-end: .3rem; vertical-align: -.15rem; }
  .legend b { color: #3D2A22; }
  .lg { cursor: default; padding: .1rem .45rem; border-radius: 999px; transition: background .2s, color .2s; outline: none; }
  .lg:hover, .lg.on, .lg:focus-visible { background: rgba(30, 63, 92, .1); color: #1E3F5C; }

  .chart { position: relative; flex: 1; min-height: 300px; min-width: 0; }
  svg { display: block; overflow: visible; }
  .era { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; fill: rgba(61, 42, 34, .55); }
  .axis { stroke: #8FA5AA; }
  .tick { stroke: #8FA5AA; }
  .tick-label { font-size: 12px; font-weight: 700; fill: #4D6473; text-anchor: middle; }
  .grid { stroke: rgba(77, 100, 115, .18); stroke-dasharray: 3 4; }
  .y-label { font-size: 11px; font-weight: 700; fill: #4D6473; text-anchor: end; }
  .y-title { font-size: 11px; font-weight: 700; fill: #4D6473; text-anchor: middle; letter-spacing: .04em; }
  .alive { fill: rgba(2, 94, 115, .07); }
  .break-band { fill: var(--tn-paper, #FAF3E8); opacity: .9; }
  .break-zig { fill: none; stroke: #8FA5AA; stroke-width: 1.5; }
  .scale-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .4rem .8rem; margin: -.2rem 0 .3rem; }
  .scale-toggle { display: inline-flex; gap: .2rem; padding: .2rem; border-radius: 999px; background: #EFE6DA; }
  .scale-toggle button { font: 700 .78rem Quicksand, sans-serif; color: #4D6473; background: none; border: none; border-radius: 999px; padding: .28rem .75rem; cursor: pointer; }
  .scale-toggle button.on { background: #FFFFFF; color: #1E3F5C; box-shadow: 0 1px 4px rgba(61, 42, 34, .18); }
  .scale-note { font-size: .74rem; color: #7A8B92; max-width: 30rem; }
  .alive-label { font-size: 12px; font-weight: 800; fill: #025E73; text-anchor: end; }

  .face { cursor: pointer; transition: transform .9s cubic-bezier(.2, .8, .2, 1), opacity .5s; outline: none; }
  .face .bg { fill: #F7EFE6; }
  .face .ring { fill: none; stroke-width: 2.6; transition: stroke .5s, r .4s; }
  .face .bg, .face image { transition: r .4s; }
  .face.dim { opacity: .28; }
  .face.hot .ring, .face:focus-visible .ring { stroke-width: 4; }

  .notes { pointer-events: none; }
  .ann { font-size: 12.5px; font-weight: 800; fill: #3D2A22; text-anchor: middle; paint-order: stroke; stroke: #FAF3E8; stroke-width: 4px; }
  .ann.side { font-size: 12px; }
  .ann.pink { fill: #B8457A; }
  .lead { stroke: #D9669B; stroke-width: 1.5; }

  .tip {
    position: absolute; z-index: 5; display: flex; gap: .6rem; align-items: center; width: 14.5rem;
    transform: translate(14px, -50%); pointer-events: none;
    background: #FFFBF4; border: 1px solid #D9CBB8; border-radius: 10px; padding: .5rem .65rem; box-shadow: 0 8px 22px rgba(61, 42, 34, .2);
  }
  .tip.flip { transform: translate(calc(-100% - 14px), -50%); }
  .tip img { width: 3.2rem; height: 3.2rem; object-fit: cover; object-position: top; border-radius: 50%; background: #F7EFE6; flex: 0 0 auto; }
  .tip div { display: flex; flex-direction: column; line-height: 1.3; font-size: .78rem; }
  .tip b { font-size: .9rem; color: #1E3F5C; }
  .tip .v { font-weight: 700; color: #8C4D3F; }
  .tip .g { color: #4D6473; }

  /* ---- text ---- */
  .step { min-height: 95vh; display: flex; align-items: center; }
  .step :global(.card) { opacity: .45; transform: scale(.98); transition: opacity .4s, transform .4s; }
  .step.active :global(.card) { opacity: 1; transform: none; }
  .mobile-text { display: none; }

  /* ---- phones: chart with tabs, the chosen step's text below it ---- */
  @media (max-width: 860px) {
    .ps { grid-template-columns: minmax(0, 1fr); gap: 0; }
    .sticky { position: static; height: 64vh; min-height: 430px; }
    .legend { min-height: 0; font-size: .7rem; gap: .2rem .6rem; }
    .steps { display: none; }
    .mobile-text { display: block; margin-top: .8rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .face { transition: none; }
  }
</style>
