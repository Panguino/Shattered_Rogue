/**
 * Shared GLB reader: returns world-space triangles for a .glb.
 *
 * Tripo emits a scene graph rather than a single baked mesh, so node
 * transforms have to be composed before any position is trusted. Everything
 * here stays in glTF space (metres, Y-up, right-handed); converting to Unreal
 * is the caller's job.
 */

import fs from "node:fs";

export function readGlb(file) {
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

export function readAccessor(json, bin, index) {
  const accessor = json.accessors[index];
  const view = json.bufferViews[accessor.bufferView];
  const base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
  const readers = {
    5121: [1, (at) => bin.readUInt8(at)],
    5123: [2, (at) => bin.readUInt16LE(at)],
    5125: [4, (at) => bin.readUInt32LE(at)],
    5126: [4, (at) => bin.readFloatLE(at)],
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

function identity() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let row = 0; row < 4; ++row) {
    for (let column = 0; column < 4; ++column) {
      let sum = 0;
      for (let inner = 0; inner < 4; ++inner) {
        sum += a[inner * 4 + column] * b[row * 4 + inner];
      }
      out[row * 4 + column] = sum;
    }
  }
  return out;
}

function composeNodeMatrix(node) {
  if (node.matrix) return node.matrix.slice();

  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const [qx, qy, qz, qw] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];

  const rotation = [
    1 - 2 * (qy * qy + qz * qz), 2 * (qx * qy + qz * qw), 2 * (qx * qz - qy * qw),
    2 * (qx * qy - qz * qw), 1 - 2 * (qx * qx + qz * qz), 2 * (qy * qz + qx * qw),
    2 * (qx * qz + qy * qw), 2 * (qy * qz - qx * qw), 1 - 2 * (qx * qx + qy * qy),
  ];

  return [
    rotation[0] * sx, rotation[1] * sx, rotation[2] * sx, 0,
    rotation[3] * sy, rotation[4] * sy, rotation[5] * sy, 0,
    rotation[6] * sz, rotation[7] * sz, rotation[8] * sz, 0,
    tx, ty, tz, 1,
  ];
}

function transformPoint(matrix, point) {
  const [x, y, z] = point;
  return [
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
  ];
}

/** Every triangle in the file, in glTF world space. */
export function readTriangles(file) {
  const { json, bin } = readGlb(file);
  const triangles = [];

  const visit = (nodeIndex, parentMatrix) => {
    const node = json.nodes[nodeIndex];
    const matrix = multiply(parentMatrix, composeNodeMatrix(node));

    if (node.mesh != null) {
      for (const primitive of json.meshes[node.mesh].primitives) {
        const positions = readAccessor(json, bin, primitive.attributes.POSITION);
        const indices =
          primitive.indices != null
            ? readAccessor(json, bin, primitive.indices)
            : positions.map((_, index) => index / 3).filter(Number.isInteger);

        for (let corner = 0; corner < indices.length; corner += 3) {
          triangles.push(
            [0, 1, 2].map((offset) => {
              const vertex = indices[corner + offset];
              return transformPoint(matrix, [
                positions[vertex * 3],
                positions[vertex * 3 + 1],
                positions[vertex * 3 + 2],
              ]);
            }),
          );
        }
      }
    }

    for (const child of node.children ?? []) visit(child, matrix);
  };

  const scene = json.scenes[json.scene ?? 0];
  for (const root of scene.nodes) visit(root, identity());
  return triangles;
}

export function boundsOf(triangles) {
  const low = [Infinity, Infinity, Infinity];
  const high = [-Infinity, -Infinity, -Infinity];
  for (const triangle of triangles) {
    for (const point of triangle) {
      for (let axis = 0; axis < 3; ++axis) {
        if (point[axis] < low[axis]) low[axis] = point[axis];
        if (point[axis] > high[axis]) high[axis] = point[axis];
      }
    }
  }
  return {
    low,
    high,
    size: [0, 1, 2].map((axis) => high[axis] - low[axis]),
    center: [0, 1, 2].map((axis) => (high[axis] + low[axis]) / 2),
  };
}
