# ⚔️ Combat & Co-op Design

**Status:** Design — co-op not in the build.

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. Combat Design

### Combat Principles

| Principle              | Details                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **Juicy & responsive** | Every hit feels punchy — screen shake, particles, damage numbers, enemy flash, knockback |
| **6DOF, not twin-stick** | Avorion-style thrust, inertia, and mouse steering — see [15_controls_and_camera.md](15_controls_and_camera.md) |
| **Commit vs disengage** | Straight-line kiting must not be the safest *and* highest-DPS option. Ships cross, intercept, and overshoot — see [17_anti_kiting_combat.md](17_anti_kiting_combat.md) |
| **Boost is a burst**   | Short afterburner to close, escape, or pass — not a permanent speed state                |
| **Build diversity**    | Combat feels different based on Hull × Profession combo — not just "shoot stuff"         |
| **Escalation**         | Fights start manageable and escalate. Wave 3 should feel notably harder than Wave 1      |
| **Proc spectacle**     | When proc chains trigger at high Luck, the screen should fill with satisfying chaos      |

### Damage System

| Component           | Details                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| **Base Damage**     | Weapon base × rarity multiplier                                        |
| **Crit Multiplier** | Base 2× damage. Stacks with Luck and items                             |
| **Elemental**       | Fire (DoT), Ice (slow), Explosive (AoE), Void (pierce)                 |
| **Armor**           | Reduces incoming damage by flat %. Can be broken by specific weapons   |
| **Shields**         | Absorb all damage first; recharge at 18/s after 3s without damage      |
| **Weak Points**     | Some enemies have glowing weak spots for 2× damage (Scientist reveals) |

### POC shield and collision contract

- The Ace starts with **75 shield / 100 hull**. Projectile and collision damage both enter the same `TakeDamage` path: shields absorb first and only overflow reaches hull.
- **Shields are currently invisible.** The first pass wrapped the hull in a translucent cyan sphere, which read as a ball stuck to the ship and hid the silhouette we had just spent the art budget on. Absorption now shows only through the cyan point-light flash and the HUD bar; hull overflow changes the flash to coral/red and adds the existing camera kick. The replacement should be localised to the impact point — a brief hex-shell ripple facing the hit normal — rather than a permanent whole-ship envelope.
- Any incoming damage resets the three-second recharge delay. Recharge never repairs hull.
- Asteroid collision damage uses **closing speed along the impact normal**, not total ship speed. A fast parallel scrape should slide along the rock; a head-on impact should hurt. Below 220 uu/s it is harmless, then damage rises with speed to a 45-point cap.
- A short per-impact cooldown prevents a single sustained contact from applying damage every frame. Physical asteroids receive an impulse from the ship and collide with one another through Chaos.
- **The hull's hitbox is a box, sized from the hull mesh's own bounds** (currently ~240 long × 241 wide × 59 tall) rather than the capsule it started as. That capsule was a 140 radius over a 145 half-height — a sphere in all but name — which stood roughly 290uu tall around a hull barely 60uu thick, so the ship stopped dead on rocks that clearly passed above and below it. A box is the crudest shape that still tells the three hull axes apart, and unlike a convex hull it is cheap to sweep every frame, which is what movement does. It is inset to 82% of the bounds: a fighter's bounding box is mostly empty air at the swept wingtips and tapered nose, and erring small is the kinder error — clipping a wingtip through a rock reads as a near miss, while stopping on clear space reads as a bug. Press `-` in game to draw every physics shape and check this against what you can see.

### Damage Numbers

| Type           | Visual                                             |
| -------------- | -------------------------------------------------- |
| Normal hit     | White numbers, small                               |
| Crit hit       | Yellow numbers, large, with ⚡ icon                |
| Elemental proc | Colored (🔥 orange, ❄️ blue, 💥 yellow, 🌀 purple) |
| Weak point     | Red numbers, extra large, screen shake             |
| Multi-kill     | Stacking combo counter (×2, ×3, ×4...)             |

---

## 2. Enemy Design Philosophy

### Core Principles

