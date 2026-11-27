// Pixel-art mosques for the hero mosaic. Each drawing fills a grid of single-letter tokens
// (rows are fixed, columns follow the screen width; the building is centred and the sky / ground
// stretch to the edges). `composeScene` turns the tokens into tile colours with a little jitter,
// so the same picture always looks hand-laid rather than flat.
import { rgb, rng } from './mosaic.js';

export const ROWS = 64;
export const BAND = 5; // black-and-white block band under the scene (like the door frames)
const BAND_INK = rgb('#3a3a43'); // charcoal rather than pure black, so the dark grout between tiles shows
const BAND_CHALK = rgb('#f4f1ea');

const PALETTE = {
	L: '#ecd3a0', // lit stone
	M: '#c9a874', // stone in shade
	D: '#9c7b52', // deep shade / carved lines
	E: '#f7e6c0', // edge highlight
	K: '#2a1d16', // dark opening
	k: '#53607a', // latticed window (sky seen through)
	G: '#2f7a55', g: '#1d5a3d', // green tile roof
	Y: '#e0ad48', y: '#a87a2a', // gold finial
	W: '#f6f3ec', w: '#d3d0c8', // whitewash, whitewash in shade
	C: '#d9d0c1', c: '#a99d8c', N: '#5f564c', // city roofs
	A: '#d9bc8c', a: '#c2a272', // sand
	P: '#2f6b3d', p: '#21502c', T: '#7b5a3a', // palm
	B: '#2a63b8', // Djerba blue door
	V: '#b4b1aa' // shadow line between white volumes
};

// the sky uses the same blues as the page's mosaic wall, so the scene and the wall read as one surface
export const WALL_HEX = ['#14306a', '#173a7a', '#1d4790', '#22529e', '#2b5fae', '#112a5e'];
const WALL = WALL_HEX.map(rgb);
const ACCENT = ['#e8d5b0', '#f3efe6'].map(rgb);
export function wallTile(rand) {
	const p = rand();
	if (p < 0.008) return ACCENT[0];
	if (p < 0.012) return ACCENT[1];
	const c = WALL[(rand() * WALL.length) | 0];
	const j = 1 + (rand() - 0.5) * 0.08;
	return c.map((v) => v * j);
}

// ---- drawing helpers on a token grid ----
function grid(cols) {
	const g = Array.from({ length: ROWS }, () => new Array(cols).fill('S'));
	const set = (x, y, t) => { if (y >= 0 && y < ROWS && x >= 0 && x < cols) g[y][x] = t; };
	const rect = (x0, y0, x1, y1, t) => {
		for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, typeof t === 'function' ? t(x, y) : t);
	};
	return { g, set, rect };
}

// diamond lattice like the carved panels on the Zitouna minaret
const lattice = (x, y, base, line) => ((((x - y) % 4) + 4) % 4 === 0 || (x + y) % 4 === 0 ? line : base);

function dome(rect, cx, baseY, radius, lit, shade, ribbed = false) {
	for (let yy = 0; yy <= radius; yy++) {
		const y = baseY - yy;
		const half = Math.round(Math.sqrt(Math.max(0, (radius + 0.5) ** 2 - yy * yy)));
		rect(cx - half, y, cx + half, y, (x) => {
			const left = x <= cx;
			if (ribbed && x % 2 === 0) return left ? 'M' : 'D';
			return left ? lit : shade;
		});
	}
}

// Finial: a crescent (horns up) on a pole, drawn upward from row `bottom`.
//   'l'  crescent, pole, a solid gold ball (5 rows)   's'  crescent on a pole (4 rows)
function finial(set, x, bottom, size = 's') {
	const rows = size === 'l'
		? [['Y', '.', 'Y'], ['.', 'Y', '.'], ['.', 'y', '.'], ['Y', 'Y', 'y'], ['Y', 'Y', 'y']]
		: [['Y', '.', 'Y'], ['.', 'Y', '.'], ['.', 'y', '.'], ['.', 'y', '.']];
	const top = bottom - rows.length + 1;
	rows.forEach((row, i) => row.forEach((t, k) => { if (t !== '.') set(x - 1 + k, top + i, t); }));
}

