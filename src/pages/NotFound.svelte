<!-- Shown for any unknown address (e.g. #/oops) instead of a blank page.
     Leghreeb with a red censor bar over his eyes: even he doesn't know this place. -->
<script>
  import { location } from 'svelte-spa-router';
  import svg from '../assets/PhotoMeThemed.svg?raw';
  import Footer from '../components/footer.svelte';

  // the drawing with a red bar over the eyes (coordinates are in the drawing's own 517×1072 space)
  const censored = svg.replace(
    '</svg>',
    '<rect x="100" y="258" width="330" height="96" rx="6" fill="#C2272D" transform="rotate(-3 265 306)"/></svg>'
  );
</script>

<div class="nf">
  <div class="art" aria-hidden="true">
    <span class="sun"></span>
    <span class="me">{@html censored}</span>
  </div>

  <div class="text">
    <!-- "Ammar 404": what Tunisians called the censor behind the "404 Not Found" pages on blocked sites -->
    <p class="code">Ammar 404 <span>Not Found</span></p>
    <h1>This is uncharted territory, even for Leghreeb.</h1>
    <p class="path">There's nothing at <code>#{$location}</code>.</p>
    <div class="cta">
      <a class="btn primary" href="/#/">Take me home</a>
      <a class="btn ghost" href="/#/projects">See the projects</a>
    </div>
  </div>
</div>
<Footer />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
  @font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }

  .nf {
    --blue: #1E5B8C; --terra: #B5523B; --gold: #D9A441; --ink: #2E3A40; --muted: #5E6B70;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); align-items: center; gap: 3rem;
    max-width: 960px; margin: 0 auto; padding: 4rem 1.5rem 2rem; box-sizing: border-box; min-height: 70vh;
    font-family: 'Jost', sans-serif; color: var(--ink);
  }
  .art { position: relative; display: grid; place-items: center; justify-self: center; width: 300px; height: 300px; }
  .sun { position: absolute; inset: 4%; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #F2B8B1, #E0857B); }
  .me { position: relative; display: block; height: 280px; width: 135px; --logo-bg: #008ec6; --logo-fill: #FFFFFF; --logo-ink: #000000; animation: look 4s ease-in-out infinite; transform-origin: 50% 85%; }
  .me :global(svg) { display: block; width: 100%; height: 100%; }
  @keyframes look { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(-4deg); } 70% { transform: rotate(4deg); } }

  .code { margin: 0; font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 3rem; line-height: 1; color: var(--terra); }
  .code span { font-size: .55em; color: var(--muted); }
  h1 { margin: .4rem 0 0; font-weight: 500; font-size: clamp(1.7rem, 3.4vw, 2.4rem); line-height: 1.2; }
  .path { margin: 1rem 0 0; font-weight: 300; font-size: 1.1rem; color: var(--muted); overflow-wrap: anywhere; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em; background: rgba(46, 58, 64, .07); padding: .1em .4em; border-radius: 4px; }
  .cta { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.8rem; }
  .btn { display: inline-flex; align-items: center; font: 500 1rem 'Jost', sans-serif; border-radius: 999px; padding: .65rem 1.4rem; text-decoration: none; border: 2px solid var(--blue); transition: transform .15s; }
  .btn:hover { transform: translateY(-2px); }
  .btn.primary { background: var(--blue); color: #FFFFFF; }
  .btn.ghost { color: var(--blue); }

  @media (max-width: 700px) {
    .nf { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; padding-top: 2rem; text-align: center; }
    .art { width: 210px; height: 210px; }
    .me { height: 196px; width: 95px; }
    .cta { justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) { .me { animation: none; } .btn { transition: none; } }
</style>
