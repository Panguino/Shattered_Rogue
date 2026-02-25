# 🚀 Shattered Rogue

> **A roguelite space shooter with 4-player co-op, procedural galaxies, and AI-powered development.**

|                |                                           |
| -------------- | ----------------------------------------- |
| **Genre**      | Top-down roguelite space shooter          |
| **Players**    | 1–4 online co-op                          |
| **Engine**     | Unreal Engine 5.5 (C++ primary)           |
| **Art Style**  | Cartoonish (Mario / Zelda inspired)       |
| **Run Length** | ~40–60 minutes                            |
| **Ships**      | 6 Hulls × 5 Professions = 30 named combos |

Choose your **hull** and **profession**, launch into procedural hex-grid galaxies. Mine asteroids, scan anomalies, trade at stations, fight jellyfish-like alien parasites. Upgrade with weapons, modules, and tech. Die, unlock new options, try again — solo or with up to 3 friends.

---

## 📂 Repository Structure

```
Shattered_Rogue/
├── 📋 00_GAME_DEVELOPMENT_PLAN.md     ← Master catalog + confirmed decisions
├── 📖 README.md                       ← You are here
│
├── 🎨 design/                         ← 16 game design documents
│   ├── 01–02  Foundation & Mechanics
│   ├── 03–04  Items & Progression
│   ├── 05–08  World, Enemies, Stations, Hub
│   ├── 09–10  Audio, Drones
│   ├── 11–13  Difficulty, Combat, Stats
│   └── 14–16  Lore, Controls, VFX
│
├── 🔬 research/                       ← Genre research & game studies
│   ├── 01_ROGUELIKE_GENRE_RESEARCH.md
│   └── games/                         ← 24 individual game deep-dives
│
└── ⚙️ technical/                      ← Architecture, scope & milestones
    ├── ai_toolchain.md
    ├── architecture.md
    ├── prototype_scope.md
    ├── implementation_milestones.md    ← 18-phase master plan (~400 sub-steps)
    └── milestones/                    ← 4th-level micro-steps (~1,500+ tasks)
        ├── phase_01_02   Foundation & Ship Flies
        ├── phase_03      Combat Works
        ├── phase_04      Run Structure
        ├── phase_05_06   Progression & Co-op
        ├── phase_07_10   Content Expansion
        ├── phase_11_14   Systems & Endgame
        └── phase_15_18   Audio, Polish & Release
```

---

## 🎨 Design Documents

### 🎯 Game Foundation

| #   | Document                                          | Covers                                                         |
| --- | ------------------------------------------------- | -------------------------------------------------------------- |
| 01  | [Game Vision & Concept](design/01_game_vision.md) | Elevator pitch, hulls, professions, combos, art style, pillars |

### ⚙️ Core Gameplay

| #   | Document                                                 | Covers                                                            |
| --- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| 02  | [Core Mechanics](design/02_core_mechanics.md)            | Gameplay loop, galaxy grid, sectors, bosses, economy, progression |
| 11  | [Difficulty & Heat System](design/11_difficulty_heat.md) | 12 toggleable modifiers, reward scaling, Heat achievements        |
| 12  | [Combat & Co-op](design/12_combat_and_coop.md)           | Combat design, enemy philosophy, co-op scaling, communication     |

### 🗡️ Items & Progression

| #   | Document                                                | Covers                                                             |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| 03  | [Weapons & Upgrades](design/03_weapons_and_upgrades.md) | Luck/scaling, proc chains, 3-category upgrade system, catalogs     |
| 04  | [Meta-Progression](design/04_meta_progression.md)       | Research Data, toggle pool, in-run spending, cosmetics, RD economy |

### 🌌 World & Content

| #   | Document                                           | Covers                                                          |
| --- | -------------------------------------------------- | --------------------------------------------------------------- |
| 05  | [Event Encounters](design/05_event_encounters.md)  | 22 events, 5 categories, frequency, profession-specific options |
| 06  | [Enemy Catalog](design/06_enemy_catalog.md)        | 6 chassis, traits, tiers, wave budgets, neutrals, Wanted system |
| 07  | [Station Interactions](design/07_stations.md)      | Shipyard, Trade Post, Research Lab, Black Market, UX flows      |
| 08  | [Hub UI — Outer Rim Station](design/08_hub_ui.md)  | 8 station areas, unlock manifestation, mood, area UX            |
| 10  | [Carrier Drone Flock](design/10_carrier_drones.md) | Boids AI, drone types, behavior mods, engagement, items         |

### 🎵 Presentation

