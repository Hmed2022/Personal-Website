// Canvas mosaic: a grid of square tiles with grout lines. Each tile can "flip" (a card turning on
// its vertical or horizontal axis) from one colour to another. Only tiles that are moving get redrawn.

const hexToRgb = (hex) => {
	const h = hex.replace('#', '');
	return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const rgbCache = new Map();
export const rgb = (hex) => {
	let v = rgbCache.get(hex);
	if (!v) { v = hexToRgb(hex); rgbCache.set(hex, v); }
	return v;
};

// small seeded RNG so a picture always gets the same tile texture
export function rng(seed = 1) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// colours a clicked tile can turn into (the page's palette: wall blues, beige, cream, white, black, sign green, gold)
export const PICK_PALETTE = ['#14306a', '#1d4790', '#2b5fae', '#5d93d8', '#ecd9b4', '#f6f1e7', '#f4f1ea', '#17171a', '#2f5e4e', '#e0ad48'].map(rgb);

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
const css = (c, k = 1) => `rgb(${clamp(c[0] * k)},${clamp(c[1] * k)},${clamp(c[2] * k)})`;

export class Mosaic {
	// transparent: tiles with no colour (null) are left empty, and grout shows only behind real tiles
	constructor(canvas, { grout = '#0d1b3d', gapRatio = 0.1, bevel = true, transparent = false } = {}) {
		this.transparent = transparent;
		this._raf = 0;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.grout = grout;
		this.gapRatio = gapRatio;
		this.bevel = bevel;
		this.cols = 0;
		this.rows = 0;
		this.tile = 10;
		this.anims = new Map(); // index -> {from, to, start, dur, axis}
	}

	resize(cols, rows, tile) {
		// sharper on retina, but a very tall canvas (the page-long wall) stays within what browsers handle well
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		const MAX_SIDE = 8192, MAX_AREA = 16e6;
		dpr = Math.max(0.5, Math.min(dpr, MAX_SIDE / (cols * tile), MAX_SIDE / (rows * tile), Math.sqrt(MAX_AREA / (cols * tile * rows * tile))));
		this.cols = cols;
		this.rows = rows;
		this.tile = tile;
		this.canvas.width = Math.round(cols * tile * dpr);
		this.canvas.height = Math.round(rows * tile * dpr);
		this.canvas.style.width = cols * tile + 'px';
		this.canvas.style.height = rows * tile + 'px';
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.colors = new Array(cols * rows).fill(null);
		this.anims.clear();
	}

	// Change the grid size but keep every existing tile's colour (including ones a visitor clicked or
	// that flipped on their own); only new tiles, and tiles within `redo` of any edge (where frames are), take colorFn.
	// Used when a page or box only grows or shrinks, so the mosaic doesn't visibly change under the reader.
	resizeKeep(cols, rows, tile, colorFn, redo = 0) {
		const old = this.colors, oc = this.cols, or = this.rows, ot = this.tile;
		const pending = new Map();
		for (const [i, a] of this.anims) pending.set(i, a.to);
		this.resize(cols, rows, tile);
		const same = old && oc && ot === tile;
		for (let r = 0; r < rows; r++)
			for (let c = 0; c < cols; c++) {
				// keep only tiles away from every edge (old and new): frames along the edges are redone
				const keep = same && c >= redo && r >= redo && c < oc - redo && r < or - redo && c < cols - redo && r < rows - redo;
				const i = r * cols + c, oi = r * oc + c;
				this.colors[i] = keep ? pending.get(oi) || old[oi] || colorFn(c, r) : colorFn(c, r);
			}
		this.drawAll();
	}

	// colourFn(c, r) -> [r,g,b]; draws instantly
	paint(colorFn) {
		this.anims.clear();
		for (let r = 0; r < this.rows; r++)
			for (let c = 0; c < this.cols; c++) this.colors[r * this.cols + c] = colorFn(c, r);
		this.drawAll();
	}

	drawAll() {
		const { ctx } = this;
		if (this.transparent) {
			ctx.clearRect(0, 0, this.cols * this.tile, this.rows * this.tile);
			for (let i = 0; i < this.colors.length; i++) if (this.colors[i]) this.drawTile(i, this.colors[i], 1, 0, 0, true);
			return;
		}
		ctx.fillStyle = this.grout;
		ctx.fillRect(0, 0, this.cols * this.tile, this.rows * this.tile);
		for (let i = 0; i < this.colors.length; i++) this.drawTile(i, this.colors[i], 1, 0, 0);
	}

	// scale: 0..1 width of the turning card, shade: 0..1 darkening, axis 0 = vertical hinge, 1 = horizontal
	drawTile(i, color, scale, shade, axis, clear = false) {
		if (!color) return;
		const { ctx, tile } = this;
		const c = i % this.cols;
		const r = (i / this.cols) | 0;
		const x = c * tile;
		const y = r * tile;
		// grout: thinner on very small tiles (a full pixel would cover a third of a 3px tile and grey it out)
		const g = Math.max(tile < 6 ? 0.5 : 1, tile * this.gapRatio);
		if (clear) {
			ctx.fillStyle = this.grout;
			ctx.fillRect(x, y, tile, tile);
		}
		const s = tile - g;
		let w = s, h = s;
		if (axis === 0) w = s * scale; else h = s * scale;
		const ox = x + g / 2 + (s - w) / 2;
		const oy = y + g / 2 + (s - h) / 2;
		const k = 1 - shade * 0.45;
		ctx.fillStyle = css(color, k);
		ctx.fillRect(ox, oy, w, h);
		if (this.bevel && tile >= 6 && scale > 0.6) {
			// a sliver of light on the top-left edge, shadow bottom-right: reads as a glazed tile
			const b = Math.max(1, tile * 0.09);
			ctx.fillStyle = css(color, 1.14 * k);
			ctx.fillRect(ox, oy, w, b);
			ctx.fillRect(ox, oy, b, h);
			ctx.fillStyle = css(color, 0.84 * k);
			ctx.fillRect(ox, oy + h - b, w, b);
			ctx.fillRect(ox + w - b, oy, b, h);
		}
	}

	clearTile(i) {
		const c = i % this.cols, r = (i / this.cols) | 0;
		if (this.transparent) this.ctx.clearRect(c * this.tile, r * this.tile, this.tile, this.tile);
		else { this.ctx.fillStyle = this.grout; this.ctx.fillRect(c * this.tile, r * this.tile, this.tile, this.tile); }
	}

	// schedule a flip of tile i to colour `to`
	flip(i, to, start, dur = 650, axis = Math.random() < 0.5 ? 0 : 1) {
		const cur = this.anims.get(i);
		const from = cur ? cur.to : this.colors[i];
		this.anims.set(i, { from, to, start, dur, axis });
	}

	// flip every tile to a new picture; delayFn(c, r) gives each tile's delay in ms
	// only tiles whose colour actually changes are turned over; returns how many
	flipTo(colorFn, delayFn, now, dur = 650) {
		let n = 0;
		for (let r = 0; r < this.rows; r++)
			for (let c = 0; c < this.cols; c++) {
				const i = r * this.cols + c;
				const to = colorFn(c, r);
				const a = this.anims.get(i);
				const cur = a ? a.to : this.colors[i];
				if (!cur && !to) continue;
				if (cur && to && cur[0] === to[0] && cur[1] === to[1] && cur[2] === to[2]) continue;
				if (!cur || !to) { // appearing / disappearing tile: no flip, just swap
					this.anims.delete(i);
					this.colors[i] = to;
					this.clearTile(i);
					if (to) this.drawTile(i, to, 1, 0, 0, true);
					continue;
				}
				this.flip(i, to, now + delayFn(c, r), dur);
				n++;
			}
		return n;
	}

	get busy() { return this.anims.size > 0; }

	// for mosaics without their own animation loop: run frames until every flip has finished
	kick() {
		if (this._raf) return;
		const step = (now) => {
			try { this.frame(now); } catch (e) { this.anims.clear(); console.error(e); }
			this._raf = this.busy ? requestAnimationFrame(step) : 0;
		};
		this._raf = requestAnimationFrame(step);
	}

	destroy() {
		cancelAnimationFrame(this._raf);
		this._raf = 0;
	}

	// index of the tile under a click (client coordinates), or -1
	tileAt(clientX, clientY) {
		const box = this.canvas.getBoundingClientRect();
		const x = clientX - box.left, y = clientY - box.top;
		if (x < 0 || y < 0 || x >= box.width || y >= box.height) return -1;
		const c = Math.floor((x / box.width) * this.cols);
		const r = Math.floor((y / box.height) * this.rows);
		return r * this.cols + c;
	}

	// flip the clicked tile to a different colour from the palette; returns its index, or -1 if nothing was hit
	pokeAt(clientX, clientY, palette = PICK_PALETTE) {
		const i = this.tileAt(clientX, clientY);
		if (i < 0 || !this.colors || !this.colors[i]) return -1;
		const a = this.anims.get(i);
		const cur = a ? a.to : this.colors[i];
		const dist = (p) => Math.abs(p[0] - cur[0]) + Math.abs(p[1] - cur[1]) + Math.abs(p[2] - cur[2]);
		const choices = palette.filter((p) => dist(p) > 40);
		const pick = choices[(Math.random() * choices.length) | 0] || palette[0];
		this.flip(i, pick, performance.now(), 520);
		this.kick();
		return i;
	}

	// turn one random (non-empty) tile over to its own colour: the idle "now and then" movement
	idleFlip(now = performance.now()) {
		if (!this.colors || !this.colors.length) return;
		const i = (Math.random() * this.colors.length) | 0;
		if (this.colors[i] && !this.anims.has(i)) this.flip(i, this.colors[i], now, 700);
	}

	// advance animations; call from requestAnimationFrame
	frame(now) {
		if (!this.anims.size) return false;
		for (const [i, a] of this.anims) {
			const t = (now - a.start) / a.dur;
			if (t < 0) continue;
			if (t >= 1) {
				this.colors[i] = a.to;
				this.drawTile(i, a.to, 1, 0, a.axis, true);
				this.anims.delete(i);
				continue;
			}
			const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
			const theta = e * Math.PI;
			const scale = Math.abs(Math.cos(theta));
			const col = theta < Math.PI / 2 ? a.from : a.to;
			this.drawTile(i, col, Math.max(scale, 0.04), Math.sin(theta), a.axis, true);
		}
		return true;
	}
}
