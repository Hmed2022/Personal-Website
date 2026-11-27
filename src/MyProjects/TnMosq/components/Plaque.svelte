<script>
	// A street-sign plaque in mosaic tiles, after the enamel signs of Paris (Rue de Tunis):
	// green border with concave corners and rosettes, blue enamel field, a thin white inner line,
	// white capitals, and an optional arched tab on top with a short label.
	// `bare` drops the sign and keeps only the letters (for numbers and small labels).
	// When the text changes, the tiles that differ flip over.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';
	import { BOLD, wrap, lineWidth, drawLines } from '../pixelFonts.js';

	export let text = '';
	export let tab = '';
	export let tile = 5;
	export let align = 'left'; // left | center | right, within the container
	export let maxCols = 0; // cap on the sign's width, in tiles (0 = container width)
	export let bare = false;
	export let color = '#f2efe8'; // letter colour
	export let label = ''; // accessible text; defaults to `text`
	// other {text, tab} pairs this sign will show: it takes the size of the largest,
	// so it stays put (only tiles flip) when the text changes
	export let fitAll = [];
	export let flipSpread = 900; // ms over which changed tiles start flipping (short for counters)

	let canvas;
	let width = 0;
	/** @type {Mosaic | null} */ let mosaic = null;
	let timer;

	const GREEN = rgb('#2f5e4e');
	const GREEN_L = rgb('#3f7363');
	const FIELD = rgb('#28348c');
	const WHITE = rgb('#ffffff');
	const SCREW = rgb('#3a2a20');

	// fixed shade per tile so re-renders only flip what changed
	const jit = (i, base) => {
		let h = Math.imul(i ^ 0x5bd1e995, 0x27d4eb2f);
		h ^= h >>> 15;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * 0.08;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	function layout() {
		const avail = Math.max(12, Math.floor(width / tile));
		const cap = maxCols ? Math.min(avail, maxCols) : avail;
		const ink = rgb(color);

		if (bare) {
			const lines = wrap(BOLD, text, cap);
			const cols = Math.max(1, ...lines.map((l) => lineWidth(BOLD, l)));
			const rows = lines.length * 10 - 3;
			const cells = new Array(cols * rows).fill(null);
			for (const [x, y] of drawLines(BOLD, lines, { width: cols, align: align === 'center' ? 'center' : 'left' }))
				cells[y * cols + x] = jit(y * cols + x, ink);
			return { cols, rows, cells };
		}

		const PAD = 6; // border 2 + white line 1 + 3 tiles of air
		const wrapOf = (t) => wrap(BOLD, String(t).toUpperCase(), Math.max(10, cap - 2 * PAD));
		const lines = wrapOf(text);
		const all = [{ text, tab }, ...fitAll];
		const wraps = all.map((o) => wrapOf(o.text));
		const textW = Math.max(...wraps.flat().map((l) => lineWidth(BOLD, l)));
		const nLines = Math.max(...wraps.map((w) => w.length));
		const tabText = String(tab).toUpperCase();
		const tabTextW = tab ? lineWidth(BOLD, tabText) : 0;
		const maxTabW = Math.max(0, ...all.filter((o) => o.tab).map((o) => lineWidth(BOLD, String(o.tab).toUpperCase())));
		const tabW = maxTabW + 12;
		const tabH = tab ? 14 : 0;
		const cols = Math.max(textW + 2 * PAD, tab ? tabW + 12 : 0);
		const mainTop = tab ? tabH - 3 : 0;
		const textH = nLines * 10 - 3;
		const mainH = textH + 2 * PAD;
		const rows = mainTop + mainH;
		const kind = new Array(cols * rows).fill(0); // 0 none, 1 green, 2 field, 3 white, 4 rosette, 5 screw
		const at = (x, y) => y * cols + x;

		// tab: rounded top corners
		if (tab) {
			const tx0 = Math.floor((cols - tabW) / 2), tx1 = tx0 + tabW - 1;
			const inside = (x, y, s) => {
				const R = 6 - s;
				if (x < tx0 + s || x > tx1 - s || y < s) return false;
				const dx = x < tx0 + s + R ? tx0 + s + R - x - 0.5 : x > tx1 - s - R ? x - (tx1 - s - R) + 0.5 : 0;
				const dy = y < s + R ? s + R - y - 0.5 : 0;
				return dx * dx + dy * dy <= R * R;
			};
			for (let y = 0; y < tabH; y++)
				for (let x = tx0; x <= tx1; x++) if (inside(x, y, 0)) kind[at(x, y)] = inside(x, y, 2) ? 2 : 1;
		}

		// main panel: green border with concave notches at the corners
		const corners = [[0, 0], [cols - 1, 0], [0, mainH - 1], [cols - 1, mainH - 1]];
		for (let ly = 0; ly < mainH; ly++)
			for (let x = 0; x < cols; x++) {
				const d = Math.min(x, ly, cols - 1 - x, mainH - 1 - ly);
				const near = Math.min(...corners.map(([cx, cy]) => Math.hypot(x - cx, ly - cy)));
				kind[at(x, mainTop + ly)] = d >= 2 && near >= 6 ? 2 : 1;
			}
		// thin white line just inside the field's edge
		const field = kind.map((k) => k === 2);
		for (let y = 0; y < rows; y++)
			for (let x = 0; x < cols; x++) {
				if (!field[at(x, y)]) continue;
				const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
					const nx = x + dx, ny = y + dy;
					return nx < 0 || ny < 0 || nx >= cols || ny >= rows || !field[at(nx, ny)];
				});
				if (edge && (y >= mainTop || !tab)) kind[at(x, y)] = 3;
			}
		// rosettes with a screw at each corner
		for (const [cx, cy] of corners) {
			const rx = cx === 0 ? 2.5 : cols - 3.5, ry = mainTop + (cy === 0 ? 2.5 : mainH - 3.5);
			for (let y = Math.floor(ry - 3); y <= Math.ceil(ry + 3); y++)
				for (let x = Math.floor(rx - 3); x <= Math.ceil(rx + 3); x++) {
					if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
					const dist = Math.hypot(x + 0.5 - (rx + 0.5), y + 0.5 - (ry + 0.5));
					if (dist <= 0.8) kind[at(x, y)] = 5;
					else if (dist <= 2.9) kind[at(x, y)] = dist > 1.9 && x + y < rx + ry ? 3 : 4;
				}
		}

		const palette = [null, GREEN, FIELD, WHITE, GREEN_L, SCREW];
		const cells = kind.map((k, i) => (k ? jit(i, palette[k]) : null));
		const put = (pts) => { for (const [x, y] of pts) if (x >= 0 && y >= 0 && x < cols && y < rows) cells[at(x, y)] = jit(at(x, y), WHITE); };
		const vShift = Math.floor(((nLines - lines.length) * 10) / 2); // centre shorter names vertically
		put(drawLines(BOLD, lines, { x0: PAD, y0: mainTop + PAD + vShift, width: cols - 2 * PAD, align: 'center' }));
		if (tab) put(drawLines(BOLD, [tabText], { x0: Math.floor((cols - tabTextW) / 2), y0: 4 }));
		return { cols, rows, cells };
	}

	function render() {
		if (!mosaic || !width) return;
		const { cols, rows, cells } = layout();
		const fn = (c, r) => cells[r * cols + c];
		if (cols === mosaic.cols && rows === mosaic.rows && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			mosaic.flipTo(fn, () => Math.random() * flipSpread, performance.now(), Math.min(500, 200 + flipSpread / 2));
			mosaic.kick();
		} else {
			mosaic.resize(cols, rows, tile);
			mosaic.paint(fn);
		}
	}

	// a click turns the tile under it to another colour from the palette
	function poke(e) {
		if (mosaic && mosaic.pokeAt(e.clientX, e.clientY) >= 0) e.__mosaic = true;
	}

	onMount(() => {
		mosaic = new Mosaic(canvas, { grout: bare ? '#0a1630' : '#16223a', gapRatio: 0.12, transparent: true });
		render();
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 900 + Math.random() * 900);
		}
	});
	onDestroy(() => { clearInterval(timer); if (mosaic) mosaic.destroy(); });

	$: text, tab, width, tile, color, render();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="plaque" style="text-align:{align}" bind:clientWidth={width} on:click={poke} role="img" aria-label={label || (tab ? tab + ' — ' : '') + text}>
	<canvas bind:this={canvas} />
</div>

<style>
	.plaque { width: 100%; line-height: 0; }
	canvas { display: inline-block; max-width: 100%; cursor: pointer; }
</style>
