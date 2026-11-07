// Mind mode: the site doesn't know the card, so each deal's new order is computed
// from the visitor's answer ("which pile is your card in?"), with the exact same
// gathering rule as pick mode (cards.svelte -> assignCycleInverted):
//   - pile = (reference % 3) -> 1, 2, 3   (matches the round-robin deal on screen)
//   - each pile is gathered in reverse order of the reference
//   - the answered pile goes in the middle (positions 9-17)
//   - of the other two, the lower-numbered pile goes on top (0-8), the other at the bottom (18-26)
// After the third answer the visitor's card is always at position 13 (the 14th card).
import { get } from 'svelte/store';
import { arrayCards, cycle1array, cycle2array, cycle3array, lockedCard, statuscard } from './misc.js';
import { savePick } from './db.js';

function assignCycle(arr, referenceKey, pileKey, posKey, middlePile) {
	for (const c of arr) {
		const mod = ((c[referenceKey] % 3) + 3) % 3;
		c[pileKey] = mod === 0 ? 1 : mod === 1 ? 2 : 3;
	}
	const piles = { 1: [], 2: [], 3: [] };
	for (const c of arr) piles[c[pileKey]].push(c);
	for (const p of [1, 2, 3]) piles[p].sort((a, b) => b[referenceKey] - a[referenceKey]);

	const others = [1, 2, 3].filter((p) => p !== middlePile);
	const low = Math.min(...others);
	const high = Math.max(...others);
	piles[low].forEach((card, i) => (card[posKey] = i));
	piles[middlePile].forEach((card, i) => (card[posKey] = 9 + i));
	piles[high].forEach((card, i) => (card[posKey] = 18 + i));
}

const key = (c) => `${c.value}_${c.suit}`;
const CYCLE_FIELDS = ['cycle1pile', 'cycle1pos', 'cycle2pile', 'cycle2pos', 'cycle3pile', 'cycle3pos'];

/**
 * Record the visitor's answer for one deal and compute the next order.
 * @param {1|2|3} cycle
 * @param {1|2|3} pile - the pile they said their card is in
 * @param {{ mode?: 'mind'|'pick', changedMind?: number|null }} [opts] - what to save (phone pick mode uses 'pick')
 * @returns the visitor's card after cycle 3 (null before that)
 */
export function answerPile(cycle, pile, { mode = 'mind', changedMind = null } = {}) {
	if (cycle === 1) {
		const arr = get(arrayCards).map((c) => ({ ...c }));
		assignCycle(arr, 'index', 'cycle1pile', 'cycle1pos', pile);
		cycle1array.set(arr.slice().sort((a, b) => a.cycle1pos - b.cycle1pos));
		return null;
	}
	if (cycle === 2) {
		const arr = get(cycle1array).map((c) => ({ ...c, dealt2: false }));
		assignCycle(arr, 'cycle1pos', 'cycle2pile', 'cycle2pos', pile);
		cycle2array.set(arr.slice().sort((a, b) => a.cycle2pos - b.cycle2pos));
		return null;
	}

	// cycle 3: compute the final order, then we know the card (position 13)
	const arr = get(cycle2array).map((c) => ({ ...c }));
	assignCycle(arr, 'cycle2pos', 'cycle3pile', 'cycle3pos', pile);
	const card = arr.find((c) => c.cycle3pos === 13);

	// Every array gets the full data (all cycles + which card is selected), like in
	// pick mode, so the math slides can explain this exact play afterwards.
	const full = new Map(arr.map((c) => [key(c), c]));
	const merge = (list) =>
		(list || []).map((c) => {
			const f = full.get(key(c));
			const extra = Object.fromEntries(CYCLE_FIELDS.map((k) => [k, f[k]]));
			return { ...c, ...extra, selected: key(c) === key(card) };
		});

	cycle3array.set(merge(arr).sort((a, b) => a.cycle3pos - b.cycle3pos));
	cycle2array.set(merge(get(cycle2array)));
	cycle1array.set(merge(get(cycle1array)));
	arrayCards.set(merge(get(arrayCards)));
	lockedCard.set({ ...card, selected: true });
	statuscard.set(true);
	savePick({ ...card, ...Object.fromEntries(CYCLE_FIELDS.map((k) => [k, card[k]])) }, changedMind, mode);
	return card;
}
