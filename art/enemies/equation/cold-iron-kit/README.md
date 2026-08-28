# The Equation — cold iron component kit v2

Thirty scale-neutral visual references matched directly to the procedural enemy
generator's ten component kinds. Each kind has three silhouette variants. These
are concept targets for production meshes, not finished game assets.

The previous 20-piece kit is preserved at
`../archive/cold-iron-kit-2026-08-25-v1/`.

## Shared construction language

- Unpainted brushed steel, cold gunmetal machinery, worn machined bevels, small
  bolts, and readable panel seams.
- Standardized octagonal sockets and collars connect every structural part.
- Shapes should remain rigid, geometric, and visibly manufactured. Avoid
  organic swelling, arbitrary bends, and hidden attachment logic.
- Batteries, lamps, weapon charge chambers, and electrical terminals share the
  ship seed's yellow-to-red warm energy color. The images use amber-orange only
  as a representative seed; production materials must keep the hue variable.
- Propulsion remains cold cyan-blue so its direction reads immediately and
  stays distinct from stored power and electrical transfer.
- Keep modules readable from an elevated three-quarter gameplay camera.
- Runtime scale randomization remains `0.5x–2.0x`; these images define shape,
  not absolute size.

## Runtime component mapping

### Electrical endpoints

There is deliberately no electricity mesh. Runtime lightning bridges compatible
terminals after topology is complete. Model only the endpoint housing and
effect origin.

- `cold-iron-v2-electrical-terminal-a.png` — projecting three-pin electrode.
- `cold-iron-v2-electrical-terminal-b.png` — guarded four-petal power well.
- `cold-iron-v2-electrical-terminal-c.png` — concentric induction terminal.

### Rod

- `cold-iron-v2-rod-a-spine.png` — armored straight backbone.
- `cold-iron-v2-rod-b-telescoping.png` — nested mechanical strut.
- `cold-iron-v2-rod-c-lattice.png` — open triangular truss rail.

### Panel

- `cold-iron-v2-panel-a-slab.png` — broad rectangular armor slab.
- `cold-iron-v2-panel-b-wedge.png` — thick triangular plate.
- `cold-iron-v2-panel-c-ribbed.png` — closed curved five-rib shield.
- `cold-iron-v2-panel-d-armored-pod.png` — deep framed armor plate preserved
  from the first missile-pod reconstruction.

### Joint

- `cold-iron-v2-joint-a-hinge.png` — constrained single-axis hinge.
- `cold-iron-v2-joint-b-gimbal.png` — multi-axis captured sphere.
- `cold-iron-v2-joint-c-yoke.png` — rigid 45-degree Y branch.

### Weapon

- `cold-iron-v2-weapon-a-cannon.png` — compact electromagnetic cannon.
- `cold-iron-v2-weapon-b-rail-lance.png` — long rail-lance emitter.
- `cold-iron-v2-weapon-c-missile-pod.png` — six-cell micro-missile pod.

### Propulsion

- `cold-iron-v2-propulsion-a-compact.png` — short fixed thruster.
- `cold-iron-v2-propulsion-b-vector.png` — articulated gimbal thruster.
- `cold-iron-v2-propulsion-c-cluster.png` — aligned three-nozzle drive.

All propulsion nozzles on one generated enemy should point toward the same
aftward hemisphere.

### Heat sink

- `cold-iron-v2-heatsink-a-fin-bank.png` — staggered parallel fin bank.
- `cold-iron-v2-heatsink-b-radial.png` — radial cooling crown.
- `cold-iron-v2-heatsink-c-cooling-plate.png` — low serpentine cooling plate.

### Battery

- `cold-iron-v2-battery-a-cell.png` — single caged energy canister.
- `cold-iron-v2-battery-b-cell-bank.png` — six-cell bus rack.
- `cold-iron-v2-battery-c-capacitor.png` — stacked plate capacitor.

Batteries are protected inline components and should not terminate a branch
when another legal continuation exists.

### Light

- `cold-iron-v2-light-a-spot.png` — hooded industrial spotlight.
- `cold-iron-v2-light-b-beacon-cluster.png` — three-way beacon.
- `cold-iron-v2-light-c-flood-bar.png` — five-cell floodlight bar.

Lights are terminal parts. Their luminous faces point away from the chassis.

### Omnidirectional hub

- `cold-iron-v2-hub-a-sphere.png` — faceted sphere with sealed raised pads.
- `cold-iron-v2-hub-b-polyhedron.png` — angular multi-face hub with sealed pads.
- `cold-iron-v2-hub-c-ring-cage.png` — solid sphere wrapped by perpendicular
  armor bands.

