// Generate weapon concept PNGs with the Codex CLI's image_generation tool (ChatGPT subscription).
// Usage: node art/codex-weapon-image.mjs gimbal-base [laser-cannon ...] [--all] [--assembled] [--force]
// Prompts come from art/weapons.json. Ace (art/ace.png) is attached as the style reference.
// Output: art/weapons/{id}.png. Existing files are skipped unless --force.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const data = JSON.parse(fs.readFileSync(path.join(here, "weapons.json"), "utf8"));

const args = process.argv.slice(2);
const force = args.includes("--force");
const targets = [];
if (args.includes("--all")) targets.push(data.mount.id, ...data.weapons.map((w) => w.id));
if (args.includes("--assembled")) targets.push("assembled-check");
targets.push(...args.filter((a) => !a.startsWith("--")));
if (!targets.length) {
  console.error("Give at least one id: gimbal-base, laser-cannon, seeker-rocket, lightning-coil, or --all / --assembled");
  process.exit(1);
}

function promptFor(id) {
  if (id === data.mount.id) return data.mount.prompt;
  if (id === "assembled-check") return data.assembledPrompt;
  const w = data.weapons.find((x) => x.id === id);
  if (!w) throw new Error(`unknown id ${id}`);
  return w.prompt;
}

for (const id of targets) {
  const rel = `art/weapons/${id}.png`;
  const out = path.join(root, rel);
  if (fs.existsSync(out) && !force) {
    console.log(`skip ${id} (exists, use --force)`);
    continue;
  }
  const task = `Use your image generation tool to create ONE image and save it to ${rel} (1024x1024 PNG). The attached image is the Ace interceptor: match its art style, materials, camera, and lighting exactly. Do not write any other files. Do not edit any files. When done, reply with the saved path only.

IMAGE PROMPT:
${promptFor(id)}`;

  console.log(`codex → ${rel}`);
  const r = spawnSync(
    "codex",
    ["exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", root, "-i", path.join(root, "art/ace.png"), "-"],
    { input: task, stdio: ["pipe", "inherit", "inherit"], shell: process.platform === "win32" }
  );
  if (r.status !== 0) {
    console.error(`codex exited ${r.status} for ${id}`);
    process.exit(r.status ?? 1);
  }
  if (!fs.existsSync(out)) {
    console.error(`codex finished but ${rel} was not written`);
    process.exit(1);
  }
  console.log(`wrote ${rel}`);
}
