# 👾 Enemy Catalog — Modular Enemy System

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. Design Philosophy

> [!IMPORTANT]
> **6 base chassis × 5 trait layers × 4 difficulty tiers = hundreds of unique enemies from minimal art assets.** Each chassis is a single 3D model. Traits are layered on procedurally — visual FX, behavior mods, stat multipliers. The system generates variety without a massive art team.

| Principle                  | Details                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Modular over bespoke**   | 6 chassis models, not 60 unique enemies. Traits make each feel different                                      |
| **Readable at a glance**   | Trait visuals (glow color, particle effect, size) telegraph behavior. Players learn the "language" of enemies |
| **Scales with difficulty** | Higher rings = more traits stacked per enemy + higher tier base stats                                         |
| **Environment-biased**     | Certain traits appear more in certain environments (fire traits in supernova, ice in ice fields)              |
| **Budget-based spawning**  | Each sector has a "budget" — spawner spends points on chassis + traits to build a varied wave                 |

---

## 2. Base Chassis Models (6 total)

Each chassis defines the **silhouette, base HP, speed, and attack pattern**. Think of these as the "skeleton" — traits are the "skin."

| Chassis        | Silhouette          | Base HP | Speed     | Base Attack           | Role              |
| -------------- | ------------------- | ------- | --------- | --------------------- | ----------------- |
| 🔴 **Drone**   | Small, insectoid    | Low     | Fast      | Ram / weak laser      | Swarm fodder      |
| 🟡 **Fighter** | Medium, angular     | Medium  | Medium    | Twin lasers           | Bread and butter  |
| 🟢 **Bomber**  | Bulky, rear-heavy   | Medium  | Slow      | Explosive payload     | Area denial       |
| 🔵 **Tank**    | Large, armored      | High    | Very Slow | Heavy cannon          | Frontline bruiser |
| 🟣 **Support** | Slim, antenna-heavy | Low     | Medium    | Heal beam / buff aura | Force multiplier  |
| ⚫ **Stealth** | Sleek, minimal      | Low     | Fast      | Backstab burst        | Ambush predator   |

> **Art requirement: 6 models total.** Each gets color variations, glow attachments, and scale differences via traits. A "Fire Drone" vs an "Ice Drone" is the same mesh with different particle effects and color.

---

## 3. Trait System (5 Layers)

Each enemy spawns with **1–3 traits** depending on difficulty tier. Traits stack and combine — a Fire + Armored + Pack fighter is a very different threat than a basic Fighter.

### Layer 1: Movement Traits

| Trait       | Effect                                         | Visual Cue                         |
| ----------- | ---------------------------------------------- | ---------------------------------- |
| **Flanker** | Circles to attack from behind                  | Afterburner trail                  |
| **Charger** | Rushes straight at player then retreats        | Red engine glow, wind-up sound     |
| **Orbiter** | Maintains distance, strafes while firing       | Concentric ring trail              |
| **Blinker** | Short-range teleport every few seconds         | Phase distortion shimmer           |
| **Pack**    | Moves in tight formation with 2–3 others       | Tether lines between pack          |
| **Stalker** | Hangs back until player is low HP, then rushes | Dim, almost invisible until moving |

### Layer 2: Attack Traits

| Trait          | Effect                                  | Visual Cue                      |
| -------------- | --------------------------------------- | ------------------------------- |
| **Fire**       | Shots apply burning DoT                 | Orange glow, flame particles    |
| **Ice**        | Shots slow player movement + fire rate  | Blue glow, frost particles      |
| **Explosive**  | Shots have small AoE on impact          | Yellow glow, unstable sparking  |
| **Homing**     | Projectiles track the player slightly   | Green spiraling trail           |
| **Rapid-Fire** | 2× attack speed, lower per-hit damage   | Barrel glow, chattering sound   |
| **Sniper**     | Very long range, high damage, slow fire | Laser sight line, charging glow |

### Layer 3: Defense Traits

