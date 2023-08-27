<script>
// @ts-nocheck

	import { select } from 'd3-selection';
	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';
	import { line, curveBasis,area,curveCatmullRom } from 'd3-shape';
	import { transition} from 'd3-transition';
	
	import AxisX from "./Components/AxisX.svelte";
	import AxisY from "./Components/AxisY.svelte";
	
	// the props
	export let data;
	export let show;
	let height = 400;
	let width = 800;
	
	let path, path2, length, length2;
	
	export let curry, curryStar;
	
	const margin = {top:20 , right:40, left:30, bottom:0};
	
	// the scales
		$: xScale = scaleLinear()
		.domain(extent(data.map(d => d.edition_year)))
		.domain([1980, 2023])
		.range([0, width - margin.left - margin.right]);
	
		const yScale1 = scaleLinear()
		.domain(extent(data.map(d => d.total_threep)))
		.domain([0,70])
		.range([height -margin.top - margin.bottom, 0]);
	
		const yScale2 = scaleLinear()
		.domain(extent(data.map(d => d.total_threepa)))
		.domain([0, 170])
		.range([height-margin.top - margin.bottom, 0]);
	
	// the path generator
		$: pathLine = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale2(d.total_threep))
		.curve(curveBasis);
	
		$: pathLine2 = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale2(d.total_threepa))
		.curve(curveBasis);
	
	$: areaLine2 = area()
  .x(d => xScale(d.edition_year))
  .y0(yScale2(0))
  .y1(d => yScale2(d.total_threepa))
  .curve(curveBasis);
	
	let filteredData = data.filter(d => d.edition_year >= 2010);
	let filteredData2_1 = data.filter(d => d.edition_year >= 2014 && d.edition_year <2020);
	let filteredData2_2 = data.filter(d => d.edition_year >=2021);
	
	

	
	// if the path is there, set dasharray attributes
		
 	$: if (path && path2) {
		// first calculate the length
		length = path.getTotalLength();
		length2 = path2.getTotalLength();
		
		// then set the attributes based on it
		select(path)
			.attr('stroke-dasharray', `${length} ${length}`)
			.attr('stroke-dashoffset', length)
			.transition().duration(2000)
				.attr('stroke-dashoffset', 0);
	
	select(path2)
			.attr('stroke-dasharray', `${length2} ${length2}`)
			.attr('stroke-dashoffset', length2)
			.transition().duration(2000)
			.attr('stroke-dashoffset', 0);
	
	}	
	
	
	// if the path should be shown, move it in
	$: if (path && path2 && show ) {
		select(path)
			// @ts-ignore
			.transition().duration(3000)
				.attr('stroke-dashoffset', 0);
		select(path2)
			// @ts-ignore
			.transition().duration(3000)
				.attr('stroke-dashoffset', 0);
	}
	
	// if the path should be hidden, move it out
	$: if (path && path2 && !show) {
		select(path)
			.transition().duration(2000)
				.attr('stroke-dashoffset', length);
		
		select(path2)
			.transition().duration(1000)
				.attr('stroke-dashoffset', length2);
	}
	

		
	
</script>

<div class="chart-container" bind:clientWidth={width}>
<svg {width} {height}>
	<AxisY {yScale2} {width}/>
	
	<g class="lines" transform="translate({margin.right})">
	<AxisX {xScale} {height} {margin}/>
	<path class="path1"
				bind:this={path}
				d={pathLine(data)}
				stroke-linecap="round"
				/>
	<path class="path2"
				bind:this={path2}
				d={pathLine2(data)}
				stroke-linecap="round"
				/>	
		{#if curry}
		<path
            class="area2"
            d={areaLine2(filteredData)}
            fill="#F27830"
            opacity="0.2"
          />
		{/if}
		{#if curryStar}
		<path
            class="area2"
            d={areaLine2(filteredData2_1)}
            fill="#F27830"
            opacity="0.4"
          />
		<path
            class="area2"
            d={areaLine2(filteredData2_2)}
            fill="#F27830"
            opacity="0.4"
          />
		{/if}

	</g>	
</svg>
</div>

<style>
	
	.path1 {
		stroke: #F27830;
		stroke-width: 4;
		fill:none;
		
	}
	.path2{
		stroke: #894044;
		stroke-width: 4;
		fill:none;
	
	}
</style>