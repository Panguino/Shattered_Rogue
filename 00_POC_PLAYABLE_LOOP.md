# POC — Pirate Raid playable loop

> **This is the active plan.** Full-game 18-phase roadmap: [archive/full-game-roadmap-2026-08/](archive/full-game-roadmap-2026-08/). Design North Star: [design/01_game_vision.md](design/01_game_vision.md). Catalog index: [00_GAME_DEVELOPMENT_PLAN.md](00_GAME_DEVELOPMENT_PLAN.md).

---

## 1. What “done” means

A stranger can: open the game, hit **New Game**, fly a placeholder ship in an asteroid field, fight pirate waves, destroy a **flagship**, see **Victory** (or **Defeat** on death), and return to the main menu. Options and an F8 debug overlay exist. No galaxy map. No Hub. No co-op.

```
Main Menu → New Game (Pirate Raid settings) → Arena
         ↘ Options
Arena → Pause → Resume / Options / Quit to Menu
Arena → Victory or Defeat → Main Menu
```

**Scenario (locked):** [Pirate Raid](design/02_core_mechanics.md) in an **Asteroid Field**. Survive waves, then destroy the pirate flagship. Closest flavor: Debris/asteroids as cover (“Ambush Alley” without requiring a debris kit).

**Art (locked):** primitives first — cube/capsule player, sphere asteroids, cone/capsule pirates, box flagship. Swap [Ace GLB](art/ships/interceptor/ace.glb) and Niagara **after** the loop is fun (horizon step 6).

---

## 2. Tech lock

| Choice | Lock |
| --- | --- |
| Engine | **Unreal Engine 5.8** |
| Language | C++ primary, UMG for menus, Blueprint only for widget layout / VFX wiring |
| Agent | Official **Unreal MCP** in Cursor (`GenerateClientConfig`) |
| Rendering | Forward+, DX12, **60 FPS** cap |
| Input | Enhanced Input — Avorion-style mouse steering; W/S thrust, A/D strafe, Space/C vertical, Q/E roll, Shift boost, X brake, **F headlight**, **- collision wireframe** |
| Movement | Full **6DOF** inertial flight — forward thrust dominates, reverse/strafe capped near 120–150 vs 800 forward, gradual ship alignment, passive damping, hard brake |
| Camera | Third-person chase default, raised so the hull sits below the crosshair and banks with the roll; **F1** toggles first-person; camera aims freely and the ship rotates toward its heading |
| Net | **Solo only.** Still split `Pawn` / `PlayerController` / `GameMode` / `GameState` / `GameInstance` so a later listen-server is not a rewrite |
| UE project | Sibling folder **`game`** (`C:\Projects\_personal\Shattered\game`) — this repo stays design / wiki / art |
| Death FX | Hide mesh + burst particles. Do not explode a split GLB |

Do not switch to Unity or Godot. See [research/engine_mcp_ai_integration.md](research/engine_mcp_ai_integration.md) and [technical/architecture.md](technical/architecture.md).

---

## 3. Menus, New Game, Options, debug

**Main Menu:** Play (New Game), Options, Quit.

**New Game** (stored on `UGameInstance` for the session — not meta-progression):

- Wave intensity / enemy count slider (e.g. 8–40 pirates across waves)
- Flagship HP scale (0.5× / 1× / 1.5×)
- Start → open `M_PirateRaid`

**Options** (persist with `UGameUserSettings` and/or a thin save object):

- Master / SFX / Music volume
- Mouse sensitivity
- Fullscreen / windowed
- Graphics quality preset (Low / Medium / High stubs — they can no-op besides scalability group)

**Pause:** Resume, Options, Quit to Menu.

**Victory / Defeat:** title, time survived or waves cleared, **Back to Menu**.

