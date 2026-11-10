<script>
  // New note details window (ModalContent.svelte is kept). Opens from the timeline and the wallet.
  // Front/back flip, key facts, what the note was worth in dollars, and the other notes of the same value.
  import { fade, fly } from 'svelte/transition';
  import { t, money, lang } from '../../../i18n.js';
  import { realPhoto } from '../noteImage.js';

  export let open = false;
  export let note;            // the selected note (from TimelineVintage)
  export let notes = [];      // all notes, to browse the same value
  export let colors = {};
  export let eras = [];
  export let lastYear = 2023;

  let dialog;
  $: if (dialog) { if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }

  const label = (v) => (v === 0.5 ? '½' : String(v));
  let side = 'front';
  let flipping = false;
  $: note, (side = 'front');

  $: active = note?.Active === 'Yes';
  $: until = active ? lastYear : note?.EndofCirculation;
  $: years = note ? Math.max(1, until - note.Issued) : 0;
  $: era = note && (eras.find((e) => note.Issued >= e.from && note.Issued < e.to) || eras[eras.length - 1]);
  $: usd0 = +note?.ValueDayofIssue || 0;
  $: usd1 = +note?.ValueEndofCirculation || 0;
  $: change = usd0 ? Math.round(((usd1 - usd0) / usd0) * 100) : null;
  $: maxUsd = Math.max(usd0, usd1, 0.01);
  $: siblings = note ? notes.filter((n) => n.Value === note.Value).sort((a, b) => a.Issued - b.Issued) : [];
  $: idx = siblings.indexOf(note);
  $: front = realPhoto(note, 'front') || note?.img;   // RealNotes/ photo if saved, else the old link
  $: back = realPhoto(note, 'back');

  function flip() {
    if (!back) return;
    flipping = true;
    side = side === 'front' ? 'back' : 'front';
    setTimeout(() => (flipping = false), 600);
  }
  function go(d) {
    if (siblings.length < 2) return;
    note = siblings[(idx + d + siblings.length) % siblings.length];
  }
  function onKey(e) {
    if (!open) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'f') flip();
  }
</script>

