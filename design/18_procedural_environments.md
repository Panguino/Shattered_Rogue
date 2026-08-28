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
| Planets | Count **0–3**, ten archetypes, continuous physical/apparent size spectra, rare foreground orbital vista, layered surface weights, atmosphere, optional planar rings |
| Nebula masses | 0–4 angular blobs painted into the sky dome: weighted clear/subtle/moderate/dense presence, bearing, angular radius, colour, opacity |
| Near dust | 0–6 local fog volumes in arena world space: position, radius, density, phase, albedo, emissive |
| Asteroids | Weighted seeded profile (**Cloud / Disk / Belt / Clusters / Sparse**), count **90–340**, profile-specific extent and density, small-medium size mode with rare colossal landmarks, size-matched selection across eight authored meshes, stationary-to-fast 3D drift/tumble spectrum; spawn/ingress exclusion zones |
| Stars | Density, spatial scale, point sharpness, and emissive gain on the sky material |

Same seed → same `ComputeLayoutHash` and the same transforms. Different seeds must diverge. Empty-sky (0 planets) is valid.

Art-directed **min/max ranges** are the only constants. They exist so a seed cannot wash the HUD, swallow spawn, or spawn a play-blocking sun.

**The backdrop is sky, not a destination.** Sun, planets, rings, dust, and the star dome hang off a `Backdrop` component that is re-centred on the player camera every frame (post-camera tick, so it never swims). They translate with the view, so the distance to them never closes — flying "toward" a planet for an hour arrives nowhere, exactly like a skybox, while their seeded bearings and relative geometry are untouched. Split-screen co-op would need one backdrop per view.

Distance still matters for *apparent* size and for keeping the backdrop clear of the ship, so each body is placed so its outer surface — rings included — sits at least `BackdropClearance` (9,000uu) from the camera. Below that a planet would engulf the hull and fill the screen with one flat colour. The star dome sits outside the furthest body, so it scales with that budget rather than being a fixed size.

Asteroids and near dust are the opposite case: they are the world the ship occupies, stay in world space on their own root, and do not follow anything.

The actual flight boundary is a **150,000uu-radius sphere**, ten times the old
15,000uu backstop. Content is intentionally not stretched to fill it. Pirates
still ingress around the ±2,200uu combat core, while each seed chooses a rock
field radius between roughly **4,500 and 8,200uu** and a vertical half-height
between **250 and 2,200uu**. Even the broadest sparse field occupies a small
fraction of the emergency boundary.

One fixed 5,500 × ±1,400 field previously made every seed differ only in exact
coordinates. Profile extents now change navigation itself: a Disk opens above
and below, a Belt creates a long crossing lane, Clusters create pockets and
voids, and Sparse sectors create long quiet approaches. The variation is bounded
so combat ingress and the local 3,000uu radar remain meaningful.

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

Core materials: `/Game/Materials/Environment/M_SpaceSky`, `M_SpaceSun`, `M_SpaceSunGlow`, `M_SpacePlanet`, `M_SpacePlanetClouds`, `M_SpacePlanetAtmosphere`, `M_SpaceRing`. High-detail terrain worlds use the licensed `/Game/Planet_Generator/M_SurfacePlanet` and `M_Cloud` graphs with five seeded terrain sources, aligned projection, generated normals, ocean separation, polar ice, and animated cloud masks. There is deliberately no dust material: distant gas belongs to the sky shader and near gas has no geometry.

Asteroids are the one exception to "no unique textures" — see below.

The sky is a single unlit dome. Nebula and stars are sampled along the **per-pixel view direction** (`normalize(WorldPosition - ObjectPosition)`), never raw world position — world position produces pixel-frequency noise that reads as television static. Nebula uses low-frequency gradient noise; stars are inverted Voronoi cells raised to a very high power so they stay sparse, sub-pixel-sharp points instead of soft discs.

