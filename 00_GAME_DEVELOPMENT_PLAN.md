# 🚀 Shattered Rogue — Game Development Plan

> **A roguelite space shooter with 4-player co-op, procedural galaxies, and AI-powered development.**

---

## Project Overview

You are a **spaceman** — a pilot in a shattered galaxy where ancient gates once connected civilizations. Choose your **ship hull** and **profession**, then launch into procedurally generated sectors. Mine asteroids, scan anomalies, trade at stations, and fight hostile forces. Upgrade your ship with found weapons, modules, and tech. Die, unlock new options, and try again — solo or with up to 3 friends.

| Pillar          | Details                                         |
| --------------- | ----------------------------------------------- |
| **Genre**       | Top-down roguelite space shooter                |
| **Players**     | 1–4 (online co-op)                              |
| **Engine**      | Unreal Engine 5 (C++ primary)                   |
| **Art Style**   | Cartoonish (Mario / Zelda inspired)             |
| **Run Length**  | ~40–60 minutes                                  |
| **Ship System** | 6 Hulls × 5 Professions = 30 named combos       |
| **Development** | AI-first toolchain for code, assets, music, SFX |

---

## 📂 Design Catalog

### 🎯 Game Foundation

| #   | Document                                          | Covers                                                         |
| --- | ------------------------------------------------- | -------------------------------------------------------------- |
| 01  | [Game Vision & Concept](design/01_game_vision.md) | Elevator pitch, hulls, professions, combos, art style, pillars |

---

### ⚙️ Core Gameplay

| #   | Document                                                 | Covers                                                            |
| --- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| 02  | [Core Mechanics](design/02_core_mechanics.md)            | Gameplay loop, galaxy grid, sectors, bosses, economy, progression |
| 12  | [Combat & Co-op](design/12_combat_and_coop.md)           | Combat design, enemy philosophy, co-op scaling, communication     |
| 11  | [Difficulty & Heat System](design/11_difficulty_heat.md) | 12 toggleable modifiers, reward scaling, Heat achievements        |

---

### 🗡️ Items & Progression

| #   | Document                                                | Covers                                                             |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| 03  | [Weapons & Upgrades](design/03_weapons_and_upgrades.md) | Luck/scaling, proc chains, 3-category upgrade system, catalogs     |
| 04  | [Meta-Progression](design/04_meta_progression.md)       | Research Data, toggle pool, in-run spending, cosmetics, RD economy |

---

### 🌌 World & Content

| #   | Document                                           | Covers                                                          |
| --- | -------------------------------------------------- | --------------------------------------------------------------- |
| 05  | [Event Encounters](design/05_event_encounters.md)  | 22 events, 5 categories, frequency, profession-specific options |
| 06  | [Enemy Catalog](design/06_enemy_catalog.md)        | 6 chassis, traits, tiers, wave budgets, neutrals, Wanted system |
| 07  | [Station Interactions](design/07_stations.md)      | Shipyard, Trade Post, Research Lab, Black Market, UX flows      |
| 08  | [Hub UI — Outer Rim Station](design/08_hub_ui.md)  | 8 station areas, unlock manifestation, mood, area UX            |
| 10  | [Carrier Drone Flock](design/10_carrier_drones.md) | Boids AI, drone types, behavior mods, engagement, items         |

---

### 🎵 Presentation

| #   | Document                                                | Covers                                                                  |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| 09  | [Audio & Music Direction](design/09_audio_direction.md) | Sound identity, adaptive music, ring progression, SFX, AI pipeline      |
| 15  | [Controls & Camera](design/15_controls_and_camera.md)   | Arcade drift movement, twin-stick input, dynamic camera, hull abilities |
| 16  | [UI, HUD & VFX](design/16_ui_hud_vfx.md)                | Astroneer/Crab Champions VFX style, HUD layout, menu screens            |

---

### 📜 Lore & Story

| #   | Document                                            | Covers                                                              |
| --- | --------------------------------------------------- | ------------------------------------------------------------------- |
| 14  | [Lore & Narrative](design/14_lore_and_narrative.md) | The Shattering, Breach, jellyfish parasite, 3 Glyphs, bosses, Loop+ |

---

### 📊 Player Data & Competition

