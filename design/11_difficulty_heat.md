# 🔥 Difficulty & Heat System

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **Inspired by Hades' Pact of Punishment.** Players toggle individual difficulty modifiers before a run. Each modifier adds **Heat** — the total Heat level determines reward bonuses. Higher Heat = harder run = better loot. Achievements are tied to Heat milestones.

---

## 1. Core Concept

After completing your **first full run** (beating The Shatter Core), the Difficulty terminal unlocks in the **Command Bridge** of the Outer Rim Station. Before each subsequent run, you can toggle modifiers ON/OFF and set their rank.

```
╔════════════════════════════════════════════════════════════╗
║           🔥 HEAT CONFIGURATION — Pre-Run                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Total Heat: ████████████░░░░░░░░  12 / 64               ║
║  Reward Bonus: +60% loot  |  +30% RD  |  +20% XP         ║
║                                                            ║
║  ┌─────────────────────────────────────────────────┐      ║
║  │ MODIFIER               RANK    HEAT   STATUS   │      ║
║  │ ─────────────────────── ────── ─────── ──────── │      ║
║  │ Hard Labor              ★★☆☆   +4     [ON]     │      ║
║  │ Lasting Consequences    ★☆☆☆   +2     [ON]     │      ║
║  │ Jury Duty               ★★★☆   +6     [ON]     │      ║
║  │ Calisthenics            ☆☆☆☆   +0     [OFF]    │      ║
║  │ Benefits Package        ☆☆☆☆   +0     [OFF]    │      ║
║  │ Middle Management       ☆☆☆☆   +0     [OFF]    │      ║
║  │ Underworld Customs      ☆☆☆☆   +0     [OFF]    │      ║
║  │ Tight Deadline          ☆☆☆☆   +0     [OFF]    │      ║
║  │ Approval Process        ☆☆☆☆   +0     [OFF]    │      ║
║  │ Damage Control          ☆☆☆☆   +0     [OFF]    │      ║
║  │ No Insurance            ☆☆☆☆   +0     [OFF]    │      ║
║  │ Budget Cuts             ☆☆☆☆   +0     [OFF]    │      ║
║  └─────────────────────────────────────────────────┘      ║
║                                                            ║
║  [LAUNCH RUN]    [RESET ALL]    [MAX HEAT]                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 2. Modifier Catalog (12 Modifiers)

Each modifier has **4 ranks**. Higher ranks add more Heat per modifier.

### ⚔️ Combat Modifiers

| Modifier                 | Rank 1 (+1 Heat)         | Rank 2 (+2 Heat)  | Rank 3 (+3 Heat)  | Rank 4 (+4 Heat)  |
| ------------------------ | ------------------------ | ----------------- | ----------------- | ----------------- |
| 🔨 **Hard Labor**        | Enemies deal +15% damage | +30% damage       | +50% damage       | +75% damage       |
| 🏋️ **Calisthenics**      | Enemies have +20% HP     | +40% HP           | +60% HP           | +100% HP          |
| 👔 **Middle Management** | +1 extra enemy per wave  | +2 extra per wave | +3 extra per wave | +4 extra per wave |
| 💨 **Benefits Package**  | Enemies move +15% faster | +25% faster       | +40% faster       | +60% faster       |

### 🛡️ Defensive Modifiers

| Modifier                    | Rank 1 (+1 Heat)                 | Rank 2 (+2 Heat)   | Rank 3 (+3 Heat)   | Rank 4 (+4 Heat)              |
| --------------------------- | -------------------------------- | ------------------ | ------------------ | ----------------------------- |
| 💔 **Lasting Consequences** | -20% max HP                      | -35% max HP        | -50% max HP        | -65% max HP                   |
| 🚫 **No Insurance**         | Healing items 25% less effective | 50% less effective | 75% less effective | Healing items disabled        |
| 🧊 **Damage Control**       | Shield recharge rate -25%        | -40% recharge      | -60% recharge      | Shields don't regenerate auto |

### 💰 Economy Modifiers

| Modifier                  | Rank 1 (+1 Heat)              | Rank 2 (+2 Heat)               | Rank 3 (+3 Heat)           | Rank 4 (+4 Heat)                       |
| ------------------------- | ----------------------------- | ------------------------------ | -------------------------- | -------------------------------------- |
| 💸 **Budget Cuts**        | -15% mineral drops            | -30% mineral drops             | -50% mineral drops         | -70% mineral drops                     |
| 📋 **Approval Process**   | Station prices +25%           | +50% prices                    | +75% prices                | +100% prices (everything costs double) |
| 🎰 **Underworld Customs** | Black Markets disabled Rank 1 | +Wandering Traders gone Rank 2 | +Research Labs gone Rank 3 | Only Shipyards remain Rank 4           |

### ⏱️ Pacing Modifiers

| Modifier              | Rank 1 (+2 Heat)           | Rank 2 (+3 Heat) | Rank 3 (+4 Heat) | Rank 4 (+5 Heat)                   |
| --------------------- | -------------------------- | ---------------- | ---------------- | ---------------------------------- |
| ⏰ **Tight Deadline** | Sector timer: 8 minutes    | 6 minutes        | 4 minutes        | 3 minutes                          |
| ⚖️ **Jury Duty**      | Bosses gain +1 extra phase | +2 extra phases  | +3 extra phases  | Bosses regenerate 10% HP per phase |

---

## 3. Heat Level → Reward Scaling

| Total Heat | Tier Name       | Loot Bonus | RD Bonus | XP Bonus | Special Reward                               |
| ---------- | --------------- | ---------- | -------- | -------- | -------------------------------------------- |
| 0          | Normal          | —          | —        | —        | —                                            |
| 1–4        | 🟢 Warm         | +10%       | +5%      | +5%      | —                                            |
| 5–8        | 🟡 Hot          | +25%       | +15%     | +10%     | Extra item drop per boss                     |
| 9–16       | 🟠 Scorching    | +50%       | +30%     | +20%     | Guaranteed Rare+ from bosses                 |
| 17–24      | 🔴 Inferno      | +80%       | +50%     | +35%     | Guaranteed Epic+ from final boss             |
| 25–32      | 🟣 Hellfire     | +120%      | +75%     | +50%     | Exclusive Hellfire cosmetic set unlocks      |
| 33–48      | ⚫ Extinction   | +175%      | +100%    | +75%     | Exclusive Extinction title + ship skin       |
| 49–64      | 💀 **MAX HEAT** | +250%      | +150%    | +100%    | Exclusive MAX HEAT animated portrait + trail |

> **Max theoretical Heat = 64** (all 12 modifiers at Rank 4). This is nearly impossible to survive — a badge of honor for the most skilled players.

---

## 4. Heat Achievements

| Achievement                   | Requirement                               | Reward                                    |
| ----------------------------- | ----------------------------------------- | ----------------------------------------- |
| **"Getting Warm"**            | Complete a run at Heat 4+                 | Unlock Heat system cosmetic page          |
| **"Feeling the Burn"**        | Complete a run at Heat 8+                 | Title: "Firewalker"                       |
| **"Forged in Fire"**          | Complete a run at Heat 16+                | Exclusive weapon skin (fire effects)      |
| **"Extinction Level Event"**  | Complete a run at Heat 32+                | Exclusive hull skin set (molten/magma)    |
| **"MAX HEAT"**                | Complete a run at Heat 64 (ALL modifiers) | Animated portrait frame + death animation |
| **"Specialist"**              | Complete Heat 16+ with each profession    | Professor title + RD bonus per profession |
| **"Fleet Admiral"**           | Complete Heat 16+ with each hull          | All ships get cosmetic thruster trail     |
| **"The Masochist"**           | Complete Heat 32+ with -65% HP modifier   | Exclusive glowing red hull aura           |
| **"Pacifist Under Pressure"** | Clear a Heat 8+ sector without firing     | Zen-themed ship skin                      |
| **"Speed Demon Inferno"**     | Complete Heat 16+ in under 30 minutes     | Afterburner trail (fire + speed lines)    |

---

## 5. Heat × Co-op

| Mechanic                    | Details                                                        |
| --------------------------- | -------------------------------------------------------------- |
| **Shared Heat**             | All players use the host's Heat configuration                  |
| **Heat Vote**               | In lobby, players can vote on modifiers (host has final say)   |
| **Co-op Heat Bonus**        | +10% rewards per additional player (incentivizes group play)   |
| **Individual Achievements** | Each player earns achievements based on the shared Heat level  |
| **Carry Runs**              | A veteran at Heat 32 can carry a new player — both get rewards |

---

## 6. Heat × Modular Enemy Interaction

Heat modifiers stack with the existing enemy system:

| Modifier × Enemy Layer         | How They Interact                                                       |
| ------------------------------ | ----------------------------------------------------------------------- |
| **Hard Labor + Enraged**       | Enraged enemies now deal +75% on top of their normal +50% → devastating |
| **Calisthenics + Armored**     | Armored tanks with doubled HP become genuine walls                      |
| **Middle Management + Pack**   | Extra enemies + Pack trait = screen floods with coordinated swarms      |
| **Benefits Package + Charger** | Charger enemies move +60% faster → nearly undodgeable ram attacks       |
| **Tight Deadline + Supernova** | Supernova timer + sector timer = double time pressure                   |

> **Heat is multiplicative with the existing trait system.** At high Heat levels, even "normal" encounters become genuinely dangerous because modifiers enhance every enemy trait.

---

## 7. UI Integration

### Command Bridge Terminal

The Heat terminal sits in the Command Bridge next to the launch controls:

| Element                 | Details                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| **Heat Gauge**          | Visual thermometer filling from green → yellow → red → purple     |
| **Modifier Cards**      | Each modifier is a card you flip ON/OFF. Rank stars light up      |
| **Reward Preview**      | Live-updating rewards panel shows what bonuses you'll get         |
| **Achievement Tracker** | Shows which Heat achievements you're close to unlocking           |
| **Highest Heat**        | Displays your personal best Heat completion per Hull × Profession |
| **Leaderboard**         | Global / friends leaderboard for highest Heat clears              |

### In-Run Heat Indicator

| Element              | Details                                                    |
| -------------------- | ---------------------------------------------------------- |
| **Heat Badge**       | Small flame icon in HUD corner showing current Heat level  |
| **Active Modifiers** | Hovering over badge shows all active modifiers             |
| **Death Screen**     | Shows Heat level and active modifiers on the death screen  |
| **Victory Screen**   | Shows Heat level, reward bonuses, and achievement progress |
