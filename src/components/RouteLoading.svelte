<!-- Shown for the split second a project's code is downloading (routes are lazy-loaded) -->
<div class="loading" role="status" aria-live="polite">
  <span class="dot"></span><span class="dot"></span><span class="dot"></span>
  <span class="sr">Loading…</span>
</div>

<style>
  .loading {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
  }
  .dot {
    width: .7rem;
    height: .7rem;
    border-radius: 50%;
    background: #9b8fd0;
    animation: pulse 1s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: .15s; }
  .dot:nth-child(3) { animation-delay: .3s; }
  @keyframes pulse {
    0%, 100% { opacity: .3; transform: scale(.8); }
    50%      { opacity: 1;  transform: scale(1); }
  }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
