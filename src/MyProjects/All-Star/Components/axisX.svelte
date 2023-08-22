<script>
	let xTicks = [1990,1995,2000,2005,2010,2015,2020,2025];
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

<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');

	text {
		font-size: 0.5em;
		font-family: 'Quicksand', sans-serif;
        color: #403F3E;
	}
</style>