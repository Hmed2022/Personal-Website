<script>
	// @ts-ignore
	import Scroller from '@sveltejs/svelte-scroller';
	// @ts-ignore
	import { fade } from 'svelte/transition';
	import { style } from 'svelte-body';

	    let monuments = [
      { region: 'Ariana', landmarks: ['Ennahli Park', 'The Andalusian Bridge'] },
      { region: 'Gafsa', landmarks: ['Ancient Roman Pools'] },
      { region: 'Kebili', landmarks: ['Chott El Jerid'] },
      { region: 'Kef', landmarks: ['kasbah le kef'] },
      { region: 'Medenine', landmarks: ['Ksar Hallouf', 'El Ghriba Synagogue'] },
      { region: 'Sidi Bouzid', landmarks: ['Martyr Mohamed Bouazizi Square'] },
      { region: 'Siliana', landmarks: ['Maktaris ancient ruins'] },
      { region: 'Tozeur', landmarks: ['Tamerza Canyon Oasis'] }
    ];

	  const categories = [
			 { title: 'Modern Infrastructure (16)', imageUrl: 'https://i.ibb.co/jMDV5S9/Tunisian-BAnknotes-16.png' },
    { title: 'Ancient Roman and Punic Sites (13)', imageUrl: 'https://i.ibb.co/28FCtPV/Tunisian-BAnknotes-10.png' },
    { title: 'Islamic and Religious Sites (8)', imageUrl: 'https://i.ibb.co/3c6V4cn/Tunisian-BAnknotes-11.png' },
     { title: 'Architectural and Urban Sites (8)', imageUrl: 'https://i.ibb.co/0jDjkfJ/Tunisian-BAnknotes-17.png' },
			 { title: 'Cultural and Educational Institutions (8)', imageUrl: 'https://i.ibb.co/PNjRQVM/Tunisian-BAnknotes-15.png' },
			    { title: 'Industrial and Energy Sites (4)', imageUrl: 'https://i.ibb.co/ch80mj8/Tunisian-BAnknotes-13.png' },
			{ title: 'Government and Historical Buildings (2)', imageUrl: 'https://i.ibb.co/cCN4LXH/Tunisian-BAnknotes-12.png' },
    { title: 'Natural Landscapes and Features (2)', imageUrl: 'https://i.ibb.co/0hPVVwq/Tunisian-BAnknotes-14.png' }
   
   
  ];
	
	let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.7;

	import Map1 from '../Assets/Maps/map1.png'
	import Map2 from '../Assets/Maps/map2.png'
	import Map3 from '../Assets/Maps/map3.png'
	import Map4 from '../Assets/Maps/map4.png'
	import Map5 from '../Assets/Maps/map5.png'

</script>

<div class='demo'>


	<Scroller
		{top}
		{threshold}
		{bottom}
		bind:count
		bind:index
		bind:offset
		bind:progress
	>
	<div slot="background">
    {#if index == 0}
        <img src={Map1} alt="map" >
    {:else if index == 1}
        <img src={Map2} alt="map" >
    {:else if index == 2}
        <img src={Map3} alt="map" >
			{:else if index == 3}
        <img src={Map4} alt="map" >
    {:else if index == 4}
        <img src={Map5} alt="map" >
    {/if}
</div>


		<div slot="foreground" style="padding: 0 0 0 50%;">
			<section>
				<h1>
					Tunisian Landmarks
				</h1>
				<h4>
					Diverse Landmarks
				</h4>
				<p>
				Tunisian banknotes celebrate the country's heritage, featuring landmarks from 16 out of 24 governorates. This representation highlights two-thirds of Tunisia's regions, showcasing a tapestry of cultural and historical landmarks across the nation.
				</p>
			</section>
			<section>
				<h3>
					Representation Imbalance
				</h3>
				<p>
					While Tunisian banknotes exhibit a degree of inclusivity, there's a notable imbalance. Tunis, the capital, dominates with 26 representations, far outpacing other regions, the next of which appears only four times. This reflects a disparity in the portrayal of Tunisia's diverse governorates.
				</p>
			</section>
			<section>
				<h3>
					Coastal vs. Inland Governorate Representation
				</h3>
				<p>
					Tunisian banknotes predominantly feature coastal governorates, showcasing all but two (Ariana and Medenine). This contrast starkly with the representation of inland regions, where only three out of nine landlocked governorates are depicted. This trend not only highlights a visual neglect of inland areas but also mirrors their often overlooked economic struggles. In contrast, the more prosperous eastern coastal regions receive greater representation, reflecting their economic prominence in Tunisia's landscape.
				</p>
			</section>
			<section>
				 <p>
            Eight governorates remain unhighlighted on the currency since independence and the current administrative division. It's time to explore and propose monuments and landmarks that could best symbolize the essence of these underrepresented regions:
                  </p>
          
              <ul style="text-align: left;">
                {#each monuments as monument}
                  <strong>{monument.region}:</strong> {monument.landmarks.join(', ')} <br>
                {/each}
              </ul>
			</section>

			<section>
				<div>
					<p>
						We can categories these lanamarks into 8 categories as such:
					 </p>
				{#each categories as category}
					<div class="category">
					<img src={category.imageUrl} alt={category.title} />
					<span class="category-title">{category.title}</span>
					</div>
  				{/each}
</div>
			</section>
		</div>
	</Scroller>

</div>

<svelte:body use:style={"background-color: #FDF6F5;"} />
<style>
	.demo {
		padding: 0 100px 0 0;
	}
	
	[slot="background"] {
		font-size: 1.4em;
		overflow: hidden;
		padding: 0.5em;
	}

		[slot="background"] img {
		height:550px;
			
	}
	
	[slot="foreground"] {
	
		pointer-events: none;
	}
	
	[slot="foreground"] section {

		pointer-events: all;
	}
	
	section {
		height: 400px;
		background-color: #FDF6F5;
		color: #557C81;
		padding: 2em;
		margin: 0 0 8em 0;
		text-align:center;
		justify-content: center;
		align-items: center; 
		font-family: Quicksand;
	
	}

	  .category {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .category img {
    width: 30px; /* Adjust the size of the image as needed */
    margin-right: 10px;
  }

  .category-title {
    font-weight: bold;
		font-size: 0.8rem
  }
</style>