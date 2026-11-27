<script>
	// A mosque drawn in mosaic tiles, in the same style as the opening scene.
	//   art   id of one of the title drawings (zitouna, kairouan, …) for the famous mosques
	//   else  a generic neighbourhood mosque whose size follows `area` (see genericMosque in mosqueArt.js)
	// The drawing is made on a wide grid, then cropped to the building (plus a margin of sky), and the
	// tile size is chosen so it fits `width` px.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic } from '../mosaic.js';
	import { MOSQUES, ROWS, composeScene, genericMosque } from '../mosqueArt.js';

	export let art = null;
	export let area = 300;
	export let seed = 1;
	export let width = 200; // px available
	export let tile = 0; // fixed tile size (px); 0 = fit `width`. A fixed size keeps drawings comparable.

	let canvas;
	/** @type {Mosaic | null} */ let mosaic = null;
	let timer;
	let shown = { cols: 0, tile: 3 };

	const WIDE = 130;

	function draw() {
		if (!mosaic) return;
		const mosque = MOSQUES.find((q) => q.id === art) || genericMosque({ area, seed });
		const tokens = mosque.draw(WIDE, Math.floor(WIDE / 2));
		// building extent: anything that isn't sky. Title drawings: above row 44 only (lower down, walls,
		// rooftops and sand run the full width); generic ones: everything above the sand
		const limit = mosque.id === 'generic' ? 58 : 44;
		let lo = WIDE, hi = -1;
		for (let r = 0; r < limit; r++)
			for (let c = 0; c < WIDE; c++)
				if (tokens[r][c] !== 'S') { if (c < lo) lo = c; if (c > hi) hi = c; }
		if (hi < 0) { lo = 40; hi = 90; }
		const M = 4;
		const c0 = Math.max(0, lo - M), c1 = Math.min(WIDE - 1, hi + M);
		const cols = c1 - c0 + 1;
		const cropped = { draw: () => tokens.map((row) => row.slice(c0, c1 + 1)) };
		const t = tile || Math.max(3, Math.min(5, Math.floor(width / cols)));
		shown = { cols, tile: t };
		mosaic.resize(cols, ROWS, t);
		mosaic.paint(composeScene({ mosque: cropped, cols, rows: ROWS, cx: 0 }));
	}

	onMount(() => {
		mosaic = new Mosaic(canvas, { grout: '#0a1630', gapRatio: 0.09 });
		draw();
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 700 + Math.random() * 500);
		}
	});
	onDestroy(() => { clearInterval(timer); if (mosaic) mosaic.destroy(); });

	$: if (mosaic) { art, area, seed, width, tile; draw(); }
</script>

<div class="md" style="width:{shown.cols * shown.tile}px"><canvas bind:this={canvas} aria-hidden="true" /></div>

<style>
	.md { line-height: 0; margin: 0 auto; }
	canvas { display: block; }
</style>
