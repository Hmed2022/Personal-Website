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

<svelte:head>
  <title>Ahmed Bendaly · Data stories</title>
  <meta name="description" content="Ahmed Bendaly turns data into visual stories about Tunisia, culture and sport." />
  <meta property="og:title" content="Ahmed Bendaly · Data stories" />
  <meta property="og:description" content="Interactive data stories about Tunisia, culture and sport." />
</svelte:head>

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
      <a class="portrait" href="https://www.instagram.com/leghreeb/" target="_blank" rel="noopener noreferrer" aria-label="Ahmed on Instagram">
        <span class="sun" aria-hidden="true"></span>
        <img src={PhotoMe} alt="Hand-drawn portrait of Ahmed" />
      </a>
    </section>

    <!-- ===== featured ===== -->
    {#if featured}
      <section class="featured" aria-labelledby="feat-title">
        <h2 class="brush"><span>Featured</span></h2>
        <a class="feat-card" href={featured.href}>
          <span class="feat-img"><img src={featured.url} alt="" /></span>
          <span class="feat-body">
            <span class="feat-tags">{#each tags(featured) as t}<span>{t}</span>{/each}{#if featured.lang}<span class="lang">{featured.lang}</span>{/if}</span>
            <span class="feat-title" id="feat-title">{featured.title}</span>
            <span class="feat-desc">{@html featured.description}</span>
            <span class="feat-go">Explore the story →</span>
          </span>
        </a>
      </section>
    {/if}

    <!-- ===== about ===== -->
    <section class="about">
      <h2 class="brush gold"><span>About me</span></h2>
      <p>I'm Ahmed Bendaly. I'm interested in sports, weird stats and all things Tunisian, and I like making numbers feel personal: something you play with, not just read.</p>
      <p>I build my projects in Svelte and D3, often in both Arabic and English.</p>
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
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); max-width: 1000px; margin: 0 auto;
    border-radius: 16px; overflow: hidden; background: #FFFFFF; color: inherit; text-decoration: none;
    box-shadow: 0 10px 30px rgba(46, 58, 64, .12); transition: transform .2s, box-shadow .2s;
  }
  .feat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(46, 58, 64, .18); color: inherit; }
  .feat-img { display: block; background: #EEE; }
  .feat-img img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .feat-body { display: flex; flex-direction: column; gap: .7rem; padding: 1.8rem; }
  .feat-tags { display: flex; flex-wrap: wrap; gap: .4rem; }
  .feat-tags span { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--terra); background: rgba(181, 82, 59, .1); padding: .2rem .55rem; border-radius: 999px; }
  .feat-tags .lang { color: var(--blue); background: rgba(30, 91, 140, .1); }
  .feat-title { font-size: 1.6rem; font-weight: 500; line-height: 1.25; }
  .feat-desc { font-weight: 300; line-height: 1.6; color: var(--muted); }
  .feat-desc :global(a) { color: var(--blue); }
  .feat-go { margin-top: auto; font-weight: 600; color: var(--blue); }

  /* ---------- about ---------- */
  .about { max-width: 42rem; margin: 0 auto; padding: 3.5rem 1.5rem 1rem; }
  .about p { margin: 0 0 1rem; font-size: 1.1rem; font-weight: 300; line-height: 1.7; }
  .about .contact { font-weight: 400; }

  /* ---------- projects ---------- */
  .work { padding: 2.5rem 0 1rem; scroll-margin-top: 1rem; }

  /* ---------- phones ---------- */
  @media (max-width: 780px) {
    .hero { grid-template-columns: minmax(0, 1fr); gap: 1.2rem; padding: 1.8rem 1.2rem 2rem; text-align: center; }
    .portrait { order: -1; width: 190px; height: 190px; }
    .portrait img { height: 180px; width: 135px; }
    .role { margin-inline: auto; }
    .cta { justify-content: center; }
    .feat-card { grid-template-columns: minmax(0, 1fr); }
    .feat-body { padding: 1.3rem; }
    h2.brush span { font-size: 1.8rem; }
  }
  @media (prefers-reduced-motion: reduce) { .btn, .feat-card { transition: none; } .portrait img { animation: none; } }
</style>
