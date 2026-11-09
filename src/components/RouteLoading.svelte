<!-- Shown for the moment a page's code is downloading (routes are lazy-loaded):
     Leghreeb hard at work, with sweat drops flying off both sides of his head. -->
<script>
  import SiteLogo from './SiteLogo.svelte';
  const DROPS = [0, 1, 2];
</script>

<div class="loading" role="status" aria-live="polite">
  <div class="worker" aria-hidden="true">
    {#each ['left', 'right'] as side}
      <span class="sweat {side}">
        {#each DROPS as i}
          <svg class="drop d{i}" viewBox="0 0 10 14"><path d="M5 0C5 0 0 6.2 0 9a5 5 0 0 0 10 0C10 6.2 5 0 5 0Z" /></svg>
        {/each}
      </span>
    {/each}
    <span class="me"><SiteLogo inline size={120} /></span>
  </div>
  <p class="caption">working on it…</p>
  <span class="sr">Loading…</span>
</div>

<style>
  @font-face { font-family: 'dkzonnig'; src: url('../assets/Fonts/dkzonnig.ttf') format('truetype'); font-display: swap; }

  .loading {
    min-height: 60vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .9rem;
  }
  .worker { position: relative; width: 170px; height: 130px; display: grid; place-items: center; }
  .me { display: block; line-height: 0; animation: strain .5s ease-in-out infinite alternate; transform-origin: 50% 90%; }
  @keyframes strain { from { transform: rotate(-2deg) translateY(0); } to { transform: rotate(2deg) translateY(-2px); } }

  /* the drops start at the temples (upper third of the drawing) and fly out and down */
  .sweat { position: absolute; top: 18px; width: 40px; height: 50px; }
  .sweat.left { left: 22px; }
  .sweat.right { right: 22px; transform: scaleX(-1); }  /* mirror of the left side */
  .drop {
    position: absolute; right: 0; width: 9px; height: 13px; opacity: 0;
    fill: #8FD3F4; stroke: #1E5B8C; stroke-width: 1.2;
    animation: fly 1.2s ease-out infinite;
  }
  .d0 { top: 2px;  --dx: -18px; --dy: 4px;  --r: -35deg; animation-delay: 0s; }
  .d1 { top: 16px; --dx: -22px; --dy: 10px; --r: -55deg; animation-delay: .4s; }
  .d2 { top: 30px; --dx: -16px; --dy: 16px; --r: -75deg; animation-delay: .8s; }
  @keyframes fly {
    0%   { opacity: 0; transform: translate(0, 0) rotate(var(--r)) scale(.6); }
    15%  { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--r)) scale(1); }
  }

  .caption { margin: 0; font-family: 'dkzonnig', 'Jost', sans-serif; font-size: 1.3rem; color: #5E6B70; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

  @media (prefers-reduced-motion: reduce) {
    .me { animation: none; }
    .drop { animation: none; opacity: 1; transform: translate(calc(var(--dx) / 2), calc(var(--dy) / 2)) rotate(var(--r)); }
  }
</style>
