<script>
	// 	Note: Due to REPL limitations, full responsiveness may not work here. Download the example from here or from the website (https://layercake.graphics/example/ColumnStacked) and run locally to get all features.
	// @ts-ignore
	import { LayerCake, Svg, flatten } from 'layercake';
	// @ts-ignore
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	// @ts-ignore
	import { format, precisionFixed } from 'd3-format';
  // @ts-ignore
  import { stack, stackOffsetNone, stackOffsetExpand } from 'd3-shape';
	// @ts-ignore
	import { sum } from 'd3-array';
	
	// @ts-ignore
	import Bar, { getGroupExtents, getStackExtents, stackOffsetSeparated } from './Components/Bar.svelte';
	import AxisX from './Components/AxisX.svelte';
	import AxisY from './Components/AxisY.svelte';

	export let Height;

	// import data from './fruitOrdinal.js';
	import data from './Data/data.js';
	// let data2 = data3.sort((a, b) => a.rank - b.rank);

	export let SetYear;
	

	
	import { afterUpdate } from 'svelte';

	
	let filteredPlayers = data.filter(d => d.year == SetYear);
	// @ts-ignore
	let sortedPlayers = filteredPlayers.sort((a, b) => a.rank - b.rank);
	
	// let sortedPlayers = filteredPlayers.sort((a, b) => a.rank - b.rank);

	
	
	afterUpdate(() => {
	 filteredPlayers = data.filter(d => d.year == SetYear);
	// Sort the filtered players in descending order of rank
	 // @ts-ignore
	 sortedPlayers = filteredPlayers.sort((a, b) => a.rank - b.rank);
	
	});
	
	import { pivot } from './Components/utils.js'
	
	let layout = 'stacked';  // stacked, grouped, percent, or separated
	
	$: options = layout === 'grouped' ? { layout: 'grouped' }
		: layout === 'stacked' ? { layout: 'stacked' }
		:	{}
	
	
	const groupBy = 'year';
	const stackBy = 'player';
	const pivotData = pivot(sortedPlayers, groupBy, stackBy, items => sum(items, d => d.percentage_of_votes));
	const stackKeys = Object.keys(pivotData[0]).filter(d => d !== groupBy);
	export let keyColors;


	
	$: extents = {
// 		y: isStacked ? getStackExtents(data, keys) : getGroupExtents(data, keys)
		// @ts-ignore
		y: getStackExtents(sortedPlayers, groupBy, stackBy, options.offset)
	}
</script>


<label>
	<input type="radio" bind:group={layout} value="stacked">
	Stacked
</label>

<label>
	<input type="radio" bind:group={layout} value="grouped">
	Grouped
</label>


<div class="chart-container" style="height:{Height}px">
	<LayerCake
		data = {sortedPlayers}
		{extents}
		
		x={groupBy}
		xScale={scaleBand().paddingInner(0.1)}
		xDomain={sortedPlayers.map(d => d[groupBy])}

		y={d => d}
		yNice

		r={d => d}
		rScale={scaleOrdinal()}
		rDomain={stackKeys}
		rRange={keyColors}

		padding={{ top: 20, bottom: 20, left: 30 }}
	>
		<Svg>
			<AxisX
				gridlines={false}
			/>
			<AxisY
				ticks={4}
				gridlines={true}
			/>
			
			<Bar {groupBy} {stackBy} {...options} />
		</Svg>
	</LayerCake>
</div>




<style>

	label {
		text-align:center;
		color: #024873;
		font-family: Quicksand;
		font-size: 17px;
		font-weight: 500;
		
	}
	/*
		The wrapper div needs to have an explicit width and height in CSS.
		It can also be a flexbox child or CSS grid element.
		The point being it needs dimensions since the <LayerCake> element will
		expand to fill it.
	*/
	.chart-container {
		width: 100%;
	
		_background-color: rgba(0,0,0,.1);
	}
</style>
