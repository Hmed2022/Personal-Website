// Short sound effects through Web Audio: each file is downloaded and decoded once,
// then every play is instant (no per-play fetch or <audio> start-up delay).
const buffers = new Map();   // url -> Promise<AudioBuffer|null>
let ctx = null;

function context() {
	if (!ctx && typeof window !== 'undefined') {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (AC) {
			ctx = new AC();
			armUnlock();
		}
	}
	return ctx;
}

// iOS keeps Web Audio muted until it is resumed *inside* a user gesture. Sounds here
// often start from timers (dealing, counting), so resume on the first taps/clicks
// and play a silent buffer, which is what actually unlocks iOS Safari.
function armUnlock() {
	const events = ['touchend', 'pointerdown', 'keydown', 'click'];
	const unlock = () => {
		if (!ctx) return;
		ctx.resume().catch(() => {});
		try {
			const src = ctx.createBufferSource();
			src.buffer = ctx.createBuffer(1, 1, 22050);
			src.connect(ctx.destination);
			src.start(0);
		} catch {}
		if (ctx.state === 'running') events.forEach((e) => window.removeEventListener(e, unlock, true));
	};
	events.forEach((e) => window.addEventListener(e, unlock, true));
}

function load(url) {
	if (!buffers.has(url)) {
		const c = context();
		buffers.set(url, c
			? fetch(url).then((r) => r.arrayBuffer()).then((b) => c.decodeAudioData(b)).catch(() => null)
			: Promise.resolve(null));
	}
	return buffers.get(url);
}

/** Start downloading/decoding ahead of time (call on mount). */
export function preloadSound(url) {
	load(url);
}

/** Play a sound; silently does nothing if audio isn't available yet or is blocked. */
export async function playSound(url, { rate = 1, volume = 1 } = {}) {
	const c = context();
	if (!c) return;
	if (c.state === 'suspended') c.resume().catch(() => {});   // browsers start it suspended until a click
	const buf = await load(url);
	if (!buf) return;
	const src = c.createBufferSource();
	src.buffer = buf;
	src.playbackRate.value = rate;
	const gain = c.createGain();
	gain.gain.value = volume;
	src.connect(gain).connect(c.destination);
	src.start();
}

export const FLIP_SOUND = '/assets/CardMagic/flipcard.m4a';   // 10 KB AAC (was an 81 KB WAV)
