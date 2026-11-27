// Tunisia as a tile grid, for the "How many mosques" section.
// Data/tnCount.json (built by Data/build_tnmosq_data.py) holds the governorate outlines and every mosque.
// buildGrid() lays the country on a grid of square tiles: each tile knows its governorate (or sea)
// and whether it sits on a border; cellOf() puts a mosque on its tile.
import data from './Data/tnCount.json';

export const GOVS = data.govs; // [{ name, polys, count }]
export const PTS = data.pts; // [[lon, lat, governorate index]]
export const SUMMARY = data.summary || {};

// equirectangular, corrected for latitude so the country keeps its shape
const LAT0 = 33.8;
const K = Math.cos((LAT0 * Math.PI) / 180);
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const g of GOVS)
	for (const poly of g.polys)
		for (const [x, y] of poly[0]) {
			if (x < minLon) minLon = x;
			if (x > maxLon) maxLon = x;
			if (y < minLat) minLat = y;
			if (y > maxLat) maxLat = y;
		}

// rows: tiles from north to south (including a one-tile margin of sea on each side)
export function buildGrid(rows) {
	const M = 1;
	const unit = (maxLat - minLat) / (rows - 2 * M); // degrees of latitude per tile
	const cols = Math.ceil(((maxLon - minLon) * K) / unit) + 2 * M;
	const px = (lon) => ((lon - minLon) * K) / unit + M;
	const py = (lat) => (maxLat - lat) / unit + M;

	// paint each governorate in its own colour on a hidden canvas, 4 pixels per tile,
	// then each tile takes the governorate that covers most of it
	const S = 4;
	const cv = document.createElement('canvas');
	cv.width = cols * S;
	cv.height = rows * S;
	const ctx = cv.getContext('2d', { willReadFrequently: true });
	GOVS.forEach((g, gi) => {
		ctx.fillStyle = `rgb(${gi + 1},0,0)`;
		ctx.beginPath();
		for (const poly of g.polys)
			for (const ring of poly)
				ring.forEach(([x, y], k) => (k ? ctx.lineTo(px(x) * S, py(y) * S) : ctx.moveTo(px(x) * S, py(y) * S)));
		ctx.fill('evenodd');
	});
	const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
	const gov = new Int8Array(cols * rows).fill(-1);
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const votes = new Map();
			let land = 0;
			for (let y = 0; y < S; y++)
				for (let x = 0; x < S; x++) {
					const o = ((r * S + y) * cv.width + c * S + x) * 4;
					if (img[o + 3] < 200 || img[o] === 0) continue;
					land++;
					votes.set(img[o], (votes.get(img[o]) || 0) + 1);
				}
			if (land < (S * S) / 2) continue;
			let best = 0, bv = 0;
			for (const [v, n] of votes) if (n > bv) { bv = n; best = v; }
			if (best >= 1 && best <= GOVS.length) gov[r * cols + c] = best - 1;
		}

	// border tiles: land next to a different governorate
	const border = new Uint8Array(cols * rows);
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			const g = gov[r * cols + c];
			if (g < 0) continue;
			for (const [dx, dy] of [[1, 0], [0, 1]]) {
				const x = c + dx, y = r + dy;
				if (x >= cols || y >= rows) continue;
				const h = gov[y * cols + x];
				if (h >= 0 && h !== g) border[r * cols + c] = 1;
			}
		}

	const cellOf = (lon, lat) => {
		const c = Math.min(cols - 1, Math.max(0, Math.floor(px(lon))));
		const r = Math.min(rows - 1, Math.max(0, Math.floor(py(lat))));
		return r * cols + c;
	};

	// where to pin each governorate's label: the middle of its tiles
	const centre = GOVS.map(() => ({ c: 0, r: 0, n: 0 }));
	for (let i = 0; i < gov.length; i++) {
		const g = gov[i];
		if (g < 0) continue;
		centre[g].c += i % cols;
		centre[g].r += (i / cols) | 0;
		centre[g].n++;
	}
	const anchors = centre.map((o) => (o.n ? { c: o.c / o.n + 0.5, r: o.r / o.n + 0.5 } : null));

	// the centre of tile i, as [lon, lat]
	const centreOf = (i) => [minLon + ((i % cols) + 0.5 - M) * (unit / K), maxLat - (Math.floor(i / cols) + 0.5 - M) * unit];

	return { cols, rows, gov, border, cellOf, centreOf, anchors, km: unit * 111 };
}