<svelte:window on:keydown={onKey} />

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (open = false)} on:click|self={() => dialog.close()} style="--c:{colors[note?.Value] || '#8C4D3F'}">
  {#if note}
    <article class="nm">
      <!-- header -->
      <header>
        <span class="badge">{$money(note.Value)}</span>
        <div class="who">
          <h3 lang="en">{note.ObserveInEnglish}</h3>
          {#if note.ObserveInArabic}<span class="ar" lang="ar" dir="rtl">{note.ObserveInArabic}</span>{/if}
        </div>
        <span class="era" style="--ec:{era?.ink}">{era?.key ? $t(era.key) : era?.name}</span>
        <button type="button" class="close" on:click={() => dialog.close()} aria-label={$t('close')}>×</button>
      </header>

      <!-- the note -->
      <div class="stage" dir="ltr">
        {#if siblings.length > 1}
          <button type="button" class="nav prev" on:click={() => go(-1)} aria-label={$t('nmPrev')}>‹</button>
        {/if}
        <button type="button" class="card" class:back={side === 'back'} class:can={!!back} on:click={flip} aria-label={back ? $t('nmFlip') : $money(note.Value)}>
          {#key note.id}
            <span class="face f" in:fade={{ duration: 200 }}><img src={front} alt={`${$money(note.Value)} ${note.Issued}, ${$t('nmFront')}`} /></span>
            {#if back}<span class="face b"><img src={back} alt={`${$money(note.Value)} ${note.Issued}, ${$t('nmBack')}`} /></span>{/if}
          {/key}
        </button>
        {#if siblings.length > 1}
          <button type="button" class="nav next" on:click={() => go(1)} aria-label={$t('nmNext')}>›</button>
        {/if}
      </div>
      {#if back}
        <div class="sides" role="tablist">
          <button type="button" role="tab" aria-selected={side === 'front'} class:on={side === 'front'} on:click={() => side !== 'front' && flip()}>{$t('nmFront')}</button>
          <button type="button" role="tab" aria-selected={side === 'back'} class:on={side === 'back'} on:click={() => side !== 'back' && flip()}>{$t('nmBack')}</button>
          <span class="tip">{$t('nmFlipTip')}</span>
        </div>
      {/if}

      <!-- facts -->
      {#key note.id}
        <div class="facts" in:fly={{ y: 8, duration: 250 }}>
          <div class="fact"><span>{$t('nmIssued')}</span><b>{note.Issued}</b></div>
          <div class="fact"><span>{active ? $t('nmStatus') : $t('nmWithdrawn')}</span><b class:live={active}>{active ? $t('nmInCirc') : note.EndofCirculation}</b></div>
          <div class="fact"><span>{$t('nmInUse')}</span><b>{years} {years === 1 ? $t('year') : $t('years')}</b></div>
          {#if note.Width && note.Height}<div class="fact"><span>{$t('nmSize')}</span><b>{note.Width} × {note.Height} <small>{$t('mm')}</small></b></div>{/if}
        </div>

        {#if usd0}
          <section class="worth" in:fly={{ y: 8, duration: 250, delay: 60 }}>
            <h4>{$t('nmWorthQ', { v: $money(note.Value) })}</h4>
            <div class="bars" dir="ltr">
              <div class="bar-row">
                <span class="when">{note.Issued}</span>
                <span class="track"><i style="width:{(usd0 / maxUsd) * 100}%"></i></span>
                <b>${usd0.toFixed(2)}</b>
              </div>
              <div class="bar-row">
                <span class="when">{active ? $t('Today') : note.EndofCirculation}</span>
                <span class="track"><i class="later" style="width:{(usd1 / maxUsd) * 100}%"></i></span>
                <b>${usd1.toFixed(2)}</b>
              </div>
            </div>
            {#if change != null}
              <p class="verdict" class:down={change < 0}>
                {#if change < 0}
                  {@html $t('nmLost', { n: -change, w: active ? $t('nmSince') : $t('nmWhile') })}
                {:else}
                  {@html $t('nmGained', { n: change, w: active ? $t('nmSince') : $t('nmWhile') })}
                {/if}
              </p>
            {/if}
          </section>
        {/if}
      {/key}

      <!-- other notes of the same value -->
      {#if siblings.length > 1}
        <footer>
          <h4>{$t('nmAll', { n: siblings.length, v: $money(note.Value) })}</h4>
          <div class="strip">
            {#each siblings as s (s.id)}
              <button type="button" class="thumb" class:on={s === note} on:click={() => (note = s)} aria-label={`${$lang === 'ar' ? s.ObserveInArabic : s.ObserveInEnglish}, ${s.Issued}`}>
                <img src={s.img} alt="" loading="lazy" />
                <span>{s.Issued}</span>
              </button>
            {/each}
          </div>
        </footer>
      {/if}
    </article>
  {/if}
</dialog>

<style>
  dialog {
    width: min(760px, calc(100vw - 1.5rem)); max-height: calc(100vh - 2rem); padding: 0; border: none; border-radius: 16px;
    background: #FFFBF4; color: #3D2A22; box-shadow: 0 24px 60px rgba(0, 0, 0, .35); overflow: auto;
  }
  dialog::backdrop { background: rgba(30, 22, 18, .55); backdrop-filter: blur(2px); }
  dialog[open] { animation: pop .3s cubic-bezier(.34, 1.56, .64, 1); }
  @keyframes pop { from { transform: scale(.95); opacity: 0; } to { transform: none; opacity: 1; } }

  .nm { font-family: Quicksand, sans-serif; border-top: 6px solid var(--c); }
  header { display: flex; align-items: center; gap: .8rem; padding: 1rem 1.2rem .6rem; flex-wrap: wrap; }
  .badge { padding: .25rem .7rem; border-radius: 999px; background: var(--c); color: #FFFFFF; font-weight: 800; font-size: 1.2rem; }
  .badge small { font-size: .7rem; }
  .who { display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap; flex: 1; min-width: 0; }
  .who h3 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; color: #1E3F5C; }
  .ar { font-size: 1.05rem; color: #8C4D3F; }
  .era { font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--ec); }
  .close { width: 2.1rem; height: 2.1rem; border: none; border-radius: 50%; background: #F1E8DC; font-size: 1.3rem; line-height: 1; cursor: pointer; color: #3D2A22; }

  /* note with 3D flip */
  .stage { position: relative; display: flex; align-items: center; gap: .5rem; padding: .3rem 1.2rem 0; perspective: 1400px; }
  .card { position: relative; flex: 1; aspect-ratio: 2 / 1; padding: 0; border: none; background: none; transform-style: preserve-3d; transition: transform .6s cubic-bezier(.3, .7, .2, 1); }
  .card.can { cursor: pointer; }
  .card.back { transform: rotateY(180deg); }
  .face { position: absolute; inset: 0; display: grid; place-items: center; backface-visibility: hidden; border-radius: 10px; overflow: hidden; background: #F1E8DC; box-shadow: 0 10px 26px rgba(61, 42, 34, .25); }
  .face.b { transform: rotateY(180deg); }
  /* absolutely placed so taller notes (the 1958 – 1973 series is about 1.75 : 1) shrink to fit instead of being cut off */
  .face img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
  .nav { flex: 0 0 auto; width: 2.4rem; height: 2.4rem; border: none; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 8px rgba(0, 0, 0, .15); font-size: 1.5rem; line-height: 1; cursor: pointer; color: #1E3F5C; }
  .sides { display: flex; align-items: center; gap: .4rem; padding: .7rem 1.2rem 0; }
  .sides button { font: 700 .8rem Quicksand, sans-serif; color: #4D6473; background: #FFFFFF; border: 1.5px solid #D9CFC2; border-radius: 999px; padding: .25rem .75rem; cursor: pointer; }
  .sides button.on { background: var(--c); border-color: var(--c); color: #FFFFFF; }
  .sides .tip { font-size: .72rem; color: #9C8B7B; margin-left: .3rem; }

  /* facts */
  .facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: .6rem; padding: 1rem 1.2rem 0; }
  .fact { display: flex; flex-direction: column; gap: .1rem; padding: .55rem .7rem; border-radius: 10px; background: #F6EEE3; }
  .fact span { font-size: .66rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #8A7A6B; }
  .fact b { font-size: 1.05rem; color: #3D2A22; }
  .fact b small { font-size: .7rem; }
  .fact b.live { color: #2E7D5B; }

  /* worth */
  .worth { margin: 1rem 1.2rem 0; padding: .9rem 1rem; border-radius: 12px; border: 1px solid #E6DCCF; background: #FFFFFF; }
  .worth h4, footer h4 { margin: 0 0 .6rem; font-family: 'Playfair Display', Georgia, serif; font-size: 1.02rem; color: #1E3F5C; }
  .bars { display: grid; gap: .45rem; }
  .bar-row { display: grid; grid-template-columns: 3.4rem 1fr 4.2rem; align-items: center; gap: .6rem; }
  .when { font-size: .8rem; font-weight: 700; color: #4D6473; }
  .track { height: .9rem; border-radius: 999px; background: #F1E8DC; overflow: hidden; }
  .track i { display: block; height: 100%; border-radius: inherit; background: var(--c); transition: width .6s cubic-bezier(.2, .8, .2, 1); }
  .track i.later { opacity: .55; }
  .bar-row b { text-align: right; font-size: 1rem; }
  .verdict { margin: .6rem 0 0; font-size: .85rem; color: #2E7D5B; }
  .verdict.down { color: #B8454E; }

  /* siblings */
  footer { padding: 1rem 1.2rem 1.2rem; }
  .strip { display: flex; gap: .5rem; overflow-x: auto; padding-bottom: .3rem; }
  .thumb { flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: .2rem; padding: .25rem; border: 2px solid transparent; border-radius: 8px; background: none; cursor: pointer; font-family: inherit; }
  .thumb img { width: 5.6rem; height: auto; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 0, 0, .15); }
  .thumb span { font-size: .72rem; font-weight: 700; color: #4D6473; }
  .thumb.on { border-color: var(--c); background: #F6EEE3; }

  @media (max-width: 560px) {
    header { display: grid; grid-template-columns: auto 1fr auto; grid-template-areas: 'badge era close' 'who who who'; gap: .5rem .6rem; padding: .8rem .9rem .5rem; }
    .badge { grid-area: badge; font-size: 1rem; }
    .era { grid-area: era; }
    .close { grid-area: close; }
    .who { grid-area: who; }
    .who h3 { font-size: 1.25rem; }
    .stage { padding: .3rem .6rem 0; gap: .3rem; }
    .nav { width: 2rem; height: 2rem; font-size: 1.2rem; }
    .facts, .sides, footer { padding-left: .9rem; padding-right: .9rem; }
    .worth { margin-left: .9rem; margin-right: .9rem; }
    .sides .tip { display: none; }
  }
  @media (prefers-reduced-motion: reduce) { .card, .track i { transition: none; } dialog[open] { animation: none; } }
</style>
