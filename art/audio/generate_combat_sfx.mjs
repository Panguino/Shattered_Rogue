/**
 * Short combat cues for Shattered Slop.
 *
 * Running with no arguments regenerates only the cues still being auditioned;
 * see lib/elevenlabs.mjs for why superseded and promoted cues are held back.
 *
 * Usage:
 *   node art/audio/generate_combat_sfx.mjs [cueName ...] [--dry-run]
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runCues } from "./lib/elevenlabs.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_ROOT = join(HERE, "elevenlabs", "sfx");

const CUES = {
  // Superseded: read as a realistic energy weapon rather than an arcade one.
  laser: {
    file: join("weapons", "laser_cannon_rapid_v01.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    // The API's minimum generation is 500 ms, but the live cannon fires every
    // 125 ms. Keep the useful transient and get out before the next shot.
    trimSeconds: 0.105,
    superseded: true,
    prompt:
      "One extremely short rapid-fire sci-fi laser cannon shot from a small fighter. " +
      "A tight bright electrical snap with a tiny plasma chirp, immediate hard stop, " +
      "dry and punchy. No charge-up, no tail, no echo, no explosion, no burst of multiple shots.",
  },
  // A "pew" is a pitch bend, not a click, so these run longer than the v01 snap
  // even though the cannon's 125 ms cadence has not changed. Overlapping tails
  // are what makes a rapid arcade weapon sound continuous instead of stuttered.
  laserArcade: {
    file: join("weapons", "laser_cannon_rapid_v02.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.16,
    prompt:
      "A classic retro arcade cabinet laser shot: bright high-pitched square wave pew " +
      "sweeping quickly downward in pitch, chiptune 8-bit video game blaster, thin and " +
      "synthetic, snappy attack. Single shot only. No reverb, no echo, no explosion, " +
      "no realistic weapon, no burst of multiple shots.",
  },
  // Superseded: measured as a *rising* 4.3-6kHz tone that held a steady level,
  // which is the opposite shape to a pew and why it read as synthetic.
  laserArcadeBright: {
    file: join("weapons", "laser_cannon_rapid_v03.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.12,
    superseded: true,
    prompt:
      "An 8-bit chiptune spaceship shooting sound: very high pitched short pew zap with a " +
      "fast downward pitch bend, square and pulse wave, tinny retro game console tone, dry " +
      "and immediate. Single shot only. No tail, no echo, no explosion, no realistic laser.",
  },
  /*
   * Cartoon-blaster round. The arcade takes above read as synthetic because a
   * square wave is mostly harmonics and no body; a traditional screen "pew" is a
   * clean tone falling in pitch with some physical resonance behind it, which is
   * why the prompts below ask for cable twang and spring reverb and explicitly
   * refuse chiptune and noise. These run 200-320ms against a 125ms firing
   * cadence, so voices overlap by design: that is what makes repeat fire sound
   * continuous instead of chopped. If one turns to mush when held down, it is a
   * FireRate conversation, not a shorter trim.
   */
  laserTwang: {
    file: join("weapons", "laser_cannon_rapid_v04.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.3,
    prompt:
      "A classic science fiction blaster shot made the traditional way: a hammer striking a " +
      "long taut steel cable, close-miked, with a fast downward pitch drop and bright metallic " +
      "spring resonance ringing off it. Warm and physical rather than digital. Single shot. " +
      "No chiptune, no static, no explosion, no echo chamber.",
  },
  laserRayGun: {
    file: join("weapons", "laser_cannon_rapid_v05.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.32,
    prompt:
      "A retro cartoon ray gun zap: one clean tonal oscillator sliding quickly downward in " +
      "pitch with a slight warble, bright and musical, trailed by a soft spring reverb tail. " +
      "Playful and old fashioned, like a 1950s film serial. Single shot. No noise, no " +
      "distortion, no chiptune buzz, no explosion.",
  },
  laserCartoonPew: {
    file: join("weapons", "laser_cannon_rapid_v06.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.2,
    prompt:
      "A cartoon laser gun pew: one clean bright tone falling fast in pitch, smooth and round " +
      "and almost vocal, with a little air after it. Light and comedic. Single shot only. " +
      "No buzz, no static, no distortion, no explosion, no echo.",
  },
  laserSpringZap: {
    file: join("weapons", "laser_cannon_rapid_v07.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.28,
    prompt:
      "A cartoon spaceship laser with a springy twang: sharp attack, quick descending pitch " +
      "bend, and a short boing of spring reverb behind it. Bouncy and organic rather than " +
      "electronic. Single shot. No chiptune, no noise wash, no explosion, no long tail.",
  },
  // Live in the project as A_Cannon_Laser. An octave of downward pitch bend
  // (866Hz to 423Hz) over a decaying tail, which is the shape a "pew" actually is.
  laserBlasterWarm: {
    file: join("weapons", "laser_cannon_rapid_v08.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.22,
    promoted: true,
    prompt:
      "A warm analog blaster shot from a small fighter: a round synthesized tone with a fast " +
      "downward sweep, gentle tape saturation, and a short bright tail that cuts away cleanly. " +
      "Musical and smooth rather than harsh or fizzy. Single shot. No static, no glitch, " +
      "no chiptune, no explosion.",
  },

  rock: {
    file: join("impacts", "laser_asteroid_impact_v01.mp3"),
    duration: 0.6,
    prompt:
      "One very short laser bolt striking a dense rocky asteroid: sharp energy tick, " +
      "brittle stone chip and tiny mineral crack, immediate stop. Dry close-up impact. " +
      "No explosion, no rumble, no ricochet, no weapon firing sound, no long debris.",
  },
  // Kept: the impact itself landed. What it lacks is the rebound, so the two
  // variants below extend it rather than replace the character.
  hull: {
    file: join("collisions", "ship_asteroid_hull_smash_v01.mp3"),
    duration: 1.1,
    superseded: true,
    prompt:
      "A heavy rock slams once into the hollow steel hull plate of a small spacecraft: " +
      "deep concave metal bang, buckling sheet steel, short internal hollow resonance, " +
      "a few stone fragments. Weighty and alarming. No explosion, no engine, no scrape, no glass.",
  },
  // A bounce needs room for a second, quieter contact, so these are longer than
  // the single smash. "Boat" is the right weight reference but drags water in
  // with it, hence the explicit exclusions.
  hullBounce: {
    file: join("collisions", "ship_asteroid_hull_smash_v02.mp3"),
    duration: 1.6,
    prompt:
      "A massive steel ship hull bounces off a rock: deep hollow low-frequency metal boom, " +
      "long resonant clang of a huge empty steel plate, then a lighter secondary rebound " +
      "thud as it glances away and the ring dies out. The weight of a boat hull striking a " +
      "dock. No water, no splash, no explosion, no engine, no voices.",
  },
  hullBounceHeavy: {
    file: join("collisions", "ship_asteroid_hull_smash_v03.mp3"),
    duration: 1.8,
    prompt:
      "An enormous heavy metal object collides and bounces: giant hollow steel container " +
      "struck once by rock, low booming resonance and metallic wobble, then a second softer " +
      "bounce impact and a long dying ring. Great mass and momentum, slow and lumbering. " +
      "No water, no splash, no explosion, no glass, no voices.",
  },
  // Superseded: realistic ion crackle, where the rest of the kit is arcade.
  shield: {
    file: join("shields", "shield_damage_impact_v01.mp3"),
    duration: 0.75,
    superseded: true,
    prompt:
      "One sci-fi energy shield taking damage: compact electric thump, bright ion crackle, " +
      "brief glassy force-field ripple and fast decay. Protective energy absorbs the hit. " +
      "No metal collision, no explosion, no alarm, no voice, no long tail.",
  },
  shieldArcade: {
    file: join("shields", "shield_damage_impact_v02.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.3,
    prompt:
      "Retro arcade video game shield hit: bright chiptune blip, square wave descending boop, " +
      "short FM synth buzz, 16-bit game console damage sound, synthetic and musical, dry and " +
      "snappy. No realistic metal, no reverb, no explosion, no alarm, no voice.",
  },
  shieldArcadeChip: {
    file: join("shields", "shield_damage_impact_v03.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.26,
    prompt:
      "8-bit arcade energy shield absorbing a hit: quick two-tone chiptune warble, pulse wave, " +
      "fast downward pitch bend with a tiny noise burst, retro game console sound chip, dry and " +
      "immediate. No realistic metal, no explosion, no voice, no long tail.",
  },
};

await runCues({ cues: CUES, outRoot: OUT_ROOT, root: ROOT, argv: process.argv.slice(2) });
