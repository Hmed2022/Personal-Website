import { writable, get } from 'svelte/store';

// Scale applied to the whole stage on short screens (see `compact` in Demo.Slider).
export const stageScale = writable(1);

/**
 * getBoundingClientRect() in stage (unscaled) pixels.
 * On phones the stage is shrunk with a CSS transform, so on-screen rects are
 * smaller than the layout they get drawn into; dividing by the scale fixes
 * braces/arrows/labels that are positioned from these measurements.
 */
export function rect(el) {
	const r = el.getBoundingClientRect();
	const s = get(stageScale) || 1;
	return {
		left: r.left / s,
		right: r.right / s,
		top: r.top / s,
		bottom: r.bottom / s,
		width: r.width / s,
		height: r.height / s
	};
}

// Phones/tablets (no hover, coarse pointer). Used to skip things that work badly
// there: rapid-fire deal sounds lag on iOS, and the two-copy crossfade of a dealt
// card leaves a visible ghost.
export const isTouchDevice =
	typeof window !== 'undefined' && !!window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
