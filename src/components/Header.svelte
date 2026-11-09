<!-- Site header: a slim bar with the drawing and name (home link) and the main links.
     Previous version (big handwritten name image) kept in Header_old.svelte. -->
<script>
  import { location } from 'svelte-spa-router';
  import SiteLogo from './SiteLogo.svelte';
  import { theme, toggleTheme, PERSONAL_PAGES } from './theme.js';
  $: path = ($location || '').toLowerCase();
  $: clean = path.split('?')[0].replace(/\/+$/, '');
  $: dark = $theme === 'dark';
</script>

<div class="bar">
  <a class="brand" href="/#/" aria-label="Ahmed Bendaly, home">
    <span class="icon" aria-hidden="true"><SiteLogo inline size={46} bg="#008ec6" fill="var(--me-fill, #FFFFFF)" ink="var(--me-ink, #000000)" /></span>
    <span class="txt"><span class="name">Ahmed Bendaly</span><span class="role">Data scientist · storyteller</span></span>
  </a>
  <nav aria-label="Main">
    <a href="/#/" class:on={path === '/' || path === ''}>Home</a>
    <a href="/#/projects" class:on={path.startsWith('/projects')}>Projects</a>
    <a href="/#/about" class:on={path.startsWith('/about')}>About me</a>
    <a class="contact" href="mailto:ahmedben@umich.edu">Contact</a>
    {#if PERSONAL_PAGES.includes(clean)}
      <button type="button" class="mode" on:click={toggleTheme} aria-pressed={dark}
              aria-label={dark ? 'Switch to day mode' : 'Switch to night mode'} title={dark ? 'Day mode' : 'Night mode'}>
        {#if dark}
          <!-- sun -->
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" /></svg>
        {:else}
          <!-- crescent moon -->
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.6A8.4 8.4 0 0 1 9.4 4a8.4 8.4 0 1 0 10.6 10.6Z" /></svg>
        {/if}
      </button>
    {/if}
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
  .icon { display: block; line-height: 0; flex: 0 0 auto; -webkit-transition: -webkit-transform .2s; transition: transform .2s; }
  .brand:hover .icon { -webkit-transform: rotate(-6deg); transform: rotate(-6deg); }
  .txt { display: flex; flex-direction: column; line-height: 1.1; }
  .name { font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.55rem; color: #2E3A40; white-space: nowrap; }
  .role { font-size: .78rem; font-weight: 400; letter-spacing: .04em; color: #5E6B70; }
  nav { display: flex; align-items: center; gap: .3rem; }
  nav a { font-weight: 500; font-size: 1rem; color: #2E3A40; text-decoration: none; padding: .4rem .8rem; border-radius: 999px; }
  nav a:hover { color: #1E5B8C; background: rgba(30, 91, 140, .08); }
  nav a.on { color: #1E5B8C; box-shadow: inset 0 -2px 0 #D9A441; border-radius: 0; }
  nav a.contact { color: #FFFFFF; background: #1E5B8C; margin-left: .3rem; }
  nav a.contact:hover { background: #17486F; color: #FFFFFF; }
  .mode {
    display: grid; place-items: center; width: 38px; height: 38px; margin-left: .35rem; padding: 0; flex: 0 0 auto;
    border: 1.5px solid rgba(46, 58, 64, .2); border-radius: 50%; background: transparent; color: #2E3A40; cursor: pointer;
    transition: transform .2s, background .15s;
  }
  .mode:hover { background: rgba(30, 91, 140, .08); transform: rotate(-15deg); }
  .mode:focus-visible { outline: 2px solid #D9A441; outline-offset: 2px; }
  .mode svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* ---- night mode ---- */
  :global(html[data-theme="dark"]) .brand, :global(html[data-theme="dark"]) .name, :global(html[data-theme="dark"]) nav a { color: #E9E4DA; }
  :global(html[data-theme="dark"]) .role { color: #A7B3BB; }
  :global(html[data-theme="dark"]) nav a:hover, :global(html[data-theme="dark"]) nav a.on { color: #8CBDE6; }
  :global(html[data-theme="dark"]) nav a:hover { background: rgba(140, 189, 230, .1); }
  :global(html[data-theme="dark"]) nav a.contact { color: #14202A; background: #8CBDE6; }
  :global(html[data-theme="dark"]) nav a.contact:hover { background: #B0D2EE; color: #14202A; }
  :global(html[data-theme="dark"]) .divider { background: linear-gradient(90deg, transparent, rgba(233, 228, 218, .16) 12%, rgba(233, 228, 218, .16) 88%, transparent); }
  :global(html[data-theme="dark"]) .mode { color: #F3D58C; border-color: rgba(233, 228, 218, .25); }
  :global(html[data-theme="dark"]) .mode:hover { background: rgba(243, 213, 140, .1); }

  @media (max-width: 560px) {
    .bar { padding: .7rem 1rem; }
    .role { display: none; }
    .name { font-size: 1.2rem; }
    .brand { gap: .45rem; }
    .icon :global(.logo) { width: 17px; height: 36px; }
    nav { gap: .1rem; }
    nav a { padding: .35rem .55rem; font-size: .92rem; }
  }
  /* small phones: four links + the name don't fit, so keep just the drawing as the home link */
  @media (max-width: 440px) {
    .txt { display: none; }
    nav a { padding: .35rem .45rem; font-size: .88rem; white-space: nowrap; }
    nav a.contact { margin-left: .15rem; }
    .mode { width: 32px; height: 32px; margin-left: .2rem; }
    .mode svg { width: 16px; height: 16px; }
  }
</style>
