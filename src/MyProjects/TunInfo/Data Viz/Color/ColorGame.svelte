<script>
  // New "Guess that bill by its colour" (Color.svelte / Colors.svelte are kept).
  // A playable game in two rounds (old notes vs modern notes) + a then/now colour comparison.
  import { fade, fly } from 'svelte/transition';
  import COLORS from './colorData.js';
  import { t, money, lang } from '../../i18n.js';
  import notes from '../Timeline/Data/data.js';

  import { noteImage } from '../Timeline/noteImage.js';
  const imageOf = (n) => noteImage(n);
  const label = (v) => (v === 0.5 || v === '0.5' ? '½' : String(v));

  const ROUNDS = {
    all: { name: 'cgAllName', hint: 'cgAllHint', values: ['0.5', '1', '5', '10', '20'] },
    modern: { name: 'cgModName', hint: 'cgModHint', values: ['5', '10', '20', '30', '50'] },
  };
  // a real note to show after each answer
  function sampleNote(round, v) {
    const list = notes.filter((n) => String(n.Value) === v && (round === 'all' ? n.ObserveInEnglish === 'Habib Bourguiba' : n.ObserveInEnglish !== 'Habib Bourguiba'));
    return list[list.length - 1];
  }

  // ---------- game ----------
  let round = 'all';
  let queue = [];
  let current = null;
  let answer = null;      // picked value
  let score = { all: { right: 0, total: 0 }, modern: { right: 0, total: 0 } };

  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }
  function next() {
    if (!queue.length) queue = shuffle(ROUNDS[round].values);
    current = queue.pop();
    answer = null;
  }
  function setRound(r) { round = r; queue = []; next(); }
  function pick(v) {
    if (answer) return;
    answer = v;
    score[round].total += 1;
    if (v === current) score[round].right += 1;
    score = score;
  }
  next();

  $: correct = answer && answer === current;
  $: shown = current && sampleNote(round, current);

  // ---------- fingerprint grid ----------
  const ALL_VALUES = ['0.5', '1', '5', '10', '20', '30', '50'];
  // the fingerprints would give the answers away: keep them blurred until 3 guesses (or the visitor asks)
  const REVEAL_AFTER = 3;
  let revealed = false;
  $: played = score.all.total + score.modern.total;
  $: if (played >= REVEAL_AFTER) revealed = true;
  let seg = null;   // hovered segment { c, p, x, y }
</script>

