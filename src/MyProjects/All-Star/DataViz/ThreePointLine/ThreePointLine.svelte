<script>
	import data from './Data/ThreePointMade.js';
	import Graph from './Graph.svelte';
	
	let show = true;
	let curry = true;
	let curryStar = true;
	
	// function toggleShow() {
    // show = show ? show : true;
    // }
	
	// function toggleCurry() {
    // curry = !curry;
    // }
	// function toggleCurryStar() {
    // curryStar = !curryStar;
    // }
	
</script>

<section>
	

	<p class="intro">
		The driving force behind this transformation is the meteoric rise of the three-point shot, orchestrated by
	none other than the maestro himself, Stephen Curry. His impact on the game is undeniable, and the statistics
	 wholeheartedly agree. Whenever Curry takes the floor, the numbers of three-pointers made and attempted witness
	  a clear influence of his presence or absence.
	</p>
<p class="curries">
	<!-- <mark class="Curry" on:mouseenter={toggleCurry} > Stephen Curry Joining the NBA</mark>
	<mark class="CurryStar" on:mouseenter={toggleCurryStar}> Stephen Curry in All-Star Game</mark> -->
	<mark class="Curry"> Stephen Curry not an All-Star</mark>
	<mark class="CurryStar" > Stephen Curry in All-Star Game</mark>
	<br> <br>
	<span class="att-underline" style="color:#894044" >Three Points Attempted</span>
	<span class="made-underline" style="color:#F27830" >Three Points Made</span>
	</p>
	
  <div class="chart">
		 <Graph {data} {show} {curry} {curryStar} />
  </div>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

	.intro {
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
	
	.att-underline{
		border-bottom: 4px solid #894044;
	}
	
	.made-underline{
		border-bottom: 4px solid #F27830;
	}
	
	
	.curries {
		font-family: 'Quicksand', sans-serif;
		font-weight: 700;
		text-align: center;
	}
	.Curry{
		color: #ffffff;
		background-color: #F27830;
		opacity: 0.2
		
	}
	.CurryStar{
		color: #ffffff;
		background-color: #F27830
			
		
	}
</style>