// ---- Zitouna, Tunis: the tall square minaret, lit gold on one face ----
function zitouna(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(7);

	// medina rooftops
	for (let x = 0; x < cols; ) {
		const w = 3 + Math.floor(r() * 5);
		const top = 50 + Math.floor(r() * 7);
		rect(x, top, x + w - 1, ROWS - 1, (xx, yy) => (xx === x + w - 1 ? 'c' : r() < 0.06 && yy > top + 1 ? 'N' : 'C'));
		x += w;
	}

	const face = (x, litT, shadeT) => (x <= cx ? litT : shadeT);
	const oy = 6;

	finial(set, cx, oy + 2, 'l');

	// green pyramid roof
	for (let i = 0; i < 5; i++) rect(cx - 1 - i, oy + 3 + i, cx + 1 + i, oy + 3 + i, (x) => face(x, 'G', 'g'));

	// lantern with merlons and an arched window on each face
	rect(cx - 6, oy + 8, cx + 6, oy + 8, (x) => ((x - cx) % 2 === 0 ? face(x, 'L', 'M') : 'S'));
	rect(cx - 6, oy + 9, cx + 6, oy + 17, (x) => face(x, 'L', 'M'));
	for (const s of [-1, 1]) {
		const wx = cx + s * 3;
		rect(wx - 1, oy + 12, wx + 1, oy + 16, 'k');
		set(wx, oy + 11, 'k');
		rect(wx - 2, oy + 17, wx + 2, oy + 17, face(wx, 'M', 'D'));
	}

	// crenellated balcony
	rect(cx - 11, oy + 18, cx + 11, oy + 18, (x) => ((x - cx) % 2 === 0 ? face(x, 'E', 'M') : 'S'));
	rect(cx - 11, oy + 19, cx + 11, oy + 20, (x) => face(x, 'L', 'M'));
	rect(cx - 11, oy + 21, cx + 11, oy + 21, (x) => face(x, 'M', 'D'));

	// upper shaft: arcade of small arches, then a lattice band
	rect(cx - 10, oy + 22, cx + 10, oy + 33, (x) => face(x, 'L', 'M'));
	for (const s of [-1, 1]) {
		for (let k = 1; k <= 4; k++) {
			const ax = cx + s * (k * 2);
			rect(ax, oy + 25, ax, oy + 28, 'K');
		}
		const x0 = s < 0 ? cx - 9 : cx + 1;
		const x1 = s < 0 ? cx - 1 : cx + 9;
		rect(x0, oy + 23, x1, oy + 23, s < 0 ? 'M' : 'D');
		rect(x0, oy + 29, x1, oy + 29, s < 0 ? 'M' : 'D');
		rect(x0, oy + 30, x1, oy + 33, (x, y) => lattice(x, y, s < 0 ? 'M' : 'D', s < 0 ? 'E' : 'L'));
	}

	// moulding
	rect(cx - 11, oy + 34, cx + 11, oy + 34, (x) => face(x, 'E', 'L'));
	rect(cx - 11, oy + 35, cx + 11, oy + 35, (x) => face(x, 'M', 'D'));

	// lower shaft with two big carved panels
	rect(cx - 10, oy + 36, cx + 10, ROWS - 1, (x) => face(x, 'L', 'M'));
	rect(cx - 8, oy + 39, cx - 2, ROWS - 1, (x, y) => lattice(x, y, 'M', 'E'));
	rect(cx + 2, oy + 39, cx + 8, ROWS - 1, (x, y) => lattice(x, y, 'D', 'L'));
	rect(cx, oy + 9, cx, ROWS - 1, (x, y) => (g[y][x] === 'L' ? 'E' : g[y][x]));

	// small white dome in front, as in the photo
	dome(rect, cx - 1, ROWS - 1, 4, 'W', 'w');
	return g;
}

