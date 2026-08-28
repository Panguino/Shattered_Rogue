# Shattered Rogue — Catalog

> **Active plan:** [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md) (Pirate Raid playable loop).
> **Full-game roadmap (archived):** [archive/full-game-roadmap-2026-08/](archive/full-game-roadmap-2026-08/) — includes the 70+ [confirmed decisions log](archive/full-game-roadmap-2026-08/00_GAME_DEVELOPMENT_PLAN.md#confirmed-decisions-log).

You are a **spaceman** in a shattered galaxy. The long-term fantasy is 6 hulls × 5 professions, hex-grid runs, and 1–4 co-op. **What we are building now** is a single Pirate Raid arena with menus and debug sliders. Design docs below are the North Star; edit them when play contradicts them, not in advance.

| Pillar | Details |
| --- | --- |
| **Genre** | Top-down roguelite space shooter |
| **Players (vision)** | 1–4 online co-op — **POC is solo** |
| **Engine** | Unreal Engine 5.8 (C++ primary, Unreal MCP) |
| **UE project** | Sibling folder `game` (`C:\Projects\_personal\Shattered\game`) |
| **Art** | Cartoonish (Mario / Zelda); POC uses primitives first |
| **Ships (vision)** | 6 hulls × 5 professions = 30 named combos |

---

## Design catalog

### Foundation

| # | Document | Covers |
| --- | --- | --- |
| 01 | [Game Vision](design/01_game_vision.md) | Pitch, hulls, professions, combos, art, pillars |

### Core gameplay

| # | Document | Covers |
| --- | --- | --- |
| 02 | [Core Mechanics](design/02_core_mechanics.md) | Loop, galaxy grid, sectors, Pirate Raid encounter |
| 18 | [Procedural Environments](design/18_procedural_environments.md) | Seeded sun / 0–3 planets / asteroids (POC asteroid sector) |
| 11 | [Difficulty & Heat](design/11_difficulty_heat.md) | Heat modifiers (not in POC) |
| 12 | [Combat & Co-op](design/12_combat_and_coop.md) | Combat philosophy, co-op scaling |
| 17 | [Anti-Kiting Combat](design/17_anti_kiting_combat.md) | Combat envelope, interception, why POC pirates blob |

### Items & progression

| # | Document | Covers |
| --- | --- | --- |
| 03 | [Weapons & Upgrades](design/03_weapons_and_upgrades.md) | W/M/S slots; specialty is inventory-only |
| 04 | [Meta-Progression](design/04_meta_progression.md) | Research Data, toggle pool |

### World & content

| # | Document | Covers |
| --- | --- | --- |
| 05 | [Event Encounters](design/05_event_encounters.md) | 22 events |
| 06 | [Enemy Catalog](design/06_enemy_catalog.md) | Chassis, traits, Wanted |
| 07 | [Stations](design/07_stations.md) | Shipyard, Trade, Lab, Black Market |
| 08 | [Hub UI](design/08_hub_ui.md) | Outer Rim Station |
| 10 | [Carrier Drones](design/10_carrier_drones.md) | Boids flock |

### Presentation

| # | Document | Covers |
| --- | --- | --- |
| 09 | [Audio](design/09_audio_direction.md) | Adaptive music, SFX |
| 15 | [Controls & Camera](design/15_controls_and_camera.md) | Arcade drift, Interceptor numbers |
| 16 | [UI, HUD & VFX](design/16_ui_hud_vfx.md) | HUD, menus, VFX refs |

### Lore & data

| # | Document | Covers |
| --- | --- | --- |
| 14 | [Lore](design/14_lore_and_narrative.md) | Shattering, Breach, Glyphs |
| 13 | [Stats & Leaderboards](design/13_statistics_and_leaderboards.md) | Run summaries, boards |

---

## Art & wiki

| | |
| --- | --- |
| **Ship prompts** | [art/ship_prompts.md](art/ship_prompts.md) |
| **Wiki** | [wiki/dist/index.html](wiki/dist/index.html) — `cd wiki && npm run build` then `npm run serve` |

---

## Technical (current)

| Document | Covers |
| --- | --- |
| [Architecture](technical/architecture.md) | UE 5.8 C++/UMG, MCP, net model for later |
| [AI Toolchain](technical/ai_toolchain.md) | Tripo/Meshy, concept pipeline |

---

## Status

- [x] Design catalog (18 docs) + research
- [x] Full-game roadmap written, then **archived** (2026-08-20)
- [x] POC plan locked (Pirate Raid, sibling UE project)
- [ ] Create `ShatteredRogue.uproject` and follow [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md) step 1
