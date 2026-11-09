<!-- "Find a name": search the 99 Names by English spelling, meaning, Arabic or number, and jump to one.
     Picking a result does exactly what clicking the name in the Kufi artwork does
     (select it, move the song there, scroll to its details). -->
<script>
  import names from './names.js';
  import { language, nameId, seekToTime, selectedSongId, audioPlaying, togglePlayRequest, scrollToDetail } from '../Stores/misc.js';

  const CAT = {
    Quran:   { en: "Qur'an",  ar: 'قرآن',  color: '#3E8BA9' },
    Derived: { en: 'Derived', ar: 'مشتق',  color: '#047857' },
    Hadith:  { en: 'Hadith',  ar: 'حديث',  color: '#C2452D' }
  };

  // ---- matching helpers ----
  // English: "Ar-Raheem", "ar raheem", "Rahim" all become "rahim"
  const normEn = (s) => (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’ʿʾ`]/g, '')
    .replace(/^(al|ar|as|at|ad|an|az|ash|adh|ath)[-\s]+/, '')
    .replace(/[^a-z]/g, '')
    .replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/ou/g, 'u')
    .replace(/(.)\1+/g, '$1');
  // Meaning: plain lowercase words
  const normMean = (s) => (s || '').toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  // Arabic: drop vowel marks, unify alef / ya / ta marbuta forms, drop the leading "ال"
  const normAr = (s) => (s || '')
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/\s+/g, '')
    .replace(/^ال/, '');

  const list = Object.values(names)
    .filter((n) => n.rank !== undefined)
    .sort((a, b) => a.rank - b.rank)
    .map((n) => ({ ...n, _en: normEn(n.englishName), _mean: normMean(n.englishMean), _ar: normAr(n.arabicName) }));

  let query = '';
  let open = false;
  let active = 0;
  let inputEl;
  let listEl;

  $: ar = $language === 'Arabic';
  $: results = search(query);
  $: if (results) active = 0;

  function search(q) {
    q = q.trim();
    if (!q) return list;
    if (/^\d+$/.test(q)) {
      const n = +q;
      return list.filter((x) => x.rank === n).concat(list.filter((x) => x.rank !== n && String(x.rank).startsWith(q)));
    }
    if (/[؀-ۿ]/.test(q)) {
      const a = normAr(q);
      if (!a) return list;
      return rank(list.filter((x) => x._ar.includes(a)), (x) => x._ar.startsWith(a));
    }
    const e = normEn(q);
    const m = normMean(q);
    const hits = list.filter((x) => (e && x._en.includes(e)) || (m && x._mean.includes(m)));
    return rank(hits, (x) => e && x._en.startsWith(e));
  }
  // best matches (name starts with the query) first, otherwise keep the 1–99 order
  const rank = (arr, isBest) => arr.filter(isBest).concat(arr.filter((x) => !isBest(x)));

  function pick(n) {
    nameId.set(n.id);
    const tsKey = $selectedSongId === 2 ? 'timestamp2' : 'timestamp1';
    if (n[tsKey] !== undefined && n[tsKey] !== null) seekToTime.set(n[tsKey]);
    if ($audioPlaying) togglePlayRequest.update((v) => v + 1);
    scrollToDetail.update((v) => v + 1);
    query = '';
    open = false;
    inputEl?.blur();
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); open = true; move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) pick(results[active]); }
    else if (e.key === 'Escape') { open = false; inputEl?.blur(); }
  }
  function move(d) {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    listEl?.children[active]?.scrollIntoView({ block: 'nearest' });
  }

  // close when focus leaves the whole widget (but not when clicking a result)
  function onFocusOut(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) open = false;
  }
</script>

<div class="name-search" class:ar dir={ar ? 'rtl' : 'ltr'} on:focusout={onFocusOut}>
  <label class="label" for="name-search-input">{ar ? 'ابحث عن اسم' : 'Find a name'}</label>
  <div class="field">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    <input
      id="name-search-input"
      bind:this={inputEl}
      bind:value={query}
      on:focus={() => (open = true)}
      on:input={() => (open = true)}
      on:keydown={onKey}
      type="search"
      autocomplete="off"
      spellcheck="false"
      placeholder={ar ? 'اسم أو معنى أو رقم… مثلاً: رحمن، 12' : 'Name, meaning or number… e.g. Rahman, 12'}
      role="combobox"
      aria-expanded={open}
      aria-controls="name-search-list"
      aria-activedescendant={open && results[active] ? `ns-${results[active].id}` : null}
    />
    {#if query}<button type="button" class="clear" on:click={() => { query = ''; inputEl.focus(); }} aria-label={ar ? 'مسح' : 'Clear'}>×</button>{/if}
  </div>

  {#if open}
    <div class="panel">
      <p class="count">
        {#if query.trim()}
          {results.length ? (ar ? `${results.length} نتيجة` : `${results.length} result${results.length === 1 ? '' : 's'}`) : (ar ? 'لا توجد نتائج' : 'No name matches that')}
        {:else}
          {ar ? `جميع الأسماء (${list.length})` : `All ${list.length} names`}
        {/if}
      </p>
      <ul id="name-search-list" role="listbox" bind:this={listEl}>
        {#each results as n, i (n.id)}
          <li
            id="ns-{n.id}"
            role="option"
            aria-selected={i === active}
            class:active={i === active}
            class:current={n.id === $nameId}
            on:mousedown|preventDefault={() => pick(n)}
            on:mouseenter={() => (active = i)}
          >
            <span class="rank">{n.rank}</span>
            <span class="arabic" dir="rtl">{n.arabicName}</span>
            <span class="en">
              <span class="tr">{n.englishName}</span>
              <span class="mean">{n.englishMean}</span>
            </span>
            {#if CAT[n.quran_hadith]}
              <span class="cat" style="--c:{CAT[n.quran_hadith].color}">{ar ? CAT[n.quran_hadith].ar : CAT[n.quran_hadith].en}</span>
            {/if}
          </li>
        {/each}
      </ul>
      <p class="keys" aria-hidden="true">{ar ? '↑ ↓ للتنقل · Enter للاختيار · Esc للإغلاق' : '↑ ↓ to move · Enter to jump · Esc to close'}</p>
    </div>
  {/if}
</div>

<style>
  .name-search {
    --teal: #266F8C; --cream: #FDEEDB; --brown: #603D25; --sand: #AC8B7E;
    position: relative; z-index: 900;
    width: min(560px, 100%); margin: 1.4rem auto 0.4rem;
    font-family: 'Quicksand', sans-serif; color: var(--brown);
  }
  .label {
    display: block; margin-bottom: .45rem; text-align: center;
    font-family: 'JawiKufi', 'Quicksand', sans-serif; font-size: 1.35rem; color: var(--teal);
  }
  .ar .label { font-family: 'NotoKufiArabic', sans-serif; font-weight: 700; font-size: 1.1rem; }
  .field { position: relative; }
  .icon { position: absolute; top: 50%; inset-inline-start: .9rem; width: 1.15rem; height: 1.15rem; transform: translateY(-50%); fill: none; stroke: var(--teal); stroke-width: 2.4; stroke-linecap: round; pointer-events: none; }
  input {
    width: 100%; box-sizing: border-box; padding: .8rem 2.6rem; border: 2px solid var(--teal); border-radius: 999px;
    background: var(--cream); color: var(--brown); font: 600 1rem 'Quicksand', sans-serif;
    box-shadow: 0 4px 14px rgba(38, 111, 140, .12); -webkit-appearance: none; appearance: none;
  }
  .ar input { font-family: 'NotoKufiArabic', 'Quicksand', sans-serif; font-weight: 400; font-size: .95rem; }
  input::placeholder { color: var(--sand); font-weight: 500; }
  input::-webkit-search-cancel-button { display: none; }
  input:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 4px rgba(38, 111, 140, .18); }
  .clear { position: absolute; top: 50%; inset-inline-end: .7rem; transform: translateY(-50%); width: 1.8rem; height: 1.8rem; border: 0; border-radius: 50%; background: rgba(38, 111, 140, .1); color: var(--teal); font-size: 1.2rem; line-height: 1; cursor: pointer; }

  .panel {
    position: absolute; top: calc(100% + .5rem); left: 0; right: 0;
    background: var(--cream); border: 1px solid rgba(38, 111, 140, .35); border-radius: 16px;
    box-shadow: 0 16px 40px rgba(96, 61, 37, .2); overflow: hidden;
  }
  .count { margin: 0; padding: .6rem 1rem .4rem; font-size: .8rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--sand); }
  .ar .count { text-transform: none; letter-spacing: 0; font-family: 'NotoKufiArabic', sans-serif; }
  ul { list-style: none; margin: 0; padding: 0 .4rem .4rem; max-height: min(420px, 55vh); overflow-y: auto; overscroll-behavior: contain; }
  li {
    display: grid; grid-template-columns: 2.2rem 7.5rem 1fr auto; align-items: center; gap: .7rem;
    padding: .55rem .6rem; border-radius: 10px; cursor: pointer;
  }
  li.active { background: rgba(38, 111, 140, .1); }
  li.current .rank { background: var(--teal); color: var(--cream); }
  .rank { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; background: rgba(38, 111, 140, .1); color: var(--teal); font-weight: 700; font-size: .85rem; }
  .arabic { font-family: 'NotoKufiArabic', sans-serif; font-weight: 700; font-size: 1.15rem; color: var(--teal); text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .en { display: flex; flex-direction: column; min-width: 0; direction: ltr; text-align: left; }
  .tr { font-weight: 700; font-size: .98rem; color: var(--brown); }
  .mean { font-size: .85rem; color: #8A6656; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat { font-size: .7rem; font-weight: 700; letter-spacing: .04em; color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); padding: .2rem .5rem; border-radius: 999px; white-space: nowrap; }
  .ar .cat { font-family: 'NotoKufiArabic', sans-serif; letter-spacing: 0; }
  .keys { margin: 0; padding: .45rem 1rem; border-top: 1px solid rgba(96, 61, 37, .1); font-size: .75rem; color: var(--sand); text-align: center; }

  @media (max-width: 600px) {
    .name-search { margin-top: 1rem; }
    /* phones: English name + meaning on the left, Arabic name + badge on the right (same line) */
    li { grid-template-columns: 2rem minmax(0, 1fr) auto; column-gap: .6rem; row-gap: .15rem; }
    .rank { grid-column: 1; grid-row: 1 / span 2; }
    .en { grid-column: 2; grid-row: 1 / span 2; }
    .arabic { grid-column: 3; grid-row: 1; font-size: 1.05rem; justify-self: end; }
    .cat { grid-column: 3; grid-row: 2; justify-self: end; }
    .keys { display: none; }
  }
</style>
