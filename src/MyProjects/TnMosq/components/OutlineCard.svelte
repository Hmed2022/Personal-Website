<script>
	// A mosque seen from above, in mosaic tiles. With `lat`/`lon` the ground is the real satellite photo
	// (Esri World Imagery) averaged into tiles; the building's outline is traced in beige on top, with two arrows:
	// gold = the direction of Mecca (qibla), blue = the direction the building faces (within 45° of the qibla).
	// Without coordinates, or if the photo can't load, it falls back to a plain dark ground.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';

	export let outline = null; // [[x, y], ...] metres around the centre, x east, y north
	export let target = null; // qibla bearing, degrees from north
	export let dev = null; // deviation of the facing from the qibla, degrees (+ = clockwise)
	export let lat = null;
	export let lon = null;
	export let n = 30; // tiles across
	export let tile = 6;
	export let arrows = true;
	export let showCredit = true; // the gallery prints the imagery credit once instead

	let canvas;
	/** @type {Mosaic | null} */ let mosaic = null;
	let timer;
	let photo = null; // n*n tile colours from the satellite, or null
	let photoKey = '';
	let credit = false;

	const GROUND = rgb('#3b4636'), GROUND2 = rgb('#46523f');
	const ROOF = rgb('#ece0c4'), EDGE = rgb('#f3e3bd'), EDGE_SAT = rgb('#f6dfa3');
	const GOLD = rgb('#e8b13e'), BLUE = rgb('#5d93d8');

	const shade = (i, base, amt = 0.07) => {
		let h = Math.imul(i ^ 0x3c6ef372, 0x9e3779b1);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * amt;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	// metres covered by the card: the outline fills 60% of it; no outline → 120 m
	function span() {
		if (!outline || outline.length < 3) return 120;
		const xs = outline.map((p) => p[0]), ys = outline.map((p) => p[1]);
		return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 20) / 0.6;
	}

	function inside(px, py, poly) {
		let hit = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			const [xi, yi] = poly[i], [xj, yj] = poly[j];
			if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
		}
		return hit;
	}

	function cells() {
		const grid = new Array(n * n).fill(0); // 0 ground, 1 roof, 2 edge, 3 gold, 4 blue
		if (outline && outline.length > 2) {
			const xs = outline.map((p) => p[0]), ys = outline.map((p) => p[1]);
			const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
			const s = n / span();
			const poly = outline.map(([x, y]) => [(x - cx) * s + n / 2, n / 2 - (y - cy) * s]);
			for (let r = 0; r < n; r++)
				for (let c = 0; c < n; c++) if (inside(c + 0.5, r + 0.5, poly)) grid[r * n + c] = 1;
			for (let r = 0; r < n; r++)
				for (let c = 0; c < n; c++) {
					if (grid[r * n + c] !== 1) continue;
					const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
						const x = c + dx, y = r + dy;
						return x < 0 || y < 0 || x >= n || y >= n || grid[y * n + x] === 0;
					});
					if (edge) grid[r * n + c] = 2;
				}
		}
		if (!arrows) return grid;
		const arrow = (bearing, v) => {
			if (bearing === null || bearing === undefined) return;
			const a = (bearing * Math.PI) / 180;
			const L = n * 0.47;
			const put = (x, y) => {
				const c = Math.floor(x), r = Math.floor(y);
				if (c >= 0 && r >= 0 && c < n && r < n) grid[r * n + c] = v;
			};
			for (let t = 0; t <= L; t += 0.35) put(n / 2 + Math.sin(a) * t, n / 2 - Math.cos(a) * t);
			for (const side of [-1, 1]) {
				const b = a + Math.PI + side * 0.55;
				for (let t = 0; t <= 3.2; t += 0.35)
					put(n / 2 + Math.sin(a) * L + Math.sin(b) * t, n / 2 - Math.cos(a) * L - Math.cos(b) * t);
			}
		};
		if (target !== null && dev !== null) arrow(target + dev, 4);
		arrow(target, 3);
		return grid;
	}

	// ---- satellite photo: web-mercator tiles from Esri World Imagery, averaged into n×n mosaic tiles
	const TILE_URL = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
	const cache = new Map(); // tiles already requested by this card
	function loadImg(src) {
		if (cache.has(src)) return cache.get(src);
		const p = new Promise((res, rej) => {
			const im = new Image();
			im.crossOrigin = 'anonymous';
			im.onload = () => res(im);
			im.onerror = rej;
			im.src = src;
		});
		cache.set(src, p);
		return p;
	}

	async function loadPhoto() {
		if (lat === null || lon === null) { photo = null; return; }
		const key = `${lat},${lon},${n},${span()}`;
		if (key === photoKey) return;
		photoKey = key;
		photo = null;
		const metres = span();
		const mpp0 = 156543.034 * Math.cos((lat * Math.PI) / 180); // metres per pixel at zoom 0
		const z = Math.max(14, Math.min(18, Math.floor(Math.log2((mpp0 * n * 6) / metres))));
		const scale = 256 * 2 ** z;
		const px = ((lon + 180) / 360) * scale;
		const s = Math.sin((lat * Math.PI) / 180);
		const py = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale;
		const half = metres / (mpp0 / 2 ** z) / 2; // half the span, in pixels
		const x0 = px - half, y0 = py - half, size = half * 2;
		const tx0 = Math.floor(x0 / 256), tx1 = Math.floor((x0 + size) / 256);
		const ty0 = Math.floor(y0 / 256), ty1 = Math.floor((y0 + size) / 256);
		try {
			const off = document.createElement('canvas');
			off.width = n * 4;
			off.height = n * 4;
			const ctx = off.getContext('2d', { willReadFrequently: true });
			const k = off.width / size;
			const jobs = [];
			for (let ty = ty0; ty <= ty1; ty++)
				for (let tx = tx0; tx <= tx1; tx++)
					jobs.push(loadImg(TILE_URL(z, tx, ty)).then((im) => ctx.drawImage(im, (tx * 256 - x0) * k, (ty * 256 - y0) * k, 256 * k, 256 * k)));
			await Promise.all(jobs);
			if (key !== photoKey) return; // a newer request replaced this one
			const d = ctx.getImageData(0, 0, off.width, off.height).data;
			const out = new Array(n * n);
			for (let r = 0; r < n; r++)
				for (let c = 0; c < n; c++) {
					let R = 0, G = 0, B = 0;
					for (let y = 0; y < 4; y++)
						for (let x = 0; x < 4; x++) {
							const o = ((r * 4 + y) * off.width + c * 4 + x) * 4;
							R += d[o]; G += d[o + 1]; B += d[o + 2];
						}
					out[r * n + c] = [R / 16, G / 16, B / 16].map((v) => Math.round(Math.min(255, v * 1.08)));
				}
			photo = out;
			credit = true;
		} catch (e) {
			photo = null; // offline, blocked, or no imagery: keep the plain ground
		}
	}

	function draw() {
		if (!mosaic) return;
		const g = cells();
		const fn = (c, r) => {
			const i = r * n + c;
			const k = g[i];
			if (photo && (k === 0 || k === 1)) return photo[i];
			if (photo && k === 2) return shade(i, EDGE_SAT, 0.05);
			return [shade(i, (c * 7 + r * 3) % 5 === 0 ? GROUND2 : GROUND), shade(i, ROOF), shade(i, EDGE), shade(i, GOLD), shade(i, BLUE)][k];
		};
		if (mosaic.cols === n && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			mosaic.flipTo(fn, () => Math.random() * 500, performance.now(), 420);
			mosaic.kick();
		} else {
			mosaic.resize(n, n, tile);
			mosaic.paint(fn);
		}
	}

	let mounted = false;
	onMount(() => {
		mosaic = new Mosaic(canvas, { grout: '#1c2219', gapRatio: 0.1 });
		mounted = true;
		draw();
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 900);
		}
	});
	onDestroy(() => { clearInterval(timer); if (mosaic) mosaic.destroy(); });

	// new mosque: fetch its photo; redraw whenever the outline, arrows or photo change
	$: if (mounted) { lat, lon, outline; loadPhoto(); }
	$: if (mounted) { outline, target, dev, photo; draw(); }
</script>

<div class="oc" style="width:{n * tile}px">
	<canvas bind:this={canvas} aria-hidden="true" />
	<span class="north" aria-hidden="true">N ↑</span>
	{#if credit && showCredit}<span class="credit">Imagery © Esri, Maxar, Earthstar Geographics</span>{/if}
</div>

<style>
	.oc { position: relative; line-height: 0; }
	canvas { display: block; }
	.north { position: absolute; top: 4px; left: 6px; font-size: 0.7rem; line-height: 1; color: #fff; font-weight: 600; text-shadow: 0 0 3px #000; }
	.credit { position: absolute; bottom: 2px; right: 4px; font-size: 0.55rem; line-height: 1; color: #fff; opacity: 0.85; text-shadow: 0 0 3px #000; }
</style>
