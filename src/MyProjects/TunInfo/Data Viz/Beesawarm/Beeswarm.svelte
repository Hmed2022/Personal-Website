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
const sex = "gender";
const year = "tier"

const r = 10;

const seriesNames = new Set();
const seriesNames2 = new Set();
const seriesNames3 = new Set();
const seriesColors = ['#89a057', '#3e558e', '#d5c4a1', '#d06f5f', '#8b5e3c', '#78a2b7', '#6f4e77', '#cfd8dc',"#D9669B"];
const seriesColors2 = ["#417FA6", "#D9669B"]
const seriesColors3 = ['#89a057', '#3e558e', '#d5c4a1', '#d06f5f', '#8b5e3c', '#78a2b7'];
		let activeButton = 'occupation'; // Default to the first button

function setActive(button) {
	activeButton = button;
}

 $: zRange = activeButton === "gender" ? seriesColors2 :
		activeButton === "appreciation" ? seriesColors3 :
		seriesColors; 
 $: zAxis = activeButton === "gender" ? sex :
		  activeButton === "appreciation" ? year :
						zKey;

const dataTransformed = data.map(d => {
	seriesNames.add(d[zKey]);

	return {
		[titleKey]: d[titleKey],
		[zKey]: d[zKey],
		[Value]: d[Value],
		[xKey]: +d[xKey].split('-')[0],
		[sex]: d[sex],
		[year]: d[year]
	}
})


const dataTransformed2 = data.map(d => {
	seriesNames2.add(d[sex]);

	return {
		[titleKey]: d[titleKey],
		[xKey]: +d[xKey].split('-')[0],
		[sex]: d[sex]
	}
})

const dataTransformed3 = data.map(d => {
	seriesNames3.add(d[year]);

	return {
		[titleKey]: d[titleKey],
		[Value]: d[Value],
		[xKey]: +d[xKey].split('-')[0],
		[year]: d[year]
	}
})


$: dataTrans = activeButton === "gender" ? dataTransformed2 :
		  activeButton === "appreciation" ? dataTransformed3 :
						dataTransformed;

	 $: series = activeButton === "gender" ? seriesNames2 :
		  activeButton === "appreciation" ? seriesNames3 :
						seriesNames;

</script>


<div class='chart-container'>
<div style="text-align:center; margin-bottom:5%">
<button
	on:click={() => setActive('occupation')}
	class:active={activeButton === 'occupation'}>
	Occupation
</button>
<button
	on:click={() => setActive('gender')}
	class:active={activeButton === 'gender'}>
	Gender
</button>
<button
	on:click={() => setActive('appreciation')}
	class:active={activeButton === 'appreciation'}>
	Appreciation years
</button>
</div>

<LayerCake
	padding={{bottom: 15}}
	x={xKey}
	z={zAxis}
	zScale={scaleOrdinal()}
	zDomain={Array.from(series)}
	zRange={zRange}
	data={dataTrans}
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




<style>
/*
	The wrapper div needs to have an explicit width and height in CSS.
	It can also be a flexbox child or CSS grid element.
	The point being it needs dimensions since the <LayerCake> element will
	expand to fill it.
*/
.chart-container {
	width: 500px;
	height: 250px;
}
</style>

