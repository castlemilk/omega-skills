import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { execute } from '../skills/beneb-logo/scripts/curate.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const now = () => '2026-01-01T00:00:00.000Z';

async function fixture(t, count = 3) {
  const directory = await mkdtemp(join(tmpdir(), 'beneb-curation-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'curation.json');
  const call = (command, ...args) => execute([command, '--state', path, ...args], { now });
  await call('init');
  if (count) await call('batch', '--count', String(count));
  const register = (number, name = `Image ${number}`, image = `image://test/${number}`) => call('register', '--batch', 'B001', '--number', String(number), '--name', name, '--image', image);
  const feedback = (kind, ids, key, ...extra) => call('feedback', '--kind', kind, '--ids', ids, '--key', key, '--text', `User says ${kind} ${ids}`, ...extra);
  return { directory, path, call, register, feedback, bytes: () => readFile(path, 'utf8') };
}

async function unchanged(f, operation, pattern) {
  const before = await f.bytes();
  await assert.rejects(operation, pattern);
  assert.equal(await f.bytes(), before);
  assert(!((await readdir(f.directory)).includes('curation.json.lock')));
}

test('initialization is idempotent and preserves existing state', async t => {
  const f = await fixture(t);
  const before = await f.bytes();
  assert.equal((await f.call('init')).created, false);
  assert.equal(await f.bytes(), before);
});

test('independent stores have immutable collection IDs exposed by every command', async t => {
  const first = await fixture(t);
  const second = await fixture(t);
  const firstId = (await first.call('show')).collectionId;
  const secondId = (await second.call('show')).collectionId;
  assert.match(firstId, /^[0-9a-f-]{36}$/);
  assert.notEqual(firstId, secondId);
  assert.equal((await first.call('init')).collectionId, firstId);
  assert.equal((await first.register(1)).collectionId, firstId);
  const gallery = await first.call('present', '--batch', 'B001');
  assert.equal(gallery.collectionId, firstId);
  assert.equal((await first.call('show', '--gallery', 'G001')).collectionId, firstId);
  const selected = await first.feedback('select', '1', 'turn-1', '--gallery', 'G001');
  assert.equal(selected.collectionId, firstId);
  assert.equal((await first.call('undo', '--event', selected.event.id, '--key', 'turn-2', '--text', 'Undo')).collectionId, firstId);
  assert.equal((await first.call('batch', '--count', '2')).collectionId, firstId);
});

test('batches allocate stable increasing IDs and reject invalid counts without writes', async t => {
  const f = await fixture(t);
  assert.equal((await f.call('batch', '--count', '1')).id, 'B002');
  for (const count of ['0', '-1', '1.5', 'ten', '9007199254740992']) {
    await unchanged(f, () => f.call('batch', '--count', count), /positive whole number/);
  }
  assert.equal((await f.call('batch', '--count', '5')).id, 'B003');
});

test('registration preserves revisions and frozen gallery selections', async t => {
  const f = await fixture(t);
  assert.equal((await f.register(1)).revision.id, 'B001-01-r1');
  await f.register(2);
  const first = await f.call('present', '--batch', 'B001');
  assert.equal(first.id, 'G001');
  assert.equal((await f.register(1, 'Revised', 'image://test/1-revised')).revision.id, 'B001-01-r2');
  const feedback = await f.feedback('select', '1', 'turn-1', '--gallery', 'G001');
  assert.deepEqual(feedback.event.ids, ['B001-01-r1']);
  assert.deepEqual(await f.call('show', '--gallery', 'G001'), first);
  const second = await f.call('present', '--batch', 'B001');
  assert.equal(second.items[0].revisionId, 'B001-01-r2');
  assert.equal(second.items[0].name, 'Revised');
  assert.equal((await f.call('show')).state.batches[0].slots[0].revisions.length, 2);
  await unchanged(f, () => f.feedback('select', 'B001-01-r2', 'turn-2', '--gallery', 'G001'), /not in G001/);
});

test('registration rejects missing and out-of-range data atomically', async t => {
  const f = await fixture(t, 1);
  await unchanged(f, () => f.register(2), /exceeds/);
  await unchanged(f, () => f.register(1, '', 'image://test/a'), /nonempty/);
  assert.equal((await f.call('show')).state.batches[0].slots.length, 0);
});

test('partial galleries retain original numbers and reject unresolved slots', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.register(3);
  const gallery = await f.call('present', '--batch', 'B001', '--numbers', '3,1');
  assert.deepEqual(gallery.items.map(item => item.number), [3, 1]);
  await unchanged(f, () => f.call('present', '--batch', 'B001', '--numbers', '1,2'), /no registered image/);
  await unchanged(f, () => f.call('present', '--batch', 'B001', '--numbers', '1,1'), /distinct/);
});

test('bare numbers and stable slot IDs need a gallery while revision IDs are explicit', async t => {
  const f = await fixture(t);
  await f.register(1);
  await unchanged(f, () => f.feedback('select', '1', 'turn-1'), /explicit --gallery/);
  await unchanged(f, () => f.feedback('select', 'B001-01', 'turn-1'), /explicit --gallery/);
  const result = await f.feedback('select', 'B001-01-r1', 'turn-1');
  assert.equal(result.event.galleryId, null);
  assert.deepEqual(result.event.ids, ['B001-01-r1']);
  await unchanged(f, () => f.feedback('select', 'B001-02-r1', 'turn-2'), /Unknown revision/);
});

test('invalid feedback references never partially record an event', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.call('present', '--batch', 'B001');
  await unchanged(f, () => f.feedback('select', '1,2', 'turn-1', '--gallery', 'G001'), /not in G001/);
  await unchanged(f, () => f.feedback('select', '1,B001-01-r1', 'turn-1', '--gallery', 'G001'), /same image more than once/);
  await unchanged(f, () => f.feedback('select', '1', 'turn-1', '--gallery', 'G999'), /Unknown gallery/);
  assert.equal((await f.call('show')).state.events.length, 0);
});

