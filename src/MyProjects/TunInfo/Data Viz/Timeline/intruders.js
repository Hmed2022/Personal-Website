// The joke in the binder: one foreign note slipped in among the Tunisian ones (a different one on each visit).
// Drawn as flat illustrations in the same faceless style as the Tunisian notes, not copies of real money.
const url = (svg) => `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;

// a 20 dollar bill: off-white paper, green-black ink, a guilloche frame, a faceless oval portrait
// in the middle, a black seal on the left and a green one on the right, serial numbers in green
const usdRosette = (cx, cy, R, n, ink) => Array.from({ length: n }, (_, i) => {
  const a = (i * 180) / n;
  return `<ellipse cx='${cx}' cy='${cy}' rx='${R}' ry='${(R * 0.38).toFixed(1)}' transform='rotate(${a.toFixed(1)} ${cx} ${cy})' fill='none' stroke='${ink}' stroke-width='.7'/>`;
}).join('');
const usdWave = (x0, x1, y, amp, ink, n) => Array.from({ length: n }, (_, k) => {
  let d = `M${x0} ${y + k * 2.2}`;
  for (let x = x0; x < x1; x += 8) d += ` q2 ${k % 2 ? amp : -amp} 4 0 t4 0`;
  return `<path d='${d}' fill='none' stroke='${ink}' stroke-width='.6'/>`;
}).join('');
const usdSeal = (cx, cy, r, ink, fill) => {
  const teeth = Array.from({ length: 40 }, (_, i) => {
    const a = (i * Math.PI) / 20, b = a + Math.PI / 40, R2 = r + 4;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} ${(cx + R2 * Math.cos(b)).toFixed(1)},${(cy + R2 * Math.sin(b)).toFixed(1)}`;
  }).join(' ');
  return `<polygon points='${teeth}' fill='${fill}'/>
    <circle cx='${cx}' cy='${cy}' r='${r - 4}' fill='none' stroke='#F3F0E2' stroke-width='1'/>
    <circle cx='${cx}' cy='${cy}' r='${r - 11}' fill='none' stroke='#F3F0E2' stroke-width='.8'/>`;
};
const usd = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='470' height='200' viewBox='0 0 470 200'>
  <defs>
    <radialGradient id='p' cx='.5' cy='.5' r='.7'><stop offset='0' stop-color='#F2EFE0'/><stop offset='.7' stop-color='#E3E6D2'/><stop offset='1' stop-color='#D6DCC4'/></radialGradient>
    <radialGradient id='peach' cx='.5' cy='.5' r='.5'><stop offset='0' stop-color='#F3CDB0' stop-opacity='.7'/><stop offset='1' stop-color='#F3CDB0' stop-opacity='0'/></radialGradient>
  </defs>
  <rect width='470' height='200' fill='url(#p)'/>
  <ellipse cx='235' cy='100' rx='150' ry='80' fill='url(#peach)'/>
  <!-- guilloche frame -->
  <rect x='6' y='6' width='458' height='188' fill='none' stroke='#2F3B30' stroke-width='3'/>
  <rect x='12' y='12' width='446' height='176' fill='none' stroke='#2F3B30' stroke-width='1'/>
  ${usdWave(14, 456, 15, 1.6, '#45594A', 3)}
  ${usdWave(14, 456, 179, 1.6, '#45594A', 3)}
  <!-- corner rosettes with a 20 -->
  ${[[40, 42], [430, 42], [40, 158]].map(([x, y]) => `${usdRosette(x, y, 22, 10, '#3E5242')}<circle cx='${x}' cy='${y}' r='13' fill='#E8E9D8'/><text x='${x}' y='${y + 7}' text-anchor='middle' font-family='Georgia, serif' font-weight='700' font-size='19' fill='#2F3B30'>20</text>`).join('')}
  <!-- THE UNITED STATES OF AMERICA -->
  <text x='235' y='38' text-anchor='middle' font-family='Georgia, Times, serif' font-weight='700' font-size='13.5' letter-spacing='2' fill='#2F3B30'>THE UNITED STATES OF AMERICA</text>
  <text x='112' y='58' text-anchor='middle' font-family='Georgia, serif' font-size='6.5' letter-spacing='.6' fill='#4A5A4C'>FEDERAL RESERVE NOTE</text>
  <!-- portrait oval, faceless like the Tunisian notes -->
  <ellipse cx='235' cy='104' rx='54' ry='62' fill='#E9E7D6' stroke='#2F3B30' stroke-width='2'/>
  <ellipse cx='235' cy='104' rx='60' ry='68' fill='none' stroke='#45594A' stroke-width='1' stroke-dasharray='1.5 1.5'/>
  <path d='M192 160 Q194 126 235 121 Q276 126 278 160 Q256 166 235 166 Q214 166 192 160 Z' fill='#4F5F52'/>
  <path d='M222 124 L235 146 L248 124' fill='#E9E7D6'/>
  <path d='M213 92 Q211 62 235 60 Q259 62 257 92 Q256 112 235 117 Q214 112 213 92 Z' fill='#7E8C7F'/>
  <path d='M211 82 Q214 56 235 55 Q259 56 260 84 Q252 66 235 66 Q218 66 211 82 Z' fill='#4F5F52'/>
  <!-- black seal left, green seal right -->
  ${usdSeal(112, 104, 22, '#2B2B2B', '#2E2E2E')}
  <text x='112' y='112' text-anchor='middle' font-family='Georgia, serif' font-weight='700' font-size='22' fill='#F3F0E2'>B</text>
  ${usdSeal(360, 112, 20, '#2F6B45', '#3D7A50')}
  <path d='M352 104 L368 104 L366 120 L354 120 Z' fill='none' stroke='#F3F0E2' stroke-width='1.4'/>
  <path d='M351 111 H369' stroke='#F3F0E2' stroke-width='1.2'/>
  <!-- serial numbers in green -->
  <g font-family='Courier New, monospace' font-weight='700' font-size='12' fill='#2F6B45' letter-spacing='.5'>
    <text x='58' y='76'>JB 04291956 C</text><text x='300' y='150'>JB 04291956 C</text>
  </g>
  <!-- signatures, as squiggles -->
  <path d='M82 140 q6 -10 12 0 t12 -2 t14 2' fill='none' stroke='#2F3B30' stroke-width='1.2'/>
  <path d='M338 76 q6 -10 12 0 t12 -2 t14 2' fill='none' stroke='#2F3B30' stroke-width='1.2'/>
  <!-- TWENTY DOLLARS banner -->
  <rect x='145' y='170' width='180' height='15' rx='2' fill='#E8E9D8' stroke='#2F3B30' stroke-width='1'/>
  <text x='235' y='182' text-anchor='middle' font-family='Georgia, Times, serif' font-weight='700' font-size='10.5' letter-spacing='2.5' fill='#2F3B30'>TWENTY DOLLARS</text>
  <!-- big copper 20, bottom right -->
  <text x='452' y='184' text-anchor='end' font-family='Georgia, serif' font-weight='700' font-size='46' fill='#A8653A' stroke='#5C3A22' stroke-width='.8'>20</text>
