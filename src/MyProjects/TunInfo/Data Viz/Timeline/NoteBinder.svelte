<script>
  // The reader's banknote binder: every Tunisian note since independence, 6 per page, in no particular order.
  // Closed at first; opening it flips the cover. Pages turn like a real binder (two pages side by side on
  // wide screens, one page on narrow ones). "Sort them" hands over to the timeline (on:sort).
  import { createEventDispatcher, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { t, pick, money } from '../../i18n.js';
  import { star, frieze } from '../../Components/tunisianPatterns.js';
  import { INTRUDERS, dinarRate } from './intruders.js';
  import { strayNote } from './strayStore.js';
  import daliImg from '../../Components/dali.svg';

  export let notes = [];
  export let colors = {};
  export let leaving = false;   // the notes are being taken out to be sorted (the timeline animates them)
  const dispatch = createEventDispatcher();

  const PER_PAGE = 6;
  const label = (v) => (v === 0.5 ? '½' : String(v));

  // the same shuffled order for every visitor (seeded), so it doesn't reshuffle on every visit
  function shuffled(list, seed) {
    const a = [...list];
    const state = { s: seed };
    function rnd() { state.s = (state.s * 1103515245 + 12345) % 2147483648; return state.s / 2147483648; }
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
    // a small random tilt for each note, like notes slipped into pockets by hand
    return a.map((n) => ({ ...n, tilt: (rnd() - 0.5) * 5 }));
  }
  const order = shuffled(notes, 1956);
  // The joke: one foreign note hides among the Tunisian ones (a $20 or a €20, a different pick and pocket on
  // each visit, always on pages 1–2 so people find it). Clicking it asks: toss it out, or keep it for the
  // next trip (it stays in its pocket).
  const stray = INTRUDERS[Math.floor(Math.random() * INTRUDERS.length)];
  order.splice(Math.floor(Math.random() * 12), 0, { ...stray, id: 'stray', intruder: true, tilt: (Math.random() - 0.5) * 9 });
  let flying = false;   // the stray note is being thrown out
  let tossed = false;   // gone for good: its pocket stays empty
  $: gone = (n) => n.intruder && tossed;
  let toast = false;    // Dali's "can I have it?" popup
  strayNote.set({ tag: stray.tag, choice: null });
  let strayRate = stray.rate;   // dinars per dollar / euro, updated with today's rate
  dinarRate(stray.cur, stray.rate).then((r) => (strayRate = r));
  // the popup stays until the reader taps or clicks anywhere, or presses Escape
  function dismissToast() { if (toast) toast = false; }
  function pickNote(n) {
    if (!n.intruder) { dispatch('note', n); return; }
    toast = true;
  }
  // give it to Dali: it flies off (into his pocket)
  function toss() {
    toast = false; flying = true;
    strayNote.update((v) => ({ ...v, choice: 'gave' }));
    setTimeout(() => (tossed = true), 900);
  }
  // keep it: it stays in its pocket, and Dali will remember
  function keep() { toast = false; strayNote.update((v) => ({ ...v, choice: 'kept' })); }
  // "about 67 dinars, a bit more than three of the 20-dinar notes in this binder"
  const NUM_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  const NUM_AR = ['', 'ورقة واحدة', 'ورقتين', 'ثلاث أوراق', 'أربع أوراق', 'خمس أوراق', 'ست أوراق', 'سبع أوراق', 'ثماني أوراق'];
  $: strayDt = Math.round(stray.amount * strayRate);
  $: k = Math.min(8, Math.floor(strayDt / 20));
  $: more = strayDt - 20 * k >= 3;
  $: cmp = $pick(`${more ? 'a bit more than ' : ''}${NUM_EN[k]}`, `${more ? 'أكثر بقليل من ' : ''}${NUM_AR[k]}`);
  // "Sort the notes": hand over where each visible note sits on the page (document coordinates, unrotated
  // size) so the timeline can lift them out of the binder and fly them onto their bars
  let wrapEl;
  function sortOut() {
    toast = false;
    const rects = {};
    wrapEl.querySelectorAll('.spread .pocket[data-id] img').forEach((img) => {
      const r = img.getBoundingClientRect();
      if (!r.width) return;
      const w = img.offsetWidth, h = img.offsetHeight;
      const id = img.parentElement.dataset.id;
      const n = order.find((x) => String(x.id) === id);
      rects[id] = { x: r.left + r.width / 2 - w / 2 + scrollX, y: r.top + r.height / 2 - h / 2 + scrollY, w, h, tilt: n ? n.tilt : 0 };
    });
    const b = wrapEl.querySelector('.book').getBoundingClientRect();
    dispatch('sort', { rects, book: { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }, single });
  }
  // ---- the bookplate can be signed with a "marker" (mouse, finger or pen) ----
  // Kept in this browser only, so the binder is yours next time too.
  const SIGN_KEY = 'tuninfo-binder-signature';
  let signature = '';
  try { signature = localStorage.getItem(SIGN_KEY) || ''; } catch (e) { /* storage blocked */ }
  function saveSignature(v) {
    signature = v;
    try { v ? localStorage.setItem(SIGN_KEY, v) : localStorage.removeItem(SIGN_KEY); } catch (e) { /* ignore */ }
  }
  let padCtx = null, padW = 0, padH = 0;
  function signPad(canvas) {
    const ctx = canvas.getContext('2d');
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    padW = r.width; padH = r.height;
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1E3F5C'; ctx.fillStyle = '#1E3F5C';
    padCtx = ctx;
    if (signature) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, padW, padH); im.src = signature; }
    let pts = null;
    const at = (e) => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, t: e.timeStamp }; };
    function down(e) {
      e.preventDefault(); e.stopPropagation();
      canvas.setPointerCapture(e.pointerId);
      const p = at(e); pts = [p];
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
    }
    function move(e) {
      if (!pts) return;
      const p = at(e), a = pts[pts.length - 1];
      // a felt-tip line: a little thinner when moving fast, smoothed through midpoints
      const v = Math.hypot(p.x - a.x, p.y - a.y) / Math.max(1, p.t - a.t);
      ctx.lineWidth = Math.max(1.8, 3.2 - v * 0.9);
      const m = { x: (a.x + p.x) / 2, y: (a.y + p.y) / 2 };
      ctx.beginPath();
      ctx.moveTo(a.mx ?? a.x, a.my ?? a.y);
      ctx.quadraticCurveTo(a.x, a.y, m.x, m.y);
      ctx.stroke();
      pts.push({ ...p, mx: m.x, my: m.y });
    }
    function up() { if (!pts) return; pts = null; saveSignature(canvas.toDataURL('image/png')); }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    return { destroy() {
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      if (padCtx === ctx) padCtx = null;
    } };
  }
  function clearSignature() { padCtx && padCtx.clearRect(0, 0, padW, padH); saveSignature(''); }
  const colorOf = (n) => (n.intruder ? n.color : colors[n.Value]);
  const pages = Array.from({ length: Math.ceil(order.length / PER_PAGE) }, (_, i) => order.slice(i * PER_PAGE, i * PER_PAGE + PER_PAGE));

  let width = 0;
  $: single = width > 0 && width < 700;           // one page at a time on narrow screens
  $: step = single ? 1 : 2;
  // Like a real book: page 1 sits on the right, facing the inside of the cover (left index -1);
  // after that the spreads are 2–3, 4–5, …
  $: firstStart = single ? 0 : -1;
  $: lastStart = single ? pages.length - 1 : -1 + 2 * Math.floor(pages.length / 2);

  let opened = false;      // cover open
  let opening = false;     // cover flip in progress
  let at = -1;             // index of the left page (-1 = inside of the cover), or the only page on phones
  // keep the spreads in step when the screen switches between one and two pages
  $: if (single && at < 0) at = 0;
  $: if (!single && (at + 2) % 2 === 0) at = at - 1;
  let turn = null;         // { dir: 1 | -1 } while a page is turning
  const TURN_MS = 650;

  function open() {
    if (opened || opening) return;
    at = firstStart;         // a binder always opens on page 1
    opening = true;
    setTimeout(() => { opened = true; opening = false; }, 900);
  }
  // closing folds the binder shut on the page you are on: the back of the cover shows that left page
  // (see .cover-inside), lands on top of it, then swings over to the right
  async function close() {
    if (!opened || turn) return;
    opened = false;
    opening = true;          // cover drawn in its open position
    await tick();
    requestAnimationFrame(() => requestAnimationFrame(() => (opening = false)));
  }
  function go(dir) {
    const next = at + dir * step;
    if (turn || next < firstStart || next > lastStart) return;
    if (single) { at = next; return; }
    turn = { dir, from: at, to: next };
    setTimeout(() => { at = next; turn = null; }, TURN_MS);
  }
  function onKey(e) {
    if (e.key === 'Escape') dismissToast();
    if (!opened) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  }

  // what sits under the turning leaf: going forward, the left page stays and the next right page shows;
  // going back, the previous left page shows and the right page stays
  $: leftIdx = turn ? (turn.dir > 0 ? turn.from : turn.to) : at;
  $: rightIdx = turn ? (turn.dir > 0 ? turn.to + 1 : turn.from + 1) : at + 1;
  // the leaf: forward = current right page (front) turning to the next left page (back)
  $: leafFront = turn ? (turn.dir > 0 ? turn.from + 1 : turn.from) : null;
  $: leafBack = turn ? (turn.dir > 0 ? turn.to : turn.to + 1) : null;
  $: pageLabel = single || at < 0 || at + 2 > pages.length
    ? $t('bdPage', { a: single ? at + 1 : Math.max(1, at + 1), b: pages.length })
    : $t('bdPages', { a: at + 1, b: at + 2, c: pages.length });
