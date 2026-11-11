// Leghreeb on the About page: the drawing (cut off under the beard) plus everything he can wear.
// One SVG holds every outfit and face; About.svelte shows the right ones with data-outfit / data-face
// on the wrapper (see leghreebLooks.js for when each one is used).
// Coordinates are the drawing's own 517×1072 space. Clothes sit 30 units higher (translate(0 -30))
// so necklines meet the beard. Colour is laid slightly off the ink lines, like a sketch coloured by hand.
const INK = 'var(--logo-ink, #2E3A40)';
const SKETCH = `<filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7"/>
  <feDisplacementMap in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="G"/></filter>`;

export const JERSEYS = [
  { word: 'DETROIT', num: '313', body: '#2F55C8', trim: '#D2343F', text: '#FFFFFF', shadow: '#D2343F',
    title: 'Detroit · 313', why: 'The Pistons: my home team.' },
  { word: 'LAKERS', num: '77', body: '#F4BE3C', trim: '#5B2A86', text: '#5B2A86', shadow: '#FFFFFF',
    title: 'Luka · 77', why: 'Luka Dončić, my favorite player.' },
  { word: 'DALLAS', num: '50', body: '#FBFAF6', trim: '#123A6B', text: '#123A6B', shadow: '#2E7BC4',
    title: 'Mejri · 50', why: 'Salah Mejri (Mavs), the only Tunisian to make it to the NBA.' },
  { word: 'TUNISIA', num: '619', body: '#D8232F', trim: '#FBFAF6', text: '#FFFFFF', shadow: '#8E1520', flag: true,
    title: 'Tunisia · 619', why: "Where I'm from. Maana Rabbi wel Nebi!" }
];
// small sketched Tunisian flag patch on the chest
const FLAG = `<g transform="translate(350 714) rotate(-4)"><rect x="-4" y="-4" width="64" height="46" rx="5" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><rect width="56" height="38" rx="3" fill="#D8232F"/>
  <circle cx="28" cy="19" r="12" fill="#FFFFFF"/><circle cx="29" cy="19" r="8.5" fill="#D8232F"/><circle cx="32" cy="19" r="7" fill="#FFFFFF"/>
  <path d="M33 15.5l1.1 2.4 2.6.2-2 1.7.7 2.5-2.4-1.4-2.2 1.4.6-2.5-1.9-1.7 2.6-.2Z" fill="#D8232F"/></g>`;
// colour is laid slightly off the ink lines, like a sketch coloured in by hand
const jersey = (j, i) => `<g class="jersey j${i}" filter="url(#sketch)" stroke-linejoin="round" stroke-linecap="round">
  <path transform="translate(8 6)" d="M124,668 L180,668 Q270,752 360,668 L414,668 Q402,744 430,794 L436,996 L100,996 L108,794 Q136,744 124,668Z" fill="${j.body}"/>
  <path transform="translate(6 5)" d="M180,670 Q270,754 360,670" fill="none" stroke="${j.trim}" stroke-width="18"/>
  <path transform="translate(6 5)" d="M126,672 Q138,744 110,790M412,672 Q400,744 428,790" fill="none" stroke="${j.trim}" stroke-width="15"/>
  <g fill="none" stroke="${INK}">
    <path d="M120,662 L180,662 Q270,748 360,662 L418,662 Q404,742 434,792 L442,1004 L94,1004 L104,792 Q134,742 120,662Z" stroke-width="12"/>
    <path d="M188,690 Q270,768 352,690M132,690 Q144,748 122,800M408,690 Q396,748 420,800" stroke-width="5"/>
    <path d="M150,840 C160,900 150,950 158,990M392,830 C384,890 396,940 388,992M262,962 C268,975 266,985 272,996" stroke-width="5"/>
  </g>
  ${j.flag ? FLAG : ''}
  <text x="272" y="${j.flag ? 822 : 814}" text-anchor="middle" font-family="dkzonnig, Jost, sans-serif" font-size="50" letter-spacing="3" fill="${j.text}" stroke="${j.text === '#FFFFFF' ? INK : '#FFFFFF'}" stroke-width="5" paint-order="stroke">${j.word}</text>
  <text x="276" y="948" text-anchor="middle" font-family="dkzonnig, Jost, sans-serif" font-size="168" fill="${j.shadow}">${j.num}</text>
  <text x="268" y="940" text-anchor="middle" font-family="dkzonnig, Jost, sans-serif" font-size="168" fill="${j.text}" stroke="${INK}" stroke-width="7" paint-order="stroke">${j.num}</text>
</g>`;
// arms hang out of the armholes (shared by every jersey)
const ARMS = `<g fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round">
  <path d="M240,650 C243,672 241,692 245,724M320,650 C317,672 319,692 315,724" stroke-width="9"/>
  <path d="M122,664 C88,668 64,722 60,800 C56,880 54,950 56,1004"/>
  <path class="arm-r" d="M418,664 C452,668 476,722 480,800 C484,880 486,950 484,1004"/>
  <path d="M66,900 C74,906 82,906 90,902M474,900 C466,906 458,906 450,902" stroke-width="5"/></g>`;
