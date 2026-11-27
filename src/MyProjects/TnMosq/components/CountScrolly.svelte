<script>
	// "How many mosques": a sticky mosaic map of Tunisia with text steps scrolling past it.
	//   step 1  the empty tiled map
	//   step 2  mosques land on their tiles as you scroll; the tiled counter climbs
	//   step 3  the two governorates with the most mosques found
	//   step 4  the governorates not mapped yet
	// Every number and name in the text comes from the data (Data/tnCount.json).
	import { onMount } from 'svelte';
	import CountMap from './CountMap.svelte';
	import Plaque from './Plaque.svelte';
	import { GOVS, PTS } from '../countMap.js';

	export let small = false;

	const N = PTS.length;
	const fmt = (n) => n.toLocaleString('en-US');
	const ranked = GOVS.map((g, i) => ({ ...g, i })).sort((a, b) => b.count - a.count);
	const withData = ranked.filter((g) => g.count > 0);
	const top = withData.slice(0, 2);
	const topSum = top.reduce((s, g) => s + g.count, 0);
	const zeros = GOVS.map((g, i) => ({ ...g, i })).filter((g) => g.count === 0);
	// names people know best first, when they are among the blanks
	const FAMOUS = ['Tunis', 'Sousse', 'Kairouan', 'Bizerte', 'Nabeul', 'Monastir', 'Mahdia', 'Béja', 'Ariana', 'Zaghouan'];
	const famousZeros = FAMOUS.filter((n) => zeros.some((z) => z.name === n));
	const labelled = zeros.filter((z) => famousZeros.slice(0, 4).includes(z.name)).map((z) => z.i);
	const share = Math.round((topSum / N) * 100);
	const listNames = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
	const topLabel = (g) => (g.name === 'Médenine' ? 'Médenine (with Djerba)' : g.name);

	let km = 0;
	$: steps = [
		{ text: `This is Tunisia, laid in tiles. Each tile covers about ${Math.max(1, Math.round(km))} km on a side.` },
		{ text: `Now the mosques. As you scroll, each one we found lands on its tile. The darker the blue, the more mosques share that tile.` },
		{
			text:
				`${fmt(N)} so far. ${listNames(top.map(topLabel))} hold ` +
				(share >= 50 ? `more than half of them: ${fmt(topSum)}.` : `${fmt(topSum)} of them.`)
		},
		{
			text:
				zeros.length > 0
					? `And much of the map is still blank. ${zeros.length} of ${GOVS.length} governorates, including ${listNames(famousZeros.slice(0, 3))}, haven't been mapped yet.`
					: `Every governorate now has mosques on the map.`
		}
	];

	let stepEls = [];
	let active = 0;
	let fill = 0;
	let mapW = 400, mapH = 600;

	function onScroll() {
		const mid = window.innerHeight * 0.6;
		let a = 0;
		stepEls.forEach((el, i) => { if (el && el.getBoundingClientRect().top < mid) a = i; });
		active = a;
		const r = stepEls[1] && stepEls[1].getBoundingClientRect();
		fill = r ? Math.max(0, Math.min(1, (mid - r.top) / (r.height * 0.85))) : 0;
	}
	let ticking = false;
	const onScrollRaf = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => { ticking = false; onScroll(); });
	};
	onMount(() => {
		onScroll();
		// #/tnMosq?step=2 opens the page scrolled to that step (1-4)
		const want = +new URLSearchParams(location.hash.split('?')[1] || '').get('step');
		if (want >= 1 && want <= stepEls.length) {
			setTimeout(() => {
				const el = stepEls[want - 1];
				window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6 + el.offsetHeight * (want === 2 ? 0.7 : 0.3));
			}, 400);
		}
	});

	$: progress = active === 0 ? 0 : active === 1 ? fill : 1;
	$: highlight = active === 2 ? 'top' : active === 3 ? 'empty' : '';
	$: shown = Math.round(progress * N);
	// counter keeps a fixed width (leading zeros), like an odometer
	$: counter = String(shown).padStart(String(N).length, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
</script>

<svelte:window on:scroll={onScrollRaf} on:resize={onScrollRaf} />

<div class="scrolly" class:small>
	<div class="sticky">
		<div class="count" aria-live="polite">
			<Plaque bare text={counter} tile={small ? 4 : 6} color="#13306a" flipSpread={120} label="{shown} mosques found" />
			<span class="count-l">mosques found</span>
		</div>
		<div class="mapbox" bind:clientWidth={mapW} bind:clientHeight={mapH}>
			<CountMap {progress} {highlight} focus={top.map((g) => g.i)} {labelled} width={mapW} height={mapH} bind:km />
		</div>
	</div>

	<div class="steps">
		{#each steps as s, i}
			<div class="step" class:on={active === i} bind:this={stepEls[i]}>
				<p>{s.text}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.scrolly {
		display: grid;
		grid-template-columns: minmax(220px, 0.8fr) 1.2fr;
		gap: 32px;
		margin: 36px 0 12px;
	}
	.steps { grid-column: 1; grid-row: 1; padding: 18vh 0 30vh; }
	.sticky {
		grid-column: 2;
		grid-row: 1;
		position: sticky;
		top: 6vh;
		height: 88vh;
		max-height: 860px;
		display: flex;
		flex-direction: column;
		align-self: start;
	}
	.count { display: flex; align-items: flex-end; justify-content: center; gap: 12px; margin-bottom: 14px; }
	.count :global(.plaque) { width: auto; }
	.count-l { font-size: 0.95rem; color: #13213f; padding-bottom: 4px; }
	.mapbox { flex: 1; min-height: 0; }

	.step { min-height: 70vh; display: flex; align-items: center; }
	.step p {
		margin: 0;
		background: #fffaf0;
		border: 2px solid #c9bfa9;
		box-shadow: 4px 4px 0 #13306a;
		padding: 18px 20px;
		font-size: 1.05rem;
		line-height: 1.55;
		opacity: 0.45;
		transition: opacity 0.3s;
	}
	.step.on p { opacity: 1; }

	/* phones: the map stays on top, the steps scroll over it */
	.scrolly.small { display: block; }
	.small .sticky { position: sticky; top: 0; height: 66vh; z-index: 1; background: #f6f1e7; padding-top: 8px; }
	.small .steps { position: relative; z-index: 2; padding: 4vh 0 20vh; }
	.small .step { min-height: 80vh; align-items: flex-end; }
	.small .step p { opacity: 1; font-size: 0.98rem; }
	@media (prefers-reduced-motion: reduce) { .step p { transition: none; } }
</style>
