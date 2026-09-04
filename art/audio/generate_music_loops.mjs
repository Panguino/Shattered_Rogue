/**
 * Loopable combat music for Shattered Slop, plus stem separation.
 *
 * The first round of music came back as musical pieces rather than game loops:
 * they opened quiet, arced to a payoff and ended, which is the wrong shape for
 * audio that has to sit under a run of unknown length. Two things change here.
 *
 * A composition plan replaces the single prompt. Chunks carry their own
 * positive and negative styles, so "no quiet intro" and "no ending" can be
 * stated per chunk instead of being buried in one paragraph the model reads
 * loosely. Durations are bar-aligned: at 150 BPM a bar is 1.6s, so chunks are
 * eight bars each and the whole loop is a whole number of bars. A loop that
 * ends off the grid cannot be fixed later by trimming.
 *
 * Stem separation replaces generating layers separately. Separate generations
 * share a tempo only nominally - they drift in phase and disagree on the beat
 * grid, so they cannot be mixed against each other at runtime. Splitting one
 * take gives layers that were played together and therefore line up by
 * construction, which is what dynamic mixing off combat state needs.
 *
 * Usage:
 *   node art/audio/generate_music_loops.mjs [briefKey ...] [--dry-run] [--stems]
 *   node art/audio/generate_music_loops.mjs --stems-only <path-under-elevenlabs/music>
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

import { creditsUsed, loadEnv } from "./lib/elevenlabs.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const MUSIC_DIR = join(HERE, "elevenlabs", "music");
const API = "https://api.elevenlabs.io";

// The v2 default output format is mp3_48000_192, which the account tier does not
// carry. Asking for it fails the whole request, so the format is always explicit.
const OUTPUT_FORMAT = "mp3_44100_128";

const DEFAULT_BPM = 150;
const BEATS_PER_BAR = 4;
// Sections are written in bars and converted here, so a chunk boundary always
// lands on a downbeat. Eight is the default because it is the shortest section
// that reads as a section rather than as a fill.
const CHUNK_BARS = 8;

const bpmOf = (brief) => brief.bpm ?? DEFAULT_BPM;
const barMsOf = (brief) => Math.round((60000 / bpmOf(brief)) * BEATS_PER_BAR);

// Ambience has no pulse to align to, so those chunks state milliseconds
// directly rather than being forced onto a bar grid that means nothing to them.
const chunkMs = (chunk, brief) =>
  chunk.ms ?? (chunk.bars ?? CHUNK_BARS) * barMsOf(brief);

function planLength(brief) {
  const ms = brief.chunks.reduce((total, chunk) => total + chunkMs(chunk, brief), 0);
  return { ms, bars: ms / barMsOf(brief) };
}

/**
 * Faults called out in review, restated as bans.
 *
 * Split three ways because not every ban belongs on every cue. The beat bans
 * describe a fault a piece with no beat cannot have, and the noise ban is the
 * dangerous one to apply blindly: an ambience of hull creaks and ballast hiss
 * is largely made of the thing it forbids.
 */
/**
 * Bans that exist to keep a loop body usable, and which a track built around
 * fading parts in and out has to be allowed to break. Lifted by `fades: true`,
 * which swaps in a narrower ban on the one fade that would still hurt: the one
 * that takes the end of the track to silence.
 */
const FADE_BANS = ["quiet sparse intro", "fade in", "fade out"];

const NEVER_CORE = [
  ...FADE_BANS,
  "ending, final chord, slowing down",
  "vocals, singing, choir, humming, spoken word, robot voice, vocoder, talking",
  "trailer braams, orchestral stabs",
  "EDM anthem, festival build, big drop",
  "anthemic chorus, triumphant hands-up climax",
  "supersaw chord stabs",
  "sidechain pumping the whole mix",
];

/**
 * The tick entries are the second round of the same note. Round one was told
 * not to loop a heavy two-note figure and answered with a fast single-note one
 * instead, so the ban has to cover the repetition rather than the instrument:
 * anything that repeats one pitch on a fixed subdivision for the whole track.
 */
const NEVER_BEAT = [
  "constant sixteenth-note tick running through the whole track",
  "one note repeated nonstop on a fixed subdivision",
  "metronomic ticking percussion",
  "closed hi-hat or shaker on every sixteenth without variation",
  "unchanging drum pattern for the whole track",
  "repetitive two-note keyboard ostinato",
  "loud pounding four-on-the-floor kick",
  "heavy repetitive beat dominating the mix",
  "percussion louder than the melody",
  "relaxed chill lounge mood",
];

const NEVER_NOISE = ["static, hiss, noise wash"];

/** Stated on every chunk, because the fault it answers recurred on every one. */
const RHYTHM = [
  "percussion pattern changes every few bars with fills, rests and dropouts",
  "hats move between open, closed and absent rather than ticking evenly",
  "bass plays a melodic line with rests in it, not a constant pulse",
  "melodies move through a full phrase of different pitches",
];

/**
 * The machine layer, for the tracks whose enemies are metal creatures.
 *
 * Two modes, because the first attempt got this backwards. Writing the machines
 * as percussion - which is what a generator needs to be told if you want them
 * in time with the music - made them part of the composition, and the take
 * reviewed at 4/10 as a departure from the music it was supposed to decorate.
 * Background noise is the ask, so `ambient` states the opposite: off the beat,
 * quiet, occasional, and explicitly not an instrument.
 *
 * `percussion` is kept because it is a real option for a different cue, not
 * because it worked here.
 */
const MACHINE_AMBIENT_RULES = [
  "machine sounds are background noise, not instruments, and carry no rhythm",
  "they drift off the beat and out of time with the music",
  "quiet and far back in the mix, well under the guitars and keys",
  "sparse and occasional with long gaps, like machinery heard through a bulkhead",
];

