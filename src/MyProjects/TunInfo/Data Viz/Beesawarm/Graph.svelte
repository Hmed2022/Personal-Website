<script>
	import Graph from './Beeswarm.svelte';
	import Scroll from "./Scrolly.svelte";
	
	import {text} from "./blocks.svelte"

	  let currentStep;
	let pastStep;

let activeButton;

	$: if (currentStep == 0) {
		activeButton= "occupation"
  } else if (currentStep == 1) {
  activeButton= "gender"
  }
	else if (currentStep == 2) {
   activeButton="appreciation"
  }
</script>


	

<section>
  <div class="chart">
	 <Graph {activeButton}/>
  </div>

  <Scroll bind:value={currentStep}>
    {#each text as txt, i}
      <div class="step" class:active={currentStep === i}>
        <div class="step-content">
          {@html txt}
        </div>
      </div>
    {/each}
  </Scroll>
</section>

<style>

  .chart {
    position: sticky;
		 top: 10%;
		  display: flex;
    place-items: center;
    justify-content: center;
  }

  /* Scrollytelling CSS */
  .step {
    height: 100vh;
    width:60vw;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: 0.5rem 1rem;
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
    background: white;
    color: black;
  }
</style>
