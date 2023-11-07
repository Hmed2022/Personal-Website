<script>
		// 	Note: Due to REPL limitations, full responsiveness may not work here. Download the example from here or from the website (https://layercake.graphics/example/Beeswarm) and run locally to get all features.
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';

	import Key from './Key-html.svelte';
	import AxisX from './AxisX.svelte';
	import Beeswarm from './BeeswarmForce.svelte';

	import data from './Data/data.js';

	const xKey = 'issued';
	const zKey = 'occupation';
	const titleKey = 'name';
	const Value = "value";

	const r = 10;

	const seriesNames = new Set();
	const seriesColors = ['#89a057', '#3e558e', '#d5c4a1', '#d06f5f', '#8b5e3c', '#78a2b7', '#6f4e77', '#cfd8dc'];



	const dataTransformed = data.map(d => {
		seriesNames.add(d[zKey]);

		return {
			[titleKey]: d[titleKey],
			[zKey]: d[zKey],
			[Value]: d[Value],
			[xKey]: +d[xKey].split('-')[0]
		}
	})

</script>

<style>
	/*
		The wrapper div needs to have an explicit width and height in CSS.
		It can also be a flexbox child or CSS grid element.
		The point being it needs dimensions since the <LayerCake> element will
		expand to fill it.
	*/
	.chart-container {
		width:500px;
		height: 250px;
	}
</style>

<div class='chart-container'>
	<LayerCake
		padding={{bottom: 15}}
		x={xKey}
		z={zKey}
		zScale={scaleOrdinal()}
		zDomain={Array.from(seriesNames)}
		zRange={seriesColors}
		data={dataTransformed}
		let:width
	>

		<Svg>
			<AxisX/>
			<Beeswarm
				r={width < 400 ? r / 1.25 : r}
				strokeWidth={1}
				xStrength={0.95}
				yStrength={0.075}
				getTitle={d => d[titleKey]}
			/>
		</Svg>

		<Html pointerEvents={false}>
			<Key shape='circle' />
		</Html>

	</LayerCake>
</div>
