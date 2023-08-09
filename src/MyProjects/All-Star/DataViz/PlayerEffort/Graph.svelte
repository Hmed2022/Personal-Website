<script>
	// @ts-ignore
	import { select } from 'd3-selection';
	// @ts-ignore
	import { extent } from 'd3-array';
	// @ts-ignore
	import { scaleLinear } from 'd3-scale';
	// @ts-ignore
	import { line, curveBasis,area,curveCatmullRom } from 'd3-shape';
	// @ts-ignore
	import { transition } from 'd3-transition';
	
	import AxisX from "./Components/AxisX.svelte";
	import AxisY from "./Components/AxisY.svelte";
	
	// the props
	export let data;
	export let show;
	let height = 400;
	let width = 800;
	
	let path, path2, path3,path4, length, length2, length3,length4;
	
	export let sumFTA, sumORB,sumPF,sumStocks;
	let opacityFTA = 1;
  let opacityORB = 1;
  let opacityPF = 1;
  let opacityStocks = 1;
	
	let opacity=0.1;

	function resetOpacity(){
		opacityFTA = 1;
	  opacityORB = 1;
	  opacityPF = 1;
	  opacityStocks = 1;
	}

// @ts-ignore
		$: if (sumFTA) {
		opacityFTA =1;
	  opacityORB =opacity;
		opacityPF =opacity;
		opacityStocks=opacity;
	} else {
		 resetOpacity()
	} 

	// @ts-ignore
			$: if (sumORB) {
		opacityORB =1;
	  opacityFTA =opacity;
		opacityPF =opacity;
		opacityStocks=opacity;
	} else {
		 resetOpacity()
	}

	// @ts-ignore
			$: if (sumPF) {
			opacityPF=1;
	   opacityORB =opacity;
		opacityFTA =opacity;
		opacityStocks=opacity;
	}else {
		 resetOpacity()
	}

	// @ts-ignore
			$: if (sumStocks) {
			opacityStocks=1;
	   opacityORB =opacity;
		opacityPF =opacity;
		opacityFTA=opacity;
	} else {
		 resetOpacity()
	}
	
	
	const margin = {top:20 , right:30, left:70, bottom:0};
	
	// the scales
		$: xScale = scaleLinear()
		.domain(extent(data.map(d => d.edition_year)))
		.domain([1974, 2025])
		.range([0, width - margin.left - margin.right]);
	
		const yScale1 = scaleLinear()
		.domain(extent(data.map(d => d.sum_fta)))
		.domain([0,100])
		.range([height -margin.top - margin.bottom, 0]);
	
	
	// the path generator
		$: pathLine = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale1(d.sum_fta))
		.curve(curveBasis);
	
		$: pathLine2 = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale1(d.sum_pf))
		.curve(curveBasis);

		$: pathLine3 = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale1(d.sum_orb))
		.curve(curveBasis);


		$: pathLine4 = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale1(d.sum_stocks))
		.curve(curveBasis);
	

	
	// if the path is there, set dasharray attributes
		
 // @ts-ignore
 		$: if (path && path2 && path3 && path4) {
		// first calculate the length
		length = path.getTotalLength();
		length2 = path2.getTotalLength();
		length3 = path3.getTotalLength();
		length4 = path4.getTotalLength();
		
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

		select(path3)
			.attr('stroke-dasharray', `${length3} ${length3}`)
			.attr('stroke-dashoffset', length3)
			.transition().duration(2000)
			.attr('stroke-dashoffset', 0);

		select(path4)
			.attr('stroke-dasharray', `${length4} ${length4}`)
			.attr('stroke-dashoffset', length4)
			.transition().duration(2000)
			.attr('stroke-dashoffset', 0);
	
	}	
	
	
	// if the path should be shown, move it in
// @ts-ignore
		$: if (path && path2 && path3 && path4 && show ) {
		select(path)
			// @ts-ignore
			.transition().duration(3000)
				.attr('stroke-dashoffset', 0);
		select(path2)
			// @ts-ignore
			.transition().duration(3000)
				.attr('stroke-dashoffset', 0);

		select(path3)
			// @ts-ignore
			.transition().duration(3000)
				.attr('stroke-dashoffset', 0);

		select(path4)
			// @ts-ignore
			.transition().duration(3000)
				.attr('stroke-dashoffset', 0);
	}
	
	// if the path should be hidden, move it out
// @ts-ignore
		$: if (path && path2 && path3 && path4 && !show) {
		select(path)
			// @ts-ignore
			.transition().duration(2000)
				.attr('stroke-dashoffset', length);
		
		select(path2)
			// @ts-ignore
			.transition().duration(1000)
				.attr('stroke-dashoffset', length2);

		select(path3)
			// @ts-ignore
			.transition().duration(1000)
				.attr('stroke-dashoffset', length3);

		select(path4)
			// @ts-ignore
			.transition().duration(1000)
				.attr('stroke-dashoffset', length4);
	}
	
</script>

<div class="chart-container" bind:clientWidth={width}>
<svg {width} {height}>
	<AxisY {yScale1} {width}/>
	
	<g class="lines" transform="translate({margin.right})">
	<AxisX {xScale} {height} {margin}/>
	
	<path class="path1"
			style="opacity:{opacityFTA}"
				bind:this={path}
				d={pathLine(data)}
				stroke-linecap="round"
				/>
	
	<path class="path2"
		style="opacity:{opacityORB}"
				bind:this={path2}
				d={pathLine2(data)}
				stroke-linecap="round"
				/>	
	
		<path class="path3"
			style="opacity:{opacityPF}"
				bind:this={path3}
				d={pathLine3(data)}
				stroke-linecap="round"
				/>	

		<path class="path4"
				style="opacity:{opacityStocks}"
				bind:this={path4}
				d={pathLine4(data)}
				stroke-linecap="round"
				/>	

	</g>	
</svg>
</div>

<style>
	
	.path1 {
		stroke: #6DA0A6;
		stroke-width: 4;
		fill:none;
		
	}
	.path2{
		stroke: #EEBE96;
		stroke-width: 4;
		fill:none;
	
	}

	.path3{
		stroke: #F2C2BD;
		stroke-width: 4;
		fill:none;
	
	}
	.path4{
		stroke: #B06961;
		stroke-width: 4;
		fill:none;
	
	}
</style>