# 🎯 Prototype & MVP Scope

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **Build the smallest thing that proves the game is fun.** Every system in the full design catalog is irrelevant until a player can fly a ship, shoot enemies, pick up loot, and want to do it again. This document defines the minimum playable slice from zero to co-op-ready.

---

## MVP Philosophy

The MVP is built in **5 layered milestones**. Each one is playable on its own and adds a complete system on top of the previous one. No milestone depends on content that doesn't exist yet — every milestone is testable the moment it's done.

```
M1: Ship Flies          → "Can I move and shoot?"
M2: Combat Works        → "Is fighting fun?"
M3: Run Structure       → "Does the loop feel like a game?"
M4: Progression Feels   → "Do I want to play again?"
M5: Co-op Joins         → "Is it better with friends?"
```

---

## Milestone 1 — Ship Flies (Weeks 1–2)

**Goal:** A ship in an empty arena that moves, aims, and shoots. The foundation everything else builds on.

### What to Build

| System         | Spec                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Ship**       | Interceptor hull only — balanced speed/HP, no special ability yet                                                      |
| **Movement**   | Twin-stick: left stick/WASD = thrust, right stick/mouse = aim. See [controls doc](../design/15_controls_and_camera.md) |
| **Camera**     | Top-down, ~45° tilt, follows ship with slight lag. Zoom out when boosting                                              |
| **One weapon** | Pulse Cannon (primary) — rapid-fire projectiles, no rarity, no upgrades                                                |
| **Boost**      | Short dash on cooldown (Shift / bumper)                                                                                |
| **Arena**      | One static arena — asteroid field with floating rocks for cover                                                        |
| **Collision**  | Ship bounces off asteroids, takes minor damage                                                                         |
| **Health bar** | Simple HP number on HUD — no shields yet                                                                               |

### Done When

- [ ] Ship feels responsive and satisfying to fly
- [ ] Shooting feels punchy (screen shake, muzzle flash, impact particles)
- [ ] Boosting has "juice" (trail, slight zoom, speed burst)
- [ ] Asteroids break into fragments when shot

### Art Level

- Placeholder ship mesh (box or free asset)
- Placeholder asteroid meshes (UE5 basic shapes or AI-generated)
- Particle effects for shots and impacts (Niagara — Astroneer-style clean, bright)

---

## Milestone 2 — Combat Works (Weeks 3–5)

**Goal:** Add enemies, damage, death, and drops. Answer the question: _is the core combat fun?_

### What to Build

| System             | Spec                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **3 enemy types**  | Drone (swarm), Striker (fast), Bomber (slow, AoE) — from [enemy catalog](../design/06_enemy_catalog.md) |
| **Enemy AI**       | Simple behaviors: Drone = chase, Striker = strafe + shoot, Bomber = approach + explode                  |
| **Damage system**  | HP + Shields. Shields regen after delay. Damage types: Kinetic, Energy (2 only)                         |
| **Enemy spawning** | Wave-based: small → medium → large wave, then calm period                                               |
| **Loot drops**     | Enemies drop Minerals (currency) + chance of weapon pickup                                              |
| **Weapon pickups** | 3 weapons total: Pulse Cannon, Spread Shot, Beam Laser — Common rarity only                             |
| **Weapon swap**    | Pick up new weapon → replaces current primary. No inventory yet.                                        |
| **Death**          | Ship explodes → "Run Failed" screen → restart in same arena                                             |
| **Kill feedback**  | Explosion VFX, screen shake, XP/mineral pop-up numbers                                                  |

### New Systems

| System             | Details                                                    |
| ------------------ | ---------------------------------------------------------- |
| **Damage numbers** | Floating numbers on hit (white = normal, yellow = crit)    |
| **Hit flash**      | Enemy flashes white on damage                              |
| **Shield visual**  | Blue bubble around ship, cracks when low, pops when broken |
| **Minimap**        | Small radar showing enemy positions                        |

### Done When

- [ ] Fighting 3 enemy types feels distinct (each requires different approach)
- [ ] Dying feels fair ("I should have dodged that")
- [ ] Weapon pickups change how you play (spread shot = close range, beam = precise)
- [ ] Wave pacing feels good (tension → release → tension)
- [ ] Player wants to try again after dying

### Art Level