// straw hat, drawn in a 40×22 box and scaled onto the head (strokes keep their on-screen width)
const NS = 'vector-effect="non-scaling-stroke"';
const HAT = `<g class="hat"><g filter="url(#sketch)"><g transform="translate(-58 -66) scale(15.8) rotate(-5 20 14)" stroke-linecap="round" stroke-linejoin="round">
  <g transform="translate(.4 .3)">
    <ellipse cx="20" cy="17" rx="19" ry="4.2" fill="#EFC75E"/>
    <path d="M9 16.5C9 7 13 3 20 3s11 4 11 13.5Z" fill="#EFC75E"/>
    <path d="M9.4 12.8 Q20 11.6 30.6 12.8 L30.8 16.4 Q20 15.4 9.2 16.4Z" fill="#D2343F"/>
  </g>
  <g fill="none" stroke="${INK}">
    <path d="M1.2 17.4C1 14.6 9 12.8 20 12.8S39.2 14.4 38.8 17.2 30 21.4 20 21.3 1.4 20.2 1.2 17.4Z" ${NS} stroke-width="3.2"/>
    <path d="M9 16.5C9 7 13 3 20 3s11 4 11 13.5" ${NS} stroke-width="3.2"/>
    <path d="M9.4 12.8 Q20 11.6 30.6 12.8M9.2 16.2 Q20 15.2 30.8 16.2" ${NS} stroke-width="2"/>
    <path d="M13.5 8 Q16 6.6 19 6.4M22.5 6.2 Q25 6.8 26.6 8.4M5 18.6 Q7 19.6 9.5 19.9M30.5 19.9 Q33 19.5 35 18.6M17 19.2 Q20 19.6 23 19.2" ${NS} stroke-width="1.6"/>
  </g>
</g></g></g>`;
// under the hat: a brain full of ideas, with lightning (a nod to my epilepsy). Shown when the hat tips up.
// The bolts fade in once and stay: nothing flashes or flickers.
const BRAIN = `<g class="brain" filter="url(#sketch)" stroke-linecap="round" stroke-linejoin="round">
  <path transform="translate(7 5)" d="M80,222 C58,175 68,112 120,96 C132,56 190,36 232,56 C262,30 322,32 346,62 C392,52 442,88 440,132 C470,162 458,208 440,222Z" fill="#F4A3BB"/>
  <g fill="none" stroke="${INK}">
    <path d="M80,222 C58,175 68,112 120,96 C132,56 190,36 232,56 C262,30 322,32 346,62 C392,52 442,88 440,132 C470,162 458,208 440,222" stroke-width="11"/>
    <path d="M258,50 C248,92 270,130 256,170 C250,190 260,205 256,222" stroke-width="6"/>
    <path d="M72,222 C150,234 370,234 448,222" stroke-width="11"/>
    <path d="M112,140 C134,122 156,148 180,130M104,188 C130,170 154,196 184,180M200,96 C212,80 236,90 230,108M206,150 C222,140 236,160 224,178M296,92 C318,76 344,98 366,86M326,142 C348,126 374,152 404,136M298,192 C320,176 346,198 372,184" stroke-width="5"/>
  </g>
  <g fill="#9EDCF6" stroke="${INK}" stroke-width="5">
    <path class="bolt b1" d="M172,58 L140,122 L166,122 L146,176 L204,104 L175,104 L194,58Z"/>
    <path class="bolt b2" d="M364,70 L338,116 L360,116 L342,164 L396,100 L369,100 L386,70Z"/>
    <path class="bolt b3" d="M266,-14 L252,24 L267,24 L258,52 L288,12 L273,12 L282,-14Z"/>
  </g>
  <path class="bolt b3" d="M58,120 L30,108M466,140 L494,126M108,58 L88,34M414,58 L436,34" fill="none" stroke="#7CC8EA" stroke-width="7"/>
</g>`;

