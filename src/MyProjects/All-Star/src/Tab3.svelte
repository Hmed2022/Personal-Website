<script>
import InjuredPlayers from "../DataViz/InjuredPlayers/InjuredPlayers.svelte";


import  data  from "./Data/data.js";

  let selectedCols = ["rank", "player"];

  const COLUMNS = {
    rank: {
      key: "rank",
      title: "Rank",
      value: v => v.rank,
      sortable: false,
    },
    player: {
      key: "player",
      title: "Player",
      value: v => v.player,
      sortable: false,
    },
  };

  let showDNP = false; // Variable to track the button click

  $: cols = selectedCols.map(key => COLUMNS[key]);

  // Function to handle the button click
  function toggleDNP() {
    showDNP = !showDNP;
  }

  // Filter function to show/hide DNP rows based on the button click
  $: filteredData = showDNP ? data : data.filter(item => item.status !== "DNP");

  // Function to check if a row should have the background color
  function rowHasBackground(item) {
    return item.status === "DNP";
  }
</script>

<body>
    
  <h1><mark class="nba_mark">Absence</mark></h1>
<p>
	Imagine eagerly awaiting a matchup like Lebron vs. Stephen
	or Giannis vs. Durant, only to have one or more players get
	injured and replaced by others. It's like watching a movie
	remake with a different cast, resulting in the same title but
	a different experience. <br>
<br>
The All-Star game is a fan service, where fans used to have
	the sole power to decide the players through voting
	(until 2017, when the voting percentages changed
	to 50% fans, 25% players, and 25% media).  <br>
<br>
However, even if your favorite player makes the team,
	there's no guarantee they'll play in the game due to possible injuries. <br>
<br>
Here are the <b>TOP 15</b> players who received the most fan votes in 1997.
</p>


<div class="container">
    <div class="row">
      <table class="custom-table">
        <thead>
          <tr>
            {#each cols as col}
              <th>{col.title}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each filteredData as item}
            <tr class:active={rowHasBackground(item)} class:dnp={item.status === "DNP"}>
              {#each cols as col}
                <td>{col.value(item)}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  
  <p>
      In that list, you'll find only 10 players instead of the expected 15. <br>
      <br> The reason for this discrepancy is that
      <mark class="tableIjured" on:mouseenter={toggleDNP} >
       <b>five of the top-voted players</b> </mark>
      couldn't participate in the game due to injuries.<br> <br>
      Players frequently get injured. Spanning from 1975 to 2023, there are only <b>8
        editions</b> where all voted players actually participated in the game.
        The most recent occurrence was <b>18 years ago!</b>.
  </p>


    <InjuredPlayers/>
    
</body>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;800&family=Quicksand:wght@400;500;700&display=swap');
     h1 {
        text-align: center;
        font-family: 'Jost', sans-serif;
        font-size: 2em;
        text-transform: uppercase;
        font-weight: 800;
        margin-top: 0;
    }

    p {
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
    
    .nba_mark{
        background-color: #476b8d;
        padding: 1%;
        color: #f2efeb;
    }
    .nba_mark:hover{
        background-color: #894044;
    }

	mark {
		background-color:#9bacbc;
    color: #f4f1ed;
	}


  /* Custom table styles */
  .custom-table {
    width: 120%;
    border-collapse: collapse;
  }

  .custom-table th,
  .custom-table td {
    padding: 6px;
    font-family: 'Quicksand', sans-serif;
    font-weight:500

  }

  .custom-table th {
    font-weight: 800;
    background-color: #eaded3;
	font-family: 'Quicksand', sans-serif;
  }

  .custom-table tr:nth-child(even) {
    background-color: #eaded3;
  }

  /* Apply background color to DNP rows */
  .custom-table tr.dnp {
    background-color: #9bacbc;
  }

  .custom-table tr:hover {
    background-color: #b8a79a;
  }

  /* Center the container */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
 
  } 
</style>