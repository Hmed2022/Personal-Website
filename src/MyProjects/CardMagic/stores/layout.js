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
