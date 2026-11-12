import { writable, derived } from 'svelte/store';
// Local illustration of a note (BanknotesSmall/Banknote-NN.webp), falling back to its online preview.
// The local files mostly share the number of the online preview (baknote-NN.png), except these,
// which were numbered differently when exported. Keyed by the note's value and issue year.
const LOCAL = import.meta.glob('./BanknotesSmall/*.webp', { eager: true, as: 'url' });
const file = (nn) => LOCAL[`./BanknotesSmall/Banknote-${String(nn).padStart(2, '0')}.webp`];

const FIX = {
  '0.5-1958': 40,   // purple ½ dinar, Kairouan minaret
  '1-1958': 30,     // green 1 dinar
  '0.5-1965': 36,   // blue ½ dinar, mosque
  '5-1983': 35,     // purple 5 dinars
  '10-1986': 39,    // beige 10 dinars
};

export function noteImage(n, fallback = n?.Preview) {
  if (!n) return fallback;
  const fix = FIX[`${n.Value}-${n.Issued}`];
  if (fix) return file(fix) || fallback;
  const m = /baknote-(\d+)\.png/i.exec(n.Preview || '');
  return (m && file(m[1])) || fallback;
}

// Higher-resolution photos of the real notes, saved by hand from Numista into RealNotes/.
// Name them <value>-<year>-front.<ext> and <value>-<year>-back.<ext>, e.g. 5-1973-front.jpg, 0.5-1958-back.webp.
// The two 10 dinar notes of 1994 are 10-1994 (P87) and 10-1994b (P87A).
// A photo found here replaces the PathF / PathB link from data.js; anything missing keeps the old link.
const REAL = import.meta.glob('./RealNotes/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });
const realByName = {};
for (const [path, url] of Object.entries(REAL)) realByName[path.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase()] = url;

export function realPhoto(n, side) {
  if (!n) return null;
  const id = `${n.Value}-${n.Issued}${/P087A/i.test(n.PathF || '') ? 'b' : ''}`;
  return realByName[`${id}-${side}`] || (side === 'front' ? n.PathF : n.PathB);
}

// Illustrations or photos of the real notes, for the whole piece (switch above the language switch).
const KEY = 'tuninfo-real-notes';
let start = false;
try { start = localStorage.getItem(KEY) === '1'; } catch (e) { /* storage blocked */ }
export const realNotes = writable(start);
realNotes.subscribe((v) => { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* ignore */ } });
// $noteSrc(n, illustration) -> the illustration, or the front photo when "real notes" is on
export const noteSrc = derived(realNotes, (real) => (n, illus) => (!real || !n ? illus : n.intruder ? n.real || illus : realPhoto(n, 'front') || illus));