test('feedback keys make exact retries idempotent and reject key reuse', async t => {
  const f = await fixture(t);
  await f.register(1);
  const first = await f.feedback('select', 'B001-01-r1', 'turn-1');
  const before = await f.bytes();
  const retried = await f.feedback('select', 'B001-01-r1', 'turn-1');
  assert.equal(first.idempotent, false);
  assert.equal(retried.idempotent, true);
  assert.deepEqual(retried.event, first.event);
  assert.equal(await f.bytes(), before);
  await unchanged(f, () => f.feedback('reject', 'B001-01-r1', 'turn-1'), /different request/);
});

test('selecting one image leaves unmentioned images unrated', async t => {
  const f = await fixture(t);
  for (let n = 1; n <= 3; n++) await f.register(n);
  await f.call('present', '--batch', 'B001');
  await f.feedback('select', '2', 'turn-1', '--gallery', 'G001');
  assert.deepEqual((await f.call('show')).dispositions, { 'B001-02-r1': { kind: 'select', eventId: 'F001' } });
});

test('prefer records pairwise evidence without selecting or rejecting either side', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.register(2);
  await f.call('present', '--batch', 'B001');
  const result = await f.feedback('prefer', '2', 'turn-1', '--over', '1', '--gallery', 'G001');
  assert.deepEqual(result.event.ids, ['B001-02-r1']);
  assert.deepEqual(result.event.over, ['B001-01-r1']);
  assert.deepEqual((await f.call('show')).dispositions, {});
  await unchanged(f, () => f.feedback('prefer', '1', 'turn-2', '--over', '1', '--gallery', 'G001'), /cannot also/);
  await unchanged(f, () => f.feedback('prefer', '1', 'turn-2', '--gallery', 'G001'), /required only/);
  await unchanged(f, () => f.feedback('select', '1', 'turn-2', '--over', '2', '--gallery', 'G001'), /required only/);
});

test('latest explicit disposition wins while prior evidence remains in history', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.feedback('select', 'B001-01-r1', 'turn-1');
  await f.feedback('reject', 'B001-01-r1', 'turn-2');
  await f.feedback('neutral', 'B001-01-r1', 'turn-3');
  const shown = await f.call('show');
  assert.deepEqual(shown.dispositions['B001-01-r1'], { kind: 'neutral', eventId: 'F003' });
  assert.equal(shown.activeFeedback.length, 3);
});

test('undo appends a retraction and restores the earlier disposition', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.feedback('select', 'B001-01-r1', 'turn-1');
  await f.feedback('reject', 'B001-01-r1', 'turn-2');
  const result = await f.call('undo', '--event', 'F002', '--key', 'turn-3', '--text', 'Undo that rejection');
  assert.equal(result.event.id, 'U003');
  const shown = await f.call('show');
  assert.equal(shown.state.events.length, 3);
  assert.deepEqual(shown.activeFeedback.map(event => event.id), ['F001']);
  assert.deepEqual(shown.dispositions['B001-01-r1'], { kind: 'select', eventId: 'F001' });
  const before = await f.bytes();
  assert.equal((await f.call('undo', '--event', 'F002', '--key', 'turn-3', '--text', 'Undo that rejection')).idempotent, true);
  assert.equal(await f.bytes(), before);
});

test('retrying an undone feedback key does not reactivate it', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.feedback('select', 'B001-01-r1', 'turn-1');
  await f.call('undo', '--event', 'F001', '--key', 'turn-2', '--text', 'Undo');
  await f.feedback('select', 'B001-01-r1', 'turn-1');
  assert.deepEqual((await f.call('show')).activeFeedback, []);
  await f.feedback('select', 'B001-01-r1', 'turn-3');
  assert.deepEqual((await f.call('show')).activeFeedback.map(event => event.id), ['F003']);
});

