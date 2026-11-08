<!-- About Leghreeb: the story behind the drawing and the name.
     Deliberately not the home page's look: a night scene in Tunisian blue with Leghreeb drawn in
     cream lines floating on the night sky (the home page has him in a sun on warm paper). -->
<script>
  import SiteLogo from '../components/SiteLogo.svelte';
  import Footer from '../components/footer.svelte';

  const SONG = 'https://www.youtube.com/watch?v=UROtIlMW0Hg';
  const INSTAGRAM = 'https://www.instagram.com/leghreeb/';
</script>

<div class="night">
  <span class="stars" aria-hidden="true"></span>

  <section class="hero">
    <div class="moon-wrap" aria-hidden="true">
      <span class="halo"></span>
      <span class="figure"><SiteLogo inline size={300} ink="#FBF6EE" /></span>
    </div>

    <div class="words">
      <p class="eyebrow">About</p>
      <h1>
        <span class="ar" lang="ar">لغريب</span>
        <span class="en">Leghreeb</span>
      </h1>

      <dl class="entry">
        <dt><span class="lemma">leghreeb</span></dt>
        <dd><span class="pos">Tunisian Arabic · noun</span> the foreigner; the stranger.</dd>
      </dl>
    </div>
  </section>

  <section class="story">
    <p class="lead">
      Leghreeb means <em>“the foreigner”</em> or <em>“the stranger”</em> in Tunisian. It's what we all are
      the first time we try something new or meet new people: we're strangers, until we're not.
    </p>
    <p>
      I took the name from a song by <a href={SONG} target="_blank" rel="noopener noreferrer">Jawhar</a>,
      one of my favorite Tunisian artists.
    </p>

    <a class="song" href={SONG} target="_blank" rel="noopener noreferrer">
      <span class="thumb">
        <img src="https://i.ytimg.com/vi/UROtIlMW0Hg/hqdefault.jpg" alt="" loading="lazy" />
        <span class="play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
        </span>
      </span>
      <span class="song-text">
        <span class="song-kicker">Where the name comes from</span>
        <span class="song-title">Listen to Jawhar on YouTube <span aria-hidden="true">↗</span></span>
      </span>
    </a>
  </section>

  <section class="socials" aria-labelledby="follow">
    <h2 id="follow">Follow Leghreeb</h2>
    <a class="insta" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" class="dot" /></svg>
      <span>@leghreeb on Instagram</span>
    </a>
    <p class="back"><a href="/#/">← Back home</a></p>
  </section>
</div>

