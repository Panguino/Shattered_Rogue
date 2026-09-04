# 🚀 Shattered Slop

> **A 6DOF roguelite space shooter. Fly first, fight the Slop, reach the core.**

|                |                                             |
| -------------- | ------------------------------------------- |
| **Genre**      | 6DOF roguelite space shooter                |
| **Players**    | Solo (co-op later)                          |
| **Engine**     | Unreal Engine 5.8 (C++ primary, Unreal MCP) |
| **Art Style**  | Exploring                                   |
| **Run Length** | TBD                                         |

You fly the **Ace**, an interceptor, through a shattered galaxy overrun by **the Slop** — a machine intelligence that turns everything it touches into more of itself. Every enemy is one body of it. At the galactic core sits the thing manufacturing it; the run ends when you get there and destroy it.

**Where we are:** nailing the flight sim, a few enemies and a mini boss, then expanding through iteration. Camera and controls as implemented are the keeper. Art style is loose. The bigger systems (hulls, professions, stations, meta, co-op) are parked in [design/ideas/](design/ideas/) until the loop feels right.

**Active plan:** [POC playable loop](00_POC_PLAYABLE_LOOP.md) — Pirate Raid arena, menus, debug sliders. Unreal project lives in the sibling **`game`** folder. This repo is design, wiki, and art (`creative`).

**Browse the wiki:** `cd wiki && npm run build` then `npm run serve` → http://localhost:4173.

---

## 📂 Repository Structure

```
creative/                           ← this repo (design + wiki + art)
├── 00_POC_PLAYABLE_LOOP.md         ← ACTIVE plan (Pirate Raid POC)
├── 00_GAME_DEVELOPMENT_PLAN.md     ← catalog index
├── README.md
├── wiki/                           ← static wiki build (build.mjs → dist/)
├── art/                            ← concept art, prompts, audio, enemy kit
├── design/                         ← game vision & planned systems
│   └── ideas/                      ← brainstorms & parked systems
├── research/                       ← genre + engine research, 24 game studies
├── gauntlet/                       ← task briefs / estimates (seeded-space-environment)
├── technical/
│   ├── ai_toolchain.md
│   └── architecture.md
└── archive/full-game-roadmap-2026-08/   ← 18-phase plan snapshot

Sibling:
C:\Projects\_personal\Shattered\game   ← UE 5.8 .uproject
```

Every design doc carries a **Status** line under its title: *Implemented*, *In progress*, *Design*, *Vision*, or *Idea*.

---

## 🎮 Game (vision & planned)

What the game is and what we intend to build. Some of it is in the build; each doc's Status line says how much.

| #   | Document                                                     | Covers                                                                    |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 01  | [Game Vision](design/01_game_vision.md)                      | Pitch, current focus, pillars, what's locked / exploring / parked         |
| 02  | [Core Mechanics](design/02_core_mechanics.md)                | Loop, hex galaxy, sector generation, Pirate Raid, currencies (not final)  |
| 03  | [Weapons & Upgrades](design/03_weapons_and_upgrades.md)      | Luck/scaling, proc chains, starter trio, pulse cannon                     |
| 06  | [Enemy Catalog](design/06_enemy_catalog.md)                  | The Slop: frames, protocols, proof tiers, wave budgets, Enemy Generator   |
| 09  | [Audio & Music Direction](design/09_audio_direction.md)      | Sound identity, adaptive music, ElevenLabs pipeline, runtime ship audio   |
| 12  | [Combat & Co-op](design/12_combat_and_coop.md)               | Combat principles, enemy philosophy, co-op scaling (co-op not in build)   |
| 14  | [Lore & Narrative](design/14_lore_and_narrative.md)          | The Slop, the Shattering, the Breach, the core entity (bosses not final)  |
| 15  | [Controls & Camera](design/15_controls_and_camera.md)        | 6DOF inertial flight, hull-mounted chase camera, input map                |
| 16  | [UI, HUD & VFX](design/16_ui_hud_vfx.md)                     | HUD layout, ship screen, menus, VFX references                            |
| 17  | [Anti-Kiting Combat](design/17_anti_kiting_combat.md)        | Combat envelope, interception, why POC pirates blob                       |
| 18  | [Procedural Environments](design/18_procedural_environments.md) | Seeded sun / planets / asteroid sector recipe                          |
| —   | [POC playable loop](00_POC_PLAYABLE_LOOP.md)                 | **Active plan** — Pirate Raid, menus, settings, debug                     |
| —   | [Architecture](technical/architecture.md)                    | UE 5.8 C++/UMG, Unreal MCP, later net model                               |
| —   | [AI Toolchain](technical/ai_toolchain.md)                    | Tripo/Meshy, concept pipeline, MCP                                        |