const MACHINE_LAYERS = {
  percussion: [
    "mechanical percussion built from struck metal: anvil hits, pipe clangs, hydraulic thuds",
    "heavy servo whirs and motor spin-ups used as rising accents",
    "hydraulic hiss and pneumatic release on section changes",
    "distant heavy metal footfalls of a large walking machine, low and spaced out",
    "metallic scrapes, rusted groans and electrical arcing far back in the mix",
    "machine sounds are musical accents that enter and leave, never a constant pattern",
  ],
  ambient: [
    "faint machine room ambience behind the music: distant metal creaks, servo whines, hydraulic hiss",
    ...MACHINE_AMBIENT_RULES,
  ],
  // Creaking led the ambient layer already; this makes it the subject of it.
  creaks: [
    "metal creaking is the signature background texture: slow structural groans, stressed hull plates, rusted hinge creaks, cooling metal pops",
    "creaks swell and release at their own pace and are the most present of the machine sounds",
    "quieter servo whines and hydraulic hiss sit behind the creaks",
    ...MACHINE_AMBIENT_RULES,
  ],
};

/** Shared by the ambience cues, which are sound design rather than music. */
const AMBIENCE_NEVER = [
  "drums, percussion, drum kit",
  "steady beat, pulse or groove of any kind",
  "chord progression",
  "clear melody or hook",
  "song structure, verse, chorus",
  "guitar",
  "sonar ping beeping on a regular interval",
];

/** Machine bans that only apply when the layer is meant to be ambient. */
const MACHINES_NEVER_MUSICAL = [
  "machine noises used as percussion or played on the beat",
  "machine noises in the foreground or louder than the instruments",
  "metal hits driving the groove",
  "sound-effects collage in place of music",
];

/**
 * Several guitars at half the tempo of the track under them.
 *
 * This is the dual timescale that reviewed well on the prog take, stated as an
 * arrangement rule instead of left to chance: the guitars are the slow voice and
 * the arpeggio and kit are the fast one. Naming the flavours separately is what
 * stops "layered guitars" collapsing into one thicker guitar - and the lead is
 * named as a synth guitar because "electric guitar" alone kept coming back
 * closer to a rock band than to a machine.
 */
const GUITARS = [
  "two or three distinct guitar voices layered, each with its own tone",
  "lead voice is a synth guitar or MIDI guitar: electric and synthetic, mild portamento, tape delay, futuristic rather than bluesy",
  "second voice is an overdriven electric guitar holding long sustain with slow bends",
  "third voice is a clean chorused electric guitar sustaining chords underneath",
  "all guitars phrase in half time against the 150 BPM bed: whole notes and half notes held across bars",
  "guitars stay locked to the key and the bar grid while phrasing at half the tempo",
  "the fast motion comes from the synth arpeggio and the kit, never from the guitars",
];

