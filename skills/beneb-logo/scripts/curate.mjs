#!/usr/bin/env node
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { lstat, mkdir, open, readFile, realpath, rename, unlink } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const kinds = new Set(['select', 'reject', 'neutral', 'prefer']);
const flags = {
  init: ['state'],
  batch: ['state', 'count', 'label'],
  register: ['state', 'batch', 'number', 'name', 'image'],
  present: ['state', 'batch', 'numbers'],
  feedback: ['state', 'kind', 'ids', 'gallery', 'key', 'text', 'over'],
  undo: ['state', 'event', 'key', 'text'],
  show: ['state', 'gallery'],
};

export const help = `beneb-logo curation store (Node.js 22 or later)

Every command except help requires --state PATH, outside the installed skill.

  init
  batch --count N [--label TEXT]
  register --batch B001 --number 1 --name NAME --image IMAGE_REFERENCE
  present --batch B001 [--numbers 1,2]
  feedback --kind select|reject|neutral|prefer --ids 2,5 --gallery G001
           --key MESSAGE_KEY --text EXACT_USER_TEXT [--over 3]
  undo --event F001 --key MESSAGE_KEY --text EXACT_USER_TEXT
  show [--gallery G001]

Examples:
  node curate.mjs init --state ./beneb/curation.json
  node curate.mjs batch --state ./beneb/curation.json --count 10
  node curate.mjs feedback --state ./beneb/curation.json --kind select \\
    --ids 2,5 --gallery G001 --key turn-17 --text 'I like 2 and 5'

Batches allocate B001, B002, ... . Registration preserves every revision:
B001-01-r1, B001-01-r2, ... . Present freezes a gallery such as G001.
All IDs are scoped to the immutable collectionId UUID created by init and
returned by every JSON command. Retain that UUID when combining archives.
Bare numbers and slot IDs require --gallery; full revision IDs do not.
Present records a gallery the host actually displayed; it does not display images.
Image references are opaque: the host must verify accessibility and inspect pixels.
Feedback keys make retries idempotent. Prefer records a comparison without
selecting or rejecting either side. Undo appends a retraction and preserves history.
Show is read-only. It returns raw state, active feedback and current dispositions.
The store records evidence; it does not infer tastes or train a model.
`;

