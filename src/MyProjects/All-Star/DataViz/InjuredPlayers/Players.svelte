<script>
	export let SetYear;
	
	import PlayerInfo from "./Data/data"
	import PlayerImages from "./Data/data-info.js";
	

	import { afterUpdate } from 'svelte';

	let sortedPlayers =[];
	let filteredPlayers =[];

	
	afterUpdate(() => {
	 filteredPlayers = PlayerInfo.filter(d => d.year == SetYear);
	// Sort the filtered players in descending order of rank
	 // @ts-ignore
	 sortedPlayers = filteredPlayers.sort((a, b) => a.rank - b.rank);
	});
	
  function formatPercentage(value) {
    const percentage = Number(value);
    return percentage.toFixed(2);
  }
	
</script>


<section>
  <div class="grid-container">
    {#each sortedPlayers as player}
      {#if player.rank <= 10}
        {#each PlayerImages as image}
          {#if image.player === player.player}
            <div class="grid-item">
              <div class="circle2">
                <img class="image" src={image.src} alt="Player" />
              </div>
              <p>
              {#each player.player.split(' ') as part}
                <b>{part}</b><br>
              {/each}
                Rank: <b>{player.rank}</b><br>
								POV: <b>{formatPercentage(player.percentage_of_votes)} %</b><br>
              </p>
            </div>
          {/if}
        {/each}
      {:else}
        {#each PlayerImages as image}
          {#if image.player === player.player}
            <div class="grid-item">
              <div class="circle">
                <img class="image" src={image.src} alt="Player" />
              </div>
              <p>
                {#each player.player.split(' ') as part}
                <b>{part}</b><br>
              {/each}
                Rank: <b>{player.rank}</b><br>
								POV: <b>{formatPercentage(player.percentage_of_votes)} %</b><br>
              </p>
            </div>
          {/if}
        {/each}
      {/if}
    {/each}
  </div>
</section>


<style>

	.grid-item {
    display: flex;
    grid-template-rows: auto 1fr; /* Set the first row to auto to fit the image height */
    flex-direction: column;
    justify-content: center; /* Center vertically */
    align-items: center; 
  }

	 .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Adjust column width as needed */
    gap: 5%; /* Adjust gap size as needed */
  }

	  .circle {
    position: relative;
    width: 80px;
    height: 80px;
    border: 5px solid black;
    border-radius: 50%;
    background-color: #D97762;
    overflow: hidden;
  }

	.circle2 {
    position: relative;
    width: 80px;
    height: 80px;
    border: 5px solid black;
    border-radius: 50%;
    background-color: #A9B9D9;
    overflow: hidden;
  }

  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: grayscale(1);
    width: 150%;
  }

	p {
		text-align:center;
		font-family: Quicksand;
    font-size: 0.9em;
	}

</style>
