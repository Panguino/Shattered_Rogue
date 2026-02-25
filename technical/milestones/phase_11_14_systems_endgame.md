# Phases 11–14 — Systems, Stations, Events & Endgame

---

## Phase 11 — Difficulty/Heat System

---

### 11.1 Heat System

#### 11.1.1 Create UHeatSubsystem

- a. Create `ShatteredCore/Public/HeatSubsystem.h` inheriting `UGameInstanceSubsystem`
- b. Add `TMap<FName, int32> ActiveModifiers` — modifier name → selected rank (0-4)
- c. Add `UFUNCTION`: `GetTotalHeat() → int32` — sum of all active modifier ranks
- d. Add `UFUNCTION`: `SetModifierRank(FName Modifier, int32 Rank)`
- e. Add `UFUNCTION`: `GetRewardMultiplier() → float` — scales with total heat
- f. Total heat persists per-run only (reset between runs)

#### 11.1.2 Create Heat modifier DataTable

- a. `FHeatModifier` struct: `FName Name`, `FText Description`, `int32 MaxRank`, `TArray<float> RankValues`
- b. Create `DT_HeatModifiers` DataTable with 12 modifiers from design doc 11:
- c. Enemy HP+ (10/20/35/50%), Enemy Damage+ (10/20/35/50%), Faster Enemies (+10/20/30/40% speed)
- d. Fewer Stations (remove 1/2/3/all), Reduced Drops (-15/30/50/75% loot chance)
- e. No Shield Regen, Fog of War (no reveals), Corruption Surge (+1/2/3 traits on enemies)
- f. Boss Enrage (boss gains +1/2/3 phases), Timed Run (10/8/6/4 min limit)
- g. Iron Will (1 life, no revives), Breach Leak (random Void damage pulses every 30/20/15/10s)

#### 11.1.3 Create Heat selection UI

- a. Create `WBP_HeatSelect` — pre-run panel showing all 12 modifiers
- b. Each modifier: name, description, rank slider (0 to MaxRank)
- c. Show individual heat contribution per modifier
- d. Bottom: total heat score display, reward multiplier preview
- e. Style: warning colors — higher ranks use redder tones
- f. Accessible from Hub before launching a run

#### 11.1.4 Implement modifier effects

- a. On run start: read all active modifiers from HeatSubsystem
- b. Enemy HP+: multiply enemy MaxHP in spawn function
- c. Enemy Damage+: multiply enemy weapon damage in DataTable lookup
- d. Fewer Stations: remove Station sectors from galaxy map during generation
- e. Each modifier applies to its relevant system during initialization
- f. Modifiers stack with co-op scaling (multiplicative)

#### 11.1.5 Implement Heat-based rewards

- a. `GetRewardMultiplier()`: base 1.0, each heat point adds 0.05 (5%)
- b. Apply to: RD drops, rarity roll bonuses, mineral amounts
- c. At Heat 20: 2× reward multiplier (double everything)
- d. Display multiplier on HUD during run: "Heat: 15 (×1.75)"

#### 11.1.6 Create Heat achievements

- a. "Warm Up": complete a run at Heat 5+
- b. "Getting Hot": complete a run at Heat 15+
- c. "Inferno": complete a run at Heat 30+
- d. "Masochist": complete a run with ALL modifiers at max rank
- e. Rewards: unique cosmetics, RD bonuses, hull/profession unlocks

#### 11.1.7 Display Heat on run HUD

- a. Small flame icon + number in top-left corner near HP bar
- b. Color scales: white (<5), yellow (5-15), orange (15-25), red (25+)
- c. Shows reward multiplier on hover/tooltip

---

## Phase 12 — Full Stations & Hub

---

### 12.1 Remaining Station Types

#### 12.1.1 Create Trade Post

- a. Create `AStationTradePost` — station variant for buying/selling
- b. Trade Post UI: shop grid showing weapons and modules for sale
- c. Prices: Minerals to buy, scaled by rarity (Common=30, Uncommon=60, Rare=120, Epic=250)
- d. Sell items from cargo: 40% of buy price (Smuggler profession: 55%)
- e. Inventory: randomly generated per visit from available weapon/module pool
- f. 5-8 items available per Trade Post visit
- g. Restocks only on revisit (different items)

