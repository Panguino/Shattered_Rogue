# 🚀 Shattered Rogue

> **A roguelite space shooter with 4-player co-op, procedural galaxies, and AI-powered development.**

|                |                                           |
| -------------- | ----------------------------------------- |
| **Genre**      | Top-down roguelite space shooter          |
| **Players**    | 1–4 online co-op                          |
| **Engine**     | Unreal Engine 5.8 (C++ primary, Unreal MCP) |
| **Art Style**  | Cartoonish (Mario / Zelda inspired)       |
| **Run Length** | ~40–60 minutes                            |
| **Ships**      | 6 Hulls × 5 Professions = 30 named combos |

Choose your **hull** and **profession**, launch into procedural hex-grid galaxies. Mine asteroids, scan anomalies, trade at stations, fight the Equation's machine swarms. Upgrade with weapons, modules, and tech. Die, unlock new options, try again — solo or with up to 3 friends.

**Active plan:** [POC playable loop](00_POC_PLAYABLE_LOOP.md) — Pirate Raid arena, menus, debug sliders. Unreal project lives in the sibling **`game`** folder. This repo is design, wiki, and art (`creative`).

**Browse the wiki:** `cd wiki && npm run build` then `npm run serve` → http://localhost:4173.

---

## 📂 Repository Structure

```
creative/                           ← this repo (design + wiki + art)
├── 00_POC_PLAYABLE_LOOP.md         ← ACTIVE plan (Pirate Raid POC)
├── 00_GAME_DEVELOPMENT_PLAN.md     ← catalog index
├── README.md
├── wiki/
├── art/
├── design/                         ← 16 North Star design docs
├── research/
├── technical/
│   ├── ai_toolchain.md
│   └── architecture.md
└── archive/full-game-roadmap-2026-08/   ← 18-phase plan snapshot

Sibling:
C:\Projects\_personal\Shattered\game   ← UE 5.8 .uproject
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
| 14  | [Lore & Narrative](design/14_lore_and_narrative.md) | The Shattering, Breach, the Equation, 3 Glyphs, bosses, Loop+ |

### 📊 Player Data

| #   | Document                                                              | Covers                                                            |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 13  | [Statistics & Leaderboards](design/13_statistics_and_leaderboards.md) | Run summaries, career stats, leaderboards, dev analytics, sharing |

---

## 🌐 Wiki & Art

| | |
| --- | --- |
| **Wiki home** | [`wiki/dist/index.html`](wiki/dist/index.html) |
| **Ship prompts** | [`art/ship_prompts.md`](art/ship_prompts.md) |

---

## Technical documentation

| Document | Covers |
| --- | --- |
| [POC playable loop](00_POC_PLAYABLE_LOOP.md) | **Active plan** — Pirate Raid, menus, settings, debug, steps 1–5 |
| [Catalog](00_GAME_DEVELOPMENT_PLAN.md) | Index of design docs + status |
| [Architecture](technical/architecture.md) | UE 5.8 C++/UMG, Unreal MCP, later net model |
| [AI Toolchain](technical/ai_toolchain.md) | Tripo/Meshy, concept pipeline, MCP |
| [Archived full roadmap](archive/full-game-roadmap-2026-08/) | 18-phase plan, M1–M5 scope, 70+ decisions |

---

## 🔬 Research Library

### Technical Research

| Document                                                                | Covers                                                          |
| ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Engine MCP / AI Integration](research/engine_mcp_ai_integration.md)    | UE vs Unity vs Godot MCP (2026-08) — stay on Unreal 5.8         |

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

1. **This README**
2. **[POC playable loop](00_POC_PLAYABLE_LOOP.md)** — what to build now
3. **[Game Vision](design/01_game_vision.md)** — North Star fantasy
4. **[Core Mechanics](design/02_core_mechanics.md)** — Pirate Raid lives here
5. **[Controls](design/15_controls_and_camera.md)** — Interceptor feel numbers
6. Archived 18-phase plan only when expanding past the POC

### Key references

- **Confirmed decisions (full list):** [archived plan](archive/full-game-roadmap-2026-08/00_GAME_DEVELOPMENT_PLAN.md#confirmed-decisions-log)
- **Architecture:** [technical/architecture.md](technical/architecture.md)
- **AI tool setup:** [technical/ai_toolchain.md](technical/ai_toolchain.md)

---

## 🚦 Project Status

| | |
| --- | --- |
| **Current work** | POC Pirate Raid loop — follow [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md) |
| **Design docs** | 16/16 North Star (not blocking the POC) |
| **Full-game roadmap** | Archived 2026-08-20 |
| **UE 5.8 project** | Sibling `game` |
