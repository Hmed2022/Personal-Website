<script>
	import data from './Data/FanInterest';
	import Graph from './Graph.svelte';
	import Scroll from "./Components/Scrolly.svelte";
	
	import {text} from "./Components/blocks.svelte"
	
	let show = true;
	let Magic = false;
	let Jordan = false;
	let Jordan2 = false;
// 	function toggleText() {
//     show = true;
//     }
	
// 	function toggleMike() {
//     Jordan = true;
//     }
	
// 	$:console.log(Jordan);

const setShow = function () {
    show= show ? show: true;
		Magic = Magic ? false : Magic
		Jordan = Jordan ? false : Jordan
	Jordan2 = Jordan2 ? false : Jordan2
		console.log("Show is",show)
	console.log("Magic is",Magic)
  };
  const setMagic = function () {
    Magic= !Magic;
		show = show ? show : true
		Jordan = Jordan ? false : Jordan
		Jordan2 = Jordan2 ? false : Jordan2
		console.log("Magic is",Magic)
		console.log("Show is",show)
  };

	 const setJordan = function () {
    Magic = Magic ? false : Magic
		show = show ? show : true
		Jordan = Jordan ? Jordan : true
		Jordan2 = Jordan2 ? false : Jordan2
  };

	const setJordan2 = function () {
    Magic = Magic ? false : Magic
		show = show ? show : true
		Jordan = Jordan ? false : Jordan
		Jordan2 = Jordan2 ? Jordan2 : true
  };

  let currentStep;
	let pastStep;
//   const steps = ["<p>Step 0!</p>", "<p>Step 1?</p>"];

  $: if (currentStep == 0) {
    setShow();
		Magic ? false : Magic;
  } else if (currentStep == 1) {
    setMagic();
  }
	else if (currentStep == 3) {
    setJordan();
  }
	else if (currentStep == 4) {
    setJordan2();
  }

	
	
	
</script>

<section>
  <!-- The chart in the background, which is sticky thanks to CSS below -->
	<!-- <p> show is {show}</p>
	<p> Jordan is {Jordan}</p> -->
  <div class="chart">
		
		 <Graph {Magic} {data} {show} {Jordan} {Jordan2} />
  </div>

  <!-- The scrolling container which includes each of the text elements -->
  <Scroll bind:value={currentStep}>
    {#each text as txt, i}
      <div class="step" class:active={currentStep === i}>
        <div class="step-content">
          <p>{@html txt}</p>
        </div>
      </div>
    {/each}
  </Scroll>
</section>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;700&display=swap');
  /* The fixed chart */
  .chart {
    position: sticky;
		 top: 10%;
    margin: auto;

  }
  
  /* Scrollytelling CSS */
  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: 1rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
		margin: 10%;
    transition: background 500ms ease;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    z-index: 10;
		
  }

	.step-content:hover{
		opacity: 0.2;
	}

  .step.active .step-content {
    background: #f9f9f9;
    color: #403F3E;
  }
</style>

<!--<label for="jordan-returns" style="display: inline;">Michael Jordan Returns</label>
<input id="jordan-returns" type="checkbox" bind:checked={Jordan} />



<label for="show" style="display: inline;">Show Graph</label>
<input id="show" type="checkbox" bind:checked={show} /> -->

<!-- <h1 class="faninterest"><mark class="nba_mark" on:mouseenter={toggleMike} >Michael Jordan</mark></h1>
<h1 class="faninterest"><mark class="nba_mark" on:mouseenter={toggleText} >Fan Interest</mark></h1> -->


