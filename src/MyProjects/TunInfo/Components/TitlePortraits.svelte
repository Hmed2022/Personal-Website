<script>
  // New animated title (Title.svelte is kept). Same portrait composition, but:
  //  - hovering a face (only the face itself, not its empty corners) reveals the real
  //    engraved portrait from the banknote, lifts it to the front and names it
  //  - on touch screens, tap a face
  //  - images are local, compressed copies (were 2-3 MB each from ibb)
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { zellige, frieze, star } from './tunisianPatterns.js';
  import { t, pick } from '../i18n.js';
  import { realNotes } from '../Data Viz/Timeline/noteImage.js';   // "Real notes": show the engraved faces

  const IMG = import.meta.glob('./portraits/*.webp', { eager: true, as: 'url' });
  const src = (k) => IMG[`./portraits/${k}.webp`];

  // DOM order = stacking order of the original composition; top/left in % of a 1000x900 canvas.
  // TIGHTEN pulls every face towards the centre so the group reads as one crowd.
  const TIGHT_X = 0.72, TIGHT_Y = 0.8, CX = 57;
  const FACES_RAW = [
    { k: 'hannibal-new', name: 'Hannibal', note: '5 dinars · 2014', nameAr: 'حنبعل', noteAr: '5 دنانير · 2014', top: 20, left: 43, h: 250 },
    { k: 'hannibal-old', name: 'Hannibal', note: '5 dinars · 1993', nameAr: 'حنبعل', noteAr: '5 دنانير · 1993', top: 1, left: 20, h: 300 },
    { k: 'amami', name: 'Slaheddine El Amami', note: '5 dinars · 2022', nameAr: 'صلاح الدين العمامي', noteAr: '5 دنانير · 2022', top: 1, left: 94, h: 280 },
    { k: 'bourguiba-young', name: 'Habib Bourguiba, young', note: 'the first notes, 1958 – 1973', nameAr: 'الحبيب بورقيبة شابًا', noteAr: 'الأوراق الأولى، 1958 – 1973', top: 22, left: 74, h: 280 },
    { k: 'chebbi30', name: 'Abou El Kacem Chebbi', note: '30 dinars · 1997', nameAr: 'أبو القاسم الشابي', noteAr: '30 دينارًا · 1997', top: 20, left: 105, h: 300 },
    { k: 'nouira', name: 'Hedi Nouira', note: '50 dinars · 2022', nameAr: 'الهادي نويرة', noteAr: '50 دينارًا · 2022', top: 30, left: 10, h: 270 },
    { k: 'tawhida', name: 'Tawhida Ben Cheikh', note: '10 dinars · 2020', nameAr: 'توحيدة بن الشيخ', noteAr: '10 دنانير · 2020', top: 25, left: 30, h: 250 },
    { k: 'chebbi10', name: 'Abou El Kacem Chebbi', note: '10 dinars · 2013', nameAr: 'أبو القاسم الشابي', noteAr: '10 دنانير · 2013', top: 20, left: 60, h: 240 },
    { k: 'khaldoun', name: 'Ibn Khaldoun', note: '10 dinars · 1994', nameAr: 'ابن خلدون', noteAr: '10 دنانير · 1994', top: 40, left: 55, h: 240 },
    { k: 'bourguiba-old', name: 'Habib Bourguiba, older', note: 'notes of the 1970s and 80s', nameAr: 'الحبيب بورقيبة في سنّ متقدّمة', noteAr: 'أوراق السبعينيات والثمانينيات', top: 30, left: 87, h: 280 },
    { k: 'elissa', name: 'Elissa (Dido)', note: '10 dinars · 2005', nameAr: 'عليسة (ديدون)', noteAr: '10 دنانير · 2005', top: 50, left: 70, h: 220, base: 0 },
    { k: 'hached', name: 'Farhat Hached', note: '20 dinars · 2017', nameAr: 'فرحات حشاد', noteAr: '20 دينارًا · 2017', top: 46, left: 40, h: 250, base: 2.5 },
    { k: 'kheireddine', name: 'Kheireddine Pacha', note: '20 dinars · 2011', nameAr: 'خير الدين باشا', noteAr: '20 دينارًا · 2011', top: 40, left: 15, h: 300, base: 0 },
    { k: 'rachiq', name: 'Ibn Rachiq', note: '50 dinars · 2011', nameAr: 'ابن رشيق', noteAr: '50 دينارًا · 2011', top: 45, left: 90, h: 250, base: 0 },
  ];
  // The front row (faces with `base`) sits on one flat baseline; `base` is the transparent strip under the drawing, in px.
  const BASELINE = 588, CANVAS_H = 900;
  const FACES = FACES_RAW.map((f) => ({
    ...f,
    left: CX + (f.left - CX) * TIGHT_X,
    top: f.base != null ? ((BASELINE - f.h + f.base) / CANVAS_H) * 100 : f.top * TIGHT_Y,
  }));

  // composition bounds on the canvas, used to scale it to the screen width
  const COMP_W = 960, COMP_H = 600, COMP_CX = 699;
  let stageW = COMP_W;
  // On laptops the whole title (heading + portraits + caption) should fit the screen height too.
  let vh = 900, headH = 200, capH = 40, topOffset = 0;
  const CHROME = 110;   // borders, gaps and padding around the portraits
  $: fitH = Math.max(260, vh - topOffset - headH - capH - CHROME);
  $: s = stageW > 640 ? Math.min(1, stageW / COMP_W, fitH / COMP_H) : Math.min(1, stageW / COMP_W);

  let hovered = null;   // index under the pointer / focused (faces only reveal on hover, tap or focus)
  $: shown = hovered;

  // ---- pixel-accurate hit testing: is the pointer over an opaque part of a face? ----
  const masks = [];     // { w, h, a: Uint8ClampedArray } per face (small alpha maps)
  const els = [];
  function alphaAt(i, x, y) {
    const m = masks[i], el = els[i];
    if (!m || !el) return 0;
    const r = el.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return 0;
    const u = Math.min(m.w - 1, Math.floor(((x - r.left) / r.width) * m.w));
    const v = Math.min(m.h - 1, Math.floor(((y - r.top) / r.height) * m.h));
    return m.a[(v * m.w + u) * 4 + 3];
  }
  function faceAt(x, y) {
    if (hovered != null && alphaAt(hovered, x, y) > 40) return hovered;   // the lifted face is on top
    for (let i = FACES.length - 1; i >= 0; i--) if (alphaAt(i, x, y) > 40) return i;
    return null;
  }

  function onMove(e) {
    if (e.pointerType !== 'mouse') return;
    hovered = faceAt(e.clientX, e.clientY);
  }
  function onTap(e) {
    if (e.pointerType === 'mouse') return;
    const i = faceAt(e.clientX, e.clientY);
    hovered = i === hovered ? null : i;
  }

  let tpEl;
  onMount(() => {
    // space above the title when the page first opens (site menu, page margin), at most 140px
    topOffset = Math.min(140, Math.max(0, tpEl.getBoundingClientRect().top + window.scrollY));
    // alpha maps from the drawn portraits (same size as the real ones)
    FACES.forEach((f, i) => {
      const img = new Image();
      img.onload = () => {
        const w = 90, h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);
        masks[i] = { w, h, a: ctx.getImageData(0, 0, w, h).data };
      };
      img.src = src(f.k + '-d');
      new Image().src = src(f.k + '-r');          // preload the real faces so the reveal is instant
    });

  });
