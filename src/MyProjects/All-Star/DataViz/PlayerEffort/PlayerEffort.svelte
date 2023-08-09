<script>
	import data from './Data/PlayerEffort';
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
		   and <mark class="sumPF" on:mouseenter={togglesumPF}> Perseonal Fouls</mark> over the years.
		  As seen in the previous graph, defense shows a declining trend over time.
	 </p>
	
	 <p class= "hover">
		(Hover over the highlighted titles to visualize them separately)
	 </p>
<p>
	<mark class="sumFTA" on:mouseenter={togglesumFTA}> Free Throws </mark>
	<mark class="sumORB" on:mouseenter={togglesumORB}> Offensive Rebounds</mark>
	<mark class="sumPF" on:mouseenter={togglesumPF}> Perseonal Fouls</mark>
	<mark class="sumStocks" on:mouseenter={togglesumStocks}> Stocks</mark>
</p>
  <div class="chart">
		 <Graph {data} {show} {sumFTA} {sumORB} {sumPF} {sumStocks}/>
  </div>

  
  


</section>

<style>

	.hover {
		font-size: 0.8em;
	}
	mark {
		font-family: Quicksand;
		font-weight: 700;
	}
	
	p {
		font-family: Quicksand;
		
		text-align: center;
	}
	.sumFTA{
		color: #ffffff;
		background-color: #6DA0A6;	
	}
	.sumORB{
		color: #ffffff;
		background-color: #EEBE96
	}
	
	.sumPF{
		color: #ffffff;
		background-color: #F2C2BD
	}

	.sumStocks{
		color: #ffffff;
		background-color: #B06961
	}

	
</style>
