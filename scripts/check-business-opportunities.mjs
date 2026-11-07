import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillName = 'discover-ai-business-opportunities';
const required = [
  'SKILL.md',
  'agents/openai.yaml',
  'references/continuity.md',
  'references/evaluation.md',
  'references/research-context.md',
  'references/seed-evidence-2026-11-07.csv',
].sort();

// The seed file uses ordinary RFC 4180 quoting, including commas in fields.
export function parseEvidence(text) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { value += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(value); value = ''; }
    else if (char === '\n' && !quoted) {
      row.push(value.replace(/\r$/, '')); rows.push(row); row = []; value = '';
    } else value += char;
  }
  assert(!quoted, 'Unterminated CSV quote');
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}

export async function validateSkill(skillRoot, { quiet = false } = {}) {
  skillRoot = resolve(skillRoot);
  async function filesUnder(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      assert(!entry.isSymbolicLink(), 'Payload must not contain symlinks');
      const path = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await filesUnder(path));
      else if (entry.isFile()) files.push(path);
    }
    return files.sort();
  }
  const files = await filesUnder(skillRoot);
  assert.deepEqual(files.map(path => relative(skillRoot, path).split(sep).join('/')).sort(), required,
    'The payload must contain only the reviewed reusable bundle, not runtime research state');
  let links = 0;
  for (const path of files) {
    const text = await readFile(path, 'utf8');
    assert(text.trim(), `Empty payload: ${path}`);
    assert(!/(?:page_[a-f0-9]{16,}|libfile_[A-Za-z0-9_-]+|library-file:|skill-[a-f0-9]{20,}|chatgpt\.com\/(?:c|space)\/|chatgpt-conversation:|\/workspace\/|\/root\/\.codex\/|\/home\/[^\s/]+\/)/i.test(text),
      `Private host identifier or machine path in ${relative(skillRoot, path)}`);
    assert(!/(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,})/.test(text),
      `Credential-like material in ${relative(skillRoot, path)}`);
    if (!path.endsWith('.md')) continue;
    for (const match of text.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
      const target = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
      const targetPath = resolve(dirname(path), decodeURIComponent(target.split('#')[0]));
      assert(targetPath.startsWith(skillRoot + sep), `Reference escapes bundle: ${target}`);
      assert((await stat(targetPath)).isFile(), `Missing reference: ${target}`);
      links++;
    }
  }
  const skill = await readFile(join(skillRoot, 'SKILL.md'), 'utf8');
  const frontmatter = skill.match(/^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/)?.[1];
  assert(frontmatter, 'Missing YAML frontmatter');
  assert.equal(frontmatter.match(/^name: (.+)$/m)?.[1], skillName);
  const description = frontmatter.match(/^description: (.+)$/m)?.[1];
  assert(description && description.length <= 1024, 'Missing or overly long description');
  assert(skill.split(/\r?\n/).length < 500, 'Entrypoint needs progressive disclosure');
  const metadata = await readFile(join(skillRoot, 'agents/openai.yaml'), 'utf8');
  assert(metadata.match(/^  default_prompt: (.+)$/m)?.[1].includes(`$${skillName}`), 'Wrong default invocation');
  const rows = parseEvidence(await readFile(join(skillRoot, 'references/seed-evidence-2026-11-07.csv'), 'utf8'));
  const [columns, ...records] = rows;
  const ids = columns.indexOf('source_id'), status = columns.indexOf('status'), url = columns.indexOf('url');
  assert(ids >= 0 && status >= 0 && url >= 0, 'Missing evidence columns');
  assert.equal(records.length, 67, 'Historical evidence rows must stay intact');
  assert(records.every(row => row.length === columns.length), 'Malformed evidence row');
  assert.equal(new Set(records.map(row => row[ids])).size, records.length, 'Duplicate source identity');
  assert(records.every(row => /^https?:\/\//.test(row[url])), 'Missing public source URL');
  assert.deepEqual(Object.fromEntries(['retained', 'excluded', 'downgraded'].map(label =>
    [label, records.filter(row => row[status] === label).length])), { retained: 60, excluded: 4, downgraded: 3 });
  if (!quiet) console.log(`PASS: ${skillName}: ${files.length} portable files, ${links} relative links, 67 historical sources.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await validateSkill(join(dirname(fileURLToPath(import.meta.url)), '..', 'skills', skillName));
}
