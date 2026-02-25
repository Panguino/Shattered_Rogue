# 🎯 Game Vision & Concept

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. Elevator Pitch

> You are a **spaceman** — a pilot in a shattered galaxy where ancient gates once connected civilizations. Choose your **ship hull** and **profession**, then launch into procedurally generated sectors. Mine asteroids for minerals, scan anomalies for research data, trade at stations, and fight hostile forces. Upgrade your ship with found weapons, modules, and tech. Die, unlock new options, and try again — solo or with up to 3 friends.

---

## 2. Ship Selection System (Hull × Profession)

Players choose **two axes** before each run. Each combination plays differently:

### Ship Hulls (6 types — each has a UNIQUE mechanic)

| Hull               | Fantasy                  | Speed | HP    | ⚔️Wpn | 🛡️Mod | 🔧Spec | Jump | Unique Mechanic                                                                            | Unlock                                        |
| ------------------ | ------------------------ | ----- | ----- | ----- | ----- | ------ | ---- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| 🔴 **Interceptor** | Nimble dogfighter        | ★★★★★ | ★★    | 4     | 5     | 1      | 2    | **Afterburner** — boost into speed state, ramming deals damage                             | 🟢 Starting                                   |
| 🟡 **Corvette**    | Balanced all-rounder     | ★★★★  | ★★★   | 2     | 5     | 3      | 2    | **Adaptive Hull** — slowly auto-repairs over time                                          | 🟢 Starting                                   |
| 🟢 **Carrier**     | Drone commander          | ★★★   | ★★★   | 1     | 6     | 3      | 1    | **Drone Flock** — 2–6 drones orbit your ship using flocking AI; auto-engage nearby enemies | 🔓 Deploy 50 total drones (via found items)   |
| 🟣 **Organic**     | Living ship (Zerg vibes) | ★★★   | ★★★★  | 2     | 7     | 1      | 2    | **Regeneration** — passively heals hull HP over time (faster outside combat)               | 🔒 Hidden — discover a living ship anomaly    |
| ⚫ **Phantom**     | Stealth predator         | ★★★★  | ★★    | 3     | 5     | 2      | 3    | **Cloak** — invisible, first attack from cloak deals 3× damage                             | 🔓 Complete a run without being detected once |
| 🔵 **Juggernaut**  | Heavy fortress           | ★★    | ★★★★★ | 3     | 6     | 1      | 1    | **Fortress Mode** — stop moving to deploy shields + turrets                                | 🔓 Absorb 50,000 total damage                 |

> **All hulls have 10 total slots** — the difference is distribution. Interceptor is the quad-weapon blitz (4 guns!); Corvette/Carrier lean into specialty (3 each); Organic/Juggernaut are module-heavy stat stackers (7 and 6).

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

## 3. What Makes This Unique?

| Differentiator                  | Description                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Ship Hull × Profession Grid** | 30 named combos with unique synergies; choose your playstyle before each run                                    |
| **4-Player Co-op with Roles**   | Each player picks a different profession — Miner mines, Scout reveals map, Fighter protects, Scientist analyzes |
| **3-Currency Economy**          | Minerals (in-run), Research Data (meta), Power Cores (leveling) — each profession interacts differently         |
| **Slower Exploration Pacing**   | FTL-style sector maps, mining minigames, station stops — not just combat arenas                                 |
| **Living Ships**                | Organic hull type mutates visually based on upgrades — grows tentacles, armor plates, bio-weapons               |
| **Drone Swarm Gameplay**        | Carrier hull deploys autonomous drones that inherit your profession's behavior                                  |
| **Achievement-Based Unlocks**   | Play naturally to unlock new hulls and professions — mine a lot to unlock Miner, etc.                           |

---

## 4. Art Style Direction

> [!IMPORTANT]
> **Confirmed: Cartoonish — Mario / Zelda inspired**

| Aspect              | Direction                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Overall Tone**    | Bright, colorful, expressive — a fun galaxy you want to explore                                             |
| **Ship Design**     | Exaggerated proportions, chunky shapes, glowing engines (think Astroneer meets Ratchet & Clank)             |
| **Environments**    | Lush nebulae, saturated asteroid fields, whimsical space stations, painterly skyboxes                       |
| **Effects**         | Juicy VFX — screen shake, particle bursts, laser trails, mining sparks, shield flashes                      |
| **UI Style**        | Clean, rounded, playful — big readable icons and text                                                       |
| **Reference Games** | Super Mario Galaxy, Zelda: Tears of the Kingdom, Astroneer, Lovers in a Dangerous Spacetime, Crab Champions |
| **Lighting**        | Stylized — warm ambient with punchy directional light, soft shadows, neon accents                           |

**Why this art style works:**

- **AI tools excel at cartoonish styles** — easier to get consistent, game-ready results from Tripo/Meshy
- **Forgiving topology** — stylized models don't need photorealistic detail
- **Timeless appeal** — cartoony games age well (Mario Galaxy still looks great 15+ years later)
- **Matches the humor** — chunky spaceships with personality, expressive pilot animations

---

## 5. Thematic Pillars

- **Exploration & Discovery** — Every sector holds secrets, anomalies, and hidden rewards
- **Ship Identity** — Your hull is your body; it defines how you play and what you build
- **Resource Mastery** — Mining, researching, and trading are not chores — they're core gameplay
- **Power Fantasy** — From a basic shuttle to a galaxy-shattering war machine
- **Better Together** — Co-op professions create natural team roles, like DRG's class system

---

## 6. Spaceship & Pilot Mechanics Ideas

| Mechanic            | Description                                                     | Inspiration            |
| ------------------- | --------------------------------------------------------------- | ---------------------- |
| **Boost Dash**      | Afterburner forward for dodge + traversal                       | Crab Champions sliding |
| **Mining Laser**    | Mine asteroids, can also damage enemies at reduced rate         | No Man's Sky / DRG     |
| **Scanner Pulse**   | Reveal nearby resources, enemies, secrets                       | No Man's Sky visor     |
| **Shield Deploy**   | Temporary directional shield for blocking                       | Gunfire Reborn         |
| **Tractor Beam**    | Pull loot, resources, and salvage to your ship                  | Space games standard   |
| **Drone Flock**     | Drones orbit ship using flocking AI, auto-engage nearby enemies | StarCraft carriers     |
| **Cloak**           | Temporary invisibility, breaks on attack                        | Star Trek / FTL        |
| **Fortress Mode**   | Stop to deploy turrets and shields (Juggernaut hull)            | Tower defense hybrid   |
| **Warp Jump**       | Sector-to-sector travel between nodes on the map                | FTL jump drive         |
| **Module Slots**    | Equippable passive upgrades found during runs                   | Risk of Rain 2 items   |
| **Emergency Eject** | Pilot ejects on ship destruction, brief on-foot survival        | Risk/reward mechanic   |
