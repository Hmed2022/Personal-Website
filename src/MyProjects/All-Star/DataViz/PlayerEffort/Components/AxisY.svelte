<script>
	let yTicks = [0,10,20,30,40,50,60,70,80,90];
	export let yScale1;
	export let width;
</script>

<g>
{#each yTicks as tick}
	<text x="0"
				y={yScale1(tick)}
					dy="-2"> {tick}</text>
	<line x1="0"
				y1={yScale1(tick)}
				x2={width}
				y2={yScale1(tick)}
				stroke="#cecece"/>
{/each}
</g>

<style>
	
	text{
		font-family: quicksand
	}

</style>