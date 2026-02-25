# 🎲 Event Encounters

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

Events are encounters triggered at 🎲 **Event** nodes. They present choices, stories, and risk/reward decisions — not pure combat. Each event has **profession-specific options** that give class identity outside of combat.

---

## 1. Event Categories & Full Catalog

### ⚔️ Combat Events (reward: combat loot, Power Cores)

| #   | Event                | Description                                                                                      | Key Choice                                                       |
| --- | -------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | **Pirate Ambush**    | Pirates surround you and demand tribute                                                          | Pay minerals to escape, or fight (harder difficulty → Epic loot) |
| 2   | **Arena Challenge**  | A fighting pit broadcasts a challenge — enter for glory                                          | Risk HP for guaranteed Rare+ weapon, or decline safely           |
| 3   | **Bounty Board**     | A wanted poster for a nearby elite enemy                                                         | Hunt the target for big reward, or ignore and stay safe          |
| 4   | **Mercenary Offer**  | A merc offers to fight with you for the next 2 sectors                                           | Pay 100 minerals for a strong AI ally, or save your cash         |
| 5   | **Prison Transport** | A prisoner transport is under attack — it's carrying a dangerous criminal who offers to join you | Free them (powerful but unpredictable ally) or leave them        |

### 🌍 Environmental Events (reward: resources, Warp Crystals)

| #   | Event                 | Description                                                                  | Key Choice                                                    |
| --- | --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 6   | **Asteroid Storm**    | Massive asteroid field collision incoming — dodge or mine                    | Mine for bonus minerals (risky) or fly through safely         |
| 7   | **Ion Storm**         | Electromagnetic storm approaches — disrupts shields and scanners             | Power through (take damage) or wait it out (lose time)        |
| 8   | **Derelict Ship**     | Abandoned vessel floating dead in space — could be treasure, could be a trap | Board it (random: treasure OR trap fight) or salvage exterior |
| 9   | **Comet Chase**       | A rare mineral-rich comet streaks through the sector                         | Chase for massive mining haul or let it pass                  |
| 10  | **Gravity Well**      | Pulled toward a dense object — getting closer reveals rare minerals          | Fight the pull (safe) or ride it in (risky → huge rewards)    |
| 11  | **Supernova Warning** | A nearby star is about to blow — evacuate or grab what you can               | Loot the sector fast (timed) or jump immediately              |

### 👤 NPC/Story Events (reward: lore, alliances, unique items)

| #   | Event                 | Description                                                     | Key Choice                                                  |
| --- | --------------------- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| 12  | **Distress Signal**   | Someone's calling for help — could be real, could be bait       | Respond (help → ally, trap → fight) or ignore               |
| 13  | **Wandering Trader**  | A nomadic merchant with rare/unique items not found at stations | Trade minerals for exclusive gear, or browse and leave      |
| 14  | **Alien Artifact**    | You find a strange device of unknown origin                     | Activate it (random buff or debuff) or sell at next station |
| 15  | **Faction Diplomacy** | Two factions ask for your support in their conflict             | Side with one (gain ally, make enemy) or stay neutral       |

### 🎰 Risk/Reward Events (reward: high-variance loot)

| #   | Event                  | Description                                       | Key Choice                                                  |
| --- | ---------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| 16  | **The Gambler**        | A mysterious figure offers you a game of chance   | Bet minerals or items for a chance at Epic+ loot            |
| 17  | **Unstable Warp Gate** | A malfunctioning gate could teleport you anywhere | Enter (random sector — could be amazing or deadly) or avoid |
| 18  | **Cursed Upgrade**     | A powerful upgrade with an unknown downside       | Take it (strong + random curse) or leave it                 |
| 19  | **Double or Nothing**  | Risk your current cargo for a chance to double it | Gamble everything or walk away safe                         |

### 💫 Rare Events (unique, memorable encounters)

| #   | Event             | Description                                                                    | Key Choice                                                    |
| --- | ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| 20  | **The Collector** | A mysterious being collects rare items — trade modules for exclusive artifacts | Trade (guaranteed Legendary) or keep what you have            |
| 21  | **Time Anomaly**  | Time loops — you replay the last sector with different choices available       | Re-do previous choices with hindsight, or skip                |
| 22  | **The Voice**     | An ancient AI contacts you — offers forbidden knowledge about The Shatter Core | Accept (lore + powerful debuff) or decline (safe but curious) |

---

## 2. Event Frequency & Distribution

| Ring       | Event Chance per Node | Expected Events per Run | Common Events | Rare Events     |
| ---------- | --------------------- | ----------------------- | ------------- | --------------- |
| Outer Ring | 20%                   | 1–2                     | 1–5, 6–8      | None            |
| Mid Ring   | 25%                   | 1–2                     | 1–15          | Possible (5%)   |
| Inner Ring | 30%                   | 1                       | 12–19         | Higher (15%)    |
| The Core   | 100%                  | 1 (pre-boss)            | Faction/Lore  | Guaranteed (22) |

> **Players encounter 4–6 events per run.** Enough to feel meaningful, not so many that they become routine. Rare events (20–22) appear **once every 5–10 runs** — when they show up, it's a moment.

---

## 3. Profession-Specific Event Options

Each profession gets a **unique option** for most events — making the same event play differently depending on your class:

| Event               | Fighter Option                            | Miner Option                          | Scout Option                       | Hauler Option                       | Scientist Option                           |
| ------------------- | ----------------------------------------- | ------------------------------------- | ---------------------------------- | ----------------------------------- | ------------------------------------------ |
| **Pirate Ambush**   | Challenge leader to duel → Rare wep       | Plant mining charges → kill them all  | Sneak past undetected → bonus loot | Bribe with cargo → keep minerals    | Analyze their ships → expose weakness      |
| **Derelict Ship**   | Breach by force → fast but triggers traps | Cut through hull → access hidden room | Scan for life signs → avoid trap   | Strip the hull → bonus salvage      | Hack the computers → data + schematics     |
| **Asteroid Storm**  | Shoot asteroids → clear a path            | Mine during the storm → 3× minerals   | Navigate best route → no damage    | Use rocks for cover → protect cargo | Study asteroid composition → Research Data |
| **Distress Signal** | Rush in guns blazing → fight fast         | Bring mining rig → clear debris       | Verify signal first → know if trap | Tow the ship → salvage reward       | Decode signal → learn enemy positions      |
| **Alien Artifact**  | Smash it → random weapon drop             | Refine material → rare minerals       | Trace its origin → map reveal      | Sell to highest bidder → big payout | Full analysis → guaranteed buff            |

> **Why this matters:** A Miner encountering a Derelict Ship gets a hidden room with extra loot. A Scientist gets schematics and data. Same event, different experience. This gives runs with different professions dramatically different narratives.
