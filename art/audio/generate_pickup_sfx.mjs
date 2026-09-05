/**
 * Pickup and kill cues for Shattered Slop: XP orb, boost orb, hostile
 * destroyed. All three want to read as arcade rewards, not as physics.
 *
 * Usage:
 *   node art/audio/generate_pickup_sfx.mjs [cueName ...] [--dry-run]
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runCues } from "./lib/elevenlabs.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_ROOT = join(HERE, "elevenlabs", "sfx");

const CUES = {
  // --- XP orb: rapid pickups, many per second when a cloud of orbs lands.
  // Short, bright, rising, so a burst of them stacks into a run rather than
  // a smear. Trimmed to well under half a second.
  xpCoin: {
    file: join("pickups", "xp_orb_v01.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.32,
    prompt:
      "A classic arcade coin pickup: two quick bright square-wave notes rising a fifth, " +
      "8-bit chiptune, crisp attack, instant stop. Single pickup only. No echo, no reverb, " +
      "no tail, no explosion.",
  },
  xpChime: {
    promoted: true,
    file: join("pickups", "xp_orb_v02.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.4,
    prompt:
      "A tiny glass crystal chime for collecting a glowing energy orb in a video game: " +
      "one clean bell tone with a fast upward pitch flick and a sparkle of high harmonics, " +
      "sweet and satisfying, very short. Single pickup. No reverb tail, no echo.",
  },
  xpBloop: {
    file: join("pickups", "xp_orb_v03.wav"),
    duration: 0.5,
    outputFormat: "pcm_44100",
    trimSeconds: 0.3,
    prompt:
      "A bubbly synth 'bloop' pickup blip from a modern arcade game: a soft round sine pop " +
      "sliding up in pitch with a tiny bright tick on top, playful and juicy, extremely short. " +
      "Single pickup. No reverb, no echo.",
  },

  // --- Boost orb: rarer and worth more, so it gets weight and a longer
  // sweep. Still under a second.
  boostPowerUp: {
    file: join("pickups", "boost_orb_v01.wav"),
    duration: 0.9,
    outputFormat: "pcm_44100",
    trimSeconds: 0.7,
    prompt:
      "A retro arcade power-up: a fast rising synth sweep climbing three octaves ending on a " +
      "bright confirming ding, 16-bit console energy, punchy and triumphant, short. " +
      "Single sound. No echo, no reverb tail, no voice.",
  },
  boostCell: {
    file: join("pickups", "boost_orb_v02.wav"),
    duration: 0.9,
    outputFormat: "pcm_44100",
    trimSeconds: 0.7,
    prompt:
      "Sci-fi fuel cell slotting home: a solid mechanical clack followed by a quick electric " +
      "hum swelling up in pitch and a bright chime accent, satisfying and chunky, arcade " +
      "styled, short. Single sound. No reverb, no echo.",
  },
  boostWhoosh: {
    promoted: true,
    file: join("pickups", "boost_orb_v03.wav"),
    duration: 0.9,
    outputFormat: "pcm_44100",
    trimSeconds: 0.7,
    prompt:
      "An energy orb absorbed into a spaceship: a quick bright whoosh sucking inward, then a " +
      "deep warm synth thump with a glittering high sparkle on top, arcade game reward, " +
      "punchy, short. Single sound. No long reverb tail.",
  },

  // --- Hostile destroyed: the payoff. Three different weights.
  killArcade8bit: {
    superseded: true,
    file: join("impacts", "enemy_destroyed_v01.mp3"),
    duration: 1.1,
    prompt:
      "A classic 8-bit arcade enemy explosion: a burst of white noise with a fast downward " +
      "pitch drop, crunchy bit-crushed decay, retro cabinet blaster game, punchy and short. " +
      "Single explosion. No reverb, no realistic fire, no debris.",
  },
  killPunchy: {
    superseded: true,
    file: join("impacts", "enemy_destroyed_v02.mp3"),
    duration: 1.2,
    prompt:
      "A modern arcade space shooter enemy kill: a tight bassy thump impact with a crunchy " +
      "distorted crack, a short synth zap sizzle, and a brief bright sparkle of debris, " +
      "satisfying and juicy, stylised not realistic. Single explosion. No long tail, no echo.",
  },
  killKaboom: {
    superseded: true,
    file: join("impacts", "enemy_destroyed_v03.mp3"),
    duration: 1.4,
    prompt:
      "A chunky retro 16-bit console spaceship explosion: deep sub-bass boom, a crackling " +
      "mid-range crunch, and a quick descending noise sweep, cartoonish and satisfying, " +
      "punchy. Single explosion. No reverb wash, no realistic rubble.",
  },

  // --- Flagship: bigger, longer, a real event.
  flagshipBoom: {
    superseded: true,
    file: join("impacts", "flagship_destroyed_v01.mp3"),
    duration: 2.4,
    prompt:
      "A huge arcade boss ship explosion: a rapid chain of three crunchy stylised blasts " +
      "building into one massive deep sub-bass boom with a long crackling debris decay and " +
      "a rising victory synth shimmer underneath. Retro space shooter, punchy, dramatic. " +
      "Single event. No voice.",
  },
  flagshipCrumble: {
    superseded: true,
    file: join("impacts", "flagship_destroyed_v02.mp3"),
    duration: 2.4,
    prompt:
      "A giant space cruiser breaking apart in a video game: a deep groaning metallic " +
      "rumble, then a colossal low-frequency detonation with layers of crunching metal and " +
      "sparking electrical bursts trailing off. Stylised arcade, heavy and satisfying. " +
      "Single event. No voice, no music.",
  },

  // --- Asteroid shattered: the crumble cut down to a rock. Shorter, drier,
  // stony rather than metallic, no detonation under it.
  rockCrumble: {
    superseded: true,
    file: join("impacts", "asteroid_shatter_v01.mp3"),
    duration: 0.9,
    prompt:
      "A space rock cracking apart in a stylised arcade game: a sharp stony crack, a short " +
      "crunchy rubble crumble with a few gravel chips scattering, dry and punchy, brief. " +
      "Single break. No explosion, no metal, no reverb tail.",
  },
  rockCrunch: {
    promoted: true,
    file: join("impacts", "asteroid_shatter_v02.mp3"),
    duration: 0.9,
    prompt:
      "A boulder shattering into pieces, video game style: a deep low thud with a crackling " +
      "rock split and a quick tumble of debris, chunky and satisfying, short. Single break. " +
      "No explosion fire, no metal, no long tail.",
  },

  // --- Asteroid, round two: gravel scrape rather than a crack.
  rockGravelScrape: {
    superseded: true,
    file: join("impacts", "asteroid_shatter_v03.mp3"),
    duration: 0.9,
    prompt:
      "Loose gravel and small stones scraping and sliding against rock, a quick dry grinding " +
      "scrape with pebbles skittering, short and gritty, stylised for a video game. Single " +
      "scrape. No explosion, no metal, no reverb.",
  },
  rockGravelCrunch: {
    superseded: true,
    file: join("impacts", "asteroid_shatter_v04.mp3"),
    duration: 0.9,
    prompt:
      "A boot grinding through coarse gravel: a crunchy stony scrape that starts sharp and " +
      "trails into scattering grit, dry, close, brief. Video game asteroid breaking apart. " +
      "Single sound. No explosion, no metal, no echo.",
  },
  rockGravelSlide: {
    superseded: true,
    file: join("impacts", "asteroid_shatter_v05.mp3"),
    duration: 1.0,
    prompt:
      "A small rockslide of gravel and rubble pouring and scraping down a stone slope for " +
      "under a second, gritty and granular with a soft low rumble underneath, stylised. " +
      "Single slide. No explosion, no metal, no long tail.",
  },

  // --- Hostile destroyed, round two: metal clank rather than a boom.
  killClank: {
    superseded: true,
    file: join("impacts", "enemy_destroyed_v04.mp3"),
    duration: 1.0,
    prompt:
      "A heavy hollow metal clank: a steel drum struck hard once with a short ringing " +
      "resonance and a couple of smaller metal pieces clattering after it, arcade video game " +
      "enemy destroyed, punchy and satisfying. Single hit. No explosion, no reverb wash.",
  },
  killScrapyard: {
    promoted: true,
    file: join("impacts", "enemy_destroyed_v05.mp3"),
    duration: 1.1,
    prompt:
      "Scrap metal collapsing in a video game: a sharp iron clang followed by a quick tumble " +
      "of clanking steel plates and bolts bouncing, dry and chunky, short. Single collapse. " +
      "No explosion, no fire, no long echo.",
  },
  killAnvil: {
    superseded: true,
    file: join("impacts", "enemy_destroyed_v06.mp3"),
    duration: 1.0,
    prompt:
      "A blacksmith anvil struck by a sledgehammer with a crushed low thud under it and a " +
      "brief metallic ring, stylised arcade impact for a robot enemy dying, tight and " +
      "satisfying. Single strike. No explosion, no reverb tail.",
  },
  killCrunchClank: {
    superseded: true,
    file: join("impacts", "enemy_destroyed_v07.mp3"),
    duration: 1.1,
    prompt:
      "A metal machine crumpling: a crunching buckle of sheet steel then a hollow clank as a " +
      "part drops off and rolls, cartoonish arcade video game, short and dry. Single event. " +
      "No explosion, no fire, no echo.",
  },

  // --- Level up: the bar filled. A real fanfare moment, one to two seconds.
  levelFanfare: {
    file: join("pickups", "level_up_v01.mp3"),
    duration: 1.6,
    prompt:
      "A triumphant retro arcade level-up jingle: a quick ascending four-note synth arpeggio " +
      "in a major key ending on a bright held chord with a sparkling shimmer, 16-bit console, " +
      "punchy and joyful, short. Single jingle. No voice, no drums, no long reverb.",
  },
  levelChiptune: {
    file: join("pickups", "level_up_v02.mp3"),
    duration: 1.4,
    prompt:
      "An 8-bit chiptune level up: a fast rising square-wave run of six notes then two " +
      "bright staccato chords, classic arcade cabinet, tight and celebratory. Single jingle. " +
      "No voice, no reverb.",
  },
  levelPowerSurge: {
    file: join("pickups", "level_up_v03.mp3"),
    duration: 1.8,
    prompt:
      "A spaceship powering up to a new level in an arcade game: a rising energy surge sweep " +
      "building for a second, then a big bright synth chord hit with a glittering cascade of " +
      "high sparkles trailing off, triumphant and satisfying. Single event. No voice, no drums.",
  },
  levelBell: {
    file: join("pickups", "level_up_v04.mp3"),
    duration: 1.6,
    prompt:
      "A rank-up chime for a sci-fi game: three ascending clear bell tones, each brighter than " +
      "the last, landing on a warm sustained synth pad swell with a soft shimmer, clean and " +
      "rewarding, short. Single chime. No voice, no drums, no long echo.",
  },
};

await runCues({ cues: CUES, outRoot: OUT_ROOT, root: ROOT, argv: process.argv.slice(2) });
