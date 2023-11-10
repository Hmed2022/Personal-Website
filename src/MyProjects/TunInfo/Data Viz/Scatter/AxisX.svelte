<script>
    export let height;
    export let xScale;
    export let margin;
      export let option;
  
    let xTicks = [70,74,78,82,86,90,94,98];
        let xTicks2 = [70,74,78,82];
  </script>
  
  <g>
      {#if option}
    {#each xTicks as tick}
          <text 
        x={xScale(tick)} 
        y={height - margin.bottom}
        dy="6"
        dominant-baseline="hanging"
        >{tick} {tick == 98 ? ' Height (mm)' : ''}</text>
    {/each}
      {:else}
            {#each xTicks2 as tick}
          <text 
        x={xScale(tick)} 
        y={height - margin.bottom}
        dy="6"
        dominant-baseline="hanging"
        >{tick} {tick == 82 ? ' Height (mm)' : ''}</text>
    {/each}
      {/if}
  </g>
  
  
  <style>
      text {
          font-family: Quicksand
      }
  </style>