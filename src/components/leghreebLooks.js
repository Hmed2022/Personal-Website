// What Leghreeb wears on the About page, decided by the visitor's own local time and date
// (so he's asleep after 2 a.m. wherever you are).
//
// Order of priority (first match wins; times are the visitor's local time):
//   1. 2:00–8:59 a.m.            asleep in hooded pyjamas (outfit and face)
//   2. Free Palestine: keffiyeh for one hour a day between 9 a.m. and noon (the hour is picked from the date,
//      so it changes daily but every visitor sees the same one)
//   3. Outfit for the day:
//        Eid al-Fitr / Eid al-Adha      jebba + chechia
//        Michigan game day              maize & blue jersey + foam finger
//        Tunisian national day          dingri + chechia
//        Ramadan, other Islamic days    jebba + chechia
//        Friday (Jumu'ah)               jebba + chechia
//        any other day                  straw hat + the rotating NBA jerseys
//   4. 10:30 p.m.–1:59 a.m.      tired face (red eyes, bags) on top of that day's outfit

// Michigan football + basketball games, as 'YYYY-MM-DD' (local date) → what to show in the caption.
// Add each season's schedule here.
export const UMICH_GAMES = {
  // 2026 football regular season (source: Michigan Athletics schedule announced 27 Jan 2026)
  '2026-09-05': 'Football vs Western Michigan',
  '2026-09-12': 'Football vs Oklahoma',
  '2026-09-19': 'Football vs UTEP',
  '2026-09-26': 'Football vs Iowa',
  '2026-10-03': 'Football at Minnesota',
  '2026-10-17': 'Football vs Penn State (Homecoming)',
  '2026-10-24': 'Football vs Indiana',
  '2026-10-31': 'Football at Rutgers',
  '2026-11-07': 'Football vs Michigan State',
  '2026-11-14': 'Football at Oregon',
  '2026-11-21': 'Football vs UCLA',
  '2026-11-28': 'Football at Ohio State',
  // add the Big Ten Championship (Dec. 5), bowl or playoff games here once they are set
};

// Tunisian days, 'MM-DD' → name (fixed dates; edit freely)
export const TUNISIA_DAYS = {
  '01-14': 'Revolution and Youth Day',
  '03-16': 'National Day of Traditional Dress',
  '03-20': 'Independence Day',
  '04-09': "Martyrs' Day",
  '07-25': 'Republic Day',
  '08-13': "Women's Day",
  '10-15': 'Evacuation Day',
  '12-17': 'Revolution Day'
};

// Islamic dates come from the browser's Umm al-Qura calendar, so they move every year on their own
// (they can be a day off from the local moon sighting). [month, day] → name
const ISLAMIC_DAYS = {
  '1-1': 'Islamic New Year', '1-10': 'Ashura', '3-12': 'Mawlid',
  '10-1': 'Eid al-Fitr', '10-2': 'Eid al-Fitr', '10-3': 'Eid al-Fitr',
  '12-9': 'Day of Arafah', '12-10': 'Eid al-Adha', '12-11': 'Eid al-Adha', '12-12': 'Eid al-Adha'
};

// jebba / chechia with their Arabic names
const JC = 'Jebba (جبّة) and chechia (شاشية)';

function localParts(now) {
  const p = {};
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' })
    .formatToParts(now).forEach(({ type, value }) => (p[type] = value));
  return { y: p.year, m: p.month, d: p.day, hour: +p.hour % 24, minute: p.minute, weekday: p.weekday };
}

function hijri(now) {
  try {
    const f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric' });
    if (!/islamic/.test(f.resolvedOptions().calendar)) return null;
    const p = {};
    f.formatToParts(now).forEach(({ type, value }) => (p[type] = value));
    return { month: +p.month, day: +p.day };
  } catch (e) { return null; }
}

// 9, 10 or 11: a different hour each day, the same for every visitor
export function palestineHour(y, m, d) {
  let h = 0;
  for (const c of `${y}-${m}-${d}`) h = (h * 31 + c.charCodeAt(0)) % 997;
  return 9 + (h % 3);
}

// → { outfit, face, title, why }
//   outfit: 'jerseys' | 'umich' | 'jebba' | 'dingri' | 'pajama'   face: 'normal' | 'tired' | 'asleep'
export function lookFor(now = new Date()) {
  const t = localParts(now);
  if (t.hour >= 2 && t.hour < 9) return { outfit: 'pajama', face: 'asleep', title: 'Shh, Leghreeb is asleep', why: '' };

  const h = hijri(now);
  const islamic = h && ISLAMIC_DAYS[`${h.month}-${h.day}`];
  const game = UMICH_GAMES[`${t.y}-${t.m}-${t.d}`];
  const tunisia = TUNISIA_DAYS[`${t.m}-${t.d}`];
  let look;
  if (t.hour === palestineHour(t.y, t.m, t.d)) look = { outfit: 'kef', title: 'Free Palestine!', why: '' };
  else if (islamic && islamic.startsWith('Eid')) look = { outfit: 'jebba', title: 'Eid Mubarak!', why: `${islamic}: ${JC}.` };
  else if (game) look = { outfit: 'umich', title: 'Game day. Go Blue!', why: game };
  else if (tunisia) look = { outfit: 'dingri', title: tunisia, why: `Dingri (دنقري) and chechia (شاشية) for Tunisia.` };
  else if (h && h.month === 9) look = { outfit: 'jebba', title: 'Ramadan Kareem', why: `${JC} all month.` };
  else if (islamic) look = { outfit: 'jebba', title: islamic, why: `${JC} for the occasion.` };
  else if (t.weekday === 'Fri') look = { outfit: 'jebba', title: "Jumu'ah Mubarak", why: `${JC} for Friday prayer.` };
  else look = { outfit: 'jerseys' };

  // tired from 10:30 p.m. until he falls asleep at 2 a.m.
  const mins = t.hour * 60 + +t.minute;
  look.face = t.hour < 2 || mins >= 22 * 60 + 30 ? 'tired' : 'normal';
  return look;
}
