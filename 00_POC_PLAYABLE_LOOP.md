# POC — Pirate Raid playable loop

**Status:** Active plan — steps marked ✅ are in the build.

> **This is the active plan.** Full-game 18-phase roadmap: [archive/full-game-roadmap-2026-08/](archive/full-game-roadmap-2026-08/). Design North Star: [design/01_game_vision.md](design/01_game_vision.md). Catalog index: [00_GAME_DEVELOPMENT_PLAN.md](00_GAME_DEVELOPMENT_PLAN.md).

---

## 1. What "done" means

A stranger can: open the game, hit **New Game**, fly the Ace in an asteroid field, fight pirate waves, destroy a **flagship**, see **Victory** (or **Defeat** on death), and return to the main menu. Options, Flight Training, the Enemy Generator and an F8 debug overlay exist. No galaxy map. No Hub. No co-op.

```
Main Menu → New Game (Pirate Raid settings) → Arena
         ↘ Flight Training (same arena, no enemies)
         ↘ Enemy Generator (seeded hull preview, favourites)
         ↘ Options
Arena → Pause → Resume / Options / Quit to Menu
Arena → Victory or Defeat → Main Menu
```

**Scenario (locked):** [Pirate Raid](design/02_core_mechanics.md) in an **Asteroid Field**. Survive waves, then destroy the pirate flagship. Closest flavor: Debris/asteroids as cover ("Ambush Alley" without requiring a debris kit).

**Art (where it stands):** the player flies the authored [Ace GLB](art/ships/interceptor/ace.glb) (`SM_Interceptor_Ace`); asteroids are the authored eight-mesh kit (`SM_Asteroid_01`–`08`); pirates are still primitives — engine cone for fighters, cube for the flagship. Niagara is enabled but unused; effects are lights and scaled meshes. The Cold Iron enemy kit is imported and drives the Enemy Generator, not the raid pirates yet.

---

## 2. Tech lock

| Choice | Lock |
| --- | --- |
| Engine | **Unreal Engine 5.8** |
| Language | 100% C++; all UI is procedural UMG/Slate built in code. No Blueprints, no DataAssets |
| Agent | Official **Unreal MCP** in Cursor (`GenerateClientConfig`) |
| Rendering | Forward+, DX12, **60 FPS** fixed |
| Input | Enhanced Input, mapping built in `AShatteredPawn::CreateInputMapping`. Full table: [design/15_controls_and_camera.md](design/15_controls_and_camera.md) |
| Movement | Full **6DOF** inertial flight — forward thrust dominates, reverse/strafe capped near 120–150 vs 800 forward, passive damping, hard brake, 1550 boost |
| Camera | Third-person chase, raised so the hull sits below the crosshair, mounted to the hull so it rolls with it; **F1** first-person. Keep as is |
| Net | **Solo only.** Still split `Pawn` / `PlayerController` / `GameMode` / `GameState` / `GameInstance` so a later listen-server is not a rewrite |
| UE project | Sibling folder **`game`** (`C:\Projects\_personal\Shattered\game`) — this repo stays design / wiki / art |
| Death FX | Hide mesh + burst meshes. Do not explode a split GLB |

Do not switch to Unity or Godot. See [research/engine_mcp_ai_integration.md](research/engine_mcp_ai_integration.md) and [technical/architecture.md](technical/architecture.md).

---

## 3. Menus, New Game, Options, debug

All built in C++ (`ShatteredMenu.h`): `UShatteredMainMenuWidget` (screens: Main, NewGame, Options, EnemyGenerator) and `UShatteredRaidOverlayWidget` (Pause, Options, Victory, Defeat). Menu backdrop is a seeded environment in backdrop-only mode.

**Main Menu:** NEW GAME, FLIGHT TRAINING, ENEMY GENERATOR, OPTIONS, QUIT.

**New Game** (stored on `UShatteredGameInstance` for the session — not meta-progression):

