import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Package/contract checks only: these do not evaluate forecasting performance.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = resolve(root, 'skills/futurist-research');
const expected = [
  'SKILL.md', 'agents/openai.yaml', 'references/method.md',
  'references/evidence.md', 'references/records-and-learning.md',
  'references/regression-cases.md',
];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${entry.name}`);
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else {
      assert(entry.isFile(), `Unexpected non-file: ${path}`);
      files.push(path);
    }
  }
  return files;
}

const paths = await walk(bundle);
const contents = new Map(await Promise.all(paths.map(async path => [
  relative(bundle, path).split(sep).join('/'), await readFile(path, 'utf8'),
])));
const main = contents.get('SKILL.md');

function assertNoPrivatePayload(text) {
  const forbidden = [
    /https?:\/\/chatgpt\.com\/(?:c|space)\//i,
    /\bpage_[a-f0-9]{16,}\b/i,
    /\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}\b/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\/(?:Users|home)\/[^\s/]+\//,
  ];
  for (const pattern of forbidden) assert(!pattern.test(text), `Private payload: ${pattern}`);
}

function assertInsideBundle(path) {
  const rel = relative(bundle, path);
  assert(rel !== '..' && !rel.startsWith(`..${sep}`) && !resolve(bundle, rel).startsWith(`${bundle}${sep}..${sep}`),
    'Bundled links must not escape the skill');
  assert(path === bundle || path.startsWith(`${bundle}${sep}`), 'Link escapes bundle');
}

test('portable bundle has exactly the intended text files', () => {
  assert.deepEqual([...contents.keys()].sort(), [...expected].sort());
  for (const [name, text] of contents) {
    assert(text.trim().length > 0, `${name} is empty`);
    assert(text.endsWith('\n'), `${name} lacks a final newline`);
    assert(!text.includes('\uFFFD'), `${name} has invalid text decoding`);
  }
});

test('skill discovery metadata and method version are present', () => {
  assert.match(main, /^---\nname: futurist-research\ndescription: [^\n]+\n---\n/);
  assert.match(main, /Method version: \*\*1\.0\.0\*\*/);
  assert(main.split(/\s+/).length < 2500, 'Keep the entry point concise');
});

test('agent manifest names this skill', () => {
  const agent = contents.get('agents/openai.yaml');
  assert.match(agent, /^interface:\n/);
  for (const field of ['display_name', 'short_description', 'default_prompt']) {
    assert.match(agent, new RegExp(`^  ${field}: "[^"\\n]+"$`, 'm'));
  }
  assert(agent.includes('$futurist-research'));
});

test('all relative documentation links resolve inside the installed bundle', async () => {
  let checked = 0;
  for (const [name, text] of contents) {
    if (!name.endsWith('.md')) continue;
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      const path = resolve(dirname(resolve(bundle, name)), target);
      assertInsideBundle(path);
      await readFile(path, 'utf8');
      checked++;
    }
    assert.equal((text.match(/^```/gm) ?? []).length % 2, 0, `${name} has an unclosed code fence`);
  }
  assert(checked >= 5, 'The entry point must link its supporting references');
});

test('publication contains no known private identifiers or runtime state', () => {
  for (const [name, text] of contents) {
    assertNoPrivatePayload(text);
    assert(!/(?:^|\/)(?:runtime|state|ledger|node_modules|\.git)(?:\/|\.)/.test(name), name);
  }
});

test('privacy and path guards reject representative bad inputs', () => {
  assert.throws(() => assertNoPrivatePayload('https://' + 'chatgpt.com/space/' + 'private-example'));
  assert.throws(() => assertNoPrivatePayload('ghp_' + 'x'.repeat(30)));
  assert.throws(() => assertInsideBundle(resolve(bundle, '../another-skill/SKILL.md')));
});

test('record contracts preserve forecast provenance and feedback distinctions', () => {
  const records = contents.get('references/records-and-learning.md');
  for (const text of [
    'private project destination', 'append-only revisions', 'information-cutoff',
    'resolution criteria', 'Preference or goal', 'Factual correction',
    'Hypothesis or intuition', 'Method critique', 'Observed outcome',
    'Brier score', 'base-rate', 'unresolvable', 'held-out', 'rollback',
  ]) assert(records.includes(text), `Missing contract: ${text}`);
});

test('eight behavioral cases remain explicitly separate from automated checks', () => {
  const cases = contents.get('references/regression-cases.md');
  assert.deepEqual([...cases.matchAll(/^## (R\d+):/gm)].map(m => m[1]),
    ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']);
  assert.equal((cases.match(/^Prompt:/gm) ?? []).length, 8);
  assert.equal((cases.match(/^Pass:/gm) ?? []).length, 8);
  assert(cases.includes('not empirical forecasts or completed evaluations'));
  assert(cases.includes('automated tests check package structure only'));
});

test('repository test and installer entry points include the skill', async () => {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const smoke = await readFile(resolve(root, 'scripts/smoke-install.mjs'), 'utf8');
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  assert(pkg.scripts.test.includes('tests/futurist-research.test.mjs'));
  assert.equal(pkg.scripts['test:futurist'], 'node --test tests/futurist-research.test.mjs');
  assert(smoke.includes("'futurist-research'"));
  assert(readme.includes('skills/futurist-research/SKILL.md'));
  assert(readme.includes('--skill futurist-research'));
});
