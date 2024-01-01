<script>
    import { fade } from 'svelte/transition';
  
    let hovered = false;
  
    function toggleHovered() {
      hovered = !hovered;
    }
  
      export let height;
  
      export let img1,img2
  </script>
  
  <button
    on:mouseenter={toggleHovered}
      on:mouseleave={toggleHovered}
    aria-label="Interactive banknote image"
    class="image-container"
  >
    {#if !hovered}
      <img
        src={img1}
        alt="Uncirculated banknote."
        in:fade={{ duration: 50 }}
        out:fade={{ duration: 200 }}
              height="{height}px"
      />
    {/if}
    {#if hovered}
      <img
        src={img2}
        alt="Circulated banknote."
        in:fade={{ duration: 50 }}
        out:fade={{ duration: 200 }}
              height="{height}px"
      />
    {/if}
  </button>
  
  <style>
    .image-container {
      position: relative;
      height: 200px;
      border: none; /* Removes the button border */
      background: none; /* Removes the button background */
      padding: 0; /* Removes the button padding */
      cursor: pointer; /* Ensures the cursor changes to a pointer to indicate interactivity */
    }
    .image-container:focus {
      outline: 2px solid blue; /* Custom focus styles to replace browser default */
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
          width:auto;
      object-fit: cover;
    }
  </style>
  