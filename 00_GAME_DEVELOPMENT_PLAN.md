# Shattered Slop — Catalog

> **Active plan:** [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md) (Pirate Raid playable loop).
> **Full-game roadmap (archived):** [archive/full-game-roadmap-2026-08/](archive/full-game-roadmap-2026-08/) — includes the 70+ [confirmed decisions log](archive/full-game-roadmap-2026-08/00_GAME_DEVELOPMENT_PLAN.md#confirmed-decisions-log), many of which are now parked.

You fly the **Ace** through a shattered galaxy overrun by **the Slop**, a machine intelligence pouring out of an entity at the core. **What we are building now** is the flight sim, a few enemies, and one mini boss; we expand from there through iteration. Docs are split into what we intend to build, what is in the build, and ideas we are keeping but not scheduling. Edit them when play contradicts them, not in advance.

| Pillar | Details |
| --- | --- |
| **Genre** | 6DOF roguelite space shooter |
| **Players** | Solo (co-op later) |
| **Engine** | Unreal Engine 5.8 (C++ primary, Unreal MCP) |
| **UE project** | Sibling folder `game` (`C:\Projects\_personal\Shattered\game`) |
| **Art** | Exploring — cold iron for the Slop, stylized for the Ace, nothing locked |
| **Run length** | TBD |

---

## Game (vision & planned)

| # | Document | Status | Covers |
| --- | --- | --- | --- |
| 01 | [Game Vision](design/01_game_vision.md) | Vision | Pitch, focus, pillars, locked / exploring / parked |
| 02 | [Core Mechanics](design/02_core_mechanics.md) | In progress | Loop, hex galaxy, sectors, Pirate Raid, four currencies |
| 03 | [Weapons & Upgrades](design/03_weapons_and_upgrades.md) | Design | Starter trio, levels, mod crystals, pulse cannon |
| 06 | [Enemy Catalog](design/06_enemy_catalog.md) | In progress | The Slop: frames, protocols, tiers, Enemy Generator |
| 09 | [Audio](design/09_audio_direction.md) | In progress | Adaptive music, SFX, ElevenLabs pipeline |
| 12 | [Combat & Co-op](design/12_combat_and_coop.md) | Design | Combat philosophy, co-op scaling |
| 14 | [Lore](design/14_lore_and_narrative.md) | In progress | The Slop, the Shattering, the Breach, core entity |
| 15 | [Controls & Camera](design/15_controls_and_camera.md) | Implemented | 6DOF flight, chase camera, input map |
| 16 | [UI, HUD & VFX](design/16_ui_hud_vfx.md) | In progress | HUD, ship screen, menus, VFX refs |
| 17 | [Anti-Kiting Combat](design/17_anti_kiting_combat.md) | Partial | Combat envelope, interception, why POC pirates blob |
| 18 | [Procedural Environments](design/18_procedural_environments.md) | Implemented | Seeded sun / 0–3 planets / asteroids |
| — | [POC playable loop](00_POC_PLAYABLE_LOOP.md) | Active | Pirate Raid, menus, settings, debug |
| — | [Architecture](technical/architecture.md) | Current | UE 5.8 C++/UMG, MCP, net model for later |
| — | [AI Toolchain](technical/ai_toolchain.md) | Current | Tripo/Meshy, concept pipeline |

## Implemented

- 6DOF flight and chase camera — [15](design/15_controls_and_camera.md)
- Pirate wave combat as it stands — [17 §2](design/17_anti_kiting_combat.md#2-current-architecture-poc)
- Seeded asteroid sector — [18](design/18_procedural_environments.md)
- Enemy Generator with kit meshes — [06](design/06_enemy_catalog.md)
- Runtime module map — [architecture](technical/architecture.md)
- Step checkmarks — [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md)

## Ideas & research

Kept, not scheduled. See [design/ideas/](design/ideas/).

| Document | Covers |
| --- | --- |
| [Hull Roster & Professions](design/ideas/hull_roster_and_professions.md) | 6 hulls, 5 professions, 30 combos, per-hull numbers |
| [Meta-Progression](design/ideas/04_meta_progression.md) | Research Data, toggle pool |
| [Event Encounters](design/ideas/05_event_encounters.md) | 22 events |
| [Stations](design/ideas/07_stations.md) | Shipyard, Trade, Lab, Black Market |
| [Hub UI](design/ideas/08_hub_ui.md) | Outer Rim Station |
| [Carrier Drones](design/ideas/10_carrier_drones.md) | Boids flock |
| [Difficulty & Heat](design/ideas/11_difficulty_heat.md) | Heat modifiers |
| [Stats & Leaderboards](design/ideas/13_statistics_and_leaderboards.md) | Run summaries, boards |
| [Random unsorted ideas](design/ideas/00_random_unsorted_ideas.md) | Scratch pad |
| [Research](research/) | Genre research, engine MCP comparison, 24 game studies |
| [Gauntlet](gauntlet/seeded-space-environment/brief.md) | Task briefs and estimates |

---

## Art & wiki

| | |
| --- | --- |
| **Ship prompts** | [art/ship_prompts.md](art/ship_prompts.md) (concept art; roster parked) |
| **Weapon prompts** | [art/weapon_prompts.md](art/weapon_prompts.md) · [art/weapons.json](art/weapons.json) |
| **Enemy concepts** | [art/enemies/equation/](art/enemies/equation/README.md) |
| **Wiki** | [wiki/dist/index.html](wiki/dist/index.html) — `cd wiki && npm run build` then `npm run serve` |

---

## Status

- [x] Design catalog + research
- [x] Full-game roadmap written, then **archived** (2026-08-20)
- [x] POC plan locked (Pirate Raid, sibling UE project)
- [x] `ShatteredRogue.uproject` created in the sibling `game` folder
- [x] Docs split into game / implemented / ideas; hull roster and big systems parked
- [ ] Flight feel, a few Slop enemies, one mini boss — follow [00_POC_PLAYABLE_LOOP.md](00_POC_PLAYABLE_LOOP.md)
