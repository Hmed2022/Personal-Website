// Prayer times from the sun's position (no data needed), with Tunisia's official convention:
//   Fajr   sun 18° below the horizon, before sunrise
//   Dhuhr  solar noon
//   Asr    Maliki: an object's shadow equals its length plus its noon shadow
//   Maghrib sunset (sun's upper edge on the horizon, with refraction: 0.833°)
//   Isha   sun 18° below the horizon, after sunset
// This is the "Tunisia" method of the AlAdhan timetable service. The Ministry of Religious Affairs'
// printed timetable adds small safety margins, so results can differ from it by a minute or two.
// Times are in Tunisian time (UTC+1 all year, no daylight saving).

const RAD = Math.PI / 180;
const TZ = 1;
export const FAJR_ANGLE = 18;
export const ISHA_ANGLE = 18;
export const PRAYERS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

// sun's declination (degrees) and equation of time (minutes) for a day of the year (NOAA approximation)
export function sun(dayOfYear) {
	const g = ((2 * Math.PI) / 365) * (dayOfYear - 1);
	const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
	const decl =
		0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) +
		0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
	return { decl: decl / RAD, eqt };
}

// hours from noon until the sun reaches `altitude` degrees (negative = below the horizon)
function hourAngle(altitude, lat, decl) {
	const cosH = (Math.sin(altitude * RAD) - Math.sin(lat * RAD) * Math.sin(decl * RAD)) / (Math.cos(lat * RAD) * Math.cos(decl * RAD));
	if (cosH < -1 || cosH > 1) return NaN; // never happens at Tunisia's latitudes
	return Math.acos(cosH) / RAD / 15;
}

// all six times for one place and day, in minutes after midnight (Tunisian time)
export function prayerTimes(lat, lon, dayOfYear) {
	const { decl, eqt } = sun(dayOfYear);
	const noon = 12 + TZ - lon / 15 - eqt / 60; // hours
	const asrAlt = Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * RAD))) / RAD;
	const t = {
		fajr: noon - hourAngle(-FAJR_ANGLE, lat, decl),
		sunrise: noon - hourAngle(-0.833, lat, decl),
		dhuhr: noon,
		asr: noon + hourAngle(asrAlt, lat, decl),
		maghrib: noon + hourAngle(-0.833, lat, decl),
		isha: noon + hourAngle(-ISHA_ANGLE, lat, decl)
	};
	for (const k in t) t[k] = t[k] * 60;
	return t;
}

export const dayOfYear = (d) => Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);

export function clock(minutes) {
	const m = Math.round(minutes);
	return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function dayLabel(doy, year = new Date().getFullYear()) {
	const d = new Date(Date.UTC(year, 0, doy));
	return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
