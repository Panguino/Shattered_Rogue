/**
 * Long-form music beds for Shattered Rogue.
 *
 * Briefs are written as production direction rather than as references to any
 * released recording: ElevenLabs copyright-checks audio references and rejects
 * composition plans that lean on a named commercial artist. Style travels,
 * the recording does not.
 *
 * Usage: node art/audio/generate_music_beds.mjs [briefKey ...]
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_DIR = join(HERE, "elevenlabs", "music", "beds");
const API = "https://api.elevenlabs.io";

// Two minutes is the shortest loop that does not announce itself on a run you
// have played fifty times. The point of the length is to delay recognition.
const TWO_MINUTES_MS = 120000;

const BRIEFS = {
  // The "slow powerful" arc: earn the payoff over ninety seconds instead of
  // opening on it. This is the one closest to the referenced section's shape.
  build: {
    file: "music_bed_build_2m.mp3",
    lengthMs: TWO_MINUTES_MS,
    prompt: [
      "Instrumental only, no vocals, no choir, no spoken word.",
      "Progressive electronic post-rock for a roguelite space shooter, 100 BPM, D minor.",
      "Start sparse: one warm analog pad and a distant arpeggiated synth, no drums for the first twenty seconds.",
      "Then bring in a live-feel drum kit, soft kick and brushed ride, played by a human rather than quantised.",
      "Add fretless bass guitar, clean electric guitar arpeggios through tape delay, and layered polysynth.",
      "One long crescendo across the whole track, jazz-tinged extended chords, never resolving into a pop hook.",
      "Tape saturation, plate reverb, wide stereo, warm analog glue.",
      "No orchestral stabs, no trailer braams, no vocal chops.",
    ].join(" "),
  },

  // Momentum without a hook. This is the one that has to survive being heard
  // three hundred times, so the prompt bans the thing that would wear out.
  drive: {
    file: "music_bed_drive_2m.mp3",
    lengthMs: TWO_MINUTES_MS,
    prompt: [
      "Instrumental only, no vocals, no choir.",
      "Driving progressive electronic groove for endless roguelite runs, 124 BPM, A minor.",
      "Steady motorik drum kit, sidechained analog pads, sub bass, palm-muted electric guitar chugging low in the mix.",
      "An arpeggiated synth sequence that slowly mutates across the track rather than repeating a catchy phrase.",
      "Texture evolves continuously; no obvious lead melody, no drop, no build-and-release structure.",
      "Warm analog, tape saturation, slightly dusty, wide stereo.",
      "No orchestral hits, no trailer braams, no vocal chops.",
    ].join(" "),
  },

  // The quiet seed. Needed so combat has something to be louder than.
  drift: {
    file: "music_bed_drift_2m.mp3",
    lengthMs: TWO_MINUTES_MS,
    prompt: [
      "Instrumental only, no vocals, no choir.",
      "Spacious ambient electronic bed for drifting through an asteroid field, 84 BPM, F sharp minor.",
      "Slow evolving pads, granular texture, sparse electric piano, deep sub bass, occasional soft mallet.",
      "No drums for the first minute, then only distant brushed percussion, quiet and far back.",
      "Long decays, plate reverb, tape wow and flutter, analog noise floor.",
      "Melancholy but not sad, patient, unresolved. No melodic hook, no swells into a climax.",
    ].join(" "),
  },
};

function loadEnv() {
  for (const line of readFileSync(join(ROOT, ".env"), "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    console.error("ELEVENLABS_API_KEY is empty.");
    process.exit(1);
  }
  return key;
}

async function creditsUsed() {
  const response = await fetch(`${API}/v1/user/subscription`, {
    headers: { "xi-api-key": apiKey() },
  });
  const data = await response.json();
  return { used: data.character_count, limit: data.character_limit };
}

async function compose(brief) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 600000);
  try {
    const response = await fetch(`${API}/v1/music?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": apiKey(), "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: brief.prompt,
        music_length_ms: brief.lengthMs,
        model_id: "music_v2",
        force_instrumental: true,
      }),
      signal: controller.signal,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!response.ok) {
      console.log(`FAIL ${brief.file} (${response.status}): ${buffer.subarray(0, 600).toString()}`);
      return;
    }
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(join(OUT_DIR, brief.file), buffer);
    const songId = response.headers.get("song-id");
    const seconds = (brief.lengthMs / 1000).toFixed(0);
    console.log(
      `OK   ${brief.file}  ${seconds}s  ${(buffer.length / 1024).toFixed(0)} KB` +
        (songId ? `  song_id=${songId}` : ""),
    );
  } finally {
    clearTimeout(timer);
  }
}

loadEnv();

const requested = process.argv.slice(2);
const keys = requested.length ? requested : Object.keys(BRIEFS);
const unknown = keys.filter((key) => !BRIEFS[key]);
if (unknown.length) {
  console.error(`Unknown brief(s): ${unknown.join(", ")}. Known: ${Object.keys(BRIEFS).join(", ")}`);
  process.exit(1);
}

const before = await creditsUsed();
console.log(`credits before: ${before.used}/${before.limit}`);

for (const key of keys) {
  await compose(BRIEFS[key]);
}

const after = await creditsUsed();
console.log(`credits after:  ${after.used}/${after.limit}  (this run cost ${after.used - before.used})`);