- TOTAL PIRATES slider, 8–40 across three waves
- FLAGSHIP HULL slider, continuous 0.5×–1.5×
- LAUNCH RAID → open `M_PirateRaid` with `AShatteredGameMode`

**Flight Training:** same map with `AShatteredTrainingGameMode` — no waves, HUD reads `FLIGHT TRAINING`.

**Enemy Generator:** `UShatteredEnemyGeneratorWidget` + `AShatteredEnemyPreviewActor`. Seeded part-count ranges, drag/zoom preview, part inspector, favourites saved to `UShatteredEnemyFavoritesSave`.

**Options** (persist in `UShatteredSettingsSave` + `UGameUserSettings`):

- Master volume (0–100%), mouse sensitivity (0.25×–2×)
- Graphics quality, cycling Low / Medium / High / Epic
- Window mode: fullscreen / borderless / windowed
- No SFX/music split, no remapping (screen says so)

**Pause:** RESUME, OPTIONS (same two sliders), QUIT TO MAIN MENU.

**Victory / Defeat:** title, one flavour line, **BACK TO MAIN MENU**. No stats yet.

**Debug** (dev only, not fantasy UI). F8 or **`\`** (PIE eats F8) opens `UShatteredDebugWidget`, live sliders that apply immediately:

- Max speed, forward acceleration, inertial damping
- Strafe cap, reverse cap, roll speed, camera height
- Fire rate, projectile speed, enemy HP multiplier
- Environment seed with apply / new seed (rebuilds sun, planets, dust, asteroids immediately)

Bare keys: **`=`** reseeds the sector, **F** headlight, **- / numpad -** collision wireframe. Console: `Shattered.ShowHUD 0`, `Shattered.HUDGaugePreview`.

Defaults match the Ace numbers in the controls doc; chosen values get written back into C++ defaults.

---

## 4. Horizon (7 steps)

| # | Step | Playable proof | |
| --- | --- | --- | --- |
| 1 | Sibling UE 5.8 C++ project + Unreal MCP + Git + LFS | Editor opens; MCP talks; repo is clean | ✅ |
| 2 | Menu stack | Main, New Game, Options, Pause, Victory, Defeat all route | ✅ |
| 3 | Arena + fly / shoot | Ace, one pulse gun, boost, camera, asteroid collide | ✅ |
| 4 | Pirate waves + flagship | Win by killing flagship; lose at 0 HP | ✅ |
| 5 | Debug sliders + juice | F8 tunes feel; muzzle/hit/shake exist | ✅ |
| 6 | Real Ace mesh + better VFX | Ace mesh ✅, asteroid kit ✅; pirates still primitives ⬜, Niagara swap ⬜ | half |
| 7 | Settings polish / input remap stub | Volume, sensitivity, quality, window mode persist ✅; remap stub ⬜ | partial |

---

## 5. Steps 1–5 exploded

### Step 1 — Project ✅

1. ✅ UE **5.8** C++ project `ShatteredRogue` at `C:\Projects\_personal\Shattered\game`.
2. ✅ Forward Renderer, DX12, fixed 60, Enhanced Input + Niagara on.
3. ✅ **Unreal MCP**, Auto Start Server, Cursor client config.
4. ✅ Git + `.gitignore` (UE) + LFS for binary assets.
5. ✅ Content folders: `Maps`, `UI/Fonts`, `Meshes`, `Materials`, `Audio`, `EnemyKit`, `Planet_Generator`, `Textures`, `VFX` (empty).
6. ✅ `UShatteredGameInstance`, `AShatteredGameMode`, `AShatteredGameState`, `AShatteredPlayerController`, `AShatteredPawn`. No DataTables.

### Step 2 — Menu stack ✅

7. ✅ Maps: `M_MainMenu` (default startup), `M_PirateRaid`.
8. ✅ GameInstance fields: `EnemyCount`, `FlagshipHPScale`, `LastRaidResult`, `EnvironmentSeed`.
9. ✅ Widgets: `UShatteredMainMenuWidget`, `UShatteredRaidOverlayWidget`, `UShatteredDebugWidget`, `UShatteredEnemyGeneratorWidget`, `UShatteredHUD`.
10. ✅ LAUNCH RAID / FLIGHT TRAINING → `M_PirateRaid`; Victory / Defeat / Quit → `M_MainMenu`.
11. ✅ Options apply volume / sensitivity / quality / window mode.

### Step 3 — Fly and shoot ✅

12. ✅ Enhanced Input: thrust, strafe, vertical, mouse steering, roll, fire, boost, brake, headlight, camera toggle, collision wireframe, pause, debug panel, reseed.
13. ✅ `AShatteredPawn`: 6DOF inertial velocity, body-relative steering, 800 cruise, 1550 boost, 100 shield + 100 hull.
14. ✅ Chase camera with lag and boost pullback; F1 first-person.
15. ✅ One `APulseProjectile`; fire rate on the pawn; no inventory, no rarity.
16. ✅ Arena: bounded volume, **seeded** 90–340 colliding asteroids with spawn/ingress keep-out, plus starfield sky, sun, planets, rings, nebula masses, fog pockets. See [design/18_procedural_environments.md](design/18_procedural_environments.md).
17. ✅ HUD halo (shield / hull / boost), reticle, telemetry, radar, mission header. Pause works in-raid.

### Step 4 — Pirate Raid ✅

18. ✅ `APiratePawn` roles: **chase**, **strafe**, **tank**. Primitive meshes. Per-tick seek and shoot; no Behavior Trees.
19. ✅ Wave spawner splits the New Game enemy count over 3 waves, then spawns the **flagship**.
20. ✅ Flagship: larger cube, 400 HP × New Game scale, slow heavy shots; **destroy flagship = Victory**.
21. ✅ Hull 0 = Defeat (hide mesh + burst). `AShatteredGameState::RaidPhase`: `Training / Warmup / Waves / Flagship / Won / Lost`.

### Step 5 — Tune and juice ✅

22. ✅ Debug sliders → pawn movement, weapon, enemy HP multiplier, environment seed. Opens on **F8 or `\`**.
23. ✅ Juice: muzzle light per shot, impact burst at hit point, camera kick on fire and on damage, thruster plumes and exhaust trail, engine / cannon / boost / hull-impact audio, scaled death burst (bigger for the flagship).
24. ⬜ Ongoing: playtest, adjust defaults from F8, write the chosen numbers back into C++ defaults.

**Step 4 done when:** you want another try after dying, and beating the flagship feels like a finish.

---

## 6. Next

Owner's focus, in order. Everything else waits.

1. **Flight-sim feel.** Keep the current camera and controls; iterate acceleration, damping, roll, boost and camera numbers from the F8 panel until the ship is fun for five seconds. Write the winners back into `AShatteredPawn`.
2. **A few enemy types.** Give chase / strafe / tank real behaviour and silhouettes — Cold Iron kit or generator hulls in place of cones. If the fight collapses into a conga line, pull Phase 1 of [design/17_anti_kiting_combat.md](design/17_anti_kiting_combat.md) forward and nothing more.
3. **One mini boss.** Make the flagship an encounter rather than a big cube: a readable shape, a phase or two, a death that feels like a finish.
4. **Iterate.** Playtest, write down what was not fun, repeat. Expand only through this loop.

---

## 7. Out of scope (POC)

4-player, Steam sessions, Hub / Outer Rim, hex galaxy, 30 named ships, modules, specialty pads, Heat, stations, cargo hold, Research Data, events other than this raid, Carrier drones, Chaos mesh fracture, input remapping, **combat-envelope / anti-kiting AI** beyond Phase 1 if needed ([design/17_anti_kiting_combat.md](design/17_anti_kiting_combat.md)).

Those stay in the [archived roadmap](archive/full-game-roadmap-2026-08/), [design/](design/) and [design/ideas/](design/ideas/) until this loop is fun.
