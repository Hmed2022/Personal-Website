<script>
// @ts-nocheck

	export let showModal
	export let data
	import Modal from './Modal.svelte';
	import { flip } from 'svelte/animate';

	// import Mdata from './M-data.js';
	// import Graph from './M-Graph.svelte';


    function computeDifference(a, b) {
        const difference = a - b;
        return parseFloat(difference.toFixed(2));
    }

    function getColor(value) {
        return value < 0 ? 'red' : 'green';
    }

	$: difference1 = computeDifference(data.ValueDayofIssue, data.Value);
    $: color1 = getColor(difference1);

    $: difference2 = computeDifference(data.ValueEndofCirculation, data.Value);
    $: color2 = getColor(difference2);

  

	let status= "Front"

function toggleStatus() {
		status = status === "Front" ? "Back" : "Front";
	}
</script>

<!-- <p>{hoveredData.ObserveInEnglish}</p> -->
<Modal bind:showModal>
	<!-- <h2 slot="header">
		<p> {data.Value} TND </p>
		
	</h2>
 -->
<button on:click={toggleStatus} aria-label="Toggle banknote view">
    <img 
        src={status == "Front" ? data.PathF : data.PathB} 
        alt="Front banknote"
        
    />
</button>

 <div class="container">
        <div class="left">
            <h1> {data.ValueDayofIssue} USD </h1>
            <p class="diff {color1}"> {difference1}</p>
            <p class="text">Issue Year<br>{data.Issued}</p>
        </div>
        <div class="right">
            <h1> {data.ValueEndofCirculation}  USD</h1>
            <p class="diff {color2}"> {difference2}</p>
            {#if data.EndofCirculation != 2023}
            <p class="text">Out of Circulation<br>{data.EndofCirculation}</p>
            {:else }
            <p class="text">Currently circulating <br>{data.EndofCirculation}</p>
          {/if}
        </div>
    </div>

<!-- <img src={status=="Front"? data.PathF : data.PathB} alt="Front banknote">
	<Switch bind:value={status} label="Choose a Side" design="multi" options={['Front', 'Back']} fontSize={12}/>
<p>
	Switch is {status}
</p> -->
	<!-- 
  <div class="chart">
		 <Graph data={Mdata} {start} {end} />
  </div> -->
	
</Modal>

<style>


	/* .chart{
		width:30em
	} */
	p, h1{
		text-align: center;
		font-family:Quicksand;
			padding:0;
			margin:0
	}
	/* .text{
		font-weight:500;
		font-size:1em
	} */

	img{
		width: 50em;
	}
	
	

 .container {
    display: flex;
    justify-content: space-between;
  }

  .left, .right {
    width: 49%; 
    border: 1px solid black; 
    
  }

.diff.red {
        color: red;
			font-size: 1.3em;
			padding:0;
			margin:0
    }
    .diff.green {
        color: green;
			font-size: 1.3em;
			padding:0;
			margin:0
    }
</style>