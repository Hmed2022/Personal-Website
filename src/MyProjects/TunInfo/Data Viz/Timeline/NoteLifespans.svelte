<script>
  // "How long does a note last?": every note as a bar from issue to withdrawal, ranked by length.
  import { flip } from 'svelte/animate';
  import data from './Data/data.js';
  import NoteModal from './Components/NoteModal.svelte';   // same details window as the timeline
  import { t, pick, money } from '../../i18n.js';

  const NOW = 2023;
  const COLORS = { 0.5: '#0388A6', 1: '#025E73', 5: '#005C53', 10: '#BF5630', 20: '#8C4D3F', 30: '#AB7E56', 50: '#C9A46F' };
  const ERAS = [
    { key: 'eraBourguiba', from: 0, to: 1987, ink: '#025E73' },
    { key: 'eraBenAli', from: 1987, to: 2011, ink: '#7C4A8C' },
    { key: 'eraRevolution', from: 2011, to: 9999, ink: '#BF5630' },
  ];
  const eraOf = (y) => ERAS.find((e) => y >= e.from && y < e.to);
  import { noteImage as imgOf } from './noteImage.js';

  const notes = data.map((n, id) => {
    const active = n.Active === 'Yes';
    const end = active ? NOW : n.EndofCirculation;
    return { id, n, active, start: n.Issued, end, years: Math.max(1, end - n.Issued), era: eraOf(n.Issued) };
  });
  const avg = ERAS.map((e) => {
    const g = notes.filter((x) => x.era === e && !x.active);
    return { ...e, v: g.length ? Math.round(g.reduce((s, x) => s + x.years, 0) / g.length) : 0 };
  });

  let sort = 'len';
  $: list = notes.slice().sort((a, b) => (sort === 'len' ? b.years - a.years || a.start - b.start : a.start - b.start || a.n.Value - b.n.Value));
  const MAX = 36;   // a little headroom so the longest bar's label fits
  let hot = null;

  // notes in the shape the details window expects (same as in TimelineVintage)
  const modalNotes = data.map((n, id) => ({ ...n, id, img: imgOf(n) }));
  let showModal = false;
  let selected = modalNotes[0];
  function openNote(x) { selected = modalNotes[x.id]; showModal = true; }
  const onKey = (e, x) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNote(x); } };
</script>