function requireValue(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} must be nonempty text`);
  return value;
}

function positiveInteger(value, name) {
  if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`${name} must be a positive whole number`);
  if (typeof value === 'string' && !/^[1-9]\d*$/.test(value)) throw new Error(`${name} must be a positive whole number`);
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) throw new Error(`${name} must be a positive whole number`);
  return number;
}

const id = (prefix, number) => `${prefix}${String(number).padStart(3, '0')}`;
const slotId = (batch, number) => `${batch}-${String(number).padStart(2, '0')}`;
const revisionId = (slot, number) => `${slot}-r${number}`;
const jsonEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function list(value, name) {
  const items = requireValue(value, name).split(',').map(item => item.trim());
  if (items.some(item => !item) || new Set(items).size !== items.length) throw new Error(`${name} must contain distinct comma-separated values`);
  return items;
}

function parse(argv) {
  if (!argv.length || argv[0] === 'help' || argv.includes('--help')) return { command: 'help', options: {} };
  const [command, ...rest] = argv;
  if (!flags[command]) throw new Error(`Unknown command: ${command}`);
  const options = {};
  for (let i = 0; i < rest.length; i += 2) {
    const flag = rest[i];
    if (!flag.startsWith('--') || !flags[command].includes(flag.slice(2))) throw new Error(`Unknown option for ${command}: ${flag}`);
    const key = flag.slice(2);
    if (Object.hasOwn(options, key)) throw new Error(`Repeated option: ${flag}`);
    if (i + 1 >= rest.length) throw new Error(`Missing value for ${flag}`);
    options[key] = rest[i + 1];
  }
  requireValue(options.state, '--state');
  return { command, options };
}

function emptyState() {
  return { schemaVersion: 1, collectionId: randomUUID(), batches: [], galleries: [], events: [] };
}

function indexState(state) {
  const batches = new Map(state.batches.map(batch => [batch.id, batch]));
  const revisions = new Map();
  for (const batch of state.batches) {
    for (const slot of batch.slots) {
      for (const revision of slot.revisions) revisions.set(revision.id, { batch, slot, revision });
    }
  }
  return { batches, revisions, galleries: new Map(state.galleries.map(gallery => [gallery.id, gallery])) };
}

function resolveReferences(state, tokens, galleryId) {
  const index = indexState(state);
  const gallery = galleryId ? index.galleries.get(galleryId) : null;
  if (galleryId && !gallery) throw new Error(`Unknown gallery: ${galleryId}`);
  const resolved = tokens.map(token => {
    if (/^B\d{3,}-\d{2,}-r[1-9]\d*$/.test(token)) {
      if (!index.revisions.has(token)) throw new Error(`Unknown revision: ${token}`);
      if (gallery && !gallery.items.some(item => item.revisionId === token)) throw new Error(`Revision ${token} is not in ${gallery.id}`);
      return token;
    }
    if (!gallery) throw new Error(`Reference ${token} requires an explicit --gallery`);
    let item;
    if (/^[1-9]\d*$/.test(token)) item = gallery.items.find(entry => entry.number === positiveInteger(token, 'number'));
    else if (/^B\d{3,}-\d{2,}$/.test(token)) item = gallery.items.find(entry => entry.slotId === token);
    else throw new Error(`Invalid image reference: ${token}`);
    if (!item) throw new Error(`Reference ${token} is not in ${gallery.id}`);
    return item.revisionId;
  });
  if (new Set(resolved).size !== resolved.length) throw new Error('References resolve to the same image more than once');
  return resolved;
}

function validateState(state) {
  try {
    assert(state && state.schemaVersion === 1, 'unsupported schemaVersion');
    assert(typeof state.collectionId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(state.collectionId), 'missing or invalid collectionId');
    for (const field of ['batches', 'galleries', 'events']) assert(Array.isArray(state[field]), `${field} must be an array`);
    const revisions = new Map();
    const batches = new Map();
    for (const [position, batch] of state.batches.entries()) {
      assert.equal(batch.id, id('B', position + 1), 'batch IDs must be monotonic');
      positiveInteger(batch.count, 'batch count');
      assert(batch.label === null || typeof batch.label === 'string', 'invalid batch label');
      requireValue(batch.createdAt, 'batch createdAt');
      assert(Array.isArray(batch.slots), 'slots must be an array');
      const numbers = new Set();
      for (const slot of batch.slots) {
        positiveInteger(slot.number, 'slot number');
        assert(slot.number <= batch.count && !numbers.has(slot.number), 'duplicate or out-of-range slot');
        numbers.add(slot.number);
        assert.equal(slot.id, slotId(batch.id, slot.number), 'invalid slot ID');
        assert(Array.isArray(slot.revisions) && slot.revisions.length > 0, 'slot needs revisions');
        for (const [revisionPosition, revision] of slot.revisions.entries()) {
          assert.equal(revision.id, revisionId(slot.id, revisionPosition + 1), 'invalid revision ID');
          requireValue(revision.name, 'revision name');
          requireValue(revision.image, 'revision image');
          requireValue(revision.createdAt, 'revision createdAt');
          revisions.set(revision.id, { batch, slot, revision });
        }
      }
      batches.set(batch.id, batch);
    }
    for (const [position, gallery] of state.galleries.entries()) {
      assert.equal(gallery.id, id('G', position + 1), 'gallery IDs must be monotonic');
      assert(batches.has(gallery.batchId), 'unknown gallery batch');
      requireValue(gallery.createdAt, 'gallery createdAt');
      assert(Array.isArray(gallery.items) && gallery.items.length > 0, 'gallery needs items');
      const numbers = new Set();
      for (const item of gallery.items) {
        const known = revisions.get(item.revisionId);
        assert(known && known.batch.id === gallery.batchId, 'unknown gallery revision');
        assert.equal(item.number, known.slot.number, 'gallery number mismatch');
        assert.equal(item.slotId, known.slot.id, 'gallery slot mismatch');
        assert.equal(item.name, known.revision.name, 'gallery name mismatch');
        assert.equal(item.image, known.revision.image, 'gallery image mismatch');
        assert(!numbers.has(item.number), 'duplicate gallery number');
        numbers.add(item.number);
      }
    }
    const seen = new Map();
    const keys = new Set();
    const undone = new Set();
    for (const [position, event] of state.events.entries()) {
      assert(event.type === 'feedback' || event.type === 'undo', 'invalid event type');
      assert.equal(event.id, id(event.type === 'feedback' ? 'F' : 'U', position + 1), 'event IDs must be monotonic');
      requireValue(event.key, 'event key');
      requireValue(event.text, 'event text');
      requireValue(event.createdAt, 'event createdAt');
      assert(!keys.has(event.key), 'duplicate event key');
      assert(event.request && typeof event.request === 'object', 'event needs original request');
      assert.equal(event.request.type, event.type, 'request type mismatch');
      assert.equal(event.request.text, event.text, 'request text mismatch');
      if (event.type === 'feedback') {
        assert(kinds.has(event.kind), 'invalid feedback kind');
        assert.equal(event.request.kind, event.kind, 'request kind mismatch');
        assert(event.galleryId === null || typeof event.galleryId === 'string', 'invalid gallery scope');
        assert.equal(event.request.galleryId, event.galleryId, 'request gallery mismatch');
        assert(Array.isArray(event.request.ids) && event.request.ids.length > 0, 'feedback needs references');
        assert(Array.isArray(event.request.over), 'over must be an array');
        assert(jsonEqual(resolveReferences(state, event.request.ids, event.galleryId), event.ids), 'feedback IDs changed');
        assert(jsonEqual(resolveReferences(state, event.request.over, event.galleryId), event.over), 'comparison IDs changed');
        assert(event.kind === 'prefer' ? event.over.length > 0 : event.over.length === 0, 'invalid comparison');
        assert(!event.ids.some(ref => event.over.includes(ref)), 'comparison overlaps');
      } else {
        assert.equal(event.request.eventId, event.targetEventId, 'undo target mismatch');
        assert(seen.get(event.targetEventId)?.type === 'feedback', 'undo needs an earlier feedback event');
        assert(!undone.has(event.targetEventId), 'feedback already undone');
        undone.add(event.targetEventId);
      }
      keys.add(event.key);
      seen.set(event.id, event);
    }
  } catch (error) {
    throw new Error(`Invalid curation state: ${error.message}`);
  }
  return state;
}

async function canonicalPath(path) {
  let ancestor = resolve(path);
  const tail = [];
  while (true) {
    try { return resolve(await realpath(ancestor), ...tail.reverse()); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = dirname(ancestor);
      if (parent === ancestor) throw error;
      tail.push(relative(parent, ancestor));
      ancestor = parent;
    }
  }
}

async function statePathFor(value) {
  const path = resolve(value);
  const canonical = await canonicalPath(path);
  const installed = await realpath(skillRoot);
  if (canonical === installed || canonical.startsWith(installed + sep)) throw new Error('Keep project state outside the installed skill');
  if (canonical.split(sep).some(part => part === '_npx' || part === 'node_modules')) throw new Error('Keep project state outside package caches');
  try {
    const info = await lstat(path);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('The state path must be a regular file, not a symlink');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return canonical;
}

async function readState(path) {
  let source;
  try { source = await readFile(path, 'utf8'); }
  catch (error) {
    if (error.code === 'ENOENT') throw new Error('Curation state does not exist; run init first');
    throw error;
  }
  let state;
  try { state = JSON.parse(source); }
  catch { throw new Error('Curation state is not valid JSON; it has not been reset or overwritten'); }
  return validateState(state);
}

async function atomicWrite(path, state) {
  const temporary = `${path}.tmp-${randomUUID()}`;
  try {
    const file = await open(temporary, 'wx', 0o600);
    try { await file.writeFile(JSON.stringify(state, null, 2) + '\n'); await file.sync(); }
    finally { await file.close(); }
    await rename(temporary, path);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}

async function mutate(path, create, action) {
  if (create) await mkdir(dirname(path), { recursive: true });
  let lock;
  const lockPath = `${path}.lock`;
  try { lock = await open(lockPath, 'wx', 0o600); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error('Curation state is locked by another writer; inspect that operation before retrying');
    throw error;
  }
  try {
    await lock.writeFile(JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }) + '\n');
    let state;
    let created = false;
    try { state = await readState(path); }
    catch (error) {
      if (create && error.message === 'Curation state does not exist; run init first') { state = emptyState(); created = true; }
      else throw error;
    }
    const { result, changed } = action(state, created);
    if (changed) await atomicWrite(path, validateState(state));
    return { collectionId: state.collectionId, ...result };
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}

export function activeFeedback(state) {
  const undone = new Set(state.events.filter(event => event.type === 'undo').map(event => event.targetEventId));
  return state.events.filter(event => event.type === 'feedback' && !undone.has(event.id));
}

function view(state) {
  const active = activeFeedback(state);
  const dispositions = {};
  for (const event of active) {
    if (event.kind === 'prefer') continue;
    for (const revision of event.ids) dispositions[revision] = { kind: event.kind, eventId: event.id };
  }
  return { collectionId: state.collectionId, state, activeFeedback: active, dispositions };
}

function retry(state, key, request) {
  const existing = state.events.find(event => event.key === key);
  if (!existing) return null;
  if (!jsonEqual(existing.request, request)) throw new Error(`Event key ${key} was already used for a different request`);
  return { result: { event: existing, idempotent: true }, changed: false };
}

export async function execute(argv, { now = () => new Date().toISOString() } = {}) {
  const { command, options } = parse(argv);
  if (command === 'help') return help;
  const path = await statePathFor(options.state);
  if (command === 'show') {
    const state = await readState(path);
    if (!options.gallery) return view(state);
    const gallery = state.galleries.find(item => item.id === options.gallery);
    if (!gallery) throw new Error(`Unknown gallery: ${options.gallery}`);
    return { collectionId: state.collectionId, ...gallery };
  }
  return mutate(path, command === 'init', (state, created) => {
    if (command === 'init') return { result: { statePath: path, schemaVersion: 1, created }, changed: created };
    if (command === 'batch') {
      const batch = { id: id('B', state.batches.length + 1), count: positiveInteger(options.count, '--count'), label: options.label ?? null, createdAt: now(), slots: [] };
      state.batches.push(batch);
      return { result: batch, changed: true };
    }
    if (command === 'register') {
      const batch = state.batches.find(item => item.id === requireValue(options.batch, '--batch'));
      if (!batch) throw new Error(`Unknown batch: ${options.batch}`);
      const number = positiveInteger(options.number, '--number');
      if (number > batch.count) throw new Error(`Number ${number} exceeds the requested batch count ${batch.count}`);
      const name = requireValue(options.name, '--name');
      const image = requireValue(options.image, '--image');
      let slot = batch.slots.find(item => item.number === number);
      if (!slot) { slot = { id: slotId(batch.id, number), number, revisions: [] }; batch.slots.push(slot); batch.slots.sort((a, b) => a.number - b.number); }
      const revision = { id: revisionId(slot.id, slot.revisions.length + 1), name, image, createdAt: now() };
      slot.revisions.push(revision);
      return { result: { batchId: batch.id, number, slotId: slot.id, revision }, changed: true };
    }
    if (command === 'present') {
      const batch = state.batches.find(item => item.id === requireValue(options.batch, '--batch'));
      if (!batch) throw new Error(`Unknown batch: ${options.batch}`);
      const numbers = options.numbers ? list(options.numbers, '--numbers').map(value => positiveInteger(value, '--numbers')) : batch.slots.map(slot => slot.number);
      if (!numbers.length) throw new Error('No registered images to present');
      const items = numbers.map(number => {
        const slot = batch.slots.find(item => item.number === number);
        if (!slot) throw new Error(`Number ${number} has no registered image in ${batch.id}`);
        const revision = slot.revisions.at(-1);
        return { number, slotId: slot.id, revisionId: revision.id, name: revision.name, image: revision.image };
      });
      const gallery = { id: id('G', state.galleries.length + 1), batchId: batch.id, createdAt: now(), items };
      state.galleries.push(gallery);
      return { result: gallery, changed: true };
    }
    if (command === 'feedback') {
      const kind = requireValue(options.kind, '--kind');
      if (!kinds.has(kind)) throw new Error(`Unknown feedback kind: ${kind}`);
      const key = requireValue(options.key, '--key');
      const text = requireValue(options.text, '--text');
      const request = { type: 'feedback', kind, galleryId: options.gallery ?? null, ids: list(options.ids, '--ids'), over: options.over ? list(options.over, '--over') : [], text };
      const retried = retry(state, key, request);
      if (retried) return retried;
      const ids = resolveReferences(state, request.ids, request.galleryId);
      const over = resolveReferences(state, request.over, request.galleryId);
      if (kind === 'prefer' ? !over.length : over.length) throw new Error('--over is required only for prefer feedback');
      if (ids.some(ref => over.includes(ref))) throw new Error('A preferred image cannot also be in --over');
      const event = { id: id('F', state.events.length + 1), type: 'feedback', key, kind, text, galleryId: request.galleryId, ids, over, createdAt: now(), request };
      state.events.push(event);
      return { result: { event, idempotent: false }, changed: true };
    }
    if (command === 'undo') {
      const key = requireValue(options.key, '--key');
      const text = requireValue(options.text, '--text');
      const eventId = requireValue(options.event, '--event');
      const request = { type: 'undo', eventId, text };
      const retried = retry(state, key, request);
      if (retried) return retried;
      if (!state.events.some(event => event.id === eventId && event.type === 'feedback')) throw new Error(`Unknown feedback event: ${eventId}`);
      if (!activeFeedback(state).some(event => event.id === eventId)) throw new Error(`Feedback ${eventId} is already undone`);
      const event = { id: id('U', state.events.length + 1), type: 'undo', key, text, targetEventId: eventId, createdAt: now(), request };
      state.events.push(event);
      return { result: { event, idempotent: false }, changed: true };
    }
    throw new Error(`Unsupported command: ${command}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await execute(process.argv.slice(2));
    process.stdout.write(typeof result === 'string' ? result : JSON.stringify(result, null, 2) + '\n');
  } catch (error) {
    process.stderr.write(`curate: ${error.message}\n`);
    process.exitCode = 1;
  }
}
