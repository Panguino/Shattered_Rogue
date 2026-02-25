# ⚔️ Weapons, Upgrades & Scaling

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. Luck, Scaling & Game-Breaking Combos

> [!IMPORTANT]
> **Design philosophy:** The best runs should feel _illegal_. Players should look at their screen and say "there's no way this is intended." But it IS intended. We design the systems so that the math CAN break — and when it does, it's the most fun moment in the game.

### The Luck Stat

**Luck** is a hidden-ish stat (visible in ship stats panel) that affects EVERYTHING random in the game:

| Luck Level  | Effect                                                                              |
| ----------- | ----------------------------------------------------------------------------------- |
| 0–10 (Base) | Normal drop rates, normal crit chance, standard rolls                               |
| 11–25       | Uncommon drops appear more often, crit chance +5%, extra rocks from mining          |
| 26–50       | Rare drops start appearing, crit chance +15%, double loot rolls on kills            |
| 51–75       | Rare/Epic drops common, crit becomes multi-crit, **proc chains** start triggering   |
| 76–99       | Epic/Legendary rain, crits chain into crits, mining yields go exponential           |
| 100+        | **JACKPOT MODE** — the game stops being fair. Everything multiplies everything else |

> Luck starts at 0. You build it through items, events, and profession choices. Most runs end around Luck 15–30. A "lucky" run hits 50+. A game-breaking run hits 100+ and the screen fills with numbers.

### Proc Chain System

**Procs** (programmed random occurrences) are "on X, chance to Y" effects. The magic happens when they chain:

| Proc Type           | Example                                                      | Why It Scales                               |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| **On-Kill**         | "15% chance: killed enemy explodes, damaging nearby enemies" | More kills → more procs → more kills        |
| **On-Hit**          | "10% chance: shot splits into 3 projectiles"                 | More projectiles → more hits → more splits  |
| **On-Crit**         | "Crits have 20% chance to fire a free missile"               | Missiles can also crit → more missiles      |
| **On-Mine**         | "8% chance: asteroid yields 3× minerals"                     | With high luck, you sometimes get 9× or 27× |
| **On-Dodge**        | "When you dodge, 25% chance to drop a mine"                  | Aggressive dodge-play becomes a weapon      |
| **On-Shield-Break** | "Shield breaking releases an EMP blast"                      | Stack shield regen → repeated EMP bursts    |

> **The golden rule:** proc chances are rolled with your Luck stat as a bonus. At Luck 50, a 10% proc becomes ~18%. At Luck 100, it's ~30%. Items START reasonable and become absurd.

---

### Luck Items (Tech Cards, Modules & Artifacts)

#### 🟢 Common Luck Items (small nudges)

| Item                  | Effect                                                      | Why It Matters                                                |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| **Lucky Charm**       | +5 Luck                                                     | Simple stat boost. Stack 3 of these and you're already at 15. |
| **Double Tap**        | 8% chance: shots fire twice                                 | Low chance, but with fast weapons it procs constantly         |
| **Scavenger's Eye**   | +15% drop rate from killed enemies                          | More items = more chances to find MORE luck items             |
| **Miner's Intuition** | Mining has 10% chance to find gemstones (sell for 3× value) | Compounds with Miner profession's 2× yield                    |

#### 🟡 Uncommon Luck Items (noticeable impact)

| Item                       | Effect                                                       | Why It Matters                              |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| **Chain Lightning Module** | Kills have 12% chance to chain lightning to 3 nearby enemies | In swarms, this cascade-kills entire groups |
| **Probability Drive**      | +15 Luck, but -10% max HP                                    | Risk/reward — glass cannon luck build       |
| **Loaded Dice**            | Reroll any Tech Card selection once per level-up             | You're fishing for broken combos            |
| **Magnet Scoop**           | Auto-collect all loot in sector; +20% mineral pickup         | Quality of life + more resources            |

#### 🟠 Rare Luck Items (build-defining)