test('undo rejects missing targets, undo events and duplicate retractions', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.feedback('select', 'B001-01-r1', 'turn-1');
  await unchanged(f, () => f.call('undo', '--event', 'F999', '--key', 'turn-2', '--text', 'Undo'), /Unknown feedback/);
  await f.call('undo', '--event', 'F001', '--key', 'turn-2', '--text', 'Undo');
  await unchanged(f, () => f.call('undo', '--event', 'F001', '--key', 'turn-3', '--text', 'Undo again'), /already undone/);
  await unchanged(f, () => f.call('undo', '--event', 'U002', '--key', 'turn-3', '--text', 'Undo undo'), /Unknown feedback/);
});

test('feedback and undo share the same idempotency key namespace', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.feedback('select', 'B001-01-r1', 'turn-1');
  await unchanged(f, () => f.call('undo', '--event', 'F001', '--key', 'turn-1', '--text', 'Undo'), /different request/);
});

test('exact user text including whitespace and line breaks is retained', async t => {
  const f = await fixture(t);
  await f.register(1);
  const text = '  I like 1.\nKeep its gap, please.  ';
  const result = await f.call('feedback', '--kind', 'select', '--ids', 'B001-01-r1', '--key', 'turn-1', '--text', text);
  assert.equal(result.event.text, text);
  assert.equal((await f.call('show')).state.events[0].request.text, text);
});

test('read commands preserve state bytes and create no lock or temp files', async t => {
  const f = await fixture(t);
  const before = await f.bytes();
  const modified = (await stat(f.path)).mtimeMs;
  await f.call('show');
  assert.equal(await f.bytes(), before);
  assert.equal((await stat(f.path)).mtimeMs, modified);
  assert.deepEqual(await readdir(f.directory), ['curation.json']);
});

test('invalid JSON is never reset by init or a mutation', async t => {
  const f = await fixture(t);
  await writeFile(f.path, '{broken');
  await unchanged(f, () => f.call('init'), /not valid JSON/);
  await unchanged(f, () => f.call('batch', '--count', '1'), /not valid JSON/);
});

test('semantic corruption is rejected before writing', async t => {
  const f = await fixture(t);
  await f.register(1);
  await f.call('present', '--batch', 'B001');
  const state = JSON.parse(await f.bytes());
  state.galleries[0].items[0].revisionId = 'B001-01-r999';
  await writeFile(f.path, JSON.stringify(state));
  await unchanged(f, () => f.call('batch', '--count', '1'), /Invalid curation state/);
  state.galleries = [];
  state.batches[0].count = true;
  await writeFile(f.path, JSON.stringify(state));
  await unchanged(f, () => f.call('batch', '--count', '1'), /Invalid curation state/);
});

test('an existing writer lock prevents mutation and is never deleted by another writer', async t => {
  const f = await fixture(t);
  const before = await f.bytes();
  await writeFile(`${f.path}.lock`, 'another writer');
  await assert.rejects(() => f.call('batch', '--count', '2'), /locked by another writer/);
  assert.equal(await f.bytes(), before);
  assert.equal(await readFile(`${f.path}.lock`, 'utf8'), 'another writer');
  assert.equal((await f.call('show')).state.batches.length, 1);
});

test('concurrent writers either serialize or fail cleanly without losing a batch', async t => {
  const f = await fixture(t);
  const results = await Promise.allSettled([f.call('batch', '--count', '2'), f.call('batch', '--count', '4')]);
  const successful = results.filter(result => result.status === 'fulfilled');
  assert(successful.length >= 1);
  const state = (await f.call('show')).state;
  assert.equal(state.batches.length, successful.length + 1);
  assert.deepEqual(state.batches.map(batch => batch.id), ['B001', 'B002', 'B003'].slice(0, state.batches.length));
  for (const result of results.filter(result => result.status === 'rejected')) assert.match(result.reason.message, /locked/);
  assert.deepEqual(await readdir(f.directory), ['curation.json']);
});

test('state inside the installed skill or a package cache is rejected', async t => {
  const f = await fixture(t);
  const inside = join(root, 'skills', 'beneb-logo', 'forbidden-state.json');
  await assert.rejects(() => execute(['init', '--state', inside]), /outside the installed skill/);
  await assert.rejects(() => execute(['init', '--state', join(f.directory, 'node_modules', 'forbidden.json')]), /outside package caches/);
});

test('a missing read target is not initialized implicitly', async t => {
  const f = await fixture(t);
  const missing = join(f.directory, 'missing', 'state.json');
  await assert.rejects(() => execute(['show', '--state', missing]), /run init first/);
  assert.deepEqual(await readdir(f.directory), ['curation.json']);
});

test('help and parser failures do not require or modify project state', async () => {
  assert.match(await execute(['--help']), /feedback --kind/);
  await assert.rejects(() => execute(['wat']), /Unknown command/);
  await assert.rejects(() => execute(['init', '--count', '2']), /Unknown option/);
  await assert.rejects(() => execute(['init', '--state', '/unused', '--state', '/unused']), /Repeated option/);
});
