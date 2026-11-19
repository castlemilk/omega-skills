import assert from 'node:assert/strict';
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Publication checks only. Text and path checks cannot establish artistic
// quality, theme fit, originality or diversity in the generated artwork.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillName = 'generate-futuristic-art';
const bundle = join(root, 'skills', skillName);
const required = new Set([
  'SKILL.md',
  'agents/openai.yaml',
  'assets/icon.svg',
  'references/monumental-direction.md',
  'references/worldbuilding-loop.md',
  'references/concept-space.md',
  'references/world-notebook.md',
  'references/prompt-recipes.md',
  'references/detail-vocabulary.md',
  'references/reference-atlas.md',
  'references/antialgorithm-method.md',
  'references/antialgorithm-LICENSE.txt',
  'references/diagram-studies.md',
  'scripts/world-diagrams.mjs',
  'scripts/build-diagram-atlas.mjs',
]);
const directories = new Set([...required].filter(name => name.includes('/')).map(name => dirname(name)));

function assertPublishedPath(name, directory = false) {
  assert((directory ? directories : required).has(name),
    `Unreviewed payload path (runtime records and source media are excluded): ${name}`);
}

async function readPayload(directory) {
  const entry = await lstat(directory);
  assert(!entry.isSymbolicLink(), 'The bundle root must not be a symlink');
  assert(entry.isDirectory(), 'The bundle root must be a directory');
  const contents = new Map();
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      const name = relative(directory, path).split(sep).join('/');
      assert(!entry.isSymbolicLink(), `Unexpected symlink: ${name}`);
      assertPublishedPath(name, entry.isDirectory());
      if (entry.isDirectory()) await walk(path);
      else {
        assert(entry.isFile(), `Unexpected non-file payload: ${name}`);
        const text = new TextDecoder('utf-8', { fatal: true }).decode(await readFile(path));
        assert(text.trim(), `Empty payload: ${name}`);
        assert(text.endsWith('\n'), `Missing final newline: ${name}`);
        assert(!text.includes('\0'), `Binary content in text payload: ${name}`);
        contents.set(name, text);
      }
    }
  }
  await walk(directory);
  for (const name of required) assert(contents.has(name), `Missing required file: ${name}`);
  return contents;
}

function assertPublicText(text, name = 'fixture') {
  const forbidden = [
    ['private conversation or space URL', /https?:\/\/(?:www\.)?chatgpt\.com\/(?:c|space|spaces)\//i],
    ['private host identifier', /\b(?:page_[a-f0-9]{16,}|libfile_[A-Za-z0-9_-]+|file-inline-libfile_[A-Za-z0-9_-]+|skill-[a-f0-9]{20,})\b/i],
    ['host resource URI', /\b(?:library-file:|oai-library:\/\/|mcp-resource:\/\/|chatgpt-conversation:|skill:\/\/|sandbox:)/i],
    ['machine-specific path', /(?:\/(?:workspace|mnt\/data|Users|home)\/|\/root\/\.(?:codex|config)\/|[A-Za-z]:\\(?:Users|workspace)\\)/i],
    ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/],
    ['access token', /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}|(?:AKIA|ASIA)[A-Z0-9]{16})\b/],
    ['assigned secret', /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_+/=-]{24,}/i],
  ];
  for (const [reason, pattern] of forbidden) assert(!pattern.test(text), `${reason} in ${name}`);
}

