# Cold iron kit — generated meshes

Tripo output for the v2 component kit. Concept PNGs live one directory up; each
mesh here is named after the concept it was generated from.

Open `index.html` through the static server to inspect a mesh in the browser:

```
node art/hud/mockup/serve.mjs --root art/enemies/equation/cold-iron-kit/models --port 5180
```

## Budget settings

Every kit part is one instance among dozens on a procedural enemy, so the mesh
budget matters more than the silhouette fidelity of any single piece.

| Setting | Value | Why |
| --- | --- | --- |
| `--model` | `tripo-p1` | Low-poly Smart Mesh path. Accepts `face_limit` 50–20000 and returns clean, evenly distributed triangles instead of a decimated high-poly. |
| `face_limit` | 800–900 | Requested ceiling, not a target. The three hubs landed at 605, 740, and 870 triangles; the ring-banded silhouette gets the larger allowance. |
| `texture_quality` | `standard` | `detailed` costs bake time and shows nothing on parts this small on screen. |
| `pbr` | `true` | Produces the normal map. There is no separate bump option — the normal map *is* the surface detail, and it is what lets the low triangle count read as machined plate. |
| `texture` | `true` | Implied by `pbr`. `texture=false pbr=false` gives bare geometry and skips texture credits. |
| `texture_alignment` | `original_image` | Keeps the bake registered to the concept rather than to a re-rendered view. |
| `auto_size` | `false` | Runtime already applies seed-driven `0.5x–2.0x` scaling; a real-world size guess would fight it. |

Options deliberately left off: `quad=true` (forces FBX and is unsupported on
P1), `generate_parts=true` (excludes texturing), and `smart_low_poly`
(unsupported on P1, which is already the low-poly model).

## No convert step

`image_to_model` already returns a finished GLB with 2K JPEG PBR maps, and that
untouched file is what ships here. `convert` is a *separate billed task* — 10
credits, at the "complex convert" tier once any option is non-default — and it
re-bakes nothing. All it does is repack the same mesh with different image
dimensions or a different container format.

Texture resolution is therefore not worth paying for: Unreal caps texture size
at import for free, and re-compresses everything to BC regardless, so the 2K
source and a 512 convert produce identical GPU memory once imported. The only
legitimate reason to convert is a format a pipeline genuinely cannot read, such
as FBX.

The three hubs here cost 50 credits each. The five converts run while working
this out cost another 50 and produced nothing that survived.

## Files

The complete kit contains 31 GLBs: roughly 22,200 triangles total and 715
average. The largest part is the three-nozzle propulsion cluster at 958
triangles. Every mesh carries one material with 2048² base colour, ORM, and
normal maps.

`catalog.json` records the per-file triangle, vertex, material, texture, size,
and visual-review data consumed by `index.html`. Each `-preview.png` is the
generator's own render of its mesh, not the concept. Run `organize-batch.mjs`
after a resumed batch to copy downloaded artifacts into this directory and
rebuild the catalog. `tripo-overrides.json` then reapplies approved revisions so
the original resumable batch cannot restore a failed first attempt.

After the revision passes, 20 models pass, 11 remain review, and none remain
redo. These are visual flags, not topology validation. Panel D preserves the
useful framed plate produced by the failed first missile-pod reconstruction.

## Shells versus solids

A concept that reads as a *curved cover* produces a one-sided shell: the ribbed
panel's first two attempts had no underside at all and rendered see-through from
below. Drawing the same part as a **thick block with a visible, closed flat
bottom**, shot from slightly under the object so the generator can see that
face, produced a watertight mesh.

`glb-inspect.mjs` reports welded open edges, which catches this, but a non-zero
count is not by itself a defect: recessed pads and bores legitimately leave
boundary edges, and several good parts report over a hundred. Use it to compare
revisions of the same part, not as a pass/fail gate across the kit.

## Authoring concepts for solid meshes

The generator reconstructs literally: dark recessed openings in a concept become
real holes and hollow tubes in the mesh, which costs triangles on interior walls
nobody sees and leaves the part looking like plumbing. The first hub attempt did
exactly this, because the concept drew its sockets as open octagonal bores.

Concepts for this kit therefore draw every attachment point as a **sealed raised
pad** — a capped plate with a bolted rim sitting on the surface. Attachment is a
runtime transform, not modelled geometry, so the mesh never needs the hole. That
change alone dropped the hub from 1,273 to 605 triangles at the same silhouette.

## Reproducing

```
tripo make art/enemies/equation/cold-iron-kit/<concept>.png \
  --model tripo-p1 -p face_limit=800 -p texture=true -p pbr=true \
  -p texture_quality=standard -p texture_alignment=original_image -p auto_size=false \
  -o art/tripo-out --json --yes --no-open
```

One billed task, 50 credits. The working key is the `tsk_` value in `.env`; the
`tcli_` one is rejected by the API.

Concept PNGs are produced by the image generation tool, never by Tripo — see
`.cursor/rules/tripo-assets.mdc`. Inspect any result locally with
`node art/glb-inspect.mjs <file.glb>` instead of paying for another task.
