// The 27-card deck used by both magic modes.

const suits = ['Spades', 'Diamonds', 'Hearts', 'Clubs'];
const values = Array.from({ length: 13 }, (_, i) => i + 1);

// Fisher–Yates: every order is equally likely (sort(() => Math.random() - .5) is biased),
// so "your choice was completely random" is actually true.
export function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// 27 random cards out of 52, each with its starting index (0-26)
export function newDeck() {
	const all = [];
	for (const suit of suits) for (const value of values) all.push({ suit, value });
	return shuffle(all)
		.slice(0, 27)
		.map((card, index) => ({ ...card, index, selected: false }));
}

export function getCardSrc(card) {
	if (!card) return '';
	const fileSuit = { Clubs: 'club', Diamonds: 'diam', Hearts: 'heart', Spades: 'spade' };
	return `/assets/CardMagic/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? '0' : ''}${card.value}.png`;
}