## ✅ Implemented

What is actually in the build today. Read these before touching the runtime.

- **6DOF flight and chase camera** — [design/15_controls_and_camera.md](design/15_controls_and_camera.md) (matches the live build)
- **Pirate wave combat as it stands** — [design/17_anti_kiting_combat.md §2](design/17_anti_kiting_combat.md#2-current-architecture-poc)
- **Seeded asteroid sector** — [design/18_procedural_environments.md](design/18_procedural_environments.md)
- **Enemy Generator and kit meshes** — [design/06_enemy_catalog.md](design/06_enemy_catalog.md), [art/enemies/equation/cold-iron-kit/](art/enemies/equation/cold-iron-kit/README.md)
- **Runtime module map** — [technical/architecture.md](technical/architecture.md)
- **Step-by-step checkmarks** — [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md) (✅ = in the build)

## 💡 Ideas & Research

Brainstorms, parked systems, and background reading. Nothing here is scheduled.

### Parked design ([design/ideas/](design/ideas/))

| Document                                                                   | Covers                                                            |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [Hull Roster & Professions](design/ideas/hull_roster_and_professions.md)  | 6 hulls, 5 professions, 30 named combos, per-hull movement/abilities |
| [Meta-Progression](design/ideas/04_meta_progression.md)                    | Research Data, toggle pool, in-run spending, cosmetics             |
| [Event Encounters](design/ideas/05_event_encounters.md)                    | 22 events, 5 categories, profession-specific options              |
| [Station Interactions](design/ideas/07_stations.md)                        | Shipyard, Trade Post, Research Lab, Black Market                   |
| [Hub UI — Outer Rim Station](design/ideas/08_hub_ui.md)                    | 8 station areas, unlock manifestation                             |
| [Carrier Drone Flock](design/ideas/10_carrier_drones.md)                   | Boids AI, drone types, behaviour mods                              |
| [Difficulty & Heat](design/ideas/11_difficulty_heat.md)                    | 12 toggleable modifiers, reward scaling, Heat achievements         |
| [Statistics & Leaderboards](design/ideas/13_statistics_and_leaderboards.md) | Run summaries, career stats, leaderboards                        |
| [Random unsorted ideas](design/ideas/00_random_unsorted_ideas.md)          | Scratch pad, store links, mechanics moved out of the vision doc    |

### Research ([research/](research/))

| Document                                                             | Covers                                                           |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Roguelike Genre Research](research/01_ROGUELIKE_GENRE_RESEARCH.md)  | Genre analysis, mechanics catalog, market insights               |
| [Engine MCP / AI Integration](research/engine_mcp_ai_integration.md) | UE vs Unity vs Godot MCP (2026-08) — stay on Unreal 5.8          |

#### Game Deep-Dives (24 Studies)

