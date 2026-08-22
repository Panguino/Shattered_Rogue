# 18 — Procedural Environments

> **POC slice:** one asteroid-sector recipe, zero or one sun, 0–3 planets, seeded dust and rocks.
> Runtime lives in the sibling Unreal project: `AShatteredEnvironmentDirector` + `ShatteredEnvironment::BuildRecipe`.

---

## 1. Contract

Every visual environment element is produced from a single `int32` seed via `FRandomStream`:

| Layer | Seeded fields |
| --- | --- |
| Palette / ambient | One sector tint, value/saturation variants for sky, nebula, dust, fog and ambient, ambient intensity |
| Sun | Presence, stellar family, direction, apparent angular size, color, key-light intensity, halo, bloom, lens flare |
| Planets | Count **0–3**, ten archetypes, moon/dwarf/world/giant size class, independent apparent radius, rare foreground orbital vista, layered surface weights, atmosphere, optional planar rings |
| Nebula masses | 0–4 angular blobs painted into the sky dome: weighted clear/subtle/moderate/dense presence, bearing, angular radius, colour, opacity |
| Near dust | 0–6 local fog volumes in arena world space: position, radius, density, phase, albedo, emissive |
| Asteroids | Count 18–34, transform, non-uniform scale, slow linear drift and tumble, one of five authored rock meshes; spawn/ingress exclusion zones |
| Stars | Density, spatial scale, point sharpness, and emissive gain on the sky material |

Same seed → same `ComputeLayoutHash` and the same transforms. Different seeds must diverge. Empty-sky (0 planets) is valid.

Art-directed **min/max ranges** are the only constants. They exist so a seed cannot wash the HUD, swallow spawn, or spawn a play-blocking sun.

**The backdrop is sky, not a destination.** Sun, planets, rings, dust, and the star dome hang off a `Backdrop` component that is re-centred on the player camera every frame (post-camera tick, so it never swims). They translate with the view, so the distance to them never closes — flying "toward" a planet for an hour arrives nowhere, exactly like a skybox, while their seeded bearings and relative geometry are untouched. Split-screen co-op would need one backdrop per view.

Distance still matters for *apparent* size and for keeping the backdrop clear of the ship, so each body is placed so its outer surface — rings included — sits at least `BackdropClearance` (9,000uu) from the camera. Below that a planet would engulf the hull and fill the screen with one flat colour. The star dome sits outside the furthest body, so it scales with that budget rather than being a fixed size.

Asteroids and near dust are the opposite case: they are the world the ship occupies, stay in world space on their own root, and do not follow anything.

**Dust is split by distance because no single technique covers both.** True volumetrics — Niagara, local fog volumes, volumetric fog — only render within the fog view distance, far short of the backdrop. Mesh shells reach any distance but always show a silhouette. So distant gas is painted by the sky shader where it can never have an edge, and near gas is real volumetric fog the ship flies through.

---

## 2. Runtime

```
UShatteredGameInstance.EnvironmentSeed
        ↓
AShatteredGameMode::EnsureEnvironment
        ↓
AShatteredEnvironmentDirector::Regenerate(Seed)
        ↓
ShatteredEnvironment::BuildRecipe(Seed) → FShatteredEnvironmentRecipe
        ↓
Apply sky (+ nebula masses) / sun / skylight / planets / dust volumes / physical asteroid actors
```

