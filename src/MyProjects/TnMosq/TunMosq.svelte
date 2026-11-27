<script>
	// Mapping every mosque in Tunisia: draft landing page.
	// The opening screen is one mosaic: a mosque on the left (Al-Zaytuna, then Kairouan, then Djerba,
	// flipping tile by tile) and the title laid in beige tiles beside it. The rest of the page sits on a
	// blue mosaic wall with the same tile size, whose tiles turn over now and then.
	import { onMount } from 'svelte';
	import { Mosaic, rng } from './mosaic.js';
	import { MOSQUES, ROWS, BAND, composeScene, wallTile, wallAt } from './mosqueArt.js';
	import { buildTitle, titleArray } from './titleMosaic.js';
	import Plaque from './components/Plaque.svelte';
	import MosaicBox from './components/MosaicBox.svelte';
	import LeghreebMosaic from './components/LeghreebMosaic.svelte';
	import CountScrolly from './components/CountScrolly.svelte';
	import TileBars from './components/TileBars.svelte';
	import NamesSection from './components/NamesSection.svelte';
	import QiblaSection from './components/QiblaSection.svelte';
	import AtlasSection from './components/AtlasSection.svelte';
	import AddMosque from './components/AddMosque.svelte';
	import PrayerSection from './components/PrayerSection.svelte';
	import { SUMMARY } from './countMap.js';

	// the stat boxes, computed from the data (Data/build_tnmosq_data.py)
	const fmtN = (n) => (n ?? 0).toLocaleString('en-US');
	const dist = (m) => (m == null ? '–' : m < 1000 ? `${m} M` : `${(m / 1000).toFixed(1)} KM`);
	const STATS = [
		{ n: fmtN(SUMMARY.mosques), label: 'mosques mapped so far' },
		{ n: `${SUMMARY.govsCovered ?? '–'}`, label: `of ${SUMMARY.govsTotal ?? 24} governorates covered` },
		{ n: fmtN(SUMMARY.named), label: 'with a name on record' },
		{ n: dist(SUMMARY.medianNearest), label: 'typical distance to the next mosque' }
	];

	// built: true = already on this page; the rest is listed under "Still to come"
	const CHAPTERS = [
		{ t: 'The count', built: true, d: 'A pixel Tunisia fills with mosque dots as you scroll, while a counter climbs to the total.' },
		{ t: 'How far is your nearest mosque?', d: 'Density per 10,000 residents, and nearest-mosque distances in medinas, suburbs and rural areas.' },
		{ t: 'The names', built: true, d: 'The most common name, then the words behind them: virtues, saints, companions, places.' },
		{ t: 'Which way do they face?', built: true, d: 'A rose chart of qibla deviations, with the most precise, the most off, and the historic ones.' },
		{ t: 'The giants', d: 'The biggest mosque in each governorate, drawn side by side at the same scale.' },
		{ t: 'Time', d: 'A short timeline of the few hundred mosques with known founding dates, from Kairouan onward.' },
		{ t: 'The gap', d: 'Mosques found versus the official count, and a call to add your neighbourhood mosque.' },
		{ t: 'The atlas', built: true, d: 'A searchable map. Each mosque opens a card: satellite view, outline, qibla arrows, sources.' }
	];

	/** @type {HTMLCanvasElement} */ let bgCanvas;
	/** @type {HTMLCanvasElement} */ let heroCanvas;
	/** @type {HTMLElement} */ let heroWrap;
	/** @type {HTMLElement} */ let pageEl;
	// #/tnMosq?m=kairouan (or any mosque id) opens on that mosque; read before anything is drawn
	const startAt = MOSQUES.findIndex((q) => q.id === new URLSearchParams(location.hash.split('?')[1] || '').get('m'));
	let current = Math.max(0, startAt);
	let reduced = false;
	// wide: mosque and title side by side (the name sign then sits inside the scene, bottom-right)
	let label = { wide: true, tile: 12, signLeft: 0, signTop: 0, signW: 0 };

	const wallRand = rng(3);
	const wallColor = () => wallTile(wallRand);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// navy page background only while this page is open (a :global(body) rule would stay
		// in the document after leaving and tint the home page)
		const prevBg = document.body.style.background;
		document.body.style.background = '#0a1630';

		const wall = new Mosaic(bgCanvas, { grout: '#0a1630', gapRatio: 0.09 });
		const hero = new Mosaic(heroCanvas, { grout: '#0a1630', gapRatio: 0.09 });
		/** @type {any} */ let heroPic = null;
		let heroVisible = true;
		const picked = new Set(); // hero tiles a visitor has clicked: kept until the next mosque
		let tile = 14;
		/** @type {any} */ let scene = null; // layout shared by every picture: cols, rows, cx, offset, title

		function layout() {
			const W = window.innerWidth, H = window.innerHeight;
			let T, cols, cx, rows, offset, t = null, region, wide = false;
			// wide screens: the whole scene fits in the first screen, mosque on the left, title beside it.
			// One tile size for the page: the 64-row drawing fills the screen height (never under 10 px);
			// any spare height becomes sky on top.
			for (T = Math.min(20, Math.max(10, Math.floor(H / (ROWS + BAND)))); T >= 10 && !t; T--) {
				cols = Math.floor(W / T);
				if (cols < 80) break;
				rows = Math.max(ROWS + BAND, Math.floor(H / T));
				offset = rows - ROWS - BAND;
				cx = Math.max(30, Math.round(cols * 0.22));
				const x0 = cx + 15; // clear of the widest minaret
				// right of the minarets the drawings stay low (below row 38), so the title lives above that
				region = { x0, y0: 5, w: cols - x0 - 2, h: offset + 37 - 5 };
				t = buildTitle(cols, region);
				if (t) { wide = true; break; }
			}
			if (!t) {
				// phones / narrow windows: title on top, mosque below
				for (T = Math.max(6, Math.min(12, Math.floor(W / 54))); T >= 4 && !t; T--) {
					cols = Math.floor(W / T);
					cx = Math.floor(cols / 2);
					region = { x0: 2, y0: Math.ceil(64 / T), w: cols - 4, h: 60 };
					t = buildTitle(cols, region);
					if (t) break;
				}
				offset = t.bottom + 7;
				rows = offset + ROWS + BAND;
			}
			tile = T;
			scene = { cols, rows, cx, offset, title: titleArray(t, cols, rows) };
			// the name sign sits just under the title (wide screens)
			label = { wide, tile: T, signLeft: t.left * T, signTop: (t.bottom + 2) * T, signW: t.width * T }; // centred under the title
		}

		const picture = (idx) =>
			composeScene({ mosque: MOSQUES[idx], cols: scene.cols, rows: scene.rows, cx: scene.cx, offset: scene.offset, title: scene.title });

		// the wall covers the whole page and scrolls with it (same grid as the scene: both start at the top-left)
		function sizeWall() {
			const cols = Math.ceil(pageEl.clientWidth / tile) + 1;
			const rows = Math.ceil(pageEl.offsetHeight / tile) + 1;
			if (cols === wall.cols && rows === wall.rows && wall.tile === tile) return;
			// keep the tiles already there: only the strip that's new gets painted
			wall.resizeKeep(cols, rows, tile, wallAt);
		}

		function sizeAll() {
			layout();
			sizeWall();
			hero.resize(scene.cols, scene.rows, tile);
			heroPic = picture(current);
			hero.paint(heroPic);
		}

		sizeAll();

		// Change of mosque: only the tiles that differ turn over, each at a random moment,
		// until the new picture is complete. Then it holds for HOLD ms.
		const HOLD = 3000;
		const SPREAD = 1500; // ms over which the changing tiles start flipping
		const FLIP = 550;
		let transitionEnd = 0;
		let nextAt = performance.now() + HOLD;
		/** @param {number} idx */
		function show(idx) {
			current = idx;
			heroPic = picture(idx);
			picked.clear();
			const now = performance.now();
			if (reduced) { hero.paint(heroPic); transitionEnd = now; }
			else {
				hero.flipTo(heroPic, () => Math.random() * SPREAD, now, FLIP);
				transitionEnd = now + SPREAD + FLIP;
			}
			nextAt = transitionEnd + HOLD;
		}
		const next = () => show((current + 1) % MOSQUES.length);
		jumpTo = (i) => { if (i !== current) show(i); };

		// main loop: advance flips, turn a few random tiles over, cycle the mosques
		/** @type {number} */ let raf;
		let lastWall = 0, lastHero = 0, lastTick = 0;
		// is the scene on screen? checked directly each frame (an observer's first report can be stale
		// when arriving from a scrolled page, which used to leave the slideshow stuck on Al-Zaytuna)
		const onScreen = () => {
			const r = heroWrap.getBoundingClientRect();
			return r.bottom > 0 && r.top < window.innerHeight;
		};
		/** @param {number} now */
		function step(now) {
			heroVisible = onScreen();
			if (!reduced) {
				if (now - lastWall > 140 && wall.colors) {
					lastWall = now;
					// about the same number of flips per screen, however long the page is
					const screens = Math.max(1, (wall.rows * tile) / window.innerHeight);
					const n = Math.round(screens * (1 + Math.random()));
					for (let k = 0; k < n; k++) wall.flip((Math.random() * wall.colors.length) | 0, wallColor(), now, 800);
				}
				// between transitions, a single tile turns over now and then (same colour, just the movement)
				if (heroVisible && now > transitionEnd && now - lastHero > 300 && heroPic && hero.colors) {
					lastHero = now;
					const i = (Math.random() * hero.colors.length) | 0;
					if (!hero.anims.has(i) && !picked.has(i)) hero.flip(i, heroPic(i % hero.cols, (i / hero.cols) | 0), now, 700);
				}
			}
			if (heroVisible && now >= nextAt) next();
			wall.frame(now);
			hero.frame(now);
		}
		// the loop always schedules its next frame first, so one failed frame can never freeze the page
		/** @param {number} now */
		function loop(now) {
			raf = requestAnimationFrame(loop);
			lastTick = performance.now();
			try { step(now); } catch (e) { console.error(e); }
		}
		raf = requestAnimationFrame(loop);
		// watchdog: if frames stop arriving while the page is visible, start the loop again
		const watchdog = setInterval(() => {
			if (document.visibilityState === 'visible' && performance.now() - lastTick > 2000) {
				cancelAnimationFrame(raf);
				raf = requestAnimationFrame(loop);
			}
		}, 1000);
		// coming back to the tab: don't fire a backlog of changes, just resume the rhythm
		const onVisible = () => { if (document.visibilityState === 'visible') nextAt = Math.max(nextAt, performance.now() + 1500); };
		document.addEventListener('visibilitychange', onVisible);

		// clicks: a tile of the scene, or of the wall behind the page, turns to another colour from the palette
		pokeHero = (e) => {
			if (e.__mosaic) return; // the sign already flipped one of its own tiles
			const i = hero.pokeAt(e.clientX, e.clientY);
			if (i >= 0) { picked.add(i); e.__mosaic = true; }
		};
		pokeWall = (e) => {
			if (e.__mosaic) return;
			if (e.target.closest && e.target.closest('a, button, .box, .plaque, .hero')) return;
			wall.pokeAt(e.clientX, e.clientY);
		};


		// page height changes (fonts, boxes snapping to tiles): grow or shrink the wall to match
		const pageRO = new ResizeObserver(() => sizeWall());
		pageRO.observe(pageEl);

		/** @type {any} */ let resizeTimer;
		let lastW = window.innerWidth, lastH = window.innerHeight;
		const onResize = () => {
			// phones fire resize when the address bar slides; ignore small height-only changes
			if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < tile * 3) return;
			lastW = window.innerWidth;
			lastH = window.innerHeight;
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(sizeAll, 150);
		};
		window.addEventListener('resize', onResize);

		return () => {
			document.body.style.background = prevBg;
			cancelAnimationFrame(raf);
			clearInterval(watchdog);
			document.removeEventListener('visibilitychange', onVisible);
			pageRO.disconnect();
			window.removeEventListener('resize', onResize);
			clearTimeout(resizeTimer);
		};
	});

	/** @type {(i: number) => void} */
	let jumpTo = (i) => {};
	/** @type {(e: MouseEvent) => void} */ let pokeHero = () => {};
	/** @type {(e: MouseEvent) => void} */ let pokeWall = () => {};
	$: m = MOSQUES[current];
	const SIGNS = MOSQUES.map((q) => ({ text: q.name, tab: q.place }));
	let vw = 1200;
	$: small = vw < 640;