**F8 debug overlay** (dev only, not fantasy UI): live sliders bound to the pawn/weapon/enemy. Play-In-Editor steals F8 for eject-from-pawn, so **`\` opens the same panel** and is the key to use inside the editor.

- Max speed, forward acceleration, inertial damping
- Strafe cap, reverse cap, roll speed, camera height
- Fire rate, projectile speed
- Environment seed, apply/new seed (rebuilds sun, planets, dust, asteroids immediately)

Defaults match Interceptor numbers in the controls doc. Changing a slider applies immediately.

---

## 4. Horizon (7 steps)

Do **not** write 20 substeps for 6–7 until step 5 is fun.

| # | Step | Playable proof |
| --- | --- | --- |
| 1 | Sibling UE 5.8 C++ blank + Unreal MCP + Git + LFS | Editor opens; MCP talks; repo is clean |
| 2 | Menu stack | Main, Options, New Game, Pause, Victory, Defeat all route |
| 3 | Arena + fly / shoot | Placeholder Ace, one pulse gun, boost, camera, asteroid collide |
| 4 | Pirate waves + flagship | Win by killing flagship; lose at 0 HP |
| 5 | Debug sliders + juice | F8 tunes feel; muzzle/hit/shake exist |
| 6 | Real Ace mesh + better VFX | Swap primitives; loop unchanged |
| 7 | Settings polish / input remap stub | Options actually persist; remap can wait as a stub screen — volume, sensitivity, quality, and window mode now survive a restart; remap still deferred |

---

## 5. Steps 1–5 exploded

### Step 1 — Project

1. Create UE **5.8** Blank **C++** project `ShatteredRogue` at `C:\Projects\_personal\Shattered\game` (no starter content, Windows).
2. Project settings: Desktop, Forward Renderer, DX12, frame rate 60, Enhanced Input + Niagara on.
3. Enable **Unreal MCP**, Auto Start Server, generate Cursor client config.
4. Git init + `.gitignore` (UE) + LFS for `uasset` / `umap` / `fbx` / `png` / `wav`.
5. Content folders: `Maps`, `UI`, `Blueprints/Ship`, `Blueprints/Enemies`, `Meshes` (primitives), `VFX`.
6. C++ stubs only: `UShatteredGameInstance`, `AShatteredGameMode`, `AShatteredGameState`, `AShatteredPlayerController`, `AShatteredPawn`. **Do not** create DataTables for 30 ships.

### Step 2 — Menu stack

7. Maps: `M_MainMenu` (default startup), `M_PirateRaid`.
8. GameInstance fields: enemy-count, flagship HP scale, last raid result.
9. UMG: `W_MainMenu`, `W_Options`, `W_NewGame`, `W_Pause`, `W_Victory`, `W_Defeat`.
10. Wire Start → travel to `M_PirateRaid`; Victory/Defeat/Quit → `M_MainMenu`.
11. Options apply volume / sensitivity / window mode (quality preset can be a no-op scalability call).

### Step 3 — Fly and shoot

12. Enhanced Input: forward/reverse thrust, strafe, vertical thrust, mouse steering, roll, fire, boost, brake, **headlight**, camera toggle, pause, DebugOverlay.
13. `AShatteredPawn`: full 6DOF inertial velocity, thruster-limited alignment to camera heading, Interceptor 800 cruise speed, boost burst.
14. Third-person chase camera with lag and boost pullback; F1 first-person toggle.
15. One `APulseProjectile`; fire rate on the pawn; no inventory, no rarity.
16. Arena: bounded 3D volume, **seeded** 18–34 colliding asteroids (spawn/ingress keep-out), space sky + sun + 0–3 planets. See [design/18_procedural_environments.md](design/18_procedural_environments.md).
17. Player HP bar on HUD (number is enough). Pause works in-raid.

### Step 4 — Pirate Raid

18. Two or three pirate pawns: **chase**, **strafe+shoot**, **slow tank**. Primitive meshes. Simple move-to / shoot; Behavior Trees optional.
19. Wave spawner reads New Game enemy count; 3 waves then (or during last wave) spawn **flagship**.
20. Flagship: larger box, more HP (scaled by New Game), slow shots or ramming; **destroy flagship = Victory**.
21. Player HP 0 = Defeat (hide mesh + burst). GameMode owns raid state: `Warmup / Waves / Flagship / Won / Lost`.

### Step 5 — Tune and juice

22. ~~F8 widget sliders → pawn movement + weapon + enemy HP multiplier.~~ Done: max speed, forward acceleration, inertial damping, strafe cap, reverse cap, roll speed, camera height, fire rate, projectile speed, enemy HP multiplier, **environment seed**. Opens on **F8 or `\`** (PIE eats F8).
23. ~~Minimal juice: muzzle flash, hit spark, camera shake, flagship death burst.~~ Done: muzzle light per shot, impact burst at hit point, camera kick on fire and on damage taken, scaled death burst (bigger for the flagship).
24. Playtest pass: adjust defaults from F8, write the chosen numbers back into C++ defaults.

**Step 4 done when:** you want another try after dying, and beating the flagship feels like a finish.

---

## 6. Out of scope (POC)

4-player, Steam sessions, Hub / Outer Rim, hex galaxy, 30 named ships, modules, specialty pads, Heat, stations, cargo hold, Research Data, events other than this raid, Carrier drones, Chaos mesh fracture, **combat-envelope / anti-kiting AI** ([design/17_anti_kiting_combat.md](design/17_anti_kiting_combat.md)).

Those stay in the [archived roadmap](archive/full-game-roadmap-2026-08/) and [design/](design/) until this loop is fun.

---

## 7. After the POC

Only then reopen archive phases for hex map, second hull, and listen-server. Rewrite them if play contradicted the North Star.
