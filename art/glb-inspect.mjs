#!/usr/bin/env node
/**
 * Report triangle, vertex, and texture budgets for a .glb.
 *
 * Usage: node art/glb-inspect.mjs <file.glb> [more.glb ...]
 */

import fs from "node:fs";
import path from "node:path";

function readGlb(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error(`${file}: not a GLB`);
  let offset = 12;
  let json = null;
  let bin = null;
  while (offset < buffer.length) {
    const length = buffer.readUInt32LE(offset);
    const type = buffer.readUInt32LE(offset + 4);
    const chunk = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 0x4e4f534a) json = JSON.parse(chunk.toString("utf8"));
    if (type === 0x004e4942) bin = chunk;
    offset += 8 + length + ((4 - (length % 4)) % 4);
  }
  return { json, bin, size: buffer.length };
}

function readAccessor(json, bin, index) {
  const accessor = json.accessors[index];
  const view = json.bufferViews[accessor.bufferView];
  const base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
  const readers = {
    5121: [1, (offset) => bin.readUInt8(offset)],
    5123: [2, (offset) => bin.readUInt16LE(offset)],
    5125: [4, (offset) => bin.readUInt32LE(offset)],
    5126: [4, (offset) => bin.readFloatLE(offset)],
  };
  const [elementSize, read] = readers[accessor.componentType];
  const stride = view.byteStride || elementSize * components;

  const values = new Array(accessor.count * components);
  for (let element = 0; element < accessor.count; ++element) {
    for (let component = 0; component < components; ++component) {
      values[element * components + component] = read(
        base + element * stride + component * elementSize,
      );
    }
  }
  return values;
}

// Tripo splits vertices at UV seams, so raw index pairs report thousands of
// false open edges. Welding by rounded position first leaves only edges that
// bound an actual hole in the surface.
function countOpenEdges(json, bin) {
  let openEdges = 0;
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives) {
      if (primitive.indices == null) continue;
      const positions = readAccessor(json, bin, primitive.attributes.POSITION);
      const indices = readAccessor(json, bin, primitive.indices);

      // Weld tolerance scales with the part: a fixed epsilon reports cracks
      // between abutting shells that render as one solid surface.
      const extent = [0, 1, 2].map((axis) => {
        let low = Infinity;
        let high = -Infinity;
        for (let vertex = 0; vertex * 3 < positions.length; ++vertex) {
          const value = positions[vertex * 3 + axis];
          if (value < low) low = value;
          if (value > high) high = value;
        }
        return high - low;
      });
      const tolerance = Math.hypot(...extent) / 2000;

      const welded = new Map();
      const remap = new Array(positions.length / 3);
      for (let vertex = 0; vertex < remap.length; ++vertex) {
        const key = [0, 1, 2]
          .map((axis) => Math.round(positions[vertex * 3 + axis] / tolerance))
          .join(",");
        if (!welded.has(key)) welded.set(key, welded.size);
        remap[vertex] = welded.get(key);
      }

      const adjacency = new Map();
      for (let triangle = 0; triangle < indices.length; triangle += 3) {
        const corners = [
          remap[indices[triangle]],
          remap[indices[triangle + 1]],
          remap[indices[triangle + 2]],
        ];
        for (let corner = 0; corner < 3; ++corner) {
          const a = corners[corner];
          const b = corners[(corner + 1) % 3];
          const key = a < b ? `${a}_${b}` : `${b}_${a}`;
          adjacency.set(key, (adjacency.get(key) ?? 0) + 1);
        }
      }

      for (const uses of adjacency.values()) {
        if (uses === 1) ++openEdges;
      }
    }
  }
  return openEdges;
}

// PNG and JPEG headers are enough to size every texture Tripo emits.
function imageSize(bytes) {
  if (bytes.readUInt32BE(0) === 0x89504e47) {
    return { format: "PNG", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          format: "JPEG",
          height: bytes.readUInt16BE(offset + 5),
          width: bytes.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
    return { format: "JPEG", width: 0, height: 0 };
  }
  if (bytes.subarray(8, 12).toString("ascii") === "WEBP") return { format: "WEBP", width: 0, height: 0 };
  return { format: "?", width: 0, height: 0 };
}

for (const file of process.argv.slice(2)) {
  const { json, bin, size } = readGlb(file);
  let triangles = 0;
  let vertices = 0;
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives) {
      const position = json.accessors[primitive.attributes.POSITION];
      vertices += position.count;
      triangles +=
        primitive.indices != null ? json.accessors[primitive.indices].count / 3 : position.count / 3;
    }
  }

  const textures = (json.images ?? []).map((image, index) => {
    const view = json.bufferViews[image.bufferView];
    const bytes = bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
    const info = imageSize(bytes);
    return `    image ${index}  ${info.width}x${info.height} ${info.format}  ${(view.byteLength / 1024).toFixed(0)} KB  ${image.name ?? ""}`;
  });

  const materialUsage = (json.materials ?? []).map((material) => {
    const slots = [];
    const pbr = material.pbrMetallicRoughness ?? {};
    if (pbr.baseColorTexture) slots.push("baseColor");
    if (pbr.metallicRoughnessTexture) slots.push("metallicRoughness");
    if (material.normalTexture) slots.push("normal");
    if (material.occlusionTexture) slots.push("occlusion");
    if (material.emissiveTexture) slots.push("emissive");
    return `    ${material.name ?? "material"}: ${slots.join(", ") || "untextured"}`;
  });

  console.log(path.relative(process.cwd(), file));
  console.log(`  file        ${(size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  triangles   ${triangles.toLocaleString()}`);
  console.log(`  vertices    ${vertices.toLocaleString()}`);
  console.log(`  open edges  ${countOpenEdges(json, bin).toLocaleString()} (welded)`);
  console.log(`  materials   ${(json.materials ?? []).length}`);
  console.log(materialUsage.join("\n"));
  console.log(`  images      ${(json.images ?? []).length}`);
  console.log(textures.join("\n"));
}
