// "A seller in …": a city near the reader, guessed from the browser's time zone only
// (no location prompt, no outside service). Each zone maps to a few plausible cities in that
// region and one is picked at random; Tunisia and unclear zones get a random US city.
const ZONES = {
	'America/New_York': ['New York', 'Philadelphia', 'Boston', 'Columbus', 'Cleveland', 'Pittsburgh', 'Atlanta', 'Charlotte', 'Baltimore', 'Miami'],
	'America/Detroit': ['Detroit', 'Grand Rapids', 'Ann Arbor'],
	'America/Chicago': ['Chicago', 'Dallas', 'Houston', 'St. Louis', 'Minneapolis', 'Nashville', 'Kansas City', 'Milwaukee', 'New Orleans', 'Omaha'],
	'America/Denver': ['Denver', 'Salt Lake City', 'Albuquerque', 'Colorado Springs'],
	'America/Boise': ['Boise'],
	'America/Phoenix': ['Phoenix', 'Tucson', 'Scottsdale'],
	'America/Los_Angeles': ['Los Angeles', 'San Francisco', 'Seattle', 'Portland', 'San Diego', 'Sacramento', 'Las Vegas'],
	'America/Anchorage': ['Anchorage'],
	'Pacific/Honolulu': ['Honolulu'],
	'America/Toronto': ['Toronto', 'Ottawa', 'Montreal'],
	'America/Vancouver': ['Vancouver', 'Victoria'],
	'America/Edmonton': ['Edmonton', 'Calgary'],
	'America/Halifax': ['Halifax'],
	'Europe/London': ['London', 'Manchester', 'Birmingham', 'Leeds'],
	'Europe/Paris': ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
	'Europe/Berlin': ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
	'Europe/Madrid': ['Madrid', 'Barcelona', 'Valencia'],
	'Europe/Rome': ['Rome', 'Milan', 'Turin', 'Naples'],
	'Australia/Sydney': ['Sydney'],
	'Australia/Melbourne': ['Melbourne'],
};
const US = ['Ohio', 'Tulsa', 'Sacramento', 'Albuquerque', 'Omaha', 'Boise', 'Pittsburgh', 'Memphis'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function guess() {
	let tz = '';
	try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
	if (ZONES[tz]) return pick(ZONES[tz]);
	if (tz.startsWith('America/Indiana/')) return pick(['Indianapolis', 'Fort Wayne']);
	if (tz.startsWith('America/Kentucky/')) return pick(['Louisville', 'Lexington']);
	// Tunisia, UTC/GMT and zones without a city: a random US city
	if (tz === 'Africa/Tunis' || !tz.includes('/') || tz.startsWith('Etc/')) return pick(US);
	// anywhere else: the city the zone is named after (Europe/Lisbon → Lisbon)
	const city = tz.split('/').pop().replace(/_/g, ' ');
	return /^[A-Za-z .'-]+$/.test(city) ? city : pick(US);
}

// one city per visit, so the intro and the binder say the same place
export const SELLER_CITY = typeof window === 'undefined' ? 'Ohio' : guess();