function documentationLinks(text) {
  const inline = [...text.matchAll(/!?\[[^\]\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g)];
  const definitions = [...text.matchAll(/^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gm)];
  return [...inline, ...definitions].map(match => match[1] ?? match[2]);
}

function localTarget(from, target) {
  if (/^https?:\/\//i.test(target) || target.startsWith('#')) return null;
  assert(!/^[a-z][a-z0-9+.-]*:/i.test(target), `Nonportable link: ${target}`);
  const pathPart = decodeURIComponent(target.split(/[?#]/)[0]);
  if (!pathPart) return null;
  assert(!/^(?:\/|[A-Za-z]:)/.test(pathPart) && !/[\\\0]/.test(pathPart), `Nonportable path: ${target}`);
  const path = resolve(dirname(join(bundle, from)), pathPart);
  const name = relative(bundle, path).split(sep).join('/');
  assert(name !== '..' && !name.startsWith('../'), `Link escapes bundle: ${target}`);
  return name;
}

function assertLinkClosure(contents) {
  const edges = new Map();
  for (const [name, text] of contents) {
    if (!name.endsWith('.md')) continue;
    const linked = new Set();
    for (const target of documentationLinks(text)) {
      const destination = localTarget(name, target);
      if (destination === null) continue;
      assert(contents.has(destination), `Missing link target in ${name}: ${target}`);
      linked.add(destination);
    }
    edges.set(name, linked);
  }
  const reachable = new Set();
  function visit(name) {
    if (reachable.has(name)) return;
    reachable.add(name);
    for (const target of edges.get(name) ?? []) visit(target);
  }
  visit('SKILL.md');
  for (const name of required) {
    if (name.startsWith('references/')) assert(reachable.has(name), `Reference is not discoverable from SKILL.md: ${name}`);
  }
}

function scalar(text, field, indent = '') {
  const value = text.match(new RegExp(`^${indent}${field}: (.+)$`, 'm'))?.[1].trim();
  assert(value, `Missing metadata field: ${field}`);
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'")) {
    assert(value.endsWith("'"), `Unclosed metadata value: ${field}`);
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

const contents = await readPayload(bundle);

test('the reviewed public payload is complete and contains portable text and an icon', () => {
  assert.deepEqual([...contents.keys()].sort(), [...required].sort());
  const icon = contents.get('assets/icon.svg');
  assert.match(icon, /<svg\b/);
  assert.match(icon, /<\/svg>\s*$/);
  assert(!/<(?:image|script|foreignObject)\b|<!ENTITY|<!DOCTYPE|\bdata:[^\s]+/i.test(icon),
    'The icon must not embed source images, active content or encoded media');
  for (const match of icon.matchAll(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/g)) {
    assert(match[1].startsWith('#'), 'The icon must not load external assets');
  }
});

test('skill discovery metadata and agent invocation match the public name', () => {
  const main = contents.get('SKILL.md');
  const frontmatter = main.match(/^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/)?.[1];
  assert(frontmatter, 'SKILL.md needs YAML frontmatter');
  assert.equal(scalar(frontmatter, 'name'), skillName);
  const description = scalar(frontmatter, 'description');
  assert(description.length > 0 && description.length <= 1024, 'A concise discovery description is required');
  assert(main.split(/\r?\n/).length < 500, 'Keep supporting detail in the bundled references');
  const agent = contents.get('agents/openai.yaml');
  assert.match(agent, /^interface:\r?\n/);
  for (const field of ['display_name', 'short_description', 'default_prompt']) {
    assert.equal(typeof scalar(agent, field, '  '), 'string');
  }
  assert(scalar(agent, 'default_prompt', '  ').includes(`$${skillName}`));
  for (const field of ['icon_small', 'icon_large']) {
    if (!agent.includes(`  ${field}:`)) continue;
    const icon = localTarget('SKILL.md', scalar(agent, field, '  '));
    assert.equal(icon, 'assets/icon.svg', 'Agent icons must resolve to the bundled icon');
  }
});

test('relative documentation links stay inside the bundle and make every reference discoverable', () => {
  assertLinkClosure(contents);
});

test('public text contains no known private host identifiers, machine paths or credentials', () => {
  for (const [name, text] of contents) assertPublicText(text, name);
});

test('publication guards reject representative runtime data, source media and private values', () => {
  for (const name of [
    'runtime.json', 'feedback.jsonl', 'worlds/session.md', '.env',
    'assets/reference.mp4', 'assets/source-frame.png', 'assets/framepack.zip',
    'references/frame-001.jpg', 'assets/private-reference.svg',
  ]) assert.throws(() => assertPublishedPath(name), /Unreviewed payload path/);
  for (const name of ['runtime', 'state', 'framepacks', '.git', 'node_modules']) {
    assert.throws(() => assertPublishedPath(name, true), /Unreviewed payload path/);
  }
  for (const text of [
    'https://chatgpt.com/c/private-example',
    'https://chatgpt.com/space/private-example',
    `page_${'a'.repeat(32)}`, 'libfile_private_example',
    'library-file:private-example', 'skill://private-host/skill',
    '/workspace/private/output.png', '/home/example/framepacks/',
    'C:\\Users\\example\\references\\',
    '-----BEGIN PRIVATE KEY-----', `ghp_${'x'.repeat(30)}`,
    `github_pat_${'x'.repeat(30)}`, `sk-proj-${'x'.repeat(30)}`,
    `AKIA${'X'.repeat(16)}`, `api_key=${'x'.repeat(30)}`,
  ]) assert.throws(() => assertPublicText(text));
});

test('link guards reject missing files and escaping paths', () => {
  for (const target of ['../README.md', '%2e%2e/README.md', '/private/file.md', 'C:\\private\\file.md']) {
    assert.throws(() => localTarget('SKILL.md', target), /escapes bundle|Nonportable/);
  }
  const missing = new Map(contents);
  missing.delete('references/worldbuilding-loop.md');
  assert.throws(() => assertLinkClosure(missing), /Missing link target|not discoverable/);
  const injected = new Map(contents);
  injected.set('SKILL.md', `${contents.get('SKILL.md')}\n[missing](references/absent.md)\n`);
  assert.throws(() => assertLinkClosure(injected), /Missing link target/);
});

test('payload traversal rejects symlinked roots and entries before reading their contents', async t => {
  const temporary = await mkdtemp(join(tmpdir(), 'futuristic-art-payload-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const actual = join(temporary, 'actual');
  await mkdir(actual);
  await writeFile(join(actual, 'SKILL.md'), 'A test fixture.\n');
  const linkedRoot = join(temporary, 'linked');
  await symlink(actual, linkedRoot, 'dir');
  await assert.rejects(readPayload(linkedRoot), /symlink/);
  const nested = join(temporary, 'nested');
  await mkdir(nested);
  await symlink(join(actual, 'SKILL.md'), join(nested, 'SKILL.md'), 'file');
  await assert.rejects(readPayload(nested), /symlink/);
});

test('repository discovery, installer inventory and test commands include the skill', async () => {
  const [packageText, smoke, readme] = await Promise.all([
    readFile(join(root, 'package.json'), 'utf8'),
    readFile(join(root, 'scripts/smoke-install.mjs'), 'utf8'),
    readFile(join(root, 'README.md'), 'utf8'),
  ]);
  const pkg = JSON.parse(packageText);
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert(pkg.scripts.test.includes('tests/generate-futuristic-art.test.mjs'));
  for (const filename of ['generate-futuristic-art.test.mjs', 'world-diagrams.test.mjs', 'diagram-atlas.test.mjs']) {
    assert(pkg.scripts['test:futuristic-art'].includes(`tests/${filename}`));
    assert(pkg.scripts.test.includes(`tests/${filename}`));
  }
  assert(smoke.includes(`'${skillName}'`));
  assert(readme.includes(`skills/${skillName}/SKILL.md`));
  assert(readme.includes(`--skill ${skillName}`));
  assert(readme.includes(`$${skillName}`));
});