const BRIEFS = {
  // Superseded by full: the arrangement was right but a fast single-note tick
  // ran under the whole thing. Kept so the plan that caused it stays readable
  // next to the one that replaced it.
  keys: {
    file: "loops/battle_keys_bassdrop_150_loop.mp3",
    seed: 20260902,
    superseded: true,
    chunks: [
      {
        text: "[Loop A] {instrumental, no vocals}",
        styles: [
          "driving sci-fi combat music for a roguelite space shooter",
          "150 BPM, F sharp minor, four four",
          "grand piano and electric keyboard carry the lead melody",
          "melody moves in long phrases across bars, never a two-note figure",
          "deep analog sub bass, sixteenth-note bass movement",
          "wide space synth ambience behind the keys: filter sweeps, distant sheens, telemetry blips",
          "syncopated evolving percussion, ghost notes, off-grid hats, kit mixed low",
          "urgent, aggressive, high energy, forward momentum, battle",
          "already mid-song, full arrangement from the first beat",
          "clean polished studio mix, wide stereo, great production quality",
        ],
      },
      {
        text: "[Loop B] {bass drop, keys answer}",
        styles: [
          "heavy sub bass drop lands and holds",
          "piano and keyboard answer the drop with a rising motif",
          "space synth sweep rides over the drop",
          "percussion stays secondary to keys and bass",
          "energy climbs, no release, no breakdown",
        ],
      },
      {
        text: "[Loop C] {ambience forward, motif mutates}",
        styles: [
          "space synth ambience steps forward, shimmering pads and metallic ticks",
          "keyboard motif mutates rather than repeating",
          "percussion opens up with fills and varied hats, still low in the mix",
          "sustained synth lead threads under the keys",
          "density stays full, tension held",
        ],
      },
      {
        text: "[Loop D] {turn back to the top}",
        styles: [
          "harmonic turnaround that leads straight back to the opening figure",
          "piano and bass land together on the final bar and keep driving",
          "space ambience thins slightly so the top of the loop reads as an arrival",
          "no ending, no resolution, no final hit, still at full energy on the last beat",
        ],
      },
    ],
  },

  // Same pocket as keys, twice the length, and the arrangement now has to carry
  // the dynamics itself: with stems off, a thinner section is the only way to
  // make a fuller one land, and eight chunks give the track eight places where
  // something is required to change.
  full: {
    file: "loops/battle_keys_full_150.mp3",
    seed: 20260903,
    superseded: true,
    chunks: [
      {
        text: "[A] {instrumental, no vocals}",
        styles: [
          "driving sci-fi combat music for a roguelite space shooter",
          "150 BPM, F sharp minor, four four",
          "grand piano and electric keyboard carry the lead melody",
          "deep analog sub bass playing a moving bassline",
          "wide space synth ambience behind the keys: filter sweeps, distant sheens",
          "live-feel kit mixed low, busy but varied, no fixed pattern",
          "urgent, aggressive, high energy, forward momentum, battle",
          "already mid-song, full arrangement from the first beat",
          "clean polished studio mix, wide stereo, great production quality",
        ],
      },
      {
        text: "[B] {bass drop, keys answer}",
        styles: [
          "heavy sub bass drop lands and holds",
          "piano and keyboard answer the drop with a rising motif",
          "space synth sweep rides over the drop",
          "energy climbs, no release, no breakdown",
        ],
      },
      {
        text: "[C] {keys take the lead}",
        styles: [
          "piano takes a clear melodic lead over the pocket",
          "electric keyboard counter-melody answers it a bar later",
          "drums switch to a different groove than the opening",
          "bass follows the piano harmony rather than repeating",
        ],
      },
      {
        text: "[D] {strip back}",
        styles: [
          "arrangement thins to piano, pad and sub bass",
          "drums drop to occasional accents and long gaps",
          "space ambience widens into the space the kit left",
          "quieter but still moving, tension held, not a fade",
        ],
      },
      {
        text: "[E] {rebuild}",
        styles: [
          "layers return one at a time, bass first then kit",
          "keyboard arpeggio climbs across the section",
          "percussion builds with tom fills rather than a steady beat",
          "pressure rising toward the fullest part of the track",
        ],
      },
      {
        text: "[F] {fullest section}",
        styles: [
          "fullest and loudest section of the track, everything playing",
          "sustained synth lead over piano chords and driving bass",
          "drums at their most active with crash accents and fills",
          "wide stereo, powerful low end, triumphant and aggressive",
        ],
      },
      {
        text: "[G] {ambience forward, motif mutates}",
        styles: [
          "space synth ambience steps forward, shimmering pads and slow sweeps",
          "keyboard motif mutates rather than repeating",
          "kit pulls back to varied hats and rim accents",
          "density stays full, tension held",
        ],
      },
      {
        text: "[H] {turn back to the top}",
        styles: [
          "harmonic turnaround that leads straight back to the opening figure",
          "piano and bass land together on the final bar and keep driving",
          "space ambience thins slightly so the top reads as an arrival",
          "no ending, no resolution, no final hit, still at full energy on the last beat",
        ],
      },
    ],
  },

  // Four minutes of the full track with the machine layer added on top - the
  // enemies are metal creatures, so the percussion should sound like they are
  // in the room. Conditioned on the take that was approved rather than rolled
  // fresh, which is what makes it a version of that track instead of a fourth
  // attempt at the brief. Sections are all 8 or 16 bars, so the reachable
  // lengths near four minutes are 3:50 and 4:03; 152 bars takes the latter.
  machines: {
    file: "loops/battle_keys_machines_150_4m.mp3",
    seed: 20260904,
    machines: "percussion",
    superseded: true,
    conditioning: {
      songId: "B6QFihwLdXv5OWKtsW5n",
      startMs: 0,
      endMs: 25600,
      strength: "medium",
    },
    chunks: [
      {
        text: "[A] {instrumental, no vocals}",
        bars: 16,
        styles: [
          "driving sci-fi combat music for a roguelite space shooter",
          "150 BPM, F sharp minor, four four",
          "grand piano and electric keyboard carry the lead melody",
          "deep analog sub bass playing a moving bassline",
          "wide space synth ambience behind the keys: filter sweeps, distant sheens",
          "live-feel kit mixed low, busy but varied, no fixed pattern",
          "urgent, aggressive, high energy, forward momentum, battle",
          "already mid-song, full arrangement from the first beat",
          "clean polished studio mix, wide stereo, great production quality",
        ],
      },
      {
        text: "[B] {bass drop, keys answer} {instrumental}",
        bars: 16,
        styles: [
          "heavy sub bass drop lands and holds",
          "piano and keyboard answer the drop with a rising motif",
          "space synth sweep rides over the drop",
          "metal clang accents land with the drop",
          "energy climbs, no release, no breakdown",
        ],
      },
      {
        text: "[C] {keys take the lead} {instrumental}",
        bars: 16,
        styles: [
          "piano takes a clear melodic lead over the pocket",
          "electric keyboard counter-melody answers it a bar later",
          "drums switch to a different groove than the opening",
          "servo whirs answer the piano phrases",
        ],
      },
      {
        text: "[D] {machine break} {instrumental}",
        bars: 8,
        styles: [
          "struck metal and hydraulics take over the groove for this section",
          "piano drops to sustained chords underneath",
          "pipe clangs and anvil hits play a varied figure, not a loop",
          "the machines are the loudest thing here but still in time with the music",
        ],
      },
      {
        text: "[E] {strip back} {instrumental}",
        bars: 16,
        styles: [
          "arrangement thins to piano, pad and sub bass",
          "drums drop to occasional accents and long gaps",
          "distant heavy metal footfalls approach through the space the kit left",
          "quieter but still moving, tension held, not a fade",
        ],
      },
      {
        text: "[F] {rebuild} {instrumental}",
        bars: 16,
        styles: [
          "layers return one at a time, bass first then kit",
          "keyboard arpeggio climbs across the section",
          "motor spin-ups and rising servo whirs build with the drums",
          "pressure rising toward the fullest part of the track",
        ],
      },
      {
        text: "[G] {fullest section} {instrumental}",
        bars: 16,
        styles: [
          "fullest and loudest section of the track, everything playing",
          "sustained synth lead over piano chords and driving bass",
          "drums at their most active with crash accents and fills",
          "metal impacts reinforce the downbeats without replacing the kit",
          "wide stereo, powerful low end, triumphant and aggressive",
        ],
      },
      {
        text: "[H] {machine peak} {instrumental}",
        bars: 8,
        styles: [
          "the machine layer peaks: heavy hydraulic slams and electrical arcing",
          "synth lead holds a long note over the top",
          "sounds like a large metal creature moving through the fight",
          "still musical, still in time, not a sound-effects collage",
        ],
      },
      {
        text: "[I] {ambience forward, motif mutates} {instrumental}",
        bars: 8,
        styles: [
          "space synth ambience steps forward, shimmering pads and slow sweeps",
          "keyboard motif mutates rather than repeating",
          "kit pulls back to varied hats and rim accents",
          "rusted metal groans and distant machinery far back in the mix",
          "density stays full, tension held",
        ],
      },
      {
        text: "[J] {second drop} {instrumental}",
        bars: 16,
        styles: [
          "second heavy sub bass drop, bigger than the first",
          "piano hammers the harmony with both hands",
          "metal clangs and hydraulic thuds hit with the drop",
          "peak energy, no breakdown after it",
        ],
      },
      {
        text: "[K] {turn back to the top} {instrumental}",
        bars: 16,
        styles: [
          "harmonic turnaround that leads straight back to the opening figure",
          "piano and bass land together on the final bar and keep driving",
          "machine layer thins to a single distant servo so the top reads as an arrival",
          "no ending, no resolution, no final hit, still at full energy on the last beat",
        ],
      },
    ],
  },

  // The way back. The guitar-led progressive character of the takes that rated
  // 7 to 7.5 is restated in the styles directly, since the keys-led plans
  // dropped the guitar entirely and nothing in them was going to bring it back.
  //
  // Deliberately not conditioned on those takes: they run at 128 BPM and this
  // wants the 150 that was approved since, and a reference fighting the
  // requested tempo is a worse failure than writing the character out by hand.
  // 56 bars is 1:29.6, the whole number of bars under 1:30.
  guitar: {
    file: "loops/battle_guitar_ambient_150_90s.mp3",
    seed: 20260905,
    machines: "ambient",
    superseded: true,
    chunks: [
      {
        text: "[A] {instrumental, no vocals}",
        styles: [
          "progressive electronic sci-fi combat music for a roguelite space shooter",
          "150 BPM, F sharp minor, four four",
          "electric guitar is the main voice, playing long ascending and sustained motifs with tape delay and plate reverb",
          "patient human guitar phrasing that spans several bars, not shredding, not palm-mute chugging",
          "restless analog synth arpeggio underneath in constant pitch motion, mutating across bars",
          "electric piano and warm analog pads sit behind the guitar",
          "deep analog bass and a live-feel drum kit, human rather than quantised, mixed low",
          "open warm mix, minimal compression, many layers audible at once, warm analog tape saturation",
          "already mid-song, full arrangement from the first beat",
        ],
      },
      {
        text: "[B] {guitar holds} {instrumental}",
        styles: [
          "guitar holds long sustained notes for bars at a time with long delay tails",
          "electric piano answers the guitar in the gaps",
          "bass moves melodically under the held notes",
          "energy steady and driving, no build, no payoff",
        ],
      },
      {
        text: "[C] {strip back} {instrumental}",
        styles: [
          "guitar rests for this section",
          "electric piano and analog pad carry the harmony",
          "drums reduce to occasional accents with long gaps",
          "the faint machine room ambience becomes audible in the space that opens up",
          "quieter but still moving, tension held, not a fade",
        ],
      },
      {
        text: "[D] {rebuild} {instrumental}",
        styles: [
          "bass and kit return, arpeggio climbs and mutates upward",
          "guitar re-enters with a single long note that grows",
          "pressure rising without becoming a chorus",
        ],
      },
      {
        text: "[E] {guitar lead} {instrumental}",
        styles: [
          "guitar takes an expressive sustained lead, ascending phrases with slow bends",
          "electric piano counter-lines weave underneath",
          "drums at their most active but still under the guitar",
          "warm and driving rather than triumphant or anthemic",
        ],
      },
      {
        text: "[F] {ambience forward, motif mutates} {instrumental}",
        styles: [
          "analog pads and slow filter sweeps step forward",
          "guitar motif mutates rather than repeating",
          "kit pulls back to varied hats and rim accents",
          "distant machinery drifts behind the music, off the beat",
        ],
      },
      {
        text: "[G] {turn back to the top} {instrumental}",
        styles: [
          "harmonic turnaround that leads straight back to the opening figure",
          "guitar and bass land together on the final bar and keep driving",
          "no ending, no resolution, no final hit, still at full energy on the last beat",
        ],
      },
    ],
  },

  // The 7/10 take with three things added and nothing taken away: more guitars
  // and more synthetic ones, all phrasing at half tempo, and creaking promoted
  // from one item in the ambience to the subject of it. The base styles are the
  // ones that earned the 7, so they are carried over rather than rewritten.
  guitars: {
    file: "loops/battle_guitars_creaks_150_90s.mp3",
    seed: 20260906,
    machines: "creaks",
    guitars: true,
    never: [
      "acoustic guitar",
      "guitars playing fast sixteenth-note runs",
      "shred metal solo",
      "blues rock licks",
      "all guitars playing the same part in unison",
    ],
    chunks: [
      {
        text: "[A] {instrumental, no vocals}",
        styles: [
          "progressive electronic sci-fi combat music for a roguelite space shooter",
          "150 BPM, F sharp minor, four four",
          "synth guitar carries the main voice in long sustained motifs with tape delay and plate reverb",
          "a second overdriven electric guitar shadows it a third below",
          "restless analog synth arpeggio underneath in constant pitch motion, mutating across bars",
          "electric piano and warm analog pads sit behind the guitars",
          "deep analog bass and a live-feel drum kit, human rather than quantised, mixed low",
          "open warm mix, minimal compression, many layers audible at once, warm analog tape saturation",
          "already mid-song, full arrangement from the first beat",
        ],
      },
      {
        text: "[B] {guitars hold} {instrumental}",
        styles: [
          "both guitars hold notes for two bars at a time against the fast bed",
          "clean chorused guitar enters underneath sustaining chords",
          "electric piano answers in the gaps between guitar phrases",
          "energy steady and driving, no build, no payoff",
        ],
      },
      {
        text: "[C] {strip back} {instrumental}",
        styles: [
          "guitars thin to the clean chorused voice alone, still sustaining",
          "electric piano and analog pad carry the harmony",
          "drums reduce to occasional accents with long gaps",
          "metal creaking becomes clearly audible in the space that opens up",
          "quieter but still moving, tension held, not a fade",
        ],
      },
      {
        text: "[D] {rebuild} {instrumental}",
        styles: [
          "bass and kit return, arpeggio climbs and mutates upward",
          "synth guitar re-enters on a single long note that grows",
          "overdriven guitar joins on a held harmony below it",
          "pressure rising without becoming a chorus",
        ],
      },
      {
        text: "[E] {three guitars} {instrumental}",
        styles: [
          "all three guitar voices play together, each in a different register",
          "synth guitar takes the top line, overdriven guitar the middle, clean guitar sustains below",
          "they move in half-time counterpoint rather than in unison",
          "drums at their most active but still under the guitars",
          "warm and driving rather than triumphant or anthemic",
        ],
      },
      {
        text: "[F] {ambience forward, motif mutates} {instrumental}",
        styles: [
          "analog pads and slow filter sweeps step forward",
          "guitar motifs mutate rather than repeating",
          "kit pulls back to varied hats and rim accents",
          "structural metal groans drift behind the music, off the beat",
        ],
      },
      {
        text: "[G] {turn back to the top} {instrumental}",
        styles: [
          "harmonic turnaround that leads straight back to the opening figure",
          "guitars and bass land together on the final bar and keep driving",
          "no ending, no resolution, no final hit, still at full energy on the last beat",
        ],
      },
    ],
  },

  // Not a track: the creaks and whirrs that have been sitting behind the music,
  // on their own. `beat: false` drops the rhythm direction and the beat bans,
  // which describe a fault this cannot have, and `clean: false` lifts the ban on
  // hiss and noise - a hull under pressure is largely made of it. Pitched in the
  // same key as the battle tracks so it can sit under one if that ever helps.
  creaks: {
    file: "ambience/ambient_creaks_submarine_30s.mp3",
    seed: 20260907,
    keep: true,
    beat: false,
    clean: false,
    never: AMBIENCE_NEVER,
    chunks: [
      {
        text: "[Ambience] {no vocals, no drums, sound design only}",
        ms: 15000,
        styles: [
          "ambient sound design bed for a derelict machine interior, not a song",
          "metal creaking is the subject: slow structural groans, hull plates under pressure, rusted hinge creaks, cooling metal pops",
          "submarine engine room whirrs: low motor drones, gyros winding, ballast hiss, pressure rumble",
          "distant muffled clanks somewhere else in the hull",
          "very slow, spacious, long decays, wide stereo, deep low end",
          "loosely melodic: faint sustained tones drift in and out of the noise, detuned, no clear tune",
          "tonal centre F sharp minor so it can sit under the battle tracks",
          "no rhythm and no pulse anywhere, everything arrives at its own pace",
        ],
      },
      {
        text: "[Ambience 2] {no vocals, no drums, sound design only}",
        ms: 15000,
        styles: [
          "the whirrs rise slightly and a motor spins up somewhere deep in the hull",
          "creaks answer it, longer and closer than before",
          "a faint sustained tone bends slowly across the section, almost a melody but never resolving",
          "electrical arcing and relay clicks scattered far back, irregular",
          "stays quiet and unresolved, no build and no arrival",
        ],
      },
    ],
  },

  // The kept ambience with its own contents turned down and discrete creak
  // events added over the top. Conditioned on that take so this is a version of
  // it rather than a second roll at the brief, at medium strength because high
  // would carry over the levels this is meant to pull back. Three shorter
  // sections rather than two, so the creak events land in three different
  // places instead of settling into a pattern across one long stretch.
  subtle: {
    file: "ambience/ambient_creaks_subtle_30s.mp3",
    seed: 20260908,
    keep: true,
    beat: false,
    clean: false,
    conditioning: {
      songId: "HmdxDgCWg5KkI7234mHn",
      startMs: 0,
      endMs: 15000,
      strength: "medium",
    },
    always: [
      "the drones, whirrs and pressure rumble are subtle: pulled back, quieter, sitting low under everything",
      "discrete creaking events on top: individual metal creaks, single stress groans, one at a time",
      "each creak is a separate event with silence around it, not a continuous texture",
      "creak timing is random and unpredictable, irregular gaps of varying length",
      "the creaks are the most audible thing in the piece but are never loud",
    ],
    never: [
      ...AMBIENCE_NEVER,
      "creaks arriving on a regular interval",
      "loud drones or whirrs dominating the mix",
    ],
    chunks: [
      {
        text: "[Ambience] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "ambient sound design bed for a derelict machine interior, not a song",
          "submarine engine room underneath: low motor drones, gyros winding, ballast hiss, pressure rumble, all understated",
          "a few sharp metal creaks scattered across the section at uneven intervals",
          "very slow, spacious, long decays, wide stereo, deep low end",
          "loosely melodic: faint sustained tones drift in and out of the noise, detuned, no clear tune",
          "tonal centre F sharp minor so it can sit under the battle tracks",
        ],
      },
      {
        text: "[Ambience 2] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "creaking clusters here: two or three stress groans close together, then a long gap",
          "one closer, louder creak as if the hull shifts nearby",
          "the drones stay back and barely move",
          "a faint sustained tone bends slowly across the section, never resolving",
        ],
      },
      {
        text: "[Ambience 3] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "sparser again: long quiet stretches with single distant creaks",
          "a motor winds down somewhere deep in the hull",
          "relay clicks and faint electrical arcing scattered far back, irregular",
          "stays quiet and unresolved, no build and no arrival",
        ],
      },
    ],
  },

  // The approved ambience at three times the length with the metal events
  // brought forward. Nine sections rather than three: at 90 seconds the risk is
  // not that a single density is wrong but that any one of them outstays its
  // welcome, so each section states its own and none repeats its neighbour.
  knocks: {
    file: "ambience/ambient_knocks_creaks_90s.mp3",
    seed: 20260909,
    beat: false,
    clean: false,
    conditioning: {
      songId: "Ad6NttFKrgYmqAplDaZO",
      startMs: 0,
      endMs: 15000,
      strength: "medium",
    },
    always: [
      "the drones, whirrs and pressure rumble stay subtle: pulled back and sitting low under everything",
      "metal events are clearly audible and forward in the mix, comfortably above the drone bed",
      "discrete events one at a time: metal knocks and raps, dull metallic taps, individual creaks and stress groans",
      "each event is separate with silence around it, not a continuous texture",
      "event timing is random and unpredictable, irregular gaps of varying length",
      "present and solid but never harsh, never a startling bang",
    ],
    never: [
      ...AMBIENCE_NEVER,
      "creaks or knocks arriving on a regular interval",
      "loud drones or whirrs dominating the mix",
      "harsh startling bangs or gunshot-like cracks",
      "knocks forming a rhythm between themselves",
    ],
    chunks: [
      {
        text: "[Ambience] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "ambient sound design bed for a derelict machine interior, not a song",
          "submarine engine room underneath: low motor drones, gyros winding, ballast hiss, pressure rumble, all understated",
          "a few solid metal knocks and one long creak, unevenly spaced",
          "very slow, spacious, long decays, wide stereo, deep low end",
          "loosely melodic: faint sustained tones drift in and out of the noise, detuned, no clear tune",
          "tonal centre F sharp minor so it can sit under the battle tracks",
        ],
      },
      {
        text: "[Ambience 2] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "a cluster: two or three knocks close together, then a long gap",
          "a stress groan answers from further away",
          "drones barely move underneath",
        ],
      },
      {
        text: "[Ambience 3] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "nearly empty: one distant knock and a long quiet stretch",
          "a faint sustained tone bends slowly across the section, never resolving",
        ],
      },
      {
        text: "[Ambience 4] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "close creaking: the hull shifts nearby with a long loud groan",
          "smaller metal pops follow it as the plates settle",
          "ballast hiss rises slightly then settles",
        ],
      },
      {
        text: "[Ambience 5] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "knocks move around the stereo field, one left, one right, far apart in time",
          "a motor winds up somewhere deep in the hull and keeps running",
          "relay clicks scattered far back, irregular",
        ],
      },
      {
        text: "[Ambience 6] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "quiet stretch: drones and hiss almost alone",
          "one creak arrives late in the section, closer than expected",
        ],
      },
      {
        text: "[Ambience 7] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "the busiest section: knocks, taps and creaks overlapping at uneven intervals",
          "faint electrical arcing behind them",
          "still unhurried, still no pulse between the events",
        ],
      },
      {
        text: "[Ambience 8] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "the motor winds down and the drones thin out",
          "two spaced knocks and a long structural groan",
          "detuned sustained tone drifts back in",
        ],
      },
      {
        text: "[Ambience 9] {no vocals, no drums, sound design only}",
        ms: 10000,
        styles: [
          "sparse and unresolved: single distant creaks with long silence between them",
          "the bed sits at the same level it started at, no ending and no arrival",
        ],
      },
    ],
  },

  // A new track rather than another pass at the last one. The organising idea is
  // that nothing plays the whole way through: the lead hands off between chip
  // voices, synth guitar, keyboard and finally the kit, and the beat and melody
  // are allowed to leave and come back. 76 bars is 2:01.6 - the reachable length
  // nearest two minutes once every section is a whole number of bars.
  rotate: {
    file: "loops/battle_rotate_chip_150_2m.mp3",
    seed: 20260910,
    fades: true,
    superseded: true,
    always: [
      "the beat and the melody fade in and out across sections instead of running constantly",
      "parts sweep across the stereo field, panning left to right, with ping-pong delay on the leads",
      "old-school MIDI game colour: 8-bit arcade blips, chiptune square-wave leads, FM stabs and retro sweeps as accents and countermelody",
      "the low end has submarine character: creaking metal groans pitched into the sub bass, hull stress under the music",
      "sharp metallic snaps and cracks as percussive accents",
      "solo leads phrase in half time against the 150 BPM bed, long held notes across bars",
      "only one lead solos at a time and they hand off rather than stacking",
      "the lead instrument changes from section to section rather than one carrying the whole track",
    ],
    never: [
      "the same lead instrument playing for the whole track",
      "every part playing continuously without dropping out",
      "static stereo image with everything centred",
      "guitars playing fast sixteenth-note runs",
      "shred metal solo",
      "acoustic drums only, with no synthetic percussion",
    ],
    chunks: [
      {
        text: "[A] {chip melody, beat fades in} {instrumental, no vocals}",
        styles: [
          "progressive electronic sci-fi combat music for a roguelite space shooter, 150 BPM, F sharp minor",
          "chiptune square-wave lead carries the melody, bright and retro",
          "the drum kit fades in across the section rather than starting with it",
          "creaking sub bass underneath, warm analog pads behind",
          "clean polished mix, wide stereo, great production quality",
        ],
      },
      {
        text: "[B] {keyboard solo} {instrumental}",
        styles: [
          "synth keyboard takes a solo, bright FM lead tone with portamento",
          "chip blips answer it from the opposite side of the stereo field",
          "kit locked in and driving underneath, mixed low",
        ],
      },
      {
        text: "[C] {low part} {instrumental}",
        styles: [
          "the melody and the beat fade out almost entirely",
          "creaking submarine sub bass and metallic snaps carry the section alone",
          "one distant pad holds underneath, quiet and unresolved",
        ],
      },
      {
        text: "[D] {buildup} {instrumental}",
        styles: [
          "buildup: chiptune arpeggio climbs and a filter opens across the section",
          "kit fades back in with tom fills rather than a steady beat",
          "panning sweeps widen as the energy rises",
        ],
      },
      {
        text: "[E] {synth guitar solo} {instrumental}",
        styles: [
          "slow heavy synth guitar solo takes over: sustained notes held for bars, tape delay and plate reverb",
          "thick and deliberate, never shredding, never bluesy",
          "chip and keyboard parts step back to leave it alone",
        ],
      },
      {
        text: "[F] {high part} {instrumental}",
        styles: [
          "high part: synth guitar and synth keyboard trade phrases back and forth",
          "full arrangement, driving kit, wide pads, powerful creaking low end",
          "retro FM stabs punctuate the trade",
        ],
      },
      {
        text: "[G] {keyboard becomes drums} {instrumental}",
        styles: [
          "the keyboard figure is handed over to the drums: the kit takes the same rhythm the keys were playing",
          "keyboard drops out as the drums pick it up",
          "electronic and acoustic percussion layered together",
        ],
      },
      {
        text: "[H] {drum solo} {instrumental}",
        styles: [
          "drum solo: the kit plays alone with only the creaking sub bass under it",
          "toms, snare and electronic hits, varied and building, no fixed pattern",
          "melody and pads stay out for the whole section",
        ],
      },
      {
        text: "[I] {rebuild over the drums} {instrumental}",
        styles: [
          "chiptune lead and synth guitar fade back in over the drum groove",
          "bass returns with the creak character intact",
          "energy climbing back to full without becoming a chorus",
        ],
      },
      {
        text: "[J] {turn back to the top} {instrumental}",
        bars: 4,
        styles: [
          "short turnaround that leads straight back to the opening chip melody",
          "no ending, no resolution, still at full energy on the last beat",
        ],
      },
    ],
  },

  // The same track slowed down and thinned out. Rotate asked for instruments to
  // change and got all of them changing at once, because "the lead hands off"
  // says nothing about what the other twelve tracks are doing. So this brief
  // carries a voice budget and every section names what is silent as well as
  // what plays - a sequencer project with many tracks and few of them enabled.
  //
  // 120 BPM makes a bar 2s, so 60 bars is two minutes exactly, and it buys the
  // guitar its slowness twice over: the tempo drops and the phrasing is still
  // held to roughly a note a bar.
  clean: {
    file: "loops/battle_clean_slow_120_2m.mp3",
    seed: 20260911,
    bpm: 120,
    fades: true,
    always: [
      "at most six instruments sound at the same time; every other track is silent until a later section",
      "arranged like a sequencer project with fifteen tracks where only a few are enabled at once, changing per section",
      "instruments enter and leave between sections rather than all playing throughout",
      "pristine clean studio mix: no static, no hiss, no vinyl crackle, no bitcrush, no noise floor, clear separation between parts",
      "the synth guitar is extremely slow: roughly one held note per bar or slower, huge sustain, long tape delay tails",
      "8-bit chip blips are almost absent — at most one brief accent in the whole track, never the melody",
      "the low end keeps its submarine character: clean recorded metal creaks pitched into the sub bass, no noise around them",
      "parts pan across the stereo field and fade in and out between sections",
    ],
    never: [
      "more than six instruments playing at once",
      "busy cluttered mix with everything sounding at the same time",
      "chiptune lead carrying the melody",
      "constant arcade blips",
      "static, hiss, vinyl crackle, bitcrush, audible noise floor",
      "fast guitar, sixteenth-note runs, shred solo",
      "the same lead instrument playing for the whole track",
      "fading out to silence at the end of the track",
    ],
    chunks: [
      {
        text: "[A] {arp and pad only, beat fades in} {instrumental, no vocals}",
        styles: [
          "progressive electronic sci-fi combat music for a roguelite space shooter, 120 BPM, F sharp minor",
          "playing: analog arpeggio, warm pad, creaking sub bass, closed hats, one sustained tone, faint machine ambience",
          "silent: synth guitar, synth keyboard, electric piano, chip blips, kick and snare, metallic snaps",
          "the hats fade in across the section; the arpeggio carries the melody",
          "clean, spacious, wide stereo, great production quality",
        ],
      },
      {
        text: "[B] {slow guitar enters} {instrumental}",
        styles: [
          "playing: slow synth guitar lead, warm pad, creaking sub bass, kick and snare, hats, machine ambience",
          "silent: synth keyboard, electric piano, chip blips, arpeggio, metallic snaps, electronic percussion",
          "the guitar holds one note per bar, entering quietly and swelling",
          "the arpeggio has stopped; the kit is simple and low in the mix",
        ],
      },
      {
        text: "[C] {low part, four tracks} {instrumental}",
        styles: [
          "playing: creaking sub bass, machine ambience, one sustained tone, metallic snaps",
          "silent: everything else — no drums, no guitar, no keys, no arpeggio, no pad",
          "almost empty and unresolved, the snaps arriving at irregular intervals",
        ],
      },
      {
        text: "[D] {buildup} {instrumental}",
        styles: [
          "playing: analog arpeggio, analog bass, kick and snare, filter sweep, electric piano, metallic snaps",
          "silent: synth guitar, synth keyboard, pad, chip blips",
          "buildup: the arpeggio climbs, the filter opens, tom fills instead of a steady beat",
        ],
      },
      {
        text: "[E] {slow guitar solo} {instrumental}",
        styles: [
          "playing: slow synth guitar solo, warm pad, analog bass, kick and snare, hats",
          "silent: synth keyboard, electric piano, arpeggio, chip blips, electronic percussion, snaps",
          "the guitar solo is the slowest thing in the track: single notes held across whole bars, heavy and deliberate",
          "everything else stays out of its way",
        ],
      },
      {
        text: "[F] {keyboard solo} {instrumental}",
        styles: [
          "playing: synth keyboard solo, electric piano, creaking sub bass, kick and snare, electronic percussion",
          "silent: synth guitar, pad, arpeggio, hats",
          "one brief 8-bit chip accent lands early in this section and does not return",
          "the keyboard solo is melodic and unhurried, not fast",
        ],
      },
      {
        text: "[G] {keyboard becomes drums, drum solo} {instrumental}",
        styles: [
          "playing: kick and snare, electronic percussion, creaking sub bass",
          "silent: all melodic instruments — guitar, keyboard, electric piano, pad, arpeggio, chip",
          "the drums take over the rhythm the keyboard was playing as the keyboard drops out",
          "drum solo: toms, snare and electronic hits, varied, building, no fixed pattern",
        ],
      },
      {
        text: "[H] {turn back to the top} {instrumental}",
        bars: 4,
        styles: [
          "playing: analog arpeggio, warm pad, creaking sub bass, hats",
          "silent: guitar, keyboard, electric piano, chip, snare, percussion",
          "short turnaround that leads straight back to the opening arpeggio, no ending",
        ],
      },
    ],
  },
};

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is empty.");
  return key;
}

