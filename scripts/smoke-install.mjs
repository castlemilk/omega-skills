import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2] ?? root;
const installer = 'skills@1.7.4';
const skillNames = ['beneb-logo', 'discover-ai-business-opportunities'];
const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run this smoke test with npm run test:install');
const project = await mkdtemp(join(tmpdir(), 'omega-skills-install-'));

function run(args) {
  // npm exec is the npx execution route. Calling its JavaScript entry point
  // avoids depending on a platform-specific npx shell or .cmd wrapper.
  const result = spawnSync(process.execPath, [
    npmCli, 'exec', '--yes', '--prefer-offline', '--fetch-retries=0',
    '--fetch-timeout=20000', '--package', installer, '--', 'skills', ...args,
  ], {
    cwd: project,
    env: { ...process.env, DISABLE_TELEMETRY: '1', NO_COLOR: '1', CI: '1' },
    encoding: 'utf8',
    timeout: 55000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `Installer failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

async function payload(directory) {
  const result = {};
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      assert(!entry.isSymbolicLink(), `--copy produced a symlink: ${path}`);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) {
        const key = relative(directory, path).split(sep).join('/');
        result[key] = createHash('sha256').update(await readFile(path)).digest('hex');
      }
    }
  }
  await walk(directory);
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

try {
  const listed = run(['add', source, '--list']);
  for (const skillName of skillNames) {
    assert(listed.includes(skillName), `The CLI did not discover ${skillName}`);
    console.log(`PASS: ${installer} discovers ${skillName} from ${source}`);
  }

  run(['add', source, '--skill', ...skillNames, '--agent', 'codex', 'claude-code', '--copy', '--yes']);
  for (const skillName of skillNames) {
    const expected = await payload(join(root, 'skills', skillName));
    const installedLocations = [
      ['Codex', join(project, '.agents', 'skills', skillName)],
      ['Claude Code', join(project, '.claude', 'skills', skillName)],
    ];
    for (const [agent, location] of installedLocations) {
      assert.deepEqual(await payload(location), expected, `${agent} ${skillName} payload differs from the source`);
      console.log(`PASS: ${agent} ${skillName} installation contains all ${Object.keys(expected).length} unchanged skill files`);
    }
  }
  console.log('PASS: isolated project installation; no global skill installation requested.');
} finally {
  await rm(project, { recursive: true, force: true });
}

