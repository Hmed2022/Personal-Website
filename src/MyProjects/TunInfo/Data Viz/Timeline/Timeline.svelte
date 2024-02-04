<script>
	import data from './Data/data.js';

	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';

	import AxisX from "./Components/AxisX.svelte";
	import AxisY from "./Components/AxisY.svelte";
		import { line, curveBasis,area,curveCatmullRom } from 'd3-shape';

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
        { value: "1/2 ", color: color0, count1: "4", count2:"0",count3:"0"},
        { value: "1", color: color1, count1: "5", count2:"0",count3:"0" },
        { value: "5", color: color5, count1: "7" , count2:"1",count3:"2"},
        { value: "10", color: color10, count1: "5" , count2:"3",count3:"2"},
        { value: "20", color: color20 , count1: "2", count2:"1",count3:"2"},
        { value: "30", color: color30 , count1: "0", count2:"1",count3:"0"},
        { value: "50", color: color50 , count1: "0", count2:"1",count3:"2"},
    ];

	import ModalContent from './Components/ModalContent.svelte'
	let showModal = false;

	let height = 1800;
	let width = 1000;

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


	 import { onMount, onDestroy } from 'svelte';

  let scrollTop = 0;

  function handleScroll() {
    // Get the scroll position of the window
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log("Scroll position:", scrollTop);
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onDestroy(() => {
    window.removeEventListener('scroll', handleScroll);
  });

	 function scrollToPosition() {
    // Scroll to a specific position, e.g., 200 pixels from the top
    window.scrollTo({
      top: 1000,
      behavior: 'smooth' // Optional: for smooth scrolling
    });
  }

	function scrollToPosition1() {
    // Scroll to a specific position, e.g., 200 pixels from the top
    window.scrollTo({
      top: 1650,
      behavior: 'smooth' // Optional: for smooth scrolling
    });
  }

	function scrollToPosition2() {
    // Scroll to a specific position, e.g., 200 pixels from the top
    window.scrollTo({
      top: 2000,
      behavior: 'smooth' // Optional: for smooth scrolling
    });
  }
	
	$: case1 = scrollTop >=514 && scrollTop <1650
	$: case2 = scrollTop >=1650 && scrollTop <2000
	$: case3 = scrollTop >=2000 && scrollTop <2700


	import old from './Assets/Old Bourguiba.png';
	import young from './Assets/Young Bourguiba.png';
	import tawhida from './Assets/Tawhida.png';
	
</script>

<div class="content-wrapper">
 
<div class="chart-container">
	
	<div class="tooltip">
			{#if case1}
			<div>
		<button style="background-color: black; color:white" on:click={scrollToPosition}>Habib Bourguiba Era </button>
	 <button on:click={scrollToPosition1}>Zine Abedine Ben Ali Era</button>
	 <button on:click={scrollToPosition2}>Post Revolution Era</button>
		</div>
			{:else if case2}
					<div>
		<button  on:click={scrollToPosition}>Habib Bourguiba Era </button>
	 <button style="background-color: black; color:white" on:click={scrollToPosition1}>Zine Abedine Ben Ali Era</button>
	 <button on:click={scrollToPosition2}>Post Revolution Era</button>
		</div>
			{:else}
					<div>
		<button  on:click={scrollToPosition}>Habib Bourguiba Era </button>
	 <button on:click={scrollToPosition1}>Zine Abedine Ben Ali Era</button>
	 <button style="background-color: black; color:white" on:click={scrollToPosition2}>Post Revolution Era</button>
		</div>
			{/if}
			
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

{#if case1}
	 <rect class= "rectangles"
      x={xScale(0)}  
      y={yScale(1958)} 
      width= {width}
      height= {yScale(1992) - yScale(1958)} 
      fill="#0588A6" 
      opacity="0.2" 
    />
{:else if case2}
		 <rect class= "rectangles"
      x={xScale(0)}  
      y={yScale(1992)} 
      width= {width}
      height= {yScale(2011) - yScale(1992)} 
      fill="#4D6473" 
      opacity="0.2" 
    />
{:else if case3}
	 <rect class= "rectangles"
      x={xScale(0)}  
      y={yScale(2011)} 
      width= {width}
      height= {yScale(2023) - yScale(2011)} 
      fill="#A85A3F" 
      opacity="0.2" 
	
    />
{/if}

	</g>
	
</svg>
	
	{#if hovering}
	<Tooltip data={hoveredData} {xScale} {mouseY} />
{/if}
		<ModalContent {showModal} data={hoveredData}/>

	{#if case1}
  <div class="sticky-rectangle show-rectangle">
	<p>
		Following its independence in 1956 and the establishment of its central bank in 1958, Tunisia was led by its first president, Habib Bourguiba. His influence was so pervasive that it's reflected in the country's currency: through the series of 23 banknotes issued during his tenure, He was the only figure portraited in the notes. one can observe the subtle aging of his portrait, marking the passage of time in Tunisian history.
	</p>
  </div>
{:else if case2}
  <div class="sticky-rectangle show-rectangle">
   <p>
	After declaring himself president for life, Habib Bourguiba's reign ended with the coup d'état on November 7, 1987, ushering in Zine El Abidine Ben Ali as Tunisia's new president. In an effort to distance the nation from the previous era of autocracy, Ben Ali removed Bourguiba’s image from the banknotes. Instead, he featured historical figures, signifying a shift towards democratic values. However, this symbolic move was met with skepticism, as Ben Ali introduced the color purple, synonymous with his political party, the RCD, across the banknotes. Additionally, the reverse sides of the notes were imprinted with symbols commemorating the 7th of November coup — a topic we will explore further in this article.
	</p>
  </div>
		{:else if case3}
  <div class="sticky-rectangle show-rectangle">
    <p>
		Following the Jasmine Revolution on January 14, 2011, which led to the ousting of Ben Ali, Tunisia began a new chapter by issuing fresh banknotes, symbolizing the dawn of a dictatorship-free era. The transition was gradual: initially, the omnipresent purple hue and the symbols of the November 7 propaganda were removed from the currency. Subsequently, the nation sought to honor its contemporary leaders, national heroes, and influential change-makers by featuring their likenesses on the banknotes, moving away from merely historical figures to those who shaped Tunisia's modern identity.
		</p>
		</div>
{/if}
	
</div>
<div class="sidebar">
	{#if case1}
 
		<h3>
			Habib Bourguiba Era
		</h3>
		<p>
			<b>Total number of Banknotes: </b> 23
		</p>

<div class="count">
	{#each items as item (item.value)}
		<div class="tooltip-item2">
			<div class="square2" style="background-color: {item.color}">
						</div> 
						{#if item.count1 == "0"}
						<p class="items" style="background-color: pink"><b>Count:</b> {item.count1}</p>
					{:else}
					<p class="items"><b>Count:</b> {item.count1}</p>
					{/if}
		</div>
	{/each}
</div>

<img class="bourguiba" src={young} alt="young Bourguiba"/>
<p style="margin-top:0">
	4 Portraits of 'Young' Bourguiba
</p>
<img class="bourguiba" src={old} alt="young Bourguiba"/>
<p style="margin-top:0">
	19 Portraits of 'old' Bourguiba
</p>
	

{:else if case2}

    <h3>
			Zine Abedine Ben Ali Era
		</h3>
		<p>
			<b>Total number of Banknotes: </b> 7
		</p>

	
<div>
	{#each items as item (item.value)}
		<div class="tooltip-item2">
			<div class="square2" style="background-color: {item.color}">
			</div> 
						{#if item.count2 == "0"}
							<p class="items" style="background-color: pink"><b>Count:</b> {item.count2}</p>
						{:else}
						<p class="items"><b>Count:</b> {item.count2}</p>
						{/if}
		</div>
	{/each}
</div>

<p>
	Inflation led to the discontinuation of the <b>0.5 TND and 1 TND</b> notes, while higher denominations like <b>30 TND and 50 TND</b> were introduced to meet economic demands.
</p>

		{:else if case3}
<div class='sidebar2'>
    <h3>
			Post Revolution Era
		</h3>

		<p>
			<b>Total number of Banknotes: </b> 8
		</p>


		<p>
			the 30 TND note was discontinued due to its low circulation and popularity among users
		</p>

<div>
	{#each items as item (item.value)}
		<div class="tooltip-item2">
			<div class="square2" style="background-color: {item.color}">
						</div> 
						{#if item.count3 == "0"}
						<p class="items" style="background-color: pink"><b>Count:</b> {item.count3}</p>
					{:else}
					<p class="items"><b>Count:</b> {item.count3}</p>
					{/if}
		</div>
	{/each}

	<img class="bourguiba" src={tawhida} alt="Tawhida"/>
	<p style="margin-top:0">
		The 2020 edition of the 10 Tnd features a portrait of <b>Dr. Tawhida Ben Cheikh</b>, the second Tunisian woman to grace the currency after the Phoenician-Carthaginian figure Dido (10 Tnd 2005). <br> <br> Notably, Dr. Tawhida is the <b>first Arab woman</b> to be represented on a banknote, a move that celebrates Tunisian women and honors health workers for their relentless efforts during the COVID-19 pandemic.
	</p>

</div>
<!-- <img style="height:100px; width: auto" src="https://i.ibb.co/y6ms7Zz/baknote-05.png" alt="30TNd Preview">
<p>
	the 30 TND note was discontinued due to its low circulation and popularity among users
</p>
<img style="height:100px; width: auto" src="https://i.ibb.co/X5C6ZWr/svg.png" alt="30TNd Preview">
<p>
	The banknote features a portrait of Dr. Tawhida Ben Cheikh, the second Tunisian woman to grace the currency after the Phoenician-Carthaginian figure Dido. Notably, Dr. Tawhida is the first Arab woman to be represented on a banknote, a move that celebrates Tunisian women and honors health workers for their relentless efforts during the COVID-19 pandemic.
</p> -->
</div>
{/if}

</div>
</div>


<style>

.count {
    /* display: grid;
    place-items: center; */
	margin-bottom:2%
}
	.bourguiba{
		height:auto;
		width:50%;
	}

	p, h3,h4{
		font-family: Quicksand;
	}

	h3 {
		color: #FDF6F5;
		background-color: black;
		padding: 3px;
	}

	  .sticky-rectangle {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 10px;
    border: 1px solid rgb(102, 102, 102);
    transition: opacity 0.5s ease;
    opacity: 0;
	z-index: 2;
  }

  .show-rectangle {
    opacity: 1;
  }

.items{
		font-family: Quicksand;
		font-size:1em;
		margin:0
	}

	.tooltip {
    position: sticky;
    top: 1px;
    right: 10px;
    background-color: #FDF6F5;
    padding: 10px;
    z-index: 1000;
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;
    align-items: center;
}

	.rectangles {
		pointer-events: none;
	}

.tooltip-item {
    margin-right: 5px;  /* <-- Change this from margin-bottom */
    display: flex;
    align-items: center;
}

.tooltip-item2 {
    margin-right: 5px;  /* <-- Change this from margin-bottom */
    align-items: center;
	display: flex;
}

.square {
    width: 16px;
    height: 16px;
    margin-right: 8px;
}

.square2 {
    width: 25px;
    height: 25px;
    margin-right: 8px;
	margin-bottom: 5px;
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



.chart-container {
    /* flex: 1; 
	display:flex; */
	align-items: start; 
	flex-grow: 1;
}

.content-wrapper {
    display: flex;
}

.sidebar {
    width: 300px; 
    position: sticky;
	padding: 25px;
    top: 0;
	text-align: center;
    height: 100vh; /* Full height of the viewport */
    overflow-y: auto; /* Enables scrolling if the content is too long */
    /* Add more styling as needed (e.g., background color, padding, etc.) */
}


button{
	padding: 3px 6px 4px 5px;
    margin-left: 5px;
    margin-bottom: 5px;
    border: 0.5px solid darkgrey;
    font-weight: bold;
    border-radius: 3px;
}

</style>