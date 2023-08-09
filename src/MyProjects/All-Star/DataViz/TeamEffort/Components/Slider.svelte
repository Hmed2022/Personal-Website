<script>
  let SetYear = 1978;

	import Graph from "../Graph.svelte"


	let case1,case2,case3,case4 = false

</script>

	<div class="range" style="--step:10; --min:1978; --max:2023">
	  <input type="range" bind:value={SetYear} min="1978" max="2023" step="1" >
	</div>

	<div id="graph">
		<p class="intro"> Defensive (Drtg) and
			 offensive (Ofrg) Team Rating from
			  1978 until <b>{SetYear} </b>NBA All-Star games</p>
		<Graph  bind:SetYear={SetYear} {case1} {case2} {case3} {case4}/>
	</div>


<p>The lower the Drtg (&lt;110) and the higher the Ofrg (&gt;110), the better the team performance.
	 The top-left represents the best performances, while the bottom-right shows the worst.<br>
	 Click to highlight team performances based on offense/defense.
</p>


		
	<label>
		<p>
			 <a class="GoodDefense" href="#graph"> <input type="checkbox" bind:checked={case1} />
				 Good Defense, Good Offense: </a>
				 These are the best team performances on both ends of the floor. The <b>1992 West </b>team stands out as 
				 the best performance since 1978, aligning with the highest All-Star game rating and viewership.
		</p> 
	</label>



	<label>
		<p>
		<a class="GoodDefense" href="#graph"> <input type="checkbox" bind:checked={case2} /> Good Defense, Bad Offense: </a>
		The last teams in this category are the <b>2006</b> West and East teams, marking a 17-year gap.
		Since then, the offense has improved significantly.
		</p>
	</label>


	<label>
		<p>
		<a class="BadDefense" href="#graph"> <input type="checkbox" bind:checked={case3} /> Bad Defense, Good Offense: </a>
		This category comprises all the teams from the <b>2009 to 2023</b> All-Star games, showcasing the shift where
		 teams emphasized offense while neglecting defense.
		</p>
	</label>


	<label>
		<p>
			<a class="BadDefense" href="#graph"> <input type="checkbox" bind:checked={case4} /> Bad Defense, Bad Offense: </a>
			These teams are the losers from the Good Defense, Good Offense teams, and it's
			 no surprise they ended up here.
		</p>
	</label>



<style>

	.GoodDefense{
		text-decoration: none;
		font-weight: 700;
		background-color: #4D6473;
		color:#f4f1ed
	}

	.BadDefense{
		text-decoration: none;
		font-weight: 700;
		background-color: #733122;
		color:#f4f1ed
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

		font-family: Quicksand;
		font-size: 1em;
	}

</style>

