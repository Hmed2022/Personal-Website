// Language for the Tunisian banknotes piece: 'en' or 'ar'. Remembered between visits.
//   import { lang, t, isAr } from '../i18n.js'   ->  {$t('key')}   {$t('key', { n: 3 })}   {#if $isAr}
// Strings live in strings.js as { key: { en, ar } }; {name} placeholders are filled from vars.
import { writable, derived } from 'svelte/store';
import STRINGS from './strings.js';

const KEY = 'tuninfo-lang';
function initial() {
	try {
		const saved = localStorage.getItem(KEY);
		if (saved === 'en' || saved === 'ar') return saved;
	} catch (e) { /* storage blocked */ }
	return 'en';
}

export const lang = writable(typeof window === 'undefined' ? 'en' : initial());
lang.subscribe((l) => { try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ } });

export const isAr = derived(lang, (l) => l === 'ar');
export const dir = derived(lang, (l) => (l === 'ar' ? 'rtl' : 'ltr'));

function fill(s, vars) {
	return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : s;
}
export const t = derived(lang, (l) => (key, vars) => {
	const e = STRINGS[key];
	if (!e) return key;
	return fill(e[l] ?? e.en, vars);
});
// pick between two values: $pick(english, arabic)
export const pick = derived(lang, (l) => (en, ar) => (l === 'ar' && ar != null && ar !== '' ? ar : en));

// "5 dinars" / "5 دنانير" with the right Arabic number agreement
export function dinarsText(v, l) {
	const n = +v;
	if (l === 'ar') {
		if (n === 0.5) return 'نصف دينار';
		if (n === 1) return 'دينار واحد';
		if (n === 2) return 'ديناران';
		if (n >= 3 && n <= 10) return `${n} دنانير`;
		return `${n} دينارًا`;
	}
	if (n === 0.5) return '½ dinar';
	return `${n} ${n === 1 ? 'dinar' : 'dinars'}`;
}
export const money = derived(lang, (l) => (v) => dinarsText(v, l));
// short value label: "½ DT" / "½ د.ت"
export const dtLabel = derived(lang, (l) => (v) => `${+v === 0.5 ? '½' : v} ${l === 'ar' ? 'د.ت' : 'DT'}`);