const ink = (d, w = 12) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}"/>`;
const T = 'font-family="dkzonnig, Jost, sans-serif" text-anchor="middle"';

// patterns for the dingri look: striped marinière and the red-white checked scarf
const PATTERNS = `<pattern id="lg-stripes" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#FBFAF6"/><rect width="24" height="9" fill="#1F3A7A"/></pattern>
  <pattern id="lg-kef" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#F3EFE6"/><path d="M0,11 L11,0 L22,11 L11,22Z" fill="none" stroke="#1E1F22" stroke-width="3"/><circle cx="11" cy="11" r="2.4" fill="#1E1F22"/></pattern>
  <pattern id="lg-check" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#F6F1E8"/><rect width="26" height="10" fill="#C42F3A" opacity=".75"/><rect width="10" height="26" fill="#C42F3A" opacity=".75"/></pattern>`;

// ---------- Michigan game day: maize & blue jersey (734 = Ann Arbor's area code) + a foam finger ----------
const UMICH = { word: 'MICHIGAN', num: '734', body: '#0B2D57', trim: '#FFCB05', text: '#FFCB05', shadow: '#5A7BA8' };
const FOAM_FINGER = `<g class="o-umich" stroke-linejoin="round" stroke-linecap="round">
  <path d="M412,668 C462,644 502,626 528,610 L566,614 C526,660 482,708 432,764Z" fill="var(--skin, #FFFFFF)"/>
  ${ink('M412,668 C462,644 502,626 528,610', 11)}
  ${ink('M432,764 C482,708 526,660 566,614', 11)}
  <g transform="translate(548 622) scale(1.3)"><g class="foam">
    <path transform="translate(5 4)" d="M-62,-34 C-74,-70 -76,-110 -70,-150 L-58,-160 L-58,-318 C-58,-350 -10,-350 -10,-318 L-10,-176 C-2,-192 22,-192 28,-176 C34,-192 56,-192 62,-174 C70,-186 86,-178 84,-160 C88,-120 84,-70 70,-34Z" fill="#FFCB05"/>
    <path transform="translate(5 4)" d="M-66,-36 L72,-36 L74,0 L-68,0Z" fill="#0B2D57"/>
    ${ink('M-62,-34 C-74,-70 -76,-110 -70,-150 L-58,-160 L-58,-318 C-58,-350 -10,-350 -10,-318 L-10,-176 C-2,-192 22,-192 28,-176 C34,-192 56,-192 62,-174 C70,-186 86,-178 84,-160 C88,-120 84,-70 70,-34Z', 7)}
    ${ink('M-66,-36 L72,-36 L74,0 L-68,0Z', 7)}
    ${ink('M-10,-176 C-12,-160 -8,-150 -2,-146M28,-176 C26,-162 30,-152 34,-148M62,-174 C60,-160 64,-150 68,-148', 4)}
    <path transform="translate(4 3)" d="M-70,-150 C-96,-150 -104,-118 -90,-100 C-80,-88 -60,-92 -50,-104Z" fill="#FFCB05"/>
    ${ink('M-70,-150 C-96,-150 -104,-118 -90,-100 C-80,-88 -60,-92 -50,-104', 7)}
    <text x="10" y="-62" ${T} font-size="66" fill="#0B2D57">#1</text>
  </g></g>
</g>`;

