<script>
    import { Center } from '@svelteuidev/core';
	import { Slidy } from 'svelte-slidy';
	import cards from '../components/cards.js';
	import Arenas from "../components/phone.svelte";
	import Arenas2 from "../components/phone2.svelte";
	import Switch from "../components/Switch.svelte";
	// import { name2 } from "../components/phone.svelte";
	// console.log(name2);

    let multiValue;
	let name = 'Slidy'
	
	const slidy_cards = {
		slides: cards,
		wrap: {
			id: 'slidy_cards',
			width: '100vw',
			height: '75vh',
			padding: '50px 0 50px',
			align: 'middle',
			alignmargin: 0,
		},
		slide: {
			gap: 50,
			width: '80vw',
			height: '100vh',
			backimg: false,
			imgsrckey: 'src',
			objectfit: 'contain',
		},
		controls: {
			dots: true,
			dotsnum: true,
			dotsarrow: true,
			dotspure: true,
			arrows: false,
			keys: true,
			drag: true,
			wheel: true,
		
		},
		options: {
			axis: 'x',
			loop: true,
			duration: 350,
			
		}
	}
</script>


<div class = imgvol>
	<img class= volunPhoto src="/src/Volunteering.png" alt="Volunteering">
</div>
<p class=aboutvol>
    Do you know what they say about volunteering?<br> It's like a part-time job, except you don't get paid and you have
     to bring your own snacks. But seriously, while some people do it for the warm fuzzy feeling, others do it
      to boost their resumes, and then there are folks like me who do it for two reasons: to make a difference,
       no matter how small, and to satisfy our need for adventure. Because let's face it, there's no better way
        to feel like a badass than by helping others. Plus, it's a great way to get out of doing laundry for a
         few hours.
</p>
<img class= FIFAPhoto src="/src/FIFAWC.png" alt="Fifa World Cup Qatar 2022">

<p class=aboutvol2>
    In 2022, I had the time of my life participating in the FIFA World Cup Qatar 2022
    as a Spectator Services Volunteer.
   Not only did I have the privilege of creating unforgettable experiences for fans
   from all over the world,  but I also got to meet people from diverse countries
   and cultures. Being at the forefront of the tournament, I was the smiling face
   and helping hand that made the event a true celebration of the beautiful game.
   
   And as if that wasn’t enough, I also got to live out my ultimate fanboy moment
   by attending some of the games as a spectator. Watching Tunisia and Morocco
   play was a surreal experience and a testament to the fact that sometimes,
   dreams do come true.
   
   Meeting so many people from different nations added an extra layer of excitement to an already amazing experience.
   The World Cup brought us all together through our shared love of football, and I feel grateful to have been a part
   of it all. Participating in the World Cup will always be one of the highlights of my life and a story I’ll be telling
   for years to come.

<img class= WCPhoto src="../src/assets/Icons/WCLogo.svg" alt="FifaWC">
</p>

<Slidy {...slidy_cards} let:item >
	<div class="slide">
		<img alt="{item.header}" src="{item.src}"/>
		<article>
			<h2>{item.header}</h2>
			<p>
				{item.text}
			</p>
		</article>
	</div>
</Slidy>


<div class = imgbasket>
	<img class= volunPhoto src="/src/Basketball.png" alt="Basketball">
</div>

<div class="basketball">

	<p class ="aboutvol">
		As a basketball fanatic with a love for the game and its history,
one of my life goalsis to visit every NBA arena
and take in the unique experiences each one has to offer.<br>
 With a total of 29 arenas on my bucket list, I am well on my way, 
having already experienced the excitement at these venues:
	</p>	
</div>


<div class="decArena">
	<div class="decArena3">
		<p class='descNBA'>
			6/29</p>
			<p class='descNBA4'>
				Atlanta Hawks, Celeveland Cavaliers,
				Detroit Pistons, Indiana Pacers,
				Washington Wizards, New Orleans Pelicans
			</p>
	</div>
	<div class="decArena2">
		<Switch bind:value={multiValue} label="Choose a conference" design="multi" options={['East', 'West']} fontSize={35}/>
	</div>
	
</div>

{#if multiValue =='East'}
<section class='arena'>
	<Arenas/>
</section>
{:else}
<section class='arena2'>
	<Arenas2/>
</section>
{/if}





<style>
	.decArena2{
		display: block; 
	
	}
	.decArena3{
		display: block; 
		text-align: center;

	}

	.descNBA4{
		color: #632B3C;
		font-family: DK Zonnig;
		font-size: 50px;
		margin-top: 0%;

	}

	.decArena{
		/* display: flex;  */
		float:right;
		width:40%;
		margin-right: 10%;
		margin-top: 7%;
	}

	.descNBA{
    	color: #ffffff;
		font-family: DK Zonnig;
		font-size: 200px;
		margin-bottom: 0%;
		margin-top: 0%;
	}
	
	.arena2{
		position: relative;
		display: flex; 
		float:left;
		width:40%;
	}

	.arena{
		position: relative;
		display: flex;
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
		display: flex;
		height: auto;
	}
	.imgbasket{
		display: flex;
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
        float: left;
        width: 350px;
		height: auto;
    }
    
    .aboutvol2 {
        text-align: justify;
    	color: #ffffff;
		font-family: DK Zonnig;
		font-size: 30px;
        margin-left:50px;
        margin-right:50px;
        display:flex;
	}

    .aboutvol {
    	color: #fff;
		font-family: DK Zonnig;
		font-size: 30px;
		margin-top: 50px;
        margin-left:50px;
        margin-right:50px;
        display:flex;
	}

    @media screen and (min-width: 500px) {
		:global(#slidy_cards .slidy-ul li) {width: 70vw;}
	}	
	@media screen and (min-width: 600px) {
		:global(#slidy_cards .slidy-ul li) {width: 50vw;}
	}
	@media screen and (min-width: 700px) {
		:global(#slidy_cards .slidy-ul li) {width: 33vw;}
	}
	:global(#slidy_cards .slidy-ul li img) {
			transform: scale(1);
			transition: transform 350ms, box-shadow 350ms;
	}
	:global(#slidy_cards .slidy-ul li) {
		overflow: visible}
	:global(#slidy_cards .slidy-ul li.active img) {
			transform: scale(1.15);
			box-shadow: 0 14px 25px rgba(0, 0, 0, 0.36);
			
	}
	:global(body) { margin: 0; padding: 0}
	
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

	h2{
		font-family: Futura;
		font-weight: 600;
	}

	p{
		font-family: Futura;
		font-weight: 300;
	}
</style>
