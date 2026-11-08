<!-- Site header: a slim bar with the drawing and name (home link) and the main links.
     Previous version (big handwritten name image) kept in Header_old.svelte. -->
<script>
  import { location } from 'svelte-spa-router';
  import PhotoMe from '../assets/PhotoMe.svg';
  $: path = ($location || '').toLowerCase();
</script>

<div class="bar">
  <a class="brand" href="/#/" aria-label="Ahmed Bendaly, home">
    <img src={PhotoMe} alt="" width="34" height="46" />
    <span class="txt"><span class="name">Ahmed Bendaly</span><span class="role">Data scientist · storyteller</span></span>
  </a>
  <nav aria-label="Main">
    <a href="/#/" class:on={path === '/' || path === ''}>Home</a>
    <a href="/#/projects" class:on={path.startsWith('/projects')}>Projects</a>
    <a href="/#/about" class:on={path.startsWith('/about')}>About me</a>
    <a class="contact" href="mailto:ahmedben@umich.edu">Contact</a>
  </nav>
</div>
<hr class="divider" aria-hidden="true" />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
  @font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }
  .bar {
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    max-width: 1100px; margin: 0 auto; padding: .9rem 1.5rem; box-sizing: border-box;
    font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .divider { width: min(1100px, calc(100% - 3rem)); height: 1px; margin: 0 auto; border: 0; background: linear-gradient(90deg, transparent, rgba(46, 58, 64, .18) 12%, rgba(46, 58, 64, .18) 88%, transparent); }
  .brand { display: flex; align-items: center; gap: .65rem; text-decoration: none; color: #2E3A40; }
  .brand img { display: block; width: 34px; height: 46px; object-fit: contain; flex: 0 0 auto; -webkit-transition: -webkit-transform .2s; transition: transform .2s; }
  .brand:hover img { -webkit-transform: rotate(-6deg); transform: rotate(-6deg); }
  .txt { display: flex; flex-direction: column; line-height: 1.1; }
  .name { font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.55rem; color: #2E3A40; white-space: nowrap; }
  .role { font-size: .78rem; font-weight: 400; letter-spacing: .04em; color: #5E6B70; }
  nav { display: flex; align-items: center; gap: .3rem; }
  nav a { font-weight: 500; font-size: 1rem; color: #2E3A40; text-decoration: none; padding: .4rem .8rem; border-radius: 999px; }
  nav a:hover { color: #1E5B8C; background: rgba(30, 91, 140, .08); }
  nav a.on { color: #1E5B8C; box-shadow: inset 0 -2px 0 #D9A441; border-radius: 0; }
  nav a.contact { color: #FFFFFF; background: #1E5B8C; margin-left: .3rem; }
  nav a.contact:hover { background: #17486F; color: #FFFFFF; }
  @media (max-width: 560px) {
    .bar { padding: .7rem 1rem; }
    .role { display: none; }
    .name { font-size: 1.2rem; }
    .brand { gap: .45rem; }
    .brand img { width: 26px; height: 36px; }
    nav { gap: .1rem; }
    nav a { padding: .35rem .55rem; font-size: .92rem; }
  }
  /* small phones: four links + the name don't fit, so keep just the drawing as the home link */
  @media (max-width: 440px) {
    .txt { display: none; }
    nav a { padding: .35rem .45rem; font-size: .88rem; white-space: nowrap; }
    nav a.contact { margin-left: .15rem; }
  }
</style>