// ---- Great Mosque of Kairouan: three-tier minaret, buttressed walls, ribbed dome ----
function kairouan(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(11);

	rect(0, 59, cols - 1, ROWS - 1, () => (r() < 0.25 ? 'a' : 'A'));

	// courtyard wall with buttresses and merlons
	rect(0, 46, cols - 1, 46, (x) => (x % 2 === 0 ? 'M' : 'S'));
	rect(0, 47, cols - 1, 58, () => (r() < 0.08 ? 'D' : 'M'));
	for (let b = ((cx % 7) + 7) % 7; b < cols; b += 7) {
		rect(b, 45, b, 58, 'L');
		rect(b + 1, 45, b + 1, 58, 'D');
	}

	// gate
	const gx = cx + 9;
	rect(gx - 2, 50, gx + 2, 58, 'L');
	rect(gx - 1, 51, gx + 1, 58, 'K');
	set(gx, 50, 'K');

	// prayer-hall dome on a drum
	const dx = cx - 21;
	rect(dx - 4, 40, dx + 4, 46, (x) => (x <= dx ? 'L' : 'M'));
	rect(dx - 1, 42, dx + 1, 44, 'K');
	dome(rect, dx, 39, 4, 'L', 'M', true);
	finial(set, dx, 34, 's');

	// minaret, seen front-on with a sliver of the side face
	const mx = cx - 7;
	const tier = (half, y0, y1) => {
		rect(mx - half, y0, mx + half, y1, () => (r() < 0.07 ? 'M' : 'L'));
		rect(mx + half + 1, y0, mx + half + 2, y1, 'D');
		rect(mx - half, y0 - 1, mx + half + 2, y0 - 1, (x) => ((x - mx) % 2 === 0 ? (x > mx + half ? 'D' : 'L') : 'S'));
		for (let y = y0 + 4; y < y1; y += 5) rect(mx - half, y, mx + half, y, (x) => (g[y][x] === 'L' ? 'M' : g[y][x]));
	};
	tier(9, 26, 58);
	tier(6, 16, 24);
	tier(4, 9, 14);
	for (const y of [33, 41, 49]) rect(mx, y, mx, y + 2, 'K');
	for (const s of [-5, 5]) { rect(mx + s - 1, 28, mx + s + 1, 31, 'D'); set(mx + s, 27, 'D'); }
	rect(mx - 1, 18, mx + 1, 22, 'K'); set(mx, 17, 'K');
	rect(mx, 10, mx, 12, 'K');
	dome(rect, mx, 8, 4, 'L', 'M', true);
	finial(set, mx, 3, 's');
	return g;
}

// ---- Djerba: Fadhloun, a low whitewashed mosque with a stubby tapering minaret, outside stairs, a palm ----
function djerba(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(23);
	rect(0, 56, cols - 1, ROWS - 1, () => (r() < 0.25 ? 'a' : 'A'));

	// palm on the left
	const px = cx - 28, top = 24;
	for (let y = top; y <= 56; y++) set(px + ((y - top) / 10 | 0) % 2, y, 'T');
	for (const s of [-1, 1]) {
		for (let k = 1; k <= 7; k++) {
			const y = top + Math.round((k * k) / 8) - (k < 3 ? 1 : 0);
			set(px + s * k, y, 'P');
			set(px + s * k, y + 1, 'p');
		}
		set(px + s, top - 2, 'P');
		set(px + s * 2, top - 3, 'P');
	}
	set(px, top - 1, 'P');

	// main body and the sloping buttress
	rect(cx - 18, 38, cx + 22, 55, 'W');
	rect(cx + 20, 38, cx + 22, 55, 'w');
	rect(cx - 18, 55, cx + 22, 55, 'w');
	for (let y = 41; y <= 55; y++) rect(cx + 23, y, cx + 23 + ((y - 41) / 3 | 0), y, 'w');
	rect(cx - 18, 38, cx + 22, 38, 'V');

	// a barrel vault and a large dome on the roof
	dome(rect, cx - 4, 37, 4, 'W', 'w');
	dome(rect, cx + 10, 37, 7, 'W', 'w');

	// outside staircase up to the roof
	for (let i = 0; i < 14; i++) {
		const x = cx - 32 + i;
		const t = 55 - Math.round(i * 1.25);
		rect(x, t, x, 55, 'W');
		set(x, t, 'V');
	}

	// tapering minaret with a rounded cap
	const mx = cx - 13;
	for (let y = 14; y <= 37; y++) {
		const half = 3 + ((y - 14) / 8 | 0);
		rect(mx - half, y, mx + half, y, (x) => (x >= mx + half - 1 ? 'w' : 'W'));
	}
	rect(mx - 2, 13, mx + 2, 13, 'W');
	rect(mx - 3, 12, mx + 3, 12, (x) => (x === mx + 3 ? 'w' : 'W'));
	rect(mx - 2, 11, mx + 2, 11, 'W');
	rect(mx - 1, 10, mx + 1, 10, 'W');
	set(mx, 9, 'W');
	rect(mx, 18, mx, 20, 'K');
	rect(mx, 27, mx, 29, 'K');

	// blue door and windows
	rect(cx + 1, 45, cx + 4, 54, 'B');
	rect(cx + 2, 44, cx + 3, 44, 'B');
	for (const wx of [cx - 9, cx + 12, cx + 17]) rect(wx, 43, wx + 1, 44, 'B');
	return g;
}

