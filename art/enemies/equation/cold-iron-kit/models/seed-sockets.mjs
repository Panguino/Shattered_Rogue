#!/usr/bin/env node
/**
 * Propose attachment sockets for each cold-iron kit mesh.
 *
 * The generator used to derive sockets from an axis-aligned box, which put a
 * wedge panel's edge sockets out in empty space and gave a heat sink two mounts
 * on a face it does not have. This walks the real surface instead and writes
 * sockets.json, which apply_cold_iron_sockets.py bakes onto the imported
 * StaticMesh assets.
 *
 * Socket names match the names ShatteredEnemyGenerator already uses, so an
 * authored socket simply overrides the procedural one of the same name and
 * keeps its kind, bend and twist rules.
 *
 * Output is Unreal mesh space: centimetres, Z-up, converted from the glTF's
 * metres and Y-up. Single-ended families are marked low confidence because
 * which end is the mount is a guess until a human looks at it.
 *
 * Usage: node seed-sockets.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { boundsOf, readTriangles } from "../../../../glb-geometry.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CATALOG = path.join(HERE, "catalog.json");
const OUTPUT = path.join(HERE, "sockets.json");

/** glTF is metres and Y-up; the import lands on centimetres and Z-up. */
const toUnreal = ([x, y, z]) => [x * 100, z * 100, y * 100];

