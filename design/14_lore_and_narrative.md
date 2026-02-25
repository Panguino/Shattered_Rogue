# 📜 Lore & Narrative

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **Avorion-inspired mystery.** The player doesn't get a lore dump — they piece the story together through environmental details, station NPC fragments, event encounters, and artifact discoveries. The central question: _What broke the galaxy, and what's pouring through the wound?_

---

## 1. The World — Before the Shattering

Centuries ago, the **Linked Galaxy** was connected by a network of ancient **Resonance Gates** — massive ring-shaped structures that allowed instant travel between star systems. No one knew who built them. They predated every known civilization. They simply _were_, and everyone used them.

The Gates ran on **Resonance Crystals** — a rare mineral found deep in asteroid fields. The crystals hummed at a specific frequency that kept the Gates stable. Civilizations mined them, traded them, fought over them. The galaxy thrived.

Then, roughly 200 years ago, something went wrong.

---

## 2. The Shattering

A research coalition called the **Deepwell Consortium** was experimenting with Resonance Crystals at the galactic core. They believed the Gates were not just transportation — they were _containment_. The Gate network was a massive cage, keeping something locked on the other side.

They were right.

The Consortium punched through. They opened a **Breach** — a wound in space-time at the very center of the galaxy. For a brief moment, they saw the other side: a dimension of hostile, alien geometry. Something _looked back_.

The Breach destabilized every Resonance Gate simultaneously. They shattered — some exploded, some collapsed into spatial anomalies, some simply went dark. In an instant, the connected galaxy was severed into isolated pockets. Billions were stranded. Trade routes died. Civilizations fell.

And from the Breach, **they** came.

---

## 3. The Corruption — What Came Through

The entities that pour from the Breach have no official name. Station survivors call them different things:

| Name Used       | Who Uses It             | Connotation                                     |
| --------------- | ----------------------- | ----------------------------------------------- |
| **The Signal**  | Scientists, researchers | They seem to follow some coordinated pattern    |
| **The Rot**     | Miners, haulers         | They spread like an infection across sectors    |
| **Hollow**      | Fighters, mercs         | They look like corrupted versions of real ships |
| **Breach-born** | Station NPCs            | Neutral, descriptive                            |
| **The Swarm**   | Military remnants       | Emphasizes their endless numbers                |

> **Player perspective:** You don't learn the "true" name. Different NPCs use different terms. This creates the feeling that nobody truly understands what they're dealing with.

### What Are They?

The Breach-born are **parasites** — a jellyfish-like ooze that latches onto ships and technology, consuming and puppeting them. They are not mechanical and not fully organic. They pulse, throb, and spread across hulls like a bioluminescent cancer.

The parasite **glows purple-to-red** — a sickly luminescence that's visible from a distance. The glow intensifies the deeper into the galaxy you travel, because the corruption has had longer to take hold near the Breach.

### Corruption Gradient by Ring

| Ring           | Corruption Level | Visual Description                                                                                                                                                                                                       |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Outer Rim**  | 10–20%           | Ships look mostly normal. Faint purple veins along hull seams. Slight glow on weapon ports. You might mistake them for damaged ships at first glance.                                                                    |
| **Mid Ring**   | 40–60%           | Obvious infection. Purple-red tendrils crawl across the hull. Jellyfish membrane visible through cracked plating. Ship silhouette still recognizable but _wrong_.                                                        |
| **Inner Ring** | 70–90%           | More parasite than ship. The original hull is barely visible under pulsing ooze. Translucent jellyfish tendrils trail behind. Glowing red "organs" visible inside the mass.                                              |
| **The Core**   | 100%             | Pure alien forms. No ship underneath — the parasite has fully digested the host and shaped itself into something new. Writhing, bioluminescent jellyfish horrors with no resemblance to anything built by known species. |