<!-- dark band behind the footer so there's no white strip between page and footer -->
<div class="foot"><Footer theme={{ bg: '#0E2A40', ink: '#FBF6EE', muted: '#B8C6D2', accent: '#D9A441', hover: '#F3D58C', border: 'rgba(251, 246, 238, .12)', logoBg: 'transparent', logoFill: 'transparent', logoInk: '#FBF6EE' }} /></div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Reem+Kufi:wght@500;700&display=swap');
  @font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }

  .night {
    --navy: #0E2A40; --blue: #1E5B8C; --cream: #FBF6EE; --gold: #D9A441; --muted: #B8C6D2;
    position: relative; overflow: hidden; isolation: isolate;
    background: radial-gradient(120% 80% at 70% 0%, #24659A 0%, #163F60 45%, var(--navy) 100%);
    color: var(--cream); font-family: 'Jost', sans-serif;
    padding: 3rem 1.5rem 4rem;
    /* run edge to edge: cancel the browser's default 8px body margin */
    margin: 0 -8px;
  }
  .foot { margin: 0 -8px -8px; padding-top: 1px; background: var(--navy, #0E2A40); }
  .foot :global(.site-footer) { margin-top: 0; }
  /* faint stars, drawn with gradients (no image to download) */
  .stars {
    position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: .55;
    background-image:
      radial-gradient(1.5px 1.5px at 12% 18%, #fff 50%, transparent 51%),
      radial-gradient(1px 1px at 28% 62%, #fff 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 44% 12%, #fff 50%, transparent 51%),
      radial-gradient(1px 1px at 58% 78%, #fff 50%, transparent 51%),
      radial-gradient(2px 2px at 82% 24%, #F3D58C 50%, transparent 51%),
      radial-gradient(1px 1px at 90% 66%, #fff 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 6% 84%, #fff 50%, transparent 51%),
      radial-gradient(1px 1px at 70% 44%, #fff 50%, transparent 51%);
    background-size: 420px 420px;
    animation: twinkle 6s ease-in-out infinite alternate;
  }
  @keyframes twinkle { from { opacity: .35; } to { opacity: .7; } }

  /* ---------- hero ---------- */
  .hero {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); align-items: center; gap: 3rem;
    max-width: 1040px; margin: 0 auto; min-height: min(78vh, 680px);
  }
  .moon-wrap { position: relative; display: grid; place-items: center; justify-self: center; width: 360px; height: 360px; }
  .halo { position: absolute; inset: -40px; border-radius: 50%; background: radial-gradient(circle, rgba(217, 164, 65, .18), transparent 65%); }
  .figure { position: relative; animation: float 5s ease-in-out infinite; filter: drop-shadow(0 10px 24px rgba(0, 0, 0, .35)); }
  @keyframes float { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-10px) rotate(1.5deg); } }

  .eyebrow { margin: 0 0 .4rem; font-weight: 500; font-size: .85rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); }
  h1 { margin: 0; display: flex; flex-direction: column; line-height: 1; }
  h1 .ar { font-family: 'Reem Kufi', sans-serif; font-weight: 700; font-size: clamp(4rem, 9vw, 6.5rem); color: var(--cream); }
  h1 .en { margin-top: .4rem; font-family: 'dkzonnig', 'Jost', sans-serif; font-weight: 400; font-size: clamp(2.2rem, 4.5vw, 3.2rem); color: var(--gold); }

  .entry { margin: 2rem 0 0; padding: 1.1rem 1.3rem; border-left: 3px solid var(--gold); background: rgba(251, 246, 238, .06); border-radius: 0 12px 12px 0; }
  .entry dt { font-size: 1.15rem; }
  .lemma { font-weight: 600; font-style: italic; }
  .entry dd { margin: .35rem 0 0; font-size: 1.1rem; font-weight: 300; }
  .pos { display: block; margin-bottom: .2rem; font-size: .78rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }

  /* ---------- story ---------- */
  .story { max-width: 40rem; margin: 2.5rem auto 0; }
  .story p { margin: 0 0 1.2rem; font-size: 1.15rem; font-weight: 300; line-height: 1.8; color: #E7EDF2; }
  .story .lead { font-size: clamp(1.3rem, 2.4vw, 1.6rem); font-weight: 400; line-height: 1.55; color: var(--cream); }
  .story em { font-style: normal; color: var(--gold); }
  .story a:not(.song) { color: var(--cream); text-decoration-color: var(--gold); text-decoration-thickness: 2px; text-underline-offset: 4px; }
  .story a:not(.song):hover { color: var(--gold); }

  .song {
    display: flex; align-items: center; gap: 1.1rem; margin-top: 1.8rem; padding: .8rem; border-radius: 16px;
    background: rgba(251, 246, 238, .07); border: 1px solid rgba(251, 246, 238, .14);
    color: inherit; text-decoration: none; transition: background .2s, transform .2s;
  }
  .song:hover { background: rgba(251, 246, 238, .12); transform: translateY(-2px); }
  .thumb { position: relative; flex: none; width: 168px; aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden; background: #0A1F30; }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .play { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(14, 42, 64, .25); }
  .play svg { width: 44px; height: 44px; padding: 8px 6px 8px 10px; border-radius: 50%; background: var(--gold); fill: var(--navy); }
  .song-text { display: flex; flex-direction: column; gap: .25rem; }
  .song-kicker { font-size: .78rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .song-title { font-size: 1.15rem; font-weight: 500; }

  /* ---------- socials ---------- */
  .socials { max-width: 40rem; margin: 3.5rem auto 0; text-align: center; }
  .socials h2 { margin: 0 0 1rem; font-family: 'dkzonnig', 'Jost', sans-serif; font-weight: 400; font-size: 2rem; color: var(--gold); }
  .insta {
    display: inline-flex; align-items: center; gap: .7rem; padding: .8rem 1.5rem; border-radius: 999px;
    background: var(--cream); color: var(--navy); font-weight: 600; font-size: 1.05rem; text-decoration: none;
    transition: transform .15s, background .15s;
  }
  .insta:hover { transform: translateY(-2px); background: #FFFFFF; }
  .insta svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; }
  .insta .dot { fill: currentColor; stroke: none; }
  .back { margin: 2rem 0 0; }
  .back a { color: var(--muted); text-decoration: none; }
  .back a:hover { color: var(--cream); }

  @media (max-width: 780px) {
    .night { padding-top: 1.5rem; }
    .hero { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; min-height: 0; text-align: center; }
    .moon-wrap { width: 250px; height: 250px; }
    .figure :global(.logo) { height: 210px !important; width: 101px !important; }
    .entry { text-align: left; }
    .song { flex-direction: column; align-items: stretch; text-align: left; }
    .thumb { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) { .stars, .figure { animation: none; } .song, .insta { transition: none; } }
</style>
