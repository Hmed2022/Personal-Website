<script>
   let SetYear = 1978;

import Graph from "../Graph.svelte"

let case1,case2,case3,case4 = false

export let area1, area2,area3,area4;
export let SetYear2 = 1978;

$: {
	case1 = area1;
	case2 = area2;
	case3 = area3;
		  case4 = area4;
 SetYear = SetYear2
}

</script>
		<h1><mark class="nba_mark">Team Efficiency</mark></h1>
		<p>You are highlighting teams from the 1978 to <b>{SetYear==1978 ? SetYear : SetYear-1 }</b> NBA All-Star Games.</p>

	<div class="range" style="--step:10; --min:1978; --max:2023">
	  <input type="range" bind:value={SetYear} min="1978" max="2023" step="1" >
	</div>

	<div id="graph">
		
		<Graph  bind:SetYear={SetYear} {case1} {case2} {case3} {case4}/>
		<p class="intro"> By adjusting the slider, you can emphasize teams from the year 1978 up to the year you've selected.
			You'll now be able to explore the data and compare teams based on their Defensive (Drtg) and Offensive (Ofrg) Team Ratings during that period.</p>
	</div>


<!-- <p>The lower the Drtg (&lt;110) and the higher the Ofrg (&gt;110), the better the team performance.
	 The top-left represents the best performances, while the bottom-right shows the worst.<br>
	 Click to highlight team performances based on offense/defense.
</p> -->


<!-- 		
	<label>
		<p>
			<input type="checkbox" bind:checked={case1} />
			 <b class="GoodDefense"> 
				 Good Defense, Good Offense: </b>
				 These are the best team performances on both ends of the floor. The <b>1992 West </b>team stands out as 
				 the best performance since 1978, aligning with the highest All-Star game rating and viewership.
		</p> 
	</label>



	<label>
		<p>
			<input type="checkbox" bind:checked={case2} />
		<b class="GoodDefense">  Good Defense, Bad Offense: </b>
		The last teams in this category are the <b>2006</b> West and East teams, marking a 17-year gap.
		Since then, the offense has improved significantly.
		</p>
	</label>


	<label>
		<p>
			<input type="checkbox" bind:checked={case3} />
		<b class="BadDefense">  Bad Defense, Good Offense: </b>
		This category comprises all the teams from the <b>2010 to 2023</b> All-Star games, showcasing the shift where
		 teams emphasized offense while neglecting defense.
		</p>
	</label>


	<label>
		<p>
			<input type="checkbox" bind:checked={case4} />
			<b class="BadDefense">  Bad Defense, Bad Offense: </b>
			These teams are the losers from the Good Defense, Good Offense teams, and it's
			 no surprise they ended up here.
		</p>
	</label> -->



<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');

	/* .GoodDefense{
		text-decoration: none;
		font-weight: 700;
		border-bottom: 2px solid #4D6473;
	
		color:#4D6473
	}

	.BadDefense{
		text-decoration: none;
		font-weight: 700;
		border-bottom: 2px solid #733122;
	
		color:#733122
	} */

	h1 {
        text-align: center;
        font-family: 'Jost', sans-serif;
        font-size: 2em;
        text-transform: uppercase;
        font-weight: 800;
        margin-top: 0;
    }

	.nba_mark{
        background-color: #476b8d;
        padding: 1%;
        color: #f2efeb;
    }



	.range {
  --ticksThickness: 2px;
  --ticksHeight: 30%;
  --ticksColor: silver;
		width:100%;
		accent-color: #8C5642;
  
  display: inline-block;
  background: silver;
  background: linear-gradient(to right, var(--ticksColor) var(--ticksThickness), transparent 1px) repeat-x;
  background-size: calc(100%/((var(--max) - var(--min)) / var(--step)) - .1%) var(--ticksHeight);
  background-position: 0 bottom;
  position: relative;
  margin-bottom: 2%;
}


/* min / max labels at the edges */
.range::before, .range::after {
  font: 15px 'Quicksand', sans-serif;
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
		font-family: 'Quicksand', sans-serif;
		font-size: 1em;
	}

</style>

