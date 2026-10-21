<script>
    import { createEventDispatcher, onMount } from "svelte";
  
    // Props
    export let frontSrc = "";
    export let backSrc = "";
    export let alt = "";
    export let width = 260;  // px number, or any CSS length string (e.g. "12em")
    export let borderRadius = 16; // px
    export let label = "";   // for a11y
    export let forceFlip = false; // flip from outside (e.g. hovering a matching word)

    const dispatch = createEventDispatcher();
    let flipped = false;
    let audioEl;

    function playFlipSound() {
      if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play();
      }
    }

    function setFlipped(value) {
      flipped = value;
    }

    // Card shows its back when hovered OR forced; play the sound on every visible flip
    $: shown = flipped || forceFlip;
    let lastShown = false;
    $: if (shown !== lastShown) {
      lastShown = shown;
      playFlipSound();
    }

    // Basic keyboard support: Enter/Space "clicks" the button
    function onKeydown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dispatch("select");
      }
    }

    // For touch devices without hover, first tap flips, second tap selects.
    let hasHover = true;
    onMount(() => {
      // detect hover capability
      hasHover = window.matchMedia("(hover: hover)").matches;
    });

    function handlePointerDown(e) {
      if (!hasHover) {
        // toggle flip on first tap
        setFlipped(!flipped);
      }
    }
  </script>

  <button
    type="button"
    class="flip-btn"
    style="--w:{typeof width === 'number' ? `${width}px` : width}; --r:{borderRadius}px;"
    aria-label={label || alt}
    aria-pressed={shown}
    on:keydown={onKeydown}
    on:click={() => dispatch("select")}
    on:mouseenter={() => setFlipped(true)}
    on:mouseleave={() => setFlipped(false)}
    on:pointerdown={handlePointerDown}
  >
    <div class="card" class:is-flipped={shown}>
      <img class="face front" src={frontSrc} alt={alt} draggable="false" />
      <img class="face back"  src={backSrc}  alt={alt} draggable="false" />
    </div>
  </button>
  <audio src="/assets/CardMagic/flipcard.wav" bind:this={audioEl} />

  <style>
    .flip-btn {
      /* reset button look */
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      font-size: inherit;   /* so an em-based width follows the page, not the button default */
      cursor: pointer;
  
      width: var(--w);
      /* adjust the aspect ratio as you like (here 2:3) */
      height: calc(var(--w) * 1.5);
  
      /* 3D perspective for the flip */
      perspective: 1000px;
      display: inline-block;
      outline: none;
    }
    .flip-btn:focus-visible {
      outline: 3px solid rgba(0, 120, 255, 0.7);
      outline-offset: 6px;
      border-radius: var(--r);
    }
  
    .card {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 380ms;
      border-radius: var(--r);
    }
    .card.is-flipped {
      transform: rotateY(180deg);
    }
  
    .face {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--r);
      backface-visibility: hidden;
      user-select: none;
    }
    .back {
      transform: rotateY(180deg);
    }
  </style>
  