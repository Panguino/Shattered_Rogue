# 👾 Enemy Catalog — The Slop

**Status:** In progress — generator, kit, and first procedural boss implemented; broader frame/protocol roster remains design.

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

> **Naming.** Every enemy in the game is **the Slop**: one machine intelligence that turns everything it touches into more of itself, poured out of an entity at the galactic core. *The Equation* is its formal in-fiction name and is used below for the faction's design language; both words mean the same thing. See [14_lore_and_narrative.md](14_lore_and_narrative.md#0-direction-loose-canon).

> **Live build (2026-09-05).** The raid's three waves use the authored Mortar Column, Bastion Anvil and Relay Cage. Its first boss is now **Iron Warden**, a sector-seeded cold-iron kit assembly, replacing the cube flagship. The `PiratePawn` / `Flagship` C++ names remain compatibility labels, not faction canon. Other frame/protocol combinations below are still design.

### First boss: Iron Warden (initial playable pass)

Appears after the third wave, using the existing boss victory and reward path.
The sector seed produces a repeatable 22–29-part connected chassis: one hub,
two weapon modules, two propulsion modules, and variable rods, joints, armor,
power links and lamps. Uses the same kit placement/rendering as Enemy Generator,
with a bounded 220-unit visual radius and a 230-unit collision radius. Its
two generated weapon tips supply the actual projectile spawn positions.

| Phase | Initial tuning | Player response |
| --- | --- | --- |
| Reposition | Orbit toward 1,450 units of standoff at 260 units/s; at least 2.5 seconds; seek a clear firing line | Follow or use rocks as cover |
| Charge | 1.2-second amber muzzle swell; aim freezes for the final ~0.55 seconds | Strafe after the aim commits |
| Volley | Two volleys, 0.38 seconds apart; each weapon fires a three-bolt fan at 11-degree spacing | Dodge the slow 1,000-unit/s bolts |
| Recover | 2.4 seconds without firing; alternate orbit direction afterward | Punish with the starting pulse cannon |

Base hull is 600 HP, multiplied by the existing flagship/debug health settings.
Below half hull, movement rises to 320 units/s, reposition time drops to 1.8
seconds, and the attack becomes three five-bolt fans per weapon. Charge and
recovery windows remain unchanged. Each bolt deals 9 damage; rocks block shots.
The mission HUD shows boss name, hull percentage and current attack phase.
This is one shared hull-health pool, not destructible individual subsystems.
Numbers are a first balancing pass, not a final difficulty target.

### Rock avoidance and starting equipment (implemented)

Moving enemies share hull-sized 3D look-ahead sweeps against scenery and drifting
rocks. A scored direction fan can go left/right, over/under, or back out; previous
direction biases equal-clearance routes to reduce side-to-side indecision.
Short clearances reduce speed. Collision fallback spends the remaining movement
sliding along the surface. A one-second lack-of-progress check initiates an
escape replan; penetration correction accepts only a clear nearby destination.
Spawns are clearance-tested for the configured hull size, with retries instead
of silently embedding an entire wave or boss in rock. Mortar Columns intentionally
remain stationary. Lightning also respects line of sight now.

This is local avoidance, not a global route planner: tightly enclosed or moving
rock clusters can still require further tuning. Next useful improvements are a
coarse 3D waypoint graph for deep traps, squad spacing, and collision/health per
generated module. These are not implemented in this pass.

Fresh runs retain only the built-in starting pulse cannon. Optional hardpoints
show no gun or gimbal base. Saved Ship Weapon Manager placement tuning remains
available, but its preview loadout no longer grants equipment in a run.

Development-only `-BossPlaytest` skips the waves for encounter audition. Normal
raids still progress through all three waves. Regression tests live under
`ShatteredRogue.EnemyCombat` plus the existing `EnemyGenerator` suite.

---

## 1. Faction Fantasy & Design Philosophy

> [!IMPORTANT]
> **The principal enemy is a networked machine intelligence, not an infection.**
> It fabricates robot warships, captures existing machines, and rebuilds matter
> into increasingly perfect geometric forms. Five concepted frames (plus one unexplored sixth) × five protocol
> layers × four proof tiers create hundreds of readable enemies from a compact
> art kit.

Survivors call the network **the Equation**. Its native designation is a
continuous proof no human instrument can display. It does not hate biological
life and does not infect it; it classifies free will, randomness, and biological
variation as unsolved error. Its objective is **Convergence**: measure every
possible state, replace unpredictable systems with deterministic machines, and
reduce the galaxy to one final answer.

