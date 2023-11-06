<script>
	let xTicks = [0, 10,20,30,40,50,60,70];
	export let xScale;
	// export let height;
	export let margin;
	
</script>
    <g>
{#each xTicks as tick}
			<text x={xScale(tick)}
						y= {margin.top}
						dx="-12"
						dominant-baseline ="hanging"
						>{#if tick == 10}
							1/2
						{:else if tick == 20}
							1
							{:else if tick == 30}
							5
							{:else if tick == 40}
							10
							{:else if tick == 50}
							20
							{:else if tick == 60}
							30
							{:else if tick == 70}
							50
						{/if}</text>
					
		{/each}
</g>


<style>

	text {
		font-size: 2em;
	}

</style>