| Item                    | Effect                                                          | Why It Matters                                         |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| **Recursive Missiles**  | Missiles have 15% chance to spawn 2 smaller missiles on impact  | At high luck, one missile becomes a swarm              |
| **Crit Cascade**        | Critical hits have 25% chance to make next shot guaranteed crit | At high luck, you enter "crit lock" — infinite crits   |
| **Void Siphon**         | On-kill: 5% chance enemy drops a Warp Crystal                   | At high luck with swarm enemies, you get INFINITE fuel |
| **Drone Replicator**    | Carrier drones have 10% chance to duplicate on kill             | Exponential drone swarm. 2 → 4 → 8 → 16 drones         |
| **Lucky Strike Mining** | Every mine hit rolls twice, takes the better result             | With Miner profession, this is absurd yield            |

#### 🟣 Epic Luck Items (these break the game and we WANT that)

| Item                    | Effect                                                                                       | Why It Matters                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Quantum Uncertainty** | +30 Luck. All percentages in the game are doubled for you                                    | 10% proc → 20%. Crits become inevitable                           |
| **The Snowball**        | Every kill in the last 10 seconds increases damage by 3% (stacks infinitely, resets on idle) | Swarm fights → 50+ stacks → you one-shot elites                   |
| **Chaos Engine**        | All proc effects trigger each other                                                          | On-kill procs trigger on-hit procs trigger on-crit procs. Madness |
| **Jackpot Module**      | First kill in each sector has 5% chance to drop a Legendary item                             | At Luck 80+ this is nearly guaranteed                             |

#### 🌟 Legendary Luck Items (run-winners, max 1 per run)

| Item                             | Effect                                                           | Why It Matters                                                         |
| -------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **The Paradox Core**             | Luck stat is doubled. ALL proc chances roll twice.               | This is THE luck item. Everything becomes inevitable                   |
| **Infinite Improbability Drive** | Every 60 seconds, a completely random event occurs (good or bad) | Could spawn 50 drones. Could spawn a boss. Could give you 100 crystals |
| **The Gambler's Curse**          | +50 Luck, but ALL damage you take is multiplied by 1.5×          | You're a glass god — maximum power, paper hull                         |

---

### Game-Breaking Combos (Intentional)

These are combos we _design for_. When players discover them, it should feel like they outsmarted the game:

| Combo Name             | Items Needed                                                      | What Happens                                                                                               |
| ---------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **"The Printer"**      | Drone Replicator + Chain Lightning + Carrier Hull                 | Drones multiply on kill → chain lightning spreads → more kills → more drones. Screen fills with 40+ drones |
| **"Infinite Fuel"**    | Void Siphon + The Snowball + any AoE weapon                       | Kill chains produce so many Warp Crystals you can jump to every sector on the grid                         |
| **"One Punch"**        | Crit Cascade + Quantum Uncertainty + Phantom Cloak (3× first hit) | First shot from cloak = guaranteed crit at 9× damage. One-shots most bosses                                |
| **"The Slot Machine"** | Chaos Engine + Probability Drive + Recursive Missiles             | Every action triggers 4-5 other procs. You stop playing; the game plays itself                             |
| **"Midas Touch"**      | Lucky Strike Mining + Miner Prof + Scavenger's Eye + Magnet Scoop | Mining yields become 10-20× normal. You buy out every station in one visit                                 |

> [!TIP]
> **Design constraint:** These combos require 3–4 specific items to come together. Most runs, you get 1–2 pieces. The rare run where everything aligns is the story you tell your friends about. That's the roguelite magic.

---

### Gambling & Risk Mechanics

| System                 | Where                    | How It Works                                                                         |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| **Black Market Slots** | Black Market stations    | Spend minerals on a slot machine. Rewards range from "nothing" to "Legendary item"   |
| **Cursed Items**       | Black Market, Void Rifts | Powerful items with downsides (more damage but you take more; more luck but less HP) |
| **Double or Nothing**  | Event nodes              | Risk your current cargo for a chance to double it — or lose everything               |
| **The Dice Room**      | Rare event               | Roll dice to determine what happens next. High Luck = weighted in your favor         |
| **Sacrifice Altar**    | Alien Ruins              | Sacrifice a module to get a random upgrade that's 2 tiers higher                     |

> **Cursed items** are key — they let aggressive players gamble on power at the cost of safety. "The Gambler's Curse" (+50 Luck, +1.5× damage taken) is the ultimate expression: you become absurdly powerful but a stiff breeze kills you.

---

## 2. Upgrade System (Megabonk-Inspired)

