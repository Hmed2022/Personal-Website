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

	import LandmarksMap from '../Data Viz/Landmarks/LandmarksMap.svelte';
	import { t, isAr } from '../i18n.js';
	import { PROPOSED_AR, CATEGORIES_AR } from '../Data Viz/Landmarks/landmarksAr.js';
	import { TAG_ICON, TAG_COLOR } from '../Data Viz/Landmarks/landmarkMeta.js';
	const GOV_AR = { Ariana: 'أريانة', Gafsa: 'قفصة', Kebili: 'قبلي', Kef: 'الكاف', Medenine: 'مدنين', 'Sidi Bouzid': 'سيدي بوزيد', Siliana: 'سليانة', Tozeur: 'توزر' };
	const CAT_KEYS = ['infra', 'roman', 'islam', 'urban', 'cult', 'indus', 'gov', 'nat'];
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
		<!-- interactive map (the five static maps below are kept for reference) -->
		<LandmarksMap step={index ?? 0} />
		<!--
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
		-->
	</div>


		<div slot="foreground" class="fg"><!-- was style="padding: 0 0 0 50%;" (moved to CSS so phones can override it) -->
			<section>
				<!-- <h1>{$t('lmTitle')}</h1> removed: the section heading above already names it -->
				<h4>{$t('lmDiverse')}</h4>
				<p>{$t('lmP1')}</p>
			</section>
			<section>
				<h3>{$t('lmH2')}</h3>
				<p>{$t('lmP2')}</p>
			</section>
			<section>
				<h3>{$t('lmH3')}</h3>
				<p>{$t('lmP3')}</p>
			</section>
			<section>
				 <p>{$t('lmP4')}</p>
          
              <ul style="text-align: start;">
                {#each monuments as monument}
                  {@const govKey = monument.region === 'Kef' ? 'El Kef' : monument.region}
                  <strong>{$isAr ? GOV_AR[monument.region] : monument.region}:</strong> {$isAr ? (PROPOSED_AR[govKey] || []).join('، ') : monument.landmarks.join(', ')} <br>
                {/each}
              </ul>
			</section>

			<section>
				<div>
					<p>{$t('lmP5')}</p>
				{#each categories as category, ci}
					{@const title = $isAr ? `${CATEGORIES_AR[CAT_KEYS[ci]]} (${category.title.match(/\((\d+)\)/)[1]})` : category.title}
					<div class="category">
					<!-- <img src={category.imageUrl} alt={title} /> previous icon images (ibb) -->
					<span class="cat-ico" style="background:{TAG_COLOR[CAT_KEYS[ci]]}"><img src={TAG_ICON[CAT_KEYS[ci]]} alt="" /></span>
					<span class="category-title">{title}</span>
					</div>
  				{/each}
</div>
			</section>
		</div>
	</Scroller>

</div>

<!-- page background is set once in TunInfo.svelte -->
<!-- <svelte:body use:style={"background-color: #FDF6F5;"} /> -->
<style>
	.demo {
		padding: 0 100px 3rem 0;   /* bottom room so the sticky map doesn't run into the next heading */
	}
	
	[slot="background"] {
		font-size: 1.4em;
		overflow: visible;   /* was hidden: lets the map's faded sea / land reach past the map box */
		padding: 0.5em;
	}

		[slot="background"] img {
		height:550px;
			
	}
	
	[slot="foreground"] {
	
		pointer-events: none;
	}
	.fg { padding: 0 0 0 50%; }

	/* phones: map on top, centred; the text scrolls over it as cards */
	@media (max-width: 760px) {
		.demo { padding: 0 0 3rem; }
		.fg { padding: 0 1rem; }
		[slot="background"] { text-align: center; padding: .5em 0; }
		[slot="foreground"] section {
			height: auto; margin: 0 0 75vh 0; padding: 1.2em;
			background: rgba(250, 243, 232, .95); border-radius: 12px;
			box-shadow: 0 4px 18px rgba(77, 100, 115, .18);
		}
		[slot="foreground"] section:first-child { margin-top: 55vh; }
	}

	/* let the mouse reach the interactive map under the text layer */
	.demo :global(svelte-scroller-foreground) {
		pointer-events: none;
	}
	
	[slot="foreground"] section {

		pointer-events: all;
	}
	
	section {
		height: 400px;
		background-color: transparent;   /* was #FDF6F5; the page background shows through */
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

  .cat-ico { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 7px; margin-inline-end: 10px; flex: 0 0 auto; }
  .cat-ico img { width: 20px !important; height: 20px; margin: 0 !important; }
  .category img {
    width: 30px; /* Adjust the size of the image as needed */
    margin-inline-end: 10px;
  }

  .category-title {
    font-weight: bold;
		font-size: 0.8rem
  }
</style>