That sharpness is exactly why stars need an emissive gain far above 1. A point covering a fraction of a pixel is averaged down before the tonemapper ever sees it, so a physically reasonable value renders as nothing — seeds roll `StarBrightness` in the 19–59 range, scaled with `StarSharpness` so sharper fields get more gain and soft-and-dense fields do not blow out. A second noise field varies brightness star to star; its exponent is deliberately low (2.4), because a steep one crushes most of the field to black and leaves a handful of lonely points.

Lighting is two independent seeded parts: an optional sun as the only directional light, and a real-time-captured sky light with its own ambient color and intensity. **Ambient is a floor, not a light.** Lit sectors roll it in the 0.04–0.12 range — roughly an order of magnitude under the key light — because anything stronger lifts the unlit side until surfaces flatten and the sun stops reading as the source; an automation assertion pins lit-sector ambient at or below 0.15 so this cannot regress. Only starless sectors raise it (0.22–0.4), where there is no key light left to stay subordinate to. Asteroids also receive a small ambient emissive floor because very dark captured skies can otherwise quantize their unlit side to black, scaled to a tenth of the ambient term for the same reason — except in starless sectors, where it rises to 55% because it is the only thing left holding the rock field up.

**A starless sector must have gas to light it.** The sun roll and the nebula roll were independent, so a seed could draw away its star *and* its gas at once. The result was a genuine void: no key light, and a near-black sky dome for the real-time capture to read, which meant the sky light's intensity multiplied almost nothing and the rock field rendered invisible against black. A starless sector is now only permitted where the gas is at least Moderate, so the thing that replaces the star is the glow it flies through. The correction re-enables the sun *after* the roll rather than reordering the draws, so it consumes no extra randomness and every other seed is byte-identical.

The player also has a manual ship headlight on **F**. It starts off and remains
available in every seed, because a nominally lit sector can still put the dark
side of a nearby asteroid in the flight path. The Ace carries one broad,
shadow-casting cool-white spotlight rather than two overlapping projectors:
four co-op ships therefore cost at most four movable shadowed lights, not eight.
Its 7,200uu reach is navigation range, not a substitute sun.

Each rock owns a child material instance, and the pawn feeds it a cone- and
distance-faded emissive fill while the headlight is on, tinted to match the
beam. This is layered *on top of* the real spotlight rather than replacing it:
under a sun the sector ambient floor is only a tenth of ambient, so a rock's far
side sits near black and one movable spot at navigation range is thin on its
own. The fill is what makes the beam read as finding a hazard.

That second path was originally justified on the grounds that the rock shaders
were unlit and could not receive a movable light at all. **They are not.**
`MI_Asteroid_01`–`05` are instances of `M_AsteroidRock`, which is `MSM_DefaultLit`
with baked base colour, normal and roughness/metallic maps from the generated
models. The comments claiming otherwise outlived the material they described.
The fill still earns its place for the reason above, but it is an artistic lift,
not a workaround for a shading model.

**The beam holds full brightness for the first three quarters of its range.**
That ambient term, not the spotlight's intensity, is what decides how far a rock
can be seen on a sunless seed, and it used to start dimming at 35% of reach — so
the useful cone ended around 1,800uu while the light nominally carried 5,200.
Rocks resolved out of the dark late and close, which is the one thing a
navigation light exists to prevent. Holding full strength to
`HeadlightFullBrightFraction` and falling off only over the last quarter is
deliberately unphysical: a real torch obeys inverse square the whole way, but
inverse square has already surrendered at exactly the distance where spotting a
rock still leaves time to turn. The falloff is kept rather than removed so the
beam still has an end, which is what stops it reading as a flat wash.

The ambient tint stays near the nebula and stellar palette rather than being washed toward white; a desaturated fill reads as a second light source and visibly fights the sun.

**A sector has one chromatic family.** The old recipe independently selected two dust colors, fog, ambient and a stellar family, then weakly blended them. That still allowed an orange star, green dust shell and blue shell in one view. The current recipe first selects the stellar family and palette hue, lightly tints the star toward the local gas, then derives `SectorTint`. Nebula A/B, sky, fog, ambient, every nebula mass and every dust pocket are brightness/saturation variations of that one tint—not independent hues. This preserves cloud-layer depth without looking composited. Directional light uses the same tinted star color, so flying inside green gas gives the key light a slight green influence instead of leaving objects under unrelated orange illumination. When a sun exists, its visible location and directional-light travel vector are derived from the same recipe vector (`light = -sun bearing`), so highlights and shadows cannot disagree with the disc.

