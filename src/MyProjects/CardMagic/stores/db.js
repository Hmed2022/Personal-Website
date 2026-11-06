const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The Supabase library (~350 KB) is only downloaded when the first save happens,
// not as part of the card trick's own code. Without keys it's never loaded at all,
// so the trick still works without a database.
let clientPromise = null;
function getClient() {
	if (!url || !key) return Promise.resolve(null);
	clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key));
	return clientPromise;
}

// Simple browser name from the user agent (order matters: Edge/Opera also say "Chrome")
function getBrowser() {
	const ua = navigator.userAgent;
	if (/Edg\//.test(ua)) return 'Edge';
	if (/OPR\/|Opera/.test(ua)) return 'Opera';
	if (/Firefox\/|FxiOS/.test(ua)) return 'Firefox';
	if (/Chrome\/|CriOS/.test(ua)) return 'Chrome';
	if (/Safari\//.test(ua)) return 'Safari';
	return 'Other';
}

// "phone" | "tablet" | "desktop": touch screens are split by their shorter side
function getDevice() {
	try {
		const touch = window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
		if (!touch) return 'desktop';
		return Math.min(screen.width, screen.height) < 600 ? 'phone' : 'tablet';
	} catch {
		return null;
	}
}

// crypto.randomUUID() only exists on secure pages (https:// or localhost). A phone
// opening the dev server at http://<laptop-ip>:5173 isn't one, so fall back.
function newId() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
	const h = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0'));
	h[6] = '4' + h[6][1];                                   // version 4
	h[8] = ((parseInt(h[8], 16) & 0x3f) | 0x80).toString(16); // variant
	const x = h.join('');
	return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

// Time zone as a privacy-friendly region, e.g. "America/Toronto"
function getRegion() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
	} catch {
		return null;
	}
}

// One id per play, shared by the card_picks row and its card_events rows.
// A new one starts at the beginning of every play ("I've got it!" / "Lock it in!"),
// so events can never be attached to a previous play.
let sessionId = null;
export function startSession() {
	sessionId = newId();
	return sessionId;
}

/**
 * Save one play's card. Never throws: a failed save must not break the trick.
 * @param {object} card - the visitor's card, with all three cycles assigned
 * @param {number|null} changedMind - pick mode: times they switched cards before locking in
 * @param {'pick'|'mind'} mode - pick: chosen on screen; mind: thought of, found after 3 answers
 */
export async function savePick(card, changedMind, mode) {
	const supabase = await getClient().catch(() => null);
	if (!supabase) {
		console.warn('Supabase keys missing in .env (or library failed to load), pick not saved');
		return;
	}

	if (!sessionId) startSession();

	const { error } = await supabase.from('card_picks').insert({
		session_id: sessionId,
		mode,
		card_index: card.index,
		value: card.value,
		suit: card.suit,
		// changed_mind only means something in pick mode; the column is NOT NULL
		// default 0, so mind-mode rows simply leave it out (filter by mode)
		...(mode === 'pick' ? { changed_mind: changedMind } : {}),
		region: getRegion(),
		browser: getBrowser(),
		device: getDevice(),
		cycle1_pile: card.cycle1pile, cycle1_pos: card.cycle1pos,
		cycle2_pile: card.cycle2pile, cycle2_pos: card.cycle2pos,
		cycle3_pile: card.cycle3pile, cycle3_pos: card.cycle3pos
	});

	if (error) console.error('savePick failed', error);
}

// Events already logged once for the current session (e.g. 'opened_math')
const loggedOnce = new Set();

/**
 * Log something the visitor did, linked to the current play by session_id.
 * Never throws: a failed log must not break the trick.
 * @param {'wrong_pile' | 'finished' | 'opened_math'} event
 * @param {number | null} [cycle] - magic cycle (1-3) for 'wrong_pile'
 * @param {{ once?: boolean }} [opts] - once: log at most once per session
 */
export async function logEvent(event, cycle = null, { once = false } = {}) {
	const supabase = await getClient().catch(() => null);
	if (!supabase) return;
	if (once) {
		const key = `${sessionId}:${event}`;
		if (loggedOnce.has(key)) return;
		loggedOnce.add(key);
	}

	const { error } = await supabase.from('card_events').insert({
		session_id: sessionId,
		event,
		cycle
	});

	if (error) console.error('logEvent failed', error);
}