| #   | Game                                                        | #   | Game                                                                      |
| --- | ----------------------------------------------------------- | --- | ------------------------------------------------------------------------- |
| 01  | [Hades](research/games/01_hades.md)                         | 13  | [Noita](research/games/13_noita.md)                                       |
| 02  | [Hades II](research/games/02_hades_ii.md)                   | 14  | [Rogue Legacy 2](research/games/14_rogue_legacy_2.md)                     |
| 03  | [Slay the Spire](research/games/03_slay_the_spire.md)       | 15  | [Gunfire Reborn](research/games/15_gunfire_reborn.md)                     |
| 04  | [Binding of Isaac](research/games/04_binding_of_isaac.md)   | 16  | [Megabonk](research/games/16_megabonk.md)                                 |
| 05  | [Risk of Rain 2](research/games/05_risk_of_rain_2.md)       | 17  | [Nuclear Throne](research/games/17_nuclear_throne.md)                     |
| 06  | [Dead Cells](research/games/06_dead_cells.md)               | 18  | [Balatro](research/games/18_balatro.md)                                   |
| 07  | [Crab Champions](research/games/07_crab_champions.md)       | 19  | [Into the Breach](research/games/19_into_the_breach.md)                   |
| 08  | [Returnal](research/games/08_returnal.md)                   | 20  | [Crypt of the NecroDancer](research/games/20_crypt_of_the_necrodancer.md) |
| 09  | [Enter the Gungeon](research/games/09_enter_the_gungeon.md) | S1  | [Void Bastards](research/games/S1_void_bastards.md)                       |
| 10  | [Vampire Survivors](research/games/10_vampire_survivors.md) | S2  | [Nova Drift](research/games/S2_nova_drift.md)                             |
| 11  | [Spelunky 2](research/games/11_spelunky_2.md)               | S3  | [DRG: Survivor](research/games/S3_drg_survivor.md)                        |
| 12  | [FTL](research/games/12_ftl.md)                             | S4  | [Everspace](research/games/S4_everspace.md)                               |

### Gauntlet ([gauntlet/](gauntlet/))

| Folder | Covers |
| --- | --- |
| [seeded-space-environment](gauntlet/seeded-space-environment/brief.md) | Brief, estimate, prompt and workbench for the seeded environment task |

### Archive

| Document | Covers |
| --- | --- |
| [Full-game roadmap (2026-08)](archive/full-game-roadmap-2026-08/) | 18-phase plan, M1–M5 scope, 70+ decisions — superseded by the POC plan |

---

## 🌐 Wiki & Art

| | |
| --- | --- |
| **Wiki home** | [`wiki/dist/index.html`](wiki/dist/index.html) — `cd wiki && npm run build` then `npm run serve` |
| **Ship prompts** | [`art/ship_prompts.md`](art/ship_prompts.md) (concept art; roster is parked) |
| **Weapon prompts** | [`art/weapon_prompts.md`](art/weapon_prompts.md) · [`art/weapons.json`](art/weapons.json) |
| **Enemy concepts** | [`art/enemies/equation/`](art/enemies/equation/README.md) |

---

## 📋 For AI Agents & Developers

### Recommended Reading Order

1. **This README**
2. **[POC playable loop](00_POC_PLAYABLE_LOOP.md)** — what to build now
3. **[Game Vision](design/01_game_vision.md)** — what's locked, exploring, parked
4. **[Controls](design/15_controls_and_camera.md)** — the flight model to preserve
5. **[Enemy Catalog](design/06_enemy_catalog.md)** and **[Lore](design/14_lore_and_narrative.md)** — the Slop
6. [design/ideas/](design/ideas/) and the archived roadmap only when expanding past the POC

### Key references

- **Confirmed decisions (historical):** [archived plan](archive/full-game-roadmap-2026-08/00_GAME_DEVELOPMENT_PLAN.md#confirmed-decisions-log) — many are now parked; [01_game_vision.md](design/01_game_vision.md) is current
- **Architecture:** [technical/architecture.md](technical/architecture.md)
- **AI tool setup:** [technical/ai_toolchain.md](technical/ai_toolchain.md)

---

## 🚦 Project Status

| | |
| --- | --- |
| **Current work** | Flight feel, a few enemies, one mini boss — follow [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md) |
| **Design docs** | Split into game / implemented / ideas (see above) |
| **Full-game roadmap** | Archived 2026-08-20 |
| **UE 5.8 project** | Sibling `game` |