<div class="cg">
  <!-- ===== the game ===== -->
  <div class="game">
    <div class="rounds" role="tablist" aria-label={$t('cgRound')}>
      {#each Object.entries(ROUNDS) as [k, r]}
        <button type="button" role="tab" aria-selected={round === k} class:on={round === k} on:click={() => setRound(k)}>
          <b>{$t(r.name)}</b>
          <small>{score[k].total ? $t('cgScore', { r: score[k].right, n: score[k].total }) : $t(r.hint)}</small>
        </button>
      {/each}
    </div>

    {#key `${round}-${current}-${score[round].total - (answer ? 1 : 0)}`}
      <div class="question" in:fly={{ y: 10, duration: 250 }}>
        <p class="q">{$t('cgQ')}</p>
        <p class="nudge">{round === 'modern' ? $t('cgNudgeMod') : $t('cgNudgeAll')}</p>
        <div class="strip big" dir="ltr" aria-label={$t('cgStrip')}>
          {#each COLORS[round][current] as s}<span style="background:{s.c}; flex-basis:{s.p}%"></span>{/each}
        </div>

        <div class="answers">
          {#each ROUNDS[round].values as v}
            <button type="button" class="ans" class:right={answer && v === current} class:wrong={answer === v && v !== current}
                    disabled={!!answer} on:click={() => pick(v)}>
              {label(v)} <small>{$t('dt')}</small>
            </button>
          {/each}
        </div>

        {#if answer}
          <div class="result" class:ok={correct} in:fade={{ duration: 200 }}>
            {#if shown}<img src={imageOf(shown)} alt={$money(current)} />{/if}
            <div>
              <p class="verdict">{correct ? $t('cgCorrect') : $t('cgWrong')} {@html $t('cgItWas', { v: $money(current) })}</p>
              {#if round === 'all'}
                <p class="why">{$t('cgWhyAll')}</p>
              {:else}
                <p class="why">{$t('cgWhyMod')}</p>
              {/if}
              <button type="button" class="next" on:click={next}>{$t('cgNext')}</button>
            </div>
          </div>
        {/if}
      </div>
    {/key}
  </div>

  <!-- ===== then / now ===== -->
  <div class="prints">
    <h4>{$t('cgPrints')}</h4>
    <div class="grid-wrap" class:hidden={!revealed}>
    <div class="grid" on:pointerleave={() => (seg = null)} aria-hidden={!revealed}>
      <span></span>
      <span class="col-h">{$t('cgColAll')}</span>
      <span class="col-h">{$t('cgColMod')}</span>
      {#each ALL_VALUES as v}
        <span class="row-h">{label(v)} <small>{$t('dt')}</small></span>
        {#each ['all', 'modern'] as r}
          {#if COLORS[r][v]}
            <div class="strip" dir="ltr">
              {#each COLORS[r][v] as s}
                <span style="background:{s.c}; flex-basis:{s.p}%"
                      on:pointerenter={(e) => (seg = { ...s, x: e.clientX, y: e.clientY })}
                      on:pointermove={(e) => (seg = { ...s, x: e.clientX, y: e.clientY })}></span>
              {/each}
            </div>
          {:else}
            <span class="none">{$t('cgNotIssued')}</span>
          {/if}
        {/each}
      {/each}
    </div>
    {#if !revealed}
      <div class="veil" transition:fade={{ duration: 300 }}>
        <p>{REVEAL_AFTER - played === 1 ? $t('cgPeek1') : $t('cgPeek', { n: REVEAL_AFTER - played })}</p>
        <button type="button" on:click={() => (revealed = true)}>{$t('cgReveal')}</button>
      </div>
    {/if}
    </div>
    <p class="foot">{$t('cgFoot')}</p>
  </div>

  {#if seg}
    <div class="seg-tip" style="left:{seg.x}px; top:{seg.y}px"><i style="background:{seg.c}"></i>{seg.c.toUpperCase()} · {Math.round(seg.p)}%</div>
  {/if}
</div>

<style>
  .cg { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2rem; max-width: 880px; margin: 0 auto; font-family: Quicksand, sans-serif; color: #3D2A22; text-align: start; }

  /* ---- game ---- */
  .game { background: rgba(30, 91, 140, .05); border: 1px solid rgba(30, 91, 140, .16); border-radius: 14px; padding: 1.1rem; box-shadow: 0 4px 16px rgba(61, 42, 34, .07); }
  .rounds { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: 1rem; }
  .rounds button {
    display: flex; flex-direction: column; align-items: flex-start; gap: .1rem; text-align: left; cursor: pointer;
    font-family: inherit; color: #4D6473; background: #F7F2EC; border: 1.5px solid transparent; border-radius: 10px; padding: .5rem .7rem;
  }
  .rounds button b { font-size: .88rem; }
  .rounds button small { font-size: .74rem; font-weight: 600; }
  .rounds button.on { background: #1E5B8C; color: #FFFFFF; }

  .nudge { margin: -.3rem 0 .7rem; font-size: .85rem; font-weight: 600; color: #B5523B; }
  .q { margin: 0 0 .5rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 800; color: #1E3F5C; }
  .strip { display: flex; height: 28px; border-radius: 6px; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06); }
  .strip span { flex-grow: 0; flex-shrink: 0; min-width: 1px; }
  .strip.big { height: 74px; border-radius: 10px; }

  .answers { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .9rem; }
  .ans {
    flex: 1 1 4rem; font: 800 1.05rem Quicksand, sans-serif; color: #1E3F5C; cursor: pointer;
    background: rgba(255, 255, 255, .45); border: 1.5px solid #C8D9DC; border-radius: 10px; padding: .55rem .4rem;
    box-shadow: 0 2px 0 #C8D9DC; transition: transform .1s;
  }
  .ans small { font-size: .7rem; }
  .ans:hover:not(:disabled) { transform: translateY(-2px); }
  .ans:disabled { cursor: default; opacity: .55; }
  .ans.right { background: #2E7D5B; border-color: #2E7D5B; color: #FFFFFF; opacity: 1; box-shadow: none; }
  .ans.wrong { background: #B8454E; border-color: #B8454E; color: #FFFFFF; opacity: 1; box-shadow: none; }

  .result { display: flex; gap: .8rem; align-items: center; margin-top: .9rem; padding: .7rem; border-radius: 10px; background: #FBEFF0; }
  .result.ok { background: #E9F4EE; }
  .result img { width: 9.5rem; height: auto; border-radius: 6px; box-shadow: 0 2px 6px rgba(0, 0, 0, .15); flex: 0 0 auto; }
  .verdict { margin: 0; font-size: .92rem; }
  .why { margin: .2rem 0 .5rem; font-size: .8rem; color: #4D6473; }
  .next { font: 700 .85rem Quicksand, sans-serif; color: #FFFFFF; background: #1E5B8C; border: none; border-radius: 999px; padding: .4rem .9rem; cursor: pointer; }

  /* ---- fingerprints ---- */
  .prints h4 { margin: 0 0 .7rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: #1E3F5C; }
  .grid { display: grid; grid-template-columns: 3.2rem 1fr 1fr; gap: .45rem .6rem; align-items: center; }
  .col-h { font-size: .74rem; font-weight: 800; letter-spacing: .04em; color: #4D6473; }
  .row-h { font-weight: 800; font-size: .95rem; color: #3D2A22; }
  .row-h small { font-size: .65rem; opacity: .7; }
  .none { height: 28px; display: grid; place-items: center; border: 1.5px dashed #D8CFC4; border-radius: 6px; font-size: .72rem; font-weight: 600; color: #A69886; }
  .prints { position: relative; }
  .grid-wrap { position: relative; }
  .grid { transition: filter .5s; }
  .grid-wrap.hidden .grid { filter: blur(9px) saturate(.7); pointer-events: none; user-select: none; }
  .veil { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: .5rem; text-align: center; padding: 1rem; }
  .veil p { margin: 0; padding: .4rem .8rem; border-radius: 999px; background: rgba(255, 251, 244, .92); font-weight: 700; font-size: .9rem; color: #1E3F5C; box-shadow: 0 2px 10px rgba(61, 42, 34, .12); }
  .veil button { font: 700 .82rem Quicksand, sans-serif; color: #FFFFFF; background: #1E5B8C; border: none; border-radius: 999px; padding: .4rem .9rem; cursor: pointer; }
  .foot { margin: .6rem 0 0; font-size: .75rem; color: #7A8B92; }
  .seg-tip {
    position: fixed; z-index: 50; transform: translate(10px, -130%); pointer-events: none;
    display: flex; align-items: center; gap: .35rem; padding: .25rem .5rem; border-radius: 6px;
    background: #1E2A30; color: #FFFFFF; font: 700 .75rem Quicksand, sans-serif;
  }
  .seg-tip i { width: .7rem; height: .7rem; border-radius: 2px; border: 1px solid rgba(255, 255, 255, .6); }

  @media (max-width: 820px) {
    .cg { grid-template-columns: minmax(0, 1fr); }
    .result { flex-direction: column; align-items: flex-start; }
    .result img { width: 100%; max-width: 16rem; }
  }
</style>