> [!IMPORTANT]
> All upgrades are organized into **3 clear categories**, each with its own slot system. On level-up, you choose **1 of 3 options** — the options can be from any category. Weapons and modules go to **Cargo Hold** (install at Shipyard); upgrades that enhance existing equipment apply immediately.

### The 3 Upgrade Categories

| Category                  | Symbol                   | What It Covers                                                      | Slot Count          | Install At |
| ------------------------- | ------------------------ | ------------------------------------------------------------------- | ------------------- | ---------- |
| ⚔️ **Weapons**            | Guns, turrets, launchers | Your combat tools — primary + secondary fire                        | 1–4 slots (by hull) | Shipyard   |
| 🛡️ **Ship Modules**       | Stat boosts + passives   | Health, shields, speed, fire rate, armor — stackable stats          | 5–7 slots (by hull) | Shipyard   |
| 🔧 **Specialty Upgrades** | Profession tools         | Mining scanners, combat analyzers, trade rigs — profession identity | 1–3 slots (by hull) | Shipyard   |

> Think of it like Megabonk: **Weapons = your weapon slots**, **Ship Modules = your books/tomes** (passive stat stacking), **Specialty = your class-specific toolkit**. **Every hull gets 10 total slots** — no numerical advantage, just different builds.

### Hull Slot Breakdown (All = 10 Total)

| Hull               | ⚔️ Weapon Slots | 🛡️ Module Slots | 🔧 Specialty Slots | Total | Identity                                            |
| ------------------ | --------------- | --------------- | ------------------ | ----- | --------------------------------------------------- |
| 🔴 **Interceptor** | 4               | 5               | 1                  | 10    | Quad-weapon blitz — all firepower                   |
| 🟡 **Corvette**    | 2               | 5               | 3                  | 10    | Most versatile — max specialty options              |
| 🟢 **Carrier**     | 1               | 6               | 3                  | 10    | Drones ARE your weapons; specialty + module focused |
| 🟣 **Organic**     | 2               | 7               | 1                  | 10    | Bio-module king — mutations stack like crazy        |
| ⚫ **Phantom**     | 3               | 5               | 2                  | 10    | Burst assassin with stealth tools                   |
| 🔵 **Juggernaut**  | 3               | 6               | 1                  | 10    | Heavy fortress — guns + stat stacking               |

> **Same total, wildly different builds.** Interceptor with 4 weapons is a flying arsenal. Corvette/Carrier with 3 specialty slots become profession masters (imagine 3 Miner specialties all at ★★★). Organic stacks 7 bio-modules for absurd stat combos. Phantom is the jack-of-all-trades assassin.

---

### ⚔️ Category 1: Weapons

Weapons fill **weapon slots**. Each weapon has a type, rarity, and potential perks.

#### Primary Weapons (continuous fire / main DPS)

| Weapon                   | Damage    | Fire Rate  | Range     | Special                                       | Best For                                |
| ------------------------ | --------- | ---------- | --------- | --------------------------------------------- | --------------------------------------- |
| 🔫 **Autocannon**        | Medium    | Fast       | Medium    | Reliable, no frills                           | All-rounders                            |
| ⚡ **Laser Beam**        | Low/sec   | Continuous | Long      | Ramps up damage the longer you hold on target | Sustained DPS, Juggernaut               |
| 💥 **Railgun**           | Very High | Slow       | Very Long | Charge-up shot, pierces enemies               | Sniping, Phantom (cloak → charged shot) |
| 🔥 **Plasma Cannon**     | High      | Medium     | Medium    | Shots explode on impact (small AoE)           | Groups, proc triggers                   |
| ❄️ **Cryo Blaster**      | Low       | Fast       | Short     | Slows enemies, freeze on crit                 | Crowd control, kiting                   |
| ☢️ **Radiation Sprayer** | DoT       | Continuous | Short     | Stacking radiation — enemies melt over time   | Tanky builds, Juggernaut                |
| 🌀 **Void Lancer**       | High      | Medium     | Long      | Slight homing (shots bend toward enemies)     | Hit-and-run, Interceptor                |
| ⚙️ **Rivet Gun**         | Medium    | Very Fast  | Short     | 5-round burst, high spread                    | Close combat, ram + blast               |

