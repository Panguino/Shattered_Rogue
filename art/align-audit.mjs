/**
 * Reports how far each kit mesh sits from the coordinate system it will be
 * placed on.
 *
 * Tripo orients a result to the concept image's implied camera, not to any
 * canonical axis, so a part that reads as a clean cylinder can arrive lying on a
 * diagonal. Everything downstream assumes otherwise: the socket seeder slices
 * along world axes to find end faces, and the runtime solve can only rotate the
 * mesh rigidly, so it cannot undo a baked-in tilt.
 *
 * Tilt is measured as the angle between each principal axis of the surface and
 * the nearest world axis. Waste is the axis-aligned box volume over the oriented
 * box volume: a tilted part needs a much larger AABB than it deserves, which is
 * the same error the seeder trips over.
 *
 * Usage: node art/align-audit.mjs [glob-free directory]
 */

import fs from "node:fs";
import path from "node:path";
import { readTriangles, boundsOf } from "./glb-geometry.mjs";

const MODELS = process.argv[2] ??
  path.join("art", "enemies", "equation", "cold-iron-kit", "models");

const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (v, k) => v.map((value) => value * k);
const subtract = (a, b) => a.map((value, index) => value - b[index]);
const length = (v) => Math.sqrt(dot(v, v));

/**
 * Area-weighted covariance of the surface.
 *
 * Weighting by area rather than counting vertices matters here: these meshes are
 * decimated unevenly, so a densely tessellated boss would otherwise drag the
 * principal axis toward itself and away from the part's real long axis.
 */
function covariance(triangles) {
  let totalArea = 0;
  const centroid = [0, 0, 0];
  const weighted = [];

  for (const [a, b, c] of triangles) {
    const area = length(cross(subtract(b, a), subtract(c, a))) / 2;
    if (area <= 0) continue;
    const middle = [0, 1, 2].map((axis) => (a[axis] + b[axis] + c[axis]) / 3);
    weighted.push([middle, area]);
    totalArea += area;
    for (let axis = 0; axis < 3; ++axis) centroid[axis] += middle[axis] * area;
  }
  for (let axis = 0; axis < 3; ++axis) centroid[axis] /= totalArea;

  const matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const [middle, area] of weighted) {
    const offset = subtract(middle, centroid);
    for (let row = 0; row < 3; ++row) {
      for (let column = 0; column < 3; ++column) {
        matrix[row][column] += (area / totalArea) * offset[row] * offset[column];
      }
    }
  }
  return { matrix, centroid };
}

/** Jacobi eigenvalue iteration; the matrix is symmetric 3x3 by construction. */
function eigen(input) {
  const matrix = input.map((row) => row.slice());
  let vectors = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  for (let sweep = 0; sweep < 64; ++sweep) {
    let row = 0;
    let column = 1;
    let largest = 0;
    for (let r = 0; r < 3; ++r) {
      for (let c = r + 1; c < 3; ++c) {
        if (Math.abs(matrix[r][c]) > largest) {
          largest = Math.abs(matrix[r][c]);
          row = r;
          column = c;
        }
      }
    }
    if (largest < 1e-14) break;

    const theta =
      (matrix[column][column] - matrix[row][row]) / (2 * matrix[row][column]);
    const t =
      Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const cos = 1 / Math.sqrt(t * t + 1);
    const sin = t * cos;

    const rotated = matrix.map((line) => line.slice());
    for (let k = 0; k < 3; ++k) {
      rotated[row][k] = cos * matrix[row][k] - sin * matrix[column][k];
      rotated[column][k] = sin * matrix[row][k] + cos * matrix[column][k];
    }
    const next = rotated.map((line) => line.slice());
    for (let k = 0; k < 3; ++k) {
      next[k][row] = cos * rotated[k][row] - sin * rotated[k][column];
      next[k][column] = sin * rotated[k][row] + cos * rotated[k][column];
    }
    for (let r = 0; r < 3; ++r) for (let c = 0; c < 3; ++c) matrix[r][c] = next[r][c];

    const spun = vectors.map((line) => line.slice());
    for (let k = 0; k < 3; ++k) {
      spun[k][row] = cos * vectors[k][row] - sin * vectors[k][column];
      spun[k][column] = sin * vectors[k][row] + cos * vectors[k][column];
    }
    vectors = spun;
  }

  const axes = [0, 1, 2]
    .map((index) => ({
      value: matrix[index][index],
      vector: [vectors[0][index], vectors[1][index], vectors[2][index]],
    }))
    .sort((a, b) => b.value - a.value);
  return axes;
}