Hubs may occur more than once and are the only family intended to support
growth in nearly any direction.

## Orientation

Every mesh in `models/` has been rotated onto canonical axes and had it baked in
by `models/align-assets.py`. The generator's originals, straight from Tripo and
tilted by as much as 50 degrees, are kept in `models/_unaligned-2026-08-25/`.

In glTF terms, after alignment: rods, batteries, weapons, thrusters, lights and
plug-type terminals lie along **Y** (Unreal Z); panels lie wide on **X** with
thickness on Y (Unreal Z); heat sinks are longest on X; pad-type terminals put
their face normal on Y. Joints and hubs are near-cubic and only had the tilt
removed.

`node art/align-audit.mjs [dir]` reports the tilt of every mesh; all 31 should
read 0.0 degrees with a 1.00x bounding box. `models/contact-sheet.py` renders
them all into one labelled image, which is how to spot a part that came out
facing backwards — the numbers cannot see that.

## Attachment sockets

The generator no longer derives attachment points from a part's bounding box.
It reads real sockets off each `SM_ColdIron_*` StaticMesh, and falls back to the
box only for a socket the mesh does not carry. This is what stops a wedge
panel's edge points from hanging in empty space, and it is also what orients the
part: the mesh is rotated so its own sockets line up with the canonical layout,
rather than by guessing from which axis is longest.

**Convention: a socket's +X axis points out of the part**, along the direction a
child leaves it. The Socket Manager gizmo draws that axis.

Socket names per family, matching the generator:

| Family | Sockets |
| --- | --- |
| Rod, Battery, Electrical terminal | `End A`, `End B` |
| Panel | `Edge +X`, `Edge -X`, `Edge +Y`, `Edge -Y` |
| Joint | `+X`, `-X`, `+Y`, `-Y`, `+Z`, `-Z` |
| Heat sink | `Base A`, `Base B` |
| Weapon | `Weapon Base` |
| Propulsion | `Engine Mount` |
| Light | `Light Base` |
| Hub | none — the sixteen omni points stay procedural off the bounding radius |

### Sizing is uniform

A recipe asks for a part size, but only the largest axis of that request is
honoured: the mesh is scaled by one factor until its longest side matches, and
keeps the proportions it was modelled with. The recipe's per-axis boxes are
abstractions left over from the primitive build — a joint is a cube there, a
panel a few centimetres thick — and fitting art to them axis by axis crushed the
joints and sheared the panels.

So a part's proportions are the model's, and nothing downstream will correct
them. If a rod reads too fat or a panel too chunky, that is a modelling note,
not a transform to tune.

### Correcting one by hand

Open the mesh in the Static Mesh Editor, use **Window → Socket Manager**, drag
or type the transform, and save. The runtime reads sockets from the asset on
load, so the next `-game` launch shows the change with no rebuild and no script.

A single-mount part is a special case: one socket fixes the part's axis but
leaves roll free. If a weapon or thruster is rolled wrong about its own mount,
add a second socket named `Up` pointing along the part's intended up direction
and the solve will use it to pin the roll.

### Re-seeding from geometry

`models/seed-sockets.mjs` walks the source GLB surfaces and writes
`models/sockets.json`; `game/Scripts/apply_cold_iron_sockets.py` bakes
that onto the assets. Re-running overwrites only the sockets named in the file,
so it will discard hand corrections to those same names.

```powershell
node art/enemies/equation/cold-iron-kit/models/seed-sockets.mjs
UnrealEditor-Cmd.exe ShatteredRogue.uproject `
  -ExecutePythonScript="<abs path>/Scripts/apply_cold_iron_sockets.py" `
  -ColdIronSocketQuit -unattended -nosplash
```

The seeder is reliable for the multi-socket families, because two opposite ends
or four edges are unambiguous. It is a coin flip for the single-mount families,
where nothing in the geometry says which end bolts on; those are reported as
`CHECK` when applied and want a human pass:

- Weapon A/B/C — `Weapon Base`
- Propulsion A/B/C — `Engine Mount`
- Light A/B/C — `Light Base`
- Heat sink A/B/C — `Base A`, `Base B` (B currently mounts off the fins rather
  than the collar)

## Electricity assembly rule

Lightning may only be spliced into a completed structural edge with a cluster
of at least three non-electrical components on each side. It must not terminate
directly at a weapon or thruster. The visual effect owns the animated arc,
flicker, forks, bloom, and local light; endpoint meshes own only the socket,
electrode silhouette, and effect origin.