#### 12.1.2 Create Research Lab station

- a. `AStationResearchLab` — in-run research opportunities
- b. Services: Sector Scan (reveal all adjacent sectors, costs 5 RD), Weapon Analysis (reveal all weapon stats in cargo)
- c. In-run buff: "Overcharge" — +20% damage for 3 sectors, costs 10 RD
- d. In-run buff: "Fortified Shields" — +50% shield for 3 sectors, costs 8 RD
- e. Buffs are temporary (run-local), purchased with RD

#### 12.1.3 Create Black Market

- a. `AStationBlackMarket` — rare station type, risky deals
- b. Sells contraband items: very powerful but with drawbacks
- c. Example: "Overclocked Engine" — +40% speed but -20% HP
- d. Prices: high Minerals, Smuggler discount applies
- e. Buying from Black Market increases Wanted level (+5)
- f. Exclusive items not available at regular stations

#### 12.1.4 Create station-specific UIs

- a. Each station type gets a unique widget skin (color/icon theme)
- b. Trade Post: gold/merchant theme, coin icons
- c. Research Lab: blue/tech theme, circuit patterns
- d. Black Market: dark purple/red theme, skull motifs
- e. Shipyard (existing): industrial grey/blue theme
- f. All stations share base layout: left info panel, center actions, right cargo view

---

### 12.2 Full Hub Station

#### 12.2.1 Create 3D Hub environment

- a. Create `Map_Hub` level with 3D background: Outer Rim Station exterior vista
- b. Vista: space station silhouette, nebula backdrop, docked ships in background
- c. Parallax: slight camera movement/drift for lively feel
- d. Lighting: warm, safe ambience — contrast with dark dangerous run environments

#### 12.2.2 Create Hub areas (menu-driven)

- a. Hangar: ship preview + launch run (select hull/profession, review loadout)
- b. Research Lab: spend RD on permanent unlocks (existing from Phase 5)
- c. Armory: toggle pool management, weapon catalog viewer
- d. Trophy Room: achievements, statistics, lore codex
- e. Cantina: NPC dialogues, daily challenge board
- f. Mission Board: view available run modifiers (Heat selection)
- g. Comm Station: multiplayer lobby creation/joining
- h. Settings: audio, video, controls, accessibility

#### 12.2.3 Create Hub NPCs

- a. 4-6 NPC characters, each representing a Hub area
- b. Each NPC: name, portrait image, 2-3 lore dialogue lines
- c. NPC dialogue system: simple text display, advance with click
- d. Dialogue changes based on player progression (early, mid, late game)
- e. Example: dockmaster comments on ship damage, researcher praises discoveries

#### 12.2.4 Hub visual progression

- a. Hub starts sparse/damaged at game start
- b. As player completes milestones: Hub visually upgrades
- c. Examples: lights turn on, hull repairs appear, new ship models dock in background
- d. Environmental storytelling: Hub gets better as player progresses

#### 12.2.5 Trophy Room

- a. Create `WBP_TrophyRoom` widget — grid of achievement cards
- b. Each card: achievement icon, name, description, progress bar, completed date
- c. Locked achievements: show silhouette icon, "???" description
- d. Career stats summary: total runs, best streak, total kills, playtime
- e. Lore codex tab: organized by category (see Phase 13)

---

## Phase 13 — Full Events & Lore

---

### 13.1 Remaining Events (19 More)

#### 13.1.1 Implement all 22 events

- a. Reference design doc 05 for complete event list
- b. Per event: create DataTable row (description, choices, outcomes, weights)
- c. Per event: create unique event trigger visual (beacon style varies)
- d. Per event: implement outcome logic (spawn enemies, grant rewards, apply effects)
- e. Per event: add 1-2 profession-specific bonus choices
- f. Events grouped by category: combat events, exploration events, social events, mystery events
- g. Batch implement: ~4 events per work session, test each individually

#### 13.1.2 Create event frequency system

- a. Weighted random selection from available event pool
- b. No repeats within same run (each event can appear at most once per run)
- c. Sector type biasing: Mining sectors get exploration events, Combat sectors get combat events
- d. Ring biasing: outer events are safer/simpler, inner events are more dangerous/rewarding
- e. Profession biasing: certain events appear more often with relevant profession