// ---------- Jumu'ah / Ramadan / Eid: cream jebba with gold embroidery ----------
const JEBBA = `<g class="o-jebba" stroke-linejoin="round" stroke-linecap="round">
  <path transform="translate(8 6)" d="M2,1004 C8,880 16,800 42,742 C72,692 122,668 162,662 L378,662 C418,668 468,692 498,742 C524,800 532,880 538,1004Z" fill="#F4EEDF"/>
  <path d="M60,1000 L70,800M120,1000 L118,760M420,1000 L422,760M480,1000 L470,800" stroke="#E2D7BF" stroke-width="5" fill="none"/>
  <path transform="translate(5 4)" d="M196,664 Q270,704 344,664M206,668 L264,800M334,668 L276,800M270,800 L270,1004M84,744 C120,700 150,680 168,672M456,744 C420,700 390,680 372,672" stroke="#C9A44C" stroke-width="16" fill="none"/>
  <path d="M270,812 L270,1000" stroke="#FBF6E6" stroke-width="4" stroke-dasharray="6 14" fill="none"/>
  <path d="M232,704 l8,-14 l8,14 l-8,14Z M292,704 l8,-14 l8,14 l-8,14Z M262,770 l8,-14 l8,14 l-8,14Z" fill="#C9A44C" stroke="${INK}" stroke-width="3"/>
  <path d="M226,650 L258,694 L270,662Z M314,650 L282,694 L270,662Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>
  ${ink('M0,1004 C6,880 14,800 40,740 C70,690 120,668 160,662 L380,662 C420,668 470,690 500,740 C526,800 534,880 540,1004Z')}
  ${ink('M196,664 Q270,704 344,664M206,668 L264,800 L276,800 L334,668M264,800 L264,1004M276,800 L276,1004', 4)}
</g>`;

// ---------- Tunisian days: dingri (blue work jacket), striped shirt, checked scarf ----------
const DINGRI = `<g class="o-dingri" stroke-linejoin="round" stroke-linecap="round">
  <path transform="translate(8 6)" d="M36,1004 L44,760 Q56,690 140,662 L400,662 Q484,690 496,760 L504,1004Z" fill="#26468F"/>
  <path transform="translate(4 3)" d="M206,664 L334,664 L316,1004 L224,1004Z" fill="url(#lg-stripes)"/>
  ${ink('M34,1004 L42,760 Q54,690 140,662 L400,662 Q486,690 498,760 L506,1004Z')}
  ${ink('M206,664 L246,770 L214,812 L224,1004M334,664 L294,770 L326,812 L316,1004', 7)}
  ${ink('M104,1004 L110,790M436,1004 L430,790M78,930 L108,930M432,930 L462,930', 5)}
  <g transform="translate(0 -22)"><!-- scarf sits a little higher on the neck -->
  <path transform="translate(5 4)" d="M196,770 L262,786 L248,972 L180,962Z M300,786 L362,770 L374,948 L314,958Z" fill="url(#lg-check)"/>
  ${ink('M196,770 L262,786 L248,972 L180,962Z M300,786 L362,770 L374,948 L314,958Z', 7)}
  ${ink('M184,966 l-4,28M200,968 l-2,28M216,970 l0,28M232,972 l2,28M318,958 l-2,28M334,956 l0,28M350,954 l2,28M366,952 l4,28', 4)}
  <path transform="translate(5 4)" d="M126,652 Q270,700 414,652 C432,676 440,712 436,748 Q270,820 104,748 C100,712 108,676 126,652Z" fill="url(#lg-check)"/>
  ${ink('M126,652 Q270,700 414,652 C432,676 440,712 436,748 Q270,820 104,748 C100,712 108,676 126,652Z', 8)}
  ${ink('M118,700 Q270,764 422,700M140,676 Q270,730 400,676M112,726 Q270,792 428,726', 4)}
  </g>
</g>`;

