<script>
	// When does Tunisia pray? Prayer times computed from the sun (see prayerTimes.js) for every tile of
	// the country. The map shows the chosen prayer in 2-minute bands (lighter = earlier), so the call to
	// prayer can be seen sweeping across the country. Pick a prayer and a day; the cards give the
	// earliest and latest places that day, and the extremes of the whole year.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';
	import { GOVS, buildGrid } from '../countMap.js';
	import { prayerTimes, clock, dayOfYear, dayLabel } from '../prayerTimes.js';

	export let small = false;

	const LABEL = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
	const AR = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
	const KEYS = Object.keys(LABEL);
	const BAND = 2; // minutes per colour band
	// dawn colours, pale gold (earliest) to deep amber (latest); the sea stays blue
	const RAMP = ['#fbefcc', '#f7df9f', '#f2ca78', '#ecb459', '#e49b40', '#d9812e', '#c86822', '#b2511a', '#963d15', '#782d12', '#5a200e'].map(rgb);
	const SEA = rgb('#b9cde8'), SEA2 = rgb('#a7bfe0'), BORDER_DARK = 0.88;

	const today = dayOfYear(new Date());
	const year = new Date().getFullYear();
	let prayer = 'fajr';
	let day = today;

	let canvas;
	/** @type {Mosaic | null} */ let mosaic = null;
	let grid = null, tile = 5, cells = []; // cells: land tiles {i, lat, lon, g}
	let times = []; // minutes for the chosen prayer, per land tile
	let lo = 0, hi = 0, first = null, last = null;
	let mapW = 400;
	let timer;

	const shade = (i, base, amt = 0.05) => {
		let h = Math.imul(i ^ 0x7a3c19e1, 0x2c1b3c6d);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * amt;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	function compute() {
		times = cells.map((c) => prayerTimes(c.lat, c.lon, day)[prayer]);
		lo = Infinity; hi = -Infinity;
		times.forEach((t, k) => {
			if (t < lo) { lo = t; first = cells[k]; }
			if (t > hi) { hi = t; last = cells[k]; }
		});
	}

	const bandOf = (t) => Math.min(RAMP.length - 1, Math.floor((t - lo) / BAND));
	let byIndex = new Map();
	function colorAt(c, r) {
		const i = r * grid.cols + c;
		const k = byIndex.get(i);
		if (k === undefined) return shade(i, (Math.imul(i, 0x9e3779b1) >>> 28) % 6 === 0 ? SEA2 : SEA, 0.04);
		const base = RAMP[bandOf(times[k])];
		return shade(i, grid.border[i] ? base.map((v) => v * BORDER_DARK) : base);
	}

	function build() {
		if (!mosaic || mapW < 50) return;
		grid = buildGrid(small ? 70 : 84);
		tile = Math.max(3, Math.min(7, Math.floor(mapW / grid.cols)));
		// every land tile, with its centre in degrees
		cells = [];
		byIndex = new Map();
		for (let i = 0; i < grid.gov.length; i++) {
			if (grid.gov[i] < 0) continue;
			const [lon, lat] = grid.centreOf(i);
			byIndex.set(i, cells.length);
			cells.push({ i, g: grid.gov[i], lon, lat });
		}
		compute();
		mosaic.resize(grid.cols, grid.rows, tile);
		mosaic.paint(colorAt);
		yearExtremes();
	}

	let reduced = false;
	let pendingRaf = 0;
	function update() {
		if (!mosaic || !grid) return;
		cancelAnimationFrame(pendingRaf);
		pendingRaf = requestAnimationFrame(() => {
			compute();
			if (reduced) { mosaic.paint(colorAt); return; }
			mosaic.flipTo(colorAt, () => Math.random() * 260, performance.now(), 360);
			mosaic.kick();
		});
	}

	// the extremes of the year over every tile: find the extreme day at the centre of the country,
	// then search all tiles within three weeks of it (computed once)
	let yearly = null;
	function yearExtremes() {
		if (!cells.length) return;
		const best = (key, cmp) => {
			let d0 = 1, t0 = null;
			for (let d = 1; d <= 365; d++) {
				const t = prayerTimes(34, 9.5, d)[key];
				if (t0 === null || cmp(t, t0)) { t0 = t; d0 = d; }
			}
			let res = null;
			for (let d = d0 - 21; d <= d0 + 21; d++) {
				const dd = ((d - 1 + 365) % 365) + 1;
				for (const p of cells) {
					const t = prayerTimes(p.lat, p.lon, dd)[key];
					if (!res || cmp(t, res.t)) res = { t, d: dd, p };
				}
			}
			return res;
		};
		yearly = {
			fajr: best('fajr', (a, b) => a < b),
			fajrLate: best('fajr', (a, b) => a > b),
			maghrib: best('maghrib', (a, b) => a < b),
			isha: best('isha', (a, b) => a > b)
		};
	}

	const place = (cell) => (cell ? GOVS[cell.g].name : '');
	const sweep = () => Math.round(hi - lo);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		mosaic = new Mosaic(canvas, { grout: '#d8cdb5', gapRatio: 0.1 });
		build();
		if (!reduced) timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 700);
	});
	onDestroy(() => { clearInterval(timer); cancelAnimationFrame(pendingRaf); if (mosaic) mosaic.destroy(); });

	let lastW = 0;
	$: if (mosaic && Math.abs(mapW - lastW) > 30) { lastW = mapW; build(); }
	$: if (mosaic) { prayer, day; update(); }
	$: bands = grid ? Math.min(RAMP.length, Math.floor((hi - lo) / BAND) + 1) : 0;
