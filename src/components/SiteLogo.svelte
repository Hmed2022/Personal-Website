<!-- Ahmed's drawing, recoloured to match whatever page it sits on.
     The drawing has three layers: the outline/backing (bg), the body (fill) and the ink lines (ink).

     <SiteLogo ink="#9D9485" />                                        corner badge linking home (line art only)
     <SiteLogo inline size={64} ... />                                  plain drawing (e.g. in a footer)
-->
<script>
  import svg from '../assets/PhotoMeThemed.svg?raw';

  export let ink = '#000000';      // colour of the drawing's lines
  export let bg = 'transparent';   // optional outline/backing layer (the original blue)
  export let fill = 'transparent'; // optional body layer (the original white)
  export let size = 132;          // height in px (width follows the drawing's shape)
  export let inline = false;     // true: just the drawing, no link / no corner positioning
  export let href = '/#/';
  export let label = 'Ahmed Bendaly, home';
  export let top = 36;           // px from the top of the page (corner badge only)
  export let left = 40;          // px from the left edge (corner badge only)

  // corner badge on project pages: just the head (chechia to beard), cut off at the neck
  const head = svg
    .replace(/viewBox="[^"]*"/, 'viewBox="18 28 482 612"')
    .replace(/(<svg[^>]*>)/, '$1<defs><clipPath id="logo-head"><path d="M-80,-80 L600,-80 L600,500 L414,500 L398,535 L372,596 L344,628 L228,628 L220,612 L205,590 L178,560 L152,548 L-80,548Z"/></clipPath></defs><g clip-path="url(#logo-head)">')
    .replace('</svg>', '</g></svg>');

  $: vars = `--logo-bg:${bg}; --logo-fill:${fill}; --logo-ink:${ink}; --logo-h:${size}px; --logo-top:${top}px; --logo-left:${left}px;`;
</script>

{#if inline}
  <span class="logo" style={vars}>{@html svg}</span>
{:else}
  <a class="logo corner" style={vars} {href} aria-label={label} title="Ahmed Bendaly">{@html head}</a>
{/if}

<style>
  .logo { display: inline-block; height: var(--logo-h); width: calc(var(--logo-h) * 0.482); line-height: 0; }
  .logo :global(svg) { display: block; width: 100%; height: 100%; }

  /* top-left of the page; scrolls away with the content instead of covering it */
  /* the head is ~60% of the full drawing's height, so the face stays the same size as before */
  .corner {
    height: calc(var(--logo-h) * .6); width: calc(var(--logo-h) * .6 * 0.788);
    position: absolute; top: var(--logo-top); left: var(--logo-left); z-index: 950;
    transition: transform .2s;
  }
  .corner:hover, .corner:focus-visible { transform: rotate(-6deg) scale(1.05); }
  .corner:focus-visible { outline: 2px solid var(--logo-ink); outline-offset: 4px; border-radius: 4px; }

  @media (max-width: 600px) {
    /* phones: no corner logo on the project pages (it covered their titles) */
    .corner { display: none; }
  }
  @media (prefers-reduced-motion: reduce) { .corner { transition: none; } }
</style>
