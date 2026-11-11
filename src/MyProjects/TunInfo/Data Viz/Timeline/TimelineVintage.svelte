<script>
  // New interactive timeline (the original Timeline.svelte is kept untouched).
  // Lanes per denomination, notes as bars from issue to withdrawal, era bands behind,
  // a year slider ("what was in your wallet?") with play, the hover tooltip from the
  // original (note preview + "Click for more info") and the original click modal.
  // Horizontal on wide screens, vertical (years going down) on narrow ones.
  import { onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import data from './Data/data.js';
  import ModalContent from './Components/ModalContent.svelte';   // previous details window (kept)
  import NoteModal from './Components/NoteModal.svelte';
  import { noteImage } from './noteImage.js';
  import NoteLifespans from './NoteLifespans.svelte';
  import NoteBinder from './NoteBinder.svelte';
  import daliImg from '../../Components/dali.svg';   // the era stories are Dali talking         // the reader's binder of notes, before they are sorted   // second view of the same notes: how long each one lasted
  import illus60 from './BanknotesSmall/Banknote-41.webp';            // 1958 illustration with Western 5s
  import real58 from '../../Components/eras/real-5-1958.webp';
  import real60 from '../../Components/eras/real-5-1960.webp';
  import { zellige, frieze, star } from '../../Components/tunisianPatterns.js';
  import { t, pick, money, lang, isAr } from '../../i18n.js';
  import eraYoung from './Assets/era-young.webp';
  import eraOld from './Assets/era-old.webp';
  import eraTawhida from './Assets/era-tawhida.webp';
  import grain from './Assets/paper-grain.webp';   // pre-rendered paper grain (an SVG noise filter was repainted on every change)

  // ---------- data ----------
  const START = 1956;        // independence
  const END = 2024;          // "today" edge for notes still in circulation
  const LAST_DATA_YEAR = 2023;

  const VALUES = [0.5, 1, 5, 10, 20, 30, 50];
  const COLORS = { 0.5: '#0388A6', 1: '#025E73', 5: '#005C53', 10: '#BF5630', 20: '#8C4D3F', 30: '#AB7E56', 50: '#C9A46F' };
  const label = (v) => (v === 0.5 ? '½' : String(v));

  const ERAS = [
    { name: 'Bourguiba era', key: 'eraBourguiba', from: 1956, to: 1987, tint: 'rgba(3, 136, 166, .09)', ink: '#025E73' },
    { name: 'Ben Ali era', key: 'eraBenAli', from: 1987, to: 2011, tint: 'rgba(124, 74, 140, .11)', ink: '#7C4A8C' },
    { name: 'After the revolution', key: 'eraRevolution', from: 2011, to: END, tint: 'rgba(191, 86, 48, .09)', ink: '#BF5630' },
  ];

  // The era stories and counts from the original timeline (same text, same numbers).
  // counts follow VALUES: ½, 1, 5, 10, 20, 30, 50
  const STORIES = [
    {
      title: 'st0Title', years: '1956 – 1987', total: 23, counts: [4, 5, 7, 5, 2, 0, 0],
      text: 'st0Text',
      ask: 'insTimelineNote',   // your notebook slip; the story is Dali's answer
      figures: [
        { img: eraYoung, alt: 'Young Bourguiba portraits', caption: 'st0Fig1' },
        { img: eraOld, alt: 'Old Bourguiba portraits', caption: 'st0Fig2' },
      ],
    },
    {
      title: 'st1Title', years: '1987 – 2011', total: 7, counts: [0, 0, 1, 3, 1, 1, 1],
      text: 'st1Text',
      ask: 'st1Ask',
      note: 'st1Note',
      figures: [],
    },
    {
      title: 'st2Title', years: '2011 – today', total: 8, counts: [0, 0, 2, 2, 2, 0, 2],
      text: 'st2Text',
      ask: 'st2Ask',
      note: 'st2Note',
      figures: [
        { img: eraTawhida, alt: 'Tawhida Ben Cheikh', wide: true, caption: 'st2Fig' },
      ],
    },
  ];
  const MAX_COUNT = 7;

  // local illustration of each note, with the mismatched files corrected (see noteImage.js)
  const imageOf = (n) => noteImage(n);

  const endOf = (n) => (n.Active === 'Yes' ? END : n.EndofCirculation);
  const notes = data.map((n, id) => ({ ...n, id, img: imageOf(n), end: endOf(n) }));

  // The first 5 dinars (1958) was reprinted on 1 November 1960 with a Western "5" in place of the Eastern "٥".
  // On the timeline it is shown as two bars, 1958 – 1960 and 1960 – 1962; the note counts elsewhere stay the same.
  {
    const i = notes.findIndex((n) => n.Value === 5 && n.Issued === 1958);
    if (i > -1) {
      const n = notes[i];
      notes[i] = { ...n, EndofCirculation: 1960, end: 1960, PathF: real58, numerals: 'tlNumEast' };
      notes.push({ ...n, id: notes.length, Issued: 1960, img: illus60, PathF: real60, numerals: 'tlNumWest' });
    }
  }

  // pack each denomination's notes into tracks so overlapping notes don't collide
  const lanes = VALUES.map((v) => {
    const tracks = [];
    const items = notes.filter((n) => n.Value === v).sort((a, b) => a.Issued - b.Issued);
    for (const n of items) {
      let t = tracks.findIndex((lastEnd) => lastEnd <= n.Issued);
      if (t === -1) { t = tracks.length; tracks.push(0); }
      tracks[t] = n.end;
      n.track = t;
    }
    return { value: v, items, tracks: Math.max(1, tracks.length) };
  });

  // ---------- year / wallet ----------
  // the story builds up in three steps: a binder of unsorted notes, then the notes sorted on a timeline,
  // then the same timeline split into the three eras
  let stage = 'binder';   // 'binder' | 'sorted' | 'eras'
  $: withEras = stage === 'eras';
  // Sorting, step by step: the notes are lifted out of the binder and the binder fades away (lift), the notes
  // shrink and fly onto their place on the timeline (fly), the bars take over from the pictures (land) and
  // stretch over the years each note was in circulation (grow), then the axis and labels (axis), then the rest.
  let phase = 'done';     // 'lift' | 'fly' | 'land' | 'grow' | 'axis' | 'done'
  let leaving = false;    // tells the binder to fade away
  let flyers = [];        // the notes in flight: { id, img, from, to, rot, seen }
  let lifted = false, flyFade = false;
  $: building = phase !== 'done';
  $: early = phase === 'fly' || phase === 'land' || phase === 'grow';
  const NOTE_AR = 2.1;                 // width / height of a note picture once it sits on its bar
  const FLY_MS = 950, STAGGER = 750;   // flight time, and the spread of departures (oldest note leaves first)
  // "some of these notes are more than 65 years old" (the first notes are from 1958)
  const OLDEST = Math.floor((new Date().getFullYear() - 1958) / 5) * 5;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  async function sortNotes(e) {
    const d = e && e.detail;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!d || reduce) { stage = 'sorted'; wrapEl?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    // 1. lift the notes out of the binder (positions relative to this section, so scrolling moves them too)
    const s0 = wrapEl.getBoundingClientRect();
    const sx = s0.left + scrollX, sy = s0.top + scrollY;
    const rel = (r) => ({ x: r.x - sx, y: r.y - sy, w: r.w, h: r.h });
    const book = rel(d.book);
    const pileX = book.x + (d.single ? 0.5 : 0.75) * book.w, pileY = book.y + book.h / 2;
    const byDate = [...notes].sort((a, b) => a.Issued - b.Issued || a.Value - b.Value);
    flyers = byDate.map((n) => {
      const r = d.rects[n.id];
      // notes on the other pages come out of the middle of the open page
      const from = r ? rel(r) : { x: pileX - 50 + (Math.random() - 0.5) * 90, y: pileY - 24 + (Math.random() - 0.5) * 120, w: 100, h: 48 };
      return { id: n.id, img: n.img, from, to: null, rot: r ? r.tilt : (Math.random() - 0.5) * 12, seen: !!r };
    });
    lifted = false; flyFade = false;
    phase = 'lift'; leaving = true;
    await tick(); await frame();
    lifted = true;
    await sleep(700);
    // 2. the timeline replaces the binder (still empty), the notes fly to their bars
    stage = 'sorted'; leaving = false; phase = 'fly';
    await tick(); await frame();
    const p = plotEl.getBoundingClientRect(), s1 = wrapEl.getBoundingClientRect();
    const ox = p.left - s1.left, oy = p.top - s1.top;
    plotEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (vertical) {
      flyFade = true;                    // phones: the notes fade out, the columns grow in their place
      await sleep(450);
    } else {
      const pos = {};
      lanes.forEach((l, i) => l.items.forEach((n) => {
        const w = Math.max(8, xOf(n.end) - xOf(n.Issued));
        pos[n.id] = { x: ox + LABEL_W + xOf(n.Issued), y: oy + laneTops[i] + LANE_PAD + n.track * (BAR_H + GAP), w: Math.min(w, BAR_H * NOTE_AR), h: BAR_H };
      }));
      flyers = flyers.map((f) => ({ ...f, to: pos[f.id] || f.from }));
      await sleep(FLY_MS + STAGGER + 60);
    }
    // 3. bars take over, then stretch across the years
    phase = 'land';
    await sleep(280);
    flyers = [];
    phase = 'grow';
    await sleep(1300);
    // 4. axis and labels, then everything else
    phase = 'axis';
    await sleep(550);
    phase = 'done';
  }
  function splitEras() { stage = 'eras'; }
  let view = 'time';   // 'time' = the timeline, 'life' = how long each note lasted
  let year = 1995;
  const inCirculation = (n, y) => n.Issued <= y && (n.Active === 'Yes' ? true : y < n.EndofCirculation);
  $: wallet = notes.filter((n) => inCirculation(n, year)).sort((a, b) => a.Value - b.Value || a.Issued - b.Issued);
  $: walletTotal = wallet.reduce((s, n) => s + n.Value, 0);
  $: currentEra = ERAS.find((e) => year >= e.from && year < e.to) || ERAS[ERAS.length - 1];
  $: eraIndex = ERAS.indexOf(currentEra);

  let playing = false;
  let playTimer;
  function togglePlay() {
    playing = !playing;
    if (!playing) { clearInterval(playTimer); return; }
    if (year >= LAST_DATA_YEAR) year = 1958;
    playTimer = setInterval(() => {
      if (year >= LAST_DATA_YEAR) { playing = false; clearInterval(playTimer); return; }
      year += 1;
    }, 180);
  }
  function stopPlay() { playing = false; clearInterval(playTimer); }
  function goEra(e) { stopPlay(); year = Math.round((e.from + Math.min(e.to, LAST_DATA_YEAR)) / 2); }
  onDestroy(() => clearInterval(playTimer));

  // ---------- layout ----------
  let width = 0;                       // measured chart width
  $: vertical = width > 0 && width < 640;

  // horizontal sizes
  const LABEL_W = 56, BAR_H = 26, GAP = 4, LANE_PAD = 7;
  $: plotW = Math.max(200, width - LABEL_W);
  $: xOf = (y) => ((y - START) / (END - START)) * plotW;
  $: laneTops = (() => {
    const tops = []; let y = 28;                     // room for era labels
    for (const l of lanes) { tops.push(y); y += l.tracks * (BAR_H + GAP) + LANE_PAD * 2; }
    tops.push(y);
    return tops;
  })();
  $: chartH = laneTops[laneTops.length - 1];

  // vertical sizes
  const AXIS_W = 40, PX_PER_YEAR = 20, HEAD_H = 34;
  $: totalTracks = lanes.reduce((s, l) => s + l.tracks, 0);
  // every lane is at least LANE_MIN wide so its label fits; bars share the rest
  const LANE_MIN = 26;
  $: barW = (() => {
    let b = Math.max(6, Math.floor((width - AXIS_W - lanes.length * 6) / totalTracks) - 3);
    for (; b > 6; b--) {
      const used = lanes.reduce((s, l) => s + Math.max(LANE_MIN, l.tracks * (b + 3)) + 6, AXIS_W);
      if (used <= width) break;
    }
    return b;
  })();
  $: laneW = (l) => Math.max(LANE_MIN, l.tracks * (barW + 3));
  $: yOf = (y) => HEAD_H + (y - START) * PX_PER_YEAR;
  $: laneLefts = (() => {
    const lefts = []; let x = AXIS_W;
    for (const l of lanes) { lefts.push(x); x += laneW(l) + 6; }
    return lefts;
  })();
  $: chartHV = yOf(END) + 10;

  const ticks = Array.from({ length: Math.floor((END - START) / 5) + 1 }, (_, i) => 1960 + i * 5).filter((t) => t <= END);

  // click on empty chart space = jump the year there
  let plotEl;
  function pickYear(e) {
    if (e.target.closest('.bar')) return;
    const r = plotEl.getBoundingClientRect();
    const y = vertical
      ? START + (e.clientY - r.top - HEAD_H) / PX_PER_YEAR
      : START + ((e.clientX - r.left - LABEL_W) / plotW) * (END - START);
    stopPlay();
    year = Math.max(1958, Math.min(LAST_DATA_YEAR, Math.round(y)));
  }

  // ---------- tooltip (as in the original: preview + "Click for more info") ----------
  let tip = null;           // { note, x, y }
  let wrapEl;
  function place(e) {
    const r = wrapEl.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, flipX: e.clientX > window.innerWidth - 320, flipY: e.clientY > window.innerHeight - 380 };
  }
  function showTip(e, note) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    tip = { note, ...place(e) };
  }
  function moveTip(e) {
    if (!tip) return;
    tip = { ...tip, ...place(e) };
  }
  // extra facts for the tooltip
  const eraOfYear = (y) => ERAS.find((e) => y >= e.from && y < e.to) || ERAS[ERAS.length - 1];
  const SPAN_FROM = 1958, SPAN_TO = 2024;
  const spanPct = (y) => ((y - SPAN_FROM) / (SPAN_TO - SPAN_FROM)) * 100;
  function facts(n) {
    const active = n.Active === 'Yes';
    const until = active ? LAST_DATA_YEAR : n.EndofCirculation;
    const years = Math.max(1, until - n.Issued);
    const usd0 = +n.ValueDayofIssue, usd1 = +n.ValueEndofCirculation;
    const change = usd0 ? Math.round(((usd1 - usd0) / usd0) * 100) : null;
    return { active, until, years, usd0, usd1, change, era: eraOfYear(n.Issued) };
  }


  // ---------- modal (original) ----------
  let showModal = false;
  let selected = notes[0];
  function open(note) { selected = note; tip = null; showModal = true; }
