#!/usr/bin/env node
/**
 * Generate a UE-ready ship mesh from a concept PNG via Tripo CLI.
 *
 * Locked Ace settings:
 *   model            tripo-p1 (P1-20260311 — game-ready Smart Mesh)
 *   topology         triangles (quad=false)
 *   face_limit       6000 (ok 4000–8000)
 *   texture          2K PNG, PBR on, original-image alignment
 *   export           GLB/GLTF for wiki + FBX for Unreal
 *
 * Auth: `tripo login` in a terminal, or set TRIPO_API_KEY. Never commit the key.
 *
 * Usage:
 *   node art/tripo-ship.mjs
 *   node art/tripo-ship.mjs interceptor/ace
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    if (k && process.env[k] == null) process.env[k] = v;
  }
  if (!process.env.TRIPO_API_KEY) {
    process.env.TRIPO_API_KEY = process.env.TRIPLE_A_API_KEY || process.env.TRIPO3D_API_KEY;
  }
}

loadEnv();
if (!process.env.TRIPO_API_KEY) {
  console.error("No Tripo key found. Put TRIPO_API_KEY (or TRIPLE_A_API_KEY) in .env");
  process.exit(3);
}
const OUT_ROOT = path.join(ROOT, "art", "tripo-out");
const SHIP = (process.argv[2] || "interceptor/ace").replace(/\\/g, "/");
const [hull, id] = SHIP.split("/");
if (!hull || !id) {
  console.error("Usage: node art/tripo-ship.mjs <hull>/<id>");
  process.exit(2);
}

const png = path.join(ROOT, "art", "ships", hull, `${id}.png`);
const destDir = path.join(ROOT, "art", "ships", hull);
if (!fs.existsSync(png)) {
  console.error(`Missing concept image: ${png}`);
  process.exit(2);
}

const FACE_LIMIT = 6000;
const TEXTURE_SIZE = 2048;

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("tripo", args, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "inherit"],
      shell: true,
    });
    let stdout = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`tripo ${args[0]} exited ${code}`));
        return;
      }
      const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "{}";
      try {
        resolve(JSON.parse(line));
      } catch {
        resolve({ raw: stdout });
      }
    });
  });
}

function copyIfExists(srcDir, destName) {
  if (!srcDir || !fs.existsSync(srcDir)) return null;
  const files = fs.readdirSync(srcDir);
  const pick =
    files.find((f) => f.toLowerCase().endsWith(path.extname(destName).toLowerCase()) && /model/i.test(f)) ||
    files.find((f) => f.toLowerCase().endsWith(path.extname(destName).toLowerCase()));
  if (!pick) return null;
  const dest = path.join(destDir, destName);
  fs.copyFileSync(path.join(srcDir, pick), dest);
  return dest;
}

fs.mkdirSync(OUT_ROOT, { recursive: true });
fs.mkdirSync(destDir, { recursive: true });

console.error(`Tripo Ace-style generate: ${hull}/${id}`);
console.error(`  input        ${path.relative(ROOT, png)}`);
console.error(`  model        tripo-p1 · ${FACE_LIMIT} tris · ${TEXTURE_SIZE} PNG`);

const made = await run([
  "make",
  png,
  "--model",
  "tripo-p1",
  "--for",
  "game-mobile",
  "-p",
  `face_limit=${FACE_LIMIT}`,
  "-p",
  "texture=true",
  "-p",
  "pbr=true",
  "-p",
  "texture_quality=detailed",
  "-p",
  "auto_size=true",
  "-p",
  "texture_alignment=original_image",
  "--then",
  `convert:format=GLTF,texture_size=${TEXTURE_SIZE},texture_format=PNG`,
  "--name",
  id,
  "-o",
  OUT_ROOT,
  "--json",
  "--yes",
  "--no-open",
]);

const glb = copyIfExists(made.output_dir, `${id}.glb`) || copyIfExists(made.output_dir, `${id}.gltf`);
console.error(`  gltf task    ${made.task_id || "?"}  credits=${made.credits_consumed ?? "?"}`);
if (glb) console.error(`  wrote        ${path.relative(ROOT, glb)}`);

const fbxJob = await run([
  "model",
  "convert",
  "@last",
  "--format",
  "FBX",
  "--texture-size",
  String(TEXTURE_SIZE),
  "--texture-format",
  "PNG",
  "--fbx-preset",
  "blender",
  "--pivot-to-center-bottom",
  "--name",
  `${id}-fbx`,
  "-o",
  OUT_ROOT,
  "--json",
  "--yes",
  "--no-open",
]);

const fbx = copyIfExists(fbxJob.output_dir, `${id}.fbx`);
if (fbx) console.error(`  wrote        ${path.relative(ROOT, fbx)}`);

const sidecar = {
  ship: `${hull}/${id}`,
  generated: new Date().toISOString().slice(0, 10),
  model: "P1-20260311",
  face_limit: FACE_LIMIT,
  texture_size: TEXTURE_SIZE,
  texture_format: "PNG",
  pbr: true,
  auto_size: true,
  gltf_task: made.task_id,
  fbx_task: fbxJob.task_id,
  files: { glb, fbx },
};
fs.writeFileSync(path.join(destDir, `${id}.tripo.json`), JSON.stringify(sidecar, null, 2) + "\n");
console.log(JSON.stringify({ ok: true, ...sidecar }, null, 2));