| #   | Document                                                              | Covers                                                            |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 13  | [Statistics & Leaderboards](design/13_statistics_and_leaderboards.md) | Run summaries, career stats, leaderboards, dev analytics, sharing |

---

## 🔧 Technical Documentation

| Document                                                            | Covers                                                           |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [AI Toolchain](technical/ai_toolchain.md)                           | Code gen, 3D models, textures, music, SFX, concept art pipelines |
| [Architecture](technical/architecture.md)                           | UE5 C++/Blueprint strategy, networking, plugin structure, perf   |
| [Prototype & MVP Scope](technical/prototype_scope.md)               | 5 milestones (Ship Flies → Co-op), ~14 weeks, content matrix     |
| [Implementation Milestones](technical/implementation_milestones.md) | 18 phases, ~400+ sub-steps, full game build from zero to release |

---

## 📚 Research Library

| Document                                                                          | Covers                            |
| --------------------------------------------------------------------------------- | --------------------------------- |
| [Roguelike Research](research/games/roguelike_research.md)                        | Genre analysis, mechanics catalog |
| [AI Tools Research](research/games/ai_tools_for_game_dev.md)                      | AI toolchain evaluation           |
| [UE5 AI Coding Research](research/games/ue5_ai_coding_tools.md)                   | UE5-specific AI development tools |
| [Crossover Research](research/games/crossover_research.md)                        | Cross-genre analysis              |
| [Comprehensive Research](research/games/comprehensive_roguelike_game_research.md) | Deep genre study + profitability  |

---

## 🗓️ Development Phases & Milestones

> [!IMPORTANT]
> **Philosophy: Start Small.** Each phase must produce a playable build before the next phase begins. Prove the fun first.

### Phase 1: Research & Planning ← _YOU ARE HERE_

- [x] Genre research & competitive analysis
- [x] AI toolchain research
- [x] Game concept definition
- [x] Confirm core decisions (perspective, co-op, art style, scope)
- [ ] Finalize game design document
- [ ] Set up UE5 project with C++ module structure
- [ ] Establish AI tool accounts & pipelines

### Phase 2: Minimum Viable Ship (Single Sector Prototype)

> **Goal:** One sector, one ship, core loop working. Fun to play solo.

- [ ] Ship movement — flight, boost dash, basic traversal in 3D space
- [ ] Basic combat — primary weapon + mining laser
- [ ] Asteroid Belt sector with procedural node-map generation
- [ ] Hull + Profession selection screen (Interceptor/Corvette × Fighter/Miner)
- [ ] 3–5 drone/fighter enemies
- [ ] 1 boss fight (pirate captain or void entity)
- [ ] Mining mechanic — mine asteroids for minerals
- [ ] Basic Tech Card selection on level-up (5–10 cards)
- [ ] Run loop — choose loadout, play, die, restart
- [ ] Cartoonish art style applied to all prototype assets

### Phase 3: Co-op & Core Systems

> **Goal:** Get 4-player co-op working with the prototype content.

- [ ] Networking — host/join, replication, RPCs
- [ ] Co-op camera and player management
- [ ] Revive system
- [ ] Difficulty scaling for player count
- [ ] 3-currency system (Minerals, Research Data, Power Cores)
- [ ] Station systems — trade, upgrade, craft
- [ ] 20+ Tech Cards and module upgrades
- [ ] Meta-progression (basic unlock loop)

### Phase 4: Content Expansion

> **Goal:** Multiple sectors, full enemy roster, deep item pool, all hulls and professions.

- [ ] 3 complete sectors with unique mechanics (Asteroid Belt, Nebula, Derelict Graveyard)
- [ ] 50+ Tech Cards and module upgrades
- [ ] All 6 ship hulls with unique abilities
- [ ] All 5 professions with phase-based gameplay
- [ ] Boss encounters for each sector
- [ ] Achievement-based unlock progression system

### Phase 5: Polish & Audio

- [ ] AI-generated music for each sector + boss themes
- [ ] Sound effects for all ship actions, weapons, mining, and abilities
- [ ] VFX and particle polish (laser trails, shield flashes, mining sparks, warp effects)
- [ ] UI/UX polish — hull/profession select screen, sector map, HUD, upgrade screens
- [ ] Ship animation pass — engine glow, drift, damage states

