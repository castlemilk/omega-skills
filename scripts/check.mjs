import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillRoot = join(root, 'skills', 'beneb-logo');

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert(!entry.isSymbolicLink(), `Payload must be self-contained: ${entry.name}`);
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else if (entry.isFile()) files.push(path);
  }
  return files.sort();
}

const required = [
  'SKILL.md',
  'agents/openai.yaml',
  'references/aesthetic-system.md',
  'references/design-language.md',
  'references/construction-catalog.md',
  'references/prompt-system.md',
  'references/batch-template.md',
  'references/review-rubric.md',
  'references/host-adapters.md',
  'references/state-template.md',
  'references/selection-learning.md',
  'scripts/curate.mjs',
];

const files = await filesUnder(skillRoot);
const names = files.map(path => relative(skillRoot, path).split(sep).join('/'));
assert.deepEqual(names, [...required].sort(), 'The installed payload must contain the complete, reviewed bundle');

const skill = await readFile(join(skillRoot, 'SKILL.md'), 'utf8');
const frontmatter = skill.match(/^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/)?.[1];
assert(frontmatter, 'SKILL.md needs YAML frontmatter');
assert.match(frontmatter, /^name: beneb-logo$/m);
const description = frontmatter.match(/^description: (.+)$/m)?.[1];
assert(description && description.length <= 1024, 'A concise discovery description is required');
assert(skill.split(/\r?\n/).length < 500, 'Keep the main skill concise; use bundled references for detail');

let linkCount = 0;
for (const path of files) {
  const text = await readFile(path, 'utf8');
  assert(text.trim(), `Empty payload file: ${relative(root, path)}`);
  assert(!/(?:page_[a-f0-9]{16,}|libfile_[A-Za-z0-9_-]+|library-file:|skill-[a-f0-9]{20,}|\/workspace\/|\/root\/\.codex\/)/i.test(text),
    `Private host identifier or machine path in ${relative(root, path)}`);

  if (!path.endsWith('.md')) continue;
  for (const match of text.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
    const targetPath = resolve(dirname(path), decodeURIComponent(target.split('#')[0]));
    assert(targetPath.startsWith(skillRoot + sep), `Reference escapes installed bundle: ${target}`);
    assert((await stat(targetPath)).isFile(), `Bundled reference is not a file: ${target}`);
    linkCount++;
  }
}

const agentMetadata = await readFile(join(skillRoot, 'agents/openai.yaml'), 'utf8');
assert.match(agentMetadata, /default_prompt: .*\$beneb-logo/);

console.log(`PASS: ${files.length} portable skill files, ${linkCount} resolved relative links, valid discovery metadata.`);
