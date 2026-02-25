# 🔬 Meta-Progression System

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **No permanent power buffs.** Meta-progression unlocks **content** (new weapons, modules, specialties) — not stat increases. Every run starts on equal footing. Progress = more _options_, not more _power_.

## 1. Design Philosophy

| Principle                        | Details                                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Content, not power**           | Unlocks add items to your drop pool. You're never stronger — you have more build variety           |
| **Toggle pool**                  | Turn unlocked items ON/OFF before a run. Curate what can drop — focus your build or go wide        |
| **In-run spending**              | Spend Research Data mid-run to reroll/ban/mulligan upgrade choices. Meaningful resource management |
| **Cosmetics as endgame sink**    | After unlocking all content, Research Data goes to skins, trails, and paint jobs                   |
| **Achievement-gated milestones** | Hulls and professions unlock through gameplay challenges, not currency                             |

---

## 2. The Research Lab (Between Runs)

The Research Lab is where you spend **Research Data** between runs. It has 3 tabs:

### Tab 1: Content Unlocks (Expand the Drop Pool)

Unlock new weapons, modules, and specialties that can then appear during runs. Each unlock costs Research Data and adds that item to the global drop pool.

| Category        | # Unlockable | Starting Pool | Cost Range      | Notes                                                |
| --------------- | ------------ | ------------- | --------------- | ---------------------------------------------------- |
| ⚔️ Weapons      | ~20 total    | 4 basic       | 50–500 RD each  | Found in-run = auto-unlock as starter option too     |
| 🛡️ Modules      | ~20 total    | 4 basic       | 75–400 RD each  | Higher-tier modules cost more to unlock              |
| 🔧 Specialties  | ~10 total    | 2 per prof    | 100–600 RD each | Profession-locked — only unlocks for that profession |
| 🎲 Cursed Items | ~8 total     | 2 basic       | 200–800 RD each | High-risk/reward items for gamblers                  |

> **Example unlock path:** You start with Autocannon, Plasma Cutter, Shield Capacitor, and Thruster Boost in the drop pool. Spend 150 RD → unlock Rail Sniper. Now Rail Sniper can appear in level-up choices and station shops. Spend 300 RD → unlock Phase Repeater. Pool keeps growing.

### Tab 2: Toggle Pool (Curate Your Drops)

Before starting a run, toggle any unlocked item ON or OFF:

```
╔══════════════════════════════════════════════════════╗
║              TOGGLE POOL — Pre-Run Setup             ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ⚔️ WEAPONS                                         ║
║  [✅] Autocannon       [✅] Plasma Cutter            ║
║  [✅] Rail Sniper      [❌] Pulse Laser              ║
║  [✅] Phase Repeater   [❌] Scatter Blaster          ║
║                                                      ║
║  🛡️ MODULES                                         ║
║  [✅] Shield Capacitor [✅] Thruster Boost           ║
║  [✅] Armor Plating    [❌] Cargo Expander           ║
║  [✅] Targeting Array  [✅] Hull Reinforcement       ║
║                                                      ║
║  🔧 SPECIALTIES (Miner)                             ║
║  [✅] Mineral Scanner  [✅] Charge Detonator         ║
║  [❌] Ore Refinery     [✅] Deep Core Drill          ║
║                                                      ║
║  ───────────────────────────────────────────         ║
║  Pool size: 14 ON / 3 OFF                            ║
║  Smaller pool = more likely to find duplicates (★↑)  ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

> [!TIP]
> **Smaller pool = higher rank-up chance.** If you only enable 6 weapons but have 3 weapon slots, you'll find duplicates faster → more ★★ and ★★★ items. This creates a strategic tradeoff: wide pool for variety vs. tight pool for rank-ups.

### Tab 3: Cosmetic Shop (Endgame Sink)

| Cosmetic Type        | Cost Range   | Examples                                          |
| -------------------- | ------------ | ------------------------------------------------- |
| **Ship Skins**       | 500–2,000 RD | Neon, military camo, chrome, organic, stealth     |
| **Engine Trails**    | 200–800 RD   | Flame, electric, rainbow, void, particle          |
| **Paint Colors**     | 100–300 RD   | Custom hull colors, gradients, metallic finishes  |
| **Pilot Outfits**    | 300–1,000 RD | Spacesuits, armor, casual, faction-themed         |
| **HUD Themes**       | 200–500 RD   | Retro green, holographic, minimalist, neon pink   |
| **Death Animations** | 500–1,500 RD | Explosion styles, disintegrate, warp-out, ragdoll |

> Cosmetics are the **infinite sink** — once you've unlocked all content, Research Data still has value. Completionists will chase skins for hundreds of runs.

---

## 3. In-Run Research Data Spending

Research Data isn't just for between runs — you carry a **Research Data wallet** into each run. Spend it mid-run for powerful choice manipulation:

| Action            | Base Cost | 2nd Use | 3rd Use | 4th Use | What It Does                                                                         |
| ----------------- | --------- | ------- | ------- | ------- | ------------------------------------------------------------------------------------ |
| **Reroll**        | 25 RD     | 50      | 100     | 200     | Discard the current 3 upgrade options and get 3 new ones                             |
| **Ban**           | 50 RD     | 100     | 200     | 400     | Permanently remove one specific item from this run's drop pool (won't appear again)  |
| **Mulligan**      | 75 RD     | 150     | 300     | 600     | Skip the level-up choice entirely — bank it for next level (get 2 choices next time) |
| **Targeted Pull** | 100 RD    | 200     | 400     | 800     | Choose which CATEGORY your next 3 options come from (all weapons, all modules, etc.) |
| **Shop Refresh**  | 30 RD     | 60      | 120     | 240     | Refresh a station's shop inventory with new stock                                    |

> [!WARNING]
> **Every use doubles the cost (×2 per use, per action).** First reroll = 25 RD. Second = 50. Third = 100. Fourth = 200. Each action has its own independent counter — banning doesn't make rerolls more expensive. **Costs reset each run.** This prevents hoarding RD across runs to cheese a god build — by the 4th reroll you're paying 200 RD, which is nearly an entire run's earnings.

> **Reroll vs. Ban vs. Mulligan:** Reroll is cheap and reactive ("I don't like these 3"). Ban is proactive ("I never want Cargo Expander this run"). Mulligan is strategic ("I'm saving my choice for when I really need it"). Each serves a different build-crafting need. Use them wisely — they get expensive fast.

### Research Data Sources (During a Run)

| Source               | Amount    | Notes                                                   |
| -------------------- | --------- | ------------------------------------------------------- |
| Clearing a sector    | 5–15 RD   | Scales with ring difficulty                             |
| Scanning anomalies   | 10–30 RD  | Scientist profession gets bonus                         |
| Boss kills           | 25–50 RD  | Major infusion                                          |
| Research stations    | 15–25 RD  | Spend time analyzing data at a station                  |
| Derelict exploration | 5–20 RD   | Found in data cores on wrecks                           |
| End-of-run bonus     | 20–100 RD | Based on sectors cleared, enemies killed, rings reached |

> Your walkaway amount after a run = what you gathered minus what you spent in-run. Fast aggressive runs might bank 200+ RD. Careful explorer runs that spend on rerolls might net 80 RD but with a perfectly crafted build.

---

## 4. Achievement-Based Unlocks (No Currency)

These unlock via gameplay milestones — you can't buy them:

| Unlock                   | Achievement Required                         | Type       |
| ------------------------ | -------------------------------------------- | ---------- |
| 🟢 **Carrier**           | Deploy 50 total drones (via found items)     | Hull       |
| 🟣 **Organic**           | Discover a living ship anomaly               | Hull       |
| ⚫ **Phantom**           | Complete a run without being detected once   | Hull       |
| 🔵 **Juggernaut**        | Absorb 50,000 total damage                   | Hull       |
| **Miner profession**     | Mine 1,000 total minerals                    | Profession |
| **Scout profession**     | Reveal 100 total hidden sectors              | Profession |
| **Hauler profession**    | Deliver 500 total cargo value                | Profession |
| **Scientist profession** | Scan 50 total anomalies                      | Profession |
| **Cursed Loadout**       | Complete a run with 3+ cursed items equipped | Challenge  |
| **Speed Demon**          | Complete a run in under 25 minutes           | Challenge  |
| **Pacifist Ring 1**      | Clear Ring 1 without firing a weapon         | Challenge  |

> **Achievements unlock content, not power.** Getting the Phantom hull doesn't make you stronger — it gives you a new playstyle option. This keeps the achievement system feeling rewarding without creating a power gap between new and veteran players.

---

## 5. Research Data Economy Summary

```
╔══════════════════════════════════════════════════════════════╗
║                RESEARCH DATA FLOW                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  EARN                         SPEND                          ║
║  ────                         ─────                          ║
║  Sectors cleared (5–15)   →   In-Run: Reroll (25)            ║
║  Anomaly scans  (10–30)   →   In-Run: Ban (50)               ║
║  Boss kills     (25–50)   →   In-Run: Mulligan (75)          ║
║  Research stn   (15–25)   →   In-Run: Targeted Pull (100)    ║
║  Derelicts      (5–20)    →   In-Run: Shop Refresh (30)      ║
║  End-of-run     (20–100)  →                                  ║
║                               ──────────────────────         ║
║  Run total: ~100–300 RD   →   Between: Content unlocks       ║
║                               Between: Cosmetic shop         ║
║                               Between: (saved for future)    ║
║                                                              ║
║  Tradeoff: Spend in-run for build perfection                 ║
║            OR save for between-run unlocks                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

> [!IMPORTANT]
> **The key tension:** Research Data earned in-run can be spent DURING the run (rerolls, bans) or SAVED for after the run (content unlocks, cosmetics). Aggressive spenders get a perfect build this run but unlock content slower. Savers unlock content faster but play with whatever the RNG gives them. This creates a meaningful ongoing decision throughout every run.