</script>

<svelte:window bind:innerWidth={vw} />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=Amiri:wght@400;700&family=Work+Sans:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="page" data-only={(location.hash.match(/only=(\d)/) || [])[1] || ''} bind:this={pageEl} on:click={pokeWall}>
	<div class="wall-wrap" aria-hidden="true"><canvas class="wall" bind:this={bgCanvas} /></div>
	<!-- Leghreeb in half-size tiles, one tile in from the corner so he still lines up with the scene's grid -->
	<div class="home" style="top:{label.tile}px; left:{label.tile}px">
		{#key label.tile}<LeghreebMosaic cols={16} tile={label.tile / 2} ink={0.26} />{/key}
	</div>

	<!-- opening mosaic: mosque + tiled title -->
	<!-- clicks anywhere on the scene (also around the name sign) flip the scene tile underneath -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
	<header class="hero" bind:this={heroWrap} on:click={pokeHero}>
		<canvas bind:this={heroCanvas} aria-hidden="true" />
		<h1 class="sr">Mapping every mosque in Tunisia</h1>
		<!-- the mosque's name on a street sign; its tiles flip when the mosque changes -->
		<div class="caption" class:overlay={label.wide} style={label.wide ? `left:${label.signLeft}px; top:${label.signTop}px; width:${label.signW}px` : ''}>
			<Plaque tab={m.place} text={m.name} fitAll={SIGNS} tile={3} align={label.wide ? 'center' : 'left'} maxCols={170} />
		</div>
	</header>

	<main>
		<!-- 01: the project, cream mosaic in a black-and-white door frame -->
		<section class="panel">
			<MosaicBox variant="light" frame="ablaq" tile={small ? 6 : 9} pad={small ? 18 : 36}>
				<Plaque tab="01" text="How many mosques does Tunisia have?" tile={small ? 3 : 5} align="center" />
				<p class="body">
					Every minaret, every neighbourhood masjid, every village mosque, placed on one map and read for what
					it says about the country. Nobody seems to have one list, so we are building it from OpenStreetMap,
					Wikidata and other open sources, merging duplicates and reading each building's outline: how big it
					is, which way it faces, and how far it sits from the next one.
				</p>

				<div class="stats">
					{#each STATS as s}
						<MosaicBox variant="light" frame="thin" tile={6} pad={14}>
							<Plaque bare text={s.n} tile={small ? 4 : 5} color="#2b5fae" align="center" />
							<span class="stat-l">{s.label}</span>
						</MosaicBox>
					{/each}
				</div>
				<p class="fine">Draft figures. Collection is still under way, so every number here will change.</p>

				<!-- the count: a sticky tiled map that fills with mosques as you scroll -->
				<CountScrolly {small} />

				<h3 class="sub">Found so far, by governorate</h3>
				<p class="note">Each tile is 10 mosques. A lighter last tile means it is only partly filled.</p>
				<TileBars tile={small ? 5 : 9} />

			</MosaicBox>
		</section>

		<!-- 03: the names -->
		<section class="panel">
			<MosaicBox variant="light" frame="ablaq" tile={small ? 6 : 9} pad={small ? 18 : 36}>
				<Plaque tab="03" text="What are they called?" tile={small ? 3 : 5} align="center" />
				<NamesSection {small} />
			</MosaicBox>
		</section>

		<!-- 04: which way do they face -->
		<section class="panel">
			<MosaicBox variant="light" frame="ablaq" tile={small ? 6 : 9} pad={small ? 18 : 36}>
				<Plaque tab="04" text="Which way do they face?" tile={small ? 3 : 5} align="center" />
				<QiblaSection {small} />
			</MosaicBox>
		</section>

		<!-- prayer times across the country -->
		<section class="panel">
			<MosaicBox variant="light" frame="ablaq" tile={small ? 6 : 9} pad={small ? 18 : 36}>
				<Plaque tab="05" text="When does Tunisia pray?" tile={small ? 3 : 5} align="center" />
				<PrayerSection {small} />
			</MosaicBox>
		</section>

		<!-- 08: the atlas -->
		<section class="panel wide">
			<MosaicBox variant="light" frame="ablaq" tile={small ? 6 : 9} pad={small ? 18 : 36}>
				<Plaque tab="08" text="The atlas" tile={small ? 3 : 5} align="center" />
				<AtlasSection {small} />
			</MosaicBox>
		</section>

		<!-- 07: add a mosque, at the very end -->
		<section class="panel">
			<MosaicBox variant="dark" frame="ablaq" tile={small ? 6 : 9} pad={small ? 18 : 36}>
				<Plaque tab="07" text="Help us find the rest" tile={small ? 3 : 5} align="center" />
				<p class="add-intro">
					Know a mosque that's missing? Add it here. Every submission is checked before it goes on the map.
				</p>
				<AddMosque {small} />
			</MosaicBox>
		</section>
	</main>
</div>

<style>
	/* TEMP-ONLY */ .page:not([data-only='']) > header { display: none; }
	.page[data-only='3'] main > section:not(:nth-of-type(2)), .page[data-only='4'] main > section:not(:nth-of-type(3)),
	.page[data-only='5'] main > section:not(:nth-of-type(4)), .page[data-only='8'] main > section:not(:nth-of-type(5)), .page[data-only='7'] main > section:not(:nth-of-type(6)), .page[data-only='1'] main > section:not(:nth-of-type(1)) { display: none; }
	/* the wall sits behind everything and scrolls with the page */
	.wall-wrap {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
	}
	.wall { display: block; }
	.page > header,
	.page > main {
		position: relative;
		z-index: 1;
	}

	.page {
		--beige: #ecd9b4;
		--beige-dim: #cdb88f;
		--navy: #0b1838;
		--blue: #2b5fae;
		position: relative;
		z-index: 1;
		font-family: 'Work Sans', system-ui, sans-serif;
		color: var(--beige);
		overflow-x: clip; /* clip, not hidden: hidden would break the sticky map in section 01 */
	}

	.home {
		position: absolute;
		z-index: 2;
	}

	/* ---- opening mosaic ---- */
	.hero {
		position: relative;
		background: #0a1630;
	}
	.hero canvas { display: block; cursor: pointer; }
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	main {
		padding: 0 16px 80px;
	}

	/* ---- caption: street sign + note + buttons ---- */
	.caption {
		padding: 14px 16px 0;
	}
	.caption.overlay {
		position: absolute;
		padding: 0;
	}
	/* ---- panels ---- */
	.panel.wide { max-width: 1200px; }
	.add-intro { color: #ece6da; font-size: 1.05rem; line-height: 1.6; max-width: 640px; margin: 24px auto 22px; }
	.panel {
		max-width: 1000px;
		margin: 72px auto 0;
		box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
	}
	.body {
		font-size: 1.06rem;
		line-height: 1.65;
		max-width: 680px;
		margin: 28px auto 0;
	}
	/* all text in the sections is centred */
	.panel { text-align: center; }
	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 12px;
		margin: 32px 0 12px;
	}
	.stats :global(.plaque) { text-align: center !important; }
	.sub {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 1.35rem;
		margin: 48px 0 4px;
		color: #13213f;
	}
	.note { margin: 0 auto; max-width: 720px; font-size: 0.88rem; color: #5d6780; }
	.stat-l { display: block; margin-top: 10px; font-size: 0.9rem; line-height: 1.35; }
	.fine { font-size: 0.85rem; color: #5d6780; margin: 12px auto 0; }

	.chapters {
		list-style: none;
		padding: 0;
		margin: 28px 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 12px;
	}
	.ch { display: flex; gap: 14px; align-items: flex-start; }
	.ch :global(.plaque) { width: auto; flex-shrink: 0; }
	.chapters h3 {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 1.12rem;
		margin: 0 0 6px;
		color: #ece6da;
	}
	.chapters p { margin: 0; font-size: 0.92rem; line-height: 1.5; color: #b8b2a6; }

	footer {
		max-width: 1000px;
		margin: 72px auto 0;
		text-align: center;
	}
	footer p {
		display: inline-block;
		margin: 14px 0 0;
		background: rgba(11, 24, 56, 0.9);
		padding: 6px 12px;
		color: var(--beige);
	}

</style>