| Trait            | Effect                                        | Visual Cue                     |
| ---------------- | --------------------------------------------- | ------------------------------ |
| **Armored**      | 50% damage reduction from front               | Visible armor plating mesh     |
| **Shielded**     | Regenerating energy shield (must break first) | Bubble shield effect           |
| **Regenerator**  | Slowly heals HP over time                     | Green pulse glow               |
| **Reflector**    | 15% chance to reflect projectiles back        | Mirror-chrome surface          |
| **Phase**        | Briefly invulnerable during movement          | Ghost/translucent during dodge |
| **Swarm-Shield** | Takes less damage while near allies (stacks)  | Connected particle web         |

### Layer 4: Special Traits

| Trait         | Effect                                               | Visual Cue                          |
| ------------- | ---------------------------------------------------- | ----------------------------------- |
| **Splitter**  | On death, splits into 2 smaller versions             | Cracked surface texture             |
| **Detonator** | Explodes on death dealing AoE damage                 | Pulsing red core                    |
| **Summoner**  | Periodically spawns tiny drones (1–2 at a time)      | Antenna pulsing, drone bay opening  |
| **Enraged**   | Below 30% HP: +50% damage, +30% speed                | Red glow intensifies at low HP      |
| **Vampiric**  | Attacking heals 5% of damage dealt                   | Dark purple energy siphoning effect |
| **Shaman**    | Buffs nearby allies (+20% damage, +10% speed for 5s) | Wave pulse emitting from chassis    |

### Layer 5: Visual/Flavor Traits (cosmetic + minor effect)

| Trait          | Effect                         | Visual                            |
| -------------- | ------------------------------ | --------------------------------- |
| **Oversized**  | 1.5× larger, +25% HP           | Scaled-up model                   |
| **Miniature**  | 0.7× size, +20% speed          | Tiny version, hard to hit         |
| **Elite Glow** | +All stats 15%                 | Golden particle aura              |
| **Corrupted**  | Erratic behavior, bonus damage | Void-corruption visual distortion |
| **Ancient**    | Slow but very high HP + damage | Weathered, barnacle-like overlays |

---

## 4. Difficulty Tiers

| Tier       | Traits Stacked | Stat Multiplier | Ring Appearance   | Budget Cost |
| ---------- | -------------- | --------------- | ----------------- | ----------- |
| ★ Normal   | 0–1 traits     | 1.0×            | Outer Ring        | 1 point     |
| ★★ Veteran | 1–2 traits     | 1.5×            | Mid Ring          | 2 points    |
| ★★★ Elite  | 2–3 traits     | 2.5×            | Inner Ring        | 4 points    |
| ★★★★ Apex  | 3 traits       | 4.0×            | Core / Loop+ only | 8 points    |

> **Apex enemies** are essentially mini-bosses — a ★★★★ Tank with Armored + Shielded + Summoner is a legitimate threat that demands team coordination.

---

## 5. Wave Budget System

Each encounter has a **spawn budget** based on the ring and encounter type:

| Ring      | Budget per Wave | Waves | Total Budget | Example Wave Composition                                                                                      |
| --------- | --------------- | ----- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| **Outer** | 6               | 2–3   | 12–18        | 6× Normal Drones (6 pts) → 2× Normal Fighters + 2× Normal Drones (6 pts)                                      |
| **Mid**   | 10              | 3–4   | 30–40        | 4× Normal Fighters + 1× Veteran Bomber (6+2=8 pts) → 2× Veteran Fighters + 1× Normal Tank (4+2=6 pts rounded) |
| **Inner** | 16              | 3–5   | 48–80        | 2× Elite Fighters + 2× Veteran Drones (8+4=12 pts) → 1× Apex Tank + 4× Normal Drones (8+4=12 pts)             |
| **Core**  | 24              | 5+    | 120+         | Boss + Elite support waves. Budget is "until you die or win"                                                  |

### Composition Rules

| Rule                            | Details                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| **Always include fodder**       | At least 30% of budget spent on Normal-tier enemies (satisfying to kill) |
| **Max 1 Apex per wave**         | Apex enemies are mini-bosses — one at a time                             |
| **Support enemies need allies** | Support chassis only spawn alongside 2+ other enemies                    |
| **Stealth enemies spawn last**  | Stealth chassis enter mid-wave to ambush distracted players              |
| **Ramp up within a sector**     | Wave 1 is easier than Wave 3. The last wave is the hardest               |

