// Tunisia "drawn from memory": the same loose, smooth borders as Dali's map (LandmarksMap.svelte),
// for any projection. freehandFor(projection)(feature) -> SVG path string.
import { line, curveCatmullRom, curveCatmullRomClosed } from 'd3-shape';
import Tun from '../Map/Data/Tunisia.geojson.json';

export function freehandFor(projection) {
  // Drawn from memory: borders are simplified hard and redrawn as smooth curves. Neighbouring
  // governorates share their borders, so each stretch of border (between two points where borders
  // meet) is simplified and curved once, the same way for both sides: no gaps, no overlaps.
  const SIMPLIFY = 0.11;   // degrees; bigger = blobbier
  function rdp(pts, eps) {
    if (pts.length < 3) return pts;
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
    let max = 0, idx = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i];
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
      const dist = len ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len : Math.hypot(px - ax, py - ay);
      if (dist > max) { max = dist; idx = i; }
    }
    if (max <= eps) return [pts[0], pts[pts.length - 1]];
    return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
  }
  const polysOf = (f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);
  const KEY = (c) => c[0].toFixed(6) + ',' + c[1].toFixed(6);
  const owners = new Map();   // point -> governorates that use it
  Tun.features.forEach((f, fi) => polysOf(f).forEach((poly) => poly.forEach((r) => r.forEach((c) => {
    const k = KEY(c); if (!owners.has(k)) owners.set(k, new Set()); owners.get(k).add(fi);
  }))));
  const sig = (c) => [...owners.get(KEY(c))].sort().join('|');
  // split a ring at the points where the set of neighbours changes
  function segmentsOf(r) {
    const pts = r.slice(0, -1), n = pts.length;
    const junction = pts.map((c, i) => { const s0 = sig(c); return owners.get(KEY(c)).size > 2 || s0 !== sig(pts[(i - 1 + n) % n]) || s0 !== sig(pts[(i + 1) % n]); });
    const start = junction.indexOf(true);
    if (start < 0) return null;   // an island or a ring with no neighbours: draw it as one closed loop
    const segs = []; let cur = [pts[start]];
    for (let k = 1; k <= n; k++) { const i = (start + k) % n; cur.push(pts[i]); if (junction[i]) { segs.push(cur); cur = [pts[i]]; } }
    return segs;
  }
  // simplify in one fixed direction so both neighbours get exactly the same points
  function simplifySeg(seg) {
    const flip = KEY(seg[0]) > KEY(seg[seg.length - 1]);
    const a = flip ? [...seg].reverse() : seg;
    const out = rdp(a, SIMPLIFY);
    return flip ? out.reverse() : out;
  }
  const open = line().curve(curveCatmullRom.alpha(0.5));
  const closed = line().curve(curveCatmullRomClosed.alpha(0.5));
  function freehand(f) {
    return polysOf(f).map((poly) => poly.map((r) => {
      const segs = segmentsOf(r);
      if (!segs) {
        let pts = rdp(r, SIMPLIFY / 2).slice(0, -1);
        if (pts.length < 4) pts = r.filter((_, i) => i % Math.max(1, Math.floor(r.length / 6)) === 0);
        return closed(pts.map((p) => projection(p)));
      }
      return segs.map((seg, i) => {
        const d = open(simplifySeg(seg).map((p) => projection(p)));
        return i === 0 ? d : d.replace(/^M/, 'L');
      }).join('') + 'Z';
    }).join('')).join('');
  }
  return freehand;
}
