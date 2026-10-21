<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import ArrowIcon from './ArrowIcon.svelte';

  export let enableKeyboard = true;
  export let directions = ['up', 'down', 'left', 'right'];
  export let disable = [];
  export let sticky = true;
  export let title = "Press the ‘Down key’ to see the Math!";
  export let blinkDelay = 1500; // change to 15000 for 15s in production
  export let highlight = false; // spotlight mode: fully opaque inside a light circle

  const dispatch = createEventDispatcher();

  let activeKey = '';
  let timer;            // for pressed-key visual
  let blinkRight = false;
  let blinkTimerId;     // <--- the blinking countdown timer

  function fire(dir) {
    if (!directions.includes(dir)) return;
    if (disable.includes(dir)) return;
    dispatch('tap', dir);
  }

  function setActive(dir) {
    activeKey = dir;
    clearTimeout(timer);
    timer = setTimeout(() => (activeKey = ''), 150);
  }

  // Restart the post-interaction countdown and stop blinking immediately
  function resetBlinkTimer() {
    clearTimeout(blinkTimerId);
    blinkRight = false;                        // stop any current blinking
    blinkTimerId = setTimeout(() => {
      blinkRight = true;                       // resume blinking after delay
    }, blinkDelay);
  }

  function tap(dir) {
    setActive(dir);
    fire(dir);
    if (dir === 'right') resetBlinkTimer();    // <--- reset timer on right click/tap
  }

  function handleKeydown(e) {
    if (!enableKeyboard) return;
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    setActive(dir);
    fire(dir);
    if (dir === 'right') resetBlinkTimer();    // <--- reset timer on Right Arrow
  }

  onMount(() => {
    resetBlinkTimer();                         // start initial countdown
    return () => {
      clearTimeout(timer);
      clearTimeout(blinkTimerId);
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={() => (activeKey = '')} />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .position { position:absolute; bottom:0; left:0; margin-bottom:2%; margin-left:4%; z-index:1000; opacity:.3; transition:opacity .2s; }
  .position:hover { opacity:1; }

  /* --- Spotlight: keyboard fully visible inside a light circle --- */
  .position.highlight { opacity:1; }
  .position.highlight::before {
    content:''; position:absolute; top:50%; left:50%;
    width:150%; aspect-ratio:1; border-radius:50%;
    background:#BFAFF7; box-shadow:0 0 0 6px rgba(191,175,247,.4), 0 0 40px 10px rgba(191,175,247,.6);
    transform:translate(-50%,-50%); z-index:-1;
    animation:spotPulse 2s ease-in-out infinite;
  }
  @keyframes spotPulse { 0%,100% { transform:translate(-50%,-50%) scale(1); } 50% { transform:translate(-50%,-50%) scale(1.05); } }

  /* While spotlighted, the RIGHT key is the one that matters: make it solid */
  .highlight .key.right { opacity:1; }

  /* --- Callout pointing at the RIGHT key --- */
  .callout {
    position:absolute; left:100%; top:22px;
    display:flex; align-items:flex-start;
    pointer-events:none;
  }
  .callout-arrow {
    width:70px; height:44px; flex-shrink:0;
    color:#E5DEFF;
    animation:nudge 1s ease-in-out infinite;
  }
  .callout-text {
    margin-top:-14px; width:220px;
    padding:10px 14px; border-radius:14px;
    background:#E5DEFF; color:#3F3075;
    font-family:'Kumbh Sans', sans-serif; font-size:.95rem; line-height:1.35;
    box-shadow:0 6px 18px rgba(35,25,70,.35);
  }
  .callout-text kbd {
    display:inline-block; padding:0 6px; border-radius:6px;
    background:#7c6fab; color:#fff; font-family:inherit; font-weight:700;
  }
  @keyframes nudge { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-5px,4px); } }
  .container { width:21cqw; max-width:140px; display:flex; flex-direction:column; justify-content:center; align-items:center; user-select:none; }
  .keyboard { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,1fr); gap:2%; width:100%; aspect-ratio:3/2; }
  .key { display:flex; justify-content:center; align-items:center; border:none; border-radius:20%; background:#7c6fab; color:#BFAFF7; cursor:pointer; opacity:.5; transition:background-color .2s, opacity .2s, transform .08s; }
  .key.down { opacity:1; }
  .key.active, .key:active { background:#3F3075; transform: translateY(1px) scale(.98); }
  .key:disabled { opacity:.25; cursor:not-allowed; }
  .center { visibility:hidden; }
  .instruction { margin-top:10px; font-size:.8rem; color:#3F3075; text-align:center; font-family:'Kumbh Sans', sans-serif; font-weight:900; }
  .icon { width:clamp(13px,1.8cqw,20px); height:clamp(13px,1.8cqw,20px); }

  /* --- Blinking burgundy "stroke" for the RIGHT key --- */
  @keyframes pulseStroke {
    0%, 100% {
      outline: 0 solid transparent;
      box-shadow: none;
    }
    50% {
      outline: 3px solid #5B4E88;               /* burgundy */
      outline-offset: 0;
      box-shadow: 0 0 0 4px rgba(91, 78, 136, 0.85);
    }
  }
  .blink-right {
    animation: pulseStroke 0.9s infinite;
    border-radius: 20%;
  }
</style>

<div class={sticky ? 'position' : ''} class:highlight aria-label={title}>
  <div class="container">
    <div class="keyboard">
      <!-- row 1 -->
      <div class="center"></div>

      {#if directions.includes('up')}
        <button
          class="key {activeKey === 'up' ? 'active' : ''}"
          on:mousedown={() => tap('up')}
          on:touchstart|preventDefault={() => tap('up')}
          aria-label="Up"
          disabled={disable.includes('up')}
        >
          <ArrowIcon dir="up" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}

      <div class="center"></div>

      <!-- row 2 -->
      {#if directions.includes('left')}
        <button
          class="key {activeKey === 'left' ? 'active' : ''}"
          on:mousedown={() => tap('left')}
          on:touchstart|preventDefault={() => tap('left')}
          aria-label="Left"
          disabled={disable.includes('left')}
        >
          <ArrowIcon dir="left" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}

      {#if directions.includes('down')}
        <button
          class="key down {activeKey === 'down' ? 'active' : ''}"
          on:mousedown={() => tap('down')}
          on:touchstart|preventDefault={() => tap('down')}
          aria-label="Down"
          disabled={disable.includes('down')}
        >
          <ArrowIcon dir="down" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}

      {#if directions.includes('right')}
        <button
          class="key right {activeKey === 'right' ? 'active' : ''} {(blinkRight || highlight) && !disable.includes('right') ? 'blink-right' : ''}"
          on:mousedown={() => tap('right')}
          on:touchstart|preventDefault={() => tap('right')}
          aria-label="Right"
          disabled={disable.includes('right')}
        >
          <ArrowIcon dir="right" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}
    </div>

    <div class="instruction">{title}</div>
  </div>

  {#if highlight && directions.includes('right')}
    <div class="callout" transition:fade={{ duration: 250 }}>
      <svg class="callout-arrow" viewBox="0 0 80 50" fill="none" stroke="currentColor"
           stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M75 10 C 45 5, 20 15, 8 40" />
        <path d="M6 28 L8 40 L18 34" />
      </svg>
      <div class="callout-text">
        Press here (or <kbd>→</kbd> on your keyboard) to go to the next cycle
      </div>
    </div>
  {/if}
</div>
