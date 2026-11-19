import assert from 'node:assert/strict';
import test from 'node:test';
import { GENERATOR_VERSION, STUDIES, renderStudy } from '../skills/generate-futuristic-art/scripts/world-diagrams.mjs';

// These checks establish bounded, replayable SVG generation and export contracts.
// They do not establish artistic originality, physical accuracy or visual quality.
const geometry = svg => svg
  .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
  .replace(/<g id="precision-[^"]*"[\s\S]*?<\/g>/g, '')
  .replace(/<text\b[\s\S]*?<\/text>/g, '')
  .replace(/<desc\b[\s\S]*?<\/desc>/g, '')
  .replace(/ data-[^=]+="[^"]*"/g, '');

function checkDocument(svg) {
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /viewBox="0 0 1440 1000"/);
  assert.match(svg, /role="img" aria-labelledby="study-title study-desc"/);
  assert.match(svg, /<title id="study-title">.+?<\/title>/);
  assert.match(svg, /<desc id="study-desc">.+?<\/desc>/);
  assert.match(svg, /no physical simulation/);
  assert(!/NaN|Infinity|undefined/.test(svg), 'Nonfinite or undefined output');
  assert(!/<(?:script|foreignObject|image)\b|\son\w+=|(?:href|src)=|url\(["']?https?:/i.test(svg), 'Unexpected executable or external resource');
  assert(Buffer.byteLength(svg, 'utf8') < 200_000, 'SVG exceeds resource budget');
  const nodes = [...svg.matchAll(/<([A-Za-z][\w:-]*)\b[^>]*>/g)];
  assert(nodes.length <= 2500, 'SVG exceeds element budget');
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate element ID');
  for (const match of svg.matchAll(/url\(#([^)]*)\)/g)) assert(ids.includes(match[1]), `Unresolved SVG reference: ${match[1]}`);
  // Validate the generator's complete tag stream; browser XML parsing is also
  // exercised by the separately rendered artifact, not assumed from this check.
  const stack = [];
  for (const match of svg.matchAll(/<(\/?)([A-Za-z][\w:-]*)\b([^>]*)>/g)) {
    if (match[1]) assert.equal(stack.pop(), match[2], 'Unbalanced SVG element');
    else if (!match[3].endsWith('/')) stack.push(match[2]);
  }
  assert.deepEqual(stack, []);
}

test('documented studies expose fixed defaults and bounded controls', () => {
  assert.deepEqual(STUDIES.map(s => s.id), ['vascular-drive', 'grafted-span', 'climate-shell']);
  assert(Object.isFrozen(STUDIES));
  for (const s of STUDIES) {
    assert(Object.isFrozen(s.defaults));
    assert(Object.isFrozen(s.controls));
    assert.equal(s.controls.length, 3);
    assert.equal(new Set(s.controls.map(c => c.key)).size, 3);
    assert.deepEqual(Object.keys(s.defaults), s.controls.map(c => c.key));
    for (const c of s.controls) {
      assert(c.label && c.step > 0 && c.max > c.min);
      assert(s.defaults[c.key] >= c.min && s.defaults[c.key] <= c.max);
    }
  }
});

test('same version, seed and parameters replay byte-identical SVG and manifest', () => {
  for (const s of STUDIES) {
    for (const seed of [0, 731, 0xffffffff]) {
      const first = renderStudy(s.id, { seed, ...s.defaults });
      const next = renderStudy(s.id, { seed, ...s.defaults });
      assert.equal(next.svg, first.svg);
      assert.deepEqual(next.manifest, first.manifest);
      assert.equal(first.manifest.version, 1);
      assert.equal(first.manifest.generatorVersion, GENERATOR_VERSION);
      assert.deepEqual([first.manifest.width, first.manifest.height], [1440, 1000]);
      assert.match(first.manifest.fictionalData, /no physical simulation/);
      const recipe = JSON.parse(JSON.stringify(first.manifest));
      assert.equal(renderStudy(recipe.kind, { seed: recipe.seed, ...recipe.params }).svg, first.svg);
      checkDocument(first.svg);
    }
    assert.notEqual(geometry(renderStudy(s.id, { seed: 731 }).svg), geometry(renderStudy(s.id, { seed: 732 }).svg), 'Seed must affect geometry, not only a label');
  }
});

test('every visible control alters geometry or the illustrative field', () => {
  for (const s of STUDIES) {
    for (const c of s.controls) {
      const low = renderStudy(s.id, { [c.key]: c.min });
      const high = renderStudy(s.id, { [c.key]: c.max });
      assert.notEqual(geometry(low.svg), geometry(high.svg), `${s.id}/${c.key} changed only a label`);
      checkDocument(low.svg);
      checkDocument(high.svg);
    }
  }
});

test('all corner combinations stay bounded and finite', () => {
  for (const s of STUDIES) {
    for (let mask = 0; mask < 8; mask++) {
      const params = Object.fromEntries(s.controls.map((c, i) => [c.key, mask & (1 << i) ? c.max : c.min]));
      checkDocument(renderStudy(s.id, { seed: mask, ...params }).svg);
    }
  }
});

test('invalid, unbounded and coercive inputs fail before rendering', () => {
  for (const kind of ['', 'unknown', '<script>', undefined, null]) assert.throws(() => renderStudy(kind), RangeError);
  for (const s of STUDIES) {
    for (const opts of [null, [], 3, 'x', new Date()]) assert.throws(() => renderStudy(s.id, opts), TypeError);
    assert.throws(() => renderStudy(s.id, { width: 1e9 }), RangeError);
    assert.throws(() => renderStudy(s.id, { [Symbol('unknown')]: 3 }), RangeError);
    for (const seed of [-1, 0x100000000, 0.5, Infinity, NaN, '731', null]) assert.throws(() => renderStudy(s.id, { seed }), RangeError);
    for (const c of s.controls) {
      for (const value of [c.min - 1, c.max + 1, NaN, Infinity, -Infinity, '0.5', null, {}]) {
        assert.throws(() => renderStudy(s.id, { [c.key]: value }), RangeError, `${s.id}/${c.key}`);
      }
      if (c.step === 1) assert.throws(() => renderStudy(s.id, { [c.key]: c.min + 0.5 }), RangeError);
    }
  }
});

test('semantic geometry and precise labels are separated for editable export', () => {
  const expected = {
    'vascular-drive': ['circulation-branches', 'laminated-pressure-hull', 'synthetic-energy-field', 'exhaust-throat'],
    'grafted-span': ['watershed-section', 'grown-and-fabricated-span', 'schematic-load-and-growth-front'],
    'climate-shell': ['ocean-and-geography', 'mineral-shell-petals', 'planetary-material-cutaway', 'illustrative-circulation'],
  };
  for (const [kind, ids] of Object.entries(expected)) {
    const { svg } = renderStudy(kind);
    for (const id of ids) assert(svg.includes(`id="${id}"`), `Missing semantic layer ${id}`);
    assert.match(svg, /<g id="precision-callouts" data-rough="off">/);
    assert.match(svg, /<g id="precision-footer" data-rough="off">/);
    assert.match(svg, /font-size:17px/);
  }
});

test('zero load and circulation leave structures visible with active signals off', () => {
  const drive = renderStudy('vascular-drive', { load: 0 }).svg;
  const field = drive.match(/<g id="synthetic-energy-field"[^>]*>([\s\S]*?)<\/g>/)[1];
  assert.match(field, /fill="url\(#drive-field\)" opacity="0"/);
  assert.match(drive, /fill="url\(#drive-exhaust\)" opacity="0"/);
  assert.match(drive, /id="laminated-pressure-hull"/);
  const span = renderStudy('grafted-span', { load: 0 }).svg;
  assert.match(span, /<g id="applied-load-arrows"><\/g>/);
  assert.match(span, /id="grown-and-fabricated-span"/);
  const shell = renderStudy('climate-shell', { circulation: 0 }).svg;
  assert.match(shell, /<g id="illustrative-circulation" data-relative-circulation="0"><\/g>/);
  assert.match(shell, /id="mineral-shell-petals"/);
});