// ---------- Free Palestine: keffiyeh (black-and-white net pattern, zigzag borders) over a dark shirt ----------
const KEFFIYEH = `<g class="o-kef" stroke-linejoin="round" stroke-linecap="round">
  <path transform="translate(8 6)" d="M36,1004 L44,760 Q56,690 140,662 L400,662 Q484,690 496,760 L504,1004Z" fill="#2F3236"/>
  ${ink('M34,1004 L42,760 Q54,690 140,662 L400,662 Q486,690 498,760 L506,1004Z')}
  ${ink('M270,760 L270,1004M104,1004 L110,790M436,1004 L430,790', 5)}
  <circle cx="282" cy="820" r="5" fill="#E9E4DA"/><circle cx="282" cy="900" r="5" fill="#E9E4DA"/><circle cx="282" cy="980" r="5" fill="#E9E4DA"/>
  <g transform="translate(0 -22)"><!-- scarf sits a little higher on the neck -->
  <path transform="translate(5 4)" d="M196,770 L262,786 L248,972 L180,962Z M300,786 L362,770 L374,948 L314,958Z" fill="url(#lg-kef)"/>
  ${ink('M196,770 L262,786 L248,972 L180,962Z M300,786 L362,770 L374,948 L314,958Z', 7)}
  ${ink('M184,966 l-4,28M200,968 l-2,28M216,970 l0,28M232,972 l2,28M318,958 l-2,28M334,956 l0,28M350,954 l2,28M366,952 l4,28', 4)}
  <path transform="translate(5 4)" d="M126,652 Q270,700 414,652 C432,676 440,712 436,748 Q270,820 104,748 C100,712 108,676 126,652Z" fill="url(#lg-kef)"/>
  ${ink('M126,652 Q270,700 414,652 C432,676 440,712 436,748 Q270,820 104,748 C100,712 108,676 126,652Z', 8)}
  ${ink('M118,700 Q270,764 422,700M140,676 Q270,730 400,676M112,726 Q270,792 428,726', 4)}
  <path d="M190,930 l64,10M188,912 l64,10M316,934 l56,-8M314,916 l56,-8" fill="none" stroke="#1E1F22" stroke-width="4"/>
  </g>
</g>`;

