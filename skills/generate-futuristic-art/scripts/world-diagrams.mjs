/**
 * Original fictional world studies. No dependency, network or physical solver.
 * Geometry is reproducible from the generator version, study, seed and controls.
 * Antialgorithm informs the creative review process, not these algorithms.
 */
export const GENERATOR_VERSION = '1.0.0';
const WIDTH = 1440;
const HEIGHT = 1000;
const TAU = Math.PI * 2;
const SOURCE = 'Original procedural study; creative-process reference: mankidev/antialgorithm at 766e30411195a9198afad38f3d76e08701ed4516';
const FICTION = 'Fictional design. Fields, dimensions and engineering behavior are illustrative; no physical simulation or validated performance.';

function freeze(value) {
  for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item);
  return Object.freeze(value);
}

export const STUDIES = freeze([
  {
    id: 'vascular-drive',
    title: 'Contractile drive',
    description: 'A longitudinal propulsion section: branching circulation becomes a laminated pressure hull and a focused exhaust throat.',
    defaults: { load: 0.72, branches: 7, fusion: 0.68 },
    controls: [
      { key: 'load', label: 'Relative energy load', min: 0, max: 1, step: 0.01 },
      { key: 'branches', label: 'Circulation branches', min: 3, max: 9, step: 1 },
      { key: 'fusion', label: 'Material convergence', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    id: 'grafted-span',
    title: 'Joined watersheds',
    description: 'A landscape section through a monumental bridge: grown mineral ribs meet a manufactured deck over a deep watershed.',
    defaults: { growth: 0.64, bays: 9, load: 0.56 },
    controls: [
      { key: 'growth', label: 'Grown span extent', min: 0, max: 1, step: 0.01 },
      { key: 'bays', label: 'Structural bays', min: 5, max: 13, step: 1 },
      { key: 'load', label: 'Relative load expression', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    id: 'climate-shell',
    title: 'The breathing hemisphere',
    description: 'An orbital cutaway: mineral shell petals, controllable weather seams and ocean-facing exchange ducts form one planetary system.',
    defaults: { aperture: 0.38, plates: 7, circulation: 0.62 },
    controls: [
      { key: 'aperture', label: 'Weather-seam aperture', min: 0, max: 1, step: 0.01 },
      { key: 'plates', label: 'Shell petals', min: 4, max: 9, step: 1 },
      { key: 'circulation', label: 'Relative circulation', min: 0, max: 1, step: 0.01 },
    ],
  },
]);

const f = n => Number(n.toFixed(2));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const attrs = values => Object.entries(values).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
const element = (name, values, content = '') => `<${name} ${attrs(values)}>${content}</${name}>`;
const path = (d, values = {}) => element('path', { d, ...values });
const line = (x1, y1, x2, y2, values = {}) => element('line', { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), ...values });
const circle = (cx, cy, r, values = {}) => element('circle', { cx: f(cx), cy: f(cy), r: f(r), ...values });
const rect = (x, y, width, height, values = {}) => element('rect', { x: f(x), y: f(y), width: f(width), height: f(height), ...values });
const text = (x, y, content, values = {}) => element('text', { x: f(x), y: f(y), ...values }, esc(content));
const group = (id, contents, values = {}) => element('g', { id, ...values }, contents.join(''));
const polar = (cx, cy, r, a) => [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))];
const pt = p => p.join(' ');
function arc(cx, cy, r, a, b) {
  return `M ${pt(polar(cx, cy, r, a))} A ${f(r)} ${f(r)} 0 ${b - a > Math.PI ? 1 : 0} 1 ${pt(polar(cx, cy, r, b))}`;
}
function ringSegment(cx, cy, inner, outer, a, b) {
  return `${arc(cx, cy, outer, a, b)} L ${pt(polar(cx, cy, inner, b))} A ${f(inner)} ${f(inner)} 0 ${b - a > Math.PI ? 1 : 0} 0 ${pt(polar(cx, cy, inner, a))} Z`;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function polyline(points, values = {}) {
  return element('polyline', { points: points.map(p => p.map(f).join(',')).join(' '), fill: 'none', ...values });
}
function label(x, y, heading, detail, color) {
  return text(x, y, heading, { class: 'label', fill: color }) + text(x, y + 26, detail, { class: 'note', fill: color });
}
function footer(palette, seed, legend) {
  return group('precision-footer', [
    line(60, 918, 1380, 918, { stroke: palette.line }),
    text(60, 950, legend, { class: 'note', fill: palette.muted }),
    text(60, 976, 'Fictional systems · illustrative fields · no physical simulation', { class: 'note', fill: palette.muted }),
    text(1380, 950, `SEED ${seed} / V${GENERATOR_VERSION}`, { class: 'mono', fill: palette.muted, 'text-anchor': 'end' }),
  ], { 'data-rough': 'off' });
}
function header(index, title, subtitle, p) {
  return group('precision-header', [
    text(60, 48, `FUTURE ANATOMIES / ${index}`, { class: 'eyebrow', fill: p.muted }),
    text(60, 103, title, { class: 'title', fill: p.text }),
    text(60, 138, subtitle, { class: 'subtitle', fill: p.muted }),
    line(60, 161, 1380, 161, { stroke: p.line }),
  ], { 'data-rough': 'off' });
}

function vascularDrive(p, seed, random) {
  const c = { bg: '#111922', text: '#f4e6d1', muted: '#b9bcb9', line: '#445158', cool: '#799c9b', warm: '#ef8259', hot: '#ffe7ad' };
  const parts = [];
  const defs = `<linearGradient id="drive-hull" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#536364"/><stop offset="0.46" stop-color="#28383f"/><stop offset="1" stop-color="#17262e"/></linearGradient><radialGradient id="drive-field"><stop stop-color="#fff0bd"/><stop offset="0.3" stop-color="#e99861"/><stop offset="0.72" stop-color="#974737"/><stop offset="1" stop-color="#321f25"/></radialGradient><linearGradient id="drive-exhaust"><stop stop-color="#ffcf8b"/><stop offset="1" stop-color="#ef8259" stop-opacity="0"/></linearGradient>`;
  parts.push(header('01', 'CONTRACTILE DRIVE', 'Longitudinal section / circulation becomes pressure structure', c));
  const grid = [];
  for (let x = 80; x <= 1060; x += 70) grid.push(line(x, 260, x, 744, { stroke: '#293640', 'stroke-width': 1 }));
  for (let y = 260; y <= 744; y += 70) grid.push(line(80, y, 1060, y, { stroke: '#293640', 'stroke-width': 1 }));
  grid.push(line(80, 492, 1080, 492, { stroke: '#53615f', 'stroke-dasharray': '10 8' }));
  parts.push(group('section-grid', grid));
  // A longitudinal casing, deliberately cropped open along the lower edge.
  const hull = [];
  hull.push(path('M 132 482 C 208 398 298 324 448 303 C 613 279 753 317 864 371 L 996 427 L 1042 459 L 1018 533 L 931 569 C 798 635 616 677 434 649 C 288 628 218 554 132 482 Z', { fill: 'url(#drive-hull)', stroke: '#88918a', 'stroke-width': 2 }));
  hull.push(path('M 170 482 C 282 406 378 361 535 353 C 681 346 795 376 908 426 L 987 457 L 974 526 L 888 557 C 749 607 628 625 466 598 C 337 576 247 531 170 482 Z', { fill: '#151f28', stroke: '#6c786e', 'stroke-width': 2 }));
  const plates = 14;
  for (let i = 0; i < plates; i++) {
    const x = 260 + i * 46;
    const t = i / (plates - 1);
    const y = 310 + 100 * Math.pow((t - 0.35) * 1.8, 2);
    const off = (random() - 0.5) * 8;
    hull.push(path(`M ${f(x - 24)} ${f(y + 34)} L ${f(x + 10)} ${f(y + off)} L ${f(x + 43)} ${f(y + 5)} L ${f(x + 21)} ${f(y + 53)} Z`, { fill: i % 3 === 0 ? '#65736d' : '#465955', stroke: '#9a9f88', 'stroke-width': 1.25 }));
    hull.push(line(x + 5, y + 13, x + 23, y + 26, { stroke: '#acb29a', 'stroke-width': 1 }));
  }
  for (let i = 0; i < 16; i++) {
    const x = 355 + i * 35;
    const y = 603 + Math.sin(i / 15 * Math.PI) * 39;
    hull.push(path(`M ${f(x)} ${f(y)} l 20 -17 l 17 11 l -19 19 Z`, { fill: '#364b4b', stroke: '#7a8d81', 'stroke-width': 1 }));
  }
  parts.push(group('laminated-pressure-hull', hull));
  const field = [];
  const radius = 48 + p.load * 41;
  field.push(element('ellipse', { cx: 813, cy: 484, rx: 96, ry: 112, fill: '#503c38', stroke: '#cf9868', 'stroke-width': 3 }));
  field.push(element('ellipse', { cx: 813, cy: 484, rx: f(radius * 0.76), ry: f(radius), fill: 'url(#drive-field)', opacity: f(p.load) }));
  for (let i = 1; i <= 6; i++) {
    const r = radius * (i / 6);
    field.push(element('ellipse', { cx: 813, cy: 484, rx: f(r * 0.76), ry: f(r), fill: 'none', stroke: i % 2 ? '#efad7c' : '#eac992', opacity: f(p.load * 0.7), 'stroke-width': 1 }));
  }
  for (let i = 0; i < 20; i++) {
    const a = i / 20 * TAU;
    field.push(line(813 + Math.cos(a) * 84, 484 + Math.sin(a) * 100, 813 + Math.cos(a) * 95, 484 + Math.sin(a) * 112, { stroke: c.hot, 'stroke-width': 2 }));
  }
  parts.push(group('synthetic-energy-field', field, { 'data-relative-load': p.load }));
  const vessels = [];
  const root = [215, 482];
  for (let i = 0; i < p.branches; i++) {
    const t = p.branches === 1 ? 0.5 : i / (p.branches - 1);
    const y = 385 + t * 198;
    const y2 = 414 + t * 142;
    const amp = (t - 0.5) * (75 + p.fusion * 66);
    const bend = 16 + random() * 16;
    const d = `M ${pt(root)} C 306 ${f(482 + amp)} 328 ${f(y - bend)} 425 ${f(y)} C 532 ${f(y + p.fusion * amp * 0.3)} 637 ${f(y2)} 743 ${f(y2)}`;
    vessels.push(path(d, { fill: 'none', stroke: '#572e2b', 'stroke-width': 15 + p.load * 5, 'stroke-linecap': 'round' }));
    vessels.push(path(d, { fill: 'none', stroke: i % 2 ? '#c36a52' : '#da9269', 'stroke-width': 5 + p.load * 5, 'stroke-linecap': 'round' }));
    // Sub-branches become progressively aligned with the fabricated channel.
    const joinX = 370 + p.fusion * 185;
    vessels.push(path(`M ${f(joinX)} ${f(y + amp * 0.2)} Q ${f(joinX - 35)} ${f(y - 35)} ${f(joinX - 82)} ${f(y - 29)}`, { fill: 'none', stroke: '#8da08e', 'stroke-width': 2 }));
    for (let j = 0; j < 7; j++) {
      const x = 500 + j * 31;
      const sy = y + (y2 - y) * ((x - 425) / 318);
      vessels.push(line(x, sy - 11, x + 5 + p.fusion * 6, sy + 11, { stroke: '#e3bb91', 'stroke-width': 1, opacity: 0.62 }));
    }
    vessels.push(circle(743, y2, 4, { fill: c.hot }));
  }
  vessels.push(path('M 130 480 L 174 458 L 216 472 L 242 487 L 216 504 L 172 506 Z', { fill: '#9fa18a', stroke: '#d4cfb1', 'stroke-width': 1.5 }));
  parts.push(group('circulation-branches', vessels, { 'data-branch-count': p.branches, 'data-material-convergence': p.fusion }));
  const nozzle = [];
  nozzle.push(path('M 885 440 L 944 458 L 980 448 L 1036 431 L 1037 538 L 980 522 L 945 511 L 885 527 Z', { fill: '#30383d', stroke: '#c2b593', 'stroke-width': 2 }));
  nozzle.push(path('M 888 469 L 955 480 L 1047 465 L 1080 478 L 1080 496 L 1047 507 L 955 496 L 888 501 Z', { fill: 'url(#drive-exhaust)', opacity: f(p.load) }));
  for (let i = 0; i < 8; i++) nozzle.push(line(920 + i * 13, 445 + i * 0.5, 920 + i * 13, 528 - i * 0.4, { stroke: '#b3a587', 'stroke-width': 1 }));
  parts.push(group('exhaust-throat', nozzle));
  const craft = [];
  craft.push(path('M 634 243 L 650 236 L 681 242 L 687 248 L 648 251 Z', { fill: '#d7d7c2', stroke: '#1b2930', 'stroke-width': 1 }));
  craft.push(line(655, 252, 655, 270, { stroke: '#98a79c', 'stroke-dasharray': '3 4' }));
  parts.push(group('scale-craft', craft));
  const labels = [];
  labels.push(label(95, 210, '01 / COLLECTION TISSUE', 'Distributed intake and repair', c.text));
  labels.push(polyline([[245, 248], [245, 303], [210, 438]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(label(425, 705, '02 / CONVERGENCE ZONE', 'Circulation becomes pressure structure', c.text));
  labels.push(polyline([[553, 655], [553, 671], [465, 684]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(label(785, 213, '03 / PULSE CHAMBER', 'Nested exchange surfaces', c.text));
  labels.push(polyline([[830, 252], [830, 320], [813, 367]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(text(657, 291, 'Maintenance craft', { class: 'note', fill: c.muted, 'text-anchor': 'middle' }));
  labels.push(text(1053, 572, 'THROAT', { class: 'mono', fill: c.muted, 'text-anchor': 'end' }));
  labels.push(line(1035, 545, 1053, 549, { stroke: c.muted }));
  parts.push(group('precision-callouts', labels, { 'data-rough': 'off' }));
  const rail = [];
  rail.push(line(1120, 195, 1120, 754, { stroke: c.line }));
  rail.push(text(1150, 218, 'ENERGY PATH', { class: 'label', fill: c.text }));
  const steps = [['01', 'Gather', 'Parallel living channels'], ['02', 'Compress', 'Shared wall / shared flow'], ['03', 'Expel', 'Directed fictional drive']];
  steps.forEach((s, i) => {
    const y = 272 + i * 106;
    rail.push(text(1150, y, s[0], { class: 'mono', fill: c.warm }));
    rail.push(text(1194, y, s[1], { class: 'subtitle', fill: c.text }));
    rail.push(text(1150, y + 29, s[2], { class: 'note', fill: c.muted }));
    if (i < 2) rail.push(line(1160, y + 43, 1160, y + 76, { stroke: c.line }));
  });
  rail.push(text(1150, 600, 'RELATIVE FIELD', { class: 'label', fill: c.text }));
  rail.push(text(1150, 629, 'Illustrative energy density', { class: 'note', fill: c.muted }));
  ['#34545d', '#9d4f40', '#ef9564', '#ffe2a0'].forEach((fill, i) => rail.push(rect(1150 + i * 53, 648, 49, 14, { fill })));
  rail.push(text(1150, 689, '0.00', { class: 'mono', fill: c.muted }));
  rail.push(text(1358, 689, '1.00', { class: 'mono', fill: c.muted, 'text-anchor': 'end' }));
  rail.push(text(1150, 733, 'Kilometre-class intent', { class: 'note', fill: c.text }));
  parts.push(group('precision-energy-key', rail, { 'data-rough': 'off' }));
  const readout = [];
  const items = [[60, 'RELATIVE LOAD', p.load.toFixed(2), 'Field intensity / synthetic'], [500, 'CIRCULATION', `${p.branches} branches`, 'Parallel paths into one chamber'], [940, 'CONVERGENCE', p.fusion.toFixed(2), 'Curvature and alignment coupling']];
  items.forEach(([x, name, val, detail]) => {
    readout.push(line(x, 794, x + 395, 794, { stroke: c.line }));
    readout.push(text(x, 823, name, { class: 'eyebrow', fill: c.muted }));
    readout.push(text(x, 861, val, { class: 'readout', fill: c.text }));
    readout.push(text(x, 890, detail, { class: 'note', fill: c.muted }));
  });
  parts.push(group('precision-parameters', readout, { 'data-rough': 'off' }));
  parts.push(footer(c, seed, 'Section view · craft supplies scale contrast · geometry is schematic'));
  return { defs, body: parts.join(''), palette: c };
}

function graftedSpan(p, seed, random) {
  const c = { bg: '#f0ece2', text: '#283d3b', muted: '#526561', line: '#a9b1a3', mineral: '#2b736c', load: '#b66637' };
  const parts = [];
  const defs = `<linearGradient id="span-water" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b1c6b7"/><stop offset="1" stop-color="#e1e5d8"/></linearGradient>`;
  parts.push(header('02', 'JOINED WATERSHEDS', 'Landscape section / a grown skeleton carries a manufactured deck', c));
  const terrain = [];
  terrain.push(path('M 60 413 L 101 423 L 155 437 L 192 453 L 221 502 L 250 584 L 276 626 L 299 735 L 337 803 L 60 803 Z', { fill: '#d4d7c5', stroke: '#8d9c8f', 'stroke-width': 1.5 }));
  terrain.push(path('M 1380 399 L 1319 411 L 1275 440 L 1236 458 L 1208 527 L 1188 605 L 1148 652 L 1112 722 L 1076 803 L 1380 803 Z', { fill: '#d4d7c5', stroke: '#8d9c8f', 'stroke-width': 1.5 }));
  for (let i = 0; i < 12; i++) {
    const y = 464 + i * 28;
    const wiggle = random() * 14;
    terrain.push(path(`M 61 ${y} Q 135 ${f(y - wiggle)} ${f(210 + i * 9)} ${f(y + 17)}`, { fill: 'none', stroke: '#a8b29b', 'stroke-width': 1 }));
    terrain.push(path(`M ${f(1235 - i * 12)} ${f(y + 20)} Q 1310 ${f(y - wiggle)} 1379 ${y}`, { fill: 'none', stroke: '#a8b29b', 'stroke-width': 1 }));
  }
  terrain.push(path('M 296 744 C 461 702 594 782 769 744 C 917 712 997 747 1120 727 L 1076 803 L 337 803 Z', { fill: 'url(#span-water)' }));
  for (let i = 0; i < 4; i++) terrain.push(path(`M ${320 + i * 19} ${755 + i * 10} C 550 ${727 + i * 14} 739 ${795 - i * 9} ${1090 - i * 20} ${747 + i * 11}`, { fill: 'none', stroke: '#729c8f', 'stroke-width': 1, opacity: 0.5 }));
  terrain.push(line(60, 804, 1380, 804, { stroke: c.line }));
  parts.push(group('watershed-section', terrain));
  const structure = [];
  const x0 = 184, x1 = 1256, deckY = 438, span = x1 - x0;
  const archY = x => 472 + (125 + p.load * 24) * Math.sin(((x - x0) / span) * Math.PI);
  const boundary = x0 + span * p.growth;
  // Structural channels and outer load path are deliberately schematic.
  structure.push(path(`M ${x0} ${deckY + 9} Q 720 ${f(760 + p.load * 40)} ${x1} ${deckY + 9}`, { fill: 'none', stroke: '#94ada0', 'stroke-width': 19, 'stroke-linecap': 'round' }));
  const bottomPoints = [];
  for (let i = 0; i <= 36; i++) { const x = x0 + span * i / 36; bottomPoints.push([x, archY(x)]); }
  structure.push(polyline(bottomPoints, { stroke: c.mineral, 'stroke-width': 12 + p.load * 5 }));
  for (let i = 0; i < p.bays; i++) {
    const a = x0 + span * i / p.bays;
    const b = x0 + span * (i + 1) / p.bays;
    const mid = (a + b) / 2;
    const grown = Math.max(0, Math.min(1, (boundary - a) / (b - a)));
    const endY = archY(mid);
    const y0 = deckY + 10;
    const drop = endY - y0;
    // Zero growth produces exact straight fabricated members. Growth bends the
    // same load path into continuous ribs, without changing its end joints.
    const c1x = a + (mid - a) * (1 / 3 - grown * 0.18);
    const c2x = a + (mid - a) * (2 / 3 - grown * 0.17);
    const c1y = y0 + drop * (1 / 3 + grown * 0.25);
    const c2y = y0 + drop * (2 / 3 + grown * 0.25);
    structure.push(path(`M ${f(a)} ${y0} C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(mid)} ${f(endY)} C ${f(b - (c2x - a))} ${f(c2y)} ${f(b - (c1x - a))} ${f(c1y)} ${f(b)} ${y0}`, { fill: 'none', stroke: grown > 0.05 ? '#356e65' : '#546562', 'stroke-width': 5 + p.load * 5, 'stroke-linejoin': 'round' }));
    structure.push(line(mid, deckY + 14, mid, endY - 6, { stroke: grown > 0.05 ? '#97a48a' : '#8a9390', 'stroke-width': 2 }));
    if (grown > 0.01) {
      structure.push(path(`M ${f(mid)} ${f(endY)} C ${f(mid - 25 * grown)} ${f(endY - 32)} ${f(a + 15)} ${deckY + 65} ${f(a + 8)} ${deckY + 29}`, { fill: 'none', stroke: '#8ba489', 'stroke-width': 2.5 }));
      structure.push(path(`M ${f(mid)} ${f(endY)} C ${f(mid + 25 * grown)} ${f(endY - 32)} ${f(b - 15)} ${deckY + 65} ${f(b - 8)} ${deckY + 29}`, { fill: 'none', stroke: '#8ba489', 'stroke-width': 2.5 }));
    } else {
      structure.push(circle(a, deckY + 11, 5, { fill: c.bg, stroke: '#52645e', 'stroke-width': 2 }));
    }
  }
  for (const side of [-1, 1]) {
    const sx = side === -1 ? x0 : x1;
    for (let i = 0; i < 9; i++) {
      const tx = sx + side * (30 + i * 10);
      const ty = 539 + i * 25;
      structure.push(path(`M ${sx} 453 C ${f(sx + side * 32)} 493 ${f(tx - side * 35)} ${f(ty - 22)} ${f(tx)} ${ty}`, { fill: 'none', stroke: i % 2 ? '#527e66' : '#769274', 'stroke-width': 8 - i * 0.5, 'stroke-linecap': 'round' }));
      structure.push(path(`M ${f(tx - side * 14)} ${f(ty - 13)} Q ${f(tx - side * 20)} ${f(ty + 13)} ${f(tx - side * 42)} ${f(ty + 20)}`, { fill: 'none', stroke: '#7e9579', 'stroke-width': 2 }));
    }
  }
  // Occupied deck and service undercroft retain manufactured straight members.
  structure.push(rect(150, 417, 1140, 16, { fill: '#435b53', stroke: '#273f3b', 'stroke-width': 1.5 }));
  structure.push(rect(150, 433, 1140, 11, { fill: '#b7c0ab', stroke: '#527064', 'stroke-width': 1 }));
  for (let x = 162; x < 1285; x += 17) structure.push(line(x, 418, x, 431, { stroke: '#9cae9c', 'stroke-width': 1 }));
  for (let x = 180; x < 1270; x += 63) {
    structure.push(line(x, 416, x, 401, { stroke: '#435b53', 'stroke-width': 2 }));
    structure.push(line(x, 402, x + 40, 402, { stroke: '#435b53', 'stroke-width': 1 }));
  }
  structure.push(rect(946, 397, 62, 17, { fill: '#65766c', rx: 3 }));
  structure.push(rect(957, 391, 22, 7, { fill: '#65766c' }));
  for (let i = 0; i < 4; i++) structure.push(rect(952 + i * 13, 400, 7, 5, { fill: '#e3e5cc' }));
  parts.push(group('grown-and-fabricated-span', structure, { 'data-bay-count': p.bays, 'data-growth-extent': p.growth }));
  const load = [];
  const appliedLoad = [];
  for (let i = 0; i < (p.load > 0 ? 7 : 0); i++) {
    const x = 345 + i * 124;
    const height = 17 + p.load * 38;
    appliedLoad.push(line(x, 385 - height, x, 385, { stroke: c.load, 'stroke-width': 1.5 + p.load * 1.8 }));
    appliedLoad.push(path(`M ${x - 5} 378 L ${x} 385 L ${x + 5} 378`, { fill: 'none', stroke: c.load, 'stroke-width': 2 }));
  }
  load.push(group('applied-load-arrows', appliedLoad));
  const boundaryX = Math.max(197, Math.min(1243, boundary));
  load.push(line(boundaryX, 398, boundaryX, 641, { stroke: '#9d6238', 'stroke-width': 1.5, 'stroke-dasharray': '7 6' }));
  load.push(circle(boundaryX, 439, 8, { fill: c.bg, stroke: '#9d6238', 'stroke-width': 2 }));
  parts.push(group('schematic-load-and-growth-front', load, { 'data-relative-load': p.load }));
  const labels = [];
  labels.push(label(72, 220, 'ROOTED ABUTMENTS', 'Mineral growth follows support', c.text));
  labels.push(polyline([[207, 260], [207, 314], [184, 461]], { stroke: c.muted, 'stroke-width': 1.2 }));
  labels.push(label(500, 220, 'CONTINUOUS JOINT', 'Grown ribs meet a fabricated deck', c.text));
  labels.push(polyline([[689, 260], [689, 291], [boundaryX, 312], [boundaryX, 392]], { stroke: c.muted, 'stroke-width': 1.2 }));
  labels.push(label(1050, 220, 'OCCUPIED DECK', 'Service tram supplies scale', c.text));
  labels.push(polyline([[1107, 260], [1107, 313], [982, 385]], { stroke: c.muted, 'stroke-width': 1.2 }));
  labels.push(text(618, 704, 'WATERSHED CLEARANCE', { class: 'label', fill: c.muted, 'text-anchor': 'middle' }));
  labels.push(text(618, 733, 'Root networks leave the watercourse open', { class: 'note', fill: c.muted, 'text-anchor': 'middle' }));
  labels.push(text(78, 784, 'Section through terrain', { class: 'note', fill: c.muted }));
  labels.push(text(1360, 784, 'Kilometre-class span intent', { class: 'note', fill: c.muted, 'text-anchor': 'end' }));
  parts.push(group('precision-callouts', labels, { 'data-rough': 'off' }));
  const legend = [];
  legend.push(text(60, 841, 'MATERIAL CONTINUITY', { class: 'eyebrow', fill: c.muted }));
  legend.push(rect(60, 858, 440, 12, { fill: '#75817b' }));
  legend.push(rect(60, 858, 440 * p.growth, 12, { fill: c.mineral }));
  legend.push(line(60 + 440 * p.growth, 851, 60 + 440 * p.growth, 877, { stroke: c.text, 'stroke-width': 2 }));
  legend.push(text(60, 899, `Grown extent ${p.growth.toFixed(2)}`, { class: 'note', fill: c.text }));
  legend.push(text(500, 899, 'Fabricated continuity', { class: 'note', fill: c.text, 'text-anchor': 'end' }));
  legend.push(text(600, 841, 'STRUCTURAL RHYTHM', { class: 'eyebrow', fill: c.muted }));
  legend.push(text(600, 879, `${p.bays} bays`, { class: 'readout', fill: c.text }));
  legend.push(text(920, 841, 'LOAD EXPRESSION', { class: 'eyebrow', fill: c.muted }));
  legend.push(text(920, 879, p.load.toFixed(2), { class: 'readout', fill: c.load }));
  legend.push(text(1020, 876, 'Normalized / illustrative', { class: 'note', fill: c.muted }));
  parts.push(group('precision-material-key', legend, { 'data-rough': 'off' }));
  parts.push(footer(c, seed, 'Landscape section · tram supplies scale contrast · no stress analysis'));
  return { defs, body: parts.join(''), palette: c };
}

function climateShell(p, seed, random) {
  const c = { bg: '#101e2b', text: '#e0eadf', muted: '#afc3c1', line: '#3c5961', mineral: '#86b6a7', aqua: '#75d7cf', warm: '#deb582' };
  const cx = 704, cy = 505, r = 292;
  const parts = [];
  const defs = `<radialGradient id="planet-ocean" cx="32%" cy="27%" r="80%"><stop stop-color="#3d8794"/><stop offset="0.55" stop-color="#235266"/><stop offset="1" stop-color="#0c2a43"/></radialGradient><linearGradient id="shell-mineral" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#bdd1ad"/><stop offset="0.5" stop-color="#5e9a85"/><stop offset="1" stop-color="#294d4e"/></linearGradient><clipPath id="planet-clip">${circle(cx, cy, r)}</clipPath><marker id="flow-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="#a1e3d2" stroke-width="1.5"/></marker>`;
  parts.push(header('03', 'THE BREATHING HEMISPHERE', 'Orbital cutaway / planetary weather exchange through a living shell', c));
  const orbital = [];
  // Orbital infrastructure is discrete and mechanically indexed, not a halo.
  for (let i = 0; i < 8; i++) {
    const a = -2.85 + i * 0.43;
    const pos = polar(cx, cy, 318 + (i % 2) * 6, a);
    const rim = polar(cx, cy, r + 2, a);
    orbital.push(line(...rim, ...pos, { stroke: '#95ae9d', 'stroke-width': 2 }));
    orbital.push(rect(pos[0] - 6, pos[1] - 5, 12, 10, { fill: '#acbda5', stroke: '#243e46' }));
  }
  orbital.push(circle(1122, 260, 34, { fill: '#8e9e9a', stroke: '#b9c8b5', 'stroke-width': 1.5 }));
  orbital.push(path('M 1121 227 C 1157 235 1165 277 1125 294 C 1138 267 1136 248 1121 227 Z', { fill: '#40555e' }));
  orbital.push(path('M 1112 628 l 18 -9 l 35 6 l 8 9 l -45 6 Z', { fill: '#c6cfb9', stroke: '#648580', 'stroke-width': 1 }));
  parts.push(group('orbital-scale-infrastructure', orbital));
  const ocean = [];
  ocean.push(circle(cx, cy, r, { fill: 'url(#planet-ocean)', stroke: '#9ec8bd', 'stroke-width': 2 }));
  for (let i = 0; i < 9; i++) {
    const a = random() * TAU;
    const rr = r * (0.22 + random() * 0.59);
    const center = polar(cx, cy, rr, a);
    const pathPts = [];
    for (let j = 0; j < 12; j++) {
      const angle = j / 12 * TAU;
      const dist = 17 + random() * 35;
      pathPts.push(polar(center[0], center[1], dist, angle));
    }
    ocean.push(path(`M ${pathPts.map(pt).join(' L ')} Z`, { fill: '#4c7d75', opacity: 0.35 }));
  }
  for (const lat of [-60, -30, 0, 30, 60]) {
    const yy = cy - Math.sin(lat * Math.PI / 180) * r;
    const rx = Math.cos(lat * Math.PI / 180) * r;
    ocean.push(element('ellipse', { cx, cy: f(yy), rx: f(rx), ry: f(rx * 0.12), fill: 'none', stroke: '#70a9a8', 'stroke-width': 1, opacity: 0.3 }));
  }
  parts.push(group('ocean-and-geography', ocean, { 'clip-path': 'url(#planet-clip)' }));
  const project = (lon, lat) => [f(cx + r * Math.sin(lon) * Math.cos(lat)), f(cy - r * Math.sin(lat))];
  const plates = [];
  const gap = 0.013 + p.aperture * 0.095;
  const maxLat = 1.19;
  for (let i = 0; i < p.plates; i++) {
    const a = -1.47 + i * 2.94 / p.plates + gap;
    const b = -1.47 + (i + 1) * 2.94 / p.plates - gap;
    const points = [];
    for (let j = 0; j <= 20; j++) points.push(project(a + Math.sin(j / 20 * Math.PI) * 0.025, -maxLat + j * maxLat * 2 / 20));
    for (let j = 20; j >= 0; j--) points.push(project(b - Math.sin(j / 20 * Math.PI) * 0.025, -maxLat + j * maxLat * 2 / 20));
    plates.push(path(`M ${points.map(pt).join(' L ')} Z`, { fill: 'url(#shell-mineral)', stroke: '#b0cbb3', 'stroke-width': 1.5 }));
    for (let rib = 0; rib < 7; rib++) {
      const lat = -0.97 + rib * 0.31;
      const samples = [];
      for (let j = 0; j <= 8; j++) samples.push(project(a + (b - a) * j / 8, lat + Math.sin(j / 8 * Math.PI) * 0.035));
      plates.push(polyline(samples, { stroke: '#c4d3b5', 'stroke-width': 1.2, opacity: 0.72 }));
    }
    const mid = (a + b) / 2;
    const spine = [];
    for (let j = 0; j <= 16; j++) spine.push(project(mid, -1.07 + j * 2.14 / 16));
    plates.push(polyline(spine, { stroke: '#345e55', 'stroke-width': 2.2 }));
  }
  parts.push(group('mineral-shell-petals', plates, { 'clip-path': 'url(#planet-clip)', 'data-plate-count': p.plates, 'data-seam-aperture': p.aperture }));
  const cut = [];
  const a = 0.12, b = 1.28;
  cut.push(path(ringSegment(cx, cy, 0.01, r, a, b), { fill: '#142e3d', stroke: '#d3c59c', 'stroke-width': 2 }));
  cut.push(path(ringSegment(cx, cy, r * 0.83, r * 0.98, a, b), { fill: '#a5bc9f', stroke: '#d5ddbc', 'stroke-width': 1 }));
  cut.push(path(ringSegment(cx, cy, r * 0.74, r * 0.83, a, b), { fill: '#315e63', stroke: '#86bfb2', 'stroke-width': 1 }));
  cut.push(path(ringSegment(cx, cy, r * 0.64, r * 0.74, a, b), { fill: '#447f8b', stroke: '#6ba9b2', 'stroke-width': 1 }));
  cut.push(path(ringSegment(cx, cy, r * 0.2, r * 0.64, a, b), { fill: '#1e4959', stroke: '#61818b', 'stroke-width': 1 }));
  for (let i = 0; i < 14; i++) {
    const angle = a + (b - a) * (i + 0.5) / 14;
    const out = polar(cx, cy, r * 0.98, angle);
    const inside = polar(cx, cy, r * 0.78, angle + 0.035);
    cut.push(line(...out, ...inside, { stroke: '#3f776b', 'stroke-width': 3 }));
  }
  parts.push(group('planetary-material-cutaway', cut));
  const flow = [];
  const count = Math.ceil(p.circulation * 13);
  for (let i = 0; i < count; i++) {
    const angle = -2.7 + i / count * 2.55;
    const radius = r * (0.18 + (i % 4) * 0.16);
    const center = [cx - 4 + ((i % 2) ? 20 : -24), cy - 8];
    flow.push(path(arc(center[0], center[1], radius, angle, angle + 0.7 + p.circulation * 0.35), { fill: 'none', stroke: c.aqua, 'stroke-width': f(1.1 + p.circulation * 1.9), opacity: 0.78, 'marker-end': 'url(#flow-arrow)' }));
  }
  parts.push(group('illustrative-circulation', flow, { 'data-relative-circulation': p.circulation }));
  const labels = [];
  labels.push(label(60, 233, 'MANTLE-GROWN PLATES', 'A shell that repairs its seams', c.text));
  labels.push(polyline([[291, 270], [349, 270], [454, 350]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(text(60, 362, `${String(p.plates).padStart(2, '0')}`, { class: 'planet-count', fill: c.mineral }));
  labels.push(text(60, 395, 'SHELL PETALS', { class: 'eyebrow', fill: c.muted }));
  labels.push(text(60, 457, 'Continuous mineral ribs', { class: 'note', fill: c.muted }));
  labels.push(text(60, 485, 'Distributed exchange ducts', { class: 'note', fill: c.muted }));
  labels.push(text(60, 513, 'Weather openings between', { class: 'note', fill: c.muted }));
  labels.push(text(60, 541, 'structural plates', { class: 'note', fill: c.muted }));
  labels.push(label(60, 672, 'OCEAN-FACING EXCHANGE', 'Circulation feeds the shell', c.text));
  labels.push(polyline([[292, 710], [353, 710], [465, 640]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(text(1122, 319, 'Service moon', { class: 'note', fill: c.muted, 'text-anchor': 'middle' }));
  labels.push(label(1075, 396, 'WEATHER SEAM', 'Opening, not ornament', c.text));
  labels.push(polyline([[1080, 443], [1030, 443], [956, 395]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(text(1075, 492, `Aperture ${p.aperture.toFixed(2)}`, { class: 'subtitle', fill: c.text }));
  const slit = 12 + p.aperture * 93;
  labels.push(rect(1075, 514, 225, 40, { fill: '#567d70', stroke: '#a2c0a7' }));
  labels.push(rect(1187.5 - slit / 2, 514, slit, 40, { fill: '#173b50', stroke: '#80c4bb' }));
  labels.push(text(1075, 582, 'Normalized opening', { class: 'note', fill: c.muted }));
  labels.push(text(1144, 669, 'Transit craft', { class: 'note', fill: c.muted, 'text-anchor': 'middle' }));
  labels.push(polyline([[1112, 700], [1058, 744], [912, 723]], { stroke: c.muted, 'stroke-width': 1.25 }));
  labels.push(text(1113, 729, 'Section through', { class: 'note', fill: c.muted }));
  labels.push(text(1113, 756, 'the shell thickness', { class: 'note', fill: c.muted }));
  parts.push(group('precision-callouts', labels, { 'data-rough': 'off' }));
  const legend = [];
  legend.push(line(60, 822, 1380, 822, { stroke: c.line }));
  legend.push(text(60, 855, 'PLANETARY SCALE INTENT', { class: 'eyebrow', fill: c.muted }));
  legend.push(text(60, 888, 'Moon and craft are schematic scale cues', { class: 'note', fill: c.text }));
  legend.push(text(585, 855, 'RELATIVE CIRCULATION', { class: 'eyebrow', fill: c.muted }));
  legend.push(text(585, 891, p.circulation.toFixed(2), { class: 'readout', fill: c.aqua }));
  legend.push(text(695, 887, 'Synthetic field', { class: 'note', fill: c.muted }));
  const materialNames = [['#a5bc9f', 'Shell'], ['#315e63', 'Exchange'], ['#447f8b', 'Ocean']];
  materialNames.forEach(([fill, name], i) => {
    const x = 1000 + i * 124;
    legend.push(rect(x, 846, 20, 15, { fill, stroke: '#bdd0bf' }));
    legend.push(text(x, 888, name, { class: 'note', fill: c.muted }));
  });
  parts.push(group('precision-material-key', legend, { 'data-rough': 'off' }));
  parts.push(footer(c, seed, 'Orbital view with schematic cutaway · layer thicknesses exaggerated'));
  return { defs, body: parts.join(''), palette: c };
}

/** Render one bounded fictional study. Inputs are explicit, not loosely coerced. */
export function renderStudy(kind, opts = {}) {
  const study = STUDIES.find(item => item.id === kind);
  if (!study) throw new RangeError(`Unknown study: ${String(kind)}`);
  if (!opts || typeof opts !== 'object' || Array.isArray(opts) || ![Object.prototype, null].includes(Object.getPrototypeOf(opts))) {
    throw new TypeError('Options must be a plain object');
  }
  const allowed = new Set(['seed', ...study.controls.map(control => control.key)]);
  for (const key of Reflect.ownKeys(opts)) if (typeof key !== 'string' || !allowed.has(key)) throw new RangeError(`Unknown option: ${String(key)}`);
  const seed = opts.seed === undefined ? 731 : opts.seed;
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('seed must be an unsigned 32-bit integer');
  const params = {};
  for (const control of study.controls) {
    const value = opts[control.key] === undefined ? study.defaults[control.key] : opts[control.key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < control.min || value > control.max || (control.step === 1 && !Number.isInteger(value))) {
      throw new RangeError(`${control.key} must be ${control.step === 1 ? 'an integer' : 'a finite number'} from ${control.min} to ${control.max}`);
    }
    params[control.key] = value;
  }
  const manifest = {
    version: 1,
    generatorVersion: GENERATOR_VERSION,
    kind,
    seed,
    width: WIDTH,
    height: HEIGHT,
    params,
    fictionalData: FICTION,
    provenance: SOURCE,
  };
  const renderer = { 'vascular-drive': vascularDrive, 'grafted-span': graftedSpan, 'climate-shell': climateShell }[kind];
  const art = renderer(params, seed, rng(seed));
  const css = `text{font-family:Arial,Helvetica,sans-serif;font-size:18px}.title{font-size:40px;font-weight:700;letter-spacing:1px}.subtitle{font-size:22px}.eyebrow{font-size:17px;letter-spacing:1.5px}.label{font-size:18px;font-weight:700;letter-spacing:.5px}.note{font-size:18px}.mono{font-family:monospace;font-size:17px}.readout{font-size:31px;font-weight:600}.planet-count{font-size:70px;font-weight:600}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="study-title study-desc"><title id="study-title">${esc(study.title)}</title><desc id="study-desc">${esc(`${study.description} ${FICTION} Seed ${seed}; generator ${GENERATOR_VERSION}.`)}</desc><metadata>${esc(JSON.stringify(manifest))}</metadata><style>${css}</style><defs>${art.defs}</defs>${rect(0, 0, WIDTH, HEIGHT, { fill: art.palette.bg })}${art.body}</svg>\n`;
  return { svg, manifest };
}
