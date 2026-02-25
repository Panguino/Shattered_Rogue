# 📊 Statistics, Leaderboards & Run History

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **Data is content.** Tracking player stats, run history, and leaderboards serves three purposes: (1) **player competition** — bragging rights and rivalry, (2) **player reflection** — understanding what makes runs succeed or fail, and (3) **developer intelligence** — detecting imbalances, exploits, and meta trends.

---

## 1. Run Summary Screen

Every run ends with a detailed summary — win or loss. This is the player's "highlight reel" and the foundation for all stats tracking.

### Run Summary Layout

```
╔══════════════════════════════════════════════════════════════════╗
║             💀 RUN ENDED — "The Prospector"                     ║
║             Interceptor × Miner  |  Heat: 12 🔥                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  OVERVIEW                          FINAL BUILD                   ║
║  ────────                          ───────────                   ║
║  Result:      Death (Ring 3)       ⚔️ Plasma Cannon ★★           ║
║  Duration:    34:22                ⚔️ Railgun ★                  ║
║  Sectors:     6 / 10              🛡️ Shield Cap ★★★              ║
║  Enemies:     147 killed           🛡️ Hull Plating ★★            ║
║  Bosses:      2 defeated           🛡️ Damage Amp ★               ║
║  Best Combo:  ×24 kill streak     🛡️ Thruster ★                 ║
║  Luck Peak:   38                   🔧 Auto-Drill ★★              ║
║                                                                  ║
║  ECONOMY                           PROGRESSION                   ║
║  ───────                           ───────────                   ║
║  Minerals earned:    2,847         RD earned:     145             ║
║  Minerals spent:     1,920         RD spent (run): 75            ║
║  Warp Crystals used: 37           RD banked:      70             ║
║  Items found:        23           XP earned:    3,200            ║
║  Items installed:    11           Levels gained:  14             ║
║                                                                  ║
║  ┌───────────────────────────────────────────────────────────┐   ║
║  │ 🏆 ACHIEVEMENTS EARNED THIS RUN                          │   ║
║  │  ★ "Mineral Magnate" — Mined 500+ minerals in one run   │   ║
║  │  ★ "Streak Master" — Hit a ×20 kill streak              │   ║
║  └───────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  [VIEW TIMELINE]  [SHARE RUN]  [PLAY AGAIN]  [RETURN TO HUB]   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Run Timeline (Expandable)

A sector-by-sector breakdown accessible from "VIEW TIMELINE":

| Sector | Environment    | Encounter     | Enemies | Loot Found             | Events           | Time |
| ------ | -------------- | ------------- | ------- | ---------------------- | ---------------- | ---- |
| 1      | Asteroid Field | Mining Run    | 8       | Autocannon, Shield Cap | —                | 4:12 |
| 2      | Nebula         | Research      | 12      | Targeting Array        | Distress Signal  | 5:45 |
| 3      | Open Space     | Event         | 0       | —                      | Wandering Trader | 1:30 |
| 4      | Debris Field   | Pirate Raid   | 38      | Plasma Cannon ★★       | —                | 7:22 |
| 5      | Station        | Shipyard      | —       | Installed 3 items      | —                | 3:10 |
| 6      | Ice Field      | Boss Fight 💀 | 45      | **DEATH**              | —                | 8:03 |

> Each row is expandable — shows damage dealt, damage taken, procs triggered, items picked up, and choices made at events.

---

## 2. Player Statistics (Lifetime)

### Career Stats Page

Accessible from the **Trophy Room** in the Hub Station. Shows lifetime aggregates:

#### Combat Stats

| Stat                      | Tracks                               | Leaderboard? |
| ------------------------- | ------------------------------------ | ------------ |
| **Total enemies killed**  | All-time enemy takedowns             | ✅ Global    |
| **Highest kill streak**   | Best consecutive kill combo          | ✅ Global    |
| **Total damage dealt**    | Lifetime damage output               | ✅ Global    |
| **Total damage taken**    | Lifetime damage absorbed             | ❌           |
| **Bosses defeated**       | All-time boss kills                  | ✅ Global    |
| **Deaths**                | Total run-ending deaths              | ❌           |
| **Kill/Death ratio**      | Enemies killed / deaths              | ✅ Friends   |
| **Favorite weapon**       | Most kills with a single weapon type | ❌           |
| **Highest single hit**    | Biggest damage number ever dealt     | ✅ Global    |
| **Proc chains triggered** | Total proc-on-proc cascades          | ✅ Friends   |

#### Economy Stats

| Stat                           | Tracks                                  | Leaderboard? |
| ------------------------------ | --------------------------------------- | ------------ |
| **Total minerals mined**       | Lifetime mining yield                   | ✅ Global    |
| **Total minerals spent**       | Lifetime station purchases              | ❌           |
| **Total Research Data earned** | Lifetime RD acquisition                 | ✅ Global    |
| **Total Research Data spent**  | Between-run + in-run spending           | ❌           |
| **Richest run (minerals)**     | Most minerals earned in a single run    | ✅ Global    |
| **Biggest trade**              | Highest single transaction at a station | ✅ Friends   |
| **Items found**                | Lifetime total items discovered         | ❌           |
| **Warp Crystals consumed**     | Total fuel spent across all runs        | ❌           |

#### Exploration Stats

| Stat                         | Tracks                                     | Leaderboard? |
| ---------------------------- | ------------------------------------------ | ------------ |
| **Total sectors explored**   | Lifetime sectors visited                   | ✅ Global    |
| **Unique environments seen** | How many of the 8 env types you've visited | ❌           |
| **Anomalies scanned**        | Lifetime anomaly interactions              | ❌           |
| **Hidden areas found**       | Secret rooms and caches discovered         | ✅ Friends   |
| **Events completed**         | Total event encounters resolved            | ❌           |
| **Piñatas caught**           | Loot Piñatas fully killed (Diamond tier)   | ✅ Global    |

#### Progression Stats

| Stat                      | Tracks                                   | Leaderboard? |
| ------------------------- | ---------------------------------------- | ------------ |
| **Total runs completed**  | Runs that ended in victory               | ✅ Global    |
| **Total runs attempted**  | All runs (wins + deaths)                 | ❌           |
| **Win rate**              | Victories / total runs                   | ✅ Friends   |
| **Highest Heat cleared**  | Best Heat level completed                | ✅ Global    |
| **Fastest win**           | Shortest run time for a victory          | ✅ Global    |
| **Longest run**           | Most time spent in a single run          | ✅ Friends   |
| **Highest Luck achieved** | Peak Luck stat ever reached in a run     | ✅ Global    |
| **Loop+ completions**     | Number of New Game+ victories            | ✅ Global    |
| **Perfect runs**          | Wins with 0 deaths (no revives in co-op) | ✅ Global    |

---

## 3. Per-Combo Statistics (Hull × Profession)

Each of the 30 Hull × Profession combos tracks its own stats:

```
╔═══════════════════════════════════════════════════╗
║  🔴 INTERCEPTOR × ⛏️ MINER — "The Prospector"   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  Runs:     47 played  |  12 wins (25.5%)         ║
║  Best Heat: 16 🔥     |  Fastest Win: 28:41      ║
║  Avg Duration: 36:14  |  Avg Sectors: 6.2        ║
║  Total Kills: 6,821   |  Total Mined: 48,200     ║
║  Highest Luck: 72     |  Best Streak: ×31        ║
║  Favorite Weapon: Plasma Cannon (38% of kills)   ║
║                                                   ║
║  MOST USED BUILD:                                 ║
║  ⚔️ Plasma Cannon + Autocannon + Railgun + Rivet ║
║  🛡️ Shield Cap ×2 + Hull Plate + Damage Amp      ║
║  🔧 Auto-Drill ★★★                               ║
║                                                   ║
║  [VIEW RUN HISTORY]  [LEADERBOARD]               ║
╚═══════════════════════════════════════════════════╝
```

> **Why per-combo stats?** Players naturally gravitate toward 2–3 favorites. Seeing stats per combo encourages trying new ones ("I've never played Phantom × Scientist — let me try") and creates 30 separate leaderboards to compete on.

---

## 4. Leaderboard System

### Leaderboard Types

| Type              | Scope              | Reset Cycle   | Purpose                                  |
| ----------------- | ------------------ | ------------- | ---------------------------------------- |
| **Global**        | All players        | Permanent     | All-time records — hall of fame          |
| **Seasonal**      | All players        | Monthly reset | Fresh competition each month             |
| **Friends**       | Steam friends list | Permanent     | Social rivalry, visible on Hub station   |
| **Hull-Specific** | Per hull type      | Permanent     | Compare within the same hull's community |
| **Heat**          | Per Heat tier      | Permanent     | Compare at the same difficulty level     |

### Core Leaderboard Categories

| Category                  | Metric                            | Filter Options                    |
| ------------------------- | --------------------------------- | --------------------------------- |
| 🏆 **Highest Heat Clear** | Max Heat level beaten             | Overall, per hull, per profession |
| ⚡ **Speedrun**           | Fastest win time                  | Per Heat level, per combo         |
| 💀 **Kill Count**         | Total enemies killed (single run) | Overall, per environment          |
| 🪨 **Mining Champion**    | Most minerals in a single run     | Overall, Miner-only               |
| 🔗 **Combo King**         | Highest kill streak               | Overall, per weapon               |
| 🎰 **Lucky Devil**        | Highest Luck stat achieved        | Overall                           |
| 💎 **Piñata Hunter**      | Fastest Piñata kill time          | Overall                           |
| 📊 **Win Streak**         | Consecutive victories             | Overall, per combo                |
| 🔬 **Data Hoarder**       | Most RD earned in one run         | Overall, Scientist-only           |
| 🤝 **Co-op Champion**     | Highest Heat clear (4-player)     | Co-op only                        |

### Season Rewards (Monthly Leaderboards)

| Placement        | Reward                                               |
| ---------------- | ---------------------------------------------------- |
| **Top 100**      | Exclusive seasonal ship skin + title                 |
| **Top 500**      | Seasonal title + animated portrait border            |
| **Top 1000**     | Seasonal title                                       |
| **Participated** | Seasonal participation badge (track how many months) |

> [!TIP]
> **Anti-exploit:** Seasonal boards require a minimum Heat level to qualify (Heat 4+). This prevents farming easy runs for inflated stats. Global boards track all Heat levels but display the Heat alongside the score.

---

## 5. Run History Log

Every run is saved in a **Run History** accessible from the Trophy Room:

### Run History Browser

```
╔══════════════════════════════════════════════════════════════╗
║                    📜 RUN HISTORY                           ║
╠══════════════════════════════════════════════════════════════╣
║  Filter: [All] [Wins] [Deaths] [Heat 8+] [Solo] [Co-op]   ║
║  Sort:   [Recent] [Duration] [Heat] [Kill Count]           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  #   Date        Combo             Heat  Result   Duration  ║
║  ──  ──────────  ────────────────  ────  ───────  ────────  ║
║  47  Feb 25      Interceptor×Miner  12   💀 Ring 3  34:22  ║
║  46  Feb 25      Phantom×Fighter     8   🏆 Win!    41:15  ║
║  45  Feb 24      Carrier×Scientist   0   💀 Ring 2  22:08  ║
║  44  Feb 24      Corvette×Hauler    16   🏆 Win!    52:30  ║
║  43  Feb 23      Juggernaut×Fighter  4   💀 Ring 4  48:12  ║
║  ...                                                         ║
║                                                              ║
║  [LOAD RUN DETAILS]  [COMPARE RUNS]  [EXPORT DATA]         ║
╚══════════════════════════════════════════════════════════════╝
```

### Run Comparison Mode

Select 2–3 runs to compare side-by-side:

| Metric             | Run #46 (Win)     | Run #47 (Death)     |
| ------------------ | ----------------- | ------------------- |
| **Combo**          | Phantom × Fighter | Interceptor × Miner |
| **Heat**           | 8                 | 12                  |
| **Duration**       | 41:15             | 34:22               |
| **Sectors**        | 8                 | 6                   |
| **Enemies killed** | 189               | 147                 |
| **Damage dealt**   | 48,200            | 31,500              |
| **Luck peak**      | 42                | 38                  |
| **Items found**    | 28                | 23                  |
| **RD earned**      | 210               | 145                 |
| **Cause of end**   | Victory           | Ice Field Boss      |

> **Why compare?** Lets players learn from their best runs. "My winning runs always have 8+ sectors — maybe I should explore more instead of rushing."

---

## 6. Developer Intelligence Reports

> [!IMPORTANT]
> **Internal analytics layer.** These reports are invisible to players but critical for balancing. Track aggregated data to spot exploits, imbalances, and meta trends.

### Automated Reports

| Report                        | Frequency | What It Tracks                                                    | Action Trigger                          |
| ----------------------------- | --------- | ----------------------------------------------------------------- | --------------------------------------- |
| **Combo Win Rates**           | Daily     | Win % per Hull × Profession combo across all Heat levels          | If any combo >60% or <15% win rate      |
| **Weapon Usage Distribution** | Daily     | Which weapons appear in winning builds vs. losing builds          | If any weapon >40% presence in wins     |
| **Item Synergy Heatmap**      | Weekly    | Which item combinations appear together most in winning runs      | Identifies unintended broken combos     |
| **Heat Distribution**         | Daily     | What Heat levels players are attempting and clearing              | If >50% of runs are at Heat 0           |
| **Economy Flow**              | Weekly    | Average minerals/RD earned and spent per run, per ring            | If inflation/deflation trend detected   |
| **Death Location Heatmap**    | Daily     | Where players die most often (ring, environment, encounter, boss) | If any boss has >80% kill rate          |
| **Event Choice Distribution** | Weekly    | Which event choices are picked most/least                         | If any option is picked <5% of the time |
| **Session Length**            | Daily     | Average run duration, play sessions per day, retention            | If avg run >70 min (too long)           |
| **Exploit Detection**         | Real-time | Flagging impossible stats (e.g., Luck 500, negative damage, etc.) | Auto-flag for manual review             |
| **Proc Chain Analysis**       | Weekly    | Average and peak proc chain lengths, most common chain types      | If any chain averages >10 triggers      |

### Balance Dashboards

| Dashboard                   | Visualizes                                                        |
| --------------------------- | ----------------------------------------------------------------- |
| **Combo Balance Radar**     | 30-point radar chart — each combo's win rate, play rate, avg Heat |
| **Weapon Tier List**        | Auto-generated S/A/B/C/D tier list based on presence in wins      |
| **Economy Sankey**          | Flow diagram of currency earned → spent → banked across rings     |
| **Difficulty Curve**        | Player death rate by ring, overlaid with loot power curve         |
| **Player Retention Funnel** | New player → 1st win → Heat 4 → Heat 16 → Heat 32 → MAX HEAT      |
| **Meta Evolution**          | Weekly snapshot of most-played combos and weapons over time       |

### Exploit Detection Flags

| Flag Type                 | Trigger Condition                                    | Severity |
| ------------------------- | ---------------------------------------------------- | -------- |
| **Impossible Stats**      | Any stat exceeds theoretical maximum                 | 🔴 High  |
| **Speed Anomaly**         | Run win time < 5 minutes (likely skip exploit)       | 🔴 High  |
| **Infinite Resource**     | Currency earned > 10× expected for sectors visited   | 🟡 Med   |
| **Proc Loop**             | Single proc chain exceeds 50 triggers in one frame   | 🟡 Med   |
| **Win Rate Outlier**      | Combo win rate >70% across 100+ runs (balance issue) | 🟠 Low   |
| **Duplicate Submissions** | Identical run data submitted multiple times          | 🔴 High  |

---

## 7. Social & Sharing Features

### Share Run Card

After any run, players can generate a **shareable card** — a single image summarizing the run for social media:

```
┌──────────────────────────────────────┐
│  SHATTERED ROGUE                     │
│  ──────────────────                  │
│  🏆 VICTORY — Heat 16 🔥🔥🔥        │
│                                      │
│  Phantom × Fighter — "Assassin"      │
│  Duration: 38:22  |  Sectors: 8      │
│  Kills: 203  |  Luck: 54            │
│  Best Streak: ×28                    │
│                                      │
│  Final Build:                        │
│  ⚔️ Railgun ★★★ + Void Lancer ★★    │
│  🛡️ Shield ★★★ + Crit Cascade       │
│  🔧 Kill Streak Tracker ★★          │
│                                      │
│  "One-shot the final boss from       │
│   cloak. Crit Cascade is broken."    │
│                       — PlayerName   │
└──────────────────────────────────────┘
```

### Ghost Data (Async Competition)

| Feature               | Details                                                           |
| --------------------- | ----------------------------------------------------------------- |
| **Ghost Runs**        | Replay a friend's run on the same seed — compare your performance |
| **Daily Challenge**   | Everyone plays the same seed + Heat config. Leaderboard for it    |
| **Weekly Seeds**      | Curated seeds with specific challenges and leaderboards           |
| **Challenge Friends** | Send a specific Heat config + seed to a friend as a "dare"        |

> **Daily Challenge** is the main repeating competitive feature. Same seed means everyone faces the same enemies, loot, and events — pure skill comparison.

---

## 8. Trophy Room Integration

The **Trophy Room** in the Hub Station physically displays stats:

| Display Element             | Triggered By                                     |
| --------------------------- | ------------------------------------------------ |
| **Kill counter hologram**   | Updates live with lifetime kill count            |
| **Best combo trophy case**  | Shows your highest-Heat-cleared combo's gear     |
| **Leaderboard terminal**    | Access all leaderboards from an in-station kiosk |
| **Run history archive**     | Holographic file cabinet — browse past runs      |
| **Friend comparison board** | Side-by-side stats with your most-played friends |
| **Daily Challenge board**   | Today's seed, your rank, friends' ranks          |
| **Season trophy shelf**     | Monthly leaderboard placement trophies           |
| **Achievement wall**        | Detailed stats behind each achievement           |

---

## 9. Data Retention Policy

| Data Type                | Storage             | Retention        | Notes                                   |
| ------------------------ | ------------------- | ---------------- | --------------------------------------- |
| **Run summaries**        | Cloud (per player)  | Permanent        | Compressed after 90 days                |
| **Run timelines**        | Cloud (per player)  | Last 50 runs     | Full detail for recent, summary for old |
| **Lifetime stats**       | Cloud (per player)  | Permanent        | Aggregated counters, lightweight        |
| **Leaderboard entries**  | Server              | Permanent/season | Seasonal boards purge monthly           |
| **Daily Challenge data** | Server              | 30 days          | Seeds + results, rotate monthly         |
| **Dev analytics**        | Server (aggregated) | 6 months         | Anonymized, aggregated only             |
| **Ghost run data**       | Cloud (opt-in)      | Last 10 runs     | Only if player opts into sharing        |
