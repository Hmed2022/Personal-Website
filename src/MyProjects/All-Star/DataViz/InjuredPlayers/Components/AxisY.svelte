<script>
	import { getContext } from 'svelte';

	const { padding, xRange, yScale } = getContext('LayerCake');

	export let ticks = 4;
	export let tickMarks = false;
	export let gridlines = true;
	export let xTick = 0;
	export let yTick = 0;
	export let dxTick = 0;
	export let dyTick = -5;
	export let textAnchor = 'start';

	$: isBandwidth = typeof $yScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks) ? ticks :
		isBandwidth ?
			$yScale.domain() :
			typeof ticks === 'function' ?
				// @ts-ignore
				ticks($yScale.ticks()) :
					$yScale.ticks(ticks);
</script>

<g class='axis y-axis' transform='translate({-$padding.left}, 0)'>
	{#each tickVals as tick, i}
		<g class='tick tick-{tick}' transform='translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {$yScale(tick)})'>
			{#if gridlines !== false}
				<line
					class="gridline"
					x2='100%'
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
				></line>
			{/if}
			{#if tickMarks === true}
				<line
					class='tick-mark'
					x1='0'
					x2='{isBandwidth ? -6 : 6}'
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
				></line>
			{/if}
			<text
				x='{xTick}'
				y='{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}'
				dx='{isBandwidth ? -9 : dxTick}'
				dy='{isBandwidth ? 4 : dyTick}'
				style="text-anchor:{isBandwidth ? 'end' : textAnchor};"
			>{tick}%</text>
		</g>
	{/each}
</g>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');
	.tick {
		font-size: .8em;
		font-weight: 300;
		font-family: 'Quicksand', sans-serif;
	}

	.tick line {
		stroke: #aaa;
	}
	.tick .gridline {
		stroke: 2;
		opacity:0.4
	}

	.tick text {
		fill: #666;
	}

	.tick.tick-0 line {
		stroke: 0;
	}
</style>
