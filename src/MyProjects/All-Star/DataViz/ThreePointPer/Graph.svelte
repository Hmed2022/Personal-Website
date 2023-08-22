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

	
	import AxisX from "./Components/AxisX.svelte";
	import AxisY from "./Components/AxisY.svelte";

	let SliderMin = 1980;
	let avgTwo=0;
	let avgThree =0;

// @ts-ignore
function handleOnChange(event) {
    const correspondingDataPoint = data.find(
      d => d.edition == SliderMin
    );

    if (correspondingDataPoint) {
			avgTwo = correspondingDataPoint.avg_two;
	 		avgThree = correspondingDataPoint.avg_three;

			console.log("Year = ", SliderMin)
			console.log("avgtwo = ", avgTwo)
			console.log("avgThree = ", avgThree)

    }
  }
	
		
	
	// the props
	export let data;
	export let show;
	let height = 400;
	let width = 800;

	$: Axis = true;
	
	let path, path2, length, length2;
	// @ts-ignore
	let Avgpath, Avgpath2, Avglength, Avglength2;
	
	const margin = {top:20 , right:40, left:70, bottom:0};
	
	// the scales
		$: xScale = scaleLinear()
		.domain(extent(data.map(d => d.edition)))
		.domain([1980, 2023])
		.range([0, width - margin.left - margin.right]);
	
		const yScale1 = scaleLinear()
		.domain(extent(data.map(d => d.total_twopa)))
		.domain([0,240])
		.range([height -margin.top - margin.bottom, 0]);
	
		const yScale2 = scaleLinear()
		.domain(extent(data.map(d => d.total_threepa)))
		.domain([0, 240])
		.range([height-margin.top - margin.bottom, 0]);

	const yScaleAvg1 = scaleLinear()
		.domain(extent(data.map(d => d.avg_two)))
		.domain([0,90])
		.range([height -margin.top - margin.bottom, 0]);
	
		// @ts-ignore
		const yScaleAvg2 = scaleLinear()
		.domain(extent(data.map(d => d.avg_three)))
		.domain([0, 40])
		.range([height-margin.top - margin.bottom, 0]);
	
	// the path generator
		$: pathLine = line()
		.x(d => xScale(d.edition))
		.y(d => yScale1(d.total_twopa))
		.curve(curveBasis);
	
		$: pathLine2 = line()
		.x(d => xScale(d.edition))
		.y(d => yScale2(d.total_threepa))
		.curve(curveBasis);

	$: pathAvgLine = line()
		.x(d => xScale(d.edition))
		.y(d => yScaleAvg1(d.avg_two))
		.curve(curveBasis);
	
		$: pathAvgLine2 = line()
		.x(d => xScale(d.edition))
		.y(d => yScaleAvg1(d.avg_three))
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
	
let value = "Regular Season: Avg 2pt/3pt attempted Shots"
	let items = ["Regular Season: Avg 2pt/3pt attempted Shots","All-Star: 2pt/3pt attempted Shots"]

	// @ts-ignore
			$: if (value == "Regular Season: Avg 2pt/3pt attempted Shots") {
		Axis =false
	}

// @ts-ignore
		$: if (value == "All-Star: 2pt/3pt attempted Shots") {
		Axis =true
	}
	
</script>

<p> The chart below illustrates the difference between 3-point and 2-point attempted shots in :</p>
<div class="selector" >
	<select bind:value style="font-size: 1.2em;
    font-family: Quicksand;
	 text-align: center;
	 border: none;
     background-color: #eaded3;">
        {#each items as item}
         <option value={item}>{item}</option> 
        {/each}
    </select>
</div>

<!-- <label>
	<input type=number bind:value={SliderMin} min=1980 max=2023 on:change={handleOnChange}>
	<input type=range bind:value={SliderMin}  min=1980 max=2023 on:change={handleOnChange}>
</label> -->

{#if value == "All-Star: 2pt/3pt attempted Shots"}
	<div class="selector2" >
<span class="two-att-underline"
			style="color:#E39725;
						 margin-right: 1%;"
			role="button"
      tabindex="0"
      aria-label="Two Points Attempted">Two Points Attempted</span>
	<span class="three-att-underline"
				style="color:#A95106;
							 margin-left: 1%;"
				role="button"
	      tabindex="0"
	      aria-label="Three Points Attempted">Three Points Attempted</span>
	</div>

<div class="chart-container" bind:clientWidth={width}>
<svg {width} {height}>
	<AxisY {yScale1} {yScaleAvg1} {width} {Axis}/>
	
	<g class="lines" transform="translate({margin.right})">
	<AxisX {xScale} {height} {margin} />
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

	</g>	
</svg>
</div>
	
{:else if value =="Regular Season: Avg 2pt/3pt attempted Shots"}
<div class="selector2" >
<span class="two-avg-underline"
			style="color:#82C9D9;
						 margin-right: 1%;"
			role="button"
      tabindex="0"
      aria-label="Average 2pt Attempted per Game">Average 2pt Attempted per Game</span>
	<span class="three-avg-underline"
				style="color:#125773;
							 margin-left: 1%;"
				role="button"
	      tabindex="0"
	      aria-label="Average 3pt Attempted per Game">Average 3pt Attempted per Game</span>
	</div>
<div class="chart-container" bind:clientWidth={width}>
<svg {width} {height}>
	<AxisY {yScale1} {yScaleAvg1} {width} {Axis}/>
	
	<g class="lines" transform="translate({margin.right})">
	<AxisX {xScale} {height} {margin}/>
	<path class="pathAvg1"
				bind:this={path}
				d={pathAvgLine(data)}
				stroke-linecap="round"
				/>
	<path class="pathAvg2"
				bind:this={path2}
				d={pathAvgLine2(data)}
				stroke-linecap="round"
				/>	
	</g>	
</svg>
</div>
	{/if}


<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

p {
        display: block;
        text-align: justify;
        font-family: 'Quicksand', sans-serif;
        color: #403F3E;
        font-size: 1em;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }    
	
	span {
		font-family: 'Quicksand', sans-serif;
		font-weight: 800;

	}

	.two-att-underline{
		border-bottom: 4px solid #E39725;
	}

	.three-att-underline{
		border-bottom: 4px solid #A95106;
	}

	.two-avg-underline{
		border-bottom: 4px solid #82C9D9;
	}

	.three-avg-underline{
		border-bottom: 4px solid #125773;
	}

	.selector{
		 display: flex;
	  justify-content: center;
		align-items: center;
	}

	.selector2{
		margin-top:2%;
		 display: flex;
	  justify-content: center;
		align-items: center;
	}

	.path1 {
		stroke: #E39725;
		stroke-width: 4;
		fill:none;
		
	}
	.path2{
		stroke: #A95106;
		stroke-width: 4;
		fill:none;
	}

	.pathAvg1 {
		stroke: #82C9D9;
		stroke-width: 4;
		fill:none;
		
	}
	.pathAvg2{
		stroke: #125773;
		stroke-width: 4;
		fill:none;
	
	}
</style>