import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "elevenlabs");
const API = "https://api.elevenlabs.io";

function loadEnv() {
  const envPath = join(ROOT, ".env");
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function key() {
  const value = process.env.ELEVENLABS_API_KEY?.trim();
  if (!value) {
    console.error("ELEVENLABS_API_KEY is empty.");
    process.exit(1);
  }
  return value;
}

async function call(path, { method = "GET", body, timeoutMs = 180000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        "xi-api-key": key(),
        Accept: "*/*",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return { status: response.status, buffer, headers: response.headers };
  } finally {
    clearTimeout(timer);
  }
}

function save(name, buffer) {
  const path = join(OUT_DIR, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
  return path;
}

async function generateSfx(filename, text, durationSeconds, loop = false) {
  const { status, buffer } = await call("/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    body: {
      text,
      duration_seconds: durationSeconds,
      loop,
      prompt_influence: 0.55,
      model_id: "eleven_text_to_sound_v2",
    },
    timeoutMs: 120000,
  });
  if (status !== 200) {
    console.log(`SFX FAIL ${filename} (${status}): ${buffer.subarray(0, 400).toString()}`);
    return;
  }
  const path = save(filename, buffer);
  console.log(`SFX OK  ${filename}  ${buffer.length} bytes`);
  return path;
}

async function generateMusic(filename, prompt, lengthMs) {
  const { status, buffer, headers } = await call("/v1/music?output_format=mp3_44100_128", {
    method: "POST",
    body: {
      prompt,
      music_length_ms: lengthMs,
      model_id: "music_v2",
      force_instrumental: true,
    },
    timeoutMs: 300000,
  });
  if (status !== 200) {
    console.log(`MUSIC FAIL ${filename} (${status}): ${buffer.subarray(0, 500).toString()}`);
    return;
  }
  save(filename, buffer);
  const songId = headers.get("song-id");
  console.log(`MUSIC OK  ${filename}  ${buffer.length} bytes${songId ? `  song_id=${songId}` : ""}`);
}

loadEnv();
const { status, buffer } = await call("/v1/user");
if (status !== 200) {
  console.error(`Account probe failed (${status}): ${buffer.subarray(0, 500).toString()}`);
  process.exit(1);
}
const user = JSON.parse(buffer.toString());
const sub = user.subscription ?? {};
console.log(
  `ElevenLabs OK  tier=${sub.tier}  status=${sub.status}  credits=${sub.character_count}/${sub.character_limit}`,
);

await generateSfx(
  "sfx/weapons/sfx_cannon_pulse.mp3",
  "Close-up sci-fi pulse cannon shot from a small fighter: a tight electric zap, short plasma crack, almost no tail. Dry, punchy, 6DOF space, not a huge explosion.",
  1.4,
);
await generateSfx(
  "sfx/collisions/sfx_asteroid_scrape.mp3",
  "Small fighter hull scraping a rocky asteroid in vacuum: grinding stone on metal, brief debris ticks, no atmosphere whoosh, no explosion.",
  2.2,
);
await generateSfx(
  "sfx/movement/sfx_boost_ignite.mp3",
  "Afterburner ignite on a small spacecraft: compressed air dump then a rising synth roar that cuts off cleanly. Not a jet engine on Earth.",
  2.0,
);
await generateSfx(
  "sfx/ui/sfx_ui_confirm.mp3",
  "Tiny holographic HUD confirm blip: two soft glass ticks, high and clean, no melody, no voice.",
  0.6,
);
await generateMusic(
  "music/beds/music_combat_bed_12s.mp3",
  "Instrumental only. Intense fast electronic bed for a top-down space fighter raid: driving synth arpeggios, punchy drums, distorted bass, glitch ticks, no vocals, no choir, 140 bpm, looping energy, 12 seconds.",
  12000,
);
