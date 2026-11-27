<script>
	// A small square of mosaic tiles (cols × rows) coloured by shares: one tile per item, or per percent.
	// `values` are counts per colour; `colors` the matching hex colours; the rest is `empty`.
	// Builds up tile by tile the first time it scrolls into view.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';

	export let values = [];
	export let colors = [];
	export let cols = 10;
	export let rows = 10;
	export let tile = 5;
	export let perTile = 0; // 0 = scale the values to fill the square (percent), else items per tile
	export let empty = '#ebe3d2';
	export let delay = 0;

	let canvas, wrap;
	/** @type {Mosaic | null} */ let mosaic = null;
	let io, timer;

	const shade = (i, base) => {
		let h = Math.imul(i ^ 0x510e527f, 0x9b05688c);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * 0.08;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	function layout() {
		const total = values.reduce((a, b) => a + b, 0) || 1;
		const n = cols * rows;
		const counts = perTile
			? values.map((v) => Math.round(v / perTile))
			: (() => {
					// largest remainder, so the shares add up to exactly n tiles
					const raw = values.map((v) => (v / total) * n);
					const fl = raw.map(Math.floor);
					let left = n - fl.reduce((a, b) => a + b, 0);
					raw.map((v, i) => [v - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left-- > 0) fl[i]++; });
					return fl;
				})();
		const seq = [];
		counts.forEach((k, ci) => { for (let t = 0; t < k; t++) seq.push(ci); });
		return seq;
	}

	const fill = (seq) => (c, r) => {
		const i = r * cols + c;
		const ci = seq[i];
		return shade(i, rgb(ci === undefined ? empty : colors[ci]));
	};

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		mosaic = new Mosaic(canvas, { grout: '#d9d1c1', gapRatio: 0.12 });
		mosaic.resize(cols, rows, tile);
		const seq = layout();
		mosaic.paint(reduced ? fill(seq) : fill([]));
		if (reduced) return;
		io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			io.disconnect();
			mosaic.flipTo(fill(seq), (c, r) => delay + (r * cols + c) * (900 / (cols * rows)) + Math.random() * 80, performance.now(), 380);
			mosaic.kick();
		}, { threshold: 0.3 });
		io.observe(wrap);
		timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 1100 + Math.random() * 600);
	});
	onDestroy(() => { if (io) io.disconnect(); clearInterval(timer); if (mosaic) mosaic.destroy(); });
</script>

<div class="mw" bind:this={wrap}><canvas bind:this={canvas} aria-hidden="true" /></div>

<style>
	.mw { line-height: 0; }
	canvas { display: block; max-width: 100%; }
</style>
