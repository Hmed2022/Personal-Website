// Short sound effects through Web Audio: each file is downloaded and decoded once,
// then every play is instant (no per-play fetch or <audio> start-up delay).
const buffers = new Map();   // url -> Promise<AudioBuffer|null>
let ctx = null;

function context() {
	if (!ctx && typeof window !== 'undefined') {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (AC) ctx = new AC();
	}
	return ctx;
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