// ---- Sidi Mahrez, Tunis: a white Ottoman cascade of domes ----
function sidiMahrez(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	medina(rect, cols, rng(31), 54);
	// base
	rect(cx - 25, 42, cx + 25, 59, (x) => (x > cx + 21 ? 'w' : 'W'));
	rect(cx - 25, 42, cx + 25, 42, 'V');
	for (let x = cx - 22; x <= cx + 22; x += 4) { rect(x, 47, x, 51, 'K'); rect(x, 54, x, 56, 'K'); }
	rect(cx - 25, 59, cx + 25, 59, 'w');
	for (const s of [-1, 1]) {
		// small corner domes
		dome(rect, cx + s * 22, 41, 3, 'W', 'w');
		set(cx + s * 22, 37, 'Y');
		// secondary domes on drums
		const x0 = cx + s * 14;
		rect(x0 - 5, 37, x0 + 5, 41, (x) => (x > x0 + 2 ? 'w' : 'W'));
		rect(x0 - 5, 41, x0 + 5, 41, 'V');
		for (const wx of [x0 - 3, x0, x0 + 3]) rect(wx, 38, wx, 40, 'K');
		dome(rect, x0, 36, 5, 'W', 'w');
		rect(x0 - 5, 36, x0 + 5, 36, 'V');
		set(x0, 30, 'Y');
	}
	// central dome on a tall drum
	rect(cx - 8, 31, cx + 8, 41, (x) => (x > cx + 4 ? 'w' : 'W'));
	rect(cx - 8, 41, cx + 8, 41, 'V');
	for (let x = cx - 6; x <= cx + 6; x += 3) rect(x, 33, x, 38, 'K');
	dome(rect, cx, 30, 10, 'W', 'w');
	rect(cx - 10, 30, cx + 10, 30, 'V');
	finial(set, cx, 19, 'l');
	return g;
}

// ---- Great Mosque of Sousse: a mosque built like a fortress, no tall minaret ----
function sousse(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(53);
	rect(0, 59, cols - 1, ROWS - 1, () => (r() < 0.25 ? 'a' : 'A'));
	rect(cx - 24, 43, cx + 30, 58, () => (r() < 0.08 ? 'M' : 'L'));
	rect(cx - 24, 42, cx + 30, 42, (x) => ((x - cx) % 3 === 0 ? 'S' : 'L'));
	rect(cx - 24, 45, cx + 30, 46, (x, y) => ((x + y) % 3 === 0 ? 'D' : 'M')); // carved frieze
	const gx = cx + 14;
	rect(gx - 2, 49, gx + 2, 58, 'K');
	rect(gx - 1, 48, gx + 1, 48, 'K');
	for (const x of [cx + 21, cx + 25]) rect(x, 50, x, 53, 'K');
	const bastion = (bx, top, half) => {
		rect(bx - half, top, bx + half, 58, (x) => (x === bx - half ? 'M' : x <= bx - 1 ? 'E' : x >= bx + half - 1 ? 'D' : 'L'));
		rect(bx - half, top - 1, bx + half, top - 1, (x) => ((x - bx) % 2 === 0 ? (x > bx ? 'M' : 'L') : 'S'));
	};
	bastion(cx - 22, 34, 4);
	bastion(cx + 30, 41, 3);
	dome(rect, cx + 4, 41, 3, 'L', 'M', true);
	// the domed corner tower that serves as minaret
	const kx = cx - 8;
	rect(kx - 4, 27, kx + 4, 42, (x) => (x > kx + 2 ? 'M' : 'L'));
	rect(kx - 1, 30, kx + 1, 34, 'K');
	set(kx, 29, 'K');
	rect(kx - 3, 23, kx + 3, 26, (x) => (x > kx + 1 ? 'M' : 'L'));
	dome(rect, kx, 22, 3, 'L', 'M', true);
	finial(set, kx, 18, 's');
	return g;
}

