<script>
	let yTicks = [0,20,40,60,80,100,120,140,160];
	export let yScale2;
	export let width;
</script>

<g>
{#each yTicks as tick}
	<text x="0"
				y={yScale2(tick)}
					dy="-2"> {tick}</text>
	<line x1="0"
				y1={yScale2(tick)}
				x2={width}
				y2={yScale2(tick)}
				stroke="#cecece"/>
{/each}
</g>

<style>
	
	text{
		font-family: quicksand
	}

</style>