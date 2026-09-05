/** Round 3: four independent physical recordings and four collision buildups.
 * No API calls. Preserves rejected round 2 with hashes and catalog history.
 * node art/audio/build_orb_physical.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { cues, sourceRoot } from './generate_orb_physical.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const RATE = 44100;
const OUT = 'derived/sfx/pickups/orb-round-3';
const ARCHIVE = 'archive/2026-09-05-orb-round-2/sfx/pickups';
const catalogPath = join(ROOT, 'catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
function local(file) {
  const full = resolve(ROOT, file), rel = relative(ROOT, full);
  assert(rel && !rel.startsWith('..') && !isAbsolute(rel), `Outside audio workspace: ${file}`);
  return full;
}
const hash = file => createHash('sha256').update(readFileSync(local(file))).digest('hex');
function readWav(file) {
  const b = readFileSync(local(file));
  assert.equal(b.toString('ascii', 0, 4), 'RIFF');
  assert.equal(b.toString('ascii', 8, 12), 'WAVE');
  let fmt, data;
  for (let i = 12; i + 8 <= b.length;) {
    const size = b.readUInt32LE(i + 4), id = b.toString('ascii', i, i + 4);
    assert(i + 8 + size <= b.length, 'Truncated WAV');
    if (id === 'fmt ') fmt = b.subarray(i + 8, i + 8 + size);
    if (id === 'data') data = b.subarray(i + 8, i + 8 + size);
    i += 8 + size + size % 2;
  }
  assert(fmt && data && data.length > 0 && data.length % 2 === 0);
  assert.equal(fmt.readUInt16LE(0), 1);
  assert.equal(fmt.readUInt16LE(2), 1);
  assert.equal(fmt.readUInt32LE(4), RATE);
  assert.equal(fmt.readUInt16LE(14), 16);
  return Float64Array.from({ length: data.length / 2 }, (_, i) => data.readInt16LE(i * 2) / 32768);
}
const peak = a => a.reduce((p, v) => Math.max(p, Math.abs(v)), 0);
const rms = a => Math.sqrt(a.reduce((s, v) => s + v * v, 0) / a.length);
function prepare(a, maxSeconds) {
  const mean = a.reduce((s, v) => s + v, 0) / a.length;
  a = a.map(v => v - mean);
  const threshold = peak(a) * 0.015;
  const first = a.findIndex(v => Math.abs(v) > threshold);
  const last = a.findLastIndex(v => Math.abs(v) > threshold);
  assert(first >= 0 && last > first, 'Empty source');
  return a.slice(Math.max(0, first - 66), Math.min(a.length, last + 1103, Math.max(0, first - 66) + Math.round(maxSeconds * RATE)));
}
function render(file, input, level = false) {
  const a = input.slice();
  for (let i = 0; i < a.length; i++) a[i] *= Math.min(1, i / 44, (a.length - 1 - i) / 1103);
  assert(peak(a) > 0 && a.every(Number.isFinite));
  // Approximate loudness matching without a limiter: leave transient headroom.
  const gain = Math.min(10 ** ((level ? -7 : -9) / 20) / peak(a), 10 ** ((level ? -22 : -24) / 20) / rms(a));
  const b = Buffer.alloc(44 + a.length * 2);
  b.write('RIFF'); b.writeUInt32LE(b.length - 8, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(RATE, 24); b.writeUInt32LE(RATE * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36);
  b.writeUInt32LE(a.length * 2, 40);
  for (let i = 0; i < a.length; i++) b.writeInt16LE(Math.round(a[i] * gain * 32767), 44 + i * 2);
  mkdirSync(dirname(local(file)), { recursive: true });
  writeFileSync(local(file), b);
  const check = readWav(file);
  assert(peak(check) < 0.5 && rms(check) > 0.003);
  assert.equal(check[0], 0); assert.equal(check.at(-1), 0);
  const stats = { durationSec: +(check.length / RATE).toFixed(3), peakDb: +(20 * Math.log10(peak(check))).toFixed(2), rmsDb: +(20 * Math.log10(rms(check))).toFixed(2) };
  console.log(JSON.stringify({ file, ...stats }));
  return { samples: check, stats };
}

// Validate every input before rendering or moving history.
const raw = Object.fromEntries(Object.entries(cues).map(([key, cue]) => [key, readWav(`${sourceRoot}/${cue.file}`)]));
const pickups = [
  { key: 'clink', id: 'xp_orb_v08', title: 'Glass clink', max: 0.48, note: 'Sparse high glass contact with a short ring: the light, clean option.' },
  { key: 'bag', id: 'xp_orb_v09', title: 'Bag of orbs', max: 0.85, note: 'Many irregular, slightly muffled hard bead collisions in one pouch shake: the busy rattling option.' },
  { key: 'smash', id: 'xp_orb_v10', title: 'Orb smash', max: 0.72, note: 'One brittle impact with crunchy fracture and scattered glass fragments: the aggressive option.' },
  { key: 'heavy', id: 'xp_orb_v11', title: 'Heavy orb crack', max: 0.58, note: 'Low-mid mineral contact and ceramic fracture: the blunt, weighty option.' },
];
const entries = [], prepared = {};
for (const o of pickups) {
  const file = `${OUT}/${o.id}.wav`, source = `${sourceRoot}/${cues[o.key].file}`;
  const rendered = render(file, prepare(raw[o.key], o.max));
  // Match event levels for layering without flattening each sound's envelope.
  prepared[o.key] = rendered.samples.map(v => v * (0.12 / rms(rendered.samples)));
  entries.push({ id: o.id, title: `XP orb ${o.id.slice(-2)} - ${o.title}`, kind: 'sfx', group: 'sfx-orb-round-3', status: 'candidate', file, ...rendered.stats, model: 'eleven_text_to_sound_v2 + local edit', generatedAt: '2026-09-05', note: `${o.note} Fresh independent physical recording, not a blend of the old chime/bloop. Attack-aligned, length capped, edge fades and headroom applied. No game import yet.`, prompt: cues[o.key].prompt, sources: [{ file: source, sha256: hash(source) }] });
}

const levels = [
  { id: 'level_up_v09', title: 'Clink collection', keys: ['clink'], count: 10, gap: 0.19, acceleration: 0.89, finale: 'bag', finish: 0.8, note: 'Individual glass contacts gather speed and strength, resolving in a collected handful of orbs.' },
  { id: 'level_up_v10', title: 'Bag overload', keys: ['bag', 'heavy', 'bag'], count: 9, gap: 0.23, acceleration: 0.89, finale: 'bag', finish: 1.1, note: 'Successive bag rattles overlap more densely with low hard knocks underneath; ends in a concentrated double handful.' },
  { id: 'level_up_v11', title: 'Crack into smash', keys: ['heavy', 'clink', 'heavy'], count: 11, gap: 0.19, acceleration: 0.91, finale: 'smash', finish: 1.3, note: 'Heavy cracks and light contacts accelerate into a single broad crystal smash.' },
  { id: 'level_up_v12', title: 'Orb avalanche', keys: ['clink', 'bag', 'heavy', 'smash'], count: 17, gap: 0.21, acceleration: 0.9, finale: 'smash', finish: 1.25, note: 'All four textures accumulate from sparse contacts to a dense collision rush, finishing with a smash and settling beads.' },
];
for (const o of levels) {
  const events = [];
  let time = 0;
  for (let i = 0; i < o.count; i++) {
    events.push({ key: o.keys[i % o.keys.length], time, gain: 0.15 + 0.65 * (i / (o.count - 1)) ** 1.35, semitones: [-1.2, 0.6, -0.4, 1.5, 0][i % 5] });
    time += o.gap * o.acceleration ** i;
  }
  events.push({ key: o.finale, time, gain: o.finish, semitones: 0 });
  if (o.id === 'level_up_v10') events.push({ key: 'bag', time: time + 0.07, gain: 0.65, semitones: -1.5 });
  if (o.id === 'level_up_v12') events.push({ key: 'bag', time: time + 0.09, gain: 0.6, semitones: 0 });
  const total = Math.max(...events.map(e => e.time + prepared[e.key].length / RATE / 2 ** (e.semitones / 12))) + 0.025;
  const samples = new Float64Array(Math.ceil(total * RATE));
  for (const e of events) {
    const source = prepared[e.key], speed = 2 ** (e.semitones / 12), start = Math.round(e.time * RATE);
    for (let i = 0; i * speed < source.length - 1; i++) {
      const pos = i * speed, index = Math.floor(pos), f = pos - index;
      samples[start + i] += (source[index] * (1 - f) + source[index + 1] * f) * e.gain;
    }
  }
  const file = `${OUT}/${o.id}.wav`, rendered = render(file, samples, true);
  const used = [...new Set(events.map(e => e.key))].map(key => entries.find(e => e.id === pickups.find(p => p.key === key).id));
  const recipe = `${o.note} Buildup uses accelerating impacts, increasing gain and overlapping collisions; no synth riser or ascending bloop melody. Small fixed per-hit tuning variation only (+/-1.5 semitones), no pitch sweeps.`;
  entries.push({ id: o.id, title: `Level up ${o.id.slice(-2)} - ${o.title}`, kind: 'sfx', group: 'sfx-level-up-round-3', status: 'candidate', file, ...rendered.stats, model: 'local physical orb assembly', generatedAt: '2026-09-05', note: recipe, prompt: recipe, events, sources: used.map(e => ({ id: e.id, file: e.file, sha256: hash(e.file) })) });
}

// Round-2 rejection is retained, never deleted. Preflight all exact local paths.
const old = catalog.entries.filter(e => /^(xp_orb_v0[4567]|level_up_v0[5678])$/.test(e.id) && e.status !== 'promoted');
const moves = old.map(e => {
  const target = `${ARCHIVE}/${e.file.split('/').at(-1)}`;
  const source = local(e.file), dest = local(target);
  assert(existsSync(source), `Missing source: ${source}`);
  assert(source === dest || !existsSync(dest), `Archive collision: ${dest}`);
  return { e, source, dest, previous: e.file, target, sha: hash(e.file) };
});
for (const m of moves) {
  mkdirSync(dirname(m.dest), { recursive: true });
  if (m.source !== m.dest) renameSync(m.source, m.dest);
  assert.equal(hash(m.target), m.sha);
  if (m.e.status !== 'archived') m.e.previousStatus = m.e.status;
  Object.assign(m.e, { status: 'archived', group: 'sfx-orb-round-2-archive', file: m.target, sourceSha256: m.sha, archivedAt: '2026-09-05', review: 'Rejected: all variants sound too similar and too bubble-like. Keep the buildup idea, but use distinct hard physical orb sounds, including bags and smashes; no bubble sounds.' });
}
for (const e of catalog.entries) for (const source of e.sources ?? []) {
  const move = moves.find(m => m.previous === source.file);
  if (move) source.file = move.target;
}
const ids = new Set(entries.map(e => e.id));
catalog.entries = [...entries, ...catalog.entries.filter(e => !ids.has(e.id))];
assert.equal(new Set(catalog.entries.map(e => e.id)).size, catalog.entries.length, 'Duplicate catalog IDs');
for (const e of entries) for (const source of e.sources) assert.equal(hash(source.file), source.sha256);
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Ready: ${entries.length} physical candidates; ${moves.length} rejected blends preserved in archive. Unreal unchanged.`);
