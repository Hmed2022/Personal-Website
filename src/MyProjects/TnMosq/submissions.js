// Saving "add a mosque" submissions to Supabase (same project and keys as the card trick).
// The table and the count function are created by Data/mosque_submissions.sql.
// The Supabase library is only downloaded when it's first needed; without keys nothing loads
// and the form explains that submissions are not open yet.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

let clientPromise = null;
function getClient() {
	if (!url || !key) return Promise.resolve(null);
	clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key));
	return clientPromise;
}

const clean = (v, max) => {
	const s = String(v ?? '').trim();
	return s ? s.slice(0, max) : null;
};
const num = (v) => {
	const n = parseFloat(v);
	return Number.isFinite(n) ? n : null;
};

// returns { ok: true } or { ok: false, reason }
export async function submitMosque(form) {
	const supabase = await getClient();
	if (!supabase) return { ok: false, reason: 'offline' };
	const row = {
		name: clean(form.name, 120),
		name_ar: clean(form.name_ar, 120),
		place: clean(form.place, 120),
		governorate: clean(form.governorate, 40),
		lat: num(form.lat),
		lon: num(form.lon),
		note: clean(form.note, 600)
	};
	if (!row.name || row.name.length < 2) return { ok: false, reason: 'name' };
	if (row.lat !== null && (row.lat < 30 || row.lat > 38)) return { ok: false, reason: 'place' };
	if (row.lon !== null && (row.lon < 7 || row.lon > 12)) return { ok: false, reason: 'place' };
	const { error } = await supabase.from('mosque_submissions').insert(row);
	if (error) return { ok: false, reason: 'server', detail: error.message };
	return { ok: true };
}

// live counter; null when unavailable (no keys, or the SQL hasn't been run yet)
export async function submissionCount() {
	const supabase = await getClient();
	if (!supabase) return null;
	const { data, error } = await supabase.rpc('mosque_submission_count');
	if (error || typeof data !== 'number') return null;
	return data;
}
