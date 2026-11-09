<!-- Project thumbnail: a still image, or a short looping video when the project has `video`.
     The video only downloads and plays while it's on screen, pauses when scrolled away, and is
     replaced by the still (`src`, used as the poster) for visitors who prefer reduced motion. -->
<script>
  import { onMount } from 'svelte';
  export let src;            // still image (also the video's poster)
  export let video = null;   // optional .mp4
  export let alt = '';
  let cls = '';
  export { cls as class };

  let el;
  let reduce = false;
  onMount(() => {
    reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!video || reduce || !el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  });
</script>

{#if video && !reduce}
  <video bind:this={el} class={cls} src={video} poster={src} muted loop playsinline preload="none" aria-label={alt}></video>
{:else}
  <img class={cls} {src} {alt} loading="lazy" />
{/if}
