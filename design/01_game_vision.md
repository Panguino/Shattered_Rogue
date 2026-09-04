# 🎯 Game Vision

**Status:** Vision — current direction; art and loop still iterating.

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md). **Active build plan:** [00_POC_PLAYABLE_LOOP.md](../00_POC_PLAYABLE_LOOP.md). Parked material: [ideas/](ideas/).

---

## 1. Pitch

**Shattered Slop** is a **6DOF roguelite space shooter** where flight comes first. You fly the Ace, a nimble interceptor, through a shattered galaxy overrun by **the Slop** — a machine intelligence that turns everything it touches into more of itself — and push inward toward the thing at the core that is manufacturing it. Solo first, co-op later. Built in **UE 5.8, C++ primary**.

## 2. Current focus

In the owner's words: *nail the flight sim, a few enemies and a mini boss, and expand through iteration.* Everything else in this folder is downstream of the ship feeling good.

1. Flight feel — 6DOF inertial movement and the chase camera ([15_controls_and_camera.md](15_controls_and_camera.md)).
2. A few enemies that intercept instead of kite ([06_enemy_catalog.md](06_enemy_catalog.md), [17_anti_kiting_combat.md](17_anti_kiting_combat.md)).
3. One mini boss.
4. Iterate on the loop from there ([02_core_mechanics.md](02_core_mechanics.md)).

## 3. Pillars

- **The ship must feel good in 5 seconds** — before loot, before enemies, before everything.
- **Crossing fights, not conga lines** — 3D combat should intercept, flank, and overshoot; running away is allowed but is not free DPS.
- **Exploration & Discovery** — sectors hold secrets, anomalies, and hidden rewards.
- **Power Fantasy** — from a basic interceptor to a galaxy-shattering war machine; the best runs should feel illegal ([03_weapons_and_upgrades.md](03_weapons_and_upgrades.md)).
- **Readable enemies** — every Slop construct telegraphs what it is and what it will do ([06_enemy_catalog.md](06_enemy_catalog.md)).
- **Better Together** (later) — co-op roles, not reskins.

## 4. What's locked

| Decision | Where |
| --- | --- |
| **6DOF Avorion-style controls** and hull-mounted chase camera, as implemented | [15_controls_and_camera.md](15_controls_and_camera.md) |
| **C++ first** in UE 5.8, Blueprints only for glue | [technical/architecture.md](../technical/architecture.md) |
| **The Ace** is the player ship for now — one hull, no roster | [ideas/hull_roster_and_professions.md](ideas/hull_roster_and_professions.md) (parked) |
| **The Slop** is the enemy — every hostile is one body of it; the final boss is the core entity producing it | [14_lore_and_narrative.md](14_lore_and_narrative.md) |
| **Four currencies**: Minerals, Research Data, Power Cores, Warp Crystals | [02_core_mechanics.md](02_core_mechanics.md#8-currency--resource-system) |

## 5. What's exploring

**Art style is loose — we are still experimenting.** Nothing is confirmed. Candidates seen so far:

| Candidate | Where it shows up |
| --- | --- |
| **Cold iron** — unpainted gunmetal machinery, colour only from stored energy and thrusters | Slop constructs: [art/enemies/equation/cold-iron/](../art/enemies/equation/cold-iron/README.md) |
| **Stylized / toyetic** — cream plates, charcoal mechanics, gold hardpoints, low-poly product-render look | The Ace and ship concepts: [art/ship_prompts.md](../art/ship_prompts.md) |
| **Cartoon references** from earlier passes — Mario Galaxy, Astroneer, Crab Champions, Ratchet & Clank | [16_ui_hud_vfx.md](16_ui_hud_vfx.md), archived roadmap |

The enemy pass and the player-ship pass currently pull in different directions. That is fine for now; the lock comes after the loop does.

Also open: run length, sector count, the shape of the mini boss, how much of the environment generator ([18_procedural_environments.md](18_procedural_environments.md)) becomes level design.

## 6. What's parked

Kept in [ideas/](ideas/) so nothing is lost, not scheduled for the build:

- Hull roster, professions, 30 named combos — [ideas/hull_roster_and_professions.md](ideas/hull_roster_and_professions.md)
- Meta-progression and the toggle pool — [ideas/04_meta_progression.md](ideas/04_meta_progression.md)
- Stations — [ideas/07_stations.md](ideas/07_stations.md); Hub UI — [ideas/08_hub_ui.md](ideas/08_hub_ui.md)
- Co-op scaling — [12_combat_and_coop.md](12_combat_and_coop.md) (design only)
- Heat / difficulty modifiers — [ideas/11_difficulty_heat.md](ideas/11_difficulty_heat.md)
- Event encounters, carrier drones, stats and leaderboards — [ideas/](ideas/)