**Desaturation is a linear-RGB operation, never `LerpUsingHSV`.** White has hue zero, so an HSV blend toward white walks the hue there: a green sector tint blended 55% toward white came out cream, breaking the family the tint exists to enforce. Every "toward white" step — ambient fill, scene tint, dust albedo, ice highlights — uses a plain linear lerp. An automation assertion pins dust albedo to the sector nebula hue so this cannot regress silently.

Two rules keep the terminator working. First, the surface normal is **geometric** (`normalize(WorldPosition - ObjectPosition)`), never `PixelNormalWS`: these are unlit materials, so there is no shading normal to read and `PixelNormalWS` yields a near-uniform dot product — the planet ends up evenly lit with no dark side at all.

Second, **starlight is parallel**. Planets take `Sun.Direction` directly, not their own bearing to the disc. Per-planet bearing sounds more correct and is actively wrong here: the disc's distance is solved from its apparent angular size and typically lands around 12,000uu, while planets are placed 60,000–140,000uu out. A planet five to twelve times farther than the star has a bearing to it that points almost straight back at the camera, so the dot product at the sub-observer point sits at 0.98–1.0 and every world in the sky shows its fully lit face. With parallel rays the visible phase instead depends on the angle between the planet's bearing and the star's, so one sky can hold a gibbous world, a half-lit one, and a thin crescent. Planet placement already keeps bodies at least ~23° off the star's bearing, which bounds how thin a crescent can get.

The two shader families disagree on the *sign* of that vector, and the parameter names do not warn you. Our authored materials take the bearing to the star (`Sun.Direction`); the licensed terrain and cloud graphs shade with `dot(N, -LightDirection)`, so they take the travel vector (`-Sun.Direction`) exactly like the directional light. Getting it backwards does not look broken in isolation — every planet still has a clean terminator, it just faces away from the visible disc, which only reads as wrong once a rock lit by the real light shares the frame.

**There is deliberately no second "fill" directional light.** The project renders forward (`r.ForwardShading`), and forward shading promotes exactly *one* directional light to be the scene's light. A fill light competes for that slot, and when it wins, every hull and rock is lit from the bearing opposite the visible star — the bug reads as "the sun is on the wrong side" no matter how correct the sun's own rotation maths is. Ambient fill belongs to the sky light, which has no direction to get wrong. Key intensities are therefore single-digit lux: with the real sun finally owning the slot, the tens-of-lux values tuned against the old dim fill blow rock albedo past white.

About 18% of seeds are **starless**. Otherwise, seeds select one of four coupled stellar families: **golden**, **white**, **blue**, or **red giant**. A family controls apparent size, temperature, key intensity, corona spread, halo, bloom, and lens flare together; it is not just a hue swap. Stars deliberately remain compact: apparent angular radius runs from roughly **0.18° to 2.8°**, with even a red giant reading as a small bright source rather than a backdrop body. Family is expressed through colour and a larger, brighter soft corona instead of an oversized hard disc. Disc scale and distance are solved from apparent size because rolling scale and distance independently makes a huge far star and a small near one look identical.

The disc itself is **additive and soft-edged**: an unlit sphere whose emissive falls off toward its own silhouette by inverse fresnel, so it fades out instead of ending on a hard circle, wrapped in a second additive **corona** shell roughly 3–6 radii wide. The smaller core and brighter corona put most of the perceived size in a soft edge rather than a hard white circle. Bloom is kept on a tight kernel (`BloomSizeScale`) — the default spreads a clipped core into a grey wash that flattens the nebula behind it. The sky material receives the same sun bearing and adds a tight view-dependent halo, so cloud detail near the star warms and lifts rather than being erased. Exposure remains manual with the **physical camera model disabled** — leaving it on meters the scene for a real camera and buries anything lit by a low-lux star.

