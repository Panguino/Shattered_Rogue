/** Fresh physical orb sources. Existing recordings are never overwritten.
 * node art/audio/generate_orb_physical.mjs [clink|bag|smash|heavy] [--dry-run]
 * Then: node art/audio/build_orb_physical.mjs
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCues } from './lib/elevenlabs.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const sourceRoot = 'elevenlabs/sfx/pickups/orb-round-3-sources';
const constraints = ' Dry isolated game SFX. Immediate attack, short decay to silence. No water, bubbles, bloops, rubber pops, pitch sweeps, synth tones, music, voices, ambience or reverb.';
export const cues = {
  clink: {
    file: 'orb_glass_clink.wav', duration: 0.8, outputFormat: 'pcm_44100',
    prompt: 'Two small solid glass marbles strike together once: a crisp high glass TINK, a tiny tick just after it, a delicate inharmonic crystal ring dying away. Sparse, precise, light and clear. One hard contact, not a chime melody.' + constraints,
  },
  bag: {
    file: 'orb_bag_rattle.wav', duration: 1.1, outputFormat: 'pcm_44100',
    prompt: 'One brisk shake of a cloth bag packed with solid glass marbles. Many irregular dry hard clacks and bead collisions rattle rapidly then settle. Midrange woody-glassy chatter, slightly muffled by the pouch. Marbles dominate, cloth barely audible. No sustained ring.' + constraints,
  },
  smash: {
    file: 'orb_crystal_smash.wav', duration: 0.9, outputFormat: 'pcm_44100',
    prompt: 'A handful of brittle crystal orbs smashed together in one sharp forceful impact. Immediate crunchy CRASH, dense fractured-glass crackle, then a brief irregular scatter of tinkling hard fragments. Compact reward smash: brittle and noisy, not musical. No cinematic boom.' + constraints,
  },
  heavy: {
    file: 'orb_heavy_fracture.wav', duration: 0.8, outputFormat: 'pcm_44100',
    prompt: 'One heavy solid mineral orb cracks against another. A low midrange stone KLOCK with a sharp ceramic fracture, then two granular chips settle. Thick, blunt, earthy and weighty: polished quartz billiard balls cracking. Minimal high ringing. No explosion or bass drop.' + constraints,
  },
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const requested = argv.filter(a => !a.startsWith('--'));
  const names = requested.length ? requested : Object.keys(cues);
  for (const name of names) {
    if (!cues[name]) throw new Error(`Unknown cue: ${name}`);
    if (cues[name].prompt.length > 450) throw new Error(`Prompt too long: ${name}`);
  }
  const missing = names.filter(name => !existsSync(join(HERE, sourceRoot, cues[name].file)));
  for (const name of names.filter(n => !missing.includes(n))) console.log(`KEEP existing source: ${name}`);
  if (missing.length) await runCues({ cues, outRoot: join(HERE, sourceRoot), root: join(HERE, '..', '..'), argv: [...missing, ...argv.filter(a => a.startsWith('--'))] });
  else console.log('All source recordings exist; no API requests or credits spent.');
}
