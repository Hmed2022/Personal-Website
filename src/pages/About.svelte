<script>
  // "More about me": life outside the projects. Volunteering + the NBA arena bucket list.
  // All content lives in src/components/aboutData.js. Same palette as HomeNew.svelte.
  import { fade, scale } from 'svelte/transition';
  import PageTransitions from '../components/PageTransitions.svelte';
  import Footer from '../components/footer.svelte';
  import { volunteering, arenas } from '../components/aboutData.js';

  const visitedCount = arenas.filter((a) => a.visited).length;
  let conf = 'All';
  $: shown = arenas.filter((a) => conf === 'All' || a.conf === conf);
  $: confVisited = shown.filter((a) => a.visited).length;

  // Volunteering section is switched off for now; set to true to bring it back (content stays in aboutData.js).
  const SHOW_VOLUNTEERING = false;
  const featuredVol = volunteering.filter((v) => v.featured);
  const otherVol = volunteering.filter((v) => !v.featured);
  const CATS = {
    'Sport': ['⚽', '#1E5B8C'],
    'Music & arts': ['🎶', '#B5523B'],
    'Fitness': ['🏋️', '#D9A441'],
    'Community': ['🤝', '#4E8A5E']
  };
  const catIcon = (c) => (CATS[c] || ['🙌'])[0];
  const catColor = (c) => (CATS[c] || [, '#5E6B70'])[1];

  // Lightbox: a list of { photo, title, sub } and the index being shown.
  let gallery = null;
  let gi = 0;
  $: open = gallery ? gallery[gi] : null;
  const openGallery = (photos, i = 0) => { gallery = photos.map((p) => ({ photo: p.src, title: p.caption })); gi = i; };
  const step = (d) => { if (gallery) gi = (gi + d + gallery.length) % gallery.length; };
  const close = () => (gallery = null);
  const onKey = (e) => {
    if (!gallery) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  };
</script>

<svelte:head>
  <title>More about me · Ahmed Bendaly</title>
  <meta name="description" content="Volunteering, the outdoors and an NBA arena bucket list: Ahmed Bendaly away from the keyboard." />
</svelte:head>
<svelte:window on:keydown={onKey} />