Backdrop planets use the licensed 1,000uu-radius sphere; the director divides
component scale by 20 so its physical and apparent sizes remain identical to
the old 50uu-radius engine sphere recipes.

| Body | Detail |
| --- | --- |
| Asteroid | Noise-driven albedo, crater darkening, and **world position offset** that pushes the silhouette off a circle. Displacement uses one low-frequency non-turbulent octave — anything finer than the mesh's ~11° vertex spacing tears the hull into spikes. |
| Planet | High-detail terrain worlds render an opaque licensed **surface** plus a 1.01-scale licensed **cloud/atmosphere shell**, matching the source asset's geometry while leaving our C++ seed as owner. Each seed selects two distinct terrain textures and drives terrain colors, aligned texture scale, generated normals, ocean level/noise/reflection, polar ice, cloud channel/speed/power (a wrap takes roughly 48 minutes to 3.5 hours, so the deck only drifts), atmosphere fresnel, shadows, and parallel light direction. **Gas giants** keep the authored latitude-belt shader; **volcanic** and **crystalline** worlds keep its night-side emissive fissures, because the purchased terrain graph cannot express those archetypes. Physical scale and apparent radius are continuous spectra, not moon/dwarf/world/giant buckets: physical scale spans **10–2,400** and visible radius spans **0.3–40°**, both heavily weighted toward ordinary distant bodies. The old size class is derived afterward only for ring rules and telemetry. At the rare large end, physical radius is raised to the minimum required for clearance not to shrink the requested angular size back down; only one such orbital vista is allowed per seed, and vistas omit rings so they cannot overrun the star dome or HUD. Volcanic worlds also omit the near-coplanar legacy cloud shell, use broader lower-frequency fissures, and cap emissive gain; this removes the translucent overlap and sub-pixel temporal shimmer that looked like animated surface flicker. |
| Ring | A two-sided plane, not a flattened sphere. A radial mask cuts one continuous translucent annulus; low-contrast broad and fine radial waves vary color/value without discarding the sheet into bright hoops. The inner radius is solved from planet/ring scale so the ring begins outside the surface. Ringed planets constrain their axis to a 32–68° view inclination, preventing invisible edge-on seeds while retaining strong perspective. Rings receive the same per-planet sun bearing, sun color and ambient floor as the planet, so they no longer look like self-lit UI geometry. |

Asteroids are individual `AShatteredAsteroid` rigid bodies rather than ISM instances. ISMs are appropriate for a static field, but cannot give every rock an independent Chaos body; actor-per-rock is the necessary trade for seeded drift, tumble, asteroid-to-asteroid impacts and ship collision. Gravity is disabled, damping is deliberately tiny, CCD is enabled, and mass scales with recipe volume so small fragments yield to larger bodies. Eighteen percent begin completely stationary. The rest follow a low-weighted continuous speed curve from **0.5–70uu/s** with independent random 3D direction and a **0.1–8°/s** tumble spectrum, so most remain subtle while rare cross-sector movers are visibly quicker.

That roll is then **damped by size**, because rolling speed independently of scale let a 24× landmark draw the same 70uu/s as a pebble and skate across the sector. True momentum would divide by mass — radius cubed — and freeze every large body outright, so the damping is a gentler `(1.3 / radius)^0.65`, clamped to 1.0. Fragments up to about 1.3 scale are untouched, a 3.1 rock keeps roughly 57%, giants keep about a third, and a colossal keeps about a seventh — a ceiling near 10uu/s rather than 70. Tumble takes the same factor: angular speed on a large body means a much higher surface speed, so a spin that reads as lively on a fragment reads as a malfunction on a landmark. `RecipeDeterminism` asserts giants stay under half the drift cap and below 4°/s, so the top of the speed spectrum must belong to small rocks.

Regeneration destroys the old actor pool and rebuilds the same initial transforms and velocities from the seed.

### The asteroid kit