> [!TIP]
> **The gradient is the storytelling.** A player in the Outer Rim sees slightly off ships and thinks "weird pirates." By the Inner Ring, they're fighting translucent ooze nightmares and _understanding_ what they're heading toward. The Core reveals the truth: the ships were never the enemy — the parasite was always the real thing.

Key characteristics:

- **They don't communicate.** No signals, no demands, no warnings — just the pulsing glow.
- **They corrupt what they touch.** The ooze spreads to debris, asteroids, even station hulls in infected sectors.
- **They never retreat.** The parasite fights until the host is destroyed — then the ooze dissipates.
- **They're getting stronger.** Closer to the core, the parasite has had centuries to evolve and the hosts are fully consumed.
- **More come every day.** The Breach is widening, and the ooze is spreading outward ring by ring.

> This ties directly to the [enemy catalog](06_enemy_catalog.md): the 6 chassis types are the host ships the parasite has consumed. Their procedural traits represent different stages and strains of infection — no two encounters are the same because the parasite mutates unpredictably.

---

## 4. The Outer Rim — Where You Start

The **Outer Rim Station** (your hub) is one of the last holdouts. It's a cobbled-together station built from Gate fragments and salvage, sitting at the very edge of the galaxy. It survives because the Breach-born haven't reached this far yet — _yet_.

The people here are survivors:

- **Dock crews** who used to work the Gate network
- **Researchers** studying Resonance Crystal fragments for clues
- **Mercenaries** running supplies between isolated settlements
- **Refugees** from inner systems overrun by the Swarm

Everyone on the station knows the same thing: **the Breach is growing**. If nobody closes it, the Rot will eventually reach the Outer Rim. There will be nowhere left to run.

You are one of many pilots who volunteer to make the inward run. Most don't come back.

---

## 5. The Three Glyphs — Run Goal

The Breach is protected by **three barriers** — concentric walls of Breach energy that burn anything that tries to pass through. Each barrier can only be bypassed by presenting an artifact that resonates with it: an alien object covered in unknowable symbols.

These **Glyphs** have no names — not in any language anyone speaks. They're fragments of whatever intelligence built the original Gates. Consortium records describe them only as "the keys the builders left behind." Each one looks like a chunk of impossible geometry, covered in shifting alien symbols that glow when near the Breach.

| Glyph              | Visual                                 | Location                  | How to Obtain                                       |
| ------------------ | -------------------------------------- | ------------------------- | --------------------------------------------------- |
| ◈ **First Glyph**  | Angular, metallic, cold blue shimmer   | Mid Ring — Nebula sectors | Dropped by a **Glyph Guardian** mini-boss           |
| ◈ **Second Glyph** | Curved, crystalline, deep violet pulse | Inner Ring — Void Rift    | Found in a special **Vault Event** encounter        |
| ◈ **Third Glyph**  | Organic-looking, warm red throb        | Inner Ring — Supernova    | Rewarded for defeating the **ring boss** holding it |

> [!NOTE]
> **The Glyphs are never explained.** The player doesn't get a tooltip saying "Gate Fragment #2." They're alien objects with alien writing that do something you don't fully understand. You just know: _bring three of them to the Breach, and you can get through._

### How Glyphs Work in Gameplay

| Mechanic                     | Details                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------- |
| **Persistent across deaths** | Glyphs are stored at the Hub station — displayed on a pedestal, not in inventory |
| **One per run (max)**        | You can only obtain one Glyph per run — finding one is a significant event       |
| **Run must succeed**         | You must **survive** the run (reach a station or extract) to keep the Glyph      |
| **Barrier key**              | Each Glyph bypasses one of the three barriers protecting the Breach              |
| **All 3 = final run**        | Collecting all 3 unlocks the **Breach Run** — a special endgame run              |

### Glyph Passive Bonuses

Each Glyph displayed in the Hub subtly strengthens all future runs — the alien symbols _resonate_ with the Breach energy in the galaxy, weakening it:

| Glyph Collected | Passive Bonus (All Future Runs)                         |
| --------------- | ------------------------------------------------------- |
| ◈ First Glyph   | Fog of war reduced — can see 2 sectors ahead on the map |
| ◈ Second Glyph  | +1 Jump Range on all hulls                              |
| ◈ Third Glyph   | Breach-born deal 10% less damage                        |

> **Narrative payoff:** The Glyphs don't explain themselves. They just _work_. The player feels the Breach weakening without understanding why — mirroring how everyone in the galaxy feels about the situation.

---

## 6. The Breach Run — Endgame

Once all 3 Glyphs are collected, the player can launch a **Breach Run** from the Hub. This is a special, unique run that replaces the normal galaxy grid:

### Breach Run Structure

```
OUTER RIM ──→ MID RING ──→ INNER RING ──→ THE CORE ──→ THE BREACH
    │              │              │              │              │
  Normal       Harder       Hardest     Shard Boss      FINAL BOSS
  sectors      sectors      sectors    "The Warden"    "The Architect"
  (3 sectors)  (3 sectors)  (2 sectors)  (1 sector)     (1 sector)
```

### The Warden (Penultimate Boss)

The **Warden** is the last protector of the Breach — a massive, corrupted construct that was once the Core Gate's defense system. It was built to protect the Gate, but the Breach corrupted it. Now it attacks anyone who approaches, friend or foe.

| Phase       | Behavior                                                       |
| ----------- | -------------------------------------------------------------- |
| **Phase 1** | Shield-based defense — summons orbiting Shield Drones          |
| **Phase 2** | Switches to aggressive — charging rams + sweeping beam attacks |
| **Phase 3** | Spawns Breach-born reinforcements while healing                |
| **Phase 4** | Desperate — EMP pulses that disable player systems temporarily |

> **Thematic beat:** The Warden isn't evil — it's _broken_. Environmental storytelling in the arena (Consortium logos on its hull, damaged Gate fragments orbiting it) tells the player this was once a protector that the Breach twisted.

### The Architect (Final Boss)

The **Architect** is what the Consortium found on the other side. It is the entity that opened the Breach from its dimension — the thing that _looked back_. It doesn't have a ship form. It is **the Breach itself**, made manifest — a colossal jellyfish horror of pulsing ooze and impossible geometry, filling the entire arena.

| Phase         | Behavior                                                                  |
| ------------- | ------------------------------------------------------------------------- |
| **Phase 1**   | Arena warps — gravity shifts, spatial distortion, projectiles curve       |
| **Phase 2**   | Summons evolution — copies of every enemy type you've fought this run     |
| **Phase 3**   | Direct assault — massive tendrils sweep the arena, ooze pools form        |
| **Phase 4**   | Collapse — arena shrinks, damage ramps, Architect is vulnerable at center |
| **Glyph Use** | Each Glyph activates during a specific phase, burning away barriers       |

> **The mystery resolved:** The Architect didn't invade — it was _summoned_. The Consortium's experiment was the real cause. The "enemies" are the Architect's immune response — the jellyfish ooze treats the galaxy as a foreign body and is trying to consume it. You're not saving the galaxy from an invasion — you're curing a parasitic infection that your own kind caused.

---

## 7. Environmental Storytelling

Lore is delivered through the environment, not cutscenes:

| Source                        | Example Content                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| **Wreckage scan data**        | Ship logs from Consortium expeditions — increasingly desperate                     |
| **Station NPC dialogue**      | Each NPC has 2–3 line fragments about their past, the Shattering, rumors           |
| **Event encounters**          | Some events reference Gate ruins, Consortium caches, Breach anomalies              |
| **Boss arena details**        | Consortium logos, old Gate fragments, corrupted tech in boss zones                 |
| **Glyph collection moments**  | Brief visual pulse — the Glyph's symbols flare, a barrier in the galaxy map cracks |
| **Item flavor text**          | Weapons and modules have lore-relevant descriptions                                |
| **Breach corruption visuals** | Purple-red ooze on asteroids, pulsing tendrils on wreckage, jellyfish in the void  |

