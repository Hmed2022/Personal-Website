<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  
  export let fill = "#613D25";
  export let duration = 500;
  export let delayStep = 20;
  export let pauseDuration = 5000; // 5 seconds pause after animation
  
  let show = false;
  let animationKey = 0;
  
  const rects = [
    { x: 32.5, y: 50.2, width: 7.7, height: 7.7 },
    { x: 218.5, y: 14.6, width: 7.7, height: 52.4 },
    { x: 164.6, y: 0, width: 41.5, height: 7.7 },
    { x: 99.5, y: 0, width: 59.6, height: 7.7 },
    { x: 151.5, y: 11.5, width: 7.7, height: 55.4 },
    { x: 86.5, y: 0, width: 7.7, height: 67 },
    { x: 73.6, y: 0, width: 7.7, height: 67 },
    { x: 133, y: 11.5, width: 7.7, height: 55.4 },
    { x: 99.5, y: 11.4, width: 7.7, height: 23 },
    { x: 45.9, y: 29.2, width: 21.9, height: 7.7 },
    { x: 45.9, y: 39.3, width: 21.9, height: 7.7 },
    { x: 43.4, y: 50.2, width: 23.6, height: 7.7 },
    { x: 1.5, y: 59.3, width: 66, height: 7.7 },
    { x: 45.9, y: 19, width: 21.9, height: 7.7 },
    { x: 38.2, y: 0, width: 7.7, height: 18.3 },
    { x: 13.2, y: 13.5, width: 7.7, height: 20.8 },
    { x: 26.4, y: 14, width: 7.7, height: 33.1 },
    { x: 0, y: 0, width: 7.7, height: 33.1 },
    { x: 0, y: 40.1, width: 7.7, height: 26.9 },
    { x: 119.2, y: 11.5, width: 7.7, height: 55.4 },
    { x: 60.8, y: 0, width: 7.7, height: 67 },
    { x: 99.6, y: 59.3, width: 58.8, height: 7.7 },
    { x: 99.6, y: 11.4, width: 27.2, height: 7.7 },
    { x: 39.1, y: 0, width: 29.4, height: 7.7 },
    { x: 6.7, y: 0, width: 26.4, height: 8.7 },
    { x: 13.2, y: 13.3, width: 20.9, height: 7.7 },
    { x: 0, y: 26.6, width: 19.6, height: 7.7 },
    { x: 4.7, y: 40.1, width: 29.4, height: 7.7 },
    { x: 166.3, y: 59.3, width: 52.8, height: 7.7 },
    { x: 199.3, y: 48.8, width: 7.7, height: 18.2 },
    { x: 187.8, y: 48.8, width: 7.7, height: 18.2 },
    { x: 176.3, y: 48.8, width: 7.7, height: 18.2 },
    { x: 164.5, y: 0, width: 7.7, height: 27.9 },
    { x: 164.5, y: 45.1, width: 7.7, height: 22.9 }
  ];
  
  const baseDelay = rects.length * delayStep;
  const totalAnimationDuration = baseDelay + duration + 300;
  
  let variations = [];
  
  function generateVariations() {
    // Generate completely new variations each time
    variations = rects.map(() => ({
      y: Math.random() * 80 - 40, // Random between -40 and 40
      x: Math.random() * 40 - 20, // Random X offset too
    }));
  }
  
  onMount(() => {
    generateVariations();
    show = true;
    
    // Loop: wait for animation to complete + pause, then restart
    const loop = () => {
      setTimeout(() => {
        show = false;
        setTimeout(() => {
          animationKey++;
          generateVariations(); // Generate new variations
          show = true;
          loop(); // Continue loop
        }, 300); // Brief delay for out transition
      }, totalAnimationDuration + pauseDuration);
    };
    
    loop();
  });
</script>

<div>
  <svg
    viewBox="0 0 226.2 67"
    width="740.2"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="svg-main"
  >
    {#key animationKey}
      {#if show}
        <!-- Rectangles with staggered animations and variations -->
        {#each rects as r, i}
          <rect
            x={r.x}
            y={r.y}
            width={r.width}
            height={r.height}
            fill={fill}
            in:fly|global={{ 
              y: variations[i]?.y || 40,
              x: variations[i]?.x || 0,
              opacity: 0, 
              duration, 
              delay: i * delayStep, 
              easing: cubicOut 
            }}
            out:fly|global={{ y: -30, opacity: 0, duration: 250 }}
          />
        {/each}
        
        <!-- Paths -->
        <path
          fill={fill}
          d="M172.2,22.7h-7.7v22.9h23.1v-22.9h-7.7M179.9,37.9h-7.8v-7.6h7.8v7.6Z"
          in:fly|global={{ y: variations[rects.length]?.y || 20, opacity: 0, duration, delay: baseDelay + 120, easing: cubicOut }}
          out:fly|global={{ y: -20, opacity: 0, duration: 250 }}
        />
        <path
          fill={fill}
          d="M107.3,44.1h-7.7v22.9h23.1v-22.9h-7.7M115,59.3h-7.8v-7.6h7.8v7.6Z"
          in:fly|global={{ y: variations[rects.length + 1]?.y || 20, opacity: 0, duration, delay: baseDelay + 180, easing: cubicOut }}
          out:fly|global={{ y: -20, opacity: 0, duration: 250 }}
        />
        
        <!-- Polygons -->
        <polygon
          fill={fill}
          points="225.7 4 225.7 0 217.6 0 217.6 7.4 214 7.4 214 11.6 225.7 11.6 225.7 7.4 221.8 7.4 221.8 4 225.7 4"
          in:fly|global={{ y: -25, opacity: 0, duration, delay: baseDelay + 240, easing: cubicOut }}
          out:fly|global={{ y: 20, opacity: 0, duration: 250 }}
        />
        <polygon
          fill={fill}
          points="204.8 31.4 208.8 31.4 208.8 23.4 201.5 23.4 201.5 19.8 197.3 19.8 197.3 31.4 201.5 31.4 201.5 27.6 204.8 27.6 204.8 31.4"
          in:fly|global={{ y: -25, opacity: 0, duration, delay: baseDelay + 300, easing: cubicOut }}
          out:fly|global={{ y: 20, opacity: 0, duration: 250 }}
        />
      {/if}
    {/key}
  </svg>
</div>

<style>
  .svg-main {
    width: 100%;
    max-width: 800px;
    height: auto;
  }
</style>