#### 13.1.3 Profession-gated choices

- a. Per event: add optional choice with `RequiredProfession` field
- b. Only visible if player has matching profession
- c. Profession choices always offer better risk/reward than generic options
- d. Example: Engineer can "Hack the System" in derelict events (guaranteed safe outcome)
- e. Smuggler can "Bribe" in hostile encounter events (avoid combat)

---

### 13.2 Lore Fragment System

#### 13.2.1 Create lore fragment collectible

- a. `FLoreFragment` struct: `FName ID`, `ELoreCategory Category`, `FText Title`, `FText Content`
- b. 5 categories: The Shattering, The Breach, Ancient Civilization, Survivor Accounts, Breach-born
- c. 37 total fragments distributed across the game
- d. Create `DT_LoreFragments` DataTable with all 37 entries

#### 13.2.2 Create lore codex UI

- a. Create `WBP_LoreCodex` — accessible from Trophy Room in Hub
- b. 5 tabs for categories, each showing fragment cards
- c. Collected: full text visible, atmospheric border art
- d. Uncollected: silhouette card with "???" and hint text ("Found in Nebula sectors")
- e. Progress counter per category: "3/8 collected"

#### 13.2.3 Scatter fragments

- a. 10 fragments: found during specific events (unique event outcome)
- b. 8 fragments: scan interactions at special points in specific environments
- c. 7 fragments: dropped by specific boss encounters (first kill only)
- d. 6 fragments: found in wreckage/derelict exploration events
- e. 6 fragments: purchased at Research Lab stations (rare inventory item)
- f. Each fragment has a fixed acquisition method — not random

#### 13.2.4 Archivist achievement

- a. "Archivist": collect all 37 lore fragments
- b. Reward: unique Legendary specialty item themed around lore
- c. Achievement tracks in Trophy Room
- d. Final fragment collected triggers special cinematic or dialogue

---

## Phase 14 — Endgame: Glyphs & Breach Run

---

### 14.1 Glyph System

#### 14.1.1 Create UGlyphSubsystem

- a. Create `ShatteredCore/Public/GlyphSubsystem.h` inheriting `UGameInstanceSubsystem`
- b. Add `UPROPERTY(SaveGame)`: `TArray<bool> CollectedGlyphs` — 3 slots, persistent
- c. Add `UFUNCTION`: `CollectGlyph(int32 Index)`, `HasAllGlyphs() → bool`, `GetGlyphCount() → int32`
- d. Save/load with player save game

#### 14.1.2 Create 3 Glyph encounters

- a. Glyph 1: Dropped by first Ring 1 boss defeat (mini-boss variant)
- b. Glyph 2: Found in special "Vault" event in Ring 2 (requires solving a puzzle)
- c. Glyph 3: Dropped by Core ring boss (strongest non-Breach boss)
- d. Each glyph pickup has unique alien symbol VFX — floating geometric form

#### 14.1.3 Create Glyph pickup VFX

- a. `NS_GlyphPickup` — alien symbol flares with bright teal energy
- b. On collect: galaxy map shows barrier cracking animation
- c. Camera zoom + slow-mo moment (0.5s) to emphasize significance
- d. Audio: deep resonant chime + alien whisper sound
- e. Each glyph has distinct symbol shape (triangle/circle/diamond)

#### 14.1.4 Implement Glyph passive bonuses

- a. 1 Glyph: fog of war reduced (reveal 2 more hexes on visit)
- b. 2 Glyphs: +1 jump range on all hulls
- c. 3 Glyphs: -15% all damage taken (permanent during run)
- d. Bonuses apply to all subsequent runs once glyphs are collected
- e. Show active bonuses on Hub screen

#### 14.1.5 Hub Glyph display

- a. In Hub Trophy Room: 3 pedestals for Glyphs
- b. Collected glyphs float above pedestals with idle animations
- c. All 3 collected: pedestals glow, Breach Run becomes available
- d. Text: "The path to the Breach is open." displayed when all 3 placed

---

### 14.2 Breach Run

#### 14.2.1 Create Breach Run game mode