| Principle               | Details                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| **Read before react**   | Every enemy telegraphs its attack with visual + audio cues (1–2s warning)                          |
| **Counter-play exists** | Every enemy behavior has a clear counter (dodge the charge, shoot the generator, etc.)             |
| **Roles, not reskins**  | Each frame fills a distinct role — Needles swarm, Bastions absorb, Relays buff ([06_enemy_catalog.md](06_enemy_catalog.md)) |
| **Composition matters** | Wave composition creates emergent challenges (Relay + Bastion = hard wall)                          |
| **Profession moments**  | Some enemies are designed to make specific professions feel special (Scientist reveals weaknesses) |
| **Trait readability**   | Visual cues (glow, particles, size) telegraph traits so players learn the "language"               |

### Enemy Hierarchy

| Tier          | Role in Wave                   | Player Feeling                       |
| ------------- | ------------------------------ | ------------------------------------ |
| **Fodder**    | Easy kills, resource drops     | "I'm powerful" — satisfying to clear |
| **Standard**  | Moderate threat, core of waves | "I need to pay attention"            |
| **Elite**     | Dangerous, priority targets    | "Focus fire this one first"          |
| **Mini-Boss** | Wave-defining threat           | "We need a strategy for this"        |
| **Boss**      | Multi-phase set piece          | "This is THE fight of the sector"    |

> Full enemy system details in [06_enemy_catalog.md](06_enemy_catalog.md).

---

## 3. Co-op Design (2–4 Players)

### Co-op Principles

| Principle                      | Details                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| **Drop-in / drop-out**         | Join friends mid-run. Enemies scale up. If someone leaves, enemies scale back down      |
| **No friendly fire (default)** | Can be toggled on in settings for chaos (madness mode)                                  |
| **Shared map, split loot**     | Everyone sees the same sector. Loot drops individually (your drops are yours)           |
| **Group jump voting**          | Team votes on which sector to jump to next. Longest jump range in party is used         |
| **Shared Warp Crystal cost**   | Jump costs come from a shared pool — no freeloading                                     |
| **Revive mechanic**            | Downed players can be revived within 15s. If timer expires, they spectate until station |

### Profession Synergy in Co-op

The game is designed so **diverse profession teams** are stronger than duplicate professions:

| Team Composition            | Synergy                                                        |
| --------------------------- | -------------------------------------------------------------- |
| **Fighter + Miner**         | Fighter protects while Miner farms. Miner drops mines as traps |
| **Scout + any team**        | Full map reveal + enemy marks = team-wide +15% damage          |
| **Hauler + Trader-focused** | Hauler carries team's loot, negotiates bulk deals at stations  |
| **Scientist + Fighter**     | Scientist exposes weakness → Fighter deals bonus damage        |
| **4 unique professions**    | Each player does what they do best. The dream team             |

### Co-op Scaling

| Players | Enemy HP | Enemy Count | Loot Quality | Boss Phases |
| ------- | -------- | ----------- | ------------ | ----------- |
| 1       | 1.0×     | 1.0×        | Base         | Base        |
| 2       | 1.6×     | 1.3×        | +15%         | +0–1 phase  |
| 3       | 2.2×     | 1.5×        | +25%         | +1 phase    |
| 4       | 3.0×     | 1.8×        | +40%         | +1–2 phases |

> **Scaling philosophy:** More players = enemies are tankier and more numerous, but NOT unfairly so. Boss fights gain extra phases/attacks, not just HP sponges. Loot quality increases to reward group play.

### Co-op Communication

| System               | Details                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| **Ping system**      | Point at anything → contextual ping (enemy, loot, location, danger)    |
| **Voice chat**       | Built-in proximity + team voice chat                                   |
| **Quick emotes**     | "Need Help!", "On My Way!", "Mine!", "Watch Out!", "Good Job!"         |
| **Shared map pings** | Scout can ping map locations for team visibility                       |
| **Combo callouts**   | Auto-callout when a profession synergy triggers ("Scientist exposed!") |

### Co-op Run Flow

```
LOBBY (Outer Rim Station)
├── All players in the same station instance
├── Each player picks Hull × Profession
├── Host selects Heat level (with team vote)
├── Ready up → Launch
│
IN-RUN
├── All players in same sector
├── Explore together or split up (shared map)
├── Combat encounters scale to player count
├── Stations: each player shops independently
├── Jump: team votes on destination
│
DEATH / REVIVAL
├── Downed player: 15s revive window
│   ├── Teammate gets close → hold button → revive with 30% HP
│   └── Timer expires → spectate until next station
├── Total party wipe → run over for everyone
│
VICTORY
├── All players get rewards
├── Heat achievements earned individually
├── Loot is individual — no fighting over drops
```
