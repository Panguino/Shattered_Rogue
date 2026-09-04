# 🏗️ Technical Architecture

**Status:** Implemented — describes the live module.

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md). **Active plan:** [00_POC_PLAYABLE_LOOP.md](../00_POC_PLAYABLE_LOOP.md). Project: `C:\Projects\_personal\Shattered\game`.

---

## 0. Engine

**Unreal Engine 5.8**, one runtime module, C++ only. Official **Unreal MCP** plugin for Cursor (editor-only, with `AllToolsets`, `PythonScriptPlugin`, `EditorScriptingUtilities`). Do not switch to Unity or Godot — see [engine_mcp_ai_integration.md](../research/engine_mcp_ai_integration.md).

Rendering from `DefaultEngine.ini`: Forward shading, DX12, fixed 60 FPS, auto-exposure off. `GlobalDefaultGameMode` is `AShatteredMenuGameMode`; `GameInstanceClass` is `UShatteredGameInstance`; both editor and game start on `M_MainMenu`.

---

## 1. How it is built

| Rule | In practice |
| --- | --- |
| **100% C++** | Every actor, widget and setting is a C++ class. `Content/Blueprints/` holds only `.gitkeep` files. |
| **Procedural UI** | Widgets override `RebuildWidget` and build their tree with `UWidgetTree::ConstructWidget`; the HUD paints in `NativePaint` with Slate draw elements. No `.uasset` widgets, no UMG designer. |
| **No data assets** | Tuning lives in `UPROPERTY` defaults and `constexpr` namespaces (`ShatteredEnvironment`, `ShatteredHUDStyle`, `ShatteredMenuStyle`). No DataTables, DataAssets or GameplayTags. |
| **No AI module** | Pirates steer in `APiratePawn::Tick`. No AIController, Behavior Trees, EQS or NavMesh. |
| **Seeded, not authored** | The arena and enemy hulls are recipes derived from an `int32` seed via `FRandomStream`; determinism is covered by automation tests. |
| **Niagara** | Plugin enabled and linked, no system referenced. Effects are point lights and scaled emissive meshes. |
| **Assets by path** | Meshes and audio load through `ConstructorHelpers` on CDOs; environment materials through runtime `LoadObject`, which is why packaging lists them explicitly. |

---

## 2. Module `ShatteredRogue`

`Source/ShatteredRogue/`, `IMPLEMENT_PRIMARY_GAME_MODULE`. Targets: `ShatteredRogue.Target.cs`, `ShatteredRogueEditor.Target.cs`.

**Build.cs** public dependencies: `Core`, `CoreUObject`, `Engine`, `InputCore`, `EnhancedInput`, `UMG`, `Slate`, `SlateCore`, `Niagara`. Explicit or shared PCHs.

### Flight / pawn