function compositionPlan(brief) {
  return {
    // A loop has to sound like one performance, so every chunk is held to its
    // neighbours rather than being allowed to wander into a new section.
    chunks: brief.chunks.map((chunk, index) => {
      const hasBeat = brief.beat !== false;
      const plan = {
        text: chunk.text,
        duration_ms: chunkMs(chunk, brief),
        positive_styles: [
          ...chunk.styles,
          ...(hasBeat ? RHYTHM : []),
          ...(brief.guitars ? GUITARS : []),
          ...(brief.machines ? MACHINE_LAYERS[brief.machines] : []),
          ...(brief.always ?? []),
        ],
        negative_styles: [
          ...(brief.fades
            ? [
                ...NEVER_CORE.filter((ban) => !FADE_BANS.includes(ban)),
                "fading out to silence at the end of the track",
              ]
            : NEVER_CORE),
          ...(hasBeat ? NEVER_BEAT : []),
          ...(brief.clean === false ? [] : NEVER_NOISE),
          ...(brief.machines && brief.machines !== "percussion"
            ? MACHINES_NEVER_MUSICAL
            : []),
          ...(brief.never ?? []),
        ],
        context_adherence: "high",
      };
      // Conditioning only needs to be stated on the first chunk: it carries
      // through to the rest, which is what keeps a longer version recognisable
      // as the same track rather than another attempt at the same brief.
      if (brief.conditioning && index === 0) {
        plan.conditioning_ref = {
          song_id: brief.conditioning.songId,
          range: {
            start_ms: brief.conditioning.startMs,
            end_ms: brief.conditioning.endMs,
          },
          condition_strength: brief.conditioning.strength,
        };
      }
      return plan;
    }),
  };
}