// ---- Hammouda Pacha, Tunis: the octagonal Ottoman minaret ----
function hammouda(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(41);
	medina(rect, cols, r, 54);
	const mx = cx - 4;
	const oct = (half) => (x) => (x < mx - half + 2 ? 'M' : x > mx + half - 2 ? 'D' : 'L');
	// prayer hall with a green-tiled roof
	rect(mx + 5, 46, cx + 24, 59, 'L');
	rect(cx + 23, 46, cx + 24, 59, 'M');
	rect(mx + 5, 44, cx + 24, 44, 'G');
	rect(mx + 5, 45, cx + 24, 45, 'g');
	for (let x = mx + 8; x <= cx + 21; x += 4) rect(x, 50, x + 1, 55, 'K');
	rect(cx - 22, 50, mx - 6, 59, 'M');
	rect(cx - 22, 49, mx - 6, 49, (x) => (x % 2 ? 'M' : 'S'));
	// shaft: three faces of the octagon catch the light differently
	rect(mx - 5, 20, mx + 5, 59, oct(5));
	for (const [y0, y1] of [[24, 34], [41, 51]]) {
		rect(mx - 2, y0, mx + 2, y1, 'M');
		rect(mx - 1, y0 + 2, mx + 1, y1, 'D');
		set(mx, y0 + 1, 'D');
	}
	rect(mx - 5, 37, mx + 5, 38, (x) => (x > mx + 3 ? 'K' : 'D'));
	// balcony
	rect(mx - 7, 17, mx + 7, 17, (x) => ((x - mx) % 2 === 0 ? 'M' : 'S'));
	rect(mx - 7, 18, mx + 7, 19, (x) => (x > mx + 4 ? 'D' : 'L'));
	rect(mx - 6, 20, mx + 6, 20, 'D');
	// lantern and green cap
	rect(mx - 3, 10, mx + 3, 16, (x) => (x < mx - 1 ? 'M' : x > mx + 1 ? 'D' : 'L'));
	rect(mx, 11, mx, 14, 'k');
	for (let i = 0; i < 4; i++) rect(mx - 1 - i, 6 + i, mx + 1 + i, 6 + i, (x) => (x <= mx ? 'G' : 'g'));
	finial(set, mx, 5, 'l');
	return g;
}

// ---- Great Mosque of Testour: Andalusian minaret with a clock that runs backwards ----
function testour(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(61);
	rect(0, 58, cols - 1, ROWS - 1, () => (r() < 0.25 ? 'a' : 'A'));
	const mx = cx - 4;
	rect(mx + 6, 46, cx + 22, 57, 'W');
	rect(cx + 21, 46, cx + 22, 57, 'w');
	rect(mx + 6, 44, cx + 22, 44, 'G');
	rect(mx + 6, 45, cx + 22, 45, 'g');
	for (let x = mx + 9; x <= cx + 19; x += 4) rect(x, 49, x + 1, 53, 'K');
	rect(cx - 22, 50, mx - 6, 57, 'W');
	rect(cx - 22, 49, mx - 6, 49, (x) => (x % 2 ? 'W' : 'S'));
	// square shaft of brick and stone, banded with green tiles
	rect(mx - 5, 24, mx + 5, 57, (x, y) => (x > mx + 3 ? 'M' : y % 3 === 0 && r() < 0.5 ? 'M' : 'L'));
	rect(mx - 4, 38, mx + 4, 42, (x, y) => lattice(x, y, 'L', 'G'));
	rect(mx - 4, 46, mx + 4, 50, (x, y) => lattice(x, y, 'L', 'G'));
	// the clock
	rect(mx - 2, 28, mx + 2, 32, 'W');
	for (const [x, y] of [[mx - 2, 28], [mx + 2, 28], [mx - 2, 32], [mx + 2, 32]]) set(x, y, 'L');
	set(mx, 29, 'K');
	set(mx, 30, 'K');
	set(mx - 1, 30, 'K');
	// balcony
	rect(mx - 7, 21, mx + 7, 21, (x) => ((x - mx) % 2 === 0 ? 'L' : 'S'));
	rect(mx - 7, 22, mx + 7, 23, (x) => (x > mx + 4 ? 'D' : 'L'));
	// octagonal top tier with a green cap
	rect(mx - 3, 12, mx + 3, 12, (x) => ((x - mx) % 2 === 0 ? 'L' : 'S'));
	rect(mx - 3, 13, mx + 3, 20, (x) => (x < mx - 1 ? 'M' : x > mx + 1 ? 'D' : 'L'));
	rect(mx, 15, mx, 18, 'k');
	for (let i = 0; i < 3; i++) rect(mx - 1 - i, 9 + i, mx + 1 + i, 9 + i, (x) => (x <= mx ? 'G' : 'g'));
	finial(set, mx, 8, 'l');
	return g;
}

