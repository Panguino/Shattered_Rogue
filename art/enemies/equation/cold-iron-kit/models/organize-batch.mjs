#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../../../..");
const STATE = path.join(HERE, "tripo-batch.yaml.state.json");
const OVERRIDES = path.join(HERE, "tripo-overrides.json");

const categoryOrder = [
  "electrical-terminal",
  "rod",
  "panel",
  "joint",
  "weapon",
  "propulsion",
  "heatsink",
  "battery",
  "light",
  "hub",
];

const review = {
  "cold-iron-v2-rod-a-spine": {
    status: "review",
    note: "End and side attachment sockets reconstructed as open bores.",
  },
  "cold-iron-v2-rod-b-telescoping": {
    status: "review",
    note: "One end attachment reconstructed as an open bore.",
  },
  "cold-iron-v2-rod-c-lattice": {
    status: "pass",
    note: "R2 reads as a straight truss rod with solid capped end plates.",
  },
  "cold-iron-v2-panel-b-wedge": {
    status: "review",
    note: "Multiple attachment points reconstructed as open bores.",
  },
  "cold-iron-v2-panel-c-ribbed": {
    status: "review",
    note: "R3 is watertight (0 open edges) after R2 rendered see-through from below; confirm the ribs still read.",
  },
  "cold-iron-v2-joint-b-gimbal": {
    status: "review",
    note: "Silhouette is compressed and less mechanically legible than the concept.",
  },
  "cold-iron-v2-weapon-c-missile-pod": {
    status: "pass",
    note: "R2 preserves six visible recessed missile noses in a 2x3 array.",
  },
  "cold-iron-v2-propulsion-a-compact": {
    status: "review",
    note: "Nozzle and cyan thrust face are not legible in the generated preview.",
  },
  "cold-iron-v2-heatsink-b-radial": {
    status: "review",
    note: "Front attachment collar reconstructed as a deep open bore.",
  },
  "cold-iron-v2-heatsink-c-cooling-plate": {
    status: "review",
    note: "Both end attachment collars reconstructed as open bores.",
  },
  "cold-iron-v2-battery-b-cell-bank": {
    status: "review",
    note: "One attachment collar reconstructed as an open bore.",
  },
  "cold-iron-v2-battery-c-capacitor": {
    status: "review",
    note: "Bottom attachment collar reconstructed as an open bore.",
  },
  "cold-iron-v2-light-b-beacon-cluster": {
    status: "pass",
    note: "R2 preserves three distinct amber lenses and a solid rear mount.",
  },
  "cold-iron-v2-light-c-flood-bar": {
    status: "review",
    note: "Bottom attachment collar reconstructed as an open bore.",
  },
};

function readGlb(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.readUInt32LE(0) !== 0x46546c67) {
    throw new Error(`${file}: not a GLB`);
  }

  let offset = 12;
  let json;
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
  return {
    triangles: Math.round(triangles),
    vertices,
    megabytes: Number((bytes / 1024 / 1024).toFixed(2)),
    materials: (json.materials ?? []).length,
    textures: (json.images ?? []).length,
  };
}

function categoryFor(name) {
  return (
    categoryOrder.find((category) =>
      name.startsWith(`cold-iron-v2-${category}-`),
    ) ?? "other"
  );
}

function titleFor(name) {
  return name
    .replace(/^cold-iron-v2-/, "")
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function copyArtifacts(name, outputDir) {
  const sourceDir = path.resolve(ROOT, outputDir);
  const modelSource = path.join(sourceDir, "model.glb");
  const previewSource = path.join(sourceDir, "preview.png");
  if (!fs.existsSync(modelSource) || !fs.existsSync(previewSource)) {
    throw new Error(`Missing downloaded artifacts for ${name}`);
  }
  fs.copyFileSync(modelSource, path.join(HERE, `${name}.glb`));
  fs.copyFileSync(previewSource, path.join(HERE, `${name}-preview.png`));
}

if (fs.existsSync(STATE)) {
  const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
  for (const [name, job] of Object.entries(state.jobs ?? {})) {
    if (job.status !== "success") continue;
    copyArtifacts(name, job.output_dir);
  }
}

// Later approved revisions override the original resumable batch without
// mutating its state file or risking a future catalog rebuild restoring r1.
if (fs.existsSync(OVERRIDES)) {
  const overrides = JSON.parse(fs.readFileSync(OVERRIDES, "utf8"));
  for (const [name, job] of Object.entries(overrides)) {
    copyArtifacts(name, job.output_dir);
  }
}

const entries = fs
  .readdirSync(HERE)
  .filter((file) => /^cold-iron-v2-.+\.glb$/.test(file))
  .map((file) => {
    const name = file.replace(/\.glb$/, "");
    const preview = `${name}-preview.png`;
    if (!fs.existsSync(path.join(HERE, preview))) {
      throw new Error(`Missing preview for ${name}`);
    }
    return {
      name,
      title: titleFor(name),
      category: categoryFor(name),
      model: file,
      preview,
      review: review[name] ?? { status: "pass", note: "No obvious issue in the generator preview." },
      ...inspect(path.join(HERE, file)),
    };
  })
  .sort((a, b) => {
    const byCategory =
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    return byCategory || a.name.localeCompare(b.name);
  });

fs.writeFileSync(
  path.join(HERE, "catalog.json"),
  `${JSON.stringify({ generated: new Date().toISOString(), entries }, null, 2)}\n`,
);

const totalTriangles = entries.reduce((sum, entry) => sum + entry.triangles, 0);
console.log(
  JSON.stringify(
    {
      models: entries.length,
      total_triangles: totalTriangles,
      average_triangles: Math.round(totalTriangles / entries.length),
      largest: entries.reduce((a, b) => (a.triangles > b.triangles ? a : b)),
    },
    null,
    2,
  ),
);
