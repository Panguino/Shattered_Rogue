/**
 * Engine and boost cues for Shattered Slop.
 *
 * The sustained cues are generated with loop: true and written as WAV rather
 * than MP3. MP3 encoding pads both ends of the file with silence, which is
 * inaudible on a one-shot and a repeating tick on anything that loops.
 *
 * Boost is a 0.4s dash on a 3s cooldown, not a held state, so it is authored as
 * a one-shot burst. A boost loop would only ever play a fraction of its first
 * cycle and would never reach the sustained roar it exists to provide.
 *
 * Usage:
 *   node art/audio/generate_engine_sfx.mjs [cueName ...] [--dry-run]
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runCues } from "./lib/elevenlabs.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_ROOT = join(HERE, "elevenlabs", "sfx");

/*
 * Every sustained prompt insists on constant pitch and level. Left to itself the
 * model tells a little story - a rev, a swell, a pass-by - and any of those turn
 * into an obvious pulse once the clip repeats every few seconds. The ship's
 * dynamics come from modulating these in engine off ThrusterGlowAlpha, so the
 * source needs to be deliberately inert.
 */
const CUES = {
  engineIdleHum: {
    file: join("movement", "engine_hum_idle_v01.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    prompt:
      "A small spacecraft sitting at idle: a steady low electric motor hum with a soft " +
      "turbine undertone beneath it, smooth and continuous, held at exactly constant pitch " +
      "and volume throughout. Quiet and unobtrusive. Seamless continuous loop with no " +
      "beginning and no end. No revving, no pitch change, no swelling, no clicks, no wind " +
      "gusts, no radio chatter, no music.",
  },
  // Too bright to fly with - a whine at around 4 kHz over the low end - but the
  // steadiest and most bass-heavy source of the set, so v07 to v09 are derived
  // from it. Held back from default runs for that reason: regenerating it would
  // silently change what those are built on.
  engineDriveHum: {
    file: join("movement", "engine_hum_drive_v01.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    superseded: true,
    prompt:
      "A rocket-powered arcade car engine held flat out at full throttle: a bright electric " +
      "whine layered over a punchy motor drone, energetic and video-game-like, absolutely " +
      "constant in pitch and level from start to finish. Seamless continuous loop. No gear " +
      "changes, no revving up or down, no doppler pass-by, no tyre squeal, no music.",
  },
  engineDriveWhine: {
    file: join("movement", "engine_hum_drive_v02.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    prompt:
      "A small fighter craft thruster running hard: a tight high turbine whine over a smooth " +
      "jet drone, aggressive and clean, unwavering in pitch and volume. Seamless continuous " +
      "loop. No surging, no rev, no explosion, no wind buffeting, no crackle, no music.",
  },

  /*
   * Deeper round. The takes above measured bass-heavy in raw energy but carried a
   * thin bright layer at around 4 kHz, and on a sustained sound that layer is the
   * whole perceived character - it read as a high whine no matter what the energy
   * balance said. So these prompts refuse top end explicitly, and the last two
   * also filter it off rather than trusting the model to leave it out.
   */
  // Superseded: came back at 6.6 kHz, brighter than the take it was meant to fix.
  engineDeepRumble: {
    file: join("movement", "engine_hum_drive_v03.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    superseded: true,
    prompt:
      "A large spacecraft engine heard from inside the hull: a deep low-frequency rumble " +
      "with a slow subsonic throb underneath it, warm and rounded, felt more than heard. " +
      "Quiet, smooth and unobtrusive, holding exactly constant pitch and volume. Seamless " +
      "continuous loop. No high whine, no hiss, no turbine scream, no metallic ring, no rev, " +
      "no music.",
  },
  // Superseded, and the clearest evidence that these prompts do not steer tone:
  // asking for a muffled bass hum with no top end returned 20.9 kHz of hiss with
  // the low end 18.8 dB down.
  engineReactorDrone: {
    file: join("movement", "engine_hum_drive_v04.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    superseded: true,
    prompt:
      "A heavy reactor droning below deck: a thick low bass hum with a soft slow pulse in it, " +
      "muffled as if heard through a bulkhead, dark and mellow with no top end at all. " +
      "Absolutely constant in level and pitch. Seamless continuous loop. No whine, no hiss, " +
      "no sparkle, no clanking, no swelling, no music.",
  },
  // Superseded: filtering worked, but a 40 Hz fundamental on a weak source is a
  // rumble that vanishes on laptop speakers rather than a deep engine.
  engineDeepFiltered: {
    file: join("movement", "engine_hum_drive_v05.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    lowpassHz: 700,
    superseded: true,
    prompt:
      "A big ion drive running steady: a deep round bass drone with a gentle low growl inside " +
      "it, calm and continuous, sitting far back. Constant pitch and constant volume " +
      "throughout. Seamless continuous loop. No high frequencies, no whine, no hiss, no " +
      "crackle, no rev, no music.",
  },
  // Superseded for the same reason as v05, and less steady than the derivations.
  engineSubtleHum: {
    file: join("movement", "engine_hum_drive_v06.wav"),
    duration: 6,
    outputFormat: "pcm_44100",
    loop: true,
    lowpassHz: 1100,
    superseded: true,
    prompt:
      "A quiet spacecraft engine at cruise: a soft low hum, smooth and almost featureless, " +
      "barely present. Dark and warm with no brightness whatsoever. Perfectly constant in " +
      "pitch and volume. Seamless continuous loop. No whine, no hiss, no turbine, no rev, " +
      "no texture changes, no music.",
  },

  /*
   * Derived from v01 rather than generated. Prompting for darkness failed twice
   * over - v03 and v04 came back brighter than the take they were meant to
   * improve on - while v01 was already the steadiest and most bass-heavy source
   * and only needed its top end removed. Filtering it is reproducible; rolling
   * the dice on another generation is not.
   *
   * The two fully filtered attempts above landed near a 40 Hz fundamental, which
   * is deep enough to disappear on small speakers. These cutoffs are the search
   * for the point where the whine goes but the engine still has definition.
   *
   * The 0.6s crossfade was measured, not chosen. Because the source is itself
   * already crossfaded, seam quality depends on where in it the blend regions
   * land, and sweeping the length gives a jagged result rather than a trend:
   * 0.3s leaves a 3.6 dB step across the seam while 0.6s leaves 0.5 dB, against
   * a 1.4 dB median difference between neighbouring windows elsewhere in the
   * file. Re-tune this if the source take changes.
   */
  engineDarkNarrow: {
    file: join("movement", "engine_hum_drive_v07.wav"),
    from: join("movement", "engine_hum_drive_v01.wav"),
    loop: true,
    loopCrossfade: 0.6,
    lowpassHz: 1000,
  },
  // Live in the project as A_Engine_Drive. The middle cutoff, because the pawn
  // also plays this below unity pitch, which darkens it further at runtime.
  engineDarkMid: {
    file: join("movement", "engine_hum_drive_v08.wav"),
    from: join("movement", "engine_hum_drive_v01.wav"),
    loop: true,
    loopCrossfade: 0.6,
    lowpassHz: 1600,
    promoted: true,
  },
  engineDarkWide: {
    file: join("movement", "engine_hum_drive_v09.wav"),
    from: join("movement", "engine_hum_drive_v01.wav"),
    loop: true,
    loopCrossfade: 0.6,
    lowpassHz: 2400,
  },

  // Roughly a second so the burn has an attack, a body and a decay. The ship's
  // 0.4s of thrust sits under the front of that and the tail rings out past it,
  // which is what the exhaust trail does visually already.
  boostBurst: {
    file: join("movement", "engine_boost_burst_v01.wav"),
    duration: 1,
    outputFormat: "pcm_44100",
    prompt:
      "A rocket boost fires on a fast vehicle: a sharp ignition thump, an immediate surge " +
      "into a bright jet roar, then a quick clean drop away as the burn cuts out. Punchy and " +
      "arcade, close up. One short burst only. No idling engine, no doppler pass-by, no " +
      "explosion, no debris, no music.",
  },
  // Live in the project as A_Boost_Burst. Spends itself in about 0.6s, which is
  // the closest of the two takes to the 0.4s burn.
  boostWhoosh: {
    file: join("movement", "engine_boost_burst_v02.wav"),
    duration: 1,
    outputFormat: "pcm_44100",
    promoted: true,
    prompt:
      "A short afterburner kick: a fast airy whoosh with a crackling rocket flare igniting " +
      "inside it, rising quickly and dropping away just as fast. Light and speedy rather " +
      "than heavy. One burst only. No explosion, no idling engine, no wind ambience, no music.",
  },
};

await runCues({ cues: CUES, outRoot: OUT_ROOT, root: ROOT, argv: process.argv.slice(2) });
