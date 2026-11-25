<script>
	// @ts-ignore
	import Scroller from '@sveltejs/svelte-scroller';
	// @ts-ignore
	import { fade } from 'svelte/transition';
	import { style } from 'svelte-body';
	import Insight from './Insight.svelte';

	    let monuments = [
      { region: 'Ariana', landmarks: ['Ennahli Park', 'The Andalusian Bridge'] },
      { region: 'Gafsa', landmarks: ['Ancient Roman Pools'] },
      { region: 'Kef', landmarks: ['kasbah le kef'] },
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
	let bottom = 1;   // the page is tall: let it use the full screen height so it never runs past the end of the section

	import LandmarksMap from '../Data Viz/Landmarks/LandmarksMap.svelte';
	import { t, isAr } from '../i18n.js';
	// the map is Dali's drawing on banknote paper, and the text beside it is him talking
	import daliImg from './dali.svg';
	// the map stays a blank page until you say yes (or scroll on past the first step)
	// Before the map exists: the notebook page sits in the middle, bigger, with Dali's answer written where
	// the map will go. "Yes" folds that part of the page down, he draws (no scrolling meanwhile), and when
	// you scroll on to "Now count" the page slides to the left, next to his bubbles.
	// The map is always shown finished (the step-by-step drawing was removed; LandmarksMap still supports drawStep).
	let wrapEl;
	let demoW = 0, wrapW = 0;
	let winW = 1200, winH = 900, pageH = 0;
	$: centered = winW > 760 && (index ?? 0) === 0;
	// bigger in the middle, but never taller than the screen (the scroller pins it 10% from the top)
	// pinned ~10% from the top plus the tape: what's left of the screen decides the size (up to 15% bigger)
	$: BIG = pageH ? Math.max(.8, Math.min(1.15, (winH * .88 - 40) / pageH)) : 1;
	// centre of the whole section, minus where the page already sits (its left offset)
	$: shift = centered && wrapEl ? Math.max(0, (demoW - wrapW * BIG) / 2 - wrapEl.offsetLeft) : 0;
	import grain from '../Data Viz/Timeline/Assets/paper-grain.webp';
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

<svelte:window bind:innerWidth={winW} bind:innerHeight={winH} />
<!-- your question and Dali's answer, like every other question -->
<Insight k="lmAnswer" note="lmQuestion"/>
<div class='demo' bind:clientWidth={demoW}>


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
		<div class="drawing-wrap" bind:this={wrapEl} bind:clientWidth={wrapW} style="transform: translateX({shift}px) scale({centered ? BIG : 1})">
			<div class="drawing" style="--grain:url({grain})" bind:offsetHeight={pageH}>
				<span class="page-tape" aria-hidden="true"></span>
				<!-- your question at the top of the page; Dali grabbed your notebook and drew his answer under it -->
				<LandmarksMap step={index ?? 0} drawStep={6} />
			</div>
		</div>
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


		<div slot="foreground" class="fg" class:centered><!-- was style="padding: 0 0 0 50%;" (moved to CSS so phones can override it) -->
			<!-- first step: no bubble, the page in the middle does the talking -->
			<section class="spacer" aria-hidden="true"></section>
			<section><div class="bubble"><p class="who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
				<p>{$t('lmP2')}</p>
			</div></section>
			<section><div class="bubble"><p class="who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
				<p>{@html $t('lmP3')}</p>
			</div></section>
			<section><div class="bubble"><p class="who"><img src={daliImg} alt="" draggable="false" />{$t('insLabel')}</p>
				 <p>{$t('lmP4')}</p>
          
              <!-- the proposed landmarks are in the hover tooltip of each circled governorate -->
			</div></section>

			<!-- the 8 landmark categories (step 4) were removed here -->
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
	.fg { padding: 0 0 45vh 60%; }   /* bubbles start right of Dali's map; room at the end so the last map stays put */

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
		[slot="foreground"] section:first-child { margin: 0 0 45vh; padding: 0; height: 0; box-shadow: none; background: none; }
		[slot="foreground"] section:last-child { margin-bottom: 15vh; }
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
		font-family: Quicksand, Vazirmatn;
	
	}

	/* Dali's drawing: banknote paper (the timeline's), a burgundy frame, his signature in the corner */
	.drawing {
		position: relative; display: inline-block; padding: 1.6rem 1.4rem 1rem; border-radius: 2px; overflow: visible;
		/* a page from Dali's notebook: ruled lines, a red margin, a little paper grain */
		background-color: #FFFDF6;
		background-image:
			linear-gradient(90deg, transparent 2.6rem, rgba(181, 82, 59, .4) 2.6rem, rgba(181, 82, 59, .4) calc(2.6rem + 1.5px), transparent calc(2.6rem + 1.5px)),
			repeating-linear-gradient(transparent 0 1.6rem, rgba(30, 91, 140, .28) 1.6rem calc(1.6rem + 1.2px));
		background-position: 0 0, 0 .9rem;
		border: none;
		box-shadow: 0 1px 2px rgba(74, 46, 37, .12), 0 10px 26px -8px rgba(74, 46, 37, .32);
		transform: rotate(-.6deg);
	}
	/* Dali stands just outside the sheet, bottom left, signing his drawing */
	.drawing-wrap { position: relative; display: inline-block; }

	/* Dali talking: each step is a speech bubble pointing at his map */
	.bubble {
		position: relative; text-align: start; padding: 1rem 1.2rem; border-radius: 14px;
		background: #F6ECD4; border: 0; border-inline-start: 4px solid #A4731C; box-shadow: none; color: #3D2A22;
	}
	.bubble::before { display: none; }
	:global([dir="rtl"]) .bubble::before { transform: rotate(-45deg); }
	/* a strip of tape holding the page, like the notebook slips */
	.page-tape { position: absolute; top: -.75rem; left: 50%; z-index: 3; width: 7rem; height: 1.6rem; transform: translateX(-50%) rotate(2deg);
		background: rgba(233, 214, 170, .8); box-shadow: 0 1px 2px rgba(74, 46, 37, .15); }
	/* the sea's faded edge stays on the page */
	.drawing { clip-path: inset(-2rem 0 -1.5rem 0); }   /* the tape shows above; the sea is cut at the page's sides */
	/* the page's handwritten header (same as the notebook slips) */
	.page-k { margin: 0; font: 700 .68rem Quicksand, Vazirmatn, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #B5523B; }
	.page-t { margin: 0; font: 500 1.55rem/1.6rem Caveat, 'Segoe Print', cursive; color: #1E3F5C; max-width: 22rem; }
	:global(.tn-ar) .page-t { font-family: 'Aref Ruqaa', Vazirmatn, serif; font-size: 1.25rem; }
	/* the whole page (question + map + legend) must fit a laptop screen below the sticky top offset */
	.drawing :global(svg) { height: clamp(250px, calc(88vh - 17rem), 500px); }
	/* the page glides from the middle to the left when you reach "Now count" */
	.drawing-wrap { transform-origin: 0 0; transition: transform .8s cubic-bezier(.45, .1, .25, 1); }
	.spacer { pointer-events: none !important; }
	/* bubbles wait while the page is in the middle, then come in as it slides aside */
	.fg section { transition: opacity .5s ease; }
	.fg.centered section { opacity: 0; pointer-events: none; }
	/* stepping through the drawing */
	/* the two arrows sit together just above Dali's commentary, with the step counter between them */   /* empty paper right of the map */
	@media (prefers-reduced-motion: reduce) { .drawing-wrap { transition: none; } }
	@keyframes nudge { 0% { box-shadow: 0 0 0 0 rgba(198, 47, 47, .55); } 70% { box-shadow: 0 0 0 12px rgba(198, 47, 47, 0); } 100% { box-shadow: 0 0 0 0 rgba(198, 47, 47, 0); } }
	.lead { margin: 0 0 .7rem; padding-bottom: .7rem; border-bottom: 1px dashed rgba(164, 115, 28, .4); }
	.lead :global(b) { color: #A4731C; }
	.who { display: flex; align-items: center; gap: .4rem; margin: 0 0 .3rem; font: 800 .9rem Quicksand, Vazirmatn, sans-serif; color: #A4731C; }
	.who img { width: 2.4rem; height: 2.5rem; object-fit: contain; object-position: 50% 0; }
	.bubble :global(h3), .bubble :global(h4) { margin: .2rem 0 .4rem; color: #4A2E25; }
	@media (max-width: 760px) {
		.drawing { padding: .8rem .6rem .6rem; transform: none; }
		.bubble::before { display: none; }
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