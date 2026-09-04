# Fab asset intake

Purchased Unreal packs are inspected in the sibling sandbox:

`C:\Projects\_personal\Shattered\ShatteredVault`

Never use **Add to Project** on the live `game` project. Marketplace
packs often include project settings, example maps, Blueprints, plugins, and
large source textures that should not enter the game by default.

## Intake workflow

1. In Epic Games Launcher → Unreal Engine → Library, add the pack to
   `ShatteredVault`.
2. Open its example map in the vault using the current engine version.
3. Inventory Blueprints, materials, material functions, textures, meshes,
   example maps, plugins, and total disk cost.
4. Inspect dependency chains and identify the smallest reusable technique.
5. Prefer reimplementing the technique against Shattered Slop's existing C++
   and material parameter contracts.
6. If an original asset is genuinely needed, migrate only its narrow folder
   with **Asset Actions → Migrate**, review the dependency list, and target
   `game\Content`.
7. Rename migrated assets into the game's conventions and verify cook/package
   behavior before considering the intake complete.

## Planet Generator / Planets Creator

Imported folder: `/Game/Planet_Generator`

| Group | Contents | Approx. size |
| --- | --- | ---: |
| Blueprints | `BP_Planet_Custom`, `BP_Srafield` | 0.6 MB |
| Example maps | Ocean, Ice, Lifeless | 0.2 MB |
| Materials | Surface, Cloud, Ring, Starfield | 0.3 MB |
| Material functions | Aligned Texture, Normal From Base Color, Scale Distance | 0.1 MB |
| Meshes | Planet sphere, sky sphere | 0.6 MB |
| Cloud texture | `T_Cloud` | 135.1 MB |
| Terrain textures | Five terrain sources | 130.9 MB |
| Masks | Noise and cloud noise | 4.6 MB |
| Starfield textures | Two HDRI sources | 7.8 MB |

### Extracted runtime subset

The visual comparison justified the texture cost. The live project now carries
15 assets (about 271 MB) under `/Game/Planet_Generator`:

- `M_SurfacePlanet`, `M_Cloud`, and `M_RingPlanet`
- `MF_AlignedTexture`, `MF_NormalFromBaseColor`, and `MF_ScaleDistance`
- `SM_Sphere_Planet`
- five terrain textures, the cloud texture, and two noise masks

Example maps, both Blueprints, the starfield material/mesh, and the HDRI
starfield textures remain in `ShatteredVault`. `BP_Planet_Custom` is an
inspection reference only; `AShatteredEnvironmentDirector` remains the runtime
owner.

### Runtime parameter bridge

`M_SurfacePlanet` receives the seeded terrain pair, terrain colors, ocean
colors/level/noise, ice colors/equator zone, atmosphere tint, shadow intensity,
light direction, and distance scale. The seed selects two distinct textures
from the five-source array for every planet.

`M_Cloud` receives a seeded one-hot cloud channel, cloud speed/power/brightness,
cloud and atmosphere colors, cloud/atmosphere fresnel exponents, opacity, and
the same parallel light direction as the surface. It runs on a shell at 1.01
surface radius, matching the source Blueprint.

Two of the pack's conventions are the opposite of what their names suggest, and
both graphs share them:

- `Light direction` is the direction the light **travels**, not the bearing to
  the star. Each graph shades with `dot(N, -LightDirection)` through a multiply
  whose `-1` lives in an unwired pin default, so it is invisible in the node
  graph. Feed it the same vector as the directional light's forward, otherwise
  every planet lights the face turned away from the visible disc.
- `Cloud_Speed` is a panner rate in UV per second, so a full wrap takes
  `1 / speed` seconds. The pack ships `0.0005`, roughly one wrap per 33 minutes.
  Values near `0.1` visibly spin the cloud deck during a single raid. Runtime
  seeds are constrained to `0.00008–0.00035`, or roughly 48 minutes to
  3.5 hours per wrap, so motion remains ambient rather than readable rotation.

`ShatteredVault\Scripts\trace_planet_parameters.py` and
`dump_node_constants.py` re-derive both facts headlessly by walking the graph
and reading inline pin constants.

The purchased graph specializes in terrain, oceans, polar ice, and clouds.
Gas giants retain `M_SpacePlanet` for latitude belts; volcanic and crystalline
worlds retain it for night-side emissive fissures. This is intentional
capability routing, not a fallback failure.

The imported sphere has a 1,000uu radius versus the engine sphere's 50uu.
`AShatteredEnvironmentDirector` compensates component and ring scales by 20 so
all existing physical and apparent-size recipes remain unchanged.

All dynamic terrain alternatives are constructor-referenced in C++, ensuring
the cooker includes them even though they are selected through material
parameters at runtime.

The verified UAT package command passes
`-AdditionalCookerOptions="-DisablePlugins=ModelContextProtocol,AllToolsets"`.
Those editor AI plugins otherwise load during the cook commandlet and turn
their unrelated missing `GameFeatureData` rule into a nonzero cook exit.
