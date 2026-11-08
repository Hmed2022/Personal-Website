// Tunisian ornament patterns as CSS background values (inline SVG data URIs).
// Colours: Sidi Bou Said blue, terracotta, ochre, olive green and lime-wash cream.
export const TN = {
	blue: '#1E5B8C',
	terracotta: '#B5523B',
	ochre: '#D9A441',
	green: '#2E6B4F',
	cream: '#F6EBD3',
};

const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`;

// Zellige tile: an eight-pointed star (khatam) with a lattice joining it to its neighbours,
// like the ceramic walls of Tunisian houses and mosques.
export const zellige = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
  <path d='M40 0V17.4M40 62.6V80M0 40H17.4M62.6 40H80M0 0L24 24M80 0L56 24M0 80L24 56M80 80L56 56'
        stroke='${TN.terracotta}' stroke-width='1.4' fill='none'/>
  <g transform='translate(40 40)'>
    <rect x='-16' y='-16' width='32' height='32' fill='${TN.blue}'/>
    <rect x='-16' y='-16' width='32' height='32' fill='${TN.blue}' transform='rotate(45)'/>
    <rect x='-8.5' y='-8.5' width='17' height='17' fill='${TN.ochre}'/>
    <rect x='-8.5' y='-8.5' width='17' height='17' fill='${TN.ochre}' transform='rotate(45)'/>
    <circle r='3.6' fill='${TN.terracotta}'/>
  </g>
  <g fill='${TN.green}'>
    <path d='M0 -9L9 0L0 9L-9 0Z'/><path d='M80 -9L89 0L80 9L71 0Z'/>
    <path d='M0 71L9 80L0 89L-9 80Z'/><path d='M80 71L89 80L80 89L71 80Z'/>
  </g>
</svg>`);

// Very faint zellige for the whole page background (same tile, drawn at low opacity).
export const zelligeFaint = zellige.replace(
	encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>"),
	encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g opacity='.035'>")
).replace(encodeURIComponent('</svg>'), encodeURIComponent('</g></svg>'));

// A centred star between two thin lines, used above every chapter heading.
export const divider = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='240' height='24' viewBox='0 0 240 24'>
  <path d='M0 12H96M144 12H240' stroke='${TN.ochre}' stroke-width='1.5'/>
  <circle cx='88' cy='12' r='2' fill='${TN.terracotta}'/><circle cx='152' cy='12' r='2' fill='${TN.terracotta}'/>
  <g transform='translate(120 12)'>
    <rect x='-8' y='-8' width='16' height='16' fill='${TN.blue}'/>
    <rect x='-8' y='-8' width='16' height='16' fill='${TN.blue}' transform='rotate(45)'/>
    <circle r='3.4' fill='${TN.ochre}'/>
  </g>
</svg>`);

// Ceramic border band (repeat-x), like a row of Qallaline tiles.
export const frieze = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='36' height='18' viewBox='0 0 36 18'>
  <rect width='36' height='18' fill='${TN.blue}'/>
  <rect width='36' height='2' fill='${TN.ochre}'/><rect y='16' width='36' height='2' fill='${TN.ochre}'/>
  <path d='M18 3.5L26.5 9L18 14.5L9.5 9Z' fill='${TN.cream}'/>
  <circle cx='18' cy='9' r='2.3' fill='${TN.terracotta}'/>
  <path d='M0 4.5L4.5 9L0 13.5Z M36 4.5L31.5 9L36 13.5Z' fill='${TN.green}'/>
</svg>`);

// A single eight-pointed star rosette (for corners and dividers).
export const star = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='-30 -30 60 60'>
  <rect x='-19' y='-19' width='38' height='38' fill='${TN.blue}'/>
  <rect x='-19' y='-19' width='38' height='38' fill='${TN.blue}' transform='rotate(45)'/>
  <rect x='-13' y='-13' width='26' height='26' fill='${TN.cream}'/>
  <rect x='-13' y='-13' width='26' height='26' fill='${TN.cream}' transform='rotate(45)'/>
  <rect x='-8' y='-8' width='16' height='16' fill='${TN.terracotta}'/>
  <rect x='-8' y='-8' width='16' height='16' fill='${TN.terracotta}' transform='rotate(45)'/>
  <circle r='3.5' fill='${TN.ochre}'/>
</svg>`);
