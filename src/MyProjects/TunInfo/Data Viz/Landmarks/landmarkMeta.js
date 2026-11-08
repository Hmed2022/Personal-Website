// Shared by the scrolling landmark map and the landmark explorer.
export const CATEGORIES = {
	infra: 'Modern infrastructure',
	roman: 'Ancient Roman and Punic sites',
	islam: 'Islamic and religious sites',
	urban: 'Architectural and urban sites',
	cult: 'Cultural and educational institutions',
	indus: 'Industrial and energy sites',
	gov: 'Government and historical buildings',
	nat: 'Natural landscapes and features',
};
// Category colours, reduced to the piece's three-colour palette (was 8 unrelated colours):
//   blue = the modern state, terracotta = heritage, gold = institutions. Shades tell members apart.
export const TAG_COLOR = {
	infra: '#1E5B8C', indus: '#4E7FA8',                                   // the modern state
	roman: '#B5523B', islam: '#8C4D3F', urban: '#C9774F', nat: '#A36A4A', // heritage
	cult: '#B08A3E', gov: '#8A6A2E',                                       // institutions
};
export const TAG_GROUP = { infra: 'state', indus: 'state', roman: 'heritage', islam: 'heritage', urban: 'heritage', nat: 'heritage', cult: 'inst', gov: 'inst' };

// Line icons in one consistent style (white, 24x24), drawn for this piece.
const G = {
	infra: '<path d="M2 15h20M4 15v4M20 15v4M4 15c3-6.5 13-6.5 16 0M8.5 11.6V15M12 10.6V15M15.5 11.6V15"/>',
	indus: '<path d="M3 20h18M4 20v-9l5 3v-3l5 3V5h3.5v15"/><path d="M8 17h1.5M12.5 17H14"/>',
	nat: '<path d="M12 21c.6-4 .6-7.5 0-10.5"/><path d="M12 10.5c-1.6-2.6-4.6-3.4-7.2-2.2M12 10.5c1.6-2.6 4.6-3.4 7.2-2.2M12 10.5c-.4-2.8.4-5 2.6-6.6M12 10.5c-2.8-.6-5 .8-6 3.6M12 10.5c2.8-.6 5 .8 6 3.6"/>',
	roman: '<path d="M4.5 5.5h15M6 3.5h12M7.5 5.5v12.5M10.5 5.5v12.5M13.5 5.5v12.5M16.5 5.5v12.5M5.5 18h13M4 20.5h16"/>',
	// crescent and star
	islam: '<path d="M15.5 4.6A8 8 0 1 0 15.5 19.4 6.4 6.4 0 1 1 15.5 4.6z"/><path d="M17.6 9.2l.75 1.9 2 .1-1.55 1.3.5 1.95-1.7-1.1-1.7 1.1.5-1.95-1.55-1.3 2-.1z"/>',
	urban: '<path d="M4 20.5h16M6.5 20.5V10a5.5 5.5 0 0 1 11 0v10.5M9.5 20.5v-6a2.5 2.5 0 0 1 5 0v6"/><circle cx="10" cy="9.5" r=".55"/><circle cx="14" cy="9.5" r=".55"/><circle cx="12" cy="7.5" r=".55"/>',
	cult: '<path d="M12 6.5c-2.2-1.6-5.2-2-8-1.5v13c2.8-.5 5.8-.1 8 1.5 2.2-1.6 5.2-2 8-1.5V5c-2.8-.5-5.8-.1-8 1.5zM12 6.5V19.5"/>',
	gov: '<path d="M3 9.5 12 4.5l9 5M4.5 9.5h15M6.5 9.5v7.5M10 9.5v7.5M14 9.5v7.5M17.5 9.5v7.5M4.5 17h15M3 20h18"/>',
};
const svg = (inner) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -1 26 26' fill='none' stroke='white' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'>${inner}</svg>`)}`;
export const TAG_ICON = Object.fromEntries(Object.entries(G).map(([k, v]) => [k, svg(v)]));

export const TAG_FILE = { infra: 'tag1', roman: 'tag2', islam: 'tag3', urban: 'tag4', cult: 'tag5', indus: 'tag6', gov: 'tag7', nat: 'tag8' };

// the proposals from the text, for the governorates never on a note
export const PROPOSED = {
	Ariana: ['Ennahli Park', 'The Andalusian Bridge'], Gafsa: ['Ancient Roman Pools'], Kebili: ['Chott El Jerid'],
	'El Kef': ['Kasbah of Le Kef'], Medenine: ['Ksar Hallouf', 'El Ghriba Synagogue'],
	'Sidi Bouzid': ['Martyr Mohamed Bouazizi Square'], Siliana: ['Maktaris ancient ruins'], Tozeur: ['Tamerza Canyon Oasis'],
};

// "20 Tnd (2011)" -> { value: '20', year: '2011' }
export function parseBill(bill = '') {
	const m = /([\d/.]+)\s*Tnd\s*\((\d{4})\)/i.exec(bill);
	return m ? { value: m[1] === '1/2' ? '½' : m[1], year: m[2] } : { value: '', year: '' };
}
