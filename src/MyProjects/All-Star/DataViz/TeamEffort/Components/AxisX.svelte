<script>
  export let height;
  export let xScale;
  export let margin;

  let xTicks = [90,95,100,105,110,115,120,125,130,135,140,145];
</script>

<g>
  {#each xTicks as tick}
	    <text 
      x={xScale(tick)} 
      y={height - margin.bottom}
      dy="6"
      dominant-baseline="hanging"
      >{tick} {tick == 145 ? ' Drtg' : ''}</text>
  {/each}
</g>

<g>
  {#each xTicks as line}
  <line
            class="vert-line"
            x1={xScale(line)}
            x2={xScale(line)}
            y1={height - margin.bottom}
            y2={height-margin.top-10}
          />
  {/each}
  </g>

<style>

@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
	text {
		font-family: 'Quicksand', sans-serif;
	}

  .vert-line{
		 stroke: #cecece;
		
    
	}

  @media (max-width: 512px) {
		text {
		font-family: 'Quicksand', sans-serif;
    font-size: 0.75em;
	}
	}
</style>