// Why each governorate made it onto the banknotes (based on its landmarks in images.js),
// or, for the eight never shown, a short note. Used by GovernorateCard.svelte.
export const WHY = {
	Tunis: 'The capital and the seat of power. The Medina (a UNESCO World Heritage site), ancient Carthage, the parliament at Le Bardo, Sadiki College and the Central Bank all sit here, so Tunis appears more than every other governorate combined.',
	Kairouan: 'Home of the Great Mosque of Kairouan, founded in 670 and one of the oldest mosques in North Africa. The city is a UNESCO World Heritage site, often called the fourth holy city of Islam. The Nebhana dam stands for the young state’s water projects.',
	Mahdia: 'El Djem’s Roman amphitheatre, one of the largest ever built and a UNESCO World Heritage site. It has returned to the notes again and again, from 1972 to 2017.',
	Sousse: 'Its walled medina (a UNESCO World Heritage site) and the El Kantaoui resort showcased Tunisia’s tourism, and the Enfidha airport terminal was a flagship project of the 2000s.',
	Monastir: 'Habib Bourguiba’s hometown. His mosque, the fort and the port were all printed on notes during his presidency.',
	Bizerte: 'The Bizerte oil refinery, a symbol of industrialisation after independence.',
	Gabes: 'Known for its seaside oasis, and for the offshore Ashtart oil platforms in the Gulf of Gabès.',
	Sfax: 'Tunisia’s second city and an industrial centre, shown through its phosphoric acid plant and a Central Bank building.',
	Jendouba: 'The dams and bridges of the young republic: the Béni M’tir dam and a bridge over the Mellègue river.',
	Beja: 'Dougga (Thugga), one of the best-preserved Roman towns in North Africa and a UNESCO World Heritage site.',
	Zaghouan: 'The Temple of the Waters and the Roman aqueduct that carried water from Zaghouan to Carthage.',
	Kasserine: 'The triumphal arch at Sbeïtla, the ancient Roman town of Sufetula.',
	Tataouine: 'The Ksar Ouled Soltane, the fortified granaries of the south.',
	Manouba: 'The El Aroussia dam, part of the country’s water network.',
	'Ben Arous': 'The Radès – La Goulette bridge, opened in 2009.',
	Nabeul: 'An aerial view of Korbous, a hot-spring town on Cap Bon.',
};

export const NEVER = 'One of the eight governorates never shown on a Tunisian banknote since independence.';
export const COASTAL = new Set(['Jendouba', 'Bizerte', 'Ariana', 'Tunis', 'Ben Arous', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Gabes', 'Medenine']);
