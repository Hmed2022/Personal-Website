// The floating buttons ("Illustrations | Real notes", "Back to the binder") slide away while you
// scroll down to read, and come back as soon as you scroll up (or reach the very top / bottom).
import { readable } from 'svelte/store';
export const floatHidden = readable(false, (set) => {
	if (typeof window === 'undefined') return;
	let last = window.scrollY, ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			const y = window.scrollY, d = y - last;
			const atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
			if (y < 80 || atEnd || d < -6) set(false);
			else if (d > 6) set(true);
			if (Math.abs(d) > 6) last = y;
			ticking = false;
		});
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	return () => window.removeEventListener('scroll', onScroll);
});
