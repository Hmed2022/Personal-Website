<script>
	// Leghreeb dressed for Jumu'ah (cream jebba with gold embroidery, red chechia), laid in mosaic tiles.
	// The drawing is the same one as on the About page (buildCaptain); it is rasterised once on a hidden
	// canvas, then each tile takes the closest of Leghreeb's own colours. Links back to the home page.
	import { onMount, onDestroy } from 'svelte';
	import meSvg from '../../../assets/PhotoMeThemed.svg?raw';
	import { buildCaptain } from '../../../components/leghreebArt.js';
	import { Mosaic, rgb } from '../mosaic.js';

	export let cols = 28; // tiles across
	export let tile = 4; // px per tile
	export let ink = 0.36; // share of line work that turns a tile dark (lower keeps lines at coarse sizes)

	let canvas;
	/** @type {Mosaic | null} */ let mosaic = null;
	let timer;

	// the drawing's viewBox (-70 -40 657 1022)
	const VB_W = 657, VB_H = 1022;
	const rows = Math.round((cols * VB_H) / VB_W);

	// only the Friday look: jebba + chechia, normal face (same rules as About.svelte, inlined in the SVG)
	const FRIDAY_CSS = `<style>
		svg { --face:#FFFFFF; --skin:#FFFFFF; --logo-bg:transparent; --logo-fill:#FFFFFF; --logo-ink:#2E3A40; }
		.o-jerseys, .o-umich, .o-dingri, .o-pajama, .o-kef, .f-tired, .f-asleep, .o-arms, .straw, .brain { display:none; }
		.o-jebba, .chechia { display:inline; }
	</style>`;

	const PALETTE = [
		['ink', rgb('#2E3A40')],
		['white', rgb('#FBFAF6')],
		['cream', rgb('#F1E6CC')],
		['gold', rgb('#C9A44C')],
		['red', rgb('#B3202F')]
	];
	const nearest = (r, g, b) => {
		let best = 0, bd = Infinity;
		PALETTE.forEach(([, p], k) => {
			const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
			if (d < bd) { bd = d; best = k; }
		});
		return best;
	};
	const jit = (i, base) => {
		let h = Math.imul(i ^ 0x45d9f3b, 0x119de1f3);
		h ^= h >>> 16;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * 0.08;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	function svgString() {
		let s = buildCaptain(meSvg).replace(/(<svg[^>]*>)/, `$1${FRIDAY_CSS}`);
		s = s.replace(/<svg/, `<svg width="${VB_W}" height="${VB_H}"`);
		if (!/xmlns=/.test(s)) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
		return s;
	}

	// sample the drawing into tiles: a tile is ink if enough of it is line work, otherwise its main colour
	function toTiles(img) {
		const S = 8;
		const off = document.createElement('canvas');
		off.width = cols * S;
		off.height = rows * S;
		const ctx = off.getContext('2d', { willReadFrequently: true });
		ctx.drawImage(img, 0, 0, off.width, off.height);
		const data = ctx.getImageData(0, 0, off.width, off.height).data;
		const cells = new Array(cols * rows).fill(null);
		for (let r = 0; r < rows; r++)
			for (let c = 0; c < cols; c++) {
				const counts = new Array(PALETTE.length).fill(0);
				let opaque = 0;
				for (let y = 0; y < S; y++)
					for (let x = 0; x < S; x++) {
						const o = ((r * S + y) * off.width + c * S + x) * 4;
						if (data[o + 3] < 128) continue;
						opaque++;
						counts[nearest(data[o], data[o + 1], data[o + 2])]++;
					}
				if (opaque < S * S * 0.45) continue;
				let k = counts[0] >= opaque * ink ? 0 : counts.indexOf(Math.max(...counts.slice(1)));
				cells[r * cols + c] = jit(r * cols + c, PALETTE[k][1]);
			}
		return cells;
	}

	onMount(() => {
		mosaic = new Mosaic(canvas, { grout: '#0a1630', gapRatio: 0.12, transparent: true });
		mosaic.resize(cols, rows, tile);
		const url = URL.createObjectURL(new Blob([svgString()], { type: 'image/svg+xml' }));
		const img = new Image();
		img.onload = () => {
			const cells = toTiles(img);
			URL.revokeObjectURL(url);
			if (mosaic) mosaic.paint((c, r) => cells[r * cols + c]);
		};
		img.onerror = () => URL.revokeObjectURL(url);
		img.src = url;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 1100);
		}
	});
	onDestroy(() => { clearInterval(timer); if (mosaic) mosaic.destroy(); });
</script>

<a class="leghreeb" href="#/" title="Jumu'ah Mubarak · back to Ahmed Bendaly" aria-label="Back to Ahmed Bendaly's home page">
	<canvas bind:this={canvas} aria-hidden="true" />
</a>

<style>
	.leghreeb {
		display: inline-block;
		line-height: 0;
		transition: transform 0.25s ease;
	}
	.leghreeb:hover { transform: translateY(-3px) rotate(-2deg); }
	.leghreeb:focus-visible { outline: 2px solid #ecd9b4; outline-offset: 4px; }
	canvas { display: block; }
	@media (prefers-reduced-motion: reduce) { .leghreeb { transition: none; } .leghreeb:hover { transform: none; } }
</style>
