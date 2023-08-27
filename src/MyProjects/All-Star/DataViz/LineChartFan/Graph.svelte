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
	import { transition} from 'd3-transition';
	
	import Line1 from "./Components/Line.svelte"
	
	export let Magic;
	export let Jordan;
	export let Jordan2;
	let year =[1992,1993]
// 	let color = "'#ffffff'";

	
	// @ts-ignore
	import AxisX from "./Components/AxisX.svelte"
	// @ts-ignore
	import AxisY from "./Components/AxisY.svelte";
	
	// the props
	export let data;
	export let show = true;
	let height = 450;
	let width = 1300;
	
	let path, path2, length, length2;
	
	const margin = {top:20 , right:40, left:50, bottom:0};
	
	// the scales
		$: xScale = scaleLinear()
		.domain(extent(data.map(d => d.edition_year)))
		.domain([1990, 2023])
		.range([0, width - margin.left - margin.right]);
	
		const yScale1 = scaleLinear()
		.domain(extent(data.map(d => d.nb_views)))
		.domain([0, 23])
		.range([height -margin.top - margin.bottom, 0]);
	
		const yScale2 = scaleLinear()
		.domain(extent(data.map(d => d.rtg)))
		.domain([0, 23])
		.range([height-margin.top - margin.bottom, 0]);

	// the area generator
		$: areaLine = area()
	  .x(d => xScale(d.edition_year))
	  .y0(yScale1(0))
	  .y1(d => yScale1(d.nb_views))
	  .curve(curveBasis);
	
	let DataJordanLeave = data.filter(d => d.edition_year >= 1993 && d.edition_year <=1996);
	let DataJordanLeave1 = data.filter(d => d.edition_year >= 1999 && d.edition_year <=2002);
	let DataJordanLeave2 = data.filter(d => d.edition_year >= 2004);

	let DataJordanReturn = data.filter(d => d.edition_year <=1993);
	let DataJordanReturn1 = data.filter(d => d.edition_year >= 1996 && d.edition_year <=1998);
	let DataJordanReturn2 = data.filter(d => d.edition_year >= 2002 && d.edition_year <=2004);
	
	// the path generator
		$: pathLine = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale1(d.nb_views))
		.curve(curveBasis);
	
		$: pathLine2 = line()
		.x(d => xScale(d.edition_year))
		.y(d => yScale2(d.rtg))
		.curve(curveBasis);
	
	// if the path is there, set dasharray attributes
		
 // @ts-ignore
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
// @ts-ignore
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
// @ts-ignore
		$: if (path && path2 && !show) {
		select(path)
			// @ts-ignore
			.transition().duration(2000)
				.attr('stroke-dashoffset', length);
		
		select(path2)
			// @ts-ignore
			.transition().duration(1000)
				.attr('stroke-dashoffset', length2);
	}
	
	 let mouseX = 0;
   let mouseY = 0;
   let displayVerticalLine = false;
	 let rtgValue = 0;
	 let YearValue = 0;
	 let ViewsValue = 0;
	
// 	 // event listener for mouseover on path1
//   function handleMouseOverPath1(event) {
//     mouseX = event.clientX;
//     mouseY = event.clientY;
// 		let displayVerticalLine = true;

//     // Find the corresponding data point
//     const invertedX = xScale.invert(mouseX -margin.right);
//     const correspondingDataPoint = data.find(
//       d => Math.abs(d.edition_year - invertedX) < 1
//     );

//     if (correspondingDataPoint) {
//       console.log('RTG:', correspondingDataPoint.rtg);
//       console.log('Edition Year:', correspondingDataPoint.edition_year);
//       console.log('Value:', correspondingDataPoint.nb_views);
//     }
//   }

	 // @ts-ignore
	 function handleMouseOutPath1() {
    displayVerticalLine = false;
		rtgValue = 0;
	 	YearValue = 0;
	 	ViewsValue = 0;
	
  }
	