// ---- Mosque of the Three Doors, Kairouan: a carved façade with three horseshoe arches ----
function threeDoors(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(71);
	rect(0, 58, cols - 1, ROWS - 1, () => (r() < 0.25 ? 'a' : 'A'));
	rect(0, 44, cx - 16, 57, (x, y) => (r() < 0.05 && y > 46 ? 'N' : 'C'));
	rect(cx + 16, 47, cols - 1, 57, (x, y) => (r() < 0.05 && y > 49 ? 'N' : 'C'));
	const f0 = cx - 14, f1 = cx + 14;
	rect(f0, 32, f1, 57, (x) => (x > f1 - 2 ? 'M' : 'L'));
	rect(f0 - 1, 30, f1 + 1, 30, 'M');
	rect(f0 - 1, 31, f1 + 1, 31, 'D');
	// Kufic inscription bands and a floral frieze
	rect(f0 + 1, 34, f1 - 1, 35, (x, y) => ((x * 7 + y * 3) % 5 < 2 ? 'D' : 'M'));
	rect(f0 + 1, 37, f1 - 1, 38, (x, y) => ((x * 5 + y * 2) % 4 === 0 ? 'D' : 'M'));
	rect(f0 + 1, 40, f1 - 1, 41, (x, y) => lattice(x, y, 'L', 'D'));
	for (const dx of [cx - 8, cx, cx + 8]) {
		rect(dx - 3, 44, dx - 3, 57, 'D');
		rect(dx + 3, 44, dx + 3, 57, 'D');
		rect(dx - 1, 43, dx + 1, 43, 'K');
		rect(dx - 2, 44, dx + 2, 57, 'K');
	}
	// the small minaret added later
	const mx = cx - 11;
	rect(mx - 2, 20, mx + 2, 29, (x) => (x > mx ? 'M' : 'L'));
	rect(mx, 22, mx, 25, 'K');
	dome(rect, mx, 19, 2, 'L', 'M');
	finial(set, mx, 16, 's');
	return g;
}

// ---- Malik ibn Anas, Carthage: tall square minaret and a long arcaded white hall ----
function carthage(cols, cx = Math.floor(cols / 2)) {
	const { g, set, rect } = grid(cols);
	const r = rng(83);
	rect(0, 58, cols - 1, ROWS - 1, () => (r() < 0.2 ? 'c' : 'C'));
	rect(0, 57, cols - 1, 57, (x) => (x % 9 < 6 ? 'P' : 'C')); // hedges

	// long low arcade
	rect(cx - 26, 45, cx + 34, 56, 'W');
	rect(cx - 26, 44, cx + 34, 44, 'w');
	for (let x = cx - 24; x <= cx + 32; x += 3) { rect(x, 48, x + 1, 56, 'k'); }
	// taller central hall with big arches and a green roof line
	rect(cx + 2, 39, cx + 26, 56, 'W');
	rect(cx + 25, 39, cx + 26, 56, 'w');
	rect(cx + 2, 38, cx + 26, 38, 'G');
	for (let x = cx + 4; x <= cx + 23; x += 4) { rect(x, 43, x + 2, 56, 'k'); set(x + 1, 42, 'k'); }
	// small domes
	dome(rect, cx + 22, 37, 4, 'W', 'w');
	dome(rect, cx + 32, 43, 3, 'W', 'w');

	// minaret: square shaft, carved lattice panel, arched windows, balcony, lantern, green cap
	const mx = cx - 9;
	rect(mx - 4, 15, mx + 4, 56, (x) => (x > mx + 2 ? 'w' : 'W'));
	rect(mx - 3, 24, mx + 3, 50, (x, y) => lattice(x, y, x > mx + 1 ? 'V' : 'w', x > mx + 1 ? 'w' : 'W'));
	for (const x of [mx - 2, mx, mx + 2]) rect(x, 18, x, 21, 'k');
	rect(mx - 5, 13, mx + 5, 14, (x) => (x > mx + 2 ? 'w' : 'W'));
	rect(mx - 5, 12, mx + 5, 12, (x) => ((x - mx) % 2 === 0 ? 'W' : 'S'));
	rect(mx - 2, 7, mx + 2, 11, (x) => (x > mx ? 'w' : 'W'));
	rect(mx, 8, mx, 10, 'k');
	for (let i = 0; i < 4; i++) rect(mx - i, 3 + i, mx + i, 3 + i, (x) => (x <= mx ? 'G' : 'g'));
	finial(set, mx, 2, 's');
	return g;
}

