// Tunisian ornament patterns as CSS background values (inline SVG data URIs).
// Colours: Sidi Bou Said blue, terracotta, ochre, olive green and lime-wash cream.
export const TN = {
	blue: '#1E5B8C',
	terracotta: '#B5523B',
	ochre: '#D9A441',
	green: '#2E6B4F',
	cream: '#F6EBD3',
	// Qallaline tiles
	cobalt: '#24409A',
	sky: '#6BB6E3',
	tileGreen: '#1E7B4F',
	leaf: '#7DBF7A',
	yellow: '#E3A72A',
	glaze: '#FFFDF7',
	grout: '#E9DFCB',
};

const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`;

// eight-pointed star (khatam) made of two squares; s = half the side
const khatam = (s, fill) =>
	`<rect x='${-s}' y='${-s}' width='${2 * s}' height='${2 * s}' fill='${fill}'/><rect x='${-s}' y='${-s}' width='${2 * s}' height='${2 * s}' fill='${fill}' transform='rotate(45)'/>`;

// a star tile: navy corners, a big light star, a white star, a small dark star
const starTile = (x, y, light, dark) => `
  <g transform='translate(${x} ${y})'>
    <rect width='80' height='80' fill='${TN.glaze}'/>
    <path d='M0 0H20L0 20Z M80 0H60L80 20Z M0 80H20L0 60Z M80 80H60L80 60Z' fill='${dark}'/>
    <g transform='translate(40 40)'>${khatam(25, light)}${khatam(16, TN.glaze)}${khatam(9, dark)}<circle r='2.6' fill='${TN.glaze}'/></g>
  </g>`;

// a lattice tile: diamonds on the corners and edges, small stars in between
const diamondTile = (x, y, c) => {
	const d = (cx, cy) => `<path d='M${cx} ${cy - 12}L${cx + 12} ${cy}L${cx} ${cy + 12}L${cx - 12} ${cy}Z' fill='${c}'/>`;
	const st = (cx, cy) => `<g transform='translate(${cx} ${cy})'>${khatam(5, c)}</g>`;
	return `
  <g transform='translate(${x} ${y})'>
    <rect width='80' height='80' fill='${TN.glaze}'/>
    ${d(0, 0)}${d(40, 0)}${d(80, 0)}${d(0, 40)}${d(40, 40)}${d(80, 40)}${d(0, 80)}${d(40, 80)}${d(80, 80)}
    ${st(20, 20)}${st(60, 20)}${st(20, 60)}${st(60, 60)}
  </g>`;
};

// Tile wall: a 2 x 2 block of Qallaline tiles (blue star, yellow lattice, green lattice, green star)
// with cream grout lines, repeated across the background.
export const zellige = url(`
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>
  <defs><clipPath id='c'><rect width='160' height='160'/></clipPath></defs>
  <g clip-path='url(#c)'>
    ${starTile(0, 0, TN.sky, TN.cobalt)}
    ${diamondTile(80, 0, TN.yellow)}
    ${diamondTile(0, 80, TN.tileGreen)}
    ${starTile(80, 80, TN.leaf, TN.cobalt)}
    <path d='M0 0H160M0 80H160M0 160H160M0 0V160M80 0V160M160 0V160' stroke='${TN.grout}' stroke-width='3'/>
  </g>
</svg>`);

// Very faint tile wall for the whole page background (same tiles, drawn at low opacity).
export const zelligeFaint = zellige.replace(
	encodeURIComponent("<g clip-path='url(#c)'>"),
	encodeURIComponent("<g clip-path='url(#c)' opacity='.05'>")
);

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