// event listener for mouseover on path2
function handleMouseOverPath2(event) {
    mouseX = event.clientX ;
    mouseY = event.clientY;
		displayVerticalLine = true;

	// Convert mouseX from pixels to rems
	const mouseXRem = mouseX / parseFloat(getComputedStyle(document.documentElement).fontSize);

// Translate mouseXRem to the left by 20rem
const translatedXRem = mouseXRem - 40;

// Convert the translatedXRem back to pixels
mouseX = translatedXRem * parseFloat(getComputedStyle(document.documentElement).fontSize);

		
		// Find the corresponding data point
    const invertedX = xScale.invert(mouseX -margin.right);
    const correspondingDataPoint = data.find(
      d => Math.abs(d.edition_year - invertedX) < 1
    );

    if (correspondingDataPoint) {
			rtgValue = correspondingDataPoint.rtg;
	 		YearValue = correspondingDataPoint.edition_year;
		 	ViewsValue = correspondingDataPoint.nb_views;
      console.log('RTG:', correspondingDataPoint.rtg);
      console.log('Edition Year:', correspondingDataPoint.edition_year);
      console.log('Value:', correspondingDataPoint.nb_views);
	
    }
  }
</script>

<div class="chart-container" bind:clientWidth={width}>
<svg {width} {height}>
	<AxisY {yScale1} {width}/>
<!-- 	<g class="lines" transform="translate({margin.right})"> -->
	<g class="lines" transform="translate({margin.right})">
	<AxisX {xScale} {height} {margin}/>
	<path class="path1"
				bind:this={path}
				d={pathLine(data)}
				stroke-linecap="round"
				on:mouseover={handleMouseOverPath2}
				on:focus={handleMouseOverPath2}
				role="presentation"
	      aria-label="Path 1"/>
	<path class="path2"
				bind:this={path2}
				d={pathLine2(data)}
				stroke-linecap="round"
				on:mouseover={handleMouseOverPath2}
				on:focus={handleMouseOverPath2}
				role="presentation"
	      aria-label="Path 2"
	      />

		{#if Jordan}
				<path
            class="area2"
            d={areaLine(DataJordanLeave)}
            fill="#8C5643"
            opacity="0.2"
          />
				<path
            class="area2"
            d={areaLine(DataJordanLeave1)}
            fill="#8C5643"
            opacity="0.2"
          />
				<path
            class="area2"
            d={areaLine(DataJordanLeave2)}
            fill="#8C5643"
            opacity="0.2"
          />
		{/if} 
		{#if Jordan2}
				<path
            class="area2"
            d={areaLine(DataJordanReturn)}
            fill="#518743"
            opacity="0.2"
          />
				<path
            class="area2"
            d={areaLine(DataJordanReturn1)}
            fill="#518743"
            opacity="0.2"
          />
				<path
            class="area2"
            d={areaLine(DataJordanReturn2)}
            fill="#518743"
            opacity="0.2"
          />
		{/if}
		
		{#if Magic}
			<Line1  {year} {xScale} {margin} {height}/>
      {/if}
	</g>
	
</svg>

	<div class="tooltip">
		<p><span class="views-underline">#Views (Mill)</span></p>
		<p ><span class="rating-underline">RTG</span></p>
		
		
	</div>

	<!-- <div class="tooltip" style="position:absolute;
															top: 40px;
															left: 500px">
		<p><span>Year:</span><br> {YearValue}</p>	
		<p><span class="views-underline">#Views:</span> <br> <br> {ViewsValue} {ViewsValue <=1 ? "Million" : "Millions"}</p>
		<p ><span class="rating-underline">RTG:</span> <br><br>{rtgValue}</p>
		
		
	</div> -->
</div>

<style>

@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap');
	

	.rating-underline{
		border-bottom: 4px solid #733222;
	}
	.views-underline{
		border-bottom: 4px solid #4F6473;
	}
	
	span{
		font-size:1.3em;
		text-align: center;
		
	}
	
	p{
		font-size:0.7em;
		font-weight:700;
		font-family: 'Quicksand', sans-serif;
		text-align:center;
	}
	
	.tooltip{
		padding: 6px;
		/* background: #f4f1ee; */
		/* border: 2px solid; */
		pointer-events: none;
		/* border-radius: 20px; */
		/* border-color: #eaded3; */
/* 		transition: top 300ms ease, left 300ms ease; */
		position:absolute;
		top: 40px;
		left: 500px;
	}

	@media (max-width: 768px) {

		.tooltip{
		padding: 6px;
		pointer-events: none;
		top: 40px;
		left: 230px;
		}
		.path1{
			stroke: #476b8d;
			stroke-width: 3;
			fill: none;
		}
		.path2{
			stroke: #894044;
			stroke-width: 3;
			fill: none;
	}
    }

	
	.path1 {
		stroke: #476b8d;
		stroke-width: 4;
		fill: none;
	}
	.path2{
		stroke: #894044;
		stroke-width: 4;
		fill: none;
	}
</style>