</script>

<svelte:window on:keydown={onKey} on:pointerdown={dismissToast} />

<div class="binder-wrap" class:leaving bind:this={wrapEl} bind:clientWidth={width} style="--star:{star}; --frieze:{frieze}">
  <div class="book" class:single class:closed={!opened && !opening} class:opening>
    <!-- inside: the pages -->
    <div class="spread">
      {#if !single}
        <!-- hidden while the cover turns: the back of the cover lands exactly where this page is -->
        <div class="page left" class:inside={leftIdx === -1} class:waiting={!opened}>
          {#if leftIdx === -1}
            <!-- inside of the cover, with a bookplate (the same one is printed on the back of the cover) -->
            <div class="plate">
              <span class="plate-star" aria-hidden="true"></span>
              <span class="plate-k">{$t('bdPlate')}</span>
              <span class="plate-line sign">
                <canvas use:signPad aria-label={$t('bdSignHere')}></canvas>
                {#if !signature}<span class="sign-hint" aria-hidden="true">✎ {$t('bdSignHere')}</span>{/if}
                {#if signature}<button type="button" class="sign-clear" on:click={clearSignature}>{$t('bdSignClear')}</button>{/if}
              </span>
              <span class="plate-sub">{$t('bdPlateSub')}</span>
            </div>
          {:else if opened || opening}
            {#if pages[leftIdx]}
              <div class="pockets" in:fade={{ duration: 300, delay: opening ? 450 : 0 }}>
                {#each pages[leftIdx] as n (n.id)}
                  {#if gone(n)}<span class="pocket empty" aria-hidden="true"></span>{:else}
                  <button type="button" class="pocket" class:flying={n.intruder && flying} data-id={n.intruder ? null : n.id} style="--c:{colorOf(n)}" on:click={() => pickNote(n)}
                          aria-label={n.intruder ? $t(n.name) : `${$money(n.Value)}, ${$pick(n.ObserveInEnglish, n.ObserveInArabic)}`}>
                    <img src={n.img} alt="" style="transform: rotate({n.tilt}deg)" draggable="false" loading="lazy" />
                    <span class="tag">{n.intruder ? n.tag : `${label(n.Value)} ${$t('dt')}`}</span>
                  </button>{/if}
                {/each}
                {#each Array(PER_PAGE - pages[leftIdx].length) as _}<span class="pocket empty" aria-hidden="true"></span>{/each}
              </div>
            {/if}
            <span class="folio">{leftIdx + 1}</span>
          {/if}
        </div>
      {/if}
      <div class="page right" class:inside={!pages[single ? at : rightIdx]}>
        {#if pages[single ? at : rightIdx]}
          <div class="pockets">
            {#each pages[single ? at : rightIdx] as n (n.id)}
              {#if gone(n)}<span class="pocket empty" aria-hidden="true"></span>{:else}
                  <button type="button" class="pocket" class:flying={n.intruder && flying} data-id={n.intruder ? null : n.id} style="--c:{colorOf(n)}" on:click={() => pickNote(n)}
                      tabindex={opened ? 0 : -1}
                      aria-label={n.intruder ? $t(n.name) : `${$money(n.Value)}, ${$pick(n.ObserveInEnglish, n.ObserveInArabic)}`}>
                <img src={n.img} alt="" style="transform: rotate({n.tilt}deg)" draggable="false" loading="lazy" />
                <span class="tag">{n.intruder ? n.tag : `${label(n.Value)} ${$t('dt')}`}</span>
              </button>{/if}
            {/each}
            {#each Array(PER_PAGE - pages[single ? at : rightIdx].length) as _}<span class="pocket empty" aria-hidden="true"></span>{/each}
          </div>
          <span class="folio">{(single ? at : rightIdx) + 1}</span>
        {:else}
          <!-- inside of the back cover -->
          <div class="blank"><span class="plate-star" aria-hidden="true"></span><p>{$t('bdEnd')}</p></div>
        {/if}
      </div>

      <!-- the page that is turning -->
      {#if turn}
        <div class="leaf" class:back={turn.dir < 0} style="--ms:{TURN_MS}ms">
          <div class="face front page">
            {#if pages[leafFront]}
              <div class="pockets">
                {#each pages[leafFront] as n (n.id)}
                  {#if gone(n)}<span class="pocket empty"></span>{:else}<span class="pocket" style="--c:{colorOf(n)}"><img src={n.img} alt="" style="transform: rotate({n.tilt}deg)" /><span class="tag">{n.intruder ? n.tag : `${label(n.Value)} ${$t('dt')}`}</span></span>{/if}
                {/each}
              </div>
            {/if}
          </div>
          <div class="face rear page">
            {#if pages[leafBack]}
              <div class="pockets">
                {#each pages[leafBack] as n (n.id)}
                  {#if gone(n)}<span class="pocket empty"></span>{:else}<span class="pocket" style="--c:{colorOf(n)}"><img src={n.img} alt="" style="transform: rotate({n.tilt}deg)" /><span class="tag">{n.intruder ? n.tag : `${label(n.Value)} ${$t('dt')}`}</span></span>{/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- binder rings down the spine: outside the spread so they stay visible on the closed cover too -->
    {#if !single}<div class="rings" aria-hidden="true"><i></i><i></i><i></i><i></i></div>{/if}

    <!-- the cover (covers the right page when closed, flips over to the left when opened) -->
    {#if !opened}
      <button type="button" class="cover" on:click={open} aria-label={$t('bdOpen')}>
        <span class="cover-face">
          <span class="cover-band" aria-hidden="true"></span>
          <svg class="cover-crescent" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <mask id="moon"><rect width="100" height="100" fill="#fff"/><circle cx="55" cy="50" r="22" fill="#000"/></mask>
            </defs>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#D9A441" stroke-width="4"/>
            <circle cx="45" cy="50" r="28" fill="#F6EBD3" mask="url(#moon)"/>
            <polygon points="63.0,40.0 65.5,46.6 72.5,46.9 67.0,51.3 68.9,58.1 63.0,54.2 57.1,58.1 59.0,51.3 53.5,46.9 60.5,46.6" fill="#F6EBD3"/>
          </svg>
          <span class="cover-title">{$t('bdCover')}</span>
          <span class="cover-sub">1958 – {$t('today')}</span>
          <span class="cover-band" aria-hidden="true"></span>
          <span class="cover-cta">{$t('bdOpen')}</span>
        </span>
        <span class="cover-inside" class:as-page={!single && at > firstStart} aria-hidden="true">
          {#if !single && at > firstStart && pages[at]}
            <!-- closing from the middle: the left page you were on folds over with the cover -->
            <span class="pockets">
              {#each pages[at] as n (n.id)}
                {#if gone(n)}<span class="pocket empty"></span>{:else}<span class="pocket" style="--c:{colorOf(n)}"><img src={n.img} alt="" style="transform: rotate({n.tilt}deg)" /><span class="tag">{n.intruder ? n.tag : `${label(n.Value)} ${$t('dt')}`}</span></span>{/if}
              {/each}
              {#each Array(PER_PAGE - pages[at].length) as _}<span class="pocket empty"></span>{/each}
            </span>
          {:else}
            <span class="plate">
              <span class="plate-star"></span>
              <span class="plate-k">{$t('bdPlate')}</span>
              <span class="plate-line sign">{#if signature}<img src={signature} alt="" />{/if}</span>
              <span class="plate-sub">{$t('bdPlateSub')}</span>
            </span>
          {/if}
        </span>
      </button>
    {/if}
  </div>

  {#if toast}
    <!-- taps inside the popup don't close it (any tap elsewhere does) -->
    <div class="toast" role="status" transition:fade={{ duration: 200 }} style="--c:{stray.color}" on:pointerdown|stopPropagation>
      <p class="toast-who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
      <b>{$t('bdOops', { note: stray.tag })}</b>
      <span>{$t(stray.line, { dt: $money(strayDt), cmp })}</span>
      <div class="toast-btns">
        <button type="button" class="t-btn toss" on:click={toss}>{$t('bdToss')}</button>
        <button type="button" class="t-btn keep" on:click={keep}>{$t('bdKeep')}</button>
      </div>
    </div>
  {/if}

  <div class="nav" class:hidden={!opened}>
    <button type="button" class="arrow" on:click={() => go(-1)} disabled={at <= firstStart || !!turn} aria-label={$t('bdPrev')}>‹</button>
    <span class="count">{pageLabel}</span>
    <button type="button" class="arrow" on:click={() => go(1)} disabled={at >= lastStart || !!turn} aria-label={$t('bdNext')}>›</button>
    <button type="button" class="close-btn" on:click={close} disabled={!!turn}>{$t('bdClose')}</button>
  </div>

  {#if opened}
    <div class="sort" in:fade={{ duration: 300 }}>
      <p>{$t('bdSortQ')}</p>
      <button type="button" class="sort-btn" on:click={sortOut} disabled={leaving}>{$t('bdSort')}</button>
    </div>
  {/if}
</div>

<style>
  .binder-wrap { position: relative; z-index: 1; margin: 1.4rem auto 0; max-width: 980px; transition: opacity .55s ease, transform .6s cubic-bezier(.5, 0, .7, .4); }
  /* sorting: the notes are lifted out (drawn by the timeline), the empty binder fades away upwards */
  .binder-wrap.leaving { opacity: 0; transform: translateY(-48px); pointer-events: none; }
  .binder-wrap.leaving .pocket[data-id] img { visibility: hidden; }

  /* ---------- the book ---------- */
  .book { position: relative; perspective: 5000px; transition: transform .9s cubic-bezier(.4, .1, .2, 1); }
  /* closed: only the cover shows, centred */
  .book.closed:not(.single) { transform: translateX(-25%); }
  /* hidden once the cover has shut (the delay lets the pages show while it swings closed) */
  .book.single.closed .spread .page { visibility: hidden; transition: visibility 0s .9s; }
  .book.closed:not(.single) .spread { visibility: hidden; transition: visibility 0s .9s; }

  .spread { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .book.single .spread { grid-template-columns: 1fr; }

  .page {
    position: relative; box-sizing: border-box; aspect-ratio: 3 / 3.4; padding: 1.1rem 1rem 1.8rem;
    background:
      linear-gradient(to right, rgba(74, 46, 37, .08), transparent 8%, transparent 92%, rgba(74, 46, 37, .06)),
      #FBF6EA;
    box-shadow: 0 6px 18px rgba(74, 46, 37, .16);
  }
  .page.left { border-radius: 10px 2px 2px 10px; }
  .page.left.waiting { visibility: hidden; }
  .page.right { border-radius: 2px 10px 10px 2px; }
  .book.single .page.right { border-radius: 10px; }

  /* three rows of two clear pockets */
  .pockets { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); gap: .7rem .6rem; height: 100%; }
  .pocket {
    position: relative; display: grid; place-items: center; padding: .45rem; border: 0; cursor: pointer; font: inherit;
    border-radius: 4px;
    background: linear-gradient(160deg, rgba(255, 255, 255, .7), rgba(255, 255, 255, .15) 45%, rgba(255, 255, 255, .45));
    box-shadow: inset 0 0 0 1px rgba(140, 77, 63, .18), inset 0 -6px 0 rgba(140, 77, 63, .05);
    transition: transform .2s;
  }
  .pocket img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 3px; box-shadow: 0 2px 5px rgba(74, 46, 37, .25); transition: transform .2s; }
  button.pocket:hover img, button.pocket:focus-visible img { transform: rotate(0) scale(1.06) !important; }
  button.pocket:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 2px; }
  .tag {
    position: absolute; bottom: .2rem; inset-inline-end: .3rem; padding: .05rem .4rem; border-radius: 999px;
    background: var(--c); color: #FFFFFF; font-size: .66rem; font-weight: 800; box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
  }
  /* inside of the cover */
  .page.left.inside {
    background: radial-gradient(ellipse at 40% 30%, rgba(255, 255, 255, .4), transparent 60%), repeating-linear-gradient(45deg, rgba(122, 62, 49, .05) 0 2px, transparent 2px 6px), #E2CFAB;
    box-shadow: inset -12px 0 16px -10px rgba(74, 46, 37, .3), inset 0 0 0 10px #7A3E31, 0 6px 18px rgba(74, 46, 37, .16);
  }
  .plate {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 62%; box-sizing: border-box;
    display: flex; flex-direction: column; align-items: center; gap: .6rem; padding: 1.4rem 1.2rem;
    text-align: center; color: #6B4A3E; background: #FBF6EA; border: 1.5px solid #8C4D3F; outline: 1px solid rgba(140, 77, 63, .4); outline-offset: -6px;
    border-radius: 6px; box-shadow: 0 2px 6px rgba(74, 46, 37, .15);
  }
  .plate-star { width: 34px; height: 34px; background-image: var(--star); background-size: contain; background-repeat: no-repeat; }
  .plate-k { font-family: 'Playfair Display', Georgia, serif; font-weight: 800; font-size: 1.05rem; color: #4A2E25; }
  .plate-line { display: block; width: 80%; height: 1.6rem; border-bottom: 1.5px dotted #8C4D3F; }
  /* the signature line: draw on it like a felt-tip marker */
  .plate-line.sign { position: relative; height: 3.4rem; margin-top: -.4rem; }
  .sign canvas, .sign img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .sign canvas {
    touch-action: none;
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'%3E%3Cpath d='M3 23l2-6L18 4l4 4L9 21z' fill='%231E3F5C' stroke='%23FBF6EA' stroke-width='1.2'/%3E%3Cpath d='M3 23l2-6 4 4z' fill='%23FBF6EA'/%3E%3C/svg%3E") 3 23, crosshair;
  }
  .sign-hint { position: absolute; left: 0; right: 0; bottom: .35rem; pointer-events: none; font-size: .8rem; font-style: italic; color: rgba(107, 74, 62, .55); }
  .sign-clear {
    position: absolute; right: -1.6rem; top: -.2rem; padding: 0 .3rem; border: 0; background: none; cursor: pointer;
    font: 700 .68rem Quicksand, sans-serif; color: #8C4D3F; text-decoration: underline; opacity: .75;
  }
  .sign-clear:hover { opacity: 1; }
  .plate-sub { font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  .folio { position: absolute; bottom: .5rem; left: 0; right: 0; text-align: center; font-size: .72rem; font-weight: 700; color: #A08778; }
  .blank { box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem; height: 100%; text-align: center; color: #8C6A5C; font-style: italic; font-size: .9rem; padding: 2rem; }
  .blank p { margin: 0; }
  .pocket.empty { cursor: default; }
  /* inside of the back cover */
  .page.right.inside .blank { color: #6B4A3E; }
  .page.right.inside {
    background: radial-gradient(ellipse at 60% 30%, rgba(255, 255, 255, .4), transparent 60%), repeating-linear-gradient(45deg, rgba(122, 62, 49, .05) 0 2px, transparent 2px 6px), #E2CFAB;
    box-shadow: inset 12px 0 16px -10px rgba(74, 46, 37, .3), inset 0 0 0 10px #7A3E31, 0 6px 18px rgba(74, 46, 37, .16);
  }

  /* binder rings down the middle */
  .rings { position: absolute; top: 8%; bottom: 8%; left: 50%; width: 26px; margin-left: -13px; z-index: 5; display: flex; flex-direction: column; justify-content: space-around; pointer-events: none; }
  .rings i { display: block; height: 12px; border-radius: 999px; background: linear-gradient(#E9E4DA, #9C948A 55%, #D7D1C6); box-shadow: 0 2px 3px rgba(0, 0, 0, .25); }

  /* ---------- page turn ---------- */
  .leaf {
    position: absolute; top: 0; bottom: 0; left: 50%; width: 50%; z-index: 2;
    transform-style: preserve-3d; transform-origin: left center;
    animation: turn var(--ms) cubic-bezier(.45, .05, .3, 1) forwards;
  }
  .leaf.back { left: 0; transform-origin: right center; animation-name: turn-back; }
  .leaf .face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .leaf .rear { transform: rotateY(180deg); }
  .leaf:not(.back) .front, .leaf.back .rear { border-radius: 2px 10px 10px 2px; }
  .leaf.back .front, .leaf:not(.back) .rear { border-radius: 10px 2px 2px 10px; }
  .leaf .pocket { cursor: default; }
  @keyframes turn { from { transform: rotateY(0); } to { transform: rotateY(-180deg); } }
  @keyframes turn-back { from { transform: rotateY(0); } to { transform: rotateY(180deg); } }

  /* ---------- cover ---------- */
  .cover {
    position: absolute; top: -6px; bottom: -6px; right: -6px; width: calc(50% + 6px); z-index: 4;
    padding: 0; border: 0; background: none; cursor: pointer; font: inherit;
    transform-style: preserve-3d; transform-origin: left center;
    transition: transform .9s cubic-bezier(.4, .1, .2, 1);
  }
  .book.single .cover { width: calc(100% + 12px); left: -6px; right: -6px; }
  .book.opening .cover { transform: rotateY(-180deg); }
  .book.single.opening .cover { transform: rotateY(-100deg); opacity: 0; transition: transform .9s, opacity .5s .35s; }
  .cover-face, .cover-inside { position: absolute; inset: 0; border-radius: 4px 12px 12px 4px; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .cover-face {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .7rem; padding: 2rem 1.4rem;
    color: #F3E7CC; text-align: center;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, .12), transparent 60%),
      repeating-linear-gradient(45deg, rgba(255, 255, 255, .025) 0 2px, transparent 2px 6px),
      #7A3E31;
    box-shadow: inset 10px 0 14px -8px rgba(0, 0, 0, .45), inset 0 0 0 3px rgba(243, 231, 204, .25), 0 10px 26px rgba(74, 46, 37, .3);
  }
  .cover-inside { transform: rotateY(180deg); background: radial-gradient(ellipse at 40% 30%, rgba(255, 255, 255, .4), transparent 60%), repeating-linear-gradient(45deg, rgba(122, 62, 49, .05) 0 2px, transparent 2px 6px), #E2CFAB; border-radius: 12px 4px 4px 12px; box-shadow: inset -12px 0 16px -10px rgba(74, 46, 37, .3), inset 0 0 0 16px #7A3E31; }   /* same as the inside page it turns into */
  /* back of the cover dressed as the left page (the cover is 6px larger than a page on its outer edges) */
  .cover-inside.as-page {
    box-sizing: border-box; padding: calc(1.1rem + 6px) 1rem calc(1.8rem + 6px) calc(1rem + 6px);
    background: linear-gradient(to right, rgba(74, 46, 37, .08), transparent 8%, transparent 92%, rgba(74, 46, 37, .06)), #FBF6EA;
    border-radius: 10px 2px 2px 10px; box-shadow: none;
  }
  .cover-inside .pocket { cursor: default; }
  .cover-band { display: block; align-self: stretch; height: 14px; background-image: var(--frieze); background-size: 28px 14px; background-repeat: repeat-x; opacity: .95; }
  /* crescent and star in a ring, in the cover palette (cream emblem, ochre ring) */
  .cover-crescent { display: block; width: 74px; height: 74px; filter: drop-shadow(0 1px 0 rgba(0, 0, 0, .35)); }
  .cover-star { display: block; width: 58px; height: 58px; background-image: var(--star); background-size: contain; background-repeat: no-repeat; }
  .cover-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 800; font-size: clamp(1.4rem, 3vw, 2rem); line-height: 1.15; letter-spacing: .01em; }
  .cover-sub { font-size: .8rem; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; opacity: .85; }
  .cover-cta {
    margin-top: .4rem; padding: .45rem 1.1rem; border-radius: 999px; background: #F3E7CC; color: #7A3E31;
    font-weight: 800; font-size: .85rem; box-shadow: 0 2px 6px rgba(0, 0, 0, .25); transition: transform .2s;
  }
  .cover:hover .cover-cta { transform: translateY(-2px); }
  .cover:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 4px; border-radius: 12px; }

  /* ---------- nav + sort ---------- */
  .nav { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; transition: opacity .3s; }
  .nav.hidden { opacity: 0; pointer-events: none; }
  .arrow {
    width: 2.4rem; height: 2.4rem; border-radius: 50%; border: 1.5px solid #8C4D3F; background: #FFFBF1; color: #8C4D3F;
    font-size: 1.4rem; line-height: 1; cursor: pointer; display: grid; place-items: center; padding: 0 0 .15rem;
  }
  .arrow:disabled { opacity: .35; cursor: default; }
  .arrow:not(:disabled):hover { background: #8C4D3F; color: #FFFBF1; }
  .close-btn {
    margin-inline-start: .4rem; padding: .4rem .9rem; border: 1.5px solid #8C4D3F; border-radius: 999px; background: transparent; color: #8C4D3F;
    font: 700 .8rem Quicksand, sans-serif; cursor: pointer; transition: background .2s, color .2s;
  }
  .close-btn:hover { background: #8C4D3F; color: #FFFBF1; }
  .close-btn:disabled { opacity: .4; cursor: default; }

  /* the stray foreign note gets thrown out of the binder */
  .pocket.flying { pointer-events: none; }
  .pocket.flying img { animation: yeet .9s cubic-bezier(.5, -0.3, .7, .4) forwards; }
  .pocket.flying .tag { opacity: 0; transition: opacity .2s; }
  @keyframes yeet {
    0% { transform: rotate(0) scale(1); }
    18% { transform: rotate(-10deg) scale(1.12); }
    32% { transform: rotate(8deg) scale(1.12); }
    100% { transform: translate(160px, -320px) rotate(220deg) scale(.25); opacity: 0; }
  }
  .toast {
    position: absolute; left: 50%; top: 38%; z-index: 10; transform: translateX(-50%); width: min(92%, 440px); box-sizing: border-box;
    display: flex; flex-direction: column; gap: .3rem; padding: .9rem 1.1rem; text-align: center;
    background: #FFFBF1; border: 2px solid var(--c); border-radius: 14px; box-shadow: 0 10px 28px rgba(74, 46, 37, .3);
    animation: pop .35s cubic-bezier(.3, 1.6, .5, 1);
  }
  .toast-who { display: flex; align-items: center; justify-content: center; gap: .4rem; margin: 0; font-weight: 800; font-size: .9rem; color: var(--c); }
  .toast-who img { width: 2.4rem; height: 2.5rem; object-fit: contain; object-position: 50% 0; }
  .toast b { font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: var(--c); }
  .toast span { font-size: .88rem; line-height: 1.4; color: #4A2E25; }
  .toast-btns { display: flex; justify-content: center; gap: .6rem; margin-top: .5rem; flex-wrap: wrap; }
  .t-btn { padding: .45rem 1.05rem; border-radius: 999px; cursor: pointer; font: 800 .85rem Quicksand, sans-serif; transition: transform .15s, background .15s; }
  .t-btn:hover { transform: translateY(-1px); }
  .t-btn:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 2px; }
  .t-btn.toss { border: 0; background: var(--c); color: #FFFBF1; }
  .t-btn.keep { border: 1.5px solid var(--c); background: transparent; color: var(--c); }
  @keyframes pop { from { transform: translateX(-50%) scale(.7); } to { transform: translateX(-50%) scale(1); } }
  .count { font-size: .85rem; font-weight: 700; color: #6B4A3E; min-width: 8rem; text-align: center; }
  .sort { margin-top: 1.4rem; text-align: center; }
  .sort p { margin: 0 0 .7rem; font-size: .95rem; }
  .sort-btn {
    padding: .65rem 1.5rem; border: 0; border-radius: 999px; background: #8C4D3F; color: #FFFBF1; cursor: pointer;
    font: 800 .95rem Quicksand, sans-serif; box-shadow: 0 3px 10px rgba(74, 46, 37, .3); transition: transform .2s, background .2s;
  }
  .sort-btn:hover { background: #6E3A2F; transform: translateY(-2px); }

  @media (max-width: 700px) {
    .page { aspect-ratio: 3 / 3.6; padding: .8rem .7rem 1.6rem; }
    .pockets { gap: .5rem .4rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .book, .cover { transition: none; }
    .leaf { animation-duration: 1ms; }
  }
</style>
