<script>
	import Slider from "./Components/Slider.svelte"
	import Scroll from "./Components/Scrolly.svelte";
	
	import {text} from "./Components/blocks.svelte"

	let show = true;
	let area1 = false;
	let area2 = false;
	let area3 = false;
	let area4 = false;
	let SetYear2;

  const setArea1 = function () {
    area1= !area1;
		area2 = area2 ? false : area2
		area3 = area3 ? false : area3
		area4 = area4 ? false : area4
		SetYear2 = 1993

  };

	 const setArea2 = function () {
    area1 = area1 ? false : area1
		area2 = area2 ? area2 : true
		area3 = area3 ? false : area3
		area4 = area4 ? false : area4
		SetYear2 = 2006
  };

	const setArea3 = function () {
    area1 = area1 ? false : area1
		area2 = area2 ? false : area2
		area3 = area3 ? area3 : true
		area4 = area4 ? false : area4
		SetYear2 = 2010
  };

	const setArea4 = function () {
	area1 = area1 ? false : area1
	area2 = area2 ? false : area2
	area3 = area3 ? false : area3
	area4 = area4 ? area4 : true
};

  let currentStep;
	let pastStep;

  $: if (currentStep == 0) {
		area1 = false;
		
  } else if (currentStep == 1) {
    setArea1();
  }
	else if (currentStep == 2) {
    setArea2();
  }
	else if (currentStep == 3) {
    setArea3();
  }
		else if (currentStep == 4) {
    setArea4();
  }


	
	
	
</script>

<section>
  <div class="chart">
		
		 <Slider {area1} {area2} {area3} {area4} {SetYear2}/>
  </div>

  <!-- The scrolling container which includes each of the text elements -->
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
  /* The fixed chart */
  .chart {
    position: sticky;
		 top: 2%;
    margin: auto;

  }

  /* Scrollytelling CSS */
  .step {
    height: 90vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: 1rem 2rem;
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