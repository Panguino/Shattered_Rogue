# 🤖 Carrier Drone Flock System

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **The Carrier hull's unique mechanic.** Drones orbit your ship using **flocking AI (Boids)**, auto-engage nearby enemies, and inherit profession-based behaviors. The player doesn't directly control drones — they manage the flock through upgrades and positioning.

---

## 1. Boids Flocking AI

Drones use a classic **Boids** algorithm adapted for space combat:

| Behavior       | Rule                                                                 | Tuning Parameter          |
| -------------- | -------------------------------------------------------------------- | ------------------------- |
| **Separation** | Drones avoid crowding each other                                     | Min drone spacing: 3m     |
| **Alignment**  | Drones roughly face the same direction as their neighbors            | Alignment weight: 0.4     |
| **Cohesion**   | Drones steer toward the average position of their flock              | Cohesion weight: 0.6      |
| **Orbit**      | Flock orbits the player ship in an elliptical pattern                | Orbit radius: 8–15m       |
| **Engagement** | When enemies enter range, drones break orbit to attack               | Engagement range: 25m     |
| **Return**     | After target is dead, drones return to orbit formation               | Return speed: 1.5× normal |
| **Avoidance**  | Drones dodge obstacles (asteroids, debris) while orbiting or chasing | Avoidance weight: 0.8     |

### Flock Parameters

| Parameter            | Base Value     | Modified By                                             |
| -------------------- | -------------- | ------------------------------------------------------- |
| **Flock Size**       | 2 drones       | Upgrades, modules, items (max ~6 base, more with items) |
| **Orbit Radius**     | 8m (tight)     | Can be expanded to 20m with modules                     |
| **Engagement Range** | 25m            | Scout profession → 35m (recon drones)                   |
| **Drone Speed**      | 80% of player  | Can exceed player speed with upgrades                   |
| **Drone HP**         | 15% of carrier | Drones die if HP depleted, respawn at station           |
| **Drone DPS**        | 20% of player  | Each drone does 20% of player weapon DPS                |

> **The fantasy:** 4–6 drones orbiting your Carrier in a tight formation, then scattering outward to swarm an enemy — then snapping back to orbit when the fight's over. It should feel like commanding a pack of loyal war machines.

---

## 2. Drone Types (4 chassis)

Drones come in 4 types. The Carrier starts with **Attack Drones** and unlocks others through modules and specialties:

| Type                | Role         | Behavior                                      | Base DPS   | Special                                 |
| ------------------- | ------------ | --------------------------------------------- | ---------- | --------------------------------------- |
| ⚔️ **Attack Drone** | Offense      | Engages nearest enemy, fires twin lasers      | 20% player | Standard drone — reliable damage        |
| 🛡️ **Shield Drone** | Defense      | Orbits close, projects shield boost on player | N/A        | +15% shield capacity per drone          |
| ⛏️ **Mining Drone** | Utility      | Auto-mines nearby asteroids while orbiting    | N/A        | Delivers minerals directly to cargo     |
| 🔬 **Recon Drone**  | Intelligence | Scouts ahead, reveals enemies and loot        | N/A        | Marks enemies for +10% damage per drone |

> **Drone type is determined by specialty modules.** Base Carrier gets Attack Drones. Equipping a "Drone Shield Module" converts 1 drone to Shield type. You can mix and match — 3 Attack + 1 Shield + 2 Mining, for example.

---

## 3. Drone Behavior Mods (Specialty Upgrades)

These modify HOW drones behave, not WHAT they are:

| Behavior Mod          | Effect                                                      | Rank ★★★ Effect                             |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| **Aggressive Stance** | Drones engage at 2× range, pursue further                   | 3× range, drones chase until kill           |
| **Defensive Stance**  | Drones stay within 5m, prioritize closest threat to player  | Drones intercept incoming projectiles       |
| **Spread Formation**  | Wider orbit (20m), covers more area                         | 30m orbit, drones act as perimeter sentries |
| **Tight Formation**   | Narrow orbit (5m), focused fire on same target              | 3m orbit, all drones fire at player target  |
| **Kamikaze Protocol** | Drones ram enemies when below 25% HP (self-destruct damage) | Self-destruct at 50% HP, double explosion   |
| **Leash Extension**   | Drones can pursue targets up to 50m from player             | 100m leash — drones become semi-autonomous  |

---

## 4. Profession × Drone Synergies

| Profession       | Drone Behavior                                         | Combo Name      |
| ---------------- | ------------------------------------------------------ | --------------- |
| ⚔️ **Fighter**   | Drones focus-fire player's target, +20% drone damage   | **"Warlord"**   |
| ⛏️ **Miner**     | Mining Drones auto-mine while player fights            | **"Foreman"**   |
| 🔭 **Scout**     | Recon Drones mark all enemies in sector                | **"Spymaster"** |
| 📦 **Hauler**    | Drones auto-collect loot drops, deliver to cargo       | **"Magnate"**   |
| 🔬 **Scientist** | Drones analyze enemies, revealing loot tables for team | **"Professor"** |

---

## 5. Drone Engagement Parameters

```
╔═══════════════════════════════════════════════════════╗
║             DRONE ENGAGEMENT FLOW                    ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  ORBIT STATE (default)                               ║
║  └─ Drones circle player in Boids formation          ║
║     └─ Enemy enters engagement range (25m)?          ║
║        ├─ YES → ENGAGE STATE                         ║
║        │   └─ Drones break orbit                     ║
║        │   └─ Fly toward target (Boids maintained)   ║
║        │   └─ Attack target until dead               ║
║        │   └─ Next target in range? → Re-engage      ║
║        │   └─ No targets? → RETURN STATE             ║
║        │       └─ Fly back to orbit formation        ║
║        └─ NO → Continue orbiting                     ║
║                                                       ║
║  SPECIAL CASES:                                      ║
║  • Player boosts → Drones trail behind, catch up     ║
║  • Player docks → Drones auto-dock, repair           ║
║  • Drone dies → Respawn at next station (costs 25m)  ║
║  • Player cloaks (Phantom) → Drones cloak too       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## 6. Drone-Related Items & Upgrades

| Item                     | Rarity    | Effect                                                             |
| ------------------------ | --------- | ------------------------------------------------------------------ |
| **Drone Bay Expansion**  | Uncommon  | +1 drone to flock (stacks up to 3 times)                           |
| **Drone Armor Plating**  | Uncommon  | Drones gain +50% HP                                                |
| **Drone Speed Booster**  | Uncommon  | Drones move 30% faster                                             |
| **Drone Weapon Upgrade** | Rare      | Drones deal +40% damage                                            |
| **Drone Replicator**     | Rare      | 10% chance on drone kill: duplicate the drone (Luck-scaled)        |
| **Hive Mind Module**     | Epic      | All drones attack the same target simultaneously (focused fire)    |
| **Swarm Intelligence**   | Epic      | Drones gain +5% damage per drone in flock (scales with flock size) |
| **Queen Drone**          | Legendary | One drone becomes a Queen — 2× stats, spawns 1 mini-drone/30s      |
