// The title laid in mosaic tiles over the mosque scene, in the small 5-row capitals
// (one font pixel = one tile). Each letter tile casts a one-tile shadow down-right,
// which keeps the beige legible on the blues.
import { rgb, rng } from './mosaic.js';
import { SMALL, lineWidth, drawLines } from './pixelFonts.js';

const FULL = rgb('#ecd9b4');
const SHADOW = rgb('#0a1630');
const FONT = SMALL;
const PITCH = FONT.height + 3; // rows from one line to the next

// the title's line breaks; the later ones are fallbacks for narrow screens
const OPTIONS = [
	['MAPPING EVERY', 'MOSQUE', 'IN TUNISIA'],
	['MAPPING', 'EVERY MOSQUE', 'IN TUNISIA'],
	['MAPPING', 'EVERY', 'MOSQUE', 'IN TUNISIA']
];

const blockHeight = (lines) => (lines.length - 1) * PITCH + FONT.height;

// region in tiles: { x0, y0, w, h }. Returns null when no layout fits.
export function buildTitle(cols, region) {
	const lines = OPTIONS.find((ls) => Math.max(...ls.map((l) => lineWidth(FONT, l))) <= region.w && blockHeight(ls) <= region.h);
	if (!lines) return null;
	const top = region.y0;
	const pts = drawLines(FONT, lines, { x0: region.x0, y0: top, pitch: PITCH });
	const on = new Set(pts.map(([x, y]) => y * cols + x));

	const rand = rng(5);
	const cells = [];
	for (const i of on) {
		const j = 1 + (rand() - 0.5) * 0.08;
		cells.push([i % cols, (i / cols) | 0, FULL.map((v) => Math.min(255, Math.round(v * j)))]);
	}
	for (const i of on) {
		const c = i % cols, r = (i / cols) | 0;
		if (!on.has((r + 1) * cols + c + 1) && c + 1 < cols) cells.push([c + 1, r + 1, SHADOW]);
	}
	const last = lines[lines.length - 1];
	return {
		cells,
		top,
		bottom: top + blockHeight(lines),
		left: region.x0,
		width: Math.max(...lines.map((l) => lineWidth(FONT, l))),
		lastTop: top + (lines.length - 1) * PITCH,
		lastEnd: region.x0 + lineWidth(FONT, last)
	};
}

// spread the cells into a cols * rows array for composeScene
export function titleArray(title, cols, rows) {
	const arr = new Array(cols * rows).fill(null);
	for (const [c, r, col] of title.cells) if (r < rows && !arr[r * cols + c]) arr[r * cols + c] = col;
	return arr;
}
