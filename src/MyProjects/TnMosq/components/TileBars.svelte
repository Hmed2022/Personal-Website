<script>
	// Mosques found per governorate as mosaic bars: one tile = `per` mosques (the last tile of a bar is
	// lighter when it is only partly filled). Bars build up tile by tile the first time they scroll into view.
	// Governorates with nothing yet show a hatched track and "not mapped yet".
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';
	import { GOVS } from '../countMap.js';

	export let per = 10;
	export let tile = 7;

	const rows = GOVS.map((g) => ({ name: g.name, count: g.count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
	const maxTiles = Math.max(1, ...rows.map((r) => Math.ceil(r.count / per)));
	const H = 2; // tiles tall

	const FULL = rgb('#2357a8');
	const PART = rgb('#7ea6dc');
	const TRACK = rgb('#ece3d0');
	const HATCH = rgb('#d3bf98');

	let wrap;
	let canvases = [];
	const mosaics = [];
	let io, timer;
	let shown = false;

	const shade = (i, base) => {
		let h = Math.imul(i ^ 0x1b873593, 0xcc9e2d51);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * 0.08;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	const filled = (row, ri) => (c, r) => {
		const i = ri * 1000 + r * maxTiles + c;
		const full = Math.floor(row.count / per);
		const part = row.count % per > 0 ? 1 : 0;
		if (row.count === 0) return shade(i, (c + r) % 2 === 0 ? HATCH : TRACK);
		if (c < full) return shade(i, FULL);
		if (c < full + part) return shade(i, PART);
		return shade(i, TRACK);
	};
	const empty = (ri) => (c, r) => shade(ri * 1000 + r * maxTiles + c, TRACK);

	function build(now) {
		mosaics.forEach((m, ri) => {
			m.flipTo(filled(rows[ri], ri), (c) => ri * 45 + c * 22, now, 380);
			m.kick();
		});
	}

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		rows.forEach((row, ri) => {
			const m = new Mosaic(canvases[ri], { grout: '#d9d1c1', gapRatio: 0.12 });
			m.resize(maxTiles, H, tile);
			m.paint(reduced ? filled(row, ri) : empty(ri));
			mosaics.push(m);
		});
		if (reduced) { shown = true; return; }
		io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting && !shown) { shown = true; build(performance.now()); io.disconnect(); }
		}, { threshold: 0.25 });
		io.observe(wrap);
		timer = setInterval(() => {
			const m = mosaics[(Math.random() * mosaics.length) | 0];
			if (m) { m.idleFlip(); m.kick(); }
		}, 700);
	});
	onDestroy(() => { if (io) io.disconnect(); clearInterval(timer); mosaics.forEach((m) => m.destroy()); });
</script>

<div class="bars" bind:this={wrap} role="table" aria-label="Mosques found so far, by governorate">
	{#each rows as row, ri}
		<div class="row" role="row" class:zero={row.count === 0}>
			<span class="name" role="rowheader">{row.name}</span>
			<span class="bar" role="cell"><canvas bind:this={canvases[ri]} aria-hidden="true" /></span>
			<span class="n" role="cell">{row.count ? row.count.toLocaleString('en-US') : 'not mapped yet'}</span>
		</div>
	{/each}
</div>

<style>
	.bars { display: grid; gap: 6px; margin: 14px auto 8px; width: fit-content; max-width: 100%; }
	.row { display: grid; grid-template-columns: 104px auto 1fr; align-items: center; gap: 12px; }
	.name { font-size: 0.9rem; text-align: right; color: #13213f; }
	.bar { line-height: 0; }
	canvas { display: block; }
	.n { text-align: left; font-size: 0.85rem; font-variant-numeric: tabular-nums; color: #13306a; font-weight: 600; }
	.zero .name { color: #7d7466; }
	.zero .n { font-weight: 400; font-style: italic; color: #8a7a5c; }
	@media (max-width: 640px) {
		.row { grid-template-columns: 82px auto 1fr; gap: 8px; }
		.name { font-size: 0.8rem; }
		.n { font-size: 0.75rem; }
	}
</style>
