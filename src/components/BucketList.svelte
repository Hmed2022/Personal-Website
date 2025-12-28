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
		As a basketball fan with a love for the game and its history,
one of my life goals is to visit every NBA arena.<br>
 With a total of 30 arenas on my bucket list, I am well on my way, 
having already attended games in these arenas:
	</p>	
</div>

<div class="content-wrapper">
	<div class='arena'>
		{#if multiValue =='East'}
			<Arenas/>
		{:else if multiValue =='West'}
			<Arenas2/>
		{/if}
	</div>

	<div class="decArena">
		<div class="decArena3">
			<p class='descNBA'>
				17/30</p>

				{#if multiValue =='East'}
				<ul class='descNBA4'  style='margin:2%'>
					<li>Atlanta Hawks</li>
					<li>Cleveland Cavaliers</li>
					<li>Detroit Pistons</li>
					<li>Indiana Pacers</li>
					<li>Washington Wizards</li>
					<li>Brooklyn Nets</li>
					<li>Chicago Bulls</li>
					<li>Milwaukee Bucks</li>
					<li>Boston Celtics</li>
					<li>Philadelphia 76ers</li>
					<li>New York Knicks</li>
					<li>Charlotte Hornets</li>
				</ul>
				{:else if multiValue =='West'}
				<ul class='descNBA4' style='margin:2%'>
					<li>New Orleans Pelicans</li>
					<li>Houston Rockets</li>
					<li>Dallas Mavericks</li>
					<li>Oklahoma City Thunder</li>
					<li>Minesota Timberwolves</li>
				</ul>
				{/if}

				<p class='descNBA4'> <span style='background-color:#EF7779; color:white; margin:0'>Click on logo to see the photo!</span>

		</div>
		<div class="decArena2">
			<Switch bind:value={multiValue} label="Choose a conference" design="multi" options={['West', 'East']} fontSize={30}/>
		</div>

	</div>
</div>






<style>
	.content-wrapper {
		clear: both;
	}

	.decArena2{
		display: block;

	}
	.decArena3{
		display: block;
		text-align: center;
		min-height: 400px;

	}

	.descNBA4{
		color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.4vw;

	}

	.decArena{
		float: left;
		width: 42%;
		margin-left: 8%;
	}

	@media (max-width: 1024px) {
		.content-wrapper {
			display: flex;
			flex-direction: column-reverse;
		}

		.decArena {
			float: none;
			width: 100%;
			margin-left: 0;
			margin-bottom: 20px;
		}

		.arena {
			float: none;
			width: 100%;
			margin-top: 20px;
		}

		.decArena3 {
			min-height: auto;
		}

		.descNBA4 {
			font-size: 2.5vw;
		}
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
		float: right;
		width: 42%;
		margin-right: 8%;
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