</script>

<p class="body">
	Five times a day, the call to prayer moves across Tunisia from east to west, following the sun. Djerba and the
	south-east hear it first; Tabarka, Jendouba and the Jerid last. Pick a prayer and a day.
</p>

<div class="controls">
	<div class="seg" role="tablist" aria-label="Prayer">
		{#each KEYS as k}
			<button type="button" role="tab" aria-selected={prayer === k} class:on={prayer === k} on:click={() => (prayer = k)}>
				{LABEL[k]} <span lang="ar">{AR[k]}</span>
			</button>
		{/each}
	</div>
	<div class="day">
		<label for="pday">{day === today ? 'Today, ' : ''}{dayLabel(day, year)}</label>
		<input id="pday" type="range" min="1" max="365" bind:value={day} aria-label="Day of the year" />
		<div class="quick">
			<button type="button" on:click={() => (day = today)}>Today</button>
			<button type="button" on:click={() => (day = dayOfYear(new Date(year, 5, 21)))}>Longest day</button>
			<button type="button" on:click={() => (day = dayOfYear(new Date(year, 11, 21)))}>Shortest day</button>
		</div>
	</div>
</div>

<div class="wrap">
	<div class="mapbox" bind:clientWidth={mapW}>
		<canvas bind:this={canvas} aria-label="Map of Tunisia coloured by the time of {LABEL[prayer]} on {dayLabel(day, year)}" role="img" />
	</div>
	<div class="side">
		{#if first && last}
			<div class="big">
				<span class="k">{LABEL[prayer]} on {dayLabel(day, year)}</span>
				<span class="v">{clock(lo)} – {clock(hi)}</span>
				<span class="s">The call takes <b>{sweep()} minutes</b> to cross the country.</span>
			</div>
			<div class="pair">
				<div><span class="k">First</span><b>{clock(lo)}</b><span>{place(first)}</span></div>
				<div><span class="k">Last</span><b>{clock(hi)}</b><span>{place(last)}</span></div>
			</div>
			<div class="legend" aria-hidden="true">
				{#each RAMP.slice(0, bands) as c}<i style="background:rgb({c.join(',')})" />{/each}
			</div>
			<p class="legend-l">Each colour band is {BAND} minutes. Lighter hears the call first.</p>
		{/if}
	</div>
</div>

{#if yearly}
	<h3 class="sub">The extremes of the year</h3>
	<div class="extremes">
		<div><span class="k">Earliest Fajr</span><b>{clock(yearly.fajr.t)}</b><span>{dayLabel(yearly.fajr.d, year)}, {place(yearly.fajr.p)}</span></div>
		<div><span class="k">Latest Fajr</span><b>{clock(yearly.fajrLate.t)}</b><span>{dayLabel(yearly.fajrLate.d, year)}, {place(yearly.fajrLate.p)}</span></div>
		<div><span class="k">Earliest Maghrib</span><b>{clock(yearly.maghrib.t)}</b><span>{dayLabel(yearly.maghrib.d, year)}, {place(yearly.maghrib.p)}</span></div>
		<div><span class="k">Latest Isha</span><b>{clock(yearly.isha.t)}</b><span>{dayLabel(yearly.isha.d, year)}, {place(yearly.isha.p)}</span></div>
	</div>
{/if}

<p class="fine">
	Times are calculated from the sun's position with Tunisia's official convention: Fajr and Isha when the sun is
	18° below the horizon, Asr by the Maliki rule (shadow equal to height plus the noon shadow), Maghrib at sunset.
	The Ministry of Religious Affairs' timetable adds small safety margins, so it can differ by a minute or two.
	Always check your local mosque.
</p>

<style>
	.body { font-size: 1.06rem; line-height: 1.65; max-width: 680px; margin: 28px auto 0; }
	.controls { display: flex; flex-direction: column; align-items: center; gap: 14px; margin: 26px 0 18px; }
	.seg { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
	.seg button {
		font: inherit;
		font-size: 0.92rem;
		padding: 8px 12px;
		border: 2px solid #13306a;
		background: #fffaf0;
		color: #13306a;
		cursor: pointer;
	}
	.seg button.on { background: #13306a; color: #f6f1e7; box-shadow: 3px 3px 0 #e8b13e; }
	.seg span { font-family: 'Amiri', serif; font-size: 1.05rem; margin-left: 4px; }
	.day { display: flex; flex-direction: column; align-items: center; gap: 6px; width: min(520px, 100%); }
	.day label { font-family: 'Fraunces', Georgia, serif; font-size: 1.1rem; color: #13213f; }
	.day input { width: 100%; accent-color: #13306a; }
	.quick { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
	.quick button { font: inherit; font-size: 0.8rem; padding: 4px 10px; border: 1px solid #c9bfa9; background: transparent; color: #13213f; cursor: pointer; }
	.quick button:hover { border-color: #13306a; }

	.wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; align-items: center; }
	.mapbox { display: flex; justify-content: center; }
	canvas { display: block; }
	.side { display: flex; flex-direction: column; align-items: center; gap: 16px; }
	.big { display: flex; flex-direction: column; gap: 4px; }
	.k { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: #a87a2a; font-weight: 600; }
	.v { font-family: 'Fraunces', Georgia, serif; font-size: 2.3rem; font-weight: 800; color: #13306a; font-variant-numeric: tabular-nums; }
	.s { font-size: 0.92rem; color: #13213f; }
	.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 360px; }
	.pair div, .extremes div { display: flex; flex-direction: column; gap: 2px; border-top: 4px solid #d9812e; padding-top: 8px; }
	.pair b, .extremes b { font-family: 'Fraunces', Georgia, serif; font-size: 1.6rem; color: #13306a; font-variant-numeric: tabular-nums; }
	.pair span:last-child, .extremes span:last-child { font-size: 0.85rem; color: #5d6780; }
	.legend { display: flex; gap: 2px; }
	.legend i { width: 18px; height: 14px; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08); }
	.legend-l { margin: -8px 0 0; font-size: 0.8rem; color: #5d6780; }
	.sub { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 1.35rem; margin: 40px 0 12px; color: #13213f; }
	.extremes { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; }
	.fine { font-size: 0.85rem; color: #5d6780; margin: 28px auto 0; max-width: 720px; }
	@media (max-width: 760px) { .wrap { grid-template-columns: 1fr; } }
</style>