---

## 6. Environment Bias Tables

Certain environments make certain traits more likely to appear:

| Environment              | Boosted Traits                      | Suppressed Traits    | Signature Combo                                   |
| ------------------------ | ----------------------------------- | -------------------- | ------------------------------------------------- |
| ⛏️ **Asteroid Field**    | Armored, Charger, Pack              | Stealth (open space) | Armored Charger Tanks that ram through rocks      |
| 🌫️ **Nebula**            | Stalker, Blinker, Phase             | Sniper (low vis)     | Phase Blinker Stealth units — ambush nightmare    |
| 💥 **Debris Field**      | Explosive, Detonator, Splitter      | Orbiter (debris)     | Detonator Bombers that chain-explode near wrecks  |
| 🧊 **Ice Field**         | Ice, Regenerator, Ancient           | Fire (cold)          | Ice Ancient Tanks — slow walls of frost           |
| 🌊 **Gas Giant Rings**   | Fire, Rapid-Fire, Flanker           | Armored (gas)        | Fire Rapid-Fire Fighters — dakka hell             |
| 🌋 **Supernova Remnant** | Fire, Enraged, Elite Glow           | Ice (hot)            | Enraged Elite Fighters under supernova timer      |
| 🕳️ **Void Rift**         | Corrupted, Blinker, Phase, Vampiric | Pack (chaos)         | Corrupted Phase Vampiric Stealth — nightmare fuel |

> **Bias doesn't prevent — it weights.** You can still get Ice enemies in a Supernova, it's just rare. Bias makes environments FEEL different — Nebula encounters are spooky ambushes, Supernova encounters are frantic fire-soaked chaos.

---

## 7. Example Generated Enemies

| Ring  | Chassis | Traits                        | Tier    | Description                                                  |
| ----- | ------- | ----------------------------- | ------- | ------------------------------------------------------------ |
| Outer | Drone   | Pack                          | Normal  | A cluster of 4 drones that swarm together. Easy to AoE       |
| Outer | Fighter | _(none)_                      | Normal  | Basic fighter. Shoot it. It dies. Tutorial enemy             |
| Mid   | Bomber  | Fire, Explosive               | Veteran | Drops burning explosive payloads. Stay mobile                |
| Mid   | Support | Shaman, Shielded              | Veteran | Shields itself while buffing allies. Priority target         |
| Inner | Tank    | Armored, Regenerator, Enraged | Elite   | Tanky, heals, then goes berserk at low HP. Needs focus fire  |
| Inner | Stealth | Blinker, Vampiric             | Elite   | Teleports in, drains your health, teleports out. Infuriating |
| Core  | Fighter | Fire, Rapid-Fire, Elite Glow  | Apex    | Golden elite fighter spraying fire bullets. Mini-boss energy |
| Loop+ | Tank    | Armored, Shielded, Summoner   | Apex    | Armored shield tank that spawns drones. Full team required   |

---

## 8. Neutral & Special Entities

### Neutral Ship Types

Not everything in space wants to kill you. Neutral ships add **player choice** — trade with them, ignore them, or pirate them (consequences apply).

| Ship Type              | Behavior                           | Interaction Options                                                                       |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| 🚢 **Mining Barge**    | Slowly mines asteroids, no weapons | Trade minerals (good rates), leave alone, or attack for loot (increases Wanted)           |
| 📦 **Trade Convoy**    | Moves between stations, escorted   | Trade goods at convoy prices (mid-tier), escort for reward, or raid for cargo (Wanted +2) |
| 🔬 **Research Vessel** | Stations near anomalies, scanning  | Share data (get Research Data), buy tech cards, or steal research (Wanted +1, RD reward)  |
| 🚑 **Medical Frigate** | Drifts slowly, broadcasts aid      | Free hull repair (50%), buy healing items, or strip for medical supplies (Wanted +1)      |
| 🏴‍☠️ **Pirate Scout**    | Patrols, flees if outgunned        | Ignore, destroy for bounty, or hack its comms for intel (Scout option)                    |
| ⚓ **Derelict Hauler** | Adrift, no power                   | Salvage for cargo (random loot table), or tow to nearest station for finder's fee         |

