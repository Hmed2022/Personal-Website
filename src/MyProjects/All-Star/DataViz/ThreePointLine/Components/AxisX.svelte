<script>
	let xTicks = [1980,1985,1990,1995,2000,2005,2010,2015,2020];
	export let xScale;
	export let height;
	export let margin;
</script>

<g>
{#each xTicks as tick}
	<text x={xScale(tick)}
				y={height - margin.bottom}
				dy="-15"
				dominant-baseline ="hanging"
				> {tick}</text>
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
</style>