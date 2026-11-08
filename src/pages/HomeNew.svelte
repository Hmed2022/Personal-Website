<script>
  // New landing page (Home_old.svelte is kept). Headline + portrait first, a featured project,
  // a short About, then every project. One palette: blue, terracotta, gold on warm paper.
  import PageTransitions from '../components/PageTransitions.svelte';
  import ProjectsAnimated from '../components/ProjectsAnimated.svelte';
  import Footer from '../components/footer.svelte';
  import PhotoMe from '../assets/PhotoMe.svg';
  import { imageData } from '../components/images.js';

  // featured = a project marked `featured: true` in images.js, otherwise the top-ranked visible one
  const visible = imageData.filter((p) => p.show);
  const featured = visible.find((p) => p.featured) || visible.slice().sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))[0];
  const tags = (p) => (p.desc || '').split('|').map((s) => s.trim()).filter(Boolean);

  function toWork() {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<div class="home">
  <PageTransitions>
    <!-- ===== hero ===== -->
    <section class="hero">
      <div class="hero-text">
        <p class="hi">Hi, I'm Ahmed Bendaly</p>
        <h1>I turn data into <span class="mark">stories</span> about Tunisia, culture and sport.</h1>
        <p class="role">Data scientist and storyteller. I design and code interactive pieces, and you'll find a touch of my <a href="https://en.wikipedia.org/wiki/Tunisia" target="_blank" rel="noopener noreferrer">Tunisian</a> heritage in most of them.</p>
        <div class="cta">
          <button type="button" class="btn primary" on:click={toWork}>See my work ↓</button>
          <a class="btn ghost" href="mailto:ahmedben@umich.edu">Say hello</a>
        </div>
      </div>
      <div class="portrait-wrap">
        <a class="portrait" href="/#/leghreeb" aria-label="About Leghreeb, Ahmed's drawing">
          <span class="sun" aria-hidden="true"></span>
          <img src={PhotoMe} alt="Leghreeb: a hand-drawn portrait of Ahmed in a chechia" />
        </a>
        <!-- "this is Leghreeb" note + drawn arrow; always shown, and leads to the About Leghreeb page -->
        <a class="intro-note" href="/#/leghreeb">
          <span class="intro-text"><span class="l1">this is</span> Leghreeb <span class="ar" lang="ar">لغريب</span></span>
          <!-- drops down from under the text, curves right and stops short of the drawing -->
          <svg class="intro-arrow" viewBox="0 0 140 120" fill="none" aria-hidden="true">
            <path class="stroke" d="M30 4 C 26 52, 62 94, 116 96" />
            <path class="stroke head" d="M104 86 L 117 96 L 103 105" />
          </svg>
        </a>
      </div>
    </section>

    <!-- ===== featured ===== -->
    {#if featured}
      <section class="featured" aria-labelledby="feat-title">
        <h2 class="brush"><span>Featured</span></h2>
        <!-- the title is the one link and stretches over the card, so the description's own links
             (e.g. The Pudding) aren't nested inside another link -->
        <article class="feat-card">
          <span class="feat-img"><img src={featured.url} alt={featured.alt || `Preview of ${featured.title}`} /></span>
          <div class="feat-body">
            <span class="feat-tags">{#each tags(featured) as t}<span>{t}</span>{/each}{#if featured.lang}<span class="lang">{featured.lang}</span>{/if}</span>
            <h3 class="feat-title" id="feat-title"><a class="feat-link" href={featured.href}>{featured.title}</a></h3>
            <p class="feat-desc">{@html featured.description}</p>
            <span class="feat-go" aria-hidden="true">Explore the story →</span>
          </div>
        </article>
      </section>
    {/if}

    <!-- ===== about ===== -->
    <section class="about">
      <h2 class="brush gold"><span>About me</span></h2>
      <p>I'm Ahmed Bendaly. I'm interested in sports, weird stats and all things Tunisian, and I like making numbers feel personal: something you play with, not just read.</p>
      <p>I build my projects in Svelte and D3, often in both Arabic and English.</p>
      <p class="umich">I'm a proud <span class="wolverine">Wolverine</span>: I got my master's from the <a href="https://umdearborn.edu" target="_blank" rel="noopener noreferrer">University of Michigan–Dearborn</a>, and I currently work at <a href="https://www.michiganmedicine.org" target="_blank" rel="noopener noreferrer">Michigan Medicine</a>. <span class="go-blue">Go Blue!</span></p>
      <p>Away from the screen I love being outdoors and meeting new people, and volunteering brings the two together. I'm also slowly working my way through every NBA arena. <a href="/#/about">More about me →</a></p>
      <p class="contact">Want to talk? <a href="mailto:ahmedben@umich.edu">ahmedben@umich.edu</a></p>
    </section>

    <!-- ===== all projects ===== -->
    <section class="work" id="work">
      <h2 class="brush red"><span>Projects</span></h2>
      <ProjectsAnimated />
    </section>
  </PageTransitions>
</div>
<Footer />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&text=%D9%84%D8%BA%D8%B1%D9%8A%D8%A8&display=swap');
  @font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }

  .home {
    --blue: #1E5B8C; --terra: #B5523B; --gold: #D9A441; --ink: #2E3A40; --muted: #5E6B70; --paper: #FBF6EE;
    font-family: 'Jost', sans-serif; color: var(--ink);
  }
  a { color: var(--blue); text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
  a:hover { color: var(--terra); }

  /* ---------- hero ---------- */
  .hero {
    display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 2.5rem; align-items: center;
    max-width: 1100px; margin: 0 auto; padding: 4.5rem 1.5rem 3.5rem; box-sizing: border-box; min-height: min(86vh, 760px);
  }
  .hi { margin: 0 0 .4rem; font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.8rem; color: var(--terra); }
  h1 { margin: 0; font-weight: 500; font-size: clamp(1.9rem, 3.6vw, 2.9rem); line-height: 1.2; letter-spacing: -.01em; color: var(--ink); }
  .mark { position: relative; white-space: nowrap; color: var(--blue); }
  .mark::after { content: ''; position: absolute; left: -.1em; right: -.1em; bottom: .05em; height: .32em; z-index: -1; background: var(--gold); opacity: .45; border-radius: 3px; transform: skewX(-8deg); }
  .role { margin: 1.2rem 0 0; max-width: 34rem; font-size: 1.12rem; font-weight: 300; line-height: 1.6; color: var(--muted); }
  .cta { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.8rem; }
  .btn { display: inline-flex; align-items: center; font: 500 1rem 'Jost', sans-serif; border-radius: 999px; padding: .65rem 1.4rem; cursor: pointer; text-decoration: none; transition: transform .15s, background .15s; }
  .btn:hover { transform: translateY(-2px); }
  .btn.primary { background: var(--blue); color: #FFFFFF; border: 2px solid var(--blue); }
  .btn.primary:hover { background: #17486F; color: #FFFFFF; }
  .btn.ghost { background: transparent; color: var(--blue); border: 2px solid var(--blue); }

  .portrait { position: relative; display: grid; place-items: center; justify-self: center; width: min(320px, 100%); height: min(320px, 80vw); }
  .sun { position: absolute; inset: 6%; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #F6E2B3, #EFCF8C); }
  .portrait img { position: relative; display: block; height: 300px; width: 220px; max-width: 100%; object-fit: contain; animation: rock 3s ease-in-out infinite; transform-origin: 50% 85%; }
  .portrait:hover img { animation-play-state: paused; }
  @keyframes rock { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }

  /* ---------- "this is Leghreeb" note ---------- */
  .portrait-wrap { position: relative; justify-self: center; width: min(320px, 100%); }
  .intro-note { position: absolute; top: -1.2rem; right: 78%; z-index: 2; display: flex; flex-direction: column; align-items: flex-end; text-decoration: none; }
  /* note + arrow turn blue when hovering the note itself or the drawing (both open About Leghreeb) */
  .intro-note:hover .intro-text, .intro-note:focus-visible .intro-text,
  .portrait:hover ~ .intro-note .intro-text, .portrait:focus-visible ~ .intro-note .intro-text { color: var(--blue); }
  .intro-note:hover .stroke, .intro-note:focus-visible .stroke,
  .portrait:hover ~ .intro-note .stroke, .portrait:focus-visible ~ .intro-note .stroke { stroke: var(--blue); }
  .intro-text {
    display: block; transition: color .15s;
    margin: 0 0 -.2rem; white-space: nowrap; transform: rotate(-6deg);
    font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.7rem; color: var(--terra);
  }
  .intro-text .ar { font-family: 'Reem Kufi', 'Geeza Pro', 'Noto Kufi Arabic', sans-serif; font-weight: 600; font-size: 1.35rem; margin-inline-start: .2rem; }
  .intro-arrow { width: 140px; height: 120px; margin-top: .2rem; margin-inline-end: -1.2rem; overflow: visible; }
  .intro-arrow .stroke { stroke: var(--terra); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; transition: stroke .15s; stroke-dasharray: 160; stroke-dashoffset: 160; animation: draw .9s ease-out .3s forwards; }
  .intro-arrow .head { animation-delay: 1.1s; animation-duration: .35s; }
  @keyframes draw { to { stroke-dashoffset: 0; } }

  /* ---------- section headings: brush strokes in the palette ---------- */
  h2.brush { margin: 0 0 1.4rem; text-align: center; }
  h2.brush span {
    display: inline-block; padding: .15em .9em .2em; font-family: 'dkzonnig', 'Jost', sans-serif; font-weight: 400;
    font-size: 2.1rem; color: #FFFFFF; background: var(--blue);
    clip-path: polygon(2% 12%, 30% 4%, 64% 9%, 98% 2%, 100% 46%, 97% 92%, 62% 98%, 30% 93%, 1% 99%, 3% 55%);
  }
  h2.brush.gold span { background: var(--gold); }
  h2.brush.red span { background: var(--terra); }

  /* ---------- featured ---------- */
  .featured { background: var(--paper); padding: 3rem 1.5rem; }
  .feat-card {
    position: relative; cursor: pointer;
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); max-width: 1000px; margin: 0 auto;
    border-radius: 16px; overflow: hidden; background: #FFFFFF; color: inherit; text-decoration: none;
    box-shadow: 0 10px 30px rgba(46, 58, 64, .12); transition: transform .2s, box-shadow .2s;
  }
  .feat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(46, 58, 64, .18); }
  .feat-img { display: block; background: #EEE; }
  .feat-img img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .feat-body { display: flex; flex-direction: column; gap: .7rem; padding: 1.8rem; }
  .feat-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
  .feat-tags span { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--terra); background: rgba(181, 82, 59, .1); padding: .2rem .55rem; border-radius: 999px; }
  .feat-tags .lang { color: var(--blue); background: rgba(30, 91, 140, .1); }
  .feat-title { margin: 0; font-size: 1.6rem; font-weight: 500; line-height: 1.25; }
  .feat-link { color: inherit; text-decoration: none; }
  .feat-link::after { content: ''; position: absolute; inset: 0; z-index: 1; }
  .feat-link:focus-visible { outline: none; }
  .feat-card:focus-within { outline: 3px solid var(--blue); outline-offset: 3px; }
  .feat-desc { margin: 0; }
  .feat-desc :global(a) { position: relative; z-index: 2; }
  .feat-desc { font-weight: 300; line-height: 1.6; color: var(--muted); }
  .feat-desc :global(a) { color: var(--blue); }
  .feat-go { margin-top: auto; font-weight: 600; color: var(--blue); }

  /* ---------- about ---------- */
  .about { max-width: 42rem; margin: 0 auto; padding: 3.5rem 1.5rem 1rem; }
  .about p { margin: 0 0 1rem; font-size: 1.1rem; font-weight: 300; line-height: 1.7; }
  .about .contact { font-weight: 400; }
  /* Michigan maize and blue */
  .umich { --maize: #FFCB05; --mblue: #00274C; }
  .wolverine { position: relative; z-index: 0; white-space: nowrap; font-weight: 500; color: var(--mblue); }
  .wolverine::after { content: ''; position: absolute; left: -.08em; right: -.08em; bottom: .08em; height: .38em; z-index: -1; background: var(--maize); border-radius: 2px; transform: skewX(-8deg); }
  .umich a { color: var(--mblue); text-decoration-color: var(--maize); text-decoration-thickness: 2px; }
  .umich a:hover { color: var(--blue); }
  .go-blue {
    display: inline-block; margin-left: .15rem; padding: .05em .55em .1em; border-radius: 6px;
    background: var(--mblue); color: var(--maize); font-weight: 600; letter-spacing: .02em;
    transform: rotate(-2deg); box-shadow: 2px 2px 0 var(--maize);
    animation: go-blue 6s ease-in-out infinite;
  }
  /* swaps between blue-on-maize and maize-on-blue every 3 seconds */
  @keyframes go-blue {
    0%, 45%   { background: var(--mblue); color: var(--maize); box-shadow: 2px 2px 0 var(--maize); }
    50%, 95%  { background: var(--maize); color: var(--mblue); box-shadow: 2px 2px 0 var(--mblue); }
    100%      { background: var(--mblue); color: var(--maize); box-shadow: 2px 2px 0 var(--maize); }
  }

  /* ---------- projects ---------- */
  .work { padding: 2.5rem 0 1rem; scroll-margin-top: 1rem; }

  /* ---------- phones ---------- */
  @media (max-width: 780px) {
    .hero { grid-template-columns: minmax(0, 1fr); gap: 1.2rem; padding: 1.8rem 1.2rem 2rem; text-align: center; }
    .portrait-wrap { order: -1; width: auto; }
    .portrait { width: 190px; height: 190px; }
    /* phones: the note sits to the right of the drawing and the arrow points back left */
    .intro-note { top: .2rem; right: auto; left: 74%; align-items: flex-start; }
    .intro-text { line-height: 1.05; font-size: 1.3rem; transform: rotate(5deg); }
    .intro-text .l1 { display: block; }
    .intro-text .ar { display: block; margin: .1rem 0 0; }
    .intro-text .ar { font-size: 1.1rem; }
    .intro-arrow { width: 84px; height: 72px; margin-top: 0; margin-inline-end: 0; margin-inline-start: -.2rem; transform: scaleX(-1); }
    .portrait img { height: 180px; width: 135px; }
    .role { margin-inline: auto; }
    .cta { justify-content: center; }
    .feat-card { grid-template-columns: minmax(0, 1fr); }
    .feat-body { padding: 1.3rem; }
    h2.brush span { font-size: 1.8rem; }
  }
  @media (prefers-reduced-motion: reduce) { .btn, .feat-card { transition: none; } .portrait img { animation: none; } .intro-arrow .stroke { animation: none; stroke-dashoffset: 0; } .go-blue { animation: none; } }
</style>