</script>

<svelte:window bind:innerHeight={vh} />

<header class="tp" class:real={$realNotes} bind:this={tpEl} style="--zellige:{zellige}; --frieze:{frieze}; --star:{star};">
  <div class="band top" aria-hidden="true"></div>

  <div class="heading" bind:clientHeight={headH}>
    <span class="rosette" aria-hidden="true"></span>
    <p class="kicker">{$t('tpKicker')}</p>
    <h1 lang="en" dir="ltr">What Can Tunisia's Banknotes <span>Tell You?</span></h1>
    <p class="sub">{$pick("Know Tunisia's history through its banknotes", 'اعرف تاريخ تونس من خلال أوراقها النقدية')}</p>
    <p class="byline">{$t('byline')}</p>
  </div>

  <div class="stage" bind:clientWidth={stageW} style="height:{COMP_H * s}px" style:cursor={hovered != null ? "pointer" : "default"}
       on:pointermove={onMove} on:pointerleave={() => (hovered = null)} on:pointerdown={onTap}>
    <div class="canvas" style="transform: scale({s}) translateX(-{COMP_CX}px)">
      {#each FACES as f, i}
        <button type="button" class="face" bind:this={els[i]}
                class:on={shown === i} class:dim={shown != null && shown !== i}
                style="top:{f.top}%; left:{f.left}%; z-index:{shown === i ? 60 : i + 1}"
                aria-label={`${$pick(f.name, f.nameAr)}, ${$pick(f.note, f.noteAr)}`} tabindex="0"
                on:focus={() => (hovered = i)} on:blur={() => (hovered = null)}>
          <img class="d" src={src(f.k + '-d')} alt="" style="height:{f.h}px" draggable="false" />
          <img class="r" src={src(f.k + '-r')} alt="" style="height:{f.h}px" draggable="false" />
        </button>
      {/each}
    </div>
  </div>

  <div class="caption" aria-live="polite" bind:clientHeight={capH}>
    {#key shown}
      {#if shown != null}
        <p in:fade={{ duration: 200 }}><b>{$pick(FACES[shown].name, FACES[shown].nameAr)}</b><span>{$pick(FACES[shown].note, FACES[shown].noteAr)}</span></p>
      {:else}
        <p class="hint" in:fade={{ duration: 200 }}><span class="h-mouse">{$t('tpHint')}</span><span class="h-touch">{$t('tpHintTouch')}</span></p>
      {/if}
    {/key}
  </div>

  <div class="band bottom" aria-hidden="true"></div>
</header>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap');
  @font-face {
    font-family: 'HacenSaudi';
    src: url('../Assets/Fonts/Hacen Saudi Arabia.ttf') format('truetype');
    font-display: swap;
  }

  .tp {
    position: relative;
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0;           /* the bottom band is the title's last edge: no tiles below it */
    overflow: hidden;
    text-align: center;
    font-family: Quicksand, sans-serif;
    color: #3D2A22;
    background: var(--tn-paper, #FAF3E8);   /* covers the page pattern so the title's own zellige is the only one */
  }
  /* faint zellige wall behind everything, fading out towards the centre */
  .tp::before {
    content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-image: var(--zellige); background-size: 128px 128px; opacity: .13;
    -webkit-mask: radial-gradient(ellipse 70% 65% at 50% 55%, transparent 35%, #000 85%);
            mask: radial-gradient(ellipse 70% 65% at 50% 55%, transparent 35%, #000 85%);
  }
  .band { position: relative; z-index: 1; height: 18px; background-image: var(--frieze); background-size: 36px 18px; background-repeat: repeat-x; }
  .band.top { margin-bottom: 1rem; }
  .band.bottom { margin-top: .6rem; }

  .heading { position: relative; z-index: 2; padding: 0 1rem; }
  .rosette {
    display: block; width: 34px; height: 34px; margin: 0 auto .4rem;
    background-image: var(--star); background-size: contain; background-repeat: no-repeat;
    animation: spin 40s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .kicker { margin: 0; font-size: .78rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: #B5523B; }
  h1 {
    margin: .25rem 0 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 800;
    font-size: clamp(1.8rem, 4.4vw, 3.3rem); line-height: 1.08; color: #1E3F5C;
  }
  h1 span { color: #1E5B8C; font-style: italic; font-weight: 600; }
  .byline { margin: .35rem 0 0; font-size: .85rem; font-weight: 600; color: rgba(61, 90, 115, .75); }
  .sub { margin: .35rem 0 0; font-size: clamp(.92rem, 1.6vw, 1.08rem); font-weight: 700; color: #3D5A73; letter-spacing: .02em; }

  /* ---- portraits ---- */
  .stage { position: relative; z-index: 1; width: 100%; max-width: 960px; margin: .6rem auto 0; touch-action: manipulation; }
  .canvas { position: absolute; top: 0; left: 50%; width: 1000px; height: 900px; transform-origin: 0 0; }
  .face {
    position: absolute; display: block; padding: 0; border: 0; background: none; cursor: pointer;
    pointer-events: none;              /* hits are decided by the opaque pixels, see faceAt() */
    transition: transform .45s cubic-bezier(.2, .8, .2, 1), filter .45s, opacity .45s;
    transform-origin: 50% 100%;
  }
  .face:focus-visible { outline: 3px solid #1E5B8C; outline-offset: 4px; border-radius: 8px; }
  .face img { display: block; width: auto; user-select: none; -webkit-user-drag: none; transition: opacity .5s; }
  .face .r { position: absolute; inset: 0; opacity: 0; }
  .face.on { transform: translateY(-10px) scale(1.06); filter: drop-shadow(0 10px 14px rgba(30, 63, 92, .35)); }
  .face.on .r { opacity: 1; }
  .face.on .d { opacity: 0; }
  .tp.real .face .r { opacity: 1; }
  .tp.real .face .d { opacity: 0; }
  .face.dim { filter: saturate(.55) brightness(1.04); }   /* others stay fully opaque */

  .caption { position: relative; z-index: 2; min-height: 2.4rem; display: grid; place-items: center; padding: 0 1rem; }
  .caption p { grid-area: 1 / 1; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; align-items: baseline; gap: .2rem .6rem; }
  .caption b { font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #1E3F5C; }
  .caption span { font-size: .9rem; font-weight: 700; color: #B5523B; }
  .h-touch { display: none; }
  .caption .hint { font-size: .85rem; font-weight: 600; color: rgba(61, 42, 34, .65); }

  @media (hover: none) {
    .h-mouse { display: none; }
    .h-touch { display: inline !important; }
  }
  @media (max-width: 640px) {
    .band.top { margin-bottom: 1rem; }
    .kicker { letter-spacing: .2em; font-size: .7rem; }
    .caption b { font-size: 1.05rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rosette { animation: none; }
    .face, .face img { transition-duration: .01ms; }
  }
</style>
