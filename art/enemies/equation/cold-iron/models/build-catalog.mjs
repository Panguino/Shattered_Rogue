#!/usr/bin/env node

/**
 * Builds a complete concept/model catalog for the Cold Iron ships.
 *
 * Every source image is listed even before its model exists. Successful Tripo
 * batch artifacts are copied beside this viewer, then the corresponding entry
 * upgrades from "image only" to an interactive model with measured geometry
 * stats. Re-running this file is therefore safe during or after a resumable
 * batch.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONCEPTS = path.dirname(HERE);
const ROOT = path.resolve(HERE, "../../../../..");
const STATE = path.join(HERE, "tripo-batch.yaml.state.json");
const TARGET_MIN = 6000;
const TARGET_MAX = 9000;

const familyOrder = ["needle", "vector", "mortar", "bastion", "relay"];

const descriptions = {
  "needle-spindle": "Vertical steel spindle with a lower lance emitter and an off-centre battery pod.",
  "needle-ballthorn": "Machined plated ball with one long ramming thorn and an exposed cell.",
  "needle-hook": "Deep steel crescent with an inner muzzle and machinery along the open curve.",
  "vector-gyro": "Machined sphere in unequal gimbal rings with one short axial barrel.",
  "vector-mast": "Upright spar with a low thruster block, high sensor head, and offset systems.",
  "vector-wedge": "Deep chiselled wedge sheared open over its cell bank with one corner barrel.",
  "mortar-drum": "Stepped vertical drum with one angled launch tube, cells, and cooling fins.",
  "mortar-kettle": "Squat iron spheroid with one broad mortar mouth and flank-mounted cells.",
  "mortar-column": "Mismatched rings and drums threaded onto a shaft with one clamped tube.",
  "bastion-orb": "Dense iron sphere in unequal armour bands with an exposed battery core.",
  "bastion-pillar": "Top-heavy monolith of stacked slabs with an exposed battery column.",
  "bastion-anvil": "Compact overhanging mass with one lip-mounted cannon and recessed cells.",
  "relay-cage": "Asymmetric skeletal rib cage around a suspended violet core.",
  "relay-spire": "Kinked obelisk of narrowing segments with one battery canister and emitter.",
  "relay-stack": "Three offset discs on short struts with a violet field in the gaps.",
};

function readGlb(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.readUInt32LE(0) !== 0x46546c67) {
    throw new Error(`${file}: not a GLB`);
  }

  let offset = 12;
  let json = null;
  while (offset < buffer.length) {
    const length = buffer.readUInt32LE(offset);
    const type = buffer.readUInt32LE(offset + 4);
    if (type === 0x4e4f534a) {
      json = JSON.parse(
        buffer.subarray(offset + 8, offset + 8 + length).toString("utf8"),
      );
      break;
    }
    offset += 8 + length + ((4 - (length % 4)) % 4);
  }
  if (!json) throw new Error(`${file}: missing glTF JSON`);
  return { json, bytes: buffer.length };
}

function inspect(file) {
  const { json, bytes } = readGlb(file);
  let triangles = 0;
  let vertices = 0;
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives) {
      const positions = json.accessors[primitive.attributes.POSITION];
      vertices += positions.count;
      triangles +=
        primitive.indices == null
          ? positions.count / 3
          : json.accessors[primitive.indices].count / 3;
    }
  }
  triangles = Math.round(triangles);
  return {
    triangles,
    vertices,
    megabytes: Number((bytes / 1024 / 1024).toFixed(2)),
    materials: (json.materials ?? []).length,
    textures: (json.images ?? []).length,
    budget:
      triangles < TARGET_MIN
        ? "under"
        : triangles > TARGET_MAX
          ? "over"
          : "target",
  };
}

function titleFor(name) {
  return name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function copyFinishedArtifacts() {
  if (!fs.existsSync(STATE)) return;
  const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
  for (const [name, job] of Object.entries(state.jobs ?? {})) {
    if (job.status !== "success") continue;
    const source = path.resolve(ROOT, job.output_dir);
    const model = path.join(source, "model.glb");
    const preview = path.join(source, "preview.png");
    if (fs.existsSync(model)) {
      fs.copyFileSync(model, path.join(HERE, `${name}.glb`));
    }
    if (fs.existsSync(preview)) {
      fs.copyFileSync(preview, path.join(HERE, `${name}-preview.png`));
    }
  }
}

copyFinishedArtifacts();

const entries = fs
  .readdirSync(CONCEPTS)
  .filter((file) => file.endsWith(".png"))
  .map((file) => {
    const name = file.replace(/\.png$/, "");
    const family = familyOrder.find((value) => name.startsWith(`${value}-`));
    if (!family) throw new Error(`Unrecognised Cold Iron concept: ${file}`);

    const modelName = `${name}.glb`;
    const previewName = `${name}-preview.png`;
    const modelPath = path.join(HERE, modelName);
    const hasModel = fs.existsSync(modelPath);
    return {
      name,
      title: titleFor(name),
      family,
      description: descriptions[name] ?? "",
      image: `../${file}`,
      model: hasModel ? modelName : null,
      preview: fs.existsSync(path.join(HERE, previewName))
        ? previewName
        : `../${file}`,
      status: hasModel ? "model-ready" : "image-only",
      targetTriangles: [TARGET_MIN, TARGET_MAX],
      ...(hasModel ? inspect(modelPath) : {}),
    };
  })
  .sort((a, b) => {
    const family = familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family);
    return family || a.name.localeCompare(b.name);
  });

const summary = {
  concepts: entries.length,
  models: entries.filter((entry) => entry.model).length,
  target: entries.filter((entry) => entry.budget === "target").length,
  totalTriangles: entries.reduce(
    (sum, entry) => sum + (entry.triangles ?? 0),
    0,
  ),
};

fs.writeFileSync(
  path.join(HERE, "catalog.json"),
  `${JSON.stringify(
    {
      generated: new Date().toISOString(),
      targetTriangles: [TARGET_MIN, TARGET_MAX],
      summary,
      entries,
    },
    null,
    2,
  )}\n`,
);

console.log(JSON.stringify(summary, null, 2));
