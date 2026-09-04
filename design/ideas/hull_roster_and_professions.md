# 🚀 Hull Roster & Professions

**Status:** Idea — parked. The build has one hull, the Ace interceptor.

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../../00_GAME_DEVELOPMENT_PLAN.md). Pulled out of [01_game_vision.md](../01_game_vision.md) when the vision narrowed to one ship. Everything below is kept intact so it can be revived; none of it is scheduled.

> Concept art for the roster still exists: [art/ships.json](../../art/ships.json), [art/ship_prompts.md](../../art/ship_prompts.md), and the wiki **Player Ships** catalog ([wiki/dist/ships.html](../../wiki/dist/ships.html)). Treat it as reference, not a commitment.

---

## 1. Ship Selection System (Hull × Profession)

Players choose **two axes** before each run. Each combination plays differently.

### Ship Hulls (6 types — each has a UNIQUE mechanic)

| Hull               | Fantasy                  | Speed | HP    | Jump | Unique Mechanic                                                                            | Unlock                                        |
| ------------------ | ------------------------ | ----- | ----- | ---- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| 🔴 **Interceptor** | Nimble dogfighter        | ★★★★★ | ★★    | 2    | **Afterburner** — boost into speed state, ramming deals damage                             | 🟢 Starting                                   |
| 🟡 **Corvette**    | Balanced all-rounder     | ★★★★  | ★★★   | 2    | **Adaptive Hull** — slowly auto-repairs over time                                          | 🟢 Starting                                   |
| 🟢 **Carrier**     | Drone commander          | ★★★   | ★★★   | 1    | **Drone Flock** — 2–6 drones orbit your ship using flocking AI; auto-engage nearby enemies | 🔓 Deploy 50 total drones (via found items)   |
| 🟣 **Organic**     | Living ship (Zerg vibes) | ★★★   | ★★★★  | 2    | **Regeneration** — passively heals hull HP over time (faster outside combat)               | 🔒 Hidden — discover a living ship anomaly    |
| ⚫ **Phantom**     | Stealth predator         | ★★★★  | ★★    | 3    | **Cloak** — invisible, first attack from cloak deals 3× damage                             | 🔓 Complete a run without being detected once |
| 🔵 **Juggernaut**  | Heavy fortress           | ★★    | ★★★★★ | 1    | **Fortress Mode** — stop moving to deploy shields + turrets                                | 🔓 Absorb 50,000 total damage                 |

> **Hull = size class + unique mechanic.** Weapon / module / specialty slots are **per named combo**, still totaling **10**. Fighter pulls toward guns; Miner/Scout/Scientist pull toward specialty tools; Hauler pulls toward modules. See the combo slot table below.

> **Jump Range** = how many sectors you can jump on the galaxy grid. Phantom can skip dangerous sectors; Juggernaut/Carrier must path carefully. Scout profession adds +1 jump range.

### Professions (5 types — each changes WHAT YOU DO)

| Profession       | Combat Bonus                                    | Exploration Bonus                                     | Station Bonus                 | Unlock                        |
| ---------------- | ----------------------------------------------- | ----------------------------------------------------- | ----------------------------- | ----------------------------- |
| ⚔️ **Fighter**   | +20% weapon dmg, execute on low-HP enemies      | Bounty boards, combat challenges                      | Military vendor               | 🟢 Starting                   |
| ⛏️ **Miner**     | Drop mining charges as proximity mines          | Mine asteroids for 2× minerals, access rare ore veins | Ore refinery access           | 🟢 Starting                   |
| 🔭 **Scout**     | Mark targets for +15% team damage               | Full sector map reveal, find hidden rooms             | Intel vendor, shortcut routes | 🔓 Discover 25 hidden areas   |
| 📦 **Hauler**    | Shield focus, absorb 20% more damage            | Salvage wrecks for bonus loot, +40% cargo space       | Bulk trade at +30% markup     | 🔓 Sell 10,000 total minerals |
| 🔬 **Scientist** | Analyze enemies (reveal HP/weakness/loot table) | Scan anomalies for research, +30% research gain       | Tech lab, craft upgrades      | 🔓 Collect 100 research data  |

> **New players start with 2 hulls × 2 professions = 4 combos.** Unlock more through gameplay achievements. Hidden unlocks (Organic) reward exploration.

### Named Combos (30 total — Hull × Profession)

|                    | ⚔️ Fighter      | ⛏️ Miner          | 🔭 Scout         | 📦 Hauler       | 🔬 Scientist      |
| ------------------ | --------------- | ----------------- | ---------------- | --------------- | ----------------- |
| 🔴 **Interceptor** | **"Ace"**       | **"Prospector"**  | **"Pathfinder"** | **"Smuggler"**  | **"Probe"**       |
| 🟡 **Corvette**    | **"Mercenary"** | **"Driller"**     | **"Ranger"**     | **"Trader"**    | **"Researcher"**  |
| 🟢 **Carrier**     | **"Warlord"**   | **"Foreman"**     | **"Spymaster"**  | **"Magnate"**   | **"Professor"**   |
| 🟣 **Organic**     | **"Predator"**  | **"Hive"**        | **"Symbiote"**   | **"Leviathan"** | **"Specimen"**    |
| ⚫ **Phantom**     | **"Assassin"**  | **"Ghost Miner"** | **"Shadow"**     | **"Pirate"**    | **"Infiltrator"** |
| 🔵 **Juggernaut**  | **"Warmonger"** | **"Excavator"**   | **"Outpost"**    | **"Freighter"** | **"Observatory"** |

### Named Combo Slots (⚔️W / 🛡️M / 🔧S — all total 10)

