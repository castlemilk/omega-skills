import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEvidence, validateSkill } from '../scripts/check-business-opportunities.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'skills', 'discover-ai-business-opportunities');
let passed = 0;
async function rejects(label, mutate) {
  const temporary = await mkdtemp(join(tmpdir(), 'business-opportunity-payload-'));
  try {
    const copy = join(temporary, 'skill');
    await cp(source, copy, { recursive: true });
    await mutate(copy);
    await assert.rejects(validateSkill(copy, { quiet: true }));
    console.log(`PASS: rejects ${label}`); passed++;
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
async function append(path, text) { await writeFile(path, await readFile(path, 'utf8') + text); }
await validateSkill(source, { quiet: true }); passed++;
assert.deepEqual(parseEvidence('a,b\n"quoted, value","escaped ""quote"""\n'),
  [['a', 'b'], ['quoted, value', 'escaped "quote"']]); passed++;
assert.throws(() => parseEvidence('a,b\n"unterminated,b\n')); passed++;
await rejects('runtime ledger in the published bundle', path => writeFile(join(path, 'ledger.json'), '{}'));
await rejects('missing bundled reference', path => rm(join(path, 'references', 'evaluation.md')));
await rejects('private conversation links', path => append(join(path, 'SKILL.md'), '\nhttps://chatgpt.com/c/private-example\n'));
await rejects('machine-specific state paths', path => append(join(path, 'SKILL.md'), '\n/workspace/private/example.json\n'));
await rejects('credential-like payloads', path => append(join(path, 'SKILL.md'), '\n-----BEGIN PRIVATE KEY-----\n'));
await rejects('escaping relative links', path => append(join(path, 'SKILL.md'), '\n[escape](../../README.md)\n'));
await rejects('incorrect installed name', async path => {
  const file = join(path, 'SKILL.md');
  await writeFile(file, (await readFile(file, 'utf8')).replace('name: discover-ai-business-opportunities', 'name: incorrect'));
});
await rejects('truncated historical evidence', async path => {
  const file = join(path, 'references', 'seed-evidence-2026-11-07.csv');
  await writeFile(file, (await readFile(file, 'utf8')).split('\n').slice(0, -2).join('\n') + '\n');
});
console.log(`PASS: ${passed} opportunity payload and parser checks.`);
