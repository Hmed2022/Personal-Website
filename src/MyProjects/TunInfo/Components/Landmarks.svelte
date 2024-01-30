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
	
	let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;

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
        <img src="https://i.ibb.co/3dGB23k/Tunisian-BAnknotes-05.png" alt="map" >
    {:else if index == 1}
        <img src="https://i.ibb.co/YpcxRqp/Tunisian-BAnknotes-06.png" alt="map" >
    {:else if index == 2}
        <img src="https://i.ibb.co/RQ5c8WW/Tunisian-BAnknotes6.png" alt="map" >
			{:else if index == 3}
        <img src="https://i.ibb.co/M6gGqWR/Tunisian-BAnknotes-07.png" alt="map" >
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
          
              <ul>
                {#each monuments as monument}
                  <strong>{monument.region}:</strong> {monument.landmarks.join(', ')} <br>
                {/each}
              </ul>
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
		height: auto;
		background-color: #C8E6EF;
		color: #547C81;
		padding: 2em;
		margin: 0 0 8em 0;
		text-align:center;
		justify-content: center;
		align-items: center; 
	
	}

	
</style>