### 🐿️ Loot Piñata — Chase Encounter

A **rare event** (<5% per sector) — a small, fast, loot-stuffed ship warps into the sector and tries to escape:

| Phase              | Duration | What Happens                                              |
| ------------------ | -------- | --------------------------------------------------------- |
| **1. Appear**      | 0s       | "LOOT PIÑATA DETECTED" alert. Ship spawns at edge         |
| **2. Chase**       | 30s      | Ship flies through sector — dodge obstacles to keep up    |
| **3. Damage**      | 30s      | Deal damage while chasing — each HP threshold drops loot  |
| **4. Escape/Kill** | 60s mark | If alive, it warps out. If killed, massive loot explosion |

**Reward Tiers (based on damage dealt before it escapes):**

| Damage Dealt  | Tier       | Reward                                                |
| ------------- | ---------- | ----------------------------------------------------- |
| <25% HP       | 🥉 Bronze  | 50 minerals + 1 random Common item                    |
| 25–75% HP     | 🥈 Silver  | 150 minerals + 1 Uncommon item + 5 RD                 |
| 75–99% HP     | 🥇 Gold    | 300 minerals + 1 Rare item + 15 RD + 5 Warp Crystals  |
| 100% (killed) | 💎 Diamond | 500 minerals + 1 Epic item + 30 RD + 10 Warp Crystals |

> **Profession Chase Bonuses:**
>
> - **Fighter:** Deals 20% more damage to Piñata
> - **Scout:** Piñata is marked through obstacles
> - **Interceptor hull:** Speed advantage for chasing

---

## 9. The Wanted System

**Pirating neutral ships has consequences.** Attacking non-hostile entities increases your **Wanted Level** — a persistent-per-run heat tracker.

### Wanted Level Effects

| Level   | Name                     | Trigger             | Effect                                                                  |
| ------- | ------------------------ | ------------------- | ----------------------------------------------------------------------- |
| ☆ 0     | **Clean**                | Default             | Normal gameplay, full station access                                    |
| ★ 1     | **Suspect**              | Attack 1 neutral    | Station security scans you on arrival (delay)                           |
| ★★ 2    | **Known Criminal**       | Attack 2–3 neutrals | Station prices +20%, some NPCs refuse to trade                          |
| ★★★ 3   | **Pirate Lord**          | Attack 4–5 neutrals | Bounty hunters spawn in sectors, stations charge +50%                   |
| ★★★★ 4  | **Public Enemy**         | Attack 6+ neutrals  | Constant bounty hunter pursuit, stations may refuse docking             |
| ★★★★★ 5 | **Galaxy's Most Wanted** | Mass piracy         | Everything hostile, but pirate factions offer you jobs + exclusive loot |

### Wanted Decay

| Mechanic               | Effect                                                        |
| ---------------------- | ------------------------------------------------------------- |
| **Time Decay**         | -1 Wanted every 3 sectors (if no new crimes)                  |
| **Bounty Payment**     | Pay minerals at a station to reduce Wanted by 1 (cost scales) |
| **Bounty Hunter Kill** | Killing a bounty hunter sent after you = -1 Wanted            |
| **Faction Missions**   | Complete lawful missions at stations = -1 Wanted              |

### Pirate Faction Benefits (High Wanted)

At ★★★★★ Wanted, you've gone full pirate. This UNLOCKS:

| Benefit                     | Details                                                 |
| --------------------------- | ------------------------------------------------------- |
| **Pirate Station Access**   | Hidden pirate stations appear on map — exclusive shops  |
| **Contraband Market**       | Cursed items, stolen tech, black market specials        |
| **Pirate Escort**           | Pirate scouts stop attacking you, may join fights       |
| **Infamy Bonus**            | +25% loot from all combat kills                         |
| **"The Pirate King" Title** | Cosmetic — displayed on death screen and victory screen |

> [!TIP]
> **The pirate path is intentionally viable.** Going full pirate trades safety (station access, bounty hunters chasing you) for raw power (infamy bonus, pirate-exclusive loot). It's a legitimate alternate playstyle, especially for the Phantom hull ("Pirate" combo) and Interceptor hull ("Smuggler" combo).
