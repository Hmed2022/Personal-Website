<script>
  // @ts-ignore
  import { onMount, afterUpdate, onDestroy } from 'svelte';

  let ranked = 35;
  import PlayerInfo from "./Data/data";

  let filteredPlayers = [];
  let sortedPlayers = [];
	let ranksByYear = [];

	export let SetYear;

	

  // Function to update filteredPlayers and sortedPlayers based on the current value of ranked
  function updateFilteredPlayers() {
    // @ts-ignore
    filteredPlayers = PlayerInfo.filter(d => d.rank <= ranked);
    // @ts-ignore
    sortedPlayers = filteredPlayers.sort((a, b) => a.year - b.year);
		
		ranksByYear = sortedPlayers.reduce((acc, player) => {
      const existingYear = acc.find(item => item.year === player.year);

      if (existingYear) {
        existingYear.count++;
      } else {
        acc.push({ year: player.year, count: 1 });
      }

      return acc;
    }, []);

		const allYears = new Set(PlayerInfo.map(d => d.year));
  allYears.forEach(year => {
    if (!ranksByYear.some(item => item.year === year)) {
      ranksByYear.push({ year, count: 0 });
    }
  });

  // Sort the ranksByYear array by year, if needed
  ranksByYear.sort((a, b) => a.year - b.year);


		// console.log(ranksByYear)
  }

  // Call the function initially on mount
  onMount(updateFilteredPlayers);

  // Call the function whenever ranked changes
  afterUpdate(updateFilteredPlayers);



	import Chart from "./Chart.svelte"

	
</script>

<p>
  This is the top <input type="number" bind:value={ranked} on:change={updateFilteredPlayers} min="1" max="35" /> most voted
  ALL-STAR NBA players that didn't play the game in each year.
</p>


<div class="BarGraph">
	<Chart data= {ranksByYear} bind:SetYear={SetYear} />
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');

	.BarGraph{
		align-content:center;
	}

	p{
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
	input {
		font-family: 'Quicksand', sans-serif;
		font-weight:800;
		font-size: 15px;
		width:35px
	}
</style>