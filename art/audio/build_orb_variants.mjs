/**
 * Deterministic audition round: blend the actual XP chime (2) and bloop (3),
 * then build level-up cascades from those same rendered pickups. No API calls.
 * node art/audio/build_orb_variants.mjs [--archive]
 * --archive moves the previous XP/level-up set once, preserving hashes/history.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const ROOT = dirname(fileURLToPath(import.meta.url));
const ARCHIVE = 'archive/2026-09-05-orb-round-1/sfx/pickups';
const OUTPUT = 'derived/sfx/pickups';
const RATE = 44100;
const catalogPath = join(ROOT, 'catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
assert(!catalog.entries.some(e => e.id === 'xp_orb_v04' && e.status === 'archived'),
  'Round 2 was rejected and archived. Use generate_orb_physical.mjs + build_orb_physical.mjs; this historical recipe must not republish rejected candidates.');
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
function local(file) {
  const full = resolve(ROOT, file);
  const rel = relative(ROOT, full);
  assert(rel && !rel.startsWith('..') && !isAbsolute(rel), `Outside audio workspace: ${file}`);
  return full;
}
const oldEntries = catalog.entries.filter(e => /^(xp_orb_v0[123]|level_up_v0[1234])$/.test(e.id));
if (process.argv.includes('--archive')) {
  // Resolve and validate every target before moving the first file.
  const moves = oldEntries.map(e => {
    const target = `${ARCHIVE}/${e.file.split('/').at(-1)}`;
    const source = local(e.file), dest = local(target);
    assert(existsSync(source), `Missing archive source: ${e.file}`);
    assert(source === dest || !existsSync(dest), `Archive destination exists: ${target}`);
    return { e, source, dest, target, sha: hash(source) };
  });
  for (const { e, source, dest, target, sha } of moves) {
    mkdirSync(dirname(dest), { recursive: true });
    if (source !== dest) renameSync(source, dest);
    assert.equal(hash(dest), sha);
    if (e.status !== 'archived') e.previousStatus = e.status;
    e.status = 'archived';
    e.file = target;
    e.sourceSha256 = sha;
    e.group = 'sfx-pickups-archive';
    e.archivedAt = '2026-09-05';
  }
  writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
}

function readWav(file) {
  const b = readFileSync(local(file));
  assert.equal(b.toString('ascii', 0, 4), 'RIFF');
  assert.equal(b.toString('ascii', 8, 12), 'WAVE');
  let fmt, data;
  for (let i = 12; i + 8 <= b.length;) {
    const n = b.readUInt32LE(i + 4), id = b.toString('ascii', i, i + 4);
    assert(i + 8 + n <= b.length, 'Truncated WAV');
    if (id === 'fmt ') fmt = b.subarray(i + 8, i + 8 + n);
    if (id === 'data') data = b.subarray(i + 8, i + 8 + n);
    i += 8 + n + (n % 2);
  }
  assert(fmt && data, 'WAV chunks missing');
  assert.equal(fmt.readUInt16LE(0), 1, 'PCM required');
  assert.equal(fmt.readUInt16LE(2), 1, 'Mono required');
  assert.equal(fmt.readUInt32LE(4), RATE);
  assert.equal(fmt.readUInt16LE(14), 16);
  return Float64Array.from({ length: data.length / 2 }, (_, i) => data.readInt16LE(i * 2) / 32768);
}
const peak = a => a.reduce((p, v) => Math.max(p, Math.abs(v)), 0);
const rms = a => Math.sqrt(a.reduce((s, v) => s + v * v, 0) / a.length);
function fade(a, start = 0.002, end = 0.025) {
  const head = Math.round(start * RATE), tail = Math.round(end * RATE);
  for (let i = 0; i < a.length; i++) {
    a[i] *= Math.min(1, i / Math.max(1, head), (a.length - 1 - i) / Math.max(1, tail));
  }
  return a;
}
function prepare(a) {
  // Remove DC, align audible onset, and RMS-match the two source timbres.
  const mean = a.reduce((s, v) => s + v, 0) / a.length;
  a = a.map(v => v - mean);
  const threshold = peak(a) * 0.025;
  const onset = a.findIndex(v => Math.abs(v) > threshold);
  a = a.slice(Math.max(0, onset - 44));
  const gain = 0.16 / rms(a);
  return fade(a.map(v => v * gain));
}
const sources = ['xp_orb_v02', 'xp_orb_v03'].map(id => {
  const entry = catalog.entries.find(e => e.id === id);
  assert(entry, `Missing reference ${id}`);
  return { id, file: entry.file, sha256: hash(local(entry.file)), samples: prepare(readWav(entry.file)) };
});
function renderWav(file, input, targetDb = -9) {
  const a = fade(input.slice(), 0.002, 0.025);
  assert(peak(a) > 0 && a.every(Number.isFinite));
  const gain = 10 ** (targetDb / 20) / peak(a);
  const b = Buffer.alloc(44 + a.length * 2);
  b.write('RIFF'); b.writeUInt32LE(b.length - 8, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(RATE, 24); b.writeUInt32LE(RATE * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36);
  b.writeUInt32LE(a.length * 2, 40);
  for (let i = 0; i < a.length; i++) b.writeInt16LE(Math.round(a[i] * gain * 32767), 44 + 2 * i);
  mkdirSync(dirname(local(file)), { recursive: true });
  writeFileSync(local(file), b);
  const check = readWav(file);
  assert(peak(check) < 0.5 && rms(check) > 0.005, 'Silent or over-loud output');
  assert.equal(check[0], 0); assert.equal(check.at(-1), 0);
  const stats = { durationSec: +(check.length / RATE).toFixed(3), peakDb: +(20 * Math.log10(peak(check))).toFixed(2), rmsDb: +(20 * Math.log10(rms(check))).toFixed(2) };
  console.log(JSON.stringify({ file, ...stats }));
  return { samples: check, stats };
}
const options = [
  { v: '04', label: 'Glass bubble', chime: 0.70, length: 0.38, notes: [0, 2, 4, 7, 9, 12, 14, 16], gap: 0.17, acceleration: 0.91 },
  { v: '05', label: 'Crystal bloop', chime: 0.55, length: 0.36, notes: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21], gap: 0.17, acceleration: 0.93 },
  { v: '06', label: 'Round sparkle', chime: 0.40, length: 0.34, notes: [0, 0, 4, 4, 7, 7, 12, 12, 16, 19, 21, 24], gap: 0.16, acceleration: 0.92 },
  { v: '07', label: 'Soft bubble', chime: 0.25, length: 0.32, notes: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31], gap: 0.18, acceleration: 0.94 },
];
const entries = [];
for (const o of options) {
  const [chime, bloop] = sources.map(s => s.samples);
  const mix = Float64Array.from({ length: Math.round(o.length * RATE) }, (_, i) =>
    (chime[i] ?? 0) * o.chime + (bloop[i] ?? 0) * (1 - o.chime));
  const id = `xp_orb_v${o.v}`, file = `${OUTPUT}/${id}.wav`;
  const pickup = renderWav(file, mix);
  const recipe = `Blend existing XP orb 2 crystal chime (${Math.round(o.chime * 100)}%) and orb 3 round bloop (${Math.round((1 - o.chime) * 100)}%); align attacks, RMS-match sources, fade to silence. No fresh model generation.`;
  entries.push({ id, title: `XP orb ${o.v} — ${o.label}`, kind: 'sfx', group: 'sfx-orb-round-2', status: 'candidate', file, ...pickup.stats, model: 'local sample blend', generatedAt: '2026-09-05', note: `${recipe} Paired with level-up ${Number(o.v) + 1 < 10 ? '0' : ''}${Number(o.v) + 1}.`, prompt: recipe, sources: sources.map(({ samples, ...s }) => s) });

  // Sample-rate pitch shifts intentionally shorten later pickups as the run builds.
  const events = [];
  let time = 0;
  o.notes.forEach((semitones, i) => {
    events.push({ time, semitones, gain: 0.40 + 0.60 * i / (o.notes.length - 1) });
    time += o.gap * o.acceleration ** i;
  });
  const last = o.notes.at(-1);
  [0, 4, 7].forEach((n, i) => events.push({ time: time + i * 0.027, semitones: Math.min(last, 24) + n, gain: 0.62 }));
  const total = Math.max(...events.map(e => e.time + pickup.samples.length / RATE / 2 ** (e.semitones / 12))) + 0.025;
  const level = new Float64Array(Math.ceil(total * RATE));
  for (const e of events) {
    const speed = 2 ** (e.semitones / 12), start = Math.round(e.time * RATE);
    for (let i = 0; i * speed < pickup.samples.length - 1; i++) {
      const position = i * speed, index = Math.floor(position), fraction = position - index;
      level[start + i] += (pickup.samples[index] * (1 - fraction) + pickup.samples[index + 1] * fraction) * e.gain;
    }
  }
  const levelId = `level_up_v${String(Number(o.v) + 1).padStart(2, '0')}`;
  const levelFile = `${OUTPUT}/${levelId}.wav`;
  const rendered = renderWav(levelFile, level, -7);
  const levelRecipe = `${o.notes.length} repetitions of ${id}, rising in pitch and gain with accelerating spacing, ending in three closely layered orb pickups. Every sound is the actual pickup sample; no separate fanfare or instrument. Semitones: ${o.notes.join(', ')}; initial spacing ${o.gap}s, multiplier ${o.acceleration}.`;
  entries.push({ id: levelId, title: `Level up ${String(Number(o.v) + 1).padStart(2, '0')} — ${o.label} buildup`, kind: 'sfx', group: 'sfx-level-up-round-2', status: 'candidate', file: levelFile, ...rendered.stats, model: 'local orb cascade', generatedAt: '2026-09-05', note: levelRecipe, prompt: levelRecipe, sources: [{ id, file, sha256: hash(local(file)) }] });
}
const newIds = new Set(entries.map(e => e.id));
catalog.entries = [...entries, ...catalog.entries.filter(e => !newIds.has(e.id))];
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Ready: ${entries.length} candidates; source recordings and archived catalog history retained.`);
