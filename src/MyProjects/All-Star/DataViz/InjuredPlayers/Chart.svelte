<script>
  import { scaleBand, scaleLinear } from "d3-scale";
	import {fade,slide} from "svelte/transition"

  export let data;

  let width = 600;
  let height = 600;

	export let SetYear;


	function handleClick(d) {
    SetYear = d.year;
  }

	 let hoveredYear = null; // Variable to track the year being hovered over


  // Function to handle mouse enter event
  function handleMouseEnter(d) {
    hoveredYear = d.year;
  }

  // Function to handle mouse leave event
  function handleMouseLeave() {
    hoveredYear = null;
  }

	function handleKeyDown(event, d) {
    if (event.key === 'Enter') {
      SetYear = d.year;
    }
  }

  const margin = { top: 20, right: 20, bottom: 20, left: 30 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  $: xDomain = data.map((d) => d.year);
  $: yDomain = data.map((d) => +d.count);

  $: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
  $: xScale = scaleLinear()
    .domain([0, Math.max.apply(null, yDomain)])
    .range([0, innerWidth]);

	let xTicks = [0,1,2,3,4,5,6]
</script>

<!-- <div class="container" bind:clientWidth={width}>

</div> -->
<svg {width} {height}>
  <g transform={`translate(${margin.left},${margin.top})`}>
    {#each xTicks as tickValue}
      <g transform={`translate(${xScale(tickValue)},0)`}>
        <line y2={innerHeight} stroke="black" />
        <text class="xaxis" text-anchor="middle" dy=".7em" y={innerHeight +3}>
          {tickValue}
        </text>
      </g>
    {/each}
    {#each data as d}
    {#if d.year!=0}
      <text
				class="yaxis"
        text-anchor="end"
        x="-3"
        dy=".3em"
        y={yScale(d.year) + yScale.bandwidth() / 2}
      >
        {d.year}
      </text>
      {/if}
			{#if d.year == SetYear}
				 <rect
        x="0"
        y={yScale(d.year)}
        width={xScale(d.count)}
        height={yScale.bandwidth()}
				fill="#9BACBC"
				stroke="#B8A79A"
				in:fade
				out:fade
      />
			{:else}
      <rect x="0"
          y={yScale(d.year)}
          width={xScale(d.count)}
          height={yScale.bandwidth()}
          fill={hoveredYear === d.year ? "#EADED3" : (SetYear === d.year ? "#9BACBC" : "#B8A79A")}
          in:fade
          out:fade
          on:click={() => handleClick(d)}
          on:mouseenter={() => handleMouseEnter(d)}
          on:mouseleave={handleMouseLeave}
          on:keydown={(event) => handleKeyDown(event, d)} 
          tabindex="0"
          role="button"
          aria-pressed="{SetYear === d.year}"
      />
			{/if}
     
    {/each}
  </g>
</svg>


<style>
  
   :global(rect:focus) {
    outline: 2px solid #84776E; 
  }

	.yaxis{
		font-family: Quicksand;
		font-size: 0.7em
	}

	.xaxis{
		font-family: Quicksand;
		font-size: 0.8em
	}

line {
	filter: opacity(0.1)
}

</style>