<div class="about-page">
  <PageTransitions>
    <!-- ===== intro ===== -->
    <section class="intro">
      <p class="hi">Away from the keyboard</p>
      <h1>A <span class="mark">stranger</span>, until I'm not.</h1>
      <p class="lede">
        Certified nerd: manga
        (<a class="op" href="https://www.viz.com/one-piece" target="_blank" rel="noopener noreferrer">One Piece<svg class="straw-hat" viewBox="0 0 40 22" aria-hidden="true"><ellipse cx="20" cy="17" rx="19" ry="4.2" fill="#F2C94C" stroke="#8A5A1E" stroke-width="1.2"/><path d="M9 16.5C9 7 13 3 20 3s11 4 11 13.5Z" fill="#F2C94C" stroke="#8A5A1E" stroke-width="1.2"/><path d="M9.3 13.2h21.4v3.3H9.3Z" fill="#D7263D"/><path d="M13 7.5c2-1 4-1.4 7-1.4M14 10.5c3-.8 8-.8 12 0" stroke="#C9A23A" stroke-width=".8" fill="none"/></svg></a>,
        <a href="https://www.viz.com/hunter-x-hunter" target="_blank" rel="noopener noreferrer">HxH</a>), non-fiction
        books, and an arguably unhealthy number of
        <a href="https://www.catan.com/" target="_blank" rel="noopener noreferrer">Catan</a> games. I play soccer and
        basketball (knees weak, arms are heavy, <span class="d313">313!</span>) and hit the gym, but walking is my
        favorite hobby. It clears my head, and more than a few of my projects started somewhere around mile two.
      </p>
      <p class="lede">
        I'm drawn to new things: a city I've never explored, a subject I know nothing about, or a room full
        of strangers at a volunteering gig. I'm usually starting from scratch, and that's exactly what I
        enjoy about it. There's something exciting about being a stranger, figuring things out, and seeing
        where curiosity takes you.
      </p>
      <!-- "On this page" buttons (Volunteering · NBA bucket list) removed for now -->
    </section>

    <!-- ===== volunteering (hidden for now: SHOW_VOLUNTEERING) ===== -->
    {#if SHOW_VOLUNTEERING}
    <section class="vol" id="volunteering">
      <h2 class="brush gold"><span>Volunteering</span></h2>
      <p class="vol-intro">{volunteering.length} events so far, and plenty of new friends from each one.</p>

      <!-- featured roles: photo mosaic + story -->
      {#each featuredVol as v}
        <article class="feat-vol">
          {#if v.photos?.length}
            <div class="mosaic" class:few={v.photos.length < 5}>
              {#each v.photos.slice(0, 5) as p, i}
                <button type="button" class="tile" on:click={() => openGallery(v.photos, i)} aria-label="Open photo: {p.caption}">
                  <img src={p.src} alt="" loading="lazy" />
                  {#if i === 4 && v.photos.length > 5}<span class="more">+{v.photos.length - 5}</span>{/if}
                </button>
              {/each}
            </div>
          {/if}
          <div class="feat-body">
            <div class="chips">
              {#if v.category}<span class="chip cat" style="--c:{catColor(v.category)}">{catIcon(v.category)} {v.category}</span>{/if}
              {#if v.when}<span class="chip">{v.when}</span>{/if}
            </div>
            <h3>{v.org}</h3>
            <p class="role">{v.role}</p>
            {#if v.where}<p class="where">📍 {v.where}</p>{/if}
            <p class="summary">{v.summary}</p>
            {#if v.photos?.length}<button type="button" class="link-btn" on:click={() => openGallery(v.photos, 0)}>See all {v.photos.length} photos →</button>{/if}
          </div>
        </article>
      {/each}

      <!-- everything else: compact cards -->
      {#if otherVol.length}
        <ul class="vol-grid">
          {#each otherVol as v}
            <li class="vol-card" style="--c:{catColor(v.category)}">
              <span class="icon" aria-hidden="true">{catIcon(v.category)}</span>
              <div class="chips">
                {#if v.category}<span class="chip cat">{v.category}</span>{/if}
                {#if v.when}<span class="chip">{v.when}</span>{/if}
              </div>
              <h3>{v.org}</h3>
              <p class="role">{v.role}</p>
              {#if v.where}<p class="where">📍 {v.where}</p>{/if}
              {#if v.summary}<p class="summary">{v.summary}</p>{/if}
              {#if v.photos?.length}<button type="button" class="link-btn" on:click={() => openGallery(v.photos, 0)}>Photos →</button>{/if}
              {#if v.link}<a class="ext" href={v.link} target="_blank" rel="noopener noreferrer">About the event ↗</a>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>
    {/if}

    <!-- ===== NBA bucket list ===== -->
    <section class="arenas" id="arenas">
      <h2 class="brush red"><span>NBA bucket list</span></h2>
      <p class="arena-intro">
        I've been an NBA fan for as long as I can remember, so one of my life goals is to watch a game in
        every NBA arena. Here's how far I've got.
      </p>

      <div class="progress" role="img" aria-label="{visitedCount} of {arenas.length} arenas visited">
        <div class="bar"><span style="width:{(visitedCount / arenas.length) * 100}%"></span></div>
        <p><strong>{visitedCount}</strong> / {arenas.length} arenas</p>
      </div>

      <div class="tabs" role="tablist" aria-label="Conference">
        {#each ['All', 'East', 'West'] as c}
          <button type="button" role="tab" aria-selected={conf === c} class:active={conf === c} on:click={() => (conf = c)}>{c}</button>
        {/each}
      </div>
      {#if conf !== 'All'}<p class="conf-count">{confVisited} of {shown.length} in the {conf}</p>{/if}

      <ul class="grid">
        {#each shown as a (a.name)}
          <li>
            <button
              type="button"
              class="team"
              class:visited={a.visited}
              disabled={!a.photo}
              title={a.visited ? `${a.name} · ${a.arena}` : `${a.arena}: still to visit`}
              on:click={() => { gallery = [{ photo: a.photo, title: a.name, sub: a.arena }]; gi = 0; }}
            >
              <img src={a.logo} alt="" loading="lazy" />
              <span class="label">
                <span class="tname">{a.name}</span>
                <span class="tag">{a.visited ? '✓ Visited' : 'Not yet'}</span>
              </span>
            </button>
          </li>
        {/each}
      </ul>
      <p class="hint">Tap a team I've visited to see my photo from the arena.</p>
    </section>

    <p class="contact">Fancy a game, a hike or a volunteering gig? <a href="mailto:ahmedben@umich.edu">Say hello</a>.</p>
  </PageTransitions>
</div>

{#if open}
  <div class="lightbox" transition:fade|local={{ duration: 150 }} on:click|self={close} on:keydown={onKey} role="dialog" aria-modal="true" aria-label={open.title}>
    <figure transition:scale|local={{ duration: 180, start: 0.95 }}>
      <img src={open.photo} alt={open.title} />
      {#if gallery.length > 1}
        <button type="button" class="nav prev" on:click={() => step(-1)} aria-label="Previous photo">‹</button>
        <button type="button" class="nav next" on:click={() => step(1)} aria-label="Next photo">›</button>
      {/if}
      <button type="button" class="close" on:click={close} aria-label="Close">×</button>
      <figcaption><strong>{open.title}</strong>{#if open.sub}<span>{open.sub}</span>{/if}{#if gallery.length > 1}<span class="count">{gi + 1} / {gallery.length}</span>{/if}</figcaption>
    </figure>
  </div>
{/if}

<Footer />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
  @font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }

  .about-page {
    --blue: #1E5B8C; --terra: #B5523B; --gold: #D9A441; --ink: #2E3A40; --muted: #5E6B70; --paper: #FBF6EE;
    font-family: 'Jost', sans-serif; color: var(--ink);
  }
  a { color: var(--blue); text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
  a:hover { color: var(--terra); }

  /* intro */
  .intro { max-width: 46rem; margin: 0 auto; padding: 2.5rem 1.5rem 3rem; text-align: center; }
  .hi { margin: 0 0 .4rem; font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.7rem; color: var(--terra); }
  h1 { margin: 0; font-weight: 500; font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.2; }
  .mark { position: relative; white-space: nowrap; color: var(--blue); }
  .mark::after { content: ''; position: absolute; left: -.1em; right: -.1em; bottom: .05em; height: .32em; z-index: -1; background: var(--gold); opacity: .45; border-radius: 3px; transform: skewX(-8deg); }
  /* "313" (Detroit) badge in Pistons red and royal blue; swaps every 3 s like "Go Blue!" on the home page */
  .d313 {
    --pred: #C8102E; --pblue: #1D42BA;
    display: inline-block; margin: 0 .2rem 0 .25rem; padding: 0 .45em .05em; border-radius: 6px;
    font-weight: 700; font-size: .92em; color: #FFFFFF; letter-spacing: .03em;
    background: var(--pred); box-shadow: 2px 2px 0 var(--pblue); transform: rotate(-3deg);
    animation: d313 6s ease-in-out infinite;
  }
  @keyframes d313 {
    0%, 45%  { background: var(--pred);  box-shadow: 2px 2px 0 var(--pblue); }
    50%, 95% { background: var(--pblue); box-shadow: 2px 2px 0 var(--pred); }
    100%     { background: var(--pred);  box-shadow: 2px 2px 0 var(--pblue); }
  }
  /* little straw hat after "One Piece"; tips its brim on hover */
  .straw-hat { display: inline-block; width: 1.25em; height: .7em; margin-left: .2em; vertical-align: .05em; transform: rotate(-12deg); transform-origin: 30% 80%; transition: transform .25s; }
  .op:hover .straw-hat, .op:focus-visible .straw-hat { transform: rotate(8deg) translateY(-2px); }
  .lede { margin: 1.2rem auto 0; font-size: 1.12rem; font-weight: 300; line-height: 1.7; color: var(--muted); }

  /* headings */
  h2.brush { margin: 0 0 1.6rem; text-align: center; }
  h2.brush span {
    display: inline-block; padding: .15em .9em .2em; font-family: 'dkzonnig', 'Jost', sans-serif; font-weight: 400;
    font-size: 2.1rem; color: #FFFFFF; background: var(--blue);
    clip-path: polygon(2% 12%, 30% 4%, 64% 9%, 98% 2%, 100% 46%, 97% 92%, 62% 98%, 30% 93%, 1% 99%, 3% 55%);
  }
  h2.brush.gold span { background: var(--gold); }
  h2.brush.red span { background: var(--terra); }

  /* volunteering */
  .vol { background: var(--paper); padding: 3rem 1.5rem; scroll-margin-top: 1rem; }
  .vol > * { max-width: 1040px; margin-left: auto; margin-right: auto; }
  .vol-intro { margin-top: -.6rem; margin-bottom: 1.8rem; text-align: center; font-size: 1.1rem; font-weight: 300; color: var(--muted); }
  h3 { margin: 0; font-size: 1.35rem; font-weight: 500; line-height: 1.25; }
  .role { margin: .25rem 0 0; font-weight: 500; color: var(--ink); }
  .where { margin: .3rem 0 0; font-size: .95rem; color: var(--muted); }
  .summary { margin: .8rem 0 0; font-size: 1.02rem; font-weight: 300; line-height: 1.65; }
  .chips { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .7rem; }
  .chip { font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); background: rgba(46, 58, 64, .07); padding: .25rem .6rem; border-radius: 999px; }
  .chip.cat { color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); }
  .link-btn { margin-top: 1rem; padding: 0; border: 0; background: none; font: 600 1rem 'Jost', sans-serif; color: var(--blue); cursor: pointer; text-align: left; }
  .link-btn:hover { color: var(--terra); }

  .feat-vol {
    display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); margin-bottom: 1.6rem;
    background: #FFFFFF; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(46, 58, 64, .1);
  }
  .feat-body { display: flex; flex-direction: column; padding: 1.8rem; }
  .mosaic { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 4px; min-height: 340px; }
  .mosaic.few { grid-template-columns: repeat(2, 1fr); grid-template-rows: none; }
  .tile { position: relative; padding: 0; border: 0; background: #DDD; cursor: zoom-in; overflow: hidden; }
  .mosaic:not(.few) .tile:first-child { grid-row: span 2; }
  .tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .25s; }
  .tile:hover img { transform: scale(1.05); }
  .more { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(20, 26, 30, .55); color: #FFFFFF; font: 500 1.6rem 'Jost', sans-serif; }

  .vol-grid { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
  .vol-card {
    position: relative; display: flex; flex-direction: column; padding: 1.5rem 1.5rem 1.4rem;
    background: #FFFFFF; border-radius: 16px; border-top: 5px solid var(--c);
    box-shadow: 0 6px 20px rgba(46, 58, 64, .08); transition: transform .2s, box-shadow .2s;
  }
  .vol-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(46, 58, 64, .13); }
  .vol-card .icon { position: absolute; top: 1.1rem; right: 1.2rem; display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 50%; font-size: 1.3rem; background: color-mix(in srgb, var(--c) 14%, transparent); }
  .vol-card h3 { padding-right: 3rem; }
  .ext { margin-top: auto; padding-top: 1rem; font-size: .95rem; font-weight: 500; text-decoration: none; }

  /* arenas */
  .arenas { max-width: 1000px; margin: 0 auto; padding: 3.5rem 1.5rem 2rem; text-align: center; scroll-margin-top: 1rem; }
  .arena-intro { margin: 0 auto 1.5rem; max-width: 36rem; font-size: 1.1rem; font-weight: 300; line-height: 1.6; color: var(--muted); }
  .progress { display: flex; align-items: center; justify-content: center; gap: 1rem; max-width: 30rem; margin: 0 auto 1.5rem; }
  .bar { flex: 1; height: 12px; border-radius: 999px; background: rgba(181, 82, 59, .15); overflow: hidden; }
  .bar span { display: block; height: 100%; background: var(--terra); border-radius: 999px; }
  .progress p { margin: 0; white-space: nowrap; color: var(--muted); }
  .progress strong { font-size: 1.5rem; color: var(--terra); }
  .tabs { display: inline-flex; gap: .3rem; padding: .3rem; border-radius: 999px; background: var(--paper); }
  .tabs button { font: 500 1rem 'Jost', sans-serif; padding: .4rem 1.2rem; border: 0; border-radius: 999px; background: none; color: var(--ink); cursor: pointer; }
  .tabs button.active { background: var(--terra); color: #FFFFFF; }
  .conf-count { margin: .7rem 0 0; color: var(--muted); }
  .grid { list-style: none; padding: 0; margin: 1.8rem 0 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: .9rem; }
  .team {
    position: relative; overflow: hidden;
    width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .35rem;
    padding: .8rem .6rem 1rem; border: 2px solid transparent; border-radius: 14px; background: #F3F1EE;
    font: inherit; color: var(--muted); cursor: default; transition: transform .15s, box-shadow .15s;
  }
  /* the logo PNGs have white (not transparent) backgrounds: multiply drops the white on any card colour */
  .team img { width: 150px; height: 150px; object-fit: contain; mix-blend-mode: multiply; filter: grayscale(1); opacity: .45; }
  .team.visited { background: #FFFFFF; border-color: rgba(181, 82, 59, .25); color: var(--ink); box-shadow: 0 4px 14px rgba(46, 58, 64, .08); }
  .team.visited img { filter: none; opacity: 1; }
  .team:not(:disabled) { cursor: zoom-in; }
  .team:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(46, 58, 64, .14); }
  .tname { font-size: .92rem; font-weight: 500; line-height: 1.25; }
  .tag { font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
  .team.visited .tag { color: var(--terra); }
  .label { display: flex; flex-direction: column; align-items: center; gap: .15rem; }
  /* with a mouse: just the logos; the team name slides up over the card on hover / keyboard focus.
     (Touch screens can't hover, so they keep the names visible under each logo.) */
  @media (hover: hover) {
    .label {
      position: absolute; left: 6px; right: 6px; bottom: 6px; padding: .4rem .4rem .45rem;
      border-radius: 10px; background: rgba(255, 255, 255, .95); box-shadow: 0 2px 10px rgba(46, 58, 64, .12);
      opacity: 0; transform: translateY(6px); transition: opacity .15s, transform .15s; pointer-events: none;
    }
    .team:hover .label, .team:focus-visible .label { opacity: 1; transform: none; }
  }
  .hint { margin: 1.2rem 0 0; font-size: .95rem; color: var(--muted); }

  .contact { margin: 1rem auto 3rem; padding: 0 1.5rem; text-align: center; font-size: 1.1rem; }

  /* lightbox */
  .lightbox { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1rem; background: rgba(20, 26, 30, .8); }
  figure { position: relative; margin: 0; max-width: min(900px, 100%); background: #FFFFFF; border-radius: 14px; overflow: hidden; }
  figure img { display: block; max-width: 100%; max-height: 75vh; margin: 0 auto; object-fit: contain; }
  figcaption { display: flex; flex-direction: column; gap: .15rem; padding: .8rem 1rem; font-family: 'Jost', sans-serif; color: #2E3A40; }
  figcaption span { color: #5E6B70; font-size: .95rem; }
  .nav { position: absolute; top: 40%; width: 2.6rem; height: 2.6rem; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .9); font-size: 1.4rem; cursor: pointer; }
  .nav.prev { left: .6rem; } .nav.next { right: .6rem; }
  .count { color: #5E6B70; font-size: .9rem; }
  .close { position: absolute; top: .5rem; right: .5rem; width: 2.2rem; height: 2.2rem; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .9); font-size: 1.5rem; line-height: 1; cursor: pointer; }

  @media (max-width: 820px) { .feat-vol { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 600px) {
    .feat-body { padding: 1.3rem; }
    .mosaic { min-height: 240px; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
    .team img { width: 110px; height: 110px; }
    h2.brush span { font-size: 1.8rem; }
  }
  @media (prefers-reduced-motion: reduce) { .tile img, .team, .vol-card, .label { transition: none; } .d313 { animation: none; } .straw-hat { transition: none; } }
</style>
