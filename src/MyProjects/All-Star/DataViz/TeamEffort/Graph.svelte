<script>
  import data from "./Data/data.js";


  let width = 400;
  let height = 600;

  const margin = { top: 0, right: 60, left: 10, bottom: 30 };

  import { scaleLinear } from "d3-scale";
	import {area } from 'd3-shape';
  $: xScale = scaleLinear()
    .domain([90, 145])
    .range([40, width - margin.left - margin.right]);

  const yScale = scaleLinear()
    .domain([90, 146])
    .range([height - margin.top - margin.bottom, 20]);

  import AxisX from "./Components/AxisX.svelte";
  import AxisY from "./Components/AxisY.svelte";
  import Tooltip from "./Components/Tooltip.svelte";

  let hoveredData;
	let hovering = false;

	export let SetYear;

	export let case1,case2,case3,case4;
	
  let wider =true
	function updateVariables() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 512) { 
      wider=false
    } else {
      wider =true
    }
  }

  updateVariables();
  window.addEventListener('resize', updateVariables);

</script>

<div class='chart-container' 
	role="navigation"
  bind:clientWidth={width}
  on:mouseleave={() => {
    hoveredData = null
		hovering = false;
		
  }}>
<svg {width} {height}>
  <AxisX {height} {xScale} {margin} />
  <AxisY {width} {yScale} {margin} />
	{#if case1}
	 <rect
      x={xScale(90)}  
      y={yScale(150)} 
      width={xScale(110) - xScale(90)}  
      height={yScale(110) - yScale(150)} 
      fill="#4D6473" 
      opacity="0.5" 
    />
	{/if}
	{#if case2}
	 <rect
      x={xScale(90)}  
      y={yScale(110)} 
      width={xScale(110) - xScale(90)}  
      height={yScale(90) - yScale(110)} 
      fill="#4D6473" 
      opacity="0.5" 
    />
	{/if}
	{#if case3}
	   <rect
      x={xScale(110)}  
      y={yScale(150)} 
      width={xScale(150) - xScale(110)}  
      height={yScale(110) - yScale(150)} 
      fill="#733122" 
      opacity="0.5" 
    />
	{/if}
	{#if case4}
	 <rect
      x={xScale(110)}  
      y={yScale(110)} 
      width={xScale(150) - xScale(110)}  
      height={yScale(90) - yScale(110)} 
      fill="#733122" 
      opacity="0.5" 
    />
	{/if}
  <g class='circles' transform="translate({margin.left} {margin.top})">
  {#each data as team}
		{#if team.edition < SetYear }
	  <circle cx={xScale(team.drtg)} 
            cy={yScale(team.oftg)} 
            r={hovering && hoveredData == team ? "20" : "10"}
            opacity={hovering ?  hoveredData == team ? "1" : ".3" : "1"}
            fill="#8C5642"
            stroke="#D9D4CC" 
						role="navigation"
            on:mouseover={() => {
              hoveredData = team
							hovering = true;
            }}
						on:mouseleave={() => {
              hovering = false
            }}
            on:focus={() => {
              hoveredData = team;
            }}
            tabIndex="0"
            />
			{:else}
      {#if wider}
			<circle cx={xScale(team.drtg)} 
            cy={yScale(team.oftg)} 
            r={hovering && hoveredData == team ? "20" : "10"}
            opacity={hovering ?  hoveredData == team ? "1" : ".3" : "1"}
            fill="#D9D4CC"
            stroke="#8C5642" 
						role="navigation"
            on:mouseover={() => {
              hoveredData = team
							hovering = true;
            }}
						on:mouseleave={() => {
              hovering = false
            }}
            on:focus={() => {
              hoveredData = team;
            }}
            tabIndex="0"
            />
            {:else}
            <circle cx={xScale(team.drtg)} 
            cy={yScale(team.oftg)} 
            r={hovering && hoveredData == team ? "12" : "7"}
            opacity={hovering ?  hoveredData == team ? "1" : ".3" : "1"}
            fill="#D9D4CC"
            stroke="#8C5642" 
						role="navigation"
            on:mouseover={() => {
              hoveredData = team
							hovering = true;
            }}
						on:mouseleave={() => {
              hovering = false
            }}
            on:focus={() => {
              hoveredData = team;
            }}
            tabIndex="0"
            />
            {/if}
		{/if}
  {/each}
  </g>
</svg>
{#if hovering}
	<Tooltip data={hoveredData} {xScale} {yScale} />
{/if}
</div>

<style>
  circle {
    transition: r 200ms ease, opacity 200ms ease;
    cursor: pointer;
  }

  circle:focus {
    outline: none;
  }

</style>