</script>

<section class="vintage" bind:this={wrapEl} style="--zellige:{zellige}; --frieze:{frieze}; --star:{star}">
  <div class="paper" aria-hidden="true" style="--grain:url({grain})"></div>
  <span class="tn-band top" aria-hidden="true"></span><span class="tn-band bottom" aria-hidden="true"></span>
  <span class="corner tl" aria-hidden="true"></span><span class="corner tr" aria-hidden="true"></span>
  <span class="corner bl" aria-hidden="true"></span><span class="corner br" aria-hidden="true"></span>

  <header class="v-head">
    <p class="kicker">{$t('tlKicker')}</p>
    {#key stage}
      <div in:fade={{ duration: 350 }}>
        {#if stage === 'binder'}
          <h2>{$t('bdTitle')}</h2>
          <p class="lede">{@html $t('bdLede')}</p>
        {:else if stage === 'sorted'}
          <h2>{$t('srTitle')}</h2>
          <p class="lede">{@html $t('srLede')}</p>
          <p class="lede how">{view === 'time' ? $t('tlLede') : $t('pLife')}</p>
        {:else}
          <h2>{$t('tlTitle')}</h2>
          <p class="lede">{@html $t('tlEras')}</p>
          <p class="lede how">{view === 'time' ? $t('tlLede') : $t('pLife')}</p>
        {/if}
      </div>
    {/key}
  </header>

  {#if stage === 'binder'}
    <NoteBinder {notes} colors={COLORS} {leaving} on:sort={sortNotes} on:note={(e) => open(e.detail)} />
  {:else}

  <!-- the same notes, two ways -->
  <div class="views" class:hold={building} role="tablist" aria-label={$t('tlViews')}>
    <button type="button" role="tab" aria-selected={view === 'time'} class:on={view === 'time'} on:click={() => (view = 'time')}>{$t('tlViewTime')}</button>
    <button type="button" role="tab" aria-selected={view === 'life'} class:on={view === 'life'} on:click={() => { view = 'life'; stopPlay(); tip = null; }}>{$t('tlViewLife')}</button>
  </div>

  {#if view === 'life'}
  <div class="life" in:fade={{ duration: 300 }}>
    <NoteLifespans />
    <p class="life-take">{$t('insLife')}</p>
  </div>
  {:else}
  <div class="time-view" in:fade={{ duration: 300 }}>
  <!-- era chips + year control -->
  <div class="controls" class:hold={building} class:no-eras={!withEras}>
    {#if withEras}
    <div class="eras" in:fade={{ duration: 300 }}>
      {#each ERAS as e}
        <button type="button" class="era-chip" class:on={currentEra === e} on:click={() => goEra(e)}>{$t(e.key)}</button>
      {/each}
    </div>
    {/if}
    <div class="year-row" dir="ltr">
      <button type="button" class="play" on:click={togglePlay} aria-label={playing ? $t('tlPause') : $t('tlPlay')}>{playing ? '❚❚' : '▶'}</button>
      <input type="range" min="1958" max={LAST_DATA_YEAR} step="1" bind:value={year} on:input={stopPlay} aria-label={$t('tlYear')} />
      <span class="year-badge">{year}</span>
    </div>
  </div>

  <!-- ===================== era story (text + counts from the original) ===================== -->
  <!-- all three are stacked in one grid cell, so the chart doesn't jump when the era changes -->
  {#if !withEras}
    <div class="split" class:hold={building} in:fade={{ duration: 300 }}>
      <p>{@html $t('srNotice', { n: notes.length })}</p>
      <button type="button" class="split-btn" on:click={splitEras}>{$t('srSplit')}</button>
    </div>
  {:else}
  <div class="stories" in:fade={{ duration: 400 }}>
    {#each STORIES as st, i}
      <article class="story" class:on={eraIndex === i} aria-hidden={eraIndex !== i} style="--ec:{ERAS[i].ink}">
        <div class="story-text">
          <p class="story-years">{st.years.replace('today', $t('today'))}</p>
          <h3>{$t(st.title)}</h3>
          {#if st.ask}
            <div class="jot" class:ar={$isAr}>
              <span class="tape" aria-hidden="true"></span>
              <p class="jot-k">{$t('insNoteLabel')}</p>
              <p class="jot-t">{$t(st.ask)}</p>
            </div>
          {/if}
          <p class="story-who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
          <p>{@html $t(st.text)}</p>
        </div>
        <aside class="story-facts">
          <p class="total"><span>{st.total}</span> {$t('tlIssued')}</p>
          <ul class="counts">
            {#each VALUES as v, k}
              <li class:zero={st.counts[k] === 0}>
                <span class="swatch" style="background:{COLORS[v]}"></span>
                <span class="den">{label(v)} {$t('dt')}</span>
                <span class="meter"><i style="width:{(st.counts[k] / MAX_COUNT) * 100}%; background:{COLORS[v]}"></i></span>
                <b>{st.counts[k]}</b>
              </li>
            {/each}
          </ul>
          {#if st.note}<p class="note">{@html $t(st.note)}</p>{/if}
          {#if st.figures.length}
            <div class="figures">
              {#each st.figures as f}
                <figure class:wide={f.wide}>
                  <img src={f.img} alt={f.alt} loading="lazy" />
                  <figcaption>{@html $t(f.caption)}</figcaption>
                </figure>
              {/each}
            </div>
          {/if}
        </aside>
      </article>
    {/each}
  </div>
  {/if}

  <!-- ===================== chart ===================== -->
  <div class="plot" dir="ltr" class:building class:early class:p-fly={phase === 'fly'} class:p-land={phase === 'land'} class:p-grow={phase === 'grow'} bind:this={plotEl} bind:clientWidth={width} on:click={pickYear}
       style="height:{vertical ? chartHV : chartH + 26}px">
    {#if width}
      {#if !vertical}
        <!-- era bands (only once the notes are split into eras) -->
        {#each withEras ? ERAS : [] as e}
          <div class="band" in:fade={{ duration: 500 }} class:current={currentEra === e}
               style="left:{LABEL_W + xOf(e.from)}px; width:{xOf(Math.min(e.to, END)) - xOf(e.from)}px; height:{chartH}px; background:{e.tint}">
            <span class="band-label">{$t(e.key)}</span>
          </div>
        {/each}
        <!-- lanes -->
        {#each lanes as l, i}
          <div class="lane-label" style="top:{laneTops[i]}px; height:{laneTops[i + 1] - laneTops[i]}px">
            <span class="swatch" style="background:{COLORS[l.value]}"></span>{label(l.value)} <small>{$t('dt')}</small>
          </div>
          {#if i > 0}<div class="lane-rule" style="top:{laneTops[i]}px; left:{LABEL_W}px"></div>{/if}
          {#each l.items as n (n.id)}
            {@const w = Math.max(8, xOf(n.end) - xOf(n.Issued))}
            <button type="button" class="bar" class:dim={!inCirculation(n, year)} class:ongoing={n.Active === 'Yes'}
                    style="left:{LABEL_W + xOf(n.Issued)}px; top:{laneTops[i] + LANE_PAD + n.track * (BAR_H + GAP)}px; width:{w}px; height:{BAR_H}px; --c:{COLORS[l.value]}; --iw:{Math.min(w, BAR_H * NOTE_AR)}px; --li:{i}"
                    on:pointerenter={(e) => showTip(e, n)} on:pointermove={moveTip} on:pointerleave={() => (tip = null)}
                    on:click|stopPropagation={() => open(n)} aria-label={`${$money(n.Value)}, ${$pick(n.ObserveInEnglish, n.ObserveInArabic)}, ${n.Issued} – ${n.Active === 'Yes' ? $t('today') : n.EndofCirculation}`}>
              {#if w > 60}<img src={n.img} alt="" loading="lazy" draggable="false" />{/if}
              {#if w > 110}<span class="bar-years">{n.Issued}–{n.Active === 'Yes' ? $t('now') : String(n.EndofCirculation).slice(2)}</span>{/if}
            </button>
          {/each}
        {/each}
        <!-- year axis -->
        {#each ticks as tk}
          <span class="tick" style="left:{LABEL_W + xOf(tk)}px; top:{chartH + 4}px">{tk}</span>
        {/each}
        <!-- year cursor -->
        <div class="cursor" style="left:{LABEL_W + xOf(year + 0.5)}px; height:{chartH}px"><span>{year}</span></div>

      {:else}
        <!-- vertical: years go down, one column per denomination -->
        {#each withEras ? ERAS : [] as e}
          <div class="band v" in:fade={{ duration: 500 }} class:current={currentEra === e}
               style="top:{yOf(e.from)}px; height:{yOf(Math.min(e.to, END)) - yOf(e.from)}px; left:{AXIS_W}px; background:{e.tint}">
            <span class="band-label v">{$t(e.key)}</span>
          </div>
        {/each}
        {#each lanes as l, i}
          <div class="lane-head" style="left:{laneLefts[i]}px; width:{laneW(l)}px">
            <span class="swatch" style="background:{COLORS[l.value]}"></span>{label(l.value)}
          </div>
          {#each l.items as n (n.id)}
            <button type="button" class="bar v" class:dim={!inCirculation(n, year)} class:ongoing={n.Active === 'Yes'}
                    style="top:{yOf(n.Issued)}px; left:{laneLefts[i] + (laneW(l) - l.tracks * (barW + 3)) / 2 + n.track * (barW + 3)}px; height:{Math.max(8, yOf(n.end) - yOf(n.Issued))}px; width:{barW}px; --c:{COLORS[l.value]}; --li:{i}"
                    on:click|stopPropagation={() => open(n)} aria-label={`${$money(n.Value)}, ${$pick(n.ObserveInEnglish, n.ObserveInArabic)}, ${n.Issued} – ${n.Active === 'Yes' ? $t('today') : n.EndofCirculation}`}></button>
          {/each}
        {/each}
        {#each ticks as tk}
          <span class="tick v" style="top:{yOf(tk)}px">{tk}</span>
        {/each}
        <div class="cursor v" style="top:{yOf(year + 0.5)}px; left:{AXIS_W}px"><span>{year}</span></div>
      {/if}
    {/if}
  </div>

  <!-- ===================== wallet ===================== -->
  <div class="wallet" class:hold={building}>
    <div class="wallet-head">
      <h3>{$t('tlWallet')} <span class="year-ink">{year}</span></h3>
      <p>{wallet.length === 1 ? $t('tlInCirc1') : $t('tlInCirc', { n: wallet.length })}{#if withEras} · <b>{$t(currentEra.key)}</b>{/if}</p>
    </div>
    <div class="wallet-notes">
      {#each wallet as n (n.id)}
        <button type="button" class="w-note" style="--c:{COLORS[n.Value]}" in:fade={{ duration: 180 }}
                on:pointerenter={(e) => showTip(e, n)} on:pointermove={moveTip} on:pointerleave={() => (tip = null)}
                on:click={() => open(n)}>
          <img src={n.img} alt={`${$money(n.Value)}, ${$pick(n.ObserveInEnglish, n.ObserveInArabic)}`} loading="lazy" draggable="false" />
          <span class="w-caption">{label(n.Value)} {$t('dt')} · {$pick(n.ObserveInEnglish, n.ObserveInArabic)}</span>
        </button>
      {/each}
    </div>
  </div>
  </div>
  {/if}
  {/if}

  <!-- tooltip (mouse only; touch opens the details directly) -->
  <!-- notes in flight while sorting (positions are relative to this section) -->
  {#if flyers.length}
    <div class="flyers" class:fade={flyFade} aria-hidden="true">
      {#each flyers as f, i (f.id)}
        {@const r = f.to || f.from}
        <span class="flyer" class:lifted={lifted && f.seen && !f.to} class:waiting={!f.seen && !f.to} class:moving={!!f.to}
              style="left:{r.x}px; top:{r.y}px; width:{r.w}px; height:{r.h}px; --rot:{f.rot}deg; --ms:{FLY_MS}ms; --d:{Math.round((i / flyers.length) * STAGGER)}ms"><img src={f.img} alt="" draggable="false" /></span>
      {/each}
    </div>
  {/if}
  {#if phase === 'lift' || phase === 'fly' || phase === 'land'}
    <p class="handling" role="status" transition:fade={{ duration: 250 }}>{$t('srHandling', { n: OLDEST })}</p>
  {/if}

  {#if tip}
    {@const n = tip.note}
    {@const f = facts(n)}
    <div class="tip" class:flip={tip.flipX} class:up={tip.flipY} style="left:{tip.x}px; top:{tip.y}px; --c:{COLORS[n.Value]}" transition:fade={{ duration: 120 }}>
      <div class="tip-img">
        <img src={n.img} alt="" />
        <span class="tip-value">{label(n.Value)} <small>{$t('dt')}</small></span>
        <span class="tip-status" class:live={f.active}>{f.active ? $t('tlStatusIn') : $t('tlWithdrawn', { y: n.EndofCirculation })}</span>
      </div>
      <div class="tip-body">
        <div class="tip-name">
          <b>{n.ObserveInEnglish}</b>
          {#if n.ObserveInArabic}<span lang="ar" dir="rtl">{n.ObserveInArabic}</span>{/if}
        </div>
        {#if withEras}<span class="tip-era" style="--ec:{f.era.ink}">{$t(f.era.key)}</span>{/if}
        {#if n.numerals}<span class="tip-num">{$t(n.numerals)}</span>{/if}

        <div class="tip-span">
          <div class="tip-row"><span>{n.Issued} – {f.active ? $t('today') : n.EndofCirculation}</span><b>{f.years} {f.years === 1 ? $t('year') : $t('years')}</b></div>
          <div class="span-bar" dir="ltr"><i style="left:{spanPct(n.Issued)}%; width:{Math.max(1.5, spanPct(f.until) - spanPct(n.Issued))}%"></i></div>
          <div class="span-ends" dir="ltr"><span>1958</span><span>{$t('today')}</span></div>
        </div>

        {#if f.usd0}
          <div class="tip-usd">
            <span class="lbl">{$t('tlWorth')}</span>
            <div class="tip-row">
              <span>${f.usd0.toFixed(2)} <small>{$t('tlInYear', { y: n.Issued })}</small> {$lang === 'ar' ? '←' : '→'} ${f.usd1.toFixed(2)} <small>{f.active ? $t('today') : $t('tlInYear', { y: n.EndofCirculation })}</small></span>
              {#if f.change != null}<b class:down={f.change < 0} class:up2={f.change >= 0}>{f.change > 0 ? '+' : ''}{f.change}%</b>{/if}
            </div>
          </div>
        {/if}

        {#if n.Width && n.Height}<p class="tip-size">{n.Width} × {n.Height} mm</p>{/if}
        <p class="tip-more">{$t('tlClick')}</p>
      </div>
    </div>
  {/if}

  <!-- <ModalContent bind:showModal data={selected} /> previous details window, kept -->
  <NoteModal bind:open={showModal} bind:note={selected} {notes} colors={COLORS} eras={ERAS} lastYear={LAST_DATA_YEAR} />
</section>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&display=swap');

  /* ---------- aged banknote paper ---------- */
  .vintage {
    position: relative;
    isolation: isolate;
    width: min(1100px, 100%);
    box-sizing: border-box;
    margin: 1.5rem auto;
    padding: 3.2rem 2.2rem 2.6rem;
    color: #4A2E25;
    font-family: Quicksand, sans-serif;
    background-color: #F3E7CC;
    border: 2px solid #8C4D3F;
    outline: 1px solid rgba(140, 77, 63, .5);
    outline-offset: -9px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(74, 46, 37, .15);
  }
  /* the paper texture lives on its own layer, painted once and composited,
     so era changes and animations inside the timeline don't repaint it */
  .paper {
    position: absolute; inset: 0; z-index: -2; pointer-events: none; border-radius: inherit;
    will-change: transform; transform: translateZ(0); contain: strict;
    background-image:
      var(--grain),
      repeating-radial-gradient(circle at 12% 18%, rgba(140, 77, 63, .07) 0 1px, transparent 1px 9px),
      repeating-radial-gradient(circle at 88% 82%, rgba(3, 94, 115, .06) 0 1px, transparent 1px 11px),
      repeating-linear-gradient(135deg, rgba(140, 77, 63, .035) 0 1px, transparent 1px 6px),
      radial-gradient(ellipse at center, rgba(255, 255, 255, .25) 40%, rgba(120, 80, 40, .16) 100%);
    background-size: 180px 180px, auto, auto, auto, auto;
  }
  /* Tunisian ornament: a faint zellige wall at the edges, ceramic borders, star rosettes */
  .vintage::before {
    content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; border-radius: inherit;
    will-change: transform; transform: translateZ(0);
    background-image: var(--zellige); background-size: 112px 112px; opacity: .11;
    -webkit-mask: radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, #000 100%);
            mask: radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, #000 100%);
  }
  .tn-band {
    position: absolute; left: 12px; right: 12px; height: 14px; pointer-events: none;
    background-image: var(--frieze); background-size: 28px 14px; background-repeat: repeat-x; background-position: center;
    border-radius: 2px;
  }
  .tn-band.top { top: 12px; } .tn-band.bottom { bottom: 12px; }
  .corner {
    position: absolute; width: 40px; height: 40px; pointer-events: none; z-index: 2;
    background-image: var(--star); background-size: contain; background-repeat: no-repeat;
    filter: drop-shadow(0 1px 1px rgba(74, 46, 37, .3));
  }
  .corner.tl { top: 1px; left: 1px; } .corner.tr { top: 1px; right: 1px; }
  .corner.bl { bottom: 1px; left: 1px; } .corner.br { bottom: 1px; right: 1px; }

  /* ---------- era story ---------- */
  .stories { display: grid; margin: 0 0 1.4rem; }
  .story {
    grid-area: 1 / 1; display: grid; grid-template-columns: 1.55fr 1fr; gap: 1.4rem;
    padding: 1.1rem 1.3rem; border-radius: 8px;
    background: rgba(255, 251, 241, .78); border: 1px solid rgba(140, 77, 63, .3); border-inline-start: 5px solid var(--ec);
    box-shadow: 0 2px 8px rgba(74, 46, 37, .1);
    /* crossfade: the old era fades out while the new one fades in on top of it */
    opacity: 0; visibility: hidden;
    transition: opacity .35s ease, visibility 0s .35s;
    will-change: opacity; contain: layout paint;
  }
  .story.on { opacity: 1; visibility: visible; transition: opacity .5s ease .1s, visibility 0s; }
  .story-years { margin: 0; font-size: .72rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--ec); }
  .story h3 { margin: .1rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 800; color: #3D2A22; }
  .story-text p:last-child { margin: 0; font-size: .95rem; line-height: 1.6; }
  /* your notebook slip inside a story (same look as the slips above Dali's replies) */
  .story .jot {
    position: relative; width: fit-content; max-width: 100%; margin: .9rem 0 .8rem; box-sizing: border-box;
    padding: .9rem 1.1rem .6rem; transform: rotate(-1deg); text-align: start;
    background: repeating-linear-gradient(transparent 0 1.75rem, rgba(30, 91, 140, .16) 1.75rem calc(1.75rem + 1px)), #FFFDF6;
    background-position: 0 .5rem; box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 6px 14px -6px rgba(74, 46, 37, .3);
  }
  .story .jot::before { content: ''; position: absolute; top: 0; bottom: 0; inset-inline-start: 1.3rem; border-inline-start: 1px solid rgba(181, 82, 59, .35); }
  .story .tape { position: absolute; top: -.55rem; left: 50%; width: 4.5rem; height: 1.1rem; transform: translateX(-50%) rotate(2deg); background: rgba(233, 214, 170, .75); }
  .story .jot-k { margin: 0; padding-inline-start: .9rem; font: 700 .64rem Quicksand, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #B5523B; }
  .story .jot-t { margin: 0; padding-inline-start: .9rem; font-family: Caveat, 'Segoe Print', cursive; font-weight: 500; font-size: 1.7rem; line-height: 1.75rem; color: #1E3F5C; }
  .story .jot.ar { transform: rotate(1deg); }
  .story .jot.ar .jot-t { font-family: 'Aref Ruqaa', Tajawal, serif; font-size: 1.4rem; }
  .story-who { display: flex; align-items: center; gap: .4rem; margin: .2rem 0 .3rem; font-size: .9rem; font-weight: 800; color: var(--ec); }
  .story-who img { width: 2.4rem; height: 2.5rem; object-fit: contain; object-position: 50% 0; }
  .story :global(b) { font-weight: 700; color: #3D2A22; }
  .story :global(mark.purple) { background: #C6AFC0; color: #FDF6F5; padding: 0 .25em; border-radius: 3px; }
  .story :global(a) { color: var(--ec); }
  .story-facts { border-inline-start: 1px dashed rgba(140, 77, 63, .35); padding-inline-start: 1.2rem; }
  .total { margin: 0 0 .5rem; font-weight: 700; font-size: .9rem; }
  .total span { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 800; color: var(--ec); margin-inline-end: .2rem; vertical-align: -.15em; }
  .counts { list-style: none; margin: 0; padding: 0; display: grid; gap: .25rem; }
  .counts li { display: grid; grid-template-columns: .65rem 3rem 1fr 1.2rem; align-items: center; gap: .45rem; font-size: .82rem; }
  .counts .den { font-weight: 700; }
  .meter { height: .55rem; border-radius: 999px; background: rgba(74, 46, 37, .1); overflow: hidden; }
  .meter i { display: block; height: 100%; border-radius: inherit; transition: width .5s; }
  .counts b { text-align: right; }
  .counts li.zero { opacity: .45; }
  .counts li.zero b { color: #B5523B; }
  .note { margin: .7rem 0 0; font-size: .85rem; line-height: 1.5; }
  .figures { display: flex; gap: .8rem; margin-top: .8rem; }
  .figures figure { flex: 1; margin: 0; text-align: center; }
  .figures img { width: 100%; max-width: 9rem; height: auto; }
  .figures figcaption { font-size: .78rem; line-height: 1.4; }
  .figures figure.wide { display: flex; gap: .7rem; align-items: flex-start; text-align: start; }
  .figures figure.wide img { width: 5.5rem; flex: 0 0 auto; }

  .v-head { text-align: center; max-width: 40rem; margin: 0 auto 1.2rem; }
  .controls.no-eras { justify-content: center; }
  .split { position: relative; z-index: 1; max-width: 40rem; margin: 0 auto 1.2rem; padding: 1rem 1.3rem; text-align: center; border: 1.5px dashed rgba(140, 77, 63, .45); border-radius: 12px; background: rgba(255, 251, 241, .6); }
  .split p { margin: 0 0 .8rem; font-size: .95rem; line-height: 1.5; }
  .split-btn { padding: .6rem 1.4rem; border: 0; border-radius: 999px; background: #8C4D3F; color: #FFFBF1; cursor: pointer; font: 800 .92rem Quicksand, sans-serif; box-shadow: 0 3px 10px rgba(74, 46, 37, .3); transition: transform .2s, background .2s; }
  .split-btn:hover { background: #6E3A2F; transform: translateY(-2px); }
  .views { position: relative; z-index: 1; display: flex; width: fit-content; gap: .25rem; margin: 0 auto 1.2rem; padding: .25rem; border-radius: 999px; background: rgba(140, 77, 63, .1); }
  .views button { font: 700 .88rem Quicksand, sans-serif; color: #6B4A3E; background: none; border: none; border-radius: 999px; padding: .45rem 1.1rem; cursor: pointer; transition: background .2s, color .2s; }
  .views button.on { background: #8C4D3F; color: #FFFBF1; box-shadow: 0 1px 4px rgba(74, 46, 37, .25); }
  .life { position: relative; z-index: 1; }
  .life-take { margin: 1.2rem 0 0; padding: .8rem 1rem; border-inline-start: 4px solid #8C4D3F; border-radius: 6px; background: rgba(255, 251, 241, .7); font-size: .92rem; line-height: 1.55; }
  .time-view { position: relative; z-index: 1; }
  .kicker { margin: 0; font-size: .75rem; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: #8C4D3F; }
  h2 { margin: .2rem 0 .4rem; font-family: 'Playfair Display', Georgia, serif; font-weight: 800; font-size: 2.1rem; color: #4A2E25; }
  .lede { margin: 0; font-size: .95rem; line-height: 1.5; }
  .lede + .lede { margin-top: .6rem; }
  .lede.how { font-size: .85rem; opacity: .75; }
  .lede :global(b) { font-weight: 700; }

  /* ---------- controls ---------- */
  .controls { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .8rem; margin-bottom: 1rem; }
  .eras { display: flex; flex-wrap: wrap; gap: .4rem; }
  .era-chip {
    font-family: inherit; font-weight: 700; font-size: .85rem; color: #6B3F33;
    background: rgba(255, 250, 238, .7); border: 1.5px solid #B98B6E; border-radius: 999px; padding: .35rem .8rem; cursor: pointer;
  }
  .era-chip.on { background: #8C4D3F; color: #FDF6F5; border-color: #8C4D3F; }
  .year-row { display: flex; align-items: center; gap: .6rem; flex: 1 1 260px; max-width: 420px; }
  .year-row input { flex: 1; accent-color: #8C4D3F; }
  .play {
    width: 2.2rem; height: 2.2rem; border-radius: 50%; border: none; cursor: pointer;
    background: #8C4D3F; color: #FDF6F5; font-size: .8rem;
  }
  .year-badge {
    font-family: 'Playfair Display', Georgia, serif; font-weight: 800; font-size: 1.4rem; color: #8C4D3F; min-width: 3.2rem; text-align: right;
  }

  /* ---------- chart ---------- */
  .plot { position: relative; width: 100%; cursor: crosshair; }
  .band { position: absolute; top: 0; border-left: 1px dashed rgba(74, 46, 37, .25); transition: background .3s; }
  .band.current { box-shadow: inset 0 0 0 2px rgba(140, 77, 63, .25); }
  .band-label {
    position: absolute; top: 4px; left: 8px; font-size: .72rem; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(74, 46, 37, .7); white-space: nowrap;
  }
  .lane-label {
    position: absolute; left: 0; width: 52px; display: flex; align-items: center; gap: .3rem;
    font-weight: 800; font-size: .95rem; color: #4A2E25;
  }
  .lane-label small { font-size: .65rem; font-weight: 700; opacity: .7; }
  .swatch { width: .65rem; height: .65rem; border-radius: 2px; flex: 0 0 auto; }
  .lane-rule { position: absolute; right: 0; border-top: 1px dotted rgba(74, 46, 37, .25); }

  .bar {
    position: absolute; padding: 0; border: none; cursor: pointer; overflow: hidden;
    background: var(--c); border-radius: 5px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .25), 0 1px 2px rgba(74, 46, 37, .3);
    display: flex; align-items: center; gap: .35rem; transition: opacity .25s, transform .15s, filter .15s;
  }
  .bar:hover, .bar:focus-visible { transform: translateY(-1px); filter: brightness(1.1); z-index: 3; }
  .bar.dim { opacity: .28; }

  /* ---- sorting animation (see sortNotes) ---- */
  .hold { opacity: 0; pointer-events: none; }
  .views, .controls, .split, .wallet { transition: opacity .6s ease; }
  .plot.building { pointer-events: none; }
  .plot.building .bar { clip-path: inset(0 0 0 0); transition: opacity .25s, clip-path .9s cubic-bezier(.3, .7, .25, 1); }
  .plot.early .bar.dim { opacity: 1; }                 /* everything at full strength until the year cursor shows */
  .plot.p-fly .bar, .plot.p-fly .bar.dim { opacity: 0; }
  .plot.p-fly .bar:not(.v), .plot.p-land .bar:not(.v) { clip-path: inset(0 calc(100% - var(--iw)) 0 0); }   /* just the note picture */
  .plot.p-fly .bar.v, .plot.p-land .bar.v { clip-path: inset(0 0 100% 0); }
  .plot.p-grow .bar { transition-delay: 0s, calc(var(--li) * 60ms); }
  .plot .tick, .plot .lane-label, .plot .lane-rule, .plot .lane-head { transition: opacity .5s ease; }
  .plot.early .tick, .plot.early .lane-label, .plot.early .lane-rule, .plot.early .lane-head, .plot.early .cursor { opacity: 0; }

  .flyers { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
  .flyer {
    position: absolute; overflow: hidden; border-radius: 3px;
    transform: rotate(var(--rot)); box-shadow: 0 2px 5px rgba(74, 46, 37, .25);
    transition: transform .55s cubic-bezier(.3, .7, .3, 1), box-shadow .55s, opacity .35s;
  }
  .flyer img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: left center; }
  .flyer.lifted { transform: translateY(-30px) rotate(var(--rot)) scale(1.05); box-shadow: 0 16px 22px rgba(74, 46, 37, .3); }
  .flyer.waiting { opacity: 0; }
  .flyer.moving {
    transform: rotate(0deg); box-shadow: 0 1px 2px rgba(74, 46, 37, .3);
    transition-property: left, top, width, height, transform, box-shadow, opacity;
    transition-duration: var(--ms); transition-timing-function: cubic-bezier(.55, 0, .2, 1);
    transition-delay: var(--d);
  }
  .flyers.fade .flyer { opacity: 0; transition: opacity .4s; }
  .handling {
    position: fixed; left: 50%; bottom: 1.6rem; z-index: 40; transform: translateX(-50%); margin: 0; max-width: calc(100% - 2rem);
    padding: .55rem 1.1rem; border-radius: 999px; background: #FFFBF1; border: 1.5px solid rgba(140, 77, 63, .5);
    box-shadow: 0 6px 18px rgba(74, 46, 37, .2); font-size: .9rem; color: #4A2E25; text-align: center;
  }
  @media (max-width: 700px) { .handling { bottom: auto; top: 1rem; font-size: .82rem; } }   /* clear of the page's floating buttons */
  .bar.ongoing { background: linear-gradient(90deg, var(--c) 82%, transparent); }   /* still in circulation: fades to "today" */
  .bar img { height: 100%; width: auto; border-radius: 4px 0 0 4px; }
  .bar-years { font-size: .68rem; font-weight: 700; color: #FFF8EC; white-space: nowrap; }

  .tick { position: absolute; transform: translateX(-50%); font-size: .7rem; font-weight: 700; color: rgba(74, 46, 37, .7); }
  .cursor { position: absolute; top: 0; width: 0; border-left: 2px solid #4A2E25; pointer-events: none; transition: left .15s linear, opacity .5s ease; z-index: 4; }
  .cursor span {
    position: absolute; bottom: -1.6rem; left: 50%; transform: translateX(-50%);
    background: #4A2E25; color: #FDF6F5; font-size: .7rem; font-weight: 800; padding: .1rem .4rem; border-radius: 4px;
  }

  /* vertical variant */
  .band.v { right: 0; border-left: none; border-top: 1px dashed rgba(74, 46, 37, .25); }
  .band-label.v { top: 4px; right: 6px; left: auto; }
  .lane-head { position: absolute; top: 4px; display: flex; align-items: center; justify-content: center; gap: .2rem; font-weight: 800; font-size: .8rem; }
  .bar.v.ongoing { background: linear-gradient(180deg, var(--c) 85%, transparent); }
  .tick.v { left: 0; width: 36px; transform: translateY(-50%); text-align: right; }
  .cursor.v { right: 0; width: auto; height: 0; border-left: none; border-top: 2px solid #4A2E25; transition: top .15s linear; }
  .cursor.v span { bottom: auto; top: -.7rem; left: auto; right: 0; transform: none; }

  /* ---------- wallet ---------- */
  .wallet { margin-top: 2.6rem; border-top: 2px dashed rgba(140, 77, 63, .4); padding-top: 1.2rem; }
  .wallet-head { text-align: center; margin-bottom: 1rem; }
  .wallet-head h3 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; font-weight: 800; }
  .wallet-head p { margin: .2rem 0 0; font-size: .9rem; }
  .year-ink { color: #8C4D3F; }
  .wallet-notes { display: flex; flex-wrap: wrap; justify-content: center; gap: .8rem; min-height: 7rem; }
  .w-note {
    width: 11.5rem; padding: .35rem .35rem .45rem; border: none; cursor: pointer; border-radius: 8px;
    background: rgba(255, 250, 238, .75); box-shadow: 0 2px 6px rgba(74, 46, 37, .2); border-bottom: 4px solid var(--c);
    display: flex; flex-direction: column; align-items: center; gap: .3rem; font-family: inherit; transition: transform .15s;
  }
  .w-note:hover, .w-note:focus-visible { transform: translateY(-3px) rotate(-1deg); }
  .w-note img { width: 100%; height: auto; border-radius: 4px; }
  .w-caption { font-size: .72rem; font-weight: 700; color: #4A2E25; text-align: center; }

  /* ---------- tooltip ---------- */
  .tip {
    position: absolute; z-index: 20; width: 17.5rem; transform: translate(16px, 16px); pointer-events: none;
    background: #FFFBF1; border: 1px solid rgba(74, 46, 37, .3); border-top: 4px solid var(--c); border-radius: 10px; overflow: hidden;
    box-shadow: 0 10px 28px rgba(74, 46, 37, .28); text-align: start; color: #3D2A22;
  }
  .tip.flip { transform: translate(calc(-100% - 16px), 16px); }
  .tip.up { transform: translate(16px, calc(-100% - 16px)); }
  .tip.flip.up { transform: translate(calc(-100% - 16px), calc(-100% - 16px)); }
  .tip-img { position: relative; background: #EFE4D0; }
  .tip-img img { display: block; width: 100%; height: auto; }
  .tip-value { position: absolute; left: .5rem; bottom: .5rem; padding: .1rem .55rem; border-radius: 999px; background: var(--c); color: #FFFFFF; font-weight: 800; font-size: .95rem; box-shadow: 0 2px 6px rgba(0, 0, 0, .25); }
  .tip-value small { font-size: .65rem; }
  .tip-status { position: absolute; right: .5rem; top: .5rem; padding: .1rem .5rem; border-radius: 999px; background: rgba(61, 42, 34, .78); color: #FFFFFF; font-size: .68rem; font-weight: 800; }
  .tip-status.live { background: #2E7D5B; }
  .tip-body { padding: .6rem .75rem .65rem; display: grid; gap: .45rem; }
  .tip-name { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; }
  .tip-name b { font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; color: #3D2A22; }
  .tip-name span { font-size: .9rem; color: #8C4D3F; }
  .tip-era { justify-self: start; margin-top: -.25rem; font-size: .66rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--ec); }
  .tip-num { display: block; margin-top: .2rem; font-size: .72rem; font-weight: 700; color: #8C4D3F; }
  .tip-row { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; font-size: .8rem; }
  .tip-row b { font-size: .82rem; }
  .tip-row small { font-size: .68rem; color: #7A6A5C; }
  .span-bar { position: relative; height: 6px; margin-top: .25rem; border-radius: 999px; background: rgba(74, 46, 37, .12); }
  .span-bar i { position: absolute; top: 0; bottom: 0; border-radius: 999px; background: var(--c); }
  .span-ends { display: flex; justify-content: space-between; font-size: .6rem; font-weight: 700; color: #9C8B7B; margin-top: .1rem; }
  .tip-usd { padding: .45rem .55rem; border-radius: 8px; background: rgba(74, 46, 37, .06); }
  .tip-usd .lbl { display: block; font-size: .64rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #8A7A6B; margin-bottom: .1rem; }
  .tip-usd b.down { color: #B8454E; }
  .tip-usd b.up2 { color: #2E7D5B; }
  .tip-size { margin: 0; font-size: .74rem; color: #7A6A5C; }
  .tip-more { margin: 0; font-size: .78rem; font-weight: 800; color: #8C4D3F; }

  /* ---------- small screens ---------- */
  @media (max-width: 640px) {
    .vintage { padding: 2.6rem 1rem 2.2rem; border-radius: 8px; }
    .corner { width: 30px; height: 30px; }
    .tn-band { left: 8px; right: 8px; }
    .story { grid-template-columns: 1fr; gap: .9rem; padding: 1rem; }
    .story-facts { border-left: none; border-top: 1px dashed rgba(140, 77, 63, .35); padding: .8rem 0 0; }
    .kicker { padding: 0 1.6rem; letter-spacing: .14em; }
    h2 { font-size: 1.6rem; }
    .controls { flex-direction: column; align-items: stretch; }
    .year-row { flex: none; max-width: none; position: sticky; top: 0; z-index: 6; background: #F3E7CC; padding: .4rem 0; }
    .w-note { width: calc(50% - .5rem); }
  }
  @media (prefers-reduced-motion: reduce) {
    .vintage * { transition-duration: .01ms !important; animation-duration: .01ms !important; }
  }
</style>
