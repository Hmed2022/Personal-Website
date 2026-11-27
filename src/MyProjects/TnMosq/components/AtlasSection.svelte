<script>
	// The atlas: every mosque on a tiled map of Tunisia. Search by name or governorate, or click a tile;
	// the card shows the mosque from above (outline + qibla arrows), its size, its nearest neighbour and sources.
	// Data/tnAtlas.json is only downloaded when the atlas comes near the screen.
	import { onMount, onDestroy, tick } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';
	import { buildGrid } from '../countMap.js';
	import SatPhoto from './SatPhoto.svelte';
	import MosqueDrawing from './MosqueDrawing.svelte';

	export let small = false;

	let wrap, mapBox, canvas;
	let data = null; // { fields, govs, rows }
	let loading = false;
	let failed = false;
	/** @type {Mosaic | null} */ let mosaic = null;
	let grid = null, tile = 5;
	let cellOf = [];
	let byCell = new Map();
	let query = '';
	let results = [];
	let matched = new Set(); // matching cells while searching
	let selected = -1; // row index
	let mapW = 400;
	let io, timer, qTimer;

	const F = { lon: 0, lat: 1, name: 2, ar: 3, gov: 4, area: 5, dev: 6, target: 7, near: 8, nearName: 9, src: 10, url: 11, outline: 12, date: 13 };
	const fmt = (n) => n.toLocaleString('en-US');

	const SEA = rgb('#b9cde8'), LAND = rgb('#ecdfc0'), BORDER = rgb('#c9b48b');
	const BLUES = [rgb('#4f86cf'), rgb('#2357a8'), rgb('#13306a')];
	const FADED = rgb('#b8c2d2'), HIT = rgb('#e8b13e'), PICK = rgb('#b3202f');
	const shade = (i, base, amt = 0.06) => {
		let h = Math.imul(i ^ 0x1f83d9ab, 0x5be0cd19);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * amt;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	// search: case, accents, Arabic letter variants and diacritics don't matter
	const norm = (s) =>
		String(s || '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/[ً-ٰـ]/g, '')
			.replace(/[أإآ]/g, 'ا')
			.replace(/ة/g, 'ه')
			.replace(/ى/g, 'ي');
	let index = [];

	function colorAt(c, r) {
		const i = r * grid.cols + c;
		const list = byCell.get(i);
		if (list) {
			if (selected >= 0 && cellOf[selected] === i) return shade(i, PICK);
			if (query && matched.size) return shade(i, matched.has(i) ? HIT : FADED);
			return shade(i, BLUES[list.length === 1 ? 0 : list.length <= 3 ? 1 : 2]);
		}
		const g = grid.gov[i];
		if (g < 0) return shade(i, SEA, 0.04);
		return shade(i, grid.border[i] ? BORDER : LAND, 0.05);
	}

	function build() {
		if (!data || !mosaic || !mapW) return;
		const rows = small ? 110 : 150;
		grid = buildGrid(rows);
		tile = Math.max(2, Math.floor(Math.min(mapW / grid.cols, (window.innerHeight * 0.82) / grid.rows)));
		cellOf = data.rows.map((m) => grid.cellOf(m[F.lon], m[F.lat]));
		byCell = new Map();
		cellOf.forEach((cell, k) => {
			if (!byCell.has(cell)) byCell.set(cell, []);
			byCell.get(cell).push(k);
		});
		mosaic.resize(grid.cols, grid.rows, tile);
		mosaic.paint(colorAt);
	}

	function refresh() {
		if (!mosaic || !grid) return;
		mosaic.flipTo(colorAt, () => Math.random() * 250, performance.now(), 380);
		mosaic.kick();
	}

	function runSearch() {
		const q = norm(query.trim());
		if (!q) { results = []; matched = new Set(); refresh(); return; }
		const hits = [];
		for (let k = 0; k < index.length; k++) if (index[k].includes(q)) hits.push(k);
		matched = new Set(hits.map((k) => cellOf[k]));
		results = hits.slice(0, 40);
		refresh();
	}
	function onInput() {
		clearTimeout(qTimer);
		qTimer = setTimeout(runSearch, 160);
	}

	function pick(k) {
		selected = k;
		refresh();
	}

	function onMapClick(e) {
		if (!mosaic) return;
		const i = mosaic.tileAt(e.clientX, e.clientY);
		const list = byCell.get(i);
		if (!list) return;
		e.__mosaic = true;
		results = list.slice(0, 40);
		pick(list[0]);
	}

	async function load() {
		if (data || loading) return;
		loading = true;
		try {
			data = (await import('../Data/tnAtlas.json')).default;
			index = data.rows.map((m) => norm([m[F.name], m[F.ar], data.govs[m[F.gov]] || ''].join(' ')));
			await tick();
			mosaic = new Mosaic(canvas, { grout: '#d8cdb5', gapRatio: 0.1 });
			build();
			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 500);
			}
		} catch (err) {
			console.error(err);
			failed = true;
		}
		loading = false;
	}

	onMount(() => {
		io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); io.disconnect(); } }, { rootMargin: '800px' });
		io.observe(wrap);
	});
	onDestroy(() => { if (io) io.disconnect(); clearInterval(timer); clearTimeout(qTimer); if (mosaic) mosaic.destroy(); });

	let lastW = 0;
	$: if (mosaic && Math.abs(mapW - lastW) > 24) { lastW = mapW; build(); }

	$: m = data && selected >= 0 ? data.rows[selected] : null;
	const title = (r) => r[F.ar] || r[F.name] || 'Unnamed mosque';
	const sub = (r) => (r[F.ar] && r[F.name] && r[F.name] !== r[F.ar] ? r[F.name] : '');
	const dist = (d) => (d === null || d === undefined ? '' : d < 1000 ? `${fmt(d)} m` : `${(d / 1000).toFixed(1)} km`);
	const SRC = { osm: 'OpenStreetMap', overture: 'Overture Maps', foursquare: 'Foursquare' };
	const sources = (s) => String(s || '').split(/[+,|; ]+/).filter(Boolean).map((x) => SRC[x] || x).join(', ');
	const sat = (r) => `https://www.google.com/maps/@?api=1&map_action=map&center=${r[F.lat]},${r[F.lon]}&zoom=19&basemap=satellite`;
	const turn = (d) => (d === null ? '' : Math.abs(d) < 0.5 ? 'faces Mecca almost exactly' : `${Math.abs(d)}° ${d > 0 ? 'clockwise' : 'anticlockwise'} from Mecca`);