### Phase 6: Testing & Release

- [ ] Playtesting and balancing (solo + co-op)
- [ ] Performance optimization
- [ ] Steam store page and marketing
- [ ] Early Access release

---

## Next Steps

> [!IMPORTANT]
> **Immediate action items after this plan is approved:**
>
> 1. Create a detailed Game Design Document (separate file) with specific numbers for damage, health, scaling curves
> 2. Set up the UE5 project with C++ module structure and networking enabled
> 3. Create accounts for key AI tools (Tripo AI, AIVA, Meshy)
> 4. Generate concept art for ship hulls (Interceptor, Corvette) in cartoonish style
> 5. Begin prototyping ship flight + boost dash mechanics in C++
> 6. Design the Hull × Profession selection screen UI

---

## Confirmed Decisions Log

| Decision        | Choice                                                            | Date       |
| --------------- | ----------------------------------------------------------------- | ---------- |
| Perspective     | Third-person                                                      | 2026-02-21 |
| Multiplayer     | 1–4 player co-op                                                  | 2026-02-21 |
| Art Style       | Cartoonish (Mario / Zelda inspired)                               | 2026-02-21 |
| Scope Strategy  | Start small — one sector prototype first                          | 2026-02-21 |
| Theme           | Spaceman pilot + upgradeable spaceships                           | 2026-02-25 |
| Ship System     | 6 Hulls × 5 Professions (30 combos)                               | 2026-02-25 |
| Pacing          | Slower runs (~40-60 min), FTL-style                               | 2026-02-25 |
| Currencies      | Minerals, Research Data, Power Cores, Warp Crystals               | 2026-02-25 |
| Unlocks         | Achievement-based hull/profession unlock                          | 2026-02-25 |
| Navigation      | 2D hex grid, jump to center of galaxy                             | 2026-02-25 |
| Fuel            | Warp Crystals = scaling jump cost (3/8/18/30)                     | 2026-02-25 |
| Jump Range      | Per-hull stat (1-3), Phantom=3 Juggernaut=1                       | 2026-02-25 |
| Sectors         | Environment × Encounter two-axis generation                       | 2026-02-25 |
| Environments    | 8 types (4 Common, 2 Uncommon, 1 Rare, 1 Legendary)               | 2026-02-25 |
| Encounters      | 8 types (Clear, Mining, Raid, Research, Escape, etc)              | 2026-02-25 |
| Stations        | Shipyard, Trade Post, Research Lab, Black Market                  | 2026-02-25 |
| Installation    | Loot → Cargo Hold → Install at Shipyard only                      | 2026-02-25 |
| Scaling         | Enemies + loot + warp cost all scale per ring                     | 2026-02-25 |
| Luck Stat       | Hidden stat (0-100+) affecting all RNG in game                    | 2026-02-25 |
| Proc Chains     | On-kill/hit/crit/mine effects chain multiplicatively              | 2026-02-25 |
| Gambling        | Black Market slots, cursed items, sacrifice altars                | 2026-02-25 |
| Bosses          | 6 ring-scaled bosses + 4-phase Shatter Core final                 | 2026-02-25 |
| Boss Frequency  | 2–3 boss sectors per run, not every sector                        | 2026-02-25 |
| Upgrades        | 3-category system: Weapons + Ship Modules + Specialty             | 2026-02-25 |
| Weapons         | 8 primary + 6 secondary types, 6 rarity tiers                     | 2026-02-25 |
| Ship Modules    | Stackable stat boosts (books), 3-6 slots by hull                  | 2026-02-25 |
| Specialty       | Profession tools, 1-2 slots by hull, very powerful                | 2026-02-25 |
| Rank-Up System  | Duplicate finds = instant rank up (★/★★/★★★)                      | 2026-02-25 |
| Hull Slots      | Per-hull slot breakdown: Wpn/Mod/Spec varies                      | 2026-02-25 |
| Loadout Unlock  | Find weapon in-run → permanently unlock as starter                | 2026-02-25 |
| Meta-Prog       | Content-unlock only — no permanent power buffs                    | 2026-02-25 |
| Toggle Pool     | Turn unlocked items on/off to curate run drop pools               | 2026-02-25 |
| In-Run RD       | Reroll/Ban/Mulligan/Targeted Pull mid-run for RD cost             | 2026-02-25 |
| Cosmetics       | Ship skins, trails, paint, outfits via Research Data              | 2026-02-25 |
| RD Economy      | Earn in-run (100-300), spend now vs save tension                  | 2026-02-25 |
| Events          | 22 events across 5 categories, every sector has one               | 2026-02-25 |
| Event Choices   | 3 player choices per event + profession bonus option              | 2026-02-25 |
| RD Scaling      | In-run RD actions ×2 cost per use (anti-cheese)                   | 2026-02-25 |
| Audio Style     | Arcade/MIDI × EDM hybrid, AI-generated, adaptive                  | 2026-02-25 |
| Music System    | Layer-based adaptive music, ring-based tempo/key shift            | 2026-02-25 |
| Hub UI          | Diegetic Outer Rim Station — no traditional menus                 | 2026-02-25 |
| Station Areas   | 8 areas (Dock/Armory/Lab/Cosmetic/Mission/Trophy/etc)             | 2026-02-25 |
| Stations        | 4 in-run station types with full menus and pricing                | 2026-02-25 |
| Shipyard        | Install/swap/scrap/repair/refit — the build workshop              | 2026-02-25 |
| Trade Post      | Buy/sell/bounties — Hauler gets +30% sell prices                  | 2026-02-25 |
| Research Lab    | Analyze/enhance/fuse/scan — Scientist gets 30% off                | 2026-02-25 |
| Black Market    | Contraband/cursed/slots/fence — raid timer mechanic               | 2026-02-25 |
| Drone Flock     | Carrier uses Boids flocking AI — drones orbit + auto-engage       | 2026-02-25 |
| Drone Types     | 5 drone kits via weapon slot (Combat/Beam/Missile/Tesla/Stealth)  | 2026-02-25 |
| Organic Hull    | Mutation cut — Regeneration only (passive HP heal)                | 2026-02-25 |
| Enemy System    | 6 base chassis + procedural trait layering = modular enemies      | 2026-02-25 |
| Enemy Traits    | 7 movement + 8 attack + 7 defense + 8 special + visual decor      | 2026-02-25 |
| Wave Budget     | Budget-based spawning — points scale by ring (6-50+ per wave)     | 2026-02-25 |
| Env Bias        | Each environment biases trait rolls for thematic enemy feel       | 2026-02-25 |
| Neutral Ships   | 7 neutral entity types (miners, convoys, piñatas, tankers, etc)   | 2026-02-25 |
| Loot Piñata     | Timed chase encounter (8-12s) with Bronze/Silver/Gold tiers       | 2026-02-25 |
| Wanted System   | Pirating neutrals → bounty hunters, station price penalties       | 2026-02-25 |
| Difficulty      | Hades-style Heat system — 12 toggleable modifiers, 64 max Heat    | 2026-02-25 |
| Catalog         | Design docs split into 13 design + 2 technical files              | 2026-02-25 |
| Stats/Boards    | Run summaries, career stats, leaderboards, dev analytics          | 2026-02-25 |
| Catalog Pillars | Docs grouped by pillar: Foundation/Gameplay/Items/World/Pres/Data | 2026-02-25 |
| Lore            | Avorion-inspired mystery — Breach, Shattering, Breach-born        | 2026-02-25 |
| Run Goal        | 3 Resonance Shards across runs → unlock Breach Run finale         | 2026-02-25 |
| Final Boss      | The Warden (penultimate) + The Architect (Breach entity)          | 2026-02-25 |
| Loop+ Narrative | The Echo — Architect fragment persists, justifies NG+ difficulty  | 2026-02-25 |
| Enemy Visual    | Jellyfish ooze parasite — purple-to-red corruption gradient       | 2026-02-25 |
| Artifacts       | Unnamed alien Glyphs with shifting symbols — grant passage        | 2026-02-25 |
| VFX Style       | Astroneer × Crab Champions × No Man's Sky hybrid                  | 2026-02-25 |
| Movement        | Arcade drift hybrid — twin-stick, momentum + drag, instant aim    | 2026-02-25 |
| MVP Scope       | 5 milestones, ~14 weeks to co-op playable prototype               | 2026-02-25 |
