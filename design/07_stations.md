# 🏪 Station Interactions

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

Stations are **in-run locations** on the galaxy grid where players dock to trade, install upgrades, repair, and access profession-specific services. Each station type has a distinct purpose and UX flow.

---

## 1. Station Types Overview

| Station             | Primary Role                  | Secondary Role             | Refresh Mechanic                                  |
| ------------------- | ----------------------------- | -------------------------- | ------------------------------------------------- |
| 🛠️ **Shipyard**     | Install upgrades, repair hull | Buy/sell weapons, refit    | Stock refreshes each visit                        |
| 💰 **Trade Post**   | Buy/sell minerals + goods     | Bounty boards, cargo trade | Prices fluctuate based on supply/demand           |
| 🔬 **Research Lab** | Craft tech cards, analyze     | Enhance modules, scanner   | Crafting recipes rotate each run                  |
| 🏴‍☠️ **Black Market** | Illegal mods, cursed items    | Gambling, high-risk trades | **Raid Timer** — authorities arrive if you linger |

---

## 2. 🛠️ Shipyard (Install, Repair, Refit)

The Shipyard is where you **install found equipment** from your Cargo Hold into your ship.

### Services

| Service              | Cost              | What It Does                                                                |
| -------------------- | ----------------- | --------------------------------------------------------------------------- |
| **Install Upgrade**  | Free              | Move item from Cargo Hold → equipped slot (if slot available)               |
| **Swap Equipment**   | 25 minerals       | Replace an equipped item with one from Cargo Hold (old item stays in cargo) |
| **Hull Repair**      | 5 minerals/10% HP | Restore hull HP (cheaper than Medical Frigate items)                        |
| **Shield Recharge**  | 10 minerals       | Fully recharge shields instantly                                            |
| **Buy Weapons**      | 50–500 minerals   | Stock of 3–5 weapons (rarity based on ring)                                 |
| **Buy Modules**      | 30–300 minerals   | Stock of 3–5 modules (rarity based on ring)                                 |
| **Sell Equipment**   | 50% buy price     | Sell unwanted items from Cargo Hold                                         |
| **Refit** (advanced) | 100 minerals      | Re-slot an upgrade to a different slot type (weapon → module if compatible) |

### UX Flow

```
╔══════════════════════════════════════════════╗
║              🛠️ SHIPYARD                     ║
╠══════════════════════════════════════════════╣
║                                              ║
║  YOUR SHIP          CARGO HOLD               ║
║  ──────────         ──────────               ║
║  ⚔️ [Autocannon ★]  📦 Plasma Cutter        ║
║  ⚔️ [___empty___]   📦 Shield Capacitor      ║
║  🛡️ [Hull Plate ★]  📦 Targeting Array       ║
║  🛡️ [___empty___]   📦 Kill Streak (Fighter) ║
║  🔧 [___empty___]                            ║
║                                              ║
║  [INSTALL] [SWAP] [REPAIR] [SHOP] [SELL]    ║
║                                              ║
║  Hull: 65/100 HP  |  Minerals: 342           ║
╚══════════════════════════════════════════════╝
```

---

## 3. 💰 Trade Post (Buy, Sell, Bounties)

Trade Posts are **economy hubs** — buy and sell minerals, warp crystals, and trade goods. Hauler profession shines here.

### Services

| Service                | Details                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Buy/Sell Minerals**  | Market rate fluctuates ±20%. Hauler gets +30% sell price                      |
| **Buy Warp Crystals**  | 25 minerals per crystal (expensive — mining is cheaper but risky)             |
| **Sell Cargo Items**   | Sell any cargo for minerals. Hauler gets bonus prices on bulk sells           |
| **Bounty Board**       | Accept bounties on nearby enemies/sectors. Reward: minerals + Rare weapon     |
| **Trade Contracts**    | Accept a contract to deliver cargo to another station. High risk, high payout |
| **Faction Reputation** | Some Trade Posts belong to factions — trading builds rep for exclusive items  |

### Price Fluctuation System

| Factor                     | Price Effect                                     |
| -------------------------- | ------------------------------------------------ |
| **High supply nearby**     | Mineral prices drop 10–20%                       |
| **Recent pirate activity** | Weapon prices rise 15%, mineral prices drop 10%  |
| **Ring proximity to Core** | Inner ring stations charge premium (1.3× prices) |
| **Player Wanted level**    | ★★★+ = 50% markup on all prices                  |
| **Hauler profession**      | Always gets -15% buy / +30% sell                 |

