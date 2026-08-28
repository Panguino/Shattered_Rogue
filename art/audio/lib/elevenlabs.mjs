/**
 * Shared ElevenLabs generation plumbing for the audio scripts.
 *
 * Cue shape:
 *   file         path under the script's output root
 *   prompt       text sent to the sound model
 *   from         derive from an existing candidate instead of generating; the
 *                path is relative to the output root and costs no credits
 *   duration     seconds requested from the API (minimum 0.5)
 *   outputFormat "mp3_44100_128" (default) or "pcm_44100"
 *   trimSeconds  cut the returned PCM to this length; pcm_44100 only
 *   lowpassHz    roll off above this frequency, preserving level; pcm_44100 only
 *   loop         ask the model for loopable audio, then crossfade the seam
 *   loopCrossfade seam blend length in seconds; defaults to 0.25
 *   superseded   tried and rejected; skipped unless named
 *   promoted     imported into the Unreal project; skipped unless named
 *
 * Generation is not deterministic, so a rebuild replaces audio rather than
 * reproducing it. That is why superseded and promoted cues are both held back
 * from a default run: one would lose the record of what was tried, the other
 * would desync a candidate from the asset already built out of it.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** Locates the data chunk rather than assuming a 44-byte header. */
function readWavPcm(path) {
  const file = readFileSync(path);
  let offset = 12;
  while (offset + 8 <= file.length) {
    const id = file.toString("ascii", offset, offset + 4);
    const size = file.readUInt32LE(offset + 4);
    if (id === "data") return Buffer.from(file.subarray(offset + 8, offset + 8 + size));
    offset += 8 + size + (size % 2);
  }
  throw new Error(`No data chunk in ${path}`);
}

const API = "https://api.elevenlabs.io";
const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const BYTES = BITS_PER_SAMPLE / 8;

