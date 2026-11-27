<script>
	// Qibla deviations as a fan of mosaic tiles. Straight up is the direction of Mecca; each 5° slice
	// grows outwards with the number of mosques turned that far from it (left = anticlockwise,
	// right = clockwise). Angles are true: a slice at 30° right is a building turned 30° clockwise.
	// The fan builds outward the first time it scrolls into view.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';

	export let bins = []; // 18 counts, -45..+45 in 5° steps
	export let R = 26; // radius in tiles
	export let tile = 8;

	let canvas, wrap;
	/** @type {Mosaic | null} */ let mosaic = null;
	let io, timer;
	const W = 2 * Math.ceil(R * Math.SQRT1_2) + 3;
	const H = R + 2;
	const cx = (W - 1) / 2, cy = R + 0.5;

	const BG = rgb('#f6f1e7'), RING = rgb('#e3d9c4'), AXIS = rgb('#e8b13e');
	const NEAR = rgb('#13306a'), MID = rgb('#2357a8'), FAR = rgb('#7ea6dc');

	const shade = (i, base, amt = 0.06) => {
		let h = Math.imul(i ^ 0x6a09e667, 0xbb67ae85);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * amt;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	const max = () => Math.max(1, ...bins);
	function colorAt(c, r, grow) {
		const i = r * W + c;
		const dx = c + 0.5 - cx - 0.5, dy = cy - (r + 0.5);
		const d = Math.hypot(dx, dy);
		const ang = (Math.atan2(dx, dy) * 180) / Math.PI;
		if (dy < -0.2 || Math.abs(ang) > 45.5 || d > R + 0.5) return shade(i, BG, 0.03);
		const b = Math.min(17, Math.max(0, Math.floor((ang + 45) / 5)));
		const len = (R * bins[b]) / max();
		if (d <= len * grow + 0.3) {
			const a = Math.abs(ang);
			return shade(i, a <= 10 ? NEAR : a <= 25 ? MID : FAR);
		}
		if (Math.abs(dx) < 0.5) return shade(i, AXIS, 0.05);
		if (Math.abs(d - R / 2) < 0.5 || Math.abs(d - R) < 0.5) return shade(i, RING, 0.04);
		return shade(i, BG, 0.03);
	}

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		mosaic = new Mosaic(canvas, { grout: '#ddd3bf', gapRatio: 0.1 });
		mosaic.resize(W, H, tile);
		mosaic.paint((c, r) => colorAt(c, r, reduced ? 1 : 0));
		if (reduced) return;
		io = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			io.disconnect();
			mosaic.flipTo((c, r) => colorAt(c, r, 1), (c, r) => Math.hypot(c - cx, cy - r) * 40 + Math.random() * 120, performance.now(), 420);
			mosaic.kick();
		}, { threshold: 0.4 });
		io.observe(wrap);
		timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 800);
	});
	onDestroy(() => { if (io) io.disconnect(); clearInterval(timer); if (mosaic) mosaic.destroy(); });
</script>

<div class="fan" bind:this={wrap} style="width:{W * tile}px">
	<span class="lab top">Mecca ↑</span>
	<canvas bind:this={canvas} aria-hidden="true" />
	<span class="lab left">45° anticlockwise</span>
	<span class="lab right">45° clockwise</span>
</div>

<style>
	.fan { position: relative; margin: 34px auto 26px; line-height: 0; }
	canvas { display: block; }
	.lab { position: absolute; font-size: 0.8rem; line-height: 1.2; color: #5d6780; white-space: nowrap; }
	.top { top: -24px; left: 50%; transform: translateX(-50%); color: #a87a2a; font-weight: 600; }
	.left { top: 10%; left: -4px; transform: translateX(-100%); text-align: right; }
	.right { top: 10%; right: -4px; transform: translateX(100%); }
</style>