- AI-generated enemy meshes (simple ship shapes + faint purple glow for corruption)
- Weapon VFX: Crab Champions-inspired punchy impacts
- Explosion VFX: Astroneer-style colorful particle bursts

---

## Milestone 3 — Run Structure (Weeks 6–8)

**Goal:** Multiple sectors, a map, a station, and a complete run from start to finish. This is where it becomes a _game_.

### What to Build

| System                | Spec                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| **Galaxy map**        | 5 sectors in a simple linear chain (no hex grid yet). Player picks next sector from 2 choices |
| **Sector types**      | 3 sector types: Combat (waves), Mining (asteroids + enemies), Station                         |
| **Sector enter/exit** | Fly to jump gate at edge of sector → transition → load next sector                            |
| **Station**           | One station type: Shipyard — install weapons, repair hull for Minerals                        |
| **Cargo hold**        | Weapons picked up go to cargo (3 slots). Install at Shipyard to equip.                        |
| **Boss**              | One boss at sector 5 — larger enemy with 2 phases (shield phase → attack phase)               |
| **Run end**           | Beat boss = "Run Complete" screen. Die = "Run Failed" screen. Both → restart                  |
| **Sector HUD**        | Sector name, ring indicator, jump prompt                                                      |
| **Environment**       | One environment type: Asteroid Field. Varies in density per sector.                           |
| **Events (1)**        | One event encounter: "Distress Signal" — help stranded ship for Mineral reward or ignore      |

### New Systems

| System             | Details                                                        |
| ------------------ | -------------------------------------------------------------- |
| **Sector map UI**  | Simple node graph showing current position + available sectors |
| **Station UI**     | Menu: Install weapons from cargo, Repair hull, Leave station   |
| **Cargo UI**       | Grid showing 3 cargo slots, drag to install                    |
| **Run timer**      | Display current sector # of 5 and Minerals collected           |
| **Upgrade rarity** | Introduce Uncommon rarity (green) for station loot             |

### Done When

- [ ] Playing through a 5-sector run feels like a complete experience
- [ ] Choosing sectors feels meaningful (combat vs mining vs station)
- [ ] Station visits feel like meaningful decisions (repair vs save Minerals?)
- [ ] Boss fight is a satisfying climax
- [ ] Player wants to start another run immediately after finishing

### Art Level

- Station: simple 3D model or 2D sprite placeholder
- Sector transitions: warp effect (stretch + flash)
- Boss: scaled-up enemy with distinct silhouette + red corruption glow
- Map UI: functional node graph (polish later)

---

## Milestone 4 — Progression Feels (Weeks 9–11)

**Goal:** Add meta-progression, more content variety, and the "one more run" hook. This is where it becomes a _roguelite_.

### What to Build

| System                 | Spec                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| **Research Data (RD)** | Second currency earned per-run. Kept on death. Spent at Hub.              |
| **Hub station**        | Simple menu between runs: spend RD to unlock new weapons in the drop pool |
| **Unlock system**      | 3 more weapons unlockable via RD: Missile Launcher, Tesla Coil, Railgun   |
| **Toggle pool**        | Unlocked weapons can be turned on/off for future run drop pools           |
| **Hex grid map**       | Replace linear chain with proper 2D hex grid (3 rings, ~12 sectors)       |
| **Jump Range**         | Implement jump range mechanic (Interceptor = 2 range)                     |
| **Warp Crystals**      | Fuel currency for jumps — scaling cost per ring                           |
| **2nd hull**           | Add Gunship hull (slower, more weapons, more HP)                          |
| **1 profession**       | Add Miner profession (+mining yield, mineral magnet)                      |
| **3 more enemies**     | Add Tank, Artillery, Carrier chassis types                                |
| **2 more events**      | Add "Derelict Ship" and "Asteroid Jackpot" events                         |
| **Environment #2**     | Add Nebula environment (reduced visibility, energy damage zones)          |
| **Item rarity**        | Full rarity tiers: Common → Uncommon → Rare → Epic (no Legendary yet)     |

### Done When

- [ ] Between-run decisions matter (what to unlock, what to toggle)
- [ ] Hex grid navigation creates interesting route choices
- [ ] Gunship feels meaningfully different from Interceptor
- [ ] Miner changes how you play (prioritize mining sectors)
- [ ] Player has enough variety to do 10+ runs without repetition

### Art Level

