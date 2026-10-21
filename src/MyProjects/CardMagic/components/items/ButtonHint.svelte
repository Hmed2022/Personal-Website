<script>
  // Spotlight + callout for a button. Place it INSIDE the button's positioned
  // container (which needs a z-index above the slide content).
  // The spotlight's huge box-shadow dims everything outside it, so it works
  // inside the slider's transformed slides where a separate overlay can't.
  // Fade in only: on leaving, it must vanish at once, otherwise the shade
  // visibly slides left/right along with the outgoing slide.
  import { fade } from 'svelte/transition';

  export let text = 'Click here';
</script>

<div class="spot" in:fade={{ duration: 250 }} aria-hidden="true"></div>

<div class="callout" in:fade={{ duration: 250 }}>
  <div class="callout-text">{text}</div>
  <svg class="callout-arrow" viewBox="0 0 80 50" fill="none" stroke="currentColor"
       stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 40 C 35 45, 60 35, 72 10" />
    <path d="M62 16 L72 10 L74 22" />
  </svg>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .spot {
    position:absolute; inset:-18px -22px;
    border-radius:999px;
    background:#FDD4D4;
    box-shadow:
      0 0 0 6px rgba(253,212,212,.45),
      0 0 30px 10px rgba(253,212,212,.6),
      0 0 0 200cqmax rgba(80,25,30,.4);   /* dims the rest of the slide */
    z-index:-1;
    pointer-events:none;
    animation:spotPulse 2s ease-in-out infinite;
  }
  @keyframes spotPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }

  .callout {
    position:absolute; right:calc(100% + 24px); top:40%;
    display:flex; align-items:flex-start;
    pointer-events:none;
  }
  .callout-text {
    width:200px;
    padding:10px 14px; border-radius:14px;
    background:#FFEAEA; color:#A34C48;
    font-family:'Kumbh Sans', sans-serif; font-size:.95rem; line-height:1.35; text-align:left;
    box-shadow:0 6px 18px rgba(70,20,25,.35);
  }
  .callout-arrow {
    width:70px; height:44px; flex-shrink:0; margin-top:-24px;
    color:#FFEAEA;
    animation:nudge 1s ease-in-out infinite;
  }
  @keyframes nudge { 0%,100% { transform:translate(0,0); } 50% { transform:translate(5px,-4px); } }
</style>
