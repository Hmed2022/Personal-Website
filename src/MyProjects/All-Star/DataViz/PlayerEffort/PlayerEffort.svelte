<script>
	import data from './Data/PlayerEffort.js';
	import Graph from './Graph.svelte';
	
	 let show = true;
	let sumFTA = false;
	let sumORB = false;
	let sumPF = false;
	let sumStocks = false;

	
	function toggleShow() {
    show = !show;
    }
	
	function togglesumFTA() {
    sumFTA = !sumFTA;
    }
	function togglesumORB() {
    sumORB = !sumORB;
    }
	function togglesumPF() {
    sumPF = !sumPF;
    }
	function togglesumStocks() {
    sumStocks = !sumStocks;
    }


</script>

<section>
	<p>
		While Dfrtg considers Turnovers, Free Throw Attempts, and Offensive Rebounds, we can further observe
		 the evolution by adding defensive metrics
		  like <mark class="sumStocks" on:mouseenter={togglesumStocks}> Stocks</mark> (steals and blocks)
		   and <mark class="sumPF" on:mouseenter={togglesumPF}> Personal Fouls</mark> over the years.
		  As seen in the previous graph, defense shows a declining trend over time.
	 </p>
	
	 <p class= "hover">
		(Hover over the highlighted titles to visualize them separately)
	 </p>
<p>
	<mark class="sumFTA" on:mouseenter={togglesumFTA}> Free Throws </mark>
	<mark class="sumORB" on:mouseenter={togglesumORB}> Offensive Rebounds</mark>
	<mark class="sumPF" on:mouseenter={togglesumPF}> Personal Fouls</mark>
	<mark class="sumStocks" on:mouseenter={togglesumStocks}> Stocks</mark>
</p>
  <div class="chart">
		 <Graph {data} {show} {sumFTA} {sumORB} {sumPF} {sumStocks}/>
  </div>

  
  


</section>

<style>

@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

	.hover {
		font-size: 0.8em;
	}
	mark {
		font-family: 'Quicksand', sans-serif;
		font-weight: 700;
	}
	
	p {
		font-family: 'Quicksand', sans-serif;
		text-align: center;
	}
	.sumFTA{
		color: #ffffff;
		background-color: #d9a387;	
	}
	.sumORB{
		color: #ffffff;
		background-color: #59514A
	}
	
	.sumPF{
		color: #ffffff;
		background-color: #a4be85
	}

	.sumStocks{
		color: #ffffff;
		background-color: #9e9891
	}

	
</style>