// ---------- 2–9 a.m.: hooded pyjamas ----------
const PJ_BODY = `<g class="o-pajama" stroke-linejoin="round" stroke-linecap="round">
  <path transform="translate(8 6)" d="M28,1004 L38,760 Q50,690 140,662 L400,662 Q490,690 502,760 L512,1004Z" fill="#B9D3EE"/>
  <path d="M90,820 l4,8 l8,2 l-8,2 l-4,8 l-4,-8 l-8,-2 l8,-2Z M440,880 l4,8 l8,2 l-8,2 l-4,8 l-4,-8 l-8,-2 l8,-2Z M180,960 l3,6 l6,2 l-6,2 l-3,6 l-3,-6 l-6,-2 l6,-2Z M400,780 l3,6 l6,2 l-6,2 l-3,6 l-3,-6 l-6,-2 l6,-2Z" fill="#FBF6EE"/>
  ${ink('M26,1004 L36,760 Q48,690 140,662 L400,662 Q492,690 504,760 L514,1004Z')}
  ${ink('M100,1004 L106,780M440,1004 L434,780', 5)}
  ${ink('M168,1004 L176,880 L364,880 L372,1004', 6)}
</g>`;
// the hood is pulled tight around the face, covering the chin and lower beard (drawn on top of the head,
// with a hole for the eyes and nose)
const PJ_HOOD = `<g class="o-pajama" filter="url(#sketch)" stroke-linejoin="round" stroke-linecap="round">
  <path transform="translate(6 5)" fill-rule="evenodd" d="M120,652 C40,580 -16,400 24,200 C62,70 160,-6 264,-8 C368,-6 466,70 504,200 C544,400 490,580 412,652 Q266,722 120,652Z M100,330 Q94,318 107,314 Q101,301 114,299 Q109,285 122,284 Q118,270 131,270 Q128,256 140,257 Q138,242 151,245 Q150,230 162,235 Q162,219 173,225 Q174,210 186,216 Q188,201 198,209 Q201,194 211,203 Q215,189 225,198 Q229,184 238,195 Q244,181 252,193 Q259,180 266,192 Q273,180 280,193 Q288,181 294,195 Q303,184 307,198 Q317,189 321,203 Q331,194 334,209 Q344,201 346,216 Q358,210 359,225 Q370,219 370,235 Q382,230 381,245 Q394,242 392,257 Q404,256 401,270 Q414,270 410,284 Q423,285 418,299 Q431,301 425,314 Q438,318 432,330 Q440,342 429,360 Q437,373 425,389 Q432,403 419,417 Q425,432 412,443 Q416,459 403,468 Q406,485 393,492 Q394,509 381,514 Q381,531 368,533 Q367,550 354,551 Q351,567 339,565 Q334,582 322,577 Q316,593 304,586 Q297,600 286,592 Q276,604 266,594 Q256,604 246,592 Q235,600 228,586 Q216,593 210,577 Q198,582 193,565 Q181,567 178,551 Q165,550 164,533 Q151,531 151,514 Q138,509 139,492 Q126,485 129,468 Q116,459 120,443 Q107,432 113,417 Q100,403 107,389 Q95,373 103,360 Q92,342 100,330Z" fill="#B9D3EE"/>
  ${ink('M120,652 C40,580 -16,400 24,200 C62,70 160,-6 264,-8 C368,-6 466,70 504,200 C544,400 490,580 412,652 Q266,722 120,652Z')}
  ${ink('M89,325 L79,321 M103,292 L94,286 M121,261 L113,253 M143,235 L136,225 M167,213 L161,202 M194,196 L189,184 M222,184 L219,172 M251,178 L250,166 M281,178 L282,166 M310,184 L313,172 M338,196 L343,184 M365,213 L371,202 M389,235 L396,225 M411,261 L419,253 M429,292 L438,286 M443,325 L453,321 M436,388 L446,387 M422,446 L431,449 M402,498 L409,504 M375,543 L382,551 M344,577 L348,587 M307,599 L309,610 M266,608 L266,619 M225,599 L223,610 M188,577 L184,587 M157,543 L150,551 M130,498 L123,504 M110,446 L101,449 M96,388 L86,387', 4)}
  ${ink('M100,330 Q94,318 107,314 Q101,301 114,299 Q109,285 122,284 Q118,270 131,270 Q128,256 140,257 Q138,242 151,245 Q150,230 162,235 Q162,219 173,225 Q174,210 186,216 Q188,201 198,209 Q201,194 211,203 Q215,189 225,198 Q229,184 238,195 Q244,181 252,193 Q259,180 266,192 Q273,180 280,193 Q288,181 294,195 Q303,184 307,198 Q317,189 321,203 Q331,194 334,209 Q344,201 346,216 Q358,210 359,225 Q370,219 370,235 Q382,230 381,245 Q394,242 392,257 Q404,256 401,270 Q414,270 410,284 Q423,285 418,299 Q431,301 425,314 Q438,318 432,330 Q440,342 429,360 Q437,373 425,389 Q432,403 419,417 Q425,432 412,443 Q416,459 403,468 Q406,485 393,492 Q394,509 381,514 Q381,531 368,533 Q367,550 354,551 Q351,567 339,565 Q334,582 322,577 Q316,593 304,586 Q297,600 286,592 Q276,604 266,594 Q256,604 246,592 Q235,600 228,586 Q216,593 210,577 Q198,582 193,565 Q181,567 178,551 Q165,550 164,533 Q151,531 151,514 Q138,509 139,492 Q126,485 129,468 Q116,459 120,443 Q107,432 113,417 Q100,403 107,389 Q95,373 103,360 Q92,342 100,330Z', 8)}
  ${ink('M246,604 C240,660 248,740 238,830M286,604 C292,660 284,740 294,830', 6)}
  <circle cx="238" cy="840" r="10" fill="#FBF6EE" stroke="${INK}" stroke-width="5"/><circle cx="294" cy="840" r="10" fill="#FBF6EE" stroke="${INK}" stroke-width="5"/>
</g>`;