Profession **reshapes** the ship. Same hull family, different vehicle.

|                    | ⚔️ Fighter     | ⛏️ Miner        | 🔭 Scout        | 📦 Hauler      | 🔬 Scientist    |
| ------------------ | -------------- | --------------- | --------------- | -------------- | --------------- |
| 🔴 **Interceptor** | Ace 4/5/1      | Prospector 2/4/4 | Pathfinder 3/3/4 | Smuggler 2/6/2 | Probe 2/4/4     |
| 🟡 **Corvette**    | Mercenary 2/5/3 | Driller 1/4/5    | Ranger 2/4/4     | Trader 1/6/3   | Researcher 1/5/4 |
| 🟢 **Carrier**     | Warlord 1/6/3  | Foreman 1/5/4    | Spymaster 1/5/4  | Magnate 1/7/2  | Professor 1/5/4 |
| 🟣 **Organic**     | Predator 2/7/1 | Hive 1/6/3       | Symbiote 2/5/3   | Leviathan 1/7/2 | Specimen 2/6/2  |
| ⚫ **Phantom**     | Assassin 3/5/2 | Ghost Miner 2/5/3 | Shadow 2/4/4    | Pirate 3/5/2   | Infiltrator 2/5/3 |
| 🔵 **Juggernaut**  | Warmonger 3/6/1 | Excavator 2/5/3  | Outpost 2/5/3    | Freighter 2/7/1 | Observatory 2/5/3 |

> Fighter keeps the old hull identity (Ace is still the only 4-gun interceptor). Miner/Scout/Scientist trade guns for tools. Hauler trades guns for modules. Engines and silhouettes change with the combo — see art prompts.

> **On the 3D mesh:** only **weapons** and **engine mods** get gold hardpoints (plus Carrier **drone bays**, which are the hull mechanic). **Specialty slots are inventory-only** — no gold pad, no visible tool socket. Profession identity still shows in silhouette (drill housing, sensor mast, cargo belly), just not as extra rings.

### Cross-Axis Synergy Bonuses

Special bonuses activate for specific Hull × Profession combos:

| Combo                              | Synergy                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| Carrier + Miner ("Foreman")        | Drones auto-mine nearby asteroids while you fight                |
| Organic + Scientist ("Specimen")   | Research data causes unique mutations (extra armor, bio-weapons) |
| Phantom + Fighter ("Assassin")     | Cloak recharges 50% faster after a kill                          |
| Juggernaut + Hauler ("Freighter")  | Fortress Mode creates a safe zone for teammates to trade/heal    |
| Interceptor + Scout ("Pathfinder") | Afterburner reveals map along flight path                        |
| Carrier + Scientist ("Professor")  | Analysis drones reveal enemy loot tables for whole team          |

---

## 2. Per-Hull Movement & Boost

Copied from [15_controls_and_camera.md](../15_controls_and_camera.md) as it stood when the roster was parked. The Interceptor column is what the Ace flies today; the rest are projections.

| Parameter          | Interceptor | Gunship | Hauler  | Phantom   | Juggernaut | Carrier  |
| ------------------ | ----------- | ------- | ------- | --------- | ---------- | -------- |
| **Max Speed**      | 800         | 600     | 500     | 900       | 400        | 550      |
| **Reverse / Strafe Cap** | 120 / 150 | 100 / 120 | 90 / 100 | 140 / 180 | 70 / 80 | 100 / 110 |
| **Acceleration**   | High        | Medium  | Medium  | Very High | Low        | Medium   |
| **Drag**           | Medium      | High    | High    | Low       | Very High  | Medium   |
| **Drift Feel**     | Moderate    | Minimal | Minimal | Slippery  | Tank-like  | Moderate |
| **Boost Speed**    | 1200        | 900     | 750     | 1400      | 600        | 800      |
| **Boost Duration** | 0.4s        | 0.3s    | 0.3s    | 0.6s      | 0.5s       | 0.4s     |
| **Boost Cooldown** | 3s          | 4s      | 5s      | 2s        | 6s         | 4s       |
| **Ship Radius**    | Small       | Medium  | Medium  | Small     | Large      | Large    |

## 3. Hull Abilities

Also copied from [15_controls_and_camera.md](../15_controls_and_camera.md). One unique ability per hull on a longer cooldown.

| Hull            | Ability      | Effect                                      | Cooldown |
| --------------- | ------------ | ------------------------------------------- | -------- |
| **Interceptor** | Afterburner  | 2× speed for 3s, can't fire during          | 12s      |
| **Gunship**     | Weapons Hot  | All weapons fire 50% faster for 4s          | 15s      |
| **Hauler**      | Tractor Beam | Pull all nearby loot to ship (wide radius)  | 10s      |
| **Phantom**     | Cloak        | Invisible for 3s, break on fire, bonus crit | 18s      |
| **Juggernaut**  | Fortify      | 80% damage reduction for 4s, can't move     | 20s      |
| **Carrier**     | Drone Surge  | All drones fire rate doubled for 5s         | 14s      |

> [!WARNING]
> **Naming conflict to reconcile if revived.** The two tables above use **Gunship** and **Hauler** as hull names; the roster in section 1 has **Corvette** and **Organic** in those slots, and "Hauler" is also a *profession* there. Pick one set of six before any of this goes back into a build.

---

## 4. Related parked ideas

- Drone flock behaviour for the Carrier hull: [10_carrier_drones.md](10_carrier_drones.md)
- Profession-specific station services: [07_stations.md](07_stations.md)
- Hull/profession unlocks via Research Data: [04_meta_progression.md](04_meta_progression.md)