#### Secondary Weapons (cooldown-based / burst)

| Weapon                 | Cooldown | Effect                                       | Best For            |
| ---------------------- | -------- | -------------------------------------------- | ------------------- |
| 🚀 **Missiles**        | 8s       | Lock-on, high damage, slow travel            | Single target burst |
| 💣 **Proximity Mines** | 12s (3)  | Float in place, explode on approach          | Area denial, Miner  |
| ⚡ **EMP Burst**       | 15s      | AoE, disables shields + stuns 2s             | Shield breaker      |
| 🌊 **Shotgun Blast**   | 6s       | Cone of projectiles, devastating close range | Ram + blast combo   |
| 🛡️ **Decoy Drone**     | 20s      | Decoy draws enemy fire for 10s               | Survival            |
| 🌀 **Gravity Bomb**    | 25s      | Black hole pulls enemies together 5s         | AoE setup           |

#### Weapon Rarity & Upgrades

| Rarity       | Stat Bonus | Perks                     | Found              |
| ------------ | ---------- | ------------------------- | ------------------ |
| ⬜ Common    | Base       | None                      | Everywhere         |
| 🟢 Uncommon  | +15%       | +1 minor perk             | Outer+             |
| 🔵 Rare      | +30%       | +1 strong perk            | Mid+               |
| 🟣 Epic      | +50%       | +2 perks                  | Inner / Bosses     |
| 🟡 Legendary | +80%       | +2 perks + unique ability | Bosses / Void Rift |
| 🔴 Cursed    | +100%      | +2 perks + drawback       | Black Market       |

> **Weapon Upgrade Mechanic:** If you find a weapon you already have equipped, it **ranks up** instead of taking a new slot — same weapon, better rarity. Finding a 2nd Autocannon upgrades your Common → Uncommon. This rewards commitment to a weapon type.

---

### 🛡️ Category 2: Ship Modules (Stat Stacking)

Modules are **passive stat boosts** — the Megabonk "books." They stack, they compound, and with enough of them, they break the game. Each module occupies one module slot.

#### Core Ship Modules

| Module                    | Stat Boost                      | Stacking                        | Notes                                           |
| ------------------------- | ------------------------------- | ------------------------------- | ----------------------------------------------- |
| 🛡️ **Shield Capacitor**   | +20% shield capacity            | Yes — 3 of these = +60% shields | The defensive staple                            |
| ❤️ **Hull Plating**       | +15% max HP                     | Yes                             | Juggernaut stacking 6 of these = +90% HP        |
| ⚡ **Overclocked Core**   | +12% fire rate                  | Yes                             | More shots = more procs = more fun              |
| 🎯 **Targeting Computer** | +8% crit chance                 | Yes                             | Stack with Luck items for crit-lock builds      |
| 🏃 **Thruster Upgrade**   | +10% speed, +15% dodge distance | Yes                             | Interceptor stacking these becomes untouchable  |
| 🔋 **Fuel Recycler**      | -10% warp crystal cost          | Yes                             | Stack 3 = 30% cheaper jumps                     |
| 💉 **Repair Nanobots**    | Regenerate 1% HP every 8s       | Yes                             | Organic hull synergy — stacks with Regeneration |
| 🧲 **Mineral Magnet**     | +15% mineral pickup radius      | Yes                             | Quality of life + economy                       |
| 💥 **Damage Amplifier**   | +10% all damage                 | Yes                             | The raw power option                            |
| 🫧 **Shield Regen Coil**  | Shield recharges 25% faster     | Yes                             | Aggressive players who dodge well               |

#### Module Rank-Up System

Like weapons, finding a **duplicate module** ranks it up instead of taking a new slot:

| Rank     | Bonus                  | Visual                      |
| -------- | ---------------------- | --------------------------- |
| ★ (Base) | Standard effect        | Normal icon                 |
| ★★       | +50% effect            | Blue glow                   |
| ★★★      | +100% effect (doubled) | Gold glow + particle effect |

> This means a ★★★ Shield Capacitor gives +40% shields instead of +20%. **Finding duplicates is exciting, not disappointing.** At high Luck, you're fishing for that 3rd copy to supercharge your build.

---

### 🔧 Category 3: Specialty Upgrades (Profession Tools)

