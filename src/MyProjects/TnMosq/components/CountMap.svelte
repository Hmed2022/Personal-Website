<script>
	// Tunisia in mosaic tiles. `progress` (0..1) is the share of mosques shown: they land on their tiles
	// in a fixed random order, and a tile darkens as more mosques share it.
	//   highlight 'top'    the governorates in `focus` stay bright, the rest dims, labels show their counts
	//   highlight 'empty'  governorates with no mosques yet are hatched ("not mapped yet")
	// Only tiles whose colour changes flip over.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb, rng } from '../mosaic.js';
	import { GOVS, PTS, buildGrid } from '../countMap.js';

	export let progress = 0;
	export let highlight = '';
	export let focus = []; // governorate indexes kept bright in 'top'
	export let labelled = []; // governorate indexes labelled in 'empty'
	export let width = 400; // space available, px
	export let height = 600;
	export let km = 0; // out: size of one tile, km

	const ROWS = 96;
	let canvas;
	/** @type {Mosaic | null} */ let mosaic = null;
	let grid = null;
	let tile = 6;
	let timer;

	// fixed random order in which the mosques appear
	function shuffled(n) {
		const a = Array.from({ length: n }, (_, i) => i);
		const r = rng(11);
		for (let i = n - 1; i > 0; i--) {
			const j = Math.floor(r() * (i + 1));
			const t = a[i]; a[i] = a[j]; a[j] = t;
		}
		return a;
	}
	const order = shuffled(PTS.length);
	let cellOfPt = [];
	let counts = new Uint16Array(0);

	const C = (h) => rgb(h);
	const SEA = C('#b9cde8'), SEA_DEEP = C('#a7bfe0');
	const LAND = C('#ecdfc0'), BORDER = C('#c9b48b');
	const DIM_LAND = C('#dcd5c6'), DIM_BORDER = C('#c3b9a6');
	const HATCH_A = C('#efe2c3'), HATCH_B = C('#a97f4b'); // diagonal stripes: "not mapped yet"
	const BLUES = [C('#4f86cf'), C('#2357a8'), C('#13306a')];
	const DIM_BLUE = C('#a9b6c9');

	const shade = (i, base, amt = 0.06) => {
		let h = Math.imul(i ^ 0x2c1b3c6d, 0x297a2d39);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * amt;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	function colorAt(c, r) {
		const i = r * grid.cols + c;
		const g = grid.gov[i];
		const n = counts[i];
		const dimmed = highlight === 'top' && g >= 0 && !focus.includes(g);
		if (n > 0) {
			if (dimmed) return shade(i, DIM_BLUE);
			return shade(i, BLUES[n === 1 ? 0 : n <= 3 ? 1 : 2]);
		}
		if (g < 0) {
			let h = Math.imul(i ^ 0x7f4a7c15, 0x85ebca6b);
			h ^= h >>> 13;
			return shade(i, (h >>> 0) % 6 === 0 ? SEA_DEEP : SEA, 0.05);
		}
		if (highlight === 'empty' && GOVS[g].count === 0) return shade(i, (((c - r) % 4) + 4) % 4 === 0 ? HATCH_B : HATCH_A, 0.04);
		if (dimmed) return shade(i, grid.border[i] ? DIM_BORDER : DIM_LAND, 0.04);
		return shade(i, grid.border[i] ? BORDER : LAND, 0.05);
	}

	function recount() {
		counts = new Uint16Array(grid.cols * grid.rows);
		const k = Math.round(Math.max(0, Math.min(1, progress)) * PTS.length);
		for (let n = 0; n < k; n++) counts[cellOfPt[order[n]]]++;
	}

	function build() {
		if (!mosaic || width < 40 || height < 40) return;
		grid = buildGrid(ROWS);
		km = grid.km;
		tile = Math.max(2, Math.floor(Math.min(height / grid.rows, width / grid.cols)));
		cellOfPt = PTS.map(([lon, lat]) => grid.cellOf(lon, lat));
		recount();
		mosaic.resize(grid.cols, grid.rows, tile);
		mosaic.paint(colorAt);
	}

	let reduced = false;
	function update() {
		if (!mosaic || !grid) return;
		recount();
		if (reduced) { mosaic.paint(colorAt); return; } // reduced motion: no flipping, just the new state
		mosaic.flipTo(colorAt, () => Math.random() * 220, performance.now(), 420);
		mosaic.kick();
	}

	let built = false;
	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		mosaic = new Mosaic(canvas, { grout: '#d8cdb5', gapRatio: 0.1 });
		build();
		built = true;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 600);
		}
	});
	onDestroy(() => { clearInterval(timer); if (mosaic) mosaic.destroy(); });

	// rebuild when the space changes (by more than a tile), otherwise just flip what changed
	let lastSize = '';
	$: if (built) {
		const key = `${Math.round(width / 8)}x${Math.round(height / 8)}`;
		if (key !== lastSize) { lastSize = key; build(); }
	}
	$: if (built) progress, highlight, focus, update();

	// labels pinned on the map (only for the highlighted governorates)
	$: labels = !grid
		? []
		: (highlight === 'top' ? focus : highlight === 'empty' ? labelled : [])
				.filter((g) => grid.anchors[g])
				.map((g) => ({
					g,
					name: GOVS[g].name,
					count: GOVS[g].count,
					x: grid.anchors[g].c * tile,
					y: grid.anchors[g].r * tile
				}))
				.sort((a, b) => a.y - b.y)
				// nudge labels down when they would sit on top of each other
				.reduce((out, l) => {
					for (const o of out) if (Math.abs(o.x - l.x) < 90 && Math.abs(o.y - l.y) < 24) l.y = o.y + 24;
					out.push(l);
					return out;
				}, []);
</script>

<div class="map" style="width:{grid ? grid.cols * tile : 0}px; height:{grid ? grid.rows * tile : 0}px">
	<canvas bind:this={canvas} aria-hidden="true" />
	{#each labels as l (l.g)}
		<span class="lab" class:empty={highlight === 'empty'} style="left:{l.x}px; top:{l.y}px">
			{l.name}
			{#if highlight === 'top'}<b>{l.count.toLocaleString('en-US')}</b>{/if}
		</span>
	{/each}
</div>

<style>
	.map { position: relative; margin: 0 auto; }
	canvas { display: block; }
	.lab {
		position: absolute;
		transform: translate(-50%, -50%);
		background: #13306a;
		color: #fff;
		font-size: 0.78rem;
		font-weight: 600;
		padding: 3px 7px;
		white-space: nowrap;
		box-shadow: 2px 2px 0 #0a1630;
		animation: pop 0.35s ease both;
		pointer-events: none;
	}
	.lab b { color: #ecd9b4; margin-left: 4px; }
	.lab.empty { background: #7a5a2f; box-shadow: 2px 2px 0 #4a361b; }
	@keyframes pop { from { opacity: 0; transform: translate(-50%, -30%); } to { opacity: 1; transform: translate(-50%, -50%); } }
	@media (prefers-reduced-motion: reduce) { .lab { animation: none; } }
</style>