export function loadEnv(root) {
  for (const line of readFileSync(join(root, ".env"), "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const split = trimmed.indexOf("=");
    const key = trimmed.slice(0, split).trim();
    const value = trimmed.slice(split + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function apiKey() {
  const value = process.env.ELEVENLABS_API_KEY?.trim();
  if (!value) throw new Error("ELEVENLABS_API_KEY is empty.");
  return value;
}

/**
 * Retries connection failures, rate limits and server faults with backoff.
 *
 * A run generates several cues in sequence and each one that succeeds has
 * already cost credits, so dropping the whole run on a transient socket error
 * means paying twice for the same audio. Client errors are returned as-is:
 * a bad prompt or a bad key will fail identically however many times it is sent.
 */
async function request(url, options, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.status < 500 && response.status !== 429) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) {
      const backoff = 2 ** (attempt - 1) * 1500;
      console.log(`  retry ${attempt}/${attempts - 1} in ${backoff}ms (${lastError.message})`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
  throw lastError;
}

export async function creditsUsed() {
  const response = await request(`${API}/v1/user/subscription`, {
    headers: { "xi-api-key": apiKey() },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Credit probe failed (${response.status}).`);
  return { used: data.character_count, limit: data.character_limit };
}

/**
 * Blends the tail of a clip over its head and drops the duplicated tail, so the
 * end of the result runs into its own start without a step.
 *
 * Asking the model for a loop gets audio with no silence padding and no rev,
 * but the two ends still meet at an arbitrary phase and, in practice, an
 * arbitrary level - measured at about 3.5 dB apart on the first engine takes,
 * which reads as a thump once per cycle. Weights are equal-power rather than
 * linear because the two ends are uncorrelated noise: summing them linearly
 * dips the level in the middle of the blend.
 */
function crossfadeLoop(pcm, seconds) {
  const total = pcm.length / BYTES;
  const fade = Math.min(Math.floor(seconds * SAMPLE_RATE), Math.floor(total / 2));
  if (fade <= 0) return pcm;

  const out = Buffer.from(pcm.subarray(0, (total - fade) * BYTES));
  for (let index = 0; index < fade; index += 1) {
    const t = index / fade;
    const head = pcm.readInt16LE(index * BYTES);
    const tail = pcm.readInt16LE((total - fade + index) * BYTES);
    const blended = Math.round(head * Math.sqrt(t) + tail * Math.sqrt(1 - t));
    out.writeInt16LE(Math.max(-32768, Math.min(32767, blended)), index * BYTES);
  }
  return out;
}

/**
 * Four cascaded one-pole lowpasses, about 24 dB per octave.
 *
 * Prompting for a dark sound gets one that is dark in energy terms while still
 * carrying a thin bright layer on top, and on a sustained cue that layer is the
 * whole perceived character. Filtering settles it regardless of what came back.
 * The filter starts from silence, so its first few milliseconds ramp in; on a
 * loop that transient lands inside the crossfade region and is weighted away.
 */
function lowpass(pcm, cutoffHz) {
  const total = pcm.length / BYTES;
  const a = 1 - Math.exp((-2 * Math.PI * cutoffHz) / SAMPLE_RATE);
  const stage = [0, 0, 0, 0];
  const filtered = new Float64Array(total);

  let inputSum = 0;
  let outputSum = 0;
  for (let index = 0; index < total; index += 1) {
    const sample = pcm.readInt16LE(index * BYTES);
    let value = sample;
    for (let k = 0; k < stage.length; k += 1) {
      stage[k] += a * (value - stage[k]);
      value = stage[k];
    }
    filtered[index] = value;
    inputSum += sample * sample;
    outputSum += value * value;
  }

  // Discarding most of the spectrum costs most of the level, so restore the
  // original RMS. Without this a filtered cue reads as quiet rather than dark,
  // and the two are not the same note to give an audio system.
  const gain = outputSum > 0 ? Math.sqrt(inputSum / outputSum) : 1;
  const out = Buffer.alloc(pcm.length);
  for (let index = 0; index < total; index += 1) {
    const scaled = Math.round(filtered[index] * gain);
    out.writeInt16LE(Math.max(-32768, Math.min(32767, scaled)), index * BYTES);
  }
  return out;
}

/** Ramps the tail to silence so a mid-waveform cut does not read as a click. */
function fadeOut(pcm, seconds) {
  const total = pcm.length / BYTES;
  const samples = Math.min(Math.floor(seconds * SAMPLE_RATE), total);
  for (let index = 0; index < samples; index += 1) {
    const offset = (total - samples + index) * BYTES;
    const gain = 1 - index / samples;
    pcm.writeInt16LE(Math.round(pcm.readInt16LE(offset) * gain), offset);
  }
}

function wrapWav(pcm) {
  const wav = Buffer.alloc(44 + pcm.length);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + pcm.length, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(CHANNELS, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * CHANNELS * BYTES, 28);
  wav.writeUInt16LE(CHANNELS * BYTES, 32);
  wav.writeUInt16LE(BITS_PER_SAMPLE, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(pcm.length, 40);
  pcm.copy(wav, 44);
  return wav;
}

async function generateCue(name, cue, outRoot) {
  const outputFormat = cue.from ? "pcm_44100" : cue.outputFormat ?? "mp3_44100_128";

  let buffer;
  if (cue.from) {
    // Filtering is deterministic, so a cue derived from an existing candidate is
    // reproducible in a way a regeneration is not. That matters when the source
    // take is the one with the qualities worth keeping and only its tone is wrong.
    buffer = readWavPcm(join(outRoot, cue.from));
  } else {
    const response = await request(`${API}/v1/sound-generation?output_format=${outputFormat}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey(), "Content-Type": "application/json" },
      body: JSON.stringify({
        text: cue.prompt,
        duration_seconds: cue.duration,
        loop: cue.loop === true,
        prompt_influence: 0.65,
        model_id: "eleven_text_to_sound_v2",
      }),
    });
    buffer = Buffer.from(await response.arrayBuffer());
    if (!response.ok) {
      throw new Error(`${name} failed (${response.status}): ${buffer.subarray(0, 400).toString()}`);
    }
  }

  let output = buffer;
  // A derived cue keeps whatever length its source had unless told otherwise.
  let seconds = cue.trimSeconds ?? cue.duration ?? Infinity;
  if (outputFormat === "pcm_44100") {
    const limit = Math.floor(seconds * SAMPLE_RATE) * BYTES * CHANNELS;
    let pcm = Buffer.from(buffer.subarray(0, Math.min(buffer.length, limit)));
    if (cue.lowpassHz) {
      pcm = lowpass(pcm, cue.lowpassHz);
    }
    if (cue.loop) {
      // Costs the crossfade length off the clip, so a loop ends up slightly
      // shorter than the duration requested from the API.
      pcm = crossfadeLoop(pcm, cue.loopCrossfade ?? 0.25);
    } else {
      // A cue that stops needs its tail ramped; a loop must not have one,
      // since the fade would land in the middle of the seam.
      fadeOut(pcm, 0.006);
    }
    seconds = pcm.length / BYTES / SAMPLE_RATE;
    output = wrapWav(pcm);
  }

  const path = join(outRoot, cue.file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, output);
  console.log(`OK ${name.padEnd(20)} ${seconds.toFixed(3)}s  ${cue.file}`);
}

/**
 * Resolves which cues to build from argv and generates them. Pass --dry-run to
 * see the selection without spending credits.
 */
export async function runCues({ cues, outRoot, root, argv }) {
  loadEnv(root);

  const dryRun = argv.includes("--dry-run");
  const requested = argv.filter((arg) => !arg.startsWith("--"));
  const names = requested.length
    ? requested
    : Object.keys(cues).filter((name) => !cues[name].superseded && !cues[name].promoted);

  const unknown = names.filter((name) => !cues[name]);
  if (unknown.length) {
    throw new Error(`Unknown cue(s): ${unknown.join(", ")}. Known: ${Object.keys(cues).join(", ")}`);
  }

  if (dryRun) {
    for (const name of names) {
      const cue = cues[name];
      const seconds = cue.trimSeconds ?? cue.duration;
      const length = seconds ? `${seconds.toFixed(3)}s` : "source";
      const origin = cue.from ? `from ${cue.from}` : "generated";
      console.log(
        `DRY ${name.padEnd(20)} ${length.padStart(7)}  ${cue.loop ? "loop " : "     "}` +
          `${cue.file.padEnd(32)} ${origin}`,
      );
    }
    return;
  }

  const before = await creditsUsed();
  console.log(`credits before: ${before.used}/${before.limit}`);
  for (const name of names) {
    await generateCue(name, cues[name], outRoot);
  }
  const after = await creditsUsed();
  console.log(`credits after:  ${after.used}/${after.limit}`);
}
