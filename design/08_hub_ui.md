# 🏠 Hub UI — Outer Rim Station

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **The main menu IS the station.** All pre-run activities — ship selection, meta-progression, cosmetics, co-op lobby — take place in a fully 3D **Outer Rim Station** that the player walks/flies through. As you unlock content, the station visually evolves.

---

## 1. Station Layout (8 Areas)

```
╔═══════════════════════════════════════════════════════════╗
║                 OUTER RIM STATION — HUB MAP              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║    ┌──────────┐    ┌──────────┐    ┌──────────┐          ║
║    │ HANGAR   │────│ CORRIDOR │────│ LOUNGE   │          ║
║    │ (ships)  │    │ (walk)   │    │ (co-op)  │          ║
║    └────┬─────┘    └────┬─────┘    └──────────┘          ║
║         │               │                                 ║
║    ┌────┴─────┐    ┌────┴─────┐    ┌──────────┐          ║
║    │ WORKSHOP │    │ RESEARCH │────│ ARMORY   │          ║
║    │ (cosmetics)│  │ LAB      │    │ (loadout)│          ║
║    └──────────┘    └────┬─────┘    └──────────┘          ║
║                         │                                 ║
║    ┌──────────┐    ┌────┴─────┐                          ║
║    │ TROPHY   │────│ COMMAND  │                          ║
║    │ ROOM     │    │ BRIDGE   │                          ║
║    │ (achieve) │   │ (launch) │                          ║
║    └──────────┘    └──────────┘                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Area Details

| #   | Area                  | Function                                  | Visual Theme                                | Unlock State                            |
| --- | --------------------- | ----------------------------------------- | ------------------------------------------- | --------------------------------------- |
| 1   | 🚀 **Hangar Bay**     | Ship selection (Hull × Profession)        | Open bay, ships on platforms, launch tubes  | Ships appear as you unlock them         |
| 2   | 🔬 **Research Lab**   | Meta-progression spending (Research Data) | Tech lab, data terminals, holographic trees | Terminals activate as content unlocks   |
| 3   | ⚔️ **Armory**         | Starting loadout configuration            | Weapon racks, module shelves, ammo crates   | Racks fill as you unlock starter items  |
| 4   | 🎨 **Workshop**       | Cosmetic shop (skins, trails, paint)      | Paint booth, mannequins, color swatches     | Displays unlock as you buy cosmetics    |
| 5   | 🍺 **Crew Lounge**    | Co-op lobby, matchmaking, friends list    | Bar, tables, pilot NPCs milling about       | More NPCs appear based on play history  |
| 6   | 🏆 **Trophy Room**    | Achievements, stats, lore fragments       | Display cases, holograms, trophies          | Cases fill as you complete achievements |
| 7   | 🌌 **Command Bridge** | Launch run, galaxy overview, settings     | Captain's chair, star map, giant viewscreen | Star map reveals more as you explore    |
| 8   | 🔧 **Corridor**       | Walking path connecting areas             | Industrial, pipes, ambient sound, posters   | Posters/decorations change seasonally   |

---

## 2. Unlock Manifestation

The station is a **physical representation of your progress.** As you unlock content, the station changes:

| Progress                    | Station Change                                                     |
| --------------------------- | ------------------------------------------------------------------ |
| **Unlock a new hull**       | A new ship appears in the Hangar Bay on its own platform           |
| **Unlock a new profession** | A new NPC appears in the Lounge representing that profession       |
| **Buy a cosmetic skin**     | The Workshop displays it on a mannequin / wall mount               |
| **Complete an achievement** | A trophy/hologram appears in the Trophy Room                       |
| **Unlock all hulls**        | Hangar Bay gets an overhead light show + atmospheric upgrade       |
| **First Loop+ clear**       | Command Bridge gets a golden star chart + victory fanfare on entry |
| **100% completion**         | Station exterior transforms — neon signs, particle effects, music  |

> **The station tells your story.** A brand-new player sees an empty, dark station with 2 ships. A veteran sees a fully-lit station packed with trophies, all 6 ships gleaming, NPCs chatting, cosmetics displayed everywhere. It's the most visceral progress indicator possible.

---

## 3. Station Mood & Atmosphere

| Element           | Details                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| **Lighting**      | Warm ambient, neon accent colors matching unlocked hull types                |
| **Music**         | Chill lo-fi / ambient space music. Changes based on area (Armory = military) |
| **NPCs**          | Pilots, engineers, scientists mill about. More appear as you play            |
| **Ambient Sound** | Hum of station, distant radio chatter, engine startup sounds from Hangar     |
| **Weather**       | Station windows show space weather — nebulae, asteroids drifting, stars      |
| **Interactables** | Arcade machine (minigame), jukebox (music select), target range (practice)   |

---

## 4. Area-Specific UX

### 🚀 Hangar Bay (Ship Select)

- Ships sit on individual landing pads with holographic nameplates
- Walk up to a ship → holographic stat card appears showing Hull stats + unique mechanic
- Select Hull → then choose Profession from a terminal next to the ship
- Camera zooms into the cockpit → transition to Command Bridge for launch

### 🔬 Research Lab (Meta-Progression)

- Large central holographic tech tree
- Walk up to a terminal → browse Content Unlocks, Toggle Pool, Cosmetic Shop
- Purchased items physically appear on shelves behind the terminal
- Scientist profession NPCs offer commentary and tips

### ⚔️ Armory (Loadout)

- Weapon racks on walls, module shelves, specialty equipment cases
- Walk up to a rack → select starting weapon from unlocked options
- 3D preview of each weapon with stats overlay
- Found weapons unlock as starter choices — new ones get a "NEW" tag

### 🏆 Trophy Room

- Glass display cases line the walls
- Each achievement has a dedicated case with a holographic trophy
- Walking near a case triggers a brief replay of the achievement moment
- Stats terminal in the center shows lifetime stats, run history, leaderboards

### 🌌 Command Bridge (Launch)

- Captain's chair in center, star map on floor/ceiling
- Sit in chair → galaxy grid overview appears
- "LAUNCH RUN" button — dramatic launch sequence
- Settings, audio, controls accessible from bridge terminals
