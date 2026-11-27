<script>
	// A plain satellite photo of a mosque (Esri World Imagery, north up), with its outline traced on top
	// and, optionally, the qibla (gold) and facing (blue) arrows. Used in the atlas.
	import { onMount } from 'svelte';

	export let lat = null;
	export let lon = null;
	export let outline = null; // [[x, y], ...] metres around the centre, x east, y north
	export let target = null;
	export let dev = null;
	export let arrows = false;
	export let size = 160; // px
	export let showCredit = true;

	let canvas;
	let state = 'loading'; // loading | ok | failed
	let token = 0;

	const TILE_URL = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
	const loadImg = (src) =>
		new Promise((res, rej) => {
			const im = new Image();
			im.crossOrigin = 'anonymous';
			im.onload = () => res(im);
			im.onerror = rej;
			im.src = src;
		});

	function span() {
		if (!outline || outline.length < 3) return 120;
		const xs = outline.map((p) => p[0]), ys = outline.map((p) => p[1]);
		return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 20) / 0.6;
	}

	async function draw() {
		if (!canvas || lat === null || lon === null) return;
		const my = ++token;
		state = 'loading';
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const W = Math.round(size * dpr);
		canvas.width = W;
		canvas.height = W;
		const ctx = canvas.getContext('2d');
		const metres = span();
		const mpp0 = 156543.034 * Math.cos((lat * Math.PI) / 180);
		const z = Math.max(14, Math.min(19, Math.ceil(Math.log2((mpp0 * W) / metres))));
		const scale = 256 * 2 ** z;
		const px = ((lon + 180) / 360) * scale;
		const s = Math.sin((lat * Math.PI) / 180);
		const py = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale;
		const half = metres / (mpp0 / 2 ** z) / 2;
		const x0 = px - half, y0 = py - half, k = W / (half * 2);
		const jobs = [];
		for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + half * 2) / 256); ty++)
			for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + half * 2) / 256); tx++)
				jobs.push(loadImg(TILE_URL(z, tx, ty)).then((im) => ({ im, tx, ty })));
		let tiles;
		try {
			tiles = await Promise.all(jobs);
		} catch (e) {
			if (my === token) state = 'failed';
			return;
		}
		if (my !== token) return;
		for (const { im, tx, ty } of tiles) ctx.drawImage(im, (tx * 256 - x0) * k, (ty * 256 - y0) * k, 256 * k + 0.5, 256 * k + 0.5);

		// outline and arrows, in metres → canvas pixels
		const m2px = W / metres;
		ctx.lineJoin = 'round';
		if (outline && outline.length > 2) {
			const xs = outline.map((p) => p[0]), ys = outline.map((p) => p[1]);
			const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
			ctx.beginPath();
			outline.forEach(([x, y], i) => {
				const X = W / 2 + (x - cx) * m2px, Y = W / 2 - (y - cy) * m2px;
				i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
			});
			ctx.closePath();
			ctx.strokeStyle = 'rgba(0,0,0,0.45)';
			ctx.lineWidth = 4 * dpr;
			ctx.stroke();
			ctx.strokeStyle = '#f6dfa3';
			ctx.lineWidth = 2 * dpr;
			ctx.stroke();
		}
		const arrow = (bearing, color) => {
			const a = (bearing * Math.PI) / 180, L = W * 0.44;
			const ex = W / 2 + Math.sin(a) * L, ey = W / 2 - Math.cos(a) * L;
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
			ctx.lineWidth = 3 * dpr;
			ctx.beginPath(); ctx.moveTo(W / 2, W / 2); ctx.lineTo(ex, ey); ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(ex + Math.sin(a) * 6 * dpr, ey - Math.cos(a) * 6 * dpr);
			ctx.lineTo(ex + Math.sin(a + 2.5) * 9 * dpr, ey - Math.cos(a + 2.5) * 9 * dpr);
			ctx.lineTo(ex + Math.sin(a - 2.5) * 9 * dpr, ey - Math.cos(a - 2.5) * 9 * dpr);
			ctx.fill();
		};
		if (arrows && target !== null) {
			if (dev !== null) arrow(target + dev, '#5d93d8');
			arrow(target, '#e8b13e');
		}
		state = 'ok';
	}

	let mounted = false;
	onMount(() => { mounted = true; });
	$: if (mounted) { lat, lon, outline, target, dev, arrows, size; draw(); }
</script>

<div class="sat" style="width:{size}px; height:{size}px">
	<canvas bind:this={canvas} style="width:{size}px; height:{size}px" aria-hidden="true" />
	{#if state === 'loading'}<span class="msg">Loading photo…</span>{/if}
	{#if state === 'failed'}<span class="msg">No satellite photo</span>{/if}
	<span class="north" aria-hidden="true">N ↑</span>
	{#if showCredit && state === 'ok'}<span class="credit">© Esri, Maxar, Earthstar Geographics</span>{/if}
</div>

<style>
	.sat { position: relative; line-height: 0; background: #3b4636; flex-shrink: 0; }
	canvas { display: block; }
	.msg { position: absolute; inset: 0; display: grid; place-items: center; font-size: 0.72rem; line-height: 1.2; color: #ece0c4; text-align: center; }
	.north { position: absolute; top: 4px; left: 6px; font-size: 0.7rem; line-height: 1; color: #fff; font-weight: 600; text-shadow: 0 0 3px #000; }
	.credit { position: absolute; bottom: 2px; right: 4px; font-size: 0.55rem; line-height: 1; color: #fff; opacity: 0.85; text-shadow: 0 0 3px #000; }
</style>
