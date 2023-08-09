<script>
	let yTicks = [0,20,40,60,80,100,120,140,160,180,200,220];
	let yTicks1 = [0,10,20,30,40,50,60,70,80];
	export let yScale1;
	export let yScaleAvg1;
	export let width;

	export let Axis;
</script>


{#if Axis}
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
{:else}
	<g>
		{#each yTicks1 as tick}
			<text x="0"
						y={yScaleAvg1(tick)}
							dy="-2"> {tick}</text>
			<line x1="0"
						y1={yScaleAvg1(tick)}
						x2={width}
						y2={yScaleAvg1(tick)}
						stroke="#cecece"/>
		{/each}
		</g>
{/if}

<style>
	
	text{
		font-family: quicksand
	}

</style>