| Class | Does |
| --- | --- |
| `AShatteredPawn` | Player ship. 6DOF inertial movement, body-relative steering, boost, brake, shields, collision damage, chase/first-person camera rig, headlight, thruster plumes, world-space exhaust trail, flight-dust motes, engine/cannon/boost/impact audio. Builds its own `UInputMappingContext` in `CreateInputMapping`. |
| `AShatteredPlayerController` | Creates the HUD, binds Esc (pause), F8 / `\` (debug panel), `=` (reseed). Owns the pause / result overlay. |

### Combat

| Class | Does |
| --- | --- |
| `APulseProjectile` | Sphere-collided bolt with mesh and light; `Launch` for player or pirate, applies damage on hit, `BecomeImpactBurst` reuses the actor as the hit / death effect. |
| `APiratePawn` | Enemy pawn. `EPirateRole` Chase / Strafe / Tank / Flagship set stats and primitive mesh in `Configure`; per-tick seek, face and fire; damage flash; death burst; reports to the game mode. |

### Enemy generator

| Class | Does |
| --- | --- |
| `ShatteredEnemyGeneratorTypes.h/.cpp` | `FShatteredEnemyGeneratorSettings` (per-part count ranges) → deterministic `FShatteredEnemyGeneratorRecipe` of primitive parts and attachment points. |
| `ShatteredEnemyKit.h/.cpp` | Maps part types to the imported Cold Iron meshes (`SM_ColdIron_*`), solving orientation and sockets from authored mesh sockets. |
| `AShatteredEnemyPreviewActor` | Assembles a recipe from kit meshes or engine primitives, lightning arcs between electrical parts, orbit / zoom camera, key-light bearing. |
| `UShatteredEnemyGeneratorWidget` (+ `UShatteredEnemyRangeSlider`, `UShatteredEnemyFavoriteButton`, `UShatteredEnemyPreviewDragRegion`) | Main-menu screen: seed, range sliders, part inspector, favourites. |

### Environment

| Class | Does |
| --- | --- |
| `ShatteredEnvironmentTypes.h/.cpp` | Recipe structs (sun, planets, nebula masses, dust volumes, asteroids, field profile), the `ShatteredEnvironment` constants (arena extents, 90–340 asteroids, scale bands, bounds sphere) and `ApplySphericalBounds`. |
| `AShatteredEnvironmentDirector` | Spawns the seeded sector: sky, sun mesh + directional light, sky light, planets with clouds / atmosphere / rings, height fog, local fog volumes, asteroid actors. `SetBackdropOnly` for menus. Exposes seed, layout hash and active recipe. |
| `AShatteredAsteroid` | One physics-simulated rock from the recipe, with its own dynamic material for headlight exposure. |

### HUD / menus

| Class | Does |
| --- | --- |
| `UShatteredHUD` | Paint-only flight HUD: shield / hull / boost halo, impact reticle, telemetry, radar, mission header, level footer placeholder. Loads Chakra Petch from `Content/UI/Fonts`. Console vars `Shattered.ShowHUD`, `Shattered.HUDGaugePreview`. |
| `UShatteredMainMenuWidget` | Main / New Game / Options / Enemy Generator screens. |
| `UShatteredRaidOverlayWidget` | Pause / Options / Victory / Defeat. |
| `UShatteredDebugWidget` | F8 flight lab: movement, weapon, enemy HP and seed sliders. |
| `AShatteredMenuGameMode`, `AShatteredMenuPlayerController` | Menu map framework; spawn a backdrop-only environment. |

### Game framework

| Class | Does |
| --- | --- |
| `UShatteredGameInstance` | Session settings (enemy count, flagship scale, volume, sensitivity, seed, last result), level travel, settings load / save. |
| `AShatteredGameMode` | Raid lifecycle: warmup → 3 waves → flagship → `FinishRaid`; enemy HP multiplier; ensures / regenerates the environment director. |
| `AShatteredTrainingGameMode` | Same mode with `bTrainingMode`; no waves. |
| `AShatteredGameState` | `EShatteredRaidPhase`, `WaveNumber`, `ActiveEnemyCount`. |

### Save games

| Class | Slot |
| --- | --- |
| `UShatteredSettingsSave` | `ShatteredSettings` — master volume, mouse sensitivity |
| `UShatteredEnemyFavoritesSave` | `ShatteredEnemyFavorites` — generator favourites (note, seed, ranges) |

### Tests

`IMPLEMENT_SIMPLE_AUTOMATION_TEST`, editor context, engine filter:

| Test | File |
| --- | --- |
| `ShatteredRogue.Environment.RecipeDeterminism` | `ShatteredEnvironmentRecipeTests.cpp` |
| `ShatteredRogue.EnemyGenerator.RecipeDeterminism` | `ShatteredEnemyGeneratorTests.cpp` |

---

## 3. Content

```
Content/
├── Maps/               M_MainMenu, M_PirateRaid
├── Meshes/
│   ├── Ships/          SM_Interceptor_Ace + T_Ace_* textures
│   ├── Asteroids/      SM_Asteroid_01–08
│   └── EnemyKit/       SM_ColdIron_* (Battery, Hub, Joint, Panel, Propulsion, Rod, Weapon, ...)
├── Materials/
│   ├── Environment/    M_AsteroidRock + MI_Asteroid_01–08, M_SpaceSky/Sun/SunGlow/Planet*/Ring
│   └── Ships/          M_ShipHull, M_ThrusterGlow
├── Textures/Asteroids/ per-rock BaseColor / Normal / RM
├── Planet_Generator/   purchased planet shell materials, functions, textures, SM_Sphere_Planet
├── EnemyKit/ColdIronImports/  raw kit import folders
├── Audio/SFX/          Collisions (A_HullSmash_01/02), Movement (A_Engine_Drive, A_Boost_Burst), Weapons (A_Cannon_Laser)
├── UI/Fonts/           ChakraPetch-*.ttf + OFL
├── Blueprints/         .gitkeep only
└── VFX/                empty
```

`Scripts/` holds the editor Python used to import the asteroid and Cold Iron kits and apply sockets; it is tooling, not runtime.

---

## 4. Packaging (`DefaultGame.ini`)

| Setting | Why |
| --- | --- |
| `MapsToCook`: `M_MainMenu`, `M_PirateRaid` | Levels are opened by name from `UShatteredGameInstance`, so nothing references them. Every new map must be listed. |
| `DirectoriesToAlwaysCook`: `/Game/Materials/Environment` | The director loads these with `LoadObject` at runtime; nothing on a CDO points at them. |
| `DirectoriesToAlwaysStageAsUFS`: `UI/Fonts` | The HUD reads the `.ttf` files off disk rather than through a `UFont` asset. |

---

## 5. Unreal MCP (Cursor)

Editor hosts `http://127.0.0.1:8000/mcp`; Cursor connects via the generated `.mcp.json`. Plugins: `ModelContextProtocol` (server), `AllToolsets` (actor / scene / material / test tools). Loopback only, serial game-thread calls.

---

## 6. Later, if needed

Not planned yet. Listed so nobody assumes they exist:

- **Behavior Trees / AIController** for pirates, once §3 of [17_anti_kiting_combat.md](../design/17_anti_kiting_combat.md) is pulled forward.
- **DataAssets / DataTables** if hull or weapon counts grow past what `UPROPERTY` defaults can carry.
- **Niagara** replacing the light-and-mesh effects.
- **Replication** — the framework split exists so a listen server is not a rewrite, but nothing is replicated.
- **Additional modules or plugins** — one module until there is a reason.