// ---------- 0–2 a.m.: tired (red eyes, bags, crow's feet). The pink sits under the ink, the rest on top ----------
const TIRED_UNDER = `<g class="f-tired"><ellipse cx="188" cy="318" rx="40" ry="32" fill="#F7C6C6"/><ellipse cx="348" cy="314" rx="38" ry="30" fill="#F7C6C6"/></g>`;
const TIRED_OVER = `<g class="f-tired" fill="none" stroke-linecap="round" filter="url(#sketch)">
  <path d="M148,318 l14,-4 l8,6M150,334 l14,2M224,328 l-12,-6 l-6,6M310,320 l12,-2 l8,5M386,324 l-12,-4M380,302 l-10,6" stroke="#D2343F" stroke-width="3"/>
  <path d="M146,366 Q196,392 236,352M402,356 Q352,386 312,350" stroke="${INK}" stroke-width="8"/>
  <path d="M132,306 l-16,-8M130,320 l-18,0M132,334 l-16,8M398,300 l12,-8M400,316 l14,0" stroke="${INK}" stroke-width="5"/>
</g>`;

// ---------- 2–9 a.m.: eyes shut (patches in the page colour cover the open eyes) + Zzz ----------
const ASLEEP = `<g class="f-asleep" stroke-linecap="round">
  <ellipse cx="188" cy="319" rx="47" ry="35" fill="var(--face, #FFFFFF)"/><ellipse cx="348" cy="317" rx="44" ry="33" fill="var(--face, #FFFFFF)"/>
  <g filter="url(#sketch)">
    ${ink('M146,308 Q190,346 232,308M306,306 Q348,342 392,306', 10)}
    ${ink('M162,328 l-6,12M190,336 l0,13M216,328 l6,12M322,326 l-6,12M348,334 l0,13M374,326 l6,12', 5)}
    <text x="548" y="200" ${T} font-size="70" fill="#7CC8EA" stroke="${INK}" stroke-width="4" paint-order="stroke">z</text>
    <text x="590" y="120" ${T} font-size="95" fill="#7CC8EA" stroke="${INK}" stroke-width="4" paint-order="stroke">Z</text>
    <text x="626" y="30" ${T} font-size="120" fill="#7CC8EA" stroke="${INK}" stroke-width="5" paint-order="stroke">Z</text>
  </g>
</g>`;

// ---------- chechia for the jebba and dingri looks: the one in the original drawing (its top, normally
// cropped off), coloured red. It sits in the hat group so it still lifts to show the brain. ----------
const chechia = (body) => `<g class="chechia">
  <path d="M46,212 L40,92 Q60,62 92,54 Q250,30 428,48 Q454,58 460,92 L464,212 Q260,224 46,212Z" fill="#B3202F"/>
  <g clip-path="url(#chechia-top)">${body}</g>
</g>`;