- Hub: minimal UI menu (no 3D station yet)
- Hex grid: functional 2D map with sector icons
- Gunship mesh: AI-generated, distinct silhouette from Interceptor
- Two environments with distinct color palettes and hazards

---

## Milestone 5 — Co-op Joins (Weeks 12–14)

**Goal:** A second player can join, play together, and enjoy the full loop cooperatively.

### What to Build

| System               | Spec                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| **Networking model** | UE5 Listen Server — one player hosts, others join. No dedicated server yet.      |
| **Lobby**            | Simple lobby: host creates game, friend joins via invite/code                    |
| **Shared galaxy**    | Both players in same sector, same map, same enemies                              |
| **Separate loot**    | Each player sees their own loot drops (instanced loot)                           |
| **Revive**           | Downed player can be revived by flying near them within 15s                      |
| **Co-op scaling**    | More enemies per wave (+50% budget per extra player)                             |
| **Station sync**     | Both players use station independently, run continues when both are ready        |
| **Camera**           | Each player has independent camera (split view on same screen? no — online only) |
| **2-player tested**  | Scope to 2 players for MVP. 3-4 player support added after stability proven.     |

### Done When

- [ ] Two players can complete a full run together without desyncs
- [ ] Revive mechanic creates cooperative tension
- [ ] Enemy scaling feels fair for 2 players
- [ ] Lobby join/leave works cleanly
- [ ] More fun with a friend than alone

### Art Level

- Player 2 gets a color-shifted ship (blue vs orange)
- Revive: downed player has pulsing ring indicator

---

## MVP Content Summary

| Category         | M1  | M2  | M3  | M4             | M5 (Co-op) |
| ---------------- | --- | --- | --- | -------------- | ---------- |
| **Hulls**        | 1   | 1   | 1   | 2              | 2          |
| **Professions**  | 0   | 0   | 0   | 1              | 1          |
| **Weapons**      | 1   | 3   | 3   | 6              | 6          |
| **Enemies**      | 0   | 3   | 3   | 6              | 6          |
| **Environments** | 1   | 1   | 1   | 2              | 2          |
| **Sectors/run**  | 1   | 1   | 5   | ~12 (hex grid) | ~12        |
| **Events**       | 0   | 0   | 1   | 3              | 3          |
| **Bosses**       | 0   | 0   | 1   | 1              | 1          |
| **Stations**     | 0   | 0   | 1   | 1 + Hub        | 1 + Hub    |
| **Players**      | 1   | 1   | 1   | 1              | 2          |

---

## What's NOT in the MVP

These systems exist in the full design but are intentionally excluded from the prototype. They get added incrementally after M5:

| System                      | When to Add                                       |
| --------------------------- | ------------------------------------------------- |
| Hull abilities              | After M5 — needs balance testing                  |
| Carrier drones              | After all 6 hulls are in                          |
| Difficulty/Heat system      | After core loop is proven fun                     |
| All 6 hulls / 5 professions | Gradually after M4                                |
| Full weapon catalog         | Gradually after M4                                |
| Station types (4)           | After M5 — Trade Post, Research Lab, Black Market |
| Event catalog (22)          | Gradually after M3                                |
| Glyph / Breach Run          | Late production — needs full content              |
| Statistics/leaderboards     | After M5                                          |
| Audio (adaptive music)      | After M3 — needs sector flow                      |
| Full hex grid (5 rings)     | After M4 proves 3-ring loop                       |
| Lore fragments              | After M3 — needs content pipeline                 |
| 3-4 player co-op            | After M5 proves 2-player stability                |

---

## Tech Stack for MVP

| Layer            | Tool                                                       |
| ---------------- | ---------------------------------------------------------- |
| **Engine**       | Unreal Engine 5.5 (C++ primary, Blueprint for prototyping) |
| **Networking**   | UE5 Replication + Listen Server (built-in)                 |
| **UI**           | UMG (UE5 native) for all menus and HUD                     |
| **VFX**          | Niagara particle system                                    |
| **AI**           | UE5 Behavior Trees for enemy AI                            |
| **Audio**        | MetaSounds for adaptive audio (placeholder tracks)         |
| **3D Assets**    | AI-generated (Tripo/Meshy) + manual cleanup                |
| **Code Gen**     | AI-assisted (Antigravity + Copilot) for C++ and BP         |
| **Version Ctrl** | Git + Git LFS for binaries                                 |