### Lore Fragment Categories

| Category              | Count | Found In                    | Reveals                                            |
| --------------------- | ----- | --------------------------- | -------------------------------------------------- |
| **Consortium Logs**   | 12    | Wreckage scans, events      | What the Consortium was doing and why              |
| **Survivor Stories**  | 8     | Station NPCs                | Personal accounts of the Shattering                |
| **Gate Codex**        | 6     | Glyph events, hidden caches | History of the Gate network, who built them        |
| **Breach Analysis**   | 6     | Research Lab events, scans  | What the other dimension is, the parasite's nature |
| **Old World Records** | 5     | Derelict sectors, vaults    | What the galaxy was like before the Shattering     |

> **Total: 37 lore fragments.** Collecting all of them is an achievement ("Archivist") and unlocks an optional lore codex in the Trophy Room.

---

## 8. Post-Breach Content (Loop+ / New Game+)

After closing the Breach, the story doesn't end — it _shifts_:

| Phase             | Narrative                                                                                                    | Gameplay Effect                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Breach Sealed** | The Architect is defeated. The Breach closes. The galaxy begins healing.                                     | Credits roll. Unlock Loop+ mode.                              |
| **Loop+ Runs**    | Something is wrong. Residual Breach energy lingers. New anomalies appear.                                    | Harder enemies, remixed traits, new modifiers.                |
| **The Echo**      | The Architect left something behind — an _echo_ that's building toward reopening the Breach.                 | New event types, corrupted stations, new boss variants.       |
| **True Ending**   | Complete a Loop+ run at Heat 16+ to face **The Echo** — a weakened but persistent fragment of the Architect. | Unique boss fight, true ending cutscene, exclusive cosmetics. |

> **Why Loop+ narratively?** The Breach didn't close cleanly. The infection left scars. This justifies why the galaxy is still dangerous after victory, and gives a narrative reason for escalating difficulty.

---

## 9. Naming Conventions

| Entity                 | Name                                               | Origin                                             |
| ---------------------- | -------------------------------------------------- | -------------------------------------------------- |
| Galaxy                 | **The Linked Galaxy**                              | Named for the Gate network that connected it       |
| The catastrophe        | **The Shattering**                                 | When the Gates exploded/collapsed                  |
| The wormhole           | **The Breach**                                     | Wound in space-time at the galactic core           |
| The enemy faction      | **Breach-born** (neutral) / **The Rot** (informal) | Multiple names — nobody agrees                     |
| The parasite           | **The Ooze** (informal)                            | Jellyfish-like organism that puppets host ships    |
| The research group     | **Deepwell Consortium**                            | They dug too deep into Gate technology             |
| The run goal artifacts | **Glyphs** (unnamed)                               | Alien fragments with unknowable symbols            |
| The player hub         | **Outer Rim Station**                              | Last holdout at galaxy's edge                      |
| The crystal fuel       | **Resonance Crystals**                             | What powered the Gates (now Warp Crystals in-game) |
| The penultimate boss   | **The Warden**                                     | Corrupted Gate guardian                            |
| The final boss         | **The Architect**                                  | Colossal jellyfish entity from the other dimension |
| Post-game threat       | **The Echo**                                       | Residual fragment of the Architect                 |

> [!TIP]
> **Warp Crystals = Resonance Crystals.** The in-game currency is actually fragments of the same material that powered the Gates. The player is spending pieces of the old world to navigate the broken new one. This can be referenced in flavor text but never stated outright — let players connect the dots.

> [!TIP]
> **The purple-red glow is your threat meter.** If a player sees faint purple veins on a ship, they know it's Outer Rim-level danger. If they see a writhing red mass of tendrils, they know they're deep. The visual language teaches the player without a single word of UI text.
