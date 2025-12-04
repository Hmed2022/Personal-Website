<script>
	let xTicks = [1980,1985,1990,1995,2000,2005,2010,2014,2018,2025];
	export let xScale;
	export let height;
	export let margin;

	let space = 34

	function updateVariables() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 475) { 
      space = 28; 
    } else {
      space = 34; 
    }
  }

  updateVariables();
  window.addEventListener('resize', updateVariables);
</script>

<g>
	{#each xTicks as tick,i}
	{#if i == xTicks.length-1}
		<text x={xScale(tick)-space}
					y={height - margin.bottom}
					dy="-15"
					dominant-baseline ="hanging"
					> {tick}</text>
	{:else}		
		<text x={xScale(tick)}
						y={height - margin.bottom}
						dy="-15"
						dominant-baseline ="hanging"
						> {tick}</text>	
	{/if}	
	{/each}
	</g>

<g>
{#each xTicks as line}
<line
          class="vert-line"
          x1={xScale(line)}
          x2={xScale(line)}
          y1={height - margin.bottom}
          y2={height-margin.top}
        />
{/each}
</g>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
	
	.vert-line{
		 stroke: #cecece;
		
    
	}
	
	text {
		font-size: 0.9em;
		font-family: 'Quicksand', sans-serif;
	}

	@media (max-width: 475px) {
		text {
		font-size: 0.75em;
		font-family: 'Quicksand', sans-serif;
	}
	}
</style>