---

## 4. 🔬 Research Lab (Craft, Analyze, Enhance)

Research Labs are **Scientist-focused** stations for crafting and enhancing equipment.

### Services

| Service              | Cost                     | What It Does                                                           |
| -------------------- | ------------------------ | ---------------------------------------------------------------------- |
| **Craft Tech Card**  | 50–200 RD + 100 minerals | Choose from 3 craftable tech cards (recipes rotate per run)            |
| **Analyze Specimen** | 25 RD                    | Reveal an enemy's full stat block + loot table for the rest of the run |
| **Enhance Module**   | 75 RD + module           | Upgrade a module by 1 rank (★ → ★★). Guaranteed, not random            |
| **Scanner Upgrade**  | 100 RD                   | Permanently improve scanner range for this run                         |
| **Data Synthesis**   | 50 RD                    | Convert Research Data into a random uncommon+ item                     |
| **Anomaly Report**   | Free                     | Shows locations of all anomalies in adjacent sectors                   |

### Scientist Profession Bonus

| Bonus                       | Details                                               |
| --------------------------- | ----------------------------------------------------- |
| **Extra craft options**     | 5 tech card options instead of 3                      |
| **Discount crafting**       | All crafting costs -30% RD                            |
| **Unique recipes**          | Access to Scientist-only tech cards (data-based)      |
| **Free analysis per visit** | First specimen analysis is free at every Research Lab |

---

## 5. 🏴‍☠️ Black Market (Risk, Gamble, Power)

The Black Market offers **high-risk, high-reward** trades. It's where you find cursed items, illegal modifications, and gambling opportunities.

> [!WARNING]
> **Raid Timer:** Spending too long at a Black Market triggers a Raid — authorities attack the station and you must flee or fight. The timer is visible and ticks down from 90 seconds.

### Services

| Service              | Cost                 | What It Does                                                                       |
| -------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| **Cursed Items**     | 100–400 minerals     | Powerful items with drawbacks (e.g., +50% dmg, +25% damage taken)                  |
| **Illegal Mods**     | 200–600 minerals     | Bypass slot limits, stack forbidden combos                                         |
| **Contraband Trade** | Varies               | Sell stolen goods (from pirated neutrals) at premium rates                         |
| **Slot Machine**     | 50 minerals per pull | Random reward: nothing, minerals, rare item, or Legendary (weighted by Luck)       |
| **Info Broker**      | 75 minerals          | Reveals boss location + weakness, or shows full sector map                         |
| **Identity Scrub**   | 200 minerals         | Reduce Wanted level by 2 (cheaper than station bounty payment, but risky location) |

### Raid Timer Mechanics

| Phase             | Timer     | What Happens                                                       |
| ----------------- | --------- | ------------------------------------------------------------------ |
| **Browsing**      | 90s → 60s | Normal shopping. Timer visible in corner                           |
| **Warning**       | 60s → 30s | Alarms sound. NPCs start packing up. Prices drop 50% (desperation) |
| **Raid Imminent** | 30s → 0s  | Station shakes. Last chance to buy/leave. Everything half off      |
| **Raid**          | 0s        | Authority ships warp in. Fight or flee. Black Market goes dark     |

> **Risk/reward:** Shopping at a Black Market under raid pressure is thrilling. The last 30 seconds offer 50% off everything — but if you're caught in the raid, you face a tough fight AND gain +2 Wanted level.

---

## 6. Station UX Principles

| Principle                    | Details                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------- |
| **Diegetic menus**           | All station interfaces exist in the game world — walk up to terminals, NPCs       |
| **No pause during stations** | In co-op, other players continue exploring while you shop (adds urgency)          |
| **Profession callouts**      | Each station highlights profession-specific options with a glowing icon           |
| **Quick-buy hotkeys**        | 1-button purchase for common actions (repair, buy crystals, sell all junk)        |
| **Compare mode**             | Side-by-side stat comparison between cargo items and equipped items               |
| **Price colors**             | Green = good deal, Yellow = normal, Red = overpriced (helps fast decision-making) |