// rooftops of a medina along the bottom
function medina(rect, cols, r, minTop) {
	for (let x = 0; x < cols; ) {
		const w = 3 + Math.floor(r() * 5);
		const top = minTop + Math.floor(r() * 5);
		rect(x, top, x + w - 1, ROWS - 1, (xx, yy) => (xx === x + w - 1 ? 'c' : r() < 0.05 && yy > top + 1 ? 'N' : 'C'));
		x += w;
	}
}

// ---- a generic Tunisian neighbourhood mosque, for mosques we have no drawing of ----
// Not a portrait: the hall's width follows the real footprint (bigger building = wider hall),
// and the rest (whitewash or stone, dome or not, minaret side, door and windows) is picked
// from `seed`, so each mosque always gets the same drawing.
export function genericMosque({ area = 300, seed = 1 } = {}) {
	return {
		id: 'generic',
		draw(cols, cx = Math.floor(cols / 2)) {
			const { g, set, rect } = grid(cols);
			const r = rng(seed * 7919 + 13);
			const stone = r() < 0.3;
			const lit = stone ? 'L' : 'W', shd = stone ? 'M' : 'w';
			rect(0, 58, cols - 1, ROWS - 1, () => (r() < 0.25 ? 'a' : 'A'));

			// prayer hall: width from the footprint (≈ √area), within what fits in the frame
			// (√area grows slowly, so a 10,000 m² compound is about twice as wide as a 300 m² masjid)
			const half = Math.round(Math.max(8, Math.min(cols / 2 - 9, 18, 4 + Math.sqrt(area) / 6)));
			const hallH = Math.round(Math.max(9, Math.min(16, 7 + Math.sqrt(area) / 9)));
			const side = r() < 0.5 ? -1 : 1; // minaret on the left or the right
			const hx = cx - side * 3; // hall centre, nudged away from the minaret
			const top = 57 - hallH;
			rect(hx - half, top, hx + half, 57, (x) => (x >= hx + half - 1 ? shd : lit));
			rect(hx - half, top, hx + half, top, (x) => ((x - hx) % 2 === 0 ? lit : 'S')); // crenellation
			rect(hx - half, 57, hx + half, 57, shd);
			// arched door and a row of windows
			rect(hx - 1, 50, hx + 1, 57, 'K');
			set(hx, 49, 'K');
			const winT = r() < 0.5 ? 'k' : 'B';
			for (let x = hx - half + 3; x <= hx + half - 3; x += 4) if (Math.abs(x - hx) > 3) rect(x, top + 3, x, top + 5, winT);
			// a dome on bigger halls, or by chance
			if (area > 500 || r() < 0.5) {
				const dr = Math.max(3, Math.min(8, Math.round(half / 2.6)));
				dome(rect, hx + side * Math.round(half / 3), top - 1, dr, lit, shd, stone && r() < 0.5);
				finial(set, hx + side * Math.round(half / 3), top - dr - 2, 's');
			}
			// square Maghrebi minaret, taller for bigger mosques
			const mx = hx - side * (half - 2);
			const mh = Math.round(Math.max(22, Math.min(44, hallH + 16 + Math.sqrt(area) / 6)));
			const mt = 57 - mh;
			const mw = mh > 34 ? 4 : 3;
			rect(mx - mw, mt, mx + mw, 57, (x) => (x >= mx + mw - 1 ? shd : lit));
			const panelT = r() < 0.5 ? 'G' : 'k';
			rect(mx - mw + 1, mt + 6, mx + mw - 1, mt + 10, (x, y) => lattice(x, y, lit, panelT));
			for (let y = mt + 14; y < 54; y += 7) rect(mx, y, mx, y + 2, 'K');
			rect(mx - mw - 1, mt - 1, mx + mw + 1, mt - 1, (x) => ((x - mx) % 2 === 0 ? lit : 'S')); // balcony
			rect(mx - 2, mt - 6, mx + 2, mt - 2, (x) => (x > mx ? shd : lit)); // lantern
			set(mx, mt - 4, 'k');
			for (let i = 0; i < 3; i++) rect(mx - 1 - i + 1, mt - 9 + i, mx + 1 + i - 1, mt - 9 + i, (x) => (x <= mx ? 'G' : 'g'));
			finial(set, mx, mt - 10, 's');
			return g;
		}
	};
}