/** Extent of the surface along an arbitrary direction. */
function extentAlong(triangles, centroid, direction) {
  let low = Infinity;
  let high = -Infinity;
  for (const triangle of triangles) {
    for (const point of triangle) {
      const along = dot(subtract(point, centroid), direction);
      if (along < low) low = along;
      if (along > high) high = along;
    }
  }
  return high - low;
}

function nearestAxisAngle(vector) {
  const best = Math.max(
    Math.abs(vector[0]),
    Math.abs(vector[1]),
    Math.abs(vector[2]),
  );
  return (Math.acos(Math.min(1, best)) * 180) / Math.PI;
}

const files = fs
  .readdirSync(MODELS)
  .filter((name) => name.endsWith(".glb"))
  .sort();

const rows = [];
for (const name of files) {
  const triangles = readTriangles(path.join(MODELS, name));
  const bounds = boundsOf(triangles);
  const { matrix, centroid } = covariance(triangles);
  const axes = eigen(matrix);

  const tilts = axes.map((axis) => nearestAxisAngle(axis.vector));
  const oriented = axes.map((axis) =>
    extentAlong(triangles, centroid, axis.vector),
  );
  const aabbVolume = bounds.size[0] * bounds.size[1] * bounds.size[2];
  const obbVolume = oriented[0] * oriented[1] * oriented[2];

  // Two nearly equal eigenvalues mean the cross-section is round or square and
  // the axes inside that plane are arbitrary. Spinning such a part about its
  // long axis is meaningless, so its tilt reading is only trustworthy on the
  // dominant axis.
  const ambiguous =
    Math.abs(axes[1].value - axes[2].value) <
    Math.max(axes[1].value, axes[2].value) * 0.12;

  rows.push({
    name: name.replace(/^cold-iron-v2-|\.glb$/g, ""),
    tilt: Math.max(...tilts),
    dominant: tilts[0],
    waste: aabbVolume / obbVolume,
    ambiguous,
    // Named rather than numbered: the point of checking is that a rod's length
    // ended up on the axis its family expects, and "Y" reads where "1" does not.
    longest: "XYZ"[bounds.size.indexOf(Math.max(...bounds.size))],
    size: bounds.size,
  });
}

rows.sort((a, b) => b.dominant - a.dominant);

const pad = (text, width) => String(text).padEnd(width);
console.log(
  `${pad("asset", 30)} ${pad("long-axis tilt", 15)} ${pad("worst tilt", 11)} ${pad(
    "aabb waste",
    11,
  )} ${pad("long", 5)} ${pad("extents (gltf xyz)", 24)} note`,
);
for (const row of rows) {
  const flag = row.dominant >= 8 ? "MISALIGNED" : row.dominant >= 3 ? "check" : "";
  const extents = row.size.map((value) => value.toFixed(2)).join(" x ");
  console.log(
    `${pad(row.name, 30)} ${pad(`${row.dominant.toFixed(1)} deg`, 15)} ${pad(
      `${row.tilt.toFixed(1)} deg`,
      11,
    )} ${pad(`${row.waste.toFixed(2)}x`, 11)} ${pad(row.longest, 5)} ${pad(
      extents,
      24,
    )} ${flag}${row.ambiguous ? (flag ? " " : "") + "(round section)" : ""}`,
  );
}

const bad = rows.filter((row) => row.dominant >= 8).length;
console.log(
  `\n${bad} of ${rows.length} meshes are tilted 8 deg or more off the nearest axis.`,
);