Replay: Flight Lab (`\` / F8) shows the seed, **APPLY SEED**, and **NEW SEED**. Applying the same number rebuilds the same recipe without a map reload. `=` rolls and applies a new seed directly from flight, with or without the panel open — art-directing the generator means cycling seeds far more often than touching any other control, so it does not sit behind an overlay. When the panel is open it follows along rather than showing a stale number.

Materials (parameterized, no unique textures): `/Game/Materials/Environment/M_SpaceSky`, `M_SpaceSun`, `M_SpaceSunGlow`, `M_SpacePlanet`, `M_SpaceRing`. There is deliberately no dust material: distant gas belongs to the sky shader and near gas has no geometry.

Asteroids are the one exception to "no unique textures" — see below.

The sky is a single unlit dome. Nebula and stars are sampled along the **per-pixel view direction** (`normalize(WorldPosition - ObjectPosition)`), never raw world position — world position produces pixel-frequency noise that reads as television static. Nebula uses low-frequency gradient noise; stars are inverted Voronoi cells raised to a very high power so they stay sparse, sub-pixel-sharp points instead of soft discs.

That sharpness is exactly why stars need an emissive gain far above 1. A point covering a fraction of a pixel is averaged down before the tonemapper ever sees it, so a physically reasonable value renders as nothing — seeds roll `StarBrightness` in the 19–59 range, scaled with `StarSharpness` so sharper fields get more gain and soft-and-dense fields do not blow out. A second noise field varies brightness star to star; its exponent is deliberately low (2.4), because a steep one crushes most of the field to black and leaves a handful of lonely points.

Lighting is two independent seeded parts: an optional sun as the only directional light, and a real-time-captured sky light with its own ambient color and intensity. **Ambient is a floor, not a light.** Lit sectors roll it in the 0.04–0.12 range — roughly an order of magnitude under the key light — because anything stronger lifts the unlit side until surfaces flatten and the sun stops reading as the source; an automation assertion pins lit-sector ambient at or below 0.15 so this cannot regress. Only starless sectors raise it (0.22–0.4), where there is no key light left to stay subordinate to. Asteroids also receive a small ambient emissive floor because very dark captured skies can otherwise quantize their unlit side to black, scaled to a tenth of the ambient term for the same reason — except in starless sectors, where it rises to 55% because it is the only thing left holding the rock field up.

**A starless sector must have gas to light it.** The sun roll and the nebula roll were independent, so a seed could draw away its star *and* its gas at once. The result was a genuine void: no key light, and a near-black sky dome for the real-time capture to read, which meant the sky light's intensity multiplied almost nothing and the rock field rendered invisible against black. A starless sector is now only permitted where the gas is at least Moderate, so the thing that replaces the star is the glow it flies through. The correction re-enables the sun *after* the roll rather than reordering the draws, so it consumes no extra randomness and every other seed is byte-identical.

The ambient tint stays near the nebula and stellar palette rather than being washed toward white; a desaturated fill reads as a second light source and visibly fights the sun.

**A sector has one chromatic family.** The old recipe independently selected two dust colors, fog, ambient and a stellar family, then weakly blended them. That still allowed an orange star, green dust shell and blue shell in one view. The current recipe first selects the stellar family and palette hue, lightly tints the star toward the local gas, then derives `SectorTint`. Nebula A/B, sky, fog, ambient, every nebula mass and every dust pocket are brightness/saturation variations of that one tint—not independent hues. This preserves cloud-layer depth without looking composited. Directional light uses the same tinted star color, so flying inside green gas gives the key light a slight green influence instead of leaving objects under unrelated orange illumination. When a sun exists, its visible location and directional-light travel vector are derived from the same recipe vector (`light = -sun bearing`), so highlights and shadows cannot disagree with the disc.

**Desaturation is a linear-RGB operation, never `LerpUsingHSV`.** White has hue zero, so an HSV blend toward white walks the hue there: a green sector tint blended 55% toward white came out cream, breaking the family the tint exists to enforce. Every "toward white" step — ambient fill, scene tint, dust albedo, ice highlights — uses a plain linear lerp. An automation assertion pins dust albedo to the sector nebula hue so this cannot regress silently.

Two rules keep the terminator working. First, the surface normal is **geometric** (`normalize(WorldPosition - ObjectPosition)`), never `PixelNormalWS`: these are unlit materials, so there is no shading normal to read and `PixelNormalWS` yields a near-uniform dot product — the planet ends up evenly lit with no dark side at all.

Second, **starlight is parallel**. Planets take `Sun.Direction` directly, not their own bearing to the disc. Per-planet bearing sounds more correct and is actively wrong here: the disc's distance is solved from its apparent angular size and typically lands around 12,000uu, while planets are placed 60,000–140,000uu out. A planet five to twelve times farther than the star has a bearing to it that points almost straight back at the camera, so the dot product at the sub-observer point sits at 0.98–1.0 and every world in the sky shows its fully lit face. With parallel rays the visible phase instead depends on the angle between the planet's bearing and the star's, so one sky can hold a gibbous world, a half-lit one, and a thin crescent. Planet placement already keeps bodies at least ~23° off the star's bearing, which bounds how thin a crescent can get.

**There is deliberately no second "fill" directional light.** The project renders forward (`r.ForwardShading`), and forward shading promotes exactly *one* directional light to be the scene's light. A fill light competes for that slot, and when it wins, every hull and rock is lit from the bearing opposite the visible star — the bug reads as "the sun is on the wrong side" no matter how correct the sun's own rotation maths is. Ambient fill belongs to the sky light, which has no direction to get wrong. Key intensities are therefore single-digit lux: with the real sun finally owning the slot, the tens-of-lux values tuned against the old dim fill blow rock albedo past white.

About 18% of seeds are **starless**. Otherwise, seeds select one of four coupled stellar families: **golden**, **white**, **blue**, or **red giant**. A family controls apparent size, temperature, key intensity, corona spread, halo, bloom, and lens flare together; it is not just a hue swap. Size is authored as an **apparent angular radius** (roughly 0.3° for the smallest blue star to 9° for the largest red giant) and the disc scale and distance are solved from it, because rolling scale and distance independently makes a huge far star and a small near one look identical.

The disc itself is **additive and soft-edged**: an unlit sphere whose emissive falls off toward its own silhouette by inverse fresnel, so it fades out instead of ending on a hard circle, wrapped in a second additive **corona** shell a few radii wider with a much steeper falloff. Bloom is kept on a tight kernel (`BloomSizeScale`) — the default spreads a clipped core into a grey wash that flattens the nebula behind it. The sky material receives the same sun bearing and adds a tight view-dependent halo, so cloud detail near the star warms and lifts rather than being erased. Exposure remains manual with the **physical camera model disabled** — leaving it on meters the scene for a real camera and buries anything lit by a low-lux star.

Every body is the same engine sphere; the material does the work:

| Body | Detail |
| --- | --- |
| Asteroid | Noise-driven albedo, crater darkening, and **world position offset** that pushes the silhouette off a circle. Displacement uses one low-frequency non-turbulent octave — anything finer than the mesh's ~11° vertex spacing tears the hull into spikes. |
| Planet | One layered material covering ten archetypes — **gas giant, rocky, cloudy, ice, barren, oceanic, desert, volcanic, toxic, crystalline**. Broad continent, ocean, polar ice, crater, cloud, belt and emissive-fissure masks are weighted by the recipe, keeping silhouettes readable at backdrop distance. Bodies independently roll **moon, dwarf, world or giant** physical scale and an apparent angular radius; distance is solved from both, so physical size no longer collapses into one apparent size. A rare seed promotes one body to a foreground **orbital vista** with an 18–34° apparent radius, letting it occupy roughly a third to two-thirds of the view while remaining unreachable sky. Its required separation from the visible star includes both bodies' angular radii, preventing a giant planet from accidentally covering the sun. Bands run along warped latitude from the planet's local axis. The material's `Sine` has a period of 1, not 2π, so band scale is belt cycles; warp stays low enough to bend belts without dissolving them into a maze. Explicit geometric Lambert lighting preserves the day/night terminator. |
| Ring | A two-sided plane, not a flattened sphere. A radial mask cuts one continuous translucent annulus; low-contrast broad and fine radial waves vary color/value without discarding the sheet into bright hoops. The inner radius is solved from planet/ring scale so the ring begins outside the surface. Ringed planets constrain their axis to a 32–68° view inclination, preventing invisible edge-on seeds while retaining strong perspective. Rings receive the same per-planet sun bearing, sun color and ambient floor as the planet, so they no longer look like self-lit UI geometry. |

Asteroids are individual `AShatteredAsteroid` rigid bodies rather than ISM instances. ISMs are appropriate for a static field, but cannot give every rock an independent Chaos body; actor-per-rock is the necessary trade for slow seeded drift, tumble, asteroid-to-asteroid impacts and ship collision. Gravity is disabled, damping is deliberately tiny, CCD is enabled, and mass scales with recipe volume so small fragments yield to larger bodies. Regeneration destroys the old actor pool and rebuilds the same initial transforms and velocities from the seed.

### The asteroid kit

The placeholder sphere and its procedural rock shader are gone. `/Game/Meshes/Asteroids/SM_Asteroid_01`–`05` are authored rocks generated from the concept set in `art/asteroids/`, each roughly 460–490 triangles with one auto LOD at 35%, auto-decomposed convex collision (one or two hulls depending on silhouette), and baked 1K base colour / normal / roughness-metallic. Convex collision is required because these are simulated Chaos bodies; complex triangle collision cannot simulate as a dynamic rigid body.

Each rock is modelled to about **100uu across, deliberately matching the engine sphere it replaced**. The recipe now builds 40–68 bodies per seed (about double the old 18–34), guarantees 2–4 giant landmarks at 5.5–8.5 base scale and 5–9 large rocks at 3.1–5.2, then fills the field with a weighted mix from small fragments at 0.45 scale through medium rocks. Mild per-axis variance prevents repeated silhouettes without stretching the visual away from its collider.

Placement is size-aware. Spawn, ingress, and rock-to-rock tests add the candidate's scaled mesh radius; rock pairs retain a 55uu surface gap rather than comparing centre distance to one constant. This matters most for giant landmarks: an eight-times-scale rock no longer overlaps a smaller body or intrudes into a nominally clear route simply because its pivot passed the old test.

The recipe picks the variant, not the director: `FShatteredAsteroidRecipe::MeshIndex` is drawn from the same stream as the transform and folded into the layout hash, so a seed reproduces *which* rock sits where and not merely where rocks sit. The director wraps that index on its own loaded mesh count, so a missing asset repeats a rock rather than spawning an invisible collider.

This is the one place the environment carries unique texture memory, and it is the right trade: a procedural shader can fake a noisy sphere but not a crater with a raised rim, and rocks are the only environment geometry the player gets close enough to read. Distant bodies stay procedural because they are never approached.

Shading is `M_AsteroidRock` plus one instance per rock (`MI_Asteroid_01`–`05`) holding that rock's textures. The seed still drives lighting through two parameters. `Color` is a **hue-only** sector tint: the ambient colour is normalised to its brightest channel before being blended 18% toward white, because multiplying authored albedo by the raw ambient colour — which is deliberately dark — would crush every rock to black. `AmbientStrength` is the emissive floor described above — a tenth of the ambient term under a sun, 55% of it in a starless sector. The director builds one dynamic instance per variant rather than per rock, since the ambient terms are uniform across the field and per-rock instances would only cost batching.

### Distant gas: nebula masses in the sky shader

Dust used to be 2–4 non-uniformly scaled sphere meshes on the backdrop. They were unreachable, but each one still presented a hard elliptical silhouette against empty sky, so players read them as oval planets. Softening the shell edge cannot fix this: the geometry has a boundary, and the boundary is the tell.

The sky material now carries four additive slots, each `pow(saturate(dot(viewDir, massDir)), N)` modulated by a shared ragged noise field sampled along the same view direction. The recipe first rolls a weighted presence profile: **clear** sectors have no nebula brightness, sky masses, near dust, or fog; **subtle** sectors use only 0–2 very faint masses and at most one weak dust pocket; **moderate** sectors provide the normal coloured-space vista; and uncommon **dense** sectors can place the arena inside volumetric gas. It then rolls a readable mass **angular radius** (16–48°) and solves the cosine exponent from `cos(θ)^N == 0.5`. Because the term is defined purely on view direction, the mass exists at infinity and has no edge to find. Unused slots hold a black colour, contributing nothing to the sum, so the shader needs no branch on mass count.

### Near gas: local fog volumes you fly through

Up to six `ULocalFogVolumeComponent`s sit in **arena world space** on the director's root, not on the backdrop — being flyable-through is the point. Each is an analytic sphere of radius `500 × scale` with soft radial falloff and no silhouette. Height extinction is forced to zero: pockets of gas in free space have no "up", and the height term would give them a flat top and bottom. Albedo is a lightly desaturated sector tint so pockets stay in family, with a trace of emissive so they remain visible on the shadow side without becoming light sources that flatten the sun. Inside-nebula seeds roll four to six dense pockets; other seeds roll one to three thin ones, which still give useful speed cues as they sweep the canopy.

The sky nebula uses more octaves at wider spatial separation, while star cell scale and sharpness vary per seed. Roughly 30% of sectors also enable a very low-density `UExponentialHeightFogComponent` with volumetric scattering colored from the same sector tint, as the global soup the pockets sit inside. Density stays in the `0.00012–0.00075` range: the previous `0.003–0.012` values filled the entire view with one saturated color and erased translucent rings.

`M_PirateRaid` is a thin template: PlayerStart + world settings. Stock atmosphere/clouds/fog/placeholder spheres are stripped; the director owns the scene at BeginPlay.

---

## 3. Future archetypes

[02_core_mechanics.md](02_core_mechanics.md) still lists eight gameplay environments. The next increment is a recipe `Archetype` enum (Asteroid Field, Nebula, Debris, Open Space, …) that swaps palette weights, density, and later hazards. Do **not** fork maps per biome. Keep one director + one template.

Out of this slice: hazards, POIs, galaxy-map selection, replication, volumetric cloud simulation.

---

## 4. Proof

Automation: `ShatteredRogue.Environment.RecipeDeterminism` (equal seeds match, including asteroid scale, drift and mesh choice; every field contains 40–68 rocks; small and giant size classes and a maximum-population field appear; asteroid starting speeds stay in the deliberately slow 3–14 uu/s band; every asteroid mesh index stays inside the kit and all five variants appear across the seed sweep; all four sun families and ten planet archetypes appear; all four planet size classes and a rare orbital vista appear; natural clear-space, subtle-nebula, starless and inside-nebula sectors appear; clear space contains no hidden gas layers; no starless sector is also gasless; nebula-mass and dust-pocket hues remain aligned with the sector nebula; mass/ring opacity and dust density stay restrained; mass directions are unit length and falloff exponents stay in a sane band; dust pockets stay within the arena; both pools stay inside their component budgets; broad star-size variance; star gain always clears the tonemapping floor and spans dim and bright fields; 0- and 3-planet forced recipes; size-aware asteroid exclusion zones and backdrop clearance across 256 seeds).

Play: Flight Training → `\` → note seed / layout hash → APPLY SEED twice → same hash. `NEW SEED` must change planets/sun bearing. Pressing `=` in flight must do the same, and the panel's seed field and layout hash must both follow it.

Unreachability: fly at a planet at full boost. Its apparent size must not change, and the `Backdrop` component's world location must equal the camera's every frame.

Key direction: frame a rock side-on to the star bearing. The lit hemisphere must sit on the side the recipe's sun vector points to, and its tint must match the star's colour. Backlit rocks show a rim in the star's colour and no front-face light. A scene lit from the opposite side means something has stolen the forward-shading directional slot.