const subtract = (a, b) => a.map((value, axis) => value - b[axis]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function axisRanking(size) {
  return [0, 1, 2].sort((left, right) => size[right] - size[left]);
}

function unitAxis(axis, sign) {
  const direction = [0, 0, 0];
  direction[axis] = sign;
  return direction;
}

/**
 * Centre of the outermost slice of surface facing `direction`.
 *
 * Ray casting down the axis was the obvious approach and the wrong one: most
 * of these parts are bored at exactly the point a socket belongs, so a centre
 * ray leaves through an internal wall and reports a socket buried inside the
 * mesh. Averaging the far slab lands on the middle of the end face, and for a
 * bored end that is still the axis, because the annulus is symmetric.
 */
function surfacePoint(triangles, bounds, direction) {
  const axis = direction.findIndex((value) => value !== 0);
  const sign = direction[axis];
  const extreme = sign > 0 ? bounds.high[axis] : bounds.low[axis];

  // Depth matters here. A thin end slice on a wedge is a single sloped ridge,
  // so its centroid slides to whichever corner is highest and the socket lands
  // on a corner instead of the middle of the face. Averaging the outer quarter
  // of the part describes where that end of the body actually sits.
  const depth = Math.max(bounds.size[axis] * 0.25, 0.5);

  const outer = [];
  for (const triangle of triangles) {
    for (const point of triangle) {
      if (Math.abs(point[axis] - extreme) <= depth) outer.push(point);
    }
  }
  if (outer.length === 0) {
    const fallback = bounds.center.slice();
    fallback[axis] = extreme;
    return fallback;
  }

  const position = [0, 1, 2].map(
    (other) =>
      outer.reduce((sum, point) => sum + point[other], 0) / outer.length,
  );
  position[axis] = extreme;
  return position;
}

/** Bounding area of the slice nearest one end, used to tell a nozzle from a mount. */
function endArea(triangles, bounds, axis, sign) {
  const span = bounds.size[axis];
  const limit =
    sign > 0 ? bounds.high[axis] - span * 0.18 : bounds.low[axis] + span * 0.18;
  const others = [0, 1, 2].filter((other) => other !== axis);
  const low = [Infinity, Infinity];
  const high = [-Infinity, -Infinity];

  for (const triangle of triangles) {
    for (const point of triangle) {
      if (sign > 0 ? point[axis] < limit : point[axis] > limit) continue;
      others.forEach((other, index) => {
        if (point[other] < low[index]) low[index] = point[other];
        if (point[other] > high[index]) high[index] = point[other];
      });
    }
  }

  if (!Number.isFinite(low[0])) return 0;
  return (high[0] - low[0]) * (high[1] - low[1]);
}

function socket(name, position, normal, confidence, note) {
  return {
    name,
    position: position.map((value) => Number(value.toFixed(2))),
    normal: normal.map((value) => Number(value.toFixed(4))),
    confidence,
    ...(note ? { note } : {}),
  };
}

/** Sockets at both extremes of the long axis: rods, batteries, terminals. */
function endToEnd(triangles, bounds, names) {
  const [long] = axisRanking(bounds.size);
  return [1, -1].map((sign, index) =>
    socket(
      names[index],
      surfacePoint(triangles, bounds, unitAxis(long, sign)),
      unitAxis(long, sign),
      "high",
    ),
  );
}

/** One socket per named direction, pushed out to the real surface. */
function radial(triangles, bounds, entries) {
  return entries.map(({ name, axis, sign }) =>
    socket(
      name,
      surfacePoint(triangles, bounds, unitAxis(axis, sign)),
      unitAxis(axis, sign),
      "high",
    ),
  );
}

/**
 * One mount on a single-ended part. `preferLargerEnd` picks the chunky breech
 * of a weapon; the inverse picks the collar behind a thruster bell or a lamp
 * head. Either way it is a guess, so it ships as low confidence.
 */
function singleMount(triangles, bounds, name, preferLargerEnd) {
  const [long] = axisRanking(bounds.size);
  const positiveArea = endArea(triangles, bounds, long, 1);
  const negativeArea = endArea(triangles, bounds, long, -1);
  const chooseP = preferLargerEnd
    ? positiveArea > negativeArea
    : positiveArea < negativeArea;
  const sign = chooseP ? 1 : -1;

  return [
    socket(
      name,
      surfacePoint(triangles, bounds, unitAxis(long, sign)),
      unitAxis(long, sign),
      "low",
      "Which end mounts is inferred from cross-section; confirm in the Socket Manager.",
    ),
  ];
}

/** Two mounts sharing the base face, spread along the part's middle axis. */
function twinBase(triangles, bounds) {
  const [long, middle] = axisRanking(bounds.size);
  const sign = endArea(triangles, bounds, long, 1) < endArea(triangles, bounds, long, -1) ? 1 : -1;
  const base = surfacePoint(triangles, bounds, unitAxis(long, sign));

  return ["Base A", "Base B"].map((name, index) => {
    const offset = (index === 0 ? 1 : -1) * bounds.size[middle] * 0.22;
    const position = base.slice();
    position[middle] += offset;
    return socket(
      name,
      position,
      unitAxis(long, sign),
      "low",
      "Base end inferred from cross-section; confirm in the Socket Manager.",
    );
  });
}

const seeders = {
  rod: (triangles, bounds) => endToEnd(triangles, bounds, ["End A", "End B"]),
  battery: (triangles, bounds) => endToEnd(triangles, bounds, ["End A", "End B"]),
  "electrical-terminal": (triangles, bounds) =>
    endToEnd(triangles, bounds, ["End A", "End B"]),
  panel: (triangles, bounds) => {
    const [long, middle] = axisRanking(bounds.size);
    return radial(triangles, bounds, [
      { name: "Edge +X", axis: long, sign: 1 },
      { name: "Edge -X", axis: long, sign: -1 },
      { name: "Edge +Y", axis: middle, sign: 1 },
      { name: "Edge -Y", axis: middle, sign: -1 },
    ]);
  },
  joint: (triangles, bounds) => {
    const [long, middle, short] = axisRanking(bounds.size);
    return radial(triangles, bounds, [
      { name: "+X", axis: long, sign: 1 },
      { name: "-X", axis: long, sign: -1 },
      { name: "+Y", axis: middle, sign: 1 },
      { name: "-Y", axis: middle, sign: -1 },
      { name: "+Z", axis: short, sign: 1 },
      { name: "-Z", axis: short, sign: -1 },
    ]);
  },
  weapon: (triangles, bounds) => singleMount(triangles, bounds, "Weapon Base", true),
  propulsion: (triangles, bounds) =>
    singleMount(triangles, bounds, "Engine Mount", false),
  light: (triangles, bounds) => singleMount(triangles, bounds, "Light Base", false),
  heatsink: twinBase,
};

const { entries } = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
const meshes = {};

for (const entry of entries) {
  const seeder = seeders[entry.category];
  // Hubs stay procedural: a near-sphere's sixteen omni sockets are already
  // correct off the bounding radius, and authoring them by hand is 48 gizmo
  // placements for no visible gain.
  if (!seeder) continue;

  const triangles = readTriangles(path.join(HERE, entry.model)).map((triangle) =>
    triangle.map(toUnreal),
  );
  const bounds = boundsOf(triangles);

  meshes[entry.name] = {
    category: entry.category,
    boundsSize: bounds.size.map((value) => Number(value.toFixed(2))),
    boundsCenter: bounds.center.map((value) => Number(value.toFixed(2))),
    sockets: seeder(triangles, bounds),
  };
}

fs.writeFileSync(
  OUTPUT,
  `${JSON.stringify({ space: "unreal-cm", meshes }, null, 2)}\n`,
);

const lowConfidence = Object.entries(meshes).filter(([, mesh]) =>
  mesh.sockets.some((entry) => entry.confidence === "low"),
);
console.log(`Wrote ${Object.keys(meshes).length} meshes to ${path.basename(OUTPUT)}`);
console.log(`${lowConfidence.length} need a human check:`);
for (const [name] of lowConfidence) console.log(`  ${name}`);
