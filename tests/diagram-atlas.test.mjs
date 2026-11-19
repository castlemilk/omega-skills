import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildAtlas, renderAtlasHtml } from '../skills/generate-futuristic-art/scripts/build-diagram-atlas.mjs';
import { STUDIES, renderStudy } from '../skills/generate-futuristic-art/scripts/world-diagrams.mjs';

const sourcePath = new URL('../skills/generate-futuristic-art/scripts/world-diagrams.mjs', import.meta.url);

test('offline atlas carries exact replayable examples and self-contained JavaScript', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'world-atlas-'));
  try {
    const result = await buildAtlas({ outDir: directory, seed: 4294967295 });
    assert.equal(result.files.length, 8);
    assert.deepEqual((await readdir(directory)).sort(), result.files.slice().sort());
    for (const study of STUDIES) {
      const expected = renderStudy(study.id, { seed: 4294967295 });
      assert.equal(await readFile(join(directory, study.id + '.svg'), 'utf8'), expected.svg);
      const recipe = JSON.parse(await readFile(join(directory, study.id + '.recipe.json'), 'utf8'));
      assert.deepEqual(recipe, expected.manifest);
      assert.equal(renderStudy(recipe.kind, { ...recipe.params, seed: recipe.seed }).svg, expected.svg);
    }
    const html = await readFile(join(directory, 'atlas.html'), 'utf8');
    assert.equal((html.match(/<script\b/g) || []).length, 1);
    assert.equal((html.match(/<\/script>/g) || []).length, 1);
    assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|\bfetch\s*\(|\bXMLHttpRequest\b/);
    assert.match(html, /Fictional engineering study/);
    assert.match(html, /<dialog[^>]+aria-labelledby=/);
    assert.match(html, /id="error" role="alert"/);
    assert.match(html, /prefers-reduced-motion/);
    const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
    execFileSync(process.execPath, ['--check', '--input-type=module'], { input: script, encoding: 'utf8' });
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('atlas is reproducible, rejects an external module dependency and contains script termination', async () => {
  const source = await readFile(sourcePath, 'utf8');
  assert.equal(renderAtlasHtml(source, 23), renderAtlasHtml(source, 23));
  assert.throws(() => renderAtlasHtml('import x from "https://example.invalid/x.js";\n' + source), /must not import/);
  const html = renderAtlasHtml(source + '\n// </script><script>unsafe marker</script>\n', 23);
  assert.equal((html.match(/<\/script>/g) || []).length, 1);
  assert.match(html, /<\\\/script><script>unsafe marker<\\\/script>/);
});

test('invalid output and seeds fail before output writes', async () => {
  await assert.rejects(buildAtlas({ outDir: '' }), /output directory/);
  await assert.rejects(buildAtlas({ outDir: '/path/that/must/not/be/written', seed: -1 }));
  await assert.rejects(buildAtlas({ outDir: '/path/that/must/not/be/written', seed: Number.NaN }));
});
