<script>
	// A box whose background is laid in mosaic tiles, with an optional frame.
	//   frame 'ablaq'  alternating black and white blocks between two dark lines,
	//                  like the voussoirs around a Sidi Bou Said door
	//   frame 'thin'   a single tile border
	// The box height snaps to whole tiles so the frame always closes cleanly at the bottom.
	import { onMount, onDestroy } from 'svelte';
	import { Mosaic, rgb } from '../mosaic.js';

	export let variant = 'light'; // light | dark | navy
	export let frame = 'ablaq'; // ablaq | thin | none
	export let tile = 8;
	export let pad = 28; // space between the frame and the content, px

	const FRAME = { ablaq: 5, thin: 1, none: 0 };
	const FILL = { light: rgb('#f6f1e7'), dark: rgb('#121215'), navy: rgb('#0f1e44') };
	const THIN = { light: rgb('#c9bfa9'), dark: rgb('#3b3b42'), navy: rgb('#cdb88f') };
	const INK = rgb('#17171a');
	const CHALK = rgb('#f4f1ea');

	let outer, inner, canvas;
	let boxH = 0;
	/** @type {Mosaic | null} */ let mosaic = null;
	let ro, timer;

	$: F = FRAME[frame] ?? 0;

	const jit = (i, base, amt = 0.06) => {
		let h = Math.imul(i ^ 0x2545f491, 0x9e3779b1);
		h ^= h >>> 13;
		const j = 1 + (((h >>> 0) % 1000) / 1000 - 0.5) * amt;
		return base.map((v) => Math.min(255, Math.round(v * j)));
	};

	function colorAt(c, r, cols, rows) {
		const i = r * cols + c;
		const d = Math.min(c, r, cols - 1 - c, rows - 1 - r);
		if (frame === 'ablaq' && d < 5) {
			if (d === 0 || d === 4) return jit(i, INK);
			const dc = Math.min(c, cols - 1 - c), dr = Math.min(r, rows - 1 - r);
			// corners: a square block (white 3x3 inside the dark lines)
			if (dc < 5 && dr < 5) return jit(i, dc >= 1 && dc <= 3 && dr >= 1 && dr <= 3 ? CHALK : INK);
			// sides: blocks of 3 laid out from the middle of each side, so both ends match
			const horiz = dr < 5;
			const along = horiz ? c : r;
			const mid = ((horiz ? cols : rows) - 1) / 2;
			const k = Math.floor((Math.abs(along - mid) + 1.5) / 3);
			return jit(i, k % 2 === 0 ? CHALK : INK);
		}
		if (frame === 'thin' && d === 0) return jit(i, THIN[variant]);
		return jit(i, FILL[variant], 0.05);
	}

	function layout() {
		if (!mosaic || !outer || !inner) return;
		const w = outer.clientWidth;
		if (!w) return;
		const cols = Math.max(4, Math.round(w / tile));
		const t = w / cols;
		const rows = Math.ceil(inner.offsetHeight / t);
		boxH = rows * t;
		if (cols !== mosaic.cols || rows !== mosaic.rows || Math.abs(t - mosaic.tile) > 0.01) {
			// content got taller or shorter: keep the tiles already laid, redo only the frame near the old edges
			mosaic.resizeKeep(cols, rows, t, (c, r) => colorAt(c, r, cols, rows), FRAME[frame] || 1);
		}
	}

	// a click on the box (not on a link, not while selecting text) turns the tile under it to another colour
	function poke(e) {
		if (e.__mosaic || !mosaic) return;
		if (e.target.closest && e.target.closest('a, button')) return;
		const sel = window.getSelection && window.getSelection();
		if (sel && String(sel).length) return;
		if (mosaic.pokeAt(e.clientX, e.clientY) >= 0) e.__mosaic = true;
	}

	onMount(() => {
		mosaic = new Mosaic(canvas, { grout: variant === 'light' ? '#d9d1c1' : '#050507', gapRatio: 0.1 });
		ro = new ResizeObserver(layout);
		ro.observe(inner);
		ro.observe(outer);
		layout();
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			timer = setInterval(() => { if (mosaic) { mosaic.idleFlip(); mosaic.kick(); } }, 500 + Math.random() * 600);
		}
	});
	onDestroy(() => { if (ro) ro.disconnect(); clearInterval(timer); if (mosaic) mosaic.destroy(); });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box {variant}" bind:this={outer} style="min-height:{boxH}px" on:click={poke}>
	<canvas bind:this={canvas} aria-hidden="true" />
	<div class="inner" bind:this={inner} style="padding:{F * tile + pad}px">
		<slot />
	</div>
</div>

<style>
	.box { position: relative; overflow: clip; cursor: pointer; } /* clip, not hidden: keeps position: sticky working inside */
	canvas { position: absolute; top: 0; left: 0; display: block; }
	.inner { position: relative; }
	.light { color: #13213f; }
	.dark, .navy { color: #ece6da; }
</style>