export const MOSQUES = [
	{ id: 'zitouna', name: 'Al-Zaytuna Mosque', ar: 'جامع الزيتونة', place: 'Tunis', note: 'Founded c. 698 · minaret rebuilt 1894', draw: zitouna },
	{ id: 'kairouan', name: 'Great Mosque of Kairouan', ar: 'جامع عقبة بن نافع', place: 'Kairouan', note: 'Founded 670 · the oldest in the Maghreb', draw: kairouan },
	{ id: 'djerba', name: 'Fadhloun Mosque', ar: 'جامع فضلون', place: 'Djerba', note: 'Whitewashed Ibadi mosque · 14th–17th c.', draw: djerba },
	{ id: 'sidimahrez', name: 'Sidi Mahrez Mosque', ar: 'جامع سيدي محرز', place: 'Tunis', note: 'Built 1692–1699 · Ottoman domes over the medina', draw: sidiMahrez },
	{ id: 'sousse', name: 'Great Mosque of Sousse', ar: 'الجامع الكبير بسوسة', place: 'Sousse', note: 'Built 850–851 · a mosque walled like a fortress', draw: sousse },
	{ id: 'hammouda', name: 'Hammouda Pacha Mosque', ar: 'جامع حمودة باشا', place: 'Tunis', note: 'Built 1655 · an octagonal Ottoman minaret', draw: hammouda },
	{ id: 'testour', name: 'Great Mosque of Testour', ar: 'الجامع الكبير بتستور', place: 'Testour', note: 'Built c. 1630 by Andalusian refugees · its clock runs backwards', draw: testour },
	{ id: 'threedoors', name: 'Mosque of the Three Doors', ar: 'جامع الأبواب الثلاثة', place: 'Kairouan', note: 'Founded 866 · a carved Kufic façade', draw: threeDoors },
	{ id: 'carthage', name: 'Malik ibn Anas Mosque', ar: 'جامع مالك بن أنس', place: 'Carthage', note: 'Opened 2003 · on the hill of Carthage', draw: carthage }
];

// fixed pseudo-random number per tile, so the same tile gets the same shade in every picture
// (then only the tiles that really change have to flip)
function hash(i, k) {
	let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(k + 1, 0xc2b2ae35);
	h ^= h >>> 13;
	h = Math.imul(h, 0x27d4eb2f);
	h ^= h >>> 16;
	return (h >>> 0) / 4294967296;
}
const WALL_ALL = WALL_HEX.map(rgb);
// the page wall: a fixed colour for every (column, row), so redrawing it never reshuffles the tiles
export function wallAt(c, r) {
	return skyAt(r * 4099 + c);
}

function skyAt(i) {
	const p = hash(i, 1);
	if (p < 0.008) return ACCENT[0];
	if (p < 0.012) return ACCENT[1];
	const c = WALL_ALL[(hash(i, 2) * WALL_ALL.length) | 0];
	const j = 1 + (hash(i, 3) - 0.5) * 0.08;
	return c.map((v) => Math.round(v * j));
}

// Colour function for the Mosaic: (c, r) -> [r, g, b].
//   cx      column the building is centred on
//   offset  rows of sky above the drawing
//   title   array (cols * rows) of fixed title tile colours, or null
export function composeScene({ mosque, cols, rows, cx, offset = 0, title = null }) {
	const tokens = mosque.draw(cols, cx);
	const out = new Array(cols * rows);
	for (let r = 0; r < rows; r++) {
		const ar = r - offset;
		for (let c = 0; c < cols; c++) {
			const i = r * cols + c;
			if (ar >= ROWS) {
				// the band: dark line, three rows of blocks laid out from the middle, dark line
				const d = ar - ROWS;
				const k = Math.floor((Math.abs(c - (cols - 1) / 2) + 1.5) / 3);
				const base = d === 0 || d === BAND - 1 ? BAND_INK : k % 2 === 0 ? BAND_CHALK : BAND_INK;
				const j = 1 + (hash(i, 7) - 0.5) * (base === BAND_INK ? 0.3 : 0.06); // dark tiles vary more, like glazed stone
				out[i] = base.map((v) => Math.round(v * j));
				continue;
			}
			const t = ar >= 0 ? tokens[ar][c] : 'S';
			if (title && title[i]) { out[i] = title[i]; continue; }
			if (t === 'S') { out[i] = skyAt(i); continue; }
			const j = 1 + (hash(i, t.charCodeAt(0)) - 0.5) * 0.1;
			out[i] = rgb(PALETTE[t] || '#ff00ff').map((v) => Math.min(255, Math.round(v * j)));
		}
	}
	return (c, r) => out[r * cols + c];
}
