<script>
	import cards from '../components/cards.js';
	import Arenas from "../components/phone.svelte";
	import Arenas2 from "../components/phone2.svelte";
	import Switch from "../components/Switch.svelte";
	import basketballurl from "../assets/Basketball.png"
	// import { name2 } from "../components/phone.svelte";
	// console.log(name2);

	let multiValue = "East";
</script>




<div class="basketball">

	<div class = 'imgbasket'>
		<img class= 'volunPhoto' src={basketballurl} alt="Basketball">
	</div>
	
	<p class ="aboutvol">
		As a basketball fanatic with a love for the game and its history,
one of my life goals is to visit every NBA arena.<br>
 With a total of 30 arenas on my bucket list, I am well on my way, 
having already experienced the excitement at these arenas:
	</p>	
</div>


<div class="decArena">
	<div class="decArena3">
		<p class='descNBA'>
			14/30</p>
			<p class='descNBA4'>
				Atlanta Hawks, Celeveland Cavaliers,
				Detroit Pistons, Indiana Pacers,
				Washington Wizards, New Orleans Pelicans,
				Brooklyn Nets, Chicago Bulls, Milwaukee Bucks,
				Houston Rockets, Dallas Mavericks, Oklahoma
				City Thunder, Minesota Timberwolves, Boston Celtics
			</p>
	</div>
	<div class="decArena2">
		<Switch bind:value={multiValue} label="Choose a conference" design="multi" options={['West', 'East']} fontSize={30}/>
	</div>
	
</div>

<div class='arena'>
	{#if multiValue =='East'}
		<Arenas/>
	{:else if multiValue =='West'}
		<Arenas2/>
	{/if}
</div >






<style>
	.decArena2{
		display: block; 
	
	}
	.decArena3{
		display: block; 
		text-align: center;

	}

	.descNBA4{
		color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.5em;

	}

	.decArena{
		/* display: flex;  */
		float:right;
		width:40%;
		margin-right: 10%;
		margin-top: 7%;
	}

	.descNBA{
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-size: 4em;
		margin-bottom: 0%;
		margin-top: 0%;
	}

	.arena{
		position: relative;
		/* display: flex; */
		float:left;
		width:40%;
	}
	
    .WCPhoto{
        float: right;
        width: auto;
		height: 400px;
        margin-left:30px;
        margin-right:50px;
    }

    .imgvol{
        display: flex;
        flex-direction: column;

    }

	.basketball{
		/* display: flex; */
		height: auto;
	}
	.imgbasket{
		/* display: flex; */
		text-align: center;
		justify-items: center;
        flex-direction: column;
		margin-top: 10px;

	}
    .FIFAPhoto {
        margin-top: 30px;
        align-items: center;
        width: 350px;
		height: auto;
    }
    .volunPhoto {
        margin-top: 10px;
        margin-left: 50px;
        /* float: left; */
        width: 350px;
		text-align: center;
		height: auto;
    }
    
    .aboutvol2 {
        text-align: justify;
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-size: 30px;
        margin-left:50px;
        margin-right:50px;
        display:flex;
	}

    .aboutvol {
		color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.5em;
		/* margin-top: 50px;
        margin-left:50px;
        margin-right:50px; */
        display:flex;
	}

	
	.slide {
		position: relative;
		display: flex;
		flex-flow: column;
		text-align: center;
		align-content: center;
		justify-content: center;
		height: 100%;
		border-radius: 1rem;
	}
	.slide img {
		max-height: 400px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		vertical-align: middle;
		object-fit: cover;
		position: relative;
		z-index: 1;
		border-radius: 1rem;
		box-shadow: 0 14px 25px rgba(0, 0, 0, 0.16);
	}
	.slide article {
		padding: 1rem;
	}

</style>
