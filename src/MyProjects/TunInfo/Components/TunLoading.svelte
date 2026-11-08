<!-- Loader for the Tunisian banknotes piece: the emblem at the centre of the Tunisian flag
     (white disc, red crescent and star), turning while the page downloads. -->
<div class="tl" role="status" aria-live="polite">
  <svg viewBox="-50 -50 100 100" aria-hidden="true">
    <circle r="48" class="ring" />
    <circle r="44" fill="#FFFFFF" />
    <!-- crescent: red disc with an off-centre white disc cut out of it -->
    <circle r="33" fill="#E70013" />
    <circle cx="8.5" r="26.5" fill="#FFFFFF" />
    <!-- five-pointed star, inside the crescent's opening -->
    <polygon fill="#E70013" transform="translate(7 0) rotate(-18) scale(17)"
             points="0,-1 0.2245,-0.309 0.951,-0.309 0.3633,0.118 0.5878,0.809 0,0.382 -0.5878,0.809 -0.3633,0.118 -0.951,-0.309 -0.2245,-0.309" />
  </svg>
  <span class="sr">Loading… / جارٍ التحميل…</span>
</div>

<style>
  .tl { min-height: 70vh; display: grid; place-items: center; background: #FAF3E8; }
  svg { width: 84px; height: 84px; animation: spin 1.6s linear infinite; filter: drop-shadow(0 4px 10px rgba(231, 0, 19, .25)); }
  .ring { fill: #E70013; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { svg { animation-duration: 6s; } }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