- a. Special run type, only available after collecting all 3 Glyphs
- b. Linear structure: 4 sequential phases, no galaxy map choice
- c. Higher difficulty: enemies start at max corruption, Heat modifiers amplified
- d. No stations mid-run (must be fully prepared before starting)

#### 14.2.2 Create gauntlet sector

- a. Phase 1: continuous enemy waves with escalating budget
- b. 5 waves with no calm period — relentless pressure
- c. Budget: [20, 30, 40, 50, 60] — very intense
- d. All chassis types, all traits active, max corruption
- e. Survival test: player must endure to proceeed

#### 14.2.3 Create The Warden (penultimate boss)

- a. Phase 2: boss fight against The Warden — corrupted Gate guardian
- b. HP: 800, Shield: 400, 3 phases (at 66% and 33%)
- c. Phase 1: standard attacks + rotating shield (like M3 boss but harder)
- d. Phase 2: spawns paired Strikers, does beam sweep + charge attacks
- e. Phase 3: enraged, all attacks faster, AoE fields on ground
- f. Lore: The Warden once guarded the Breach barrier, now corrupted by it

#### 14.2.4 Create Breach corridor

- a. Phase 3: visual transition into the Breach dimension
- b. Environment: reality warps — space tears, color shifts, geometry distortion
- c. No enemies — 30s atmospheric transition with narrative voiceover/text
- d. Lighting shifts from normal space to alien (purple-red, hostile, otherworldly)
- e. Ship shakes/sparks — entering the Breach is physically damaging to the ship
- f. Player takes 10% max HP damage as "Breach toll"

#### 14.2.5 Create The Architect (final boss)

- a. Phase 4: final boss — The Architect, colossal jellyfish entity
- b. Fully organic model: massive bioluminescent jellyfish (~500 unit diameter)
- c. HP: 1200, Shield: 600, 4 phases (at 75%, 50%, 25%)
- d. Phase 1: tentacle sweeps (huge beam-like attacks, dodge zones)
- e. Phase 2: summons Breach-born minions continuously, creates void zones
- f. Phase 3: arena shrinks (Breach closing in), attacks intensify
- g. Phase 4: desperation — all attacks overlap, player must use Glyph activations

#### 14.2.6 Implement Glyph activation

- a. During Architect fight: 3 Glyph activation points appear at phase transitions
- b. Player flies to Glyph point → activate → deals massive damage to boss + VFX explosion
- c. Each Glyph activation weakens one of the boss's abilities permanently
- d. Glyph 1: removes tentacle sweep. Glyph 2: stops summoning. Glyph 3: prevents arena shrink.
- e. VFX: Glyph symbols flare, Architect recoils with alien screech

#### 14.2.7 Create ending cinematic

- a. On Architect death: massive implosion VFX (Breach closing)
- b. Camera pulls out to galaxy map view: Breach location seals
- c. Ring corruption levels decrease visually across the map
- d. Text: "The Breach has been sealed... for now."
- e. Roll credits over galaxy map vista (or save for full release)
- f. Return to Hub: Hub is visually upgraded to pristine state

---

### 14.3 Loop+ / New Game Plus

#### 14.3.1 Create The Echo

- a. Post-Breach completion: narrative fragment establishes "The Echo"
- b. The Echo: a splinter of The Architect that survived, justifying NG+
- c. Hub NPC dialogue changes: "Something still stirs in the dark..."
- d. New threat indicator on galaxy map: faint corruption returning

#### 14.3.2 Implement NG+ scaling

- a. On completing Breach Run: unlock Loop+ difficulty
- b. Loop+ enemies: +50% HP, +25% damage, +1 trait baseline
- c. Loop+ loot: +100% rarity chance, guaranteed Epic/Legendary drops increase
- d. Loop+ modifiers: new Heat modifiers unlocked (Loop+ exclusive)
- e. Stackable: each Breach completion increases Loop+ level (NG+2, +3, etc.)

#### 14.3.3 Create Loop+ galaxy map variations

- a. New sector layouts: different hex patterns per Loop+ level
- b. Elite encounters: corrupted station events, ambush sectors
- c. New boss variants: Breach-tainted versions of existing bosses with bonus phases
- d. Each Loop+ level adds visual corruption to the galaxy map itself