/**
 * Reads a ZIP from memory via its central directory.
 *
 * Stem separation returns an archive and Node ships no unzip, but it does ship
 * inflate. The central directory is used rather than the local headers because
 * a streamed archive may defer the entry sizes to a data descriptor, leaving
 * the local header sizes as zero.
 */
function unzip(buffer) {
  let eocd = buffer.length - 22;
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd -= 1;
  if (eocd < 0) throw new Error("Not a ZIP archive (no end-of-directory record).");

  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const files = [];

  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Bad central directory entry at ${offset}.`);
    }
    const method = buffer.readUInt16LE(offset + 10);
    const compressed = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);

    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(start, start + compressed);
    files.push({ name, data: method === 0 ? Buffer.from(raw) : inflateRawSync(raw) });

    offset += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

async function separateStems(mp3Path) {
  const audio = readFileSync(mp3Path);
  const name = basename(mp3Path);
  const form = new FormData();
  form.append("file", new Blob([audio], { type: "audio/mpeg" }), name);

  const response = await fetch(
    `${API}/v1/music/stem-separation?output_format=${OUTPUT_FORMAT}`,
    { method: "POST", headers: { "xi-api-key": apiKey() }, body: form },
  );
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!response.ok) {
    console.log(`FAIL stems (${response.status}): ${buffer.subarray(0, 600).toString()}`);
    return;
  }

  const stem = name.replace(/\.mp3$/, "");
  const outDir = join(dirname(mp3Path), "stems", stem);
  mkdirSync(outDir, { recursive: true });
  for (const file of unzip(buffer)) {
    // The archive names entries by part alone - bass.mp3, drums.mp3 - which
    // would collide between loops once the wiki flattens catalog files by
    // basename, so the loop name is carried into the filename here.
    const target = join(outDir, `${stem}__${basename(file.name)}`);
    writeFileSync(target, file.data);
    console.log(`     stem ${basename(file.name).padEnd(12)} ${(file.data.length / 1024).toFixed(0)} KB`);
  }
}

async function compose(key, brief) {
  const plan = compositionPlan(brief);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 900000);

  try {
    const response = await fetch(`${API}/v1/music?output_format=${OUTPUT_FORMAT}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey(), "Content-Type": "application/json" },
      body: JSON.stringify({
        composition_plan: plan,
        model_id: "music_v2",
        seed: brief.seed,
        // Needed to reuse this take later as a conditioning reference, which is
        // how a follow-up stays in the same performance instead of re-rolling.
        store_for_inpainting: true,
      }),
      signal: controller.signal,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!response.ok) {
      console.log(`FAIL ${key} (${response.status}): ${buffer.subarray(0, 800).toString()}`);
      return null;
    }

    const path = join(MUSIC_DIR, brief.file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, buffer);

    const songId = response.headers.get("song-id");
    const { bars, ms: lengthMs } = planLength(brief);
    writeFileSync(
      path.replace(/\.mp3$/, ".meta.json"),
      `${JSON.stringify(
        {
          file: basename(brief.file),
          songId,
          lengthMs,
          bpm: bpmOf(brief),
          bars,
          barMs: barMsOf(brief),
          seed: brief.seed,
          model: "music_v2",
          compositionPlan: plan,
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      )}\n`,
    );

    console.log(
      `OK   ${key.padEnd(10)} ${(lengthMs / 1000).toFixed(1)}s  ${bars} bars  ` +
        `${(buffer.length / 1024).toFixed(0)} KB${songId ? `  song_id=${songId}` : ""}`,
    );
    return path;
  } finally {
    clearTimeout(timer);
  }
}

