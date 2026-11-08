<!-- Site footer (previous version kept in footer_old.svelte).
     Icons are inline SVGs with a fixed size: the old ones were sized as "100% of a box with no
     width", which Safari renders differently (icons vanished or grew), and percentage margins
     squeezed the layout. -->
<script>
  import SiteLogo from './SiteLogo.svelte';

  // Optional palette so a project can blend the footer into its own colours, e.g.
  // <Footer theme={{ ink: '#603D25', accent: '#266F8C', hover: '#E86349', logoBg: '#266F8C' }} />
  // Anything left out keeps the site's default.
  export let theme = {};
  const DEFAULT = {
    ink: '#2E3A40', muted: '#5E6B70', accent: '#1E5B8C', hover: '#B5523B', border: 'rgba(46, 58, 64, .12)', bg: 'transparent',
    logoBg: '#008ec6', logoFill: '#FFFFFF', logoInk: '#000000'
  };
  $: t = { ...DEFAULT, ...theme };
  $: vars = `--f-ink:${t.ink}; --f-muted:${t.muted}; --f-accent:${t.accent}; --f-hover:${t.hover}; --f-border:${t.border}; --f-bg:${t.bg};`;
  const year = new Date().getFullYear();
  const LINKS = [
    { label: 'Home', href: '/#/' },
    { label: 'Projects', href: '/#/projects' },
    { label: 'About me', href: '/#/about' },
  ];
  const SOCIAL = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmed-bendaly/',
      d: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z' },
    { label: 'Email', href: 'mailto:ahmedben@umich.edu',
      d: 'M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zm.8 2.1v.3l8.2 5.4 8.2-5.4v-.3zM20.2 9.9 12.55 15a1 1 0 0 1-1.1 0L3.8 9.9v6.6h16.4z' },
  ];
</script>

<footer class="site-footer" style={vars}>
  <div class="inner">
    <div class="brand">
      <span class="me"><SiteLogo inline size={64} bg={t.logoBg} fill={t.logoFill} ink={t.logoInk} /></span>
      <div>
        <p class="name">Ahmed Bendaly</p>
        <p class="tag">Data stories about Tunisia, culture and sport.</p>
      </div>
    </div>

    <nav class="links" aria-label="Footer">
      {#each LINKS as l}<a href={l.href}>{l.label}</a>{/each}
    </nav>

    <div class="social">
      <p class="label">Contact me</p>
      <div class="icons">
        {#each SOCIAL as s}
          <a href={s.href} aria-label={s.label} title={s.label}
             target={s.href.startsWith('http') ? '_blank' : null} rel={s.href.startsWith('http') ? 'noopener noreferrer' : null}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d={s.d} /></svg>
          </a>
        {/each}
      </div>
    </div>
  </div>
  <p class="copy">© {year} Ahmed Bendaly</p>
</footer>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap');
  .site-footer {
    margin-top: 5rem; padding: 2.2rem 1.5rem 1.4rem;
    border-top: 1px solid var(--f-border); background: var(--f-bg);
    font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--f-muted);
    -webkit-text-size-adjust: 100%;
  }
  .inner {
    display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1.6rem 2.5rem;
    max-width: 1000px; margin: 0 auto;
  }
  .brand { flex: 1 1 240px; min-width: 0; display: flex; align-items: center; gap: .9rem; }
  .me { flex: 0 0 auto; display: block; line-height: 0; }
  .name { margin: 0; font-weight: 500; font-size: 1.1rem; color: var(--f-ink); }
  .tag { margin: .25rem 0 0; font-weight: 300; font-size: .95rem; }
  .links { display: flex; flex-direction: column; gap: .4rem; flex: 0 0 auto; }
  .links a { color: var(--f-ink); text-decoration: none; font-weight: 400; font-size: 1rem; }
  .links a:hover { color: var(--f-hover); }
  .social { flex: 0 0 auto; }
  .label { margin: 0 0 .5rem; font-weight: 500; font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; }
  .icons { display: flex; gap: .6rem; }
  .icons a {
    display: flex; align-items: center; justify-content: center; flex: 0 0 auto;
    width: 40px; height: 40px; border-radius: 50%;
    background: color-mix(in srgb, var(--f-accent) 10%, transparent); color: var(--f-accent);
    -webkit-transition: background .15s, color .15s, -webkit-transform .15s; transition: background .15s, color .15s, transform .15s;
  }
  .icons a:hover { background: var(--f-accent); color: #FFFFFF; -webkit-transform: translateY(-2px); transform: translateY(-2px); }
  .icons svg { display: block; width: 22px; height: 22px; flex: 0 0 auto; fill: currentColor; }
  .copy { margin: 1.8rem 0 0; text-align: center; font-weight: 300; font-size: .85rem; }
  @media (max-width: 600px) {
    .inner { flex-direction: column; align-items: center; text-align: center; }
    .brand { flex: none; flex-direction: column; gap: .5rem; }
    .links { flex-direction: row; gap: 1.4rem; }
    .icons { justify-content: center; }
  }
</style>
