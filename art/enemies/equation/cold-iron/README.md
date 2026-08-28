# The Equation — cold iron pass

Second concept pass for the machine faction: fifteen constructs, three per combat
frame. This pass is the current art direction. The set in the parent folder is
kept as the first exploration.

A companion [`../cold-iron-larger/`](../cold-iron-larger/README.md) pass explores
fifteen constructs one size class above these drones, including three composite
units assembled from recognizable smaller machines.

The [`../cold-iron-kit/`](../cold-iron-kit/README.md) extracts the visual
language into twenty reusable armor, power, structure, propulsion, and systems
building blocks for assembling additional enemies.

## Image and model catalog

All fifteen concepts and their generated PBR GLBs are listed in
[`models/index.html`](models/index.html). Serve the directory over HTTP so the
interactive viewer can load local models:

```powershell
node art/hud/mockup/serve.mjs `
  --root art/enemies/equation/cold-iron `
  --port 5181
```

Root the server at this folder, **not** at `models/`. The concepts sit one level
above the viewer, and `serve.mjs` strips any leading `..` so nothing can climb
out of its root — serving `models/` therefore 404s every source image while the
GLBs still load. The viewer labels such an image rather than leaving it blank.

Open `http://localhost:5181/models/`. Each entry keeps its source concept visible beside
the orbitable model and reports the measured triangle, vertex, texture, and disk
budgets. `models/build-catalog.mjs` always catalogs every source image, even when
a model is missing or a batch job fails, then adds model data as GLBs arrive.

The first full-ship pass uses untouched Tripo P1 outputs with an 8,000-face
request. All fifteen landed inside the 6,000–9,000 triangle target at
7,209–7,827 triangles (114,728 total).

## What changed from the first pass

- **One weapon mount, always.** Each construct carries exactly one muzzle, tube,
  spike, or emitter. Threat comes from the frame's behaviour and from numbers,
  not from bristling hardpoints, and it keeps the silhouettes readable when a
  dozen are on screen.
- **Smaller.** These read as drones rather than warships. The Bastion frame is
  still the heaviest thing in a wave, but it is dense rather than large.
- **No painted armor.** Bare unpainted metal only — brushed steel, gunmetal,
  dark iron, machined nickel. The cream ceramic and gold rings of the player
  fleet are gone, which is the point: nothing here was built to be looked at.
- **Colour comes only from power.** Exposed battery cells, indicator lights, and
  energy conduits are the sole source of hue. Amber batteries on the combat
  frames, violet on Relay.
- **Volume over planform.** Several variants are deliberately spherical or
  vertical rather than the flat swept planform of a traditional ship. A machine
  with no pilot and no atmosphere has no reason to be shaped like an aircraft.

Carried forward unchanged: no cockpit, canopy, windows, or face; deliberate
asymmetry in every silhouette; readable from an elevated three-quarter camera.

## 1. Needle — saturation unit

- **N1 / Spindle** (`needle-spindle.png`) — *vertical*: standing steel spindle
  tapering to a lance emitter at the lower tip; one counterweight vane and a
  cyan battery pod clamped off-centre.
- **N2 / Ball Thorn** (`needle-ballthorn.png`) — *spherical*: plated machined
  ball with a single long ramming thorn; the shell opens on the opposite side to
  an exposed amber cell.
- **N3 / Hook** (`needle-hook.png`): thick steel crescent with real depth, muzzle
  at the inner point, armored outer spine, machinery exposed along the inner
  curve.

## 2. Vector — interceptor

- **V1 / Gyro** (`vector-gyro.png`) — *spherical*: machined sphere slung inside
  two unequal gimbal rings, one armored and one skeletal, with a single short
  barrel through the axis.
- **V2 / Mast** (`vector-mast.png`) — *vertical*: upright spar with a thruster
  block low and a sensor head high; autocannon clamped to one side, battery
  stack cantilevered off the other.
- **V3 / Wedge** (`vector-wedge.png`): deep chiselled steel wedge with genuine
  mass, one barrel at a lower corner, sheared open at the rear over the cell
  bank.

## 3. Mortar — area denial

- **M1 / Drum** (`mortar-drum.png`) — *vertical*: stepped cylindrical drum with a
  single angled launch tube on one flank and a spine of battery cells and
  cooling fins on the other.
- **M2 / Kettle** (`mortar-kettle.png`) — *spherical*: squat iron spheroid, one
  wide mortar mouth opening off the top, cells bulging from a single flank.
- **M3 / Column** (`mortar-column.png`) — *vertical*: mismatched rings and drums
  threaded onto a shaft and rotated out of register, one tube clamped alongside,
  arcs jumping the gaps.

## 4. Bastion — frontline anchor

- **B1 / Orb** (`bastion-orb.png`) — *spherical*: dense iron sphere in unequal
  armor bands that bunch on one side and leave a stacked battery core open on
  the other; one stubby cannon set low.
- **B2 / Pillar** (`bastion-pillar.png`) — *vertical*: top-heavy monolith of
  stacked slabs, chamfered away down one edge to expose the battery column, with
  a single muzzle in the lower third.
- **B3 / Anvil** (`bastion-anvil.png`): compact overhanging mass, cannon set into
  the extended lip at one end, cell bank recessed into the cut-back flank.

## 5. Relay — network coordinator

- **R1 / Cage** (`relay-cage.png`) — *spherical*: skeletal rib cage around a
  suspended violet core, ribs dense on one side and open on the other where arcs
  bridge the gap; one emitter on a single rib.
- **R2 / Spire** (`relay-spire.png`) — *vertical*: obelisk of narrowing segments
  rotated out of alignment so the spire kinks; one battery canister strapped to a
  single face, emitter low.
- **R3 / Stack** (`relay-stack.png`): three thick discs of differing diameter
  held at offset angles on short struts, violet field suspended in the gaps,
  emitter on the middle rim.