loadEnv(ROOT);

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
// Splitting a take costs about twice what generating it does, and the layers
// are only worth paying for once a full mix is worth layering, so the split is
// opt-in rather than part of every run.
const wantStems = argv.includes("--stems");
const stemsOnlyAt = argv.indexOf("--stems-only");

if (stemsOnlyAt >= 0) {
  const target = argv[stemsOnlyAt + 1];
  if (!target) throw new Error("--stems-only needs a path under elevenlabs/music.");
  const before = await creditsUsed();
  console.log(`credits before: ${before.used}/${before.limit}`);
  await separateStems(join(MUSIC_DIR, target));
  const after = await creditsUsed();
  console.log(`credits after:  ${after.used}/${after.limit}  (cost ${after.used - before.used})`);
} else {
  const requested = argv.filter((arg) => !arg.startsWith("--"));
  // Generation is not deterministic, so rebuilding a take that has been asked
  // for by name replaces it rather than reproducing it. Both the rejected and
  // the kept are therefore held back from a default run, for opposite reasons.
  const keys = requested.length
    ? requested
    : Object.keys(BRIEFS).filter((key) => !BRIEFS[key].superseded && !BRIEFS[key].keep);
  const unknown = keys.filter((key) => !BRIEFS[key]);
  if (unknown.length) {
    throw new Error(`Unknown brief(s): ${unknown.join(", ")}. Known: ${Object.keys(BRIEFS).join(", ")}`);
  }

  if (dryRun) {
    for (const key of keys) {
      const brief = BRIEFS[key];
      const { bars, ms } = planLength(brief);
      console.log(
        `DRY ${key.padEnd(10)} ${(ms / 1000).toFixed(1)}s  ${bars} bars  ` +
          `${brief.chunks.length} chunks  ${brief.file}${wantStems ? "  +stems" : ""}`,
      );
      console.log(JSON.stringify(compositionPlan(brief), null, 2));
    }
  } else {
    const before = await creditsUsed();
    console.log(`credits before: ${before.used}/${before.limit}`);
    for (const key of keys) {
      const path = await compose(key, BRIEFS[key]);
      if (path && wantStems) await separateStems(path);
    }
    const after = await creditsUsed();
    console.log(`credits after:  ${after.used}/${after.limit}  (this run cost ${after.used - before.used})`);
  }
}