</script>

<div bind:this={wrap}>
{#if data && data.featured && data.featured.length}
	<h3 class="sub">The famous and the giants</h3>
	<p class="note">In tiles, like the opening scene. Click one to open its card on the map below.</p>
	<div class="featured">
		{#each data.featured as f}
			<button type="button" class="feat" class:on={selected === f.i} on:click={() => { pick(f.i); results = [f.i]; mapBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>
				<MosqueDrawing art={f.art} area={data.rows[f.i][F.area]} seed={f.i + 1} tile={small ? 2.5 : 3} />
				<span class="fk">{f.kind === 'famous' ? 'Famous' : 'Largest'}</span>
				<bdi class="fn" lang={/[\u0600-\u06ff]/.test(f.kind === 'famous' ? f.why : title(data.rows[f.i])) ? 'ar' : null}>{f.kind === 'famous' ? f.why : title(data.rows[f.i])}</bdi>
				<span class="fg">{data.govs[data.rows[f.i][F.gov]] || ''}{data.rows[f.i][F.area] ? ` · ${fmt(data.rows[f.i][F.area])} m²` : ''}</span>
			</button>
		{/each}
	</div>
	<p class="credit">Famous mosques use the drawings from the opening scene. The giants are illustrations sized from their footprint, not portraits.</p>
{/if}
<div class="atlas" class:small>
	<div class="mapcol" bind:clientWidth={mapW} bind:this={mapBox}>
		{#if failed}
			<p class="msg">The atlas couldn't load. Try reloading the page.</p>
		{:else if !data}
			<p class="msg">Loading the atlas…</p>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
		<canvas bind:this={canvas} on:click={onMapClick} aria-label="Map of mosques in Tunisia. Click a tile to see the mosques on it." role="img" />
	</div>

	<div class="side">
		<label class="search">
			<span>Find a mosque</span>
			<input type="search" bind:value={query} on:input={onInput} placeholder="Name, in Arabic or Latin letters, or a governorate" disabled={!data} />
		</label>
		{#if data}
			<p class="hint">
				{#if query && results.length}{fmt(matched.size ? [...matched].reduce((s, c) => s + byCell.get(c).length, 0) : 0)} matches, on the gold tiles.
				{:else if query}No mosque matches “{query}”.
				{:else}{fmt(data.rows.length)} mosques. Click any blue tile, or search.{/if}
			</p>
		{/if}

		{#if results.length}
			<ul class="results">
				{#each results as k}
					<li><button type="button" class:on={k === selected} on:click={() => pick(k)}>
						<span class="rn" lang={/[؀-ۿ]/.test(title(data.rows[k])) ? 'ar' : null}>{title(data.rows[k])}</span>
						<span class="rg">{data.govs[data.rows[k][F.gov]] || ''}</span>
					</button></li>
				{/each}
			</ul>
		{/if}

		{#if m}
			<article class="card">
				<div class="top">
					<SatPhoto outline={m[F.outline]} target={m[F.target]} dev={m[F.dev]} arrows={m[F.dev] !== null} lat={m[F.lat]} lon={m[F.lon]} size={small ? 140 : 168} />
					<div class="names">
						<h4 lang={/[؀-ۿ]/.test(title(m)) ? 'ar' : null}>{title(m)}</h4>
						{#if sub(m)}<p class="alt">{sub(m)}</p>{/if}
						<p class="gov">{data.govs[m[F.gov]] || 'Tunisia'}</p>
					</div>
				</div>
				<dl>
					{#if m[F.area]}<dt>Footprint</dt><dd>{fmt(m[F.area])} m²</dd>{/if}
					{#if m[F.dev] !== null}<dt>Qibla</dt><dd>{turn(m[F.dev])}</dd>{/if}
					{#if m[F.near] !== null}<dt>Nearest mosque</dt><dd>{dist(m[F.near])}{m[F.nearName] ? ` · ${m[F.nearName]}` : ''}</dd>{/if}
					{#if m[F.date]}<dt>Built</dt><dd>{m[F.date]}</dd>{/if}
					<dt>Sources</dt><dd>{sources(m[F.src]) || '–'}</dd>
				</dl>
				<p class="links">
					{#if m[F.url]}<a href={m[F.url]} target="_blank" rel="noopener noreferrer">Source record ↗</a>{/if}
					<a href={sat(m)} target="_blank" rel="noopener noreferrer">Satellite view ↗</a>
				</p>
			</article>
		{/if}
	</div>
</div>
</div>

<style>
	.atlas { display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; margin: 28px 0 0; align-items: start; }
	.atlas.small { grid-template-columns: 1fr; }
	.mapcol { position: relative; min-height: 200px; }
	canvas { display: block; margin: 0 auto; cursor: pointer; }
	.msg { color: #5d6780; font-size: 0.9rem; }
	.side { display: flex; flex-direction: column; gap: 12px; text-align: left; }
	.search span { display: block; font-size: 0.85rem; color: #5d6780; margin-bottom: 6px; }
	.search input {
		width: 100%;
		box-sizing: border-box;
		font: inherit;
		font-size: 1rem;
		padding: 10px 12px;
		border: 2px solid #13306a;
		background: #fffaf0;
		color: #13213f;
		box-shadow: 3px 3px 0 #13306a;
		border-radius: 0;
	}
	.search input:focus { outline: 2px solid #e8b13e; outline-offset: 2px; }
	.hint { margin: 0; font-size: 0.85rem; color: #5d6780; }
	.results { list-style: none; margin: 0; padding: 0; max-height: 210px; overflow-y: auto; border: 2px solid #c9bfa9; background: #fffaf0; }
	.results button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
		text-align: left;
		font: inherit;
		font-size: 0.92rem;
		padding: 6px 10px;
		border: 0;
		border-bottom: 1px solid #ece3d0;
		background: transparent;
		color: #13213f;
		cursor: pointer;
	}
	.results button:hover, .results button.on { background: #e9dfca; }
	.rn[lang='ar'] { font-family: 'Amiri', serif; font-size: 1.08rem; }
	.rg { color: #8a7a5c; font-size: 0.8rem; white-space: nowrap; }
	.card { background: #fffaf0; border: 2px solid #13306a; box-shadow: 4px 4px 0 #13306a; padding: 14px; }
	.top { display: flex; gap: 14px; align-items: flex-start; }
	.sub { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 1.35rem; margin: 30px 0 4px; color: #13213f; }
	.note { margin: 0 auto 16px; font-size: 0.88rem; color: #5d6780; }
	.credit { margin: -8px 0 18px; font-size: 0.72rem; color: #8a7a5c; }
	.featured { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-bottom: 18px; }
	.feat { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px; border: 2px solid transparent; background: transparent; font: inherit; color: #13213f; cursor: pointer; max-width: 240px; }
	.feat:hover { border-color: #c9bfa9; }
	.feat.on { border-color: #13306a; background: #fffaf0; box-shadow: 3px 3px 0 #13306a; }
	.fk { margin-top: 6px; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.68rem; color: #a87a2a; font-weight: 600; }
	.fn { font-size: 0.9rem; font-weight: 600; line-height: 1.25; }
	.fn[lang='ar'] { font-family: 'Amiri', serif; font-size: 1.1rem; }
	.fg { font-size: 0.78rem; color: #8a7a5c; }
	.names h4 { margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 1.15rem; color: #13213f; }
	.names h4[lang='ar'] { font-family: 'Amiri', serif; font-size: 1.4rem; }
	.alt, .gov { margin: 2px 0 0; font-size: 0.85rem; color: #5d6780; }
	dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 14px 0 0; font-size: 0.88rem; }
	dt { color: #8a7a5c; }
	dd { margin: 0; color: #13213f; }
	.links { display: flex; gap: 16px; margin: 12px 0 0; font-size: 0.85rem; }
	.links a { color: #2357a8; }
</style>
