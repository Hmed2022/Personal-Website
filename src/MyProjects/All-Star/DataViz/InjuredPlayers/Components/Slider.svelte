<script>
  let SetYear = 0;
	import Players from "../Players.svelte";
  import Table from "./Table.svelte";

	import Graph from "../Graph.svelte";
  import Graph2 from "../Graph2.svelte"
	let Height = 400;
	let keyColors = ['#1C3A52', '#255A82', '#628AAD', '#7DA4C5','#B9CBD5'];

	import { afterUpdate } from 'svelte';

		function ColorsInput() {
			keyColors = ['#1C3A52', '#255A82', '#628AAD', '#7DA4C5','#B9CBD5'];
			SetYear = SetYear;
		};

let FreeYears =[1975,1976,1983,1996,1998,2000,2004,2005]

$: ShowGraph = (!FreeYears.includes(SetYear) && SetYear != 0 && SetYear != 1999);


function handleClick(year) {
    ShowGraph = true;
    SetYear = year;
  }

</script>

<p>Feel free to dive into the data by simply clicking on the bars within the chart. This will enable you to
   navigate through various years. Additionally, you have the power to manage the selection
    of the Top x players who have garnered the highest POV (Player Votes Percentage).
</p>

	<!-- <div class="range" style="--step:10; --min:1975; --max:2023">
	  <input type="range" on:input={ColorsInput} bind:value={SetYear} min="1975" max="2023" step="1" >
	</div>

  <div class="notes">
    <p id="note">
      {#if FreeYears.includes(SetYear)}
        Note that year <b>{SetYear}</b> is one of the 8 instances where all voted players participated in the game.
      {:else if SetYear == 1999}
        The <b>1999</b> edition was canceled due to the NBA lockout.
      {/if}
    </p>
  </div> -->

  <Graph2 bind:SetYear={SetYear} />

{#if ShowGraph}
      <p id ="playergraph" > These are the players who missed the <b>{SetYear} </b>NBA All-Star game. </p>


<div class="Container">
        <div class="InjurePlayers" style="height:{Height}px">
        <Players bind:SetYear={SetYear} />
      </div>

      <div class="StackedChart" style="max-height:{Height}px">
        <Graph bind:SetYear={SetYear} {Height} bind:keyColors={keyColors}/>
      </div>
</div>
{/if}
<p> The chart provides valuable information on the all-star game's status. However, it may be deceiving as it only considers the count of top X voted players,
   not reflecting the percentage of votes. Let's take as an example the years <b on:click={() => handleClick(1989)}> 1989</b>, 
   <b on:click={() => handleClick(2009)}> 2009</b>, and <b on:click={() => handleClick(2016)}> 2016</b>.
  
</p>

<Table/>



<style>

  .notes {
    height:30px;
  }

  #note{
    color:#BF1F2C;
    font-size: 0.95em;
    text-align: center;
  }


	 .Container {
        display: flex;
    }

    .InjurePlayers {
			margin-right: 5%;
      flex: 47%;
    }

    .StackedChart {
        flex: 22%;
    }
 

	.range {
  --ticksThickness: 2px;
  --ticksHeight: 30%;
  --ticksColor: silver;
		width:100%;
		accent-color: #8C5642;
  
  display: inline-block;
  background: #f4f1ed;
  background: linear-gradient(to right, var(--ticksColor) var(--ticksThickness), transparent 1px) repeat-x;
  background-size: calc(100%/((var(--max) - var(--min)) / var(--step)) - .1%) var(--ticksHeight);
  background-position: 0 bottom;
  position: relative;
  margin-bottom: 5%;
}


/* min / max labels at the edges */
.range::before, .range::after {
  font: 15px Quicksand;
	font-weight:700;
  content: counter(x);
  position: absolute;
  bottom: -2.5ch;
}

.range::before {
  counter-reset: x var(--min);
  transform: translateX(-50%);
	
}

.range::after {
  counter-reset: x var(--max);
  right: 0;
  transform: translateX(50%);
}


.range > input {
  width:100%;
}

	p{
		display: block;
        text-align: justify;
        font-family: Quicksand;
        color: #403F3E;
        font-size: 1em;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
	}

</style>