`/Game/Meshes/Asteroids/SM_Asteroid_01`–`08` are the authored runtime kit. The source GLBs live in `art/asteroids/models/` in semantic order: two Small, three Medium, then three High crater-density meshes. They carry 7,556–9,956 triangles at LOD0, engine-reduced LOD1/LOD2 at 35% and 12%, two coarse convex collision hulls, and baked base colour / normal / roughness-metallic. Runtime textures are capped at 1K while the preserved GLBs retain their embedded 2K maps. Convex collision is required because these are simulated Chaos bodies; complex triangle collision cannot simulate as a dynamic rigid body. `Scripts/convert_asteroid_glbs.py` and `Scripts/import_asteroid_kit.py` make this conversion repeatable; mesh numbering is a contract, so adding a variant to any family means re-running both over the whole kit rather than appending an index. The previous five-mesh runtime kit, its import intermediates, and its ~470-triangle source GLBs are preserved in `archive/unreal-asteroids-2026-08-24-before-big-asteroids/`.

Two import settings decide whether that triangle budget is actually visible. The meshes carry custom split normals authored against their baked normal maps, so the importer must be told to **import normals rather than compute them**; UE 5.8 routes FBX through Interchange, which ignores `FbxImportUI`, so `recompute_normals` has to be cleared on every LOD in a pass *after* reduction — `set_lods` rebuilds the mesh and discards settings written during the same call. Left on, normals are rebuilt from topology per LOD, hardening every UV seam into a facet and giving each level its own shading, which makes a 10k-triangle rock read as low-poly and change character as it swaps. Reduction is done by the engine for the same reason Blender cannot do it: collapse decimate will not weld across those UV seams, so each side reduces independently and cracks open. LOD screen sizes are set **explicitly to 1.0 / 0.09 / 0.025** rather than auto-computed. Auto-compute chose roughly 0.39 and 0.12, which dropped a rock to 3.4k triangles while it still filled a third of the screen; rocks are the primary subject here, so they earn far later switches than a background prop. The import script asserts the normal setting survives readback, because a silent revert is invisible until the field looks faceted in flight.

Each source rock is modelled to about **100uu across**, deliberately preserving the old physical baseline. Depending on profile, the recipe requests **90–340 bodies per seed**. The ordinary population peaks at **small-medium**: roughly **28%** are 0.9–1.4 fragments, **52%** are 1.4–2.4 small/medium bodies, and **20%** reach 2.4–3.1. A separate pass adds just **10–18** large 3.1–5.2 rocks and **3–6** 5.5–9.0 giants.

The floor was previously 0.45 and two thirds of every field sat under 1.1 scale, which is 110uu across — grit at combat range. The field read as debris with a few landmarks rather than as an asteroid belt, and the most common object in the game was one the player could neither aim at nor meaningfully avoid. The floor is now **0.9** and the mode is the band that reads as a rock from the cockpit, takes a visible number of hits, and is worth steering around. `RecipeDeterminism` measures the histogram across 256 seeds and asserts small-medium outnumbers both flanking bands; it currently reports **13,482 / 26,625 / 11,282**. Only **28%** of seeds receive a single colossal landmark at a continuous 14–24 base scale. The previous distribution guaranteed 25–45 large, 10–20 giant, and up to three colossal bodies, so roughly one rock in five read as a landmark and size stopped feeling exceptional. Large bodies are still generated and placed first so every smaller body routes around their full radius. Mild per-axis variance prevents repeated silhouettes without stretching the visual away from its collider.

`MeshIndex` is no longer unrelated to physical size. Rocks at or below 1.4 scale always use one of the two Small meshes. From 1.4–2.4, selection blends progressively from Small into one of the three Medium variants; from 2.4 up to the 5.5 giant threshold it remains Medium-only. The three authored High meshes are the **large-asteroid silhouettes** and are now reserved absolutely for 5.5+ giants and colossals. The previous 3.5–5.5 Medium/High blend spent those imposing crater-dense models on ordinary rocks, so the model itself stopped communicating exceptional scale.

Placement is size-aware and starts by choosing one weighted field grammar:

