<!-- Loader for the Tunisian banknotes piece: a random banknote from the story slides out of a
     printer slot, over and over, while the page downloads. Fills the whole screen in the story's cream. -->
<script>
  // the small (≈9 KB) webp versions; only their URLs end up in this bundle
  const notes = Object.values(import.meta.glob('../Data Viz/Timeline/BanknotesSmall/*.webp', { eager: true, import: 'default' }));
  const src = notes[Math.floor(Math.random() * notes.length)];
</script>

<div class="tl" role="status" aria-live="polite">
  <div class="printer" aria-hidden="true">
    <span class="slot"></span>
    <div class="paper"><img {src} alt="" /></div>
  </div>
  <span class="sr">Loading… / جارٍ التحميل…</span>
</div>

<style>
  .tl { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; background: #FAF3E8; }
  .printer { position: relative; width: min(300px, 70vw); }
  /* the printer's slot: the note comes out from under it */
  .slot { position: relative; z-index: 1; display: block; height: 18px; margin: 0 -18px; border-radius: 9px; background: #3B2F2A; box-shadow: inset 0 -5px 0 rgba(0, 0, 0, .35), 0 3px 8px rgba(59, 47, 42, .25); }
  .paper { overflow: hidden; margin-top: -9px; padding: 9px 4px 14px; }
  img { display: block; width: 100%; border-radius: 3px; box-shadow: 0 6px 14px rgba(59, 47, 42, .2); animation: print 2.8s cubic-bezier(.45, 0, .25, 1) infinite; }
  @keyframes print {
    0%   { transform: translateY(-104%); opacity: 1; }
    65%  { transform: translateY(0); }
    88%  { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(0); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) { img { animation: none; } }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
