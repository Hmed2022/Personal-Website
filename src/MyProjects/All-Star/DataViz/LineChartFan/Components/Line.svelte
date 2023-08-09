<script>
  // export let color;
  export let xScale;
  export let year;
  export let margin;
  export let height;
</script>

<style>
  .vertical-line {
    stroke: #b8a79a;
    stroke-width: 4;
    animation: lineDrawToTop 1s forwards;
    transform-origin: center bottom;
  }

  @keyframes lineDrawToTop {
    0% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }
</style>

{#each year as y}
  <line
    class="vertical-line"
    x1={xScale(y)}
    x2={xScale(y)}
    y1={height - margin.top}
    y2={margin.top  - height}
  />
{/each}