| Principle                    | Details                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Robotic, never biological** | Hard-surface frames, articulated tools, sensor arrays, floating plates, and energy links. No flesh, veins, ooze, or tendrils |
| **Modular over bespoke**     | Six frames, not 60 ships. Protocol attachments, projected glyphs, and materials create variety                              |
| **Readable at a glance**     | Each protocol owns a geometric icon, color accent, sound motif, and physical attachment                                    |
| **Coordinated, not feral**    | Units share targeting data, form solutions, screen priority assets, and deliberately disengage to recompute                |
| **Scales with difficulty**   | Deeper rings run more protocols and look less like salvaged ships and more like native mathematical constructs             |
| **Environment-biased**       | The network selects functions suited to local geometry, heat, visibility, and available matter                            |
| **Budget-based spawning**    | Each sector has a compute budget spent on frames, protocols, and proof tiers                                               |

---

## 2. Base Machine Frames (5 concepted + Cipher)

Each frame defines silhouette, base HP, movement, and attack pattern. Names are
survivor shorthand based on the function each machine performs; intercepted
Equation signals identify them only with changing numeric expressions.

| Frame          | Silhouette                                       | Base HP | Speed     | Base Attack              | Battlefield Function |
| -------------- | ------------------------------------------------ | ------- | --------- | ------------------------ | -------------------- |
| 🔴 **Needle**  | Small tetrahedral body around one bright sensor  | Low     | Fast      | Ram / weak laser         | Saturation unit      |
| 🟡 **Vector**  | Medium arrowhead with paired articulated barrels | Medium  | Medium    | Twin lasers              | General interceptor  |
| 🟢 **Mortar**  | Bulky hexagonal magazine, forward sensor hood    | Medium  | Slow      | Explosive payload        | Area denial          |
| 🔵 **Bastion** | Large layered cube with rotating armor planes    | High    | Very Slow | Heavy cannon             | Frontline anchor     |
| 🟣 **Relay**   | Slim spindle ringed by antennae and light nodes  | Low     | Medium    | Repair beam / logic aura | Network coordinator  |
| ⚫ **Cipher**  | Flat asymmetric wedge with broken silhouette     | Low     | Fast      | Ambush burst             | Information warfare  |

> **Art requirement: five hero frames with concepts, plus Cipher as an
> unexplored sixth.** Protocols add socketed plates, orbiting
> primitives, projected lines, shader states, and scale changes. A Thermal
> Needle and a Cryo Needle share the same authored frame but must read as
> different calculations before either fires.
>
> The current visual direction is the cold iron pass:
> [`art/enemies/equation/cold-iron/`](../art/enemies/equation/cold-iron/README.md).
> Needle, Vector, Mortar, Bastion, and Relay each get three asymmetric concepts
> built to one weapon mount, drone scale, and bare unpainted metal, with colour
> only from batteries and energy links. Several are spherical or vertical rather
> than aircraft-shaped, since nothing in this faction carries a pilot. A
> [`larger cold iron pass`](../art/enemies/equation/cold-iron-larger/README.md)
> moves each frame up one size class and tests three composite constructs whose
> smaller drones dock into a single unit with one shared weapon. The
> [`cold iron modular kit`](../art/enemies/equation/cold-iron-kit/README.md)
> breaks that language into **thirty** compatible pieces (v2) across ten
> component families for further assemblies; the twenty-piece v1 kit is
> archived beside it. The
> earlier painted exploration is kept alongside it in
> [`art/enemies/equation/`](../art/enemies/equation/README.md). Cipher remains
> the sixth hero-frame exploration rather than being folded into Vector.
>
> **Enemy Generator (shipped):** the runtime main menu includes **Enemy
> Generator**, a deterministic assembly tool. It loads the authored kit meshes
> from `/Game/Meshes/EnemyKit` and falls back to engine primitives (cubes,
> cylinders, spheres, cones) only when a kit mesh is missing. A seed plus
> min/max ranges controls **ten part families**: the **Hub** (the root, with 16
> symmetric omni sockets so growth can go in nearly any direction), electrical
> terminals, rods, panels, joints, weapons, propulsion, heat sinks, batteries,
> and lights. The preview rotates live; saved notes persist with the exact seed
> and ranges in the `ShatteredEnemyFavorites` save slot. Component-inspector
> mode isolates one part and renders every declared socket as a green
> sphere with a cyan normal stem: rods, cables, and batteries have two end
> sockets; panels have four edge sockets; joints have six axis sockets; heat
> sinks have two base sockets; weapons, propulsion, and lights have one mounting
> socket. The first live consumer of this assembly system is Iron Warden above;
> the three ordinary wave roles still use their authored complete hulls.

---

## 3. Protocol System (5 Layers)

Each construct runs **0–3 visible protocols** according to proof tier. Protocols
stack: a Thermal + Projection + Consensus Vector behaves differently from a
basic Vector. Protocol names are player-facing combat shorthand, not literal
code.

### Layer 1: Navigation Protocols