// line between the forehead and the brain, on top of the face (appears with the brain when the hat lifts)
const FOREHEAD = `<g class="brain" filter="url(#sketch)" stroke-linecap="round">
  <path d="M84,196 C82,208 80,216 80,226 C150,238 370,238 440,226 C440,216 438,208 436,196Z" fill="#F4A3BB"/>
  <path d="M120,214 C140,206 160,218 182,210M300,212 C320,204 344,216 366,208" fill="none" stroke="${INK}" stroke-width="5"/>
  <path d="M84,194 C82,208 80,216 80,226M436,194 C438,208 440,216 440,226" fill="none" stroke="${INK}" stroke-width="11"/>
  <path d="M66,222 C150,236 370,236 452,222" fill="none" stroke="${INK}" stroke-width="11"/>
</g>`;

const CLIP = '<clipPath id="chechia-top"><rect x="-80" y="-80" width="680" height="294"/></clipPath><clipPath id="no-box"><path d="M-80,205 L600,205 L600,500 L414,500 L398,535 L372,596 L344,628 L228,628 L220,612 L205,590 L178,560 L152,548 L-80,548Z"/></clipPath>';

export function buildCaptain(meSvg) {
  const body = meSvg.slice(meSvg.indexOf('>', meSvg.indexOf('<svg')) + 1, meSvg.lastIndexOf('</svg>'));
  const inkOnly = body.replace(/<path[^>]*var\(--logo-(bg|fill)[^>]*\/>/g, '');
  const neck = ARMS.split('\n')[1];  // the two neck lines
  const armsOnly = ARMS.replace(neck + '\n', '');
  // The wobble filter sits on each piece separately (not on the whole outfit), so when the jerseys
  // crossfade only the fading jersey is redrawn; the neck and arms stay still and sharp.
  const clothes = `<g transform="translate(0 -30)">
    <g filter="url(#sketch)"><path d="M236,640 L245,730 L315,730 L324,640Z" fill="var(--skin, #FFFFFF)"/>
    <g fill="none" stroke="${INK}" stroke-linecap="round">${neck}</g></g>
    <g class="o-arms" filter="url(#sketch)"><path d="M122,664 C88,668 64,722 60,800 C56,880 54,950 56,1004 L94,1004 L104,792 Q134,742 120,662Z" fill="var(--skin, #FFFFFF)"/><path class="arm-r" d="M418,664 C452,668 476,722 480,800 C484,880 486,950 484,1004 L442,1004 L434,792 Q404,742 418,662Z" fill="var(--skin, #FFFFFF)"/>${armsOnly}</g>
    <g class="o-jerseys">${JERSEYS.map(jersey).join('')}</g>
    <g class="o-umich" filter="url(#sketch)">${jersey(UMICH, 'u').replace('class="jersey ju" filter="url(#sketch)"', 'class="umich-shirt"')}</g>
    <g filter="url(#sketch)">${JEBBA}${DINGRI}${KEFFIYEH}${PJ_BODY}</g>
  </g>`;
  const hat = HAT.replace('<g class="hat"><g filter="url(#sketch)">', '<g class="hat"><g class="straw" filter="url(#sketch)">')
                 .replace(/<\/g><\/g><\/g>$/, `</g></g>${chechia(inkOnly)}</g>`);
  return meSvg
    .replace(/viewBox="[^"]*"/, 'viewBox="-70 -40 657 1022"')
    .replace(/(<svg[^>]*>)/, `$1<defs>${SKETCH}${PATTERNS}${CLIP}</defs>${clothes}${BRAIN}${TIRED_UNDER}<g clip-path="url(#no-box)">`)
    .replace('</svg>', `</g>${FOREHEAD}${PJ_HOOD}${TIRED_OVER}${ASLEEP}${hat}<g filter="url(#sketch)" transform="translate(0 -30)">${FOAM_FINGER}</g></svg>`);
}