</svg>`);

// a blue 20 euro note, after the 2002 series: EU flag top left, a big 20, two gothic windows
// (one brown, one blue), "20 EURO" bottom left and a shiny strip of 20s on the right
const star5 = (cx, cy, r) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  });
  return `<polygon points='${pts.join(' ')}'/>`;
};
const ring = (cx, cy, R, r) => Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return star5(cx + R * Math.cos(a), cy + R * Math.sin(a), r); }).join('');
// a gothic window: pointed arch, two lancets, a rose on top
const windowArch = (x, w, top, bottom, frame, glass) => {
  const cx = x + w / 2, sp = top + w * 0.55;
  return `
  <path d='M${x} ${bottom} V${sp} C${x} ${sp - w * 0.45} ${cx - w * 0.2} ${top - w * 0.05} ${cx} ${top - w * 0.3} C${cx + w * 0.2} ${top - w * 0.05} ${x + w} ${sp - w * 0.45} ${x + w} ${sp} V${bottom} Z' fill='${frame}'/>
  <path d='M${x + 7} ${bottom} V${sp + 2} C${x + 7} ${sp - w * 0.36} ${cx - w * 0.15} ${top + 4} ${cx} ${top - w * 0.3 + 13} C${cx + w * 0.15} ${top + 4} ${x + w - 7} ${sp - w * 0.36} ${x + w - 7} ${sp + 2} V${bottom} Z' fill='${glass}'/>
  <circle cx='${cx}' cy='${sp - 4}' r='${w * 0.2}' fill='none' stroke='${frame}' stroke-width='4'/>
  <circle cx='${cx}' cy='${sp - 4}' r='${w * 0.07}' fill='${frame}'/>
  <path d='M${x + w * 0.27} ${bottom} V${sp + w * 0.3} Q${x + w * 0.27} ${sp + w * 0.12} ${x + w * 0.38} ${sp + w * 0.12} Q${cx - 3} ${sp + w * 0.12} ${cx - 3} ${sp + w * 0.3} V${bottom}
           M${cx + 3} ${bottom} V${sp + w * 0.3} Q${cx + 3} ${sp + w * 0.12} ${x + w * 0.62} ${sp + w * 0.12} Q${x + w * 0.73} ${sp + w * 0.12} ${x + w * 0.73} ${sp + w * 0.3} V${bottom}'
        fill='none' stroke='${frame}' stroke-width='3.5'/>
  <path d='M${x + 7} ${bottom - 30} H${x + w - 7} M${x + 7} ${bottom - 58} H${x + w - 7}' stroke='${frame}' stroke-width='2' opacity='.6'/>`;
};
const eur = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='400' height='212' viewBox='0 0 400 212'>
  <defs>
    <linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#DDE8F6'/><stop offset='.45' stop-color='#B9CFEC'/><stop offset='1' stop-color='#D3E1F3'/></linearGradient>
    <linearGradient id='h' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#C9CED6'/><stop offset='.5' stop-color='#F3F5F8'/><stop offset='1' stop-color='#B7BDC7'/></linearGradient>
  </defs>
  <rect width='400' height='212' fill='url(#g)'/>
  <!-- faint big map / stars in the background -->
  <path d='M120 170 L170 60 L230 180 Z' fill='#F1DCD3' opacity='.55'/>
  <g fill='#F2C14E' opacity='.55'>${star5(250, 40, 9)}${star5(268, 116, 9)}${star5(250, 186, 9)}</g>
  <!-- EU flag -->
  <rect x='48' y='12' width='44' height='30' fill='#2A3F9E'/>
  <g fill='#F2C14E'>${ring(70, 27, 10, 2.2)}</g>
  <!-- outlined 20, top left -->
  <text x='8' y='40' font-family='Arial, Helvetica, sans-serif' font-weight='700' font-size='34' fill='none' stroke='#8B9BC7' stroke-width='1.6'>20</text>
  <!-- line of text and a signature, as plain bars -->
  <rect x='100' y='12' width='118' height='7' rx='2' fill='#2D3F7C' opacity='.8'/>
  <path d='M128 38 q6 -12 10 0 t10 0 t12 -4' fill='none' stroke='#2D3F7C' stroke-width='1.6'/>
  <!-- the two windows -->
  ${windowArch(200, 70, 112, 200, '#7A4A5E', '#C9A3A8')}
  ${windowArch(272, 70, 112, 200, '#3A4FA0', '#9FB4DE')}
  <!-- big 20 -->
  <text x='236' y='96' font-family='Arial, Helvetica, sans-serif' font-weight='700' font-size='92' fill='#3A4682' opacity='.92'>20</text>
  <!-- 20 EURO, bottom left -->
  <text x='10' y='194' font-family='Arial, Helvetica, sans-serif' font-weight='700' font-size='44' fill='#2D3F7C'>20</text>
  <text x='62' y='178' font-family='Arial, Helvetica, sans-serif' font-weight='700' font-size='20' fill='#7A4A5E' letter-spacing='1'>EURO</text>
  <rect x='62' y='184' width='60' height='9' rx='2' fill='#7A4A5E' opacity='.35'/>
  <!-- shiny strip on the right -->
  <rect x='352' y='0' width='30' height='212' fill='url(#h)'/>
  <g font-family='Arial, Helvetica, sans-serif' font-weight='700' font-size='12' fill='#6E7684' text-anchor='middle'>
    ${Array.from({ length: 6 }, (_, i) => `<text x='367' y='${24 + i * 34}'>20</text>`).join('')}
  </g>
</svg>`);

// `rate` = dinars per unit, a recent mid-market rate (late 2026), used if the live rate can't be fetched.
export const INTRUDERS = [
  { key: 'usd', img: usd, tag: '$20', color: '#3E5B45', name: 'bdUsdName', line: 'bdUsd', cur: 'USD', amount: 20, rate: 3.0 },
  { key: 'eur', img: eur, tag: '€20', color: '#2F5E96', name: 'bdEurName', line: 'bdEur', cur: 'EUR', amount: 20, rate: 3.36 },
];

// Today's rate in dinars for one unit of `cur` (free, no key, CORS-enabled); falls back to `fallback`.
const cache = {};
export function dinarRate(cur, fallback) {
  if (!cache[cur]) {
    cache[cur] = fetch(`https://open.er-api.com/v6/latest/${cur}`)
      .then((r) => r.json())
      .then((d) => (d && d.rates && +d.rates.TND > 0 ? +d.rates.TND : fallback))
      .catch(() => fallback);
  }
  return cache[cur];
}