<div class="lf">
  <div class="top">
    <div class="sort" role="radiogroup" aria-label={$t('lfSort')}>
      <button type="button" role="radio" aria-checked={sort === 'len'} class:on={sort === 'len'} on:click={() => (sort = 'len')}>{$t('lfByLen')}</button>
      <button type="button" role="radio" aria-checked={sort === 'year'} class:on={sort === 'year'} on:click={() => (sort = 'year')}>{$t('lfByYear')}</button>
    </div>
    <div class="legend">
      {#each ERAS as e}<span><i style="background:{e.ink}"></i>{$t(e.key)}</span>{/each}
      <span><i class="still"></i>{$t('lfStill')}</span>
    </div>
  </div>

  <div class="layout">
    <ol class="bars" on:pointerleave={() => (hot = null)}>
      {#each list as x (x.id)}
        <li animate:flip={{ duration: 450 }} class:dim={hot && hot !== x} on:pointerenter={() => (hot = x)}
            role="button" tabindex="0" aria-label={`${$money(x.n.Value)}, ${x.start}: ${$t('tlClick')}`}
            on:click={() => openNote(x)} on:keydown={(e) => onKey(e, x)} on:focus={() => (hot = x)}>
          <span class="lbl">
            <b style="color:{COLORS[x.n.Value]}">{x.n.Value === 0.5 ? '½' : x.n.Value} {$t('dt')}</b>
            <span class="who">{$pick(x.n.ObserveInEnglish, x.n.ObserveInArabic)}</span>
            <span class="span" dir="ltr">{x.start}–{x.active ? '' : String(x.end).slice(2)}</span>
          </span>
          <span class="track" dir="ltr">
            <span class="bar" class:active={x.active} style="width:{(x.years / MAX) * 100}%; --c:{x.era.ink}"></span>
            <span class="yrs" style="left:{(x.years / MAX) * 100}%">{x.years === 1 ? $t('lfYear1') : $t('lfYears', { n: x.years })}</span>
          </span>
        </li>
      {/each}
    </ol>

    <aside class="side">
      {#if hot}
        <figure class="preview">
          <img src={imgOf(hot.n)} alt="" />
          <figcaption><b>{$money(hot.n.Value)} · {hot.start}</b><br />{$pick(hot.n.ObserveInEnglish, hot.n.ObserveInArabic)} · {hot.years === 1 ? $t('lfYear1') : $t('lfYears', { n: hot.years })}{hot.active ? ` · ${$t('lfStill')}` : ''}</figcaption>
        </figure>
      {:else}
        <div class="fact"><span class="tag">{$t('lfLongest')}</span><p>{@html $t('lfLongTxt')}</p></div>
        <div class="fact"><span class="tag">{$t('lfShortest')}</span><p>{@html $t('lfShortTxt')}</p></div>
      {/if}
      <div class="fact">
        <span class="tag">{$t('lfAvg')}</span>
        {#each avg as e}
          <div class="avg"><span>{$t(e.key)}</span><span class="mini" dir="ltr"><i style="width:{(e.v / MAX) * 100}%; background:{e.ink}"></i></span><b>{e.v === 1 ? $t('lfYear1') : $t('lfYears', { n: e.v })}</b></div>
        {/each}
        <small>{$t('lfAvgNote')}</small>
      </div>
    </aside>
  </div>
</div>

<NoteModal bind:open={showModal} bind:note={selected} notes={modalNotes} colors={COLORS} eras={ERAS} lastYear={NOW} />

<style>
  .lf { font-family: Quicksand, sans-serif; color: #3D2A22; }
  .top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .6rem; margin-bottom: .8rem; }
  .sort { display: inline-flex; gap: .2rem; padding: .2rem; border-radius: 999px; background: #EFE6DA; }
  .sort button { font: 700 .8rem Quicksand, sans-serif; color: #4D6473; background: none; border: none; border-radius: 999px; padding: .3rem .8rem; cursor: pointer; }
  .sort button.on { background: #FFFFFF; color: #1E3F5C; box-shadow: 0 1px 4px rgba(61, 42, 34, .18); }
  .legend { display: flex; flex-wrap: wrap; gap: .3rem .9rem; font-size: .76rem; font-weight: 600; color: #4D6473; }
  .legend i { display: inline-block; width: .8rem; height: .8rem; border-radius: 3px; margin-inline-end: .3rem; vertical-align: -.1rem; }
  .legend i.still { background: repeating-linear-gradient(135deg, #8FA5AA 0 3px, transparent 3px 6px); border: 1px solid #8FA5AA; }

  .layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 1.2rem; align-items: start; }
  .bars { list-style: none; margin: 0; padding: 0; display: grid; gap: 3px; }
  .bars li { display: grid; grid-template-columns: 15rem 1fr; align-items: center; gap: .6rem; transition: opacity .2s; cursor: pointer; border-radius: 4px; }
  .bars li:focus-visible { outline: 2px solid #1E5B8C; outline-offset: 2px; }
  .bars li.dim { opacity: .35; }
  .lbl { display: flex; align-items: baseline; gap: .4rem; font-size: .78rem; white-space: nowrap; overflow: hidden; }
  .lbl b { flex: 0 0 3.4rem; font-weight: 800; }
  .who { overflow: hidden; text-overflow: ellipsis; color: #3D2A22; }
  .span { margin-inline-start: auto; color: #8A7A6B; font-size: .7rem; }
  .track { position: relative; height: 14px; }
  .bar { position: absolute; inset-block: 0; left: 0; border-radius: 3px; background: var(--c); opacity: .85; }
  .bar.active { background: repeating-linear-gradient(135deg, var(--c) 0 4px, color-mix(in srgb, var(--c) 45%, transparent) 4px 8px); }
  .yrs { position: absolute; top: -1px; margin-left: .35rem; font-size: .7rem; font-weight: 700; color: #6B5D50; white-space: nowrap; }

  .side { position: sticky; top: 1rem; display: grid; gap: .7rem; }
  .fact, .preview { margin: 0; padding: .8rem .9rem; border-radius: 12px; background: rgba(140, 77, 63, .05); border: 1px solid #E6DCCF; }
  .tag { display: block; font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #8A7A6B; margin-bottom: .3rem; }
  .fact p { margin: 0; font-size: .86rem; line-height: 1.5; }
  .preview img { width: 100%; height: auto; border-radius: 6px; box-shadow: 0 3px 10px rgba(61, 42, 34, .18); }
  .preview figcaption { margin-top: .4rem; font-size: .82rem; line-height: 1.45; }
  .avg { display: grid; grid-template-columns: 7.5rem 1fr 4rem; align-items: center; gap: .5rem; font-size: .78rem; margin-bottom: .3rem; }
  .avg b { text-align: end; }
  .mini { height: 8px; border-radius: 999px; background: rgba(74, 46, 37, .1); overflow: hidden; }
  .mini i { display: block; height: 100%; border-radius: inherit; }
  small { font-size: .7rem; color: #9C8B7B; }

  @media (max-width: 860px) {
    .layout { grid-template-columns: minmax(0, 1fr); }
    .side { position: static; }
    .bars li { grid-template-columns: 9.5rem 1fr; }
    .span { display: none; }
  }
</style>
