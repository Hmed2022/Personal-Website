<script>
    export let width;
    export let yScale;
    export let margin;
      export let option
  
    let yTicks = [135,140,145,150,155,160,165,170,175,180,185];
      let yTicks2 = [135,140,145,150,155,160,165,170];
  </script>
  
  <g transform="translate({margin.left} {margin.top})">
          {#if option}
    {#each yTicks as tick}
          <text 
        x={0} 
        y={yScale(tick)}
        dy="-6"
        >{tick} {tick == 185 ? ' Width (mm)' : ''}</text>
          
        <line 
          x1="0" 
          y1={yScale(tick)} 
          x2={width} 
          y2={yScale(tick)} 
          stroke={tick == 0 ? 'black' : "#cecece"} />
    {/each}
          {:else}
              {#each yTicks2 as tick}
          <text 
        x={0} 
        y={yScale(tick)}
        dy="-6"
        >{tick} {tick == 170 ? ' Width (mm)' : ''}</text>
          
        <line 
          x1="0" 
          y1={yScale(tick)} 
          x2={width} 
          y2={yScale(tick)} 
          stroke={tick == 0 ? 'black' : "#cecece"} />
    {/each}
          {/if}
  </g>
  
  <style>
      text {
          font-family: Quicksand
      }
  </style>