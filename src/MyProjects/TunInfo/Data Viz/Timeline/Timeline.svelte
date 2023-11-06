<script>
	import data from './Data/data.js';

	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';

	import AxisX from "./Components/AxisX.svelte";
	import AxisY from "./Components/AxisY.svelte";

	let mouseY;

		import Tooltip from "./Components/Tooltip.svelte"

	let hovering =false
	let hoveredData = {
        Value: 1,
        ObserveInArabic: "حبيب بورقيبة",
        ObserveInEnglish: "Habib Bourguiba",
        Height: 75,
        Width: 151,
        Active: "No",
        Issued: 1980,
        EndofCirculation: 1996,
        ValueDayofIssue: 2.03,
        ValueEndofCirculation: 1.03,
        Value2: 20
    };

	let color0= "#0388A6"
	let color1= "#025E73"
	let color5= "#005C53"
	let color10= "#BF5630" 
	let color20= "#8C4D3F"
	let color30= "#AB7E56"
	let color50= "#E0C29D"
	

	  let items = [
        { value: "0.5 TND", color: color0 },
        { value: "1 TND", color: color1 },
        { value: "5 TND", color: color5 },
        { value: "10 TND", color: color10 },
        { value: "20 TND", color: color20 },
        { value: "30 TND", color: color30 },
        { value: "50 TND", color: color50 },
    ];

	import ModalContent from './Components/ModalContent.svelte'
	let showModal = false;

	let height = 2000;
	let width = 900;

	const margin = {top:20 , right:40, left:50, bottom:0};
	
	// the scales
		$: xScale = scaleLinear()
		.domain(extent(data.map(d => d.Value2)))
		.domain([0, 70])
		.range([0, width - margin.left - margin.right]);
	
		const yScale = scaleLinear()
		.domain(extent(data.map(d => d.Issued)))
		.domain([2023, 1957])
		.range([height -margin.top - margin.bottom, 0]);
	
</script>
<!-- <div class="sticky-buttons">
    <button>Habib Bourgiba Era</button>
    <button>7 November Era</button>
    <button>Post Revolution era</button>
</div> -->
<div class="container">
<div class="chart-container">
	<div class="tooltip">
		{#each items as item (item.value)}
			<div class="tooltip-item">
				<div class="square" style="background-color: {item.color}">
							</div> 
				<p class="items">{item.value}</p>
			</div>
		{/each}
	</div>
<svg {width} {height}>
	<AxisY {yScale} {width}/>
	<g class="lines" transform="translate({margin.right})">
   <!-- <AxisX {xScale} {margin}/> -->
		{#each data as note}
			{#if note.Value2 >=6 && note.Value2 <= 14}
					 <rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill= {color0}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
									mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>
			{:else if note.Value2 >=16 && note.Value2 <= 24}

				<rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill={color1}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
								mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>

					{:else if note.Value2 >=26 && note.Value2 <= 34}

				<rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill={color5}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
								mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>


				{:else if note.Value2 >=36 && note.Value2 <= 44}

					<rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill={color10}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
								mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>


				{:else if note.Value2 >=46 && note.Value2 <= 54}

				<rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill={color20}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
								mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>

					{:else if note.Value2 >=56 && note.Value2 <= 64}

				<rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill={color30}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
								mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>

				{:else if note.Value2 >=66 && note.Value2 <= 74}

				<rect
					    class="vertical-rectangle"
					    x={xScale(note.Value2) - 1}
					    y={yScale(note.Issued)}
					    width="8"
					    height={yScale(note.EndofCirculation) - yScale(note.Issued)}
					    fill={color50}
					    role="button"
							tabindex="0"
					    on:click={() => (showModal = true)}
					    on:mouseover={(e) => {
					        hoveredData = note;
					        hovering = true;
					        showModal = false;
								mouseY = e.clientY+ window.scrollY;
					    }}
					    on:mouseleave={() => {
					        hovering = false;
					    }}
					    on:focus={() => {
					        hoveredData = note;
					    }}
					    on:keydown={(e) => {
					        if (e.key === "Enter" || e.key === " ") {
					            // Perform the same action as the click event
					            showModal = true;
					        }
					    }}
					/>
			{/if}
{/each}
		
	</g>
	
</svg>
	
	{#if hovering}
	<Tooltip data={hoveredData} {xScale} {mouseY} />
{/if}
		<ModalContent {showModal} data={hoveredData}/>
</div>
	 <!-- <div class="info-container">
		<div class="info-container2">
			<img class="imgRight" src="https://i.ibb.co/k5CnXXq/baknote-35.png" alt="Banknote" />
		</div>
        
    </div> -->
</div>


<style>

.items{
		font-family: Quicksand;
		font-size:0.8em;
		margin:0
	}

	.tooltip {
    position: sticky;
    top: 10px;
    right: 10px;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px;
    z-index: 1000;
    pointer-events: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;  /* <-- Add this */
    flex-direction: row; /* <-- Add this */
}

.tooltip-item {
    margin-right: 5px;  /* <-- Change this from margin-bottom */
    display: flex;
    align-items: center;
}

.square {
    width: 16px;
    height: 16px;
    margin-right: 8px;
}

  .vertical-rectangle {
    stroke-width: 6;
    animation: lineDrawToTop 1s forwards;
    transform-origin: center bottom;
  }

  @keyframes lineDrawToTop {
    0% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }


	.container {
    display: flex;
    /* justify-content: space-between; */
    align-items: start; /* if you want both containers to align at the top */
    width: 100%;
    gap: 2rem; /* space between the two containers */
}

.chart-container {
    /* flex: 1; 
	display:flex; */
	align-items: start; 
}

.info-container {
    border: 1px solid #ccc; /* optional */
    padding: 1rem; /* optional */
	display: flex;
	align-items: start; 

}
.info-container2 {
    width: 70vw;
    height: 20vh;
    background-color: green;
    position: sticky;
    top: 10px;  /* this makes it stick 10px from the top of the viewport when you scroll */
}

.imgRight {
    max-width: 300px; /* make sure the image fits inside the container */
    height: auto; /* maintain the image aspect ratio */
}

</style>