| Profile | Weight | Count | Shape |
| --- | ---: | ---: | --- |
| **Cloud** | 34% | 190–300 | Broad 3D field; radius, height, and radial edge weighting vary per seed |
| **Disk** | 24% | 220–340 | Wide 4,800–6,800uu plane only 500–1,100uu thick |
| **Belt** | 18% | 150–250 | Seeded 12,000–15,600uu line with a soft 900–2,000uu width, rotated to any bearing |
| **Clusters** | 16% | 150–260 | Three to five dense pockets separated by deliberate navigable voids |
| **Sparse** | 8% | 110–170 | Largest 6,500–8,200uu radius and tallest volume with long quiet gaps |

Cloud, Disk, and Sparse sample horizontal position by **area, not radius**; their
seeded exponent varies around the even-density `sqrt(u)` case. Belt samples a
uniform long axis and triangular soft cross-axis before rotating the whole
structure. Clusters choose seeded pocket centres, then sample by area within
each pocket. Pocket volume is the binding constraint on that profile rather than
its requested count: placement enforces a surface gap, so a pocket only a couple
of rock diameters deep saturates and silently discards the remainder. Raising the
size floor exposed this — pockets could be 144uu thin, and two seeds placed under
half their request — so pocket radius, depth, and count all carry floors sized
against the larger rocks. All profiles retain triangular altitude, spawn/ingress exclusion,
and collision-aware placement. Rock pairs keep a 55uu surface gap rather than
comparing pivots to one constant. This matters most for colossal landmarks: a
24-times-scale rock cannot overlap a smaller body or intrude into a nominally
clear route simply because its pivot passed the test.

Every rock owns its own dynamic material instance because headlight exposure is local. That instance is parented directly to the authored material instance; parenting it to a shared runtime MID is invalid in Unreal and previously generated one warning plus a failed material chain per asteroid.

The recipe picks the size-appropriate variant, not the director, and folds `FShatteredAsteroidRecipe::MeshIndex` into the layout hash, so a seed reproduces *which* rock sits where and not merely where rocks sit. The director wraps that index on its own loaded mesh count, so a missing asset repeats a rock rather than spawning an invisible collider.

This is the one place the environment carries unique texture memory, and it is the right trade: a procedural shader can fake a noisy sphere but not a crater with a raised rim, and rocks are the only environment geometry the player gets close enough to read. Distant bodies stay procedural because they are never approached.

Shading is `M_AsteroidRock` plus one authored material instance per variant (`MI_Asteroid_01`–`08`) holding that rock's textures. Every spawned actor makes its own dynamic child because headlight exposure is local. The seed still drives lighting through two parameters. `Color` is a **hue-only** sector tint: the ambient colour is normalised to its brightest channel before being blended 18% toward white, because multiplying authored albedo by the raw ambient colour — which is deliberately dark — would crush every rock to black. `AmbientStrength` is the emissive floor described above — a tenth of the ambient term under a sun, 55% of it in a starless sector.

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

Automation: `ShatteredRogue.Environment.RecipeDeterminism` (equal seeds reproduce
profile, extents, count, transforms, scale, drift and mesh choice; all five
weighted field profiles appear across 256 seeds; every field stays inside its
seeded radius/height and the global 8,300 × ±2,200 bounds; fields contain
90–340 rocks; small silhouettes outnumber medium, medium outnumber large, and
large models are giant-only; the motion sweep contains stationary, barely
drifting and >50uu/s rocks in positive and negative 3D directions while never
exceeding 70uu/s; spawn/ingress and pairwise surface clearance survive every
profile; duplicate seeds reproduce the same layout hash).

Play: Flight Training → `\` → note seed / layout hash → APPLY SEED twice → same hash. `NEW SEED` must change planets/sun bearing. Pressing `=` in flight must do the same, and the panel's seed field and layout hash must both follow it.

Unreachability: fly at a planet at full boost. Its apparent size must not change, and the `Backdrop` component's world location must equal the camera's every frame.

Key direction: frame a rock side-on to the star bearing. The lit hemisphere must sit on the side the recipe's sun vector points to, and its tint must match the star's colour. Backlit rocks show a rim in the star's colour and no front-face light. A scene lit from the opposite side means something has stolen the forward-shading directional slot.
