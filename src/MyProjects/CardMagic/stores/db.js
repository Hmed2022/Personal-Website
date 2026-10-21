import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only connect when both keys are set, so the trick still works without a database
const supabase = url && key ? createClient(url, key) : null;

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

// Time zone as a privacy-friendly region, e.g. "America/Toronto"
function getRegion() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
	} catch {
		return null;
	}
}

// One id per play (new on every locked-in card), shared by the pick row and its events
let sessionId = null;

/**
 * Save one locked-in card. Never throws: a failed save must not break the trick.
 * @param {object} card - the selected card, after the three cycles were assigned
 * @param {number} changedMind - times the user switched cards before locking in
 */
export async function savePick(card, changedMind) {
	if (!supabase) {
		console.warn('Supabase keys missing in .env, pick not saved');
		return;
	}

	sessionId = crypto.randomUUID();

	const { error } = await supabase.from('card_picks').insert({
		session_id: sessionId,
		card_index: card.index,
		value: card.value,
		suit: card.suit,
		changed_mind: changedMind,
		region: getRegion(),
		browser: getBrowser(),
		cycle1_pile: card.cycle1pile, cycle1_pos: card.cycle1pos,
		cycle2_pile: card.cycle2pile, cycle2_pos: card.cycle2pos,
		cycle3_pile: card.cycle3pile, cycle3_pos: card.cycle3pos,
		// the reveal flips the 14th card (position 13) after cycle 3
		found: card.cycle3pos === 13
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