| Protocol      | Effect                                         | Visual Cue                              |
| ------------- | ---------------------------------------------- | --------------------------------------- |
| **Tangent**   | Solves a curved route to attack from behind    | Amber tangent line projected ahead     |
| **Collision** | Commits to a high-speed intercept then resets  | Red vector arrow and rising tone        |
| **Orbit**     | Holds an exact firing radius while strafing    | Concentric range circles                |
| **Skip**      | Makes a short discontinuous displacement       | Missing-frame distortion and cube echo  |
| **Consensus** | Moves in synchronized formation with 2–3 units | White graph edges connect squad nodes   |
| **Conditional** | Waits until player shields or hull are low   | Dim frame; inequality glyph flips bright |

> Navigation protocols are per-frame flavor. They must not collapse into
> `steerToward(player)`. Squad intercept, attack slots, pursuit limits, and
> disengagement live in [17_anti_kiting_combat.md](17_anti_kiting_combat.md).
> POC pirates remain an independent mortal faction and still chase independently.

### Layer 2: Weapon Functions

| Function       | Effect                                  | Visual Cue                           |
| -------------- | --------------------------------------- | ------------------------------------ |
| **Thermal**    | Shots apply heat damage over time       | Orange heat sinks and square embers  |
| **Cryo**       | Shots slow movement and fire rate       | Blue coolant vapor and crystal glyph |
| **Cascade**    | Impacts branch into a small blast       | Yellow nested blast-radius hexes     |
| **Convergent** | Projectiles continuously solve toward target | Green curved prediction line    |
| **Iterative**  | 2× attack speed, lower per-hit damage   | Repeating barrel light sequence      |
| **Solution**   | Long-range, high-damage calculated shot | Thin sight line and shrinking reticle |

### Layer 3: Integrity Systems

| System          | Effect                                        | Visual Cue                             |
| --------------- | --------------------------------------------- | -------------------------------------- |
| **Projection**  | 50% damage reduction from front               | Floating frontal armor plane           |
| **Barrier**     | Regenerating energy shield                    | Faceted geodesic shield                 |
| **Self-Repair** | Slowly reconstructs hull over time            | Green wireframe fills missing geometry  |
| **Reversal**    | 15% chance to reflect projectiles             | Mirror plate rotates toward impact      |
| **Desync**      | Briefly invulnerable during displacement      | Cyan duplicate one frame out of phase   |
| **Mesh Defense** | Damage reduction near networked allies       | Triangulated links between constructs   |

### Layer 4: Logic Routines

| Routine        | Effect                                               | Visual Cue                            |
| -------------- | ---------------------------------------------------- | ------------------------------------- |
| **Fork**       | On destruction, deploys two smaller instances        | Body visibly divided by a binary seam |
| **Terminal**   | Converts remaining power into a death explosion      | Countdown numerals around red core    |
| **Fabricator** | Periodically assembles 1–2 Needles                   | Parts snap together in an open bay    |
| **Overclock**  | Below 30% HP: +50% damage, +30% speed                | Timing glyphs accelerate and turn red |
| **Harvest**    | Repairs 5% of damage dealt                           | Violet data stream returns from hit   |
| **Coordinator** | Buffs nearby units for five seconds                 | Expanding command grid from a Relay   |

### Layer 5: Provenance Marks

| Mark          | Effect                              | Visual                                  |
| ------------- | ----------------------------------- | --------------------------------------- |
| **Macroform** | 1.5× larger, +25% HP                | Expanded frame with additional braces   |
| **Microform** | 0.7× size, +20% speed               | Compressed frame and higher motor pitch |
| **Prime**     | +15% to all stats                   | Gold-white theorem halo                 |
| **Glitched**  | Erratic timing, bonus damage        | Magenta artifacts and broken glyphs     |
| **Legacy**    | Slow, very high HP and damage       | Blackened pre-Shattering machine parts  |

---

## 4. Proof Tiers

| Tier         | Protocols | Stat Multiplier | Typical Appearance | Compute Cost |
| ------------ | --------- | --------------- | ------------------ | ------------ |
| ★ Routine    | 0–1       | 1.0×            | Outer Ring         | 1 point      |
| ★★ Iterant   | 1–2       | 1.5×            | Mid Ring           | 2 points     |
| ★★★ Theorem  | 2–3       | 2.5×            | Inner Ring         | 4 points     |
| ★★★★ Axiom   | 3         | 4.0×            | Core / Loop+ only  | 8 points     |

> **Axiom constructs** are mini-bosses: a Bastion running Projection + Barrier +
> Fabricator is a complete battlefield problem that demands coordinated focus.
> The tier words should appear beside their stars until playtests prove players
> can read them without translation.

---

## 5. Wave Budget System

Each encounter receives a **compute budget** based on ring and encounter type:

| Ring      | Budget per Wave | Waves | Total Budget | Example Composition                                                     |
| --------- | --------------- | ----- | ------------ | ----------------------------------------------------------------------- |
| **Outer** | 6               | 2–3   | 12–18        | 6× Routine Needles → 4× Routine Vectors + 2× Routine Needles           |
| **Mid**   | 10              | 3–4   | 30–40        | 4× Routine Vectors + 1× Iterant Mortar + 1× Iterant Relay + 2× Routine Needles |
| **Inner** | 16              | 3–5   | 48–80        | 2× Theorem Vectors + 1× Iterant Needle + 6× Routine Needles → 1× Axiom Bastion + 8× Routine Needles |
| **Core**  | 24              | 5+    | 120+         | Boss plus Theorem support equations; budget persists until win or death |

### Composition Rules

| Rule                            | Details                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| **Always include fodder**       | At least 30% of budget is Routine constructs; machines still need satisfying pop targets |
| **Max 1 Axiom per wave**        | Axioms are mini-bosses — one complete proof at a time                    |
| **Relays need a network**       | Relay frames only spawn alongside 2+ constructs                          |
| **Ciphers exploit attention**   | Cipher frames (if built) enter mid-wave after another unit establishes threat |
| **Show coordination**           | At least one formation, screen, relay, or synchronized attack per wave   |
| **Ramp up within a sector**     | Wave 1 is easier than Wave 3. The last wave is the hardest               |

---

## 6. Environment Bias Tables

Certain environments make certain traits more likely to appear:

| Environment              | Boosted Protocols                         | Suppressed Protocols | Signature Equation                                  |
| ------------------------ | ----------------------------------------- | -------------------- | --------------------------------------------------- |
| ⛏️ **Asteroid Field**    | Projection, Collision, Consensus          | Solution             | Projection Bastions drive Needles through rock gaps |
| 🌫️ **Nebula**            | Conditional, Skip, Desync                 | Solution             | Desynced Ciphers appear at measured blind angles    |
| 💥 **Debris Field**      | Cascade, Terminal, Fork                   | Orbit                | Terminal Mortars chain-react through wreckage       |
| 🧊 **Ice Field**         | Cryo, Self-Repair, Legacy                 | Thermal              | Legacy Cryo Bastions become moving walls            |
| 🌊 **Gas Giant Rings**   | Thermal, Iterative, Tangent               | Projection           | Iterative Vectors surf ring currents                |
| 🌋 **Supernova Remnant** | Thermal, Overclock, Prime                 | Cryo                 | Prime Vectors race the stellar collapse             |
| 🕳️ **Void Rift**         | Glitched, Skip, Desync, Harvest           | Consensus            | Glitched Ciphers exploit unstable geometry          |

Bias weights rather than forbids. The fiction is practical: the Equation observes
local conditions and compiles a suitable force. Nebula encounters become
information warfare; supernova encounters become violent overclock races.

---

## 7. Example Generated Enemies

| Ring  | Frame   | Protocols                              | Tier    | Player Read                                                        |
| ----- | ------- | -------------------------------------- | ------- | ------------------------------------------------------------------ |
| Outer | Needle  | Consensus                              | Routine | Four connected points move as one graph; break with AoE            |
| Outer | Vector  | _(none)_                               | Routine | Basic machine fighter and tutorial target                          |
| Mid   | Mortar  | Thermal, Cascade                       | Iterant | Burning branching payloads force constant movement                 |
| Mid   | Relay   | Coordinator, Barrier                   | Iterant | Protected command node; obvious priority target                    |
| Inner | Bastion | Projection, Self-Repair, Overclock     | Theorem | Flank the plate, interrupt repair, finish before the clock rises    |
| Inner | Cipher  | Skip, Harvest                          | Theorem | Disappears, strikes, repairs from the hit, then recalculates        |
| Core  | Vector  | Thermal, Iterative, Prime              | Axiom   | Gold theorem halo and a dense lattice of fire                      |
| Loop+ | Bastion | Projection, Barrier, Fabricator        | Axiom   | Armored mobile factory; a full-team solution                       |

### Shared-Intelligence Rules

- **Local graph, not psychic omniscience.** Relays and visible graph links explain
  shared aim and formation changes. Destroying or separating nodes degrades them.
- **Adaptation is encounter-scale.** The network may favor a counter-protocol in
  the next wave, but must never silently gain immunity during the current fight.
- **Machines may retreat.** A construct with poor expected value can disengage,
  screen a Relay, or rendezvous. Cold optimization is more distinctive than rage.
- **The player is the unknown variable.** Unusual builds, manual piloting, and
  co-op improvisation break predicted solutions. This is both lore and combat.
- **No fake mathematics.** Symbols may be abstract operational notation, but
  avoid decorative chalkboard equations or random strings of digits.

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