Specialties are **profession-specific equipment** that enhance your class identity. Limited to **1–2 slots** per hull — these are powerful and defining.

#### Specialty Upgrades by Profession

| Profession       | Specialty Upgrade        | Effect                                                      | Rank ★★★ Effect                               |
| ---------------- | ------------------------ | ----------------------------------------------------------- | --------------------------------------------- |
| ⛏️ **Miner**     | **Deep Core Scanner**    | Reveals mineral deposit quality + hidden veins              | Also reveals gem nodes (3× value)             |
| ⛏️ **Miner**     | **Auto-Drill Rig**       | Mining is 30% faster, auto-mines nearby small rocks         | 60% faster, auto-mines ALL rocks in range     |
| ⚔️ **Fighter**   | **Combat Analyzer**      | Shows enemy HP bars + damage numbers                        | Also shows enemy loot tables + weakness       |
| ⚔️ **Fighter**   | **Kill Streak Tracker**  | Consecutive kills grant +3% damage (stacks, resets on idle) | +5% per kill, slower reset                    |
| 🔭 **Scout**     | **Recon Drone**          | Automatically scouts adjacent rooms/nodes                   | Scouts 2 rooms ahead + marks loot rarity      |
| 🔭 **Scout**     | **Signal Interceptor**   | Reveals sector encounter type before jumping                | Also reveals sector rarity + boss presence    |
| 📦 **Hauler**    | **Cargo Expander**       | +3 cargo slots                                              | +6 cargo slots + items weigh 50% less         |
| 📦 **Hauler**    | **Trade Manifest**       | Station prices -15%, see all stock before docking           | -30% prices + exclusive deals appear          |
| 🔬 **Scientist** | **Anomaly Detector**     | Highlights scannable anomalies in the environment           | Auto-scans nearby anomalies passively         |
| 🔬 **Scientist** | **Research Synthesizer** | 15% chance to double Research Data gains                    | 30% chance + can craft Tech Cards at stations |

> **Why limit specialty to 1–2 slots?** These are the most powerful per-slot upgrades in the game. A Corvette (2 specialty slots) with Deep Core Scanner ★★★ + Auto-Drill Rig ★★★ becomes a mining GOD. Limiting slots means each one matters enormously.

---

### Level-Up Choice Flow

On level-up (via Power Cores), you choose **1 of 3 options**. The pool draws from all categories:

```
╔══════════════════════════════════════════════════════════╗
║                 CHOOSE YOUR UPGRADE                      ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  [1] ⚔️ Plasma Cannon     [2] 🛡️ Shield Capacitor ★★   ║
║      🟢 Uncommon                +20% → +30% shields     ║
║      New weapon!                Rank up existing!        ║
║                                                          ║
║               [3] 🔧 Deep Core Scanner                   ║
║                   Reveals mineral quality                 ║
║                   (Miner specialty)                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

| Scenario                                          | What Happens                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| Pick a **new weapon**                             | Goes to Cargo Hold → install at Shipyard (if you have an open weapon slot) |
| Pick a **new module**                             | Goes to Cargo Hold → install at Shipyard                                   |
| Pick a **rank-up** for something you already have | Applies **immediately** — no Shipyard needed                               |
| Pick a **specialty**                              | Goes to Cargo Hold → install at Shipyard (if you have a specialty slot)    |
| No empty slots?                                   | You can still pick rank-ups for existing equipment, or swap at Shipyard    |

> **Key design:** Rank-ups apply instantly, but new items need Shipyard installation. This means finding duplicates of what you already have is always good (instant power), while new items require planning your route to a station.

---

### Starting Loadout Unlocks

| Starting Choice        | Default             | Unlock Method                                             |
| ---------------------- | ------------------- | --------------------------------------------------------- |
| **Starting Weapon**    | Autocannon (Common) | Find any weapon in-run → unlocks as Common starter option |
| **Starting Module**    | None                | Meta-progression unlocks (Research Data)                  |
| **Starting Specialty** | None                | Profession milestone unlocks                              |
| **Starting Bonus**     | None                | Achievements (e.g., "start with 5 extra minerals")        |

> Found weapons unlock as Common starters. In-run weapons drop at higher rarities, so there's always a reason to loot.