| #   | Document                                                | Covers                                                                  |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| 09  | [Audio & Music Direction](design/09_audio_direction.md) | Sound identity, adaptive music, ring progression, SFX, AI pipeline      |
| 15  | [Controls & Camera](design/15_controls_and_camera.md)   | Arcade drift movement, twin-stick input, dynamic camera, hull abilities |
| 16  | [UI, HUD & VFX](design/16_ui_hud_vfx.md)                | Astroneer/Crab Champions VFX style, HUD layout, menu screens            |

### 📜 Lore & Story

| #   | Document                                            | Covers                                                              |
| --- | --------------------------------------------------- | ------------------------------------------------------------------- |
| 14  | [Lore & Narrative](design/14_lore_and_narrative.md) | The Shattering, Breach, jellyfish parasite, 3 Glyphs, bosses, Loop+ |

### 📊 Player Data

| #   | Document                                                              | Covers                                                            |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 13  | [Statistics & Leaderboards](design/13_statistics_and_leaderboards.md) | Run summaries, career stats, leaderboards, dev analytics, sharing |

---

## ⚙️ Technical Documentation

| Document                                                            | Covers                                                           |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Architecture](technical/architecture.md)                           | UE5 C++/Blueprint strategy, networking, plugin structure, perf   |
| [AI Toolchain](technical/ai_toolchain.md)                           | Code gen, 3D models, textures, music, SFX, concept art pipelines |
| [Prototype & MVP Scope](technical/prototype_scope.md)               | 5 milestones (Ship Flies → Co-op), ~14 weeks, content matrix     |
| [Implementation Milestones](technical/implementation_milestones.md) | 18 phases, ~400 sub-steps, full game build from zero to release  |

### 🗂️ Detailed Milestone Plans (4th-Level Micro-Steps)

Each file breaks phases into atomic, single-task micro-steps (~1,500+ total):

| File                                                                    | Phases | Covers                                                                            |
| ----------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------- |
| [phase_01_02](technical/milestones/phase_01_02_foundation_ship.md)      | 1–2    | Project init, Git/LFS, C++ classes, movement, camera, arena, HUD                  |
| [phase_03](technical/milestones/phase_03_combat.md)                     | 3      | Weapons, projectiles, 3 enemy chassis, health, loot, waves, death                 |
| [phase_04](technical/milestones/phase_04_run_structure.md)              | 4      | Galaxy map, sector transitions, combat/mining/station, cargo, boss, events        |
| [phase_05_06](technical/milestones/phase_05_06_progression_coop.md)     | 5–6    | RD currency, Hub, unlocks, hex map, Gunship, professions, networking, revive      |
| [phase_07_10](technical/milestones/phase_07_10_content_expansion.md)    | 7–10   | 6 hulls, 5 professions, weapons/modules, traits, corruption, environments, drones |
| [phase_11_14](technical/milestones/phase_11_14_systems_endgame.md)      | 11–14  | Heat system, stations, events/lore, Glyphs, Breach Run, NG+                       |
| [phase_15_18](technical/milestones/phase_15_18_audio_polish_release.md) | 15–18  | Adaptive audio, 4-player co-op, Steam, stats, balance, polish, shipping           |

---

## 🔬 Research Library

### Genre Research

| Document                                                            | Covers                                                           |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Roguelike Genre Research](research/01_ROGUELIKE_GENRE_RESEARCH.md) | Comprehensive genre analysis, mechanics catalog, market insights |

### Game Deep-Dives (24 Studies)

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

---

## 📋 For AI Agents & Developers

### Recommended Reading Order

1. **This README** — get the lay of the land
2. **[Game Vision](design/01_game_vision.md)** — understand what we're building
3. **[Core Mechanics](design/02_core_mechanics.md)** — how the game plays
4. **[Prototype Scope](technical/prototype_scope.md)** — what to build first (5 milestones)
5. **[Implementation Milestones](technical/implementation_milestones.md)** — the full 18-phase plan
6. **Phase-specific file in `technical/milestones/`** — your atomic task list

### Key References

- **Confirmed decisions**: bottom of [00_GAME_DEVELOPMENT_PLAN.md](00_GAME_DEVELOPMENT_PLAN.md#confirmed-decisions-log) (70+ decisions)
- **Architecture & patterns**: [technical/architecture.md](technical/architecture.md)
- **AI tool setup**: [technical/ai_toolchain.md](technical/ai_toolchain.md)

---

## 🚦 Project Status

|                         |                                                             |
| ----------------------- | ----------------------------------------------------------- |
| **Current Phase**       | Pre-production complete — ready for Phase 1 (Project Setup) |
| **Design Docs**         | ✅ 16/16 complete                                           |
| **Research**            | ✅ Genre analysis + 24 game studies                         |
| **Technical Docs**      | ✅ Architecture, toolchain, scope, milestones               |
| **Implementation Plan** | ✅ 18 phases, ~1,500+ micro-steps                           |
| **UE5 Project**         | ⬜ Not yet created                                          |
