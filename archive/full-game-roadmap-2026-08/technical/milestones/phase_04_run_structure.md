# Phase 4 — M3: Run Structure

---

## 4.1 Galaxy Map System

### 4.1.1 Create UGalaxyMapSubsystem

- a. Create `ShatteredWorld/Public/GalaxyMapSubsystem.h` inheriting `UWorldSubsystem`
- b. Add `UPROPERTY`: `TArray<FSectorNode> Sectors` — all sectors in current run
- c. Add `UPROPERTY`: `int32 CurrentSectorIndex` — player's current position
- d. Add `UPROPERTY`: `bool bMapIsOpen` — tracks if galaxy map UI is visible
- e. Add `UFUNCTION`: `GenerateMap(int32 Seed)`, `GetSector(int32 Index)`, `TravelToSector(int32 Index)`
- f. Add delegates: `FOnSectorChanged`, `FOnMapRevealed`
- g. Initialize in `AShatteredGameMode::StartPlay()` before first sector loads

### 4.1.2 Create FSectorNode struct

- a. In `ShatteredCore/Public/Types/ShatteredSectorData.h` (already has FSectorData)
- b. Add/extend: `FVector2D MapPosition` — 2D coordinate on galaxy map display
- c. Add: `ESectorType SectorType` — Combat, Mining, Station, Boss, Event
- d. Add: `EShatteredEnvironment Environment` — visual theme of the sector
- e. Add: `TArray<int32> ConnectedSectors` — indices of adjacent sectors for travel
- f. Add: `bool bIsRevealed = false`, `bool bIsVisited = false`, `bool bIsCompleted = false`
- g. Add: `int32 DifficultyTier` — 1-5, scales enemy budgets and loot quality

### 4.1.3 Generate linear 5-sector chain

- a. In `GenerateMap()`: create 5 FSectorNode entries
- b. Sector 0 (Start): SectorType=Combat, Difficulty=1, Revealed=true, Visited=true
- c. Sectors 1-3: randomly assign Combat, Mining, or Station
- d. Sector 4 (Final): SectorType=Boss, Difficulty=3
- e. Connect linearly: Sector 0→1, 1→2, 2→3, 3→4
- f. Set MapPositions in ascending X for horizontal layout display
- g. Use `FRandomStream(Seed)` for deterministic generation — same seed = same map

### 4.1.4 Assign sector types

- a. For sectors 1-3, create weighted random pool: Combat=50%, Mining=25%, Station=15%, Event=10%
- b. Roll for each sector using random stream
- c. Track assigned types — store for guarantee logic
- d. Also assign environment randomly: AsteroidField (MVP — only option initially)
- e. Set difficulty tier: Sector 1=1, Sector 2=2, Sector 3=2, Sector 4=3

### 4.1.5 Guarantee Station placement

- a. After initial type assignment, check if any sector is Station type
- b. If no Station: force Sector 2 (middle) to Station type
- c. Log the override for debugging: `UE_LOG(LogShattered, Log, TEXT("Forced Station at Sector 2"))`
- d. This guarantees player always has at least one repair/shop opportunity per run

### 4.1.6 Create UGalaxyMapWidget

- a. Create `ShatteredUI/Public/GalaxyMapWidget.h` inheriting `UUserWidget`
- b. Create `WBP_GalaxyMap` Widget Blueprint
- c. Layout: dark background panel, sector nodes as clickable button/icon widgets
- d. Each node: circle icon with sector type symbol (swords=Combat, pickaxe=Mining, wrench=Station, skull=Boss, ?=Unknown)
- e. Draw lines between connected sectors using `UBorder` or custom paint override
- f. Color coding: grey=unrevealed, white=revealed, green=visited, gold=current, red=boss
- g. Full-screen overlay — toggle with Tab key (IA_ToggleMap)

### 4.1.7 Implement sector selection

- a. On sector node click: check if sector is connected to current sector
- b. If connected and not current: highlight as selected, show "Jump" button
- c. On "Jump" confirm: call `GalaxyMapSubsystem->TravelToSector(SelectedIndex)`
- d. If not connected: show "Out of Range" tooltip, do nothing
- e. Disable selection for already-completed sectors (optional: allow revisit for mining?)
- f. Close map widget after jump is confirmed

### 4.1.8 Implement fog of war

- a. On map generation: only Sector 0 is revealed (`bIsRevealed = true`)
- b. All other sectors: show as "?" icon on map, type unknown
- c. When player visits a sector: reveal that sector + all connected sectors
- d. Set `bIsRevealed = true` for newly revealed sectors
- e. Revealed sectors show their type icon but remain grey until visited
- f. Boss sector (final): always reveal its existence but not its type until adjacent is visited

---

## 4.2 Sector Loading & Transitions

### 4.2.1 Create ASectorManager

- a. Create `ShatteredWorld/Public/SectorManager.h` inheriting `AActor`
- b. Add `UPROPERTY`: `FSectorNode CurrentSectorData` — active sector configuration
- c. Add `UPROPERTY`: `ESectorState State` — Loading, Active, Completed, Transitioning
- d. Add `UFUNCTION`: `LoadSector(FSectorNode Data)`, `CompleteSector()`, `BeginTransition()`
- e. Responsible for spawning environment, enemies, stations based on sector type
- f. One SectorManager persists across sectors — reconfigures rather than respawns

### 4.2.2 Create sector level template

- a. Create `Map_SectorTemplate` — base level with arena volume + skybox + lighting
- b. Add `AArenaVolume` at center, default size 10000×10000
- c. Add `ASpawnManager` with configurable wave definitions
- d. Add spawn points around perimeter (12 evenly spaced)
- e. Add `ASectorManager` — will configure everything at runtime based on sector data
- f. Template is reused for all sector types — sector-specific content is spawned dynamically

### 4.2.3 Implement jump gate actor

- a. Create `AJumpGate` actor — visible gate structure at sector edge
- b. Add mesh: large ring/arch structure with energy field inside
- c. Add `USphereComponent* InteractRange` — radius 300, overlap triggers prompt
- d. On player overlap: show "Press E to Jump" prompt widget
- e. On interact: check sector is complete → if yes, call `SectorManager->BeginTransition()`
- f. If sector not complete: show "Clear all threats first" message
- g. Gate mesh has idle VFX: shimmering portal effect inside the ring

### 4.2.4 Create warp transition

- a. Create `WBP_WarpTransition` widget — full-screen effect
- b. Effect: star streak lines radiating from center (hyperspace effect)
- c. Duration: 0.5s — fast, doesn't break flow
- d. Sequence: fade to star streaks (0.2s) → hold (0.1s) → fade to new sector (0.2s)
- e. During transition: unload current sector content, load new sector content
- f. Use `UGameplayStatics::OpenLevel` with streaming or `StreamLevel` approach
- g. Play warp SFX: accelerating whoosh → tunnel rumble → deceleration whoosh

### 4.2.5 Implement sector entry cinematic

- a. On sector load complete: brief camera pan showing the sector (2s)
- b. Camera starts zoomed out (+500 height), pans across sector highlights
- c. Shows environment type, asteroid density, any visible stations
- d. After 2s: camera snaps to player ship position, normal gameplay resumes
- e. Player input disabled during pan (auto-releases after 2s or skip with any button)
- f. Show sector name banner at top: "SECTOR 3 — ASTEROID FIELD" (fade in/out)

### 4.2.6 Track sector completion

- a. Combat sector: completed when `SpawnManager->OnAllWavesCompleted` fires
- b. Mining sector: completed when all mineral-rich asteroids are broken OR timer expires
- c. Station sector: completed immediately on load (no combat requirement)
- d. Boss sector: completed when boss dies
- e. Event sector: completed when event is resolved (choice made, outcome played)
- f. On completion: set `CurrentSectorData.bIsCompleted = true` in galaxy map subsystem
- g. Activate jump gate highlight — glow intensifies, audio chime plays

### 4.2.7 Show jump gate highlight

- a. On sector complete: enable `NS_JumpGateReady` VFX on gate — bright pulse
- b. Gate ring material shifts from dim to bright (emissive parameter ramp)
- c. Portal effect inside ring activates (was inactive/dim before completion)
- d. Play "gate ready" audio: rising chime + hum
- e. Show HUD marker arrow pointing toward gate from player position
- f. First-time tip: "Gate Activated — Proceed to next sector"

---

## 4.3 Combat Sector

### 4.3.1 Combat sector uses M2 wave spawning

- a. When `SectorManager` loads a Combat sector: configure `SpawnManager` with wave defs
- b. Use existing wave system from Phase 3 (3.6)
- c. Set `MaxWaves = 3` for standard combat sectors
- d. Enemies spawn from sector perimeter spawn points
- e. Completion: all 3 waves cleared

### 4.3.2 Scale wave budgets by sector position

- a. Create scaling function: `int32 GetWaveBudget(int32 WaveNumber, int32 DifficultyTier)`
- b. Difficulty 1: budgets [6, 10, 15] for waves 1-3
- c. Difficulty 2: budgets [10, 16, 24]
- d. Difficulty 3: budgets [15, 24, 35]
- e. Apply scaling in `SpawnManager` configuration based on `CurrentSectorData.DifficultyTier`
- f. Also scale allowed chassis: higher tiers unlock Bombers in Wave 1

### 4.3.3 Spawn mineral deposits between waves

- a. During calm period between waves: spawn 5-8 breakable asteroids with minerals
- b. Place them scattered in arena, away from spawn points
- c. Gives player something to do during calm — break rocks, collect minerals
- d. Mineral amounts scale with difficulty tier

### 4.3.4 Add completion reward

- a. On all waves cleared: spawn bonus loot at arena center
- b. Bonus: 1 large mineral cluster (30-50 Minerals) + chance for weapon drop
- c. Create `ARewardChest` actor — glowing container that opens on interact
- d. Opening animation: chest opens, loot bursts out with gold particle shower
- e. Reward quality scales with difficulty tier (higher tier = better rarity chances)

---

## 4.4 Mining Sector

### 4.4.1 Create Mining sector variant

- a. In `SectorManager::LoadSector()`, check `SectorType == Mining`
- b. Skip `SpawnManager` wave setup — Mining uses different spawn logic
- c. Instead: spawn dense asteroid field with mineral-rich rocks
- d. Asteroid count: 40-60 (double normal arena density)
- e. Layout: clustered veins of mineral-rich rocks among regular asteroids

### 4.4.2 Create mineral-rich asteroids

- a. Create `AMineralAsteroid` variant — inherits normal asteroid behavior
- b. Visual: gold-veined rock texture, emissive gold streaks, more pronounced glow
- c. On destruction: drop 3-5× normal mineral amounts (15-25 per rock)
- d. HP: slightly higher than normal asteroids of same size (tankier = more rewarding)
- e. Scatter 15-20 mineral-rich asteroids throughout the mining sector
- f. Non-mineral asteroids are also present (regular drops)

### 4.4.3 Spawn light enemy presence

- a. After 30s of mining: spawn 1 small enemy wave (budget=6) as pressure
- b. Enemies appear from sector edge, attack player
- c. This prevents mining from being zero-risk free minerals
- d. Only 1 wave — after clearing it, mining continues uninterrupted

### 4.4.4 Add mining timer (optional)

- a. Create mining timer: 60s countdown, visible on HUD
- b. "Scan Completion" stat — percentage of mineral-rich asteroids broken
- c. 100% scan completion = bonus reward (rare weapon or large mineral bonus)
- d. Timer is optional pressure — sector can be exited early via jump gate
- e. Timer creates interesting risk/reward: stay and mine more vs leave safely

### 4.4.5 Add mining sector VFX

- a. Gold dust particles in the environment — ambient Niagara system
- b. Floating golden motes throughout the field (sparse, not overwhelming)
- c. Mineral-rich asteroids have permanent golden glow aura
- d. When broken: extra gold particle burst compared to normal asteroids
- e. Sector lighting: warm amber directional light (feels like a golden vein in space)

---

## 4.5 Station Sector

### 4.5.1 Create AStationActor

- a. Create `ShatteredWorld/Public/StationActor.h` inheriting `AActor`
- b. Add `UStaticMeshComponent* StationMesh` — large space station model
- c. Add `USphereComponent* DockingRange` — radius 500, triggers proximity indicator
- d. Add `USphereComponent* InteractRange` — radius 200, triggers dock prompt
- e. Add `UPROPERTY`: `EStationType StationType` — Shipyard (MVP), TradePost, ResearchLab
- f. Add state: `bool bPlayerDocked`, `AShipPawn* DockedShip`
- g. Station slowly rotates (1°/s yaw) for visual interest

### 4.5.2 Create station mesh

- a. AI-generate or create placeholder station model — cylindrical with solar panels and docking arm
- b. Size: ~500-800 units diameter, clearly larger than player ship
- c. Apply materials: industrial grey hull, blue/white running lights, emissive windows
- d. Add docking port visual — highlighted section where ship physically connects
- e. Save to `Content/Meshes/World/SM_Station_Shipyard`

### 4.5.3 Implement docking

- a. On player entering `InteractRange`: show "Press E to Dock" prompt
- b. On interact: disable player movement input, start docking animation
- c. Docking animation: ship smoothly moves to docking port position (1s lerp)
- d. Ship attaches to station (parent to station dock socket)
- e. Set `bPlayerDocked = true`, store reference to docked ship
- f. Open station UI widget after docking animation completes
- g. Play docking SFX: mechanical clamps, pressurization hiss

### 4.5.4 Create Shipyard station UI

- a. Create `WBP_StationShipyard` widget — full-screen panel overlay
- b. Left panel: ship status (current HP, shield, equipped weapon, cargo contents)
- c. Center panel: action buttons — Install, Repair, Scrap, Leave
- d. Right panel: cargo grid showing all collected items
- e. Background: dim gameplay view with station UI overlaid
- f. Style: industrial/tactical theme, matching HUD color language

### 4.5.5 Implement Install

- a. "Install" button: shows available weapons in cargo with comparison stats
- b. Display side-by-side: equipped weapon stats vs selected cargo weapon stats
- c. Green/red arrows showing stat improvements/downgrades (damage, fire rate, etc.)
- d. Confirm button: swap equipped weapon with selected cargo weapon
- e. Old equipped weapon moves to cargo slot
- f. Play install SFX: mechanical click + power-up hum
- g. Update ship weapon actor immediately (destroy old, spawn new, attach)

### 4.5.6 Implement Repair

- a. Show current HP / Max HP and repair cost
- b. Cost: 2 Minerals per HP repaired (configurable)
- c. Calculate: `RepairCost = (MaxHP - CurrentHP) * CostPerHP`
- d. Show total cost, check if player can afford
- e. Confirm: deduct minerals, set `CurrentHP = MaxHP`
- f. Partial repair option: slider to choose how much to repair (spend less)
- g. Shield always auto-regenerates — no need to repair shields at station

### 4.5.7 Implement Scrap

- a. Show cargo items that can be scrapped
- b. Each item shows scrap value: 50% of weapon's base mineral value
- c. Select item → confirm scrap → destroy item from cargo, add minerals to player
- d. Scrap VFX: item dissolves, mineral particles float to counter
- e. Cannot scrap equipped weapon — only cargo items

### 4.5.8 Implement Leave

- a. "Leave" button: close station UI
- b. Undocking animation: ship detaches, moves away from station (1s lerp)
- c. Detach ship from station socket, re-enable player movement input
- d. Play undock SFX: clamps release, pressurization exhaust
- e. Set `bPlayerDocked = false`

---

## 4.6 Cargo Hold System

### 4.6.1 Create UCargoComponent

- a. Create `ShatteredShip/Public/CargoComponent.h` inheriting `UActorComponent`
- b. Add `UPROPERTY(Replicated)`: `TArray<FName> CargoSlots` — weapon names in each slot
- c. Add `UPROPERTY`: `int32 MaxSlots` — from hull DataTable CargoSlots (3 for Interceptor)
- d. Add `UFUNCTION`: `AddItem(FName WeaponName) → bool` (false if full)
- e. Add `UFUNCTION`: `RemoveItem(int32 SlotIndex)`, `GetItem(int32 Index) → FName`
- f. Add `UFUNCTION`: `IsFull() → bool`, `GetFreeSlotCount() → int32`
- g. Add delegate: `FOnCargoChanged` — broadcast on any add/remove for UI binding

### 4.6.2 Modify weapon pickup for cargo

- a. In M3+: change weapon pickup from auto-equip to cargo-add
- b. On `AWeaponPickup::OnPickedUp()`: call `CargoComponent->AddItem(WeaponName)`
- c. If cargo full: show "Cargo Full — Swap or Leave?" prompt
- d. Prompt shows: new weapon stats vs all cargo items + equipped weapon
- e. Player can pick a slot to swap, or cancel to leave the pickup

### 4.6.3 Handle full cargo

- a. Create `WBP_CargoFullPrompt` widget — popup when picking up with full cargo
- b. Show incoming weapon card at top
- c. Show current cargo items below as selectable cards
- d. Click a cargo item to swap it with incoming weapon (dropped item becomes pickup)
- e. Cancel button: close popup, leave weapon pickup on ground
- f. Auto-dismiss after 10s (prevent blocking gameplay)

### 4.6.4 Create cargo HUD indicator

- a. In `WBP_ShatteredHUD`: add small cargo slot icons in bottom-left area
- b. Show 3 small squares (number = max slots), filled = occupied, empty = free
- c. Filled slots show tiny weapon type icon inside
- d. Flash new slot briefly when item is added (gold border pulse)
- e. Update on `OnCargoChanged` event from CargoComponent

### 4.6.5 Create Cargo/Loadout screen

- a. Create `WBP_Loadout` widget — full-screen overlay (toggle with I key)
- b. Top section: equipped weapon slot (large card with full stats)
- c. Bottom section: cargo grid (3 slots, each showing weapon card)
- d. Show weapon stats: name, damage, fire rate, rarity, DPS calculation
- e. Rarity border color on each card matches rarity tier

### 4.6.6 Implement drag-and-drop

- a. Enable `UDragDropOperation` on cargo and loadout widget items
- b. Drag from cargo slot to equipped slot: install weapon (swap current to cargo)
- c. Drag from cargo slot to trash icon: scrap the item (with confirmation)
- d. Drag from equipped slot to cargo: unequip (if cargo has room)
- e. Visual feedback: item follows cursor during drag, valid drop targets highlight green
- f. Invalid drop: item snaps back to original position

---

## 4.7 Boss Encounter

### 4.7.1 Create ABossEnemyBase

- a. Create `ShatteredCombat/Public/BossEnemyBase.h` inheriting `AEnemyShipBase`
- b. Add `UPROPERTY`: `int32 CurrentPhase`, `int32 TotalPhases`
- c. Add `UPROPERTY`: `TArray<float> PhaseThresholds` — HP% that triggers phase transitions
- d. Add `UFUNCTION`: `OnPhaseTransition(int32 NewPhase)` — virtual, override per boss
- e. Override damage handling: check if HP crossed phase threshold after each damage
- f. Create large collision capsule — bosses are physically bigger
- g. Immune to knockback/pushback (bosses don't get shoved)

### 4.7.2 Create Sector Warden boss

- a. Create `ABossWarden` inheriting `ABossEnemyBase`
- b. Set: HP=500, Shield=200, Speed=300, Size=2.0
- c. TotalPhases=2, PhaseThresholds=[50%] — phase 2 at 50% HP
- d. Create mesh: imposing ship, ~200 units, angular armor plates, visible shield generators
- e. Corruption level=0.5 — clear alien influence but still ship-like
- f. Create behavior tree `BT_BossWarden` with phase-based branching

### 4.7.3 Phase 1: Shield phase

- a. Boss has rotating shield segment — physical mesh arc that blocks projectiles
- b. Shield arc covers ~120° of the boss — player must shoot the unshielded side
- c. Shield slowly rotates (15°/s) — player must maneuver to find the opening
- d. Shield mesh: bright cyan energy wall, visually distinct from boss hull
- e. Projectiles hitting shield: deflect and show shield impact VFX (cyan ripple)
- f. Player can damage boss from unshielded 240° arc

### 4.7.4 Phase 1 attacks

- a. Sweeping beam: boss fires rotating beam (90° sweep over 2s), deals 30 DPS on contact
- b. Beam VFX: thick red energy beam with heat distortion, clearly telegraphed
- c. Homing missiles: fires 4 missiles that track player, 20 damage each, slow speed (500u/s)
- d. Missiles are destroyable (10 HP each) — skilled players shoot them down
- e. Attack pattern: Beam → 3s pause → Missiles → 4s pause → repeat
- f. Between attacks: boss slowly chases player at half speed

### 4.7.5 Phase transition at 50% HP

- a. When boss HP crosses 50%: freeze boss movement for 2s
- b. Shield segment explodes — `NS_BossShieldBreak` VFX (large cyan burst)
- c. Boss glow shifts from cyan to red (material parameter change)
- d. Screen shake: heavy preset, 0.5s duration
- e. Audio: energy discharge + roar/alarm sound
- f. Set `CurrentPhase = 2`, resume behavior tree with phase 2 branch

### 4.7.6 Phase 2: Aggressive

- a. Boss speed increases to 500 (from 300)
- b. No more shield segment — boss is fully vulnerable
- c. New attack: spread barrage — 8 projectiles in 360° ring, 15 damage each
- d. Summon: spawns 3 Drones every 15s (they attack player, boss keeps fighting)
- e. Attack pattern: Spread barrage → Chase → Missiles (faster: 700u/s) → Summon → repeat
- f. Becomes more dangerous but more vulnerable — reward aggressive play

### 4.7.7 Create boss HP bar widget

- a. Create `WBP_BossHPBar` — wide bar centered at top of screen
- b. Width: 60% of screen width, Height: 24px
- c. Show boss name: "SECTOR WARDEN" above bar
- d. Show phase dots: 2 circles below bar, filled = phases remaining
- e. Bar color: red fill with dark background, white border
- f. Smooth drain animation: when boss takes damage, bar lerps over 0.3s
- g. Show/hide: appear when boss spawns, disappear when boss dies
- h. Shield portion: overlay cyan section on top of HP bar showing boss shield

### 4.7.8 Boss death sequence

- a. On boss death: disable boss movement, play massive explosion
- b. `NS_BossDeath` VFX: chain of explosions across boss mesh (3-4 sequential bursts)
- c. Final explosion: enormous burst, screen white-out for 0.3s
- d. Slow motion: 0.2× time dilation for 1.5s during explosion chain
- e. Mineral rain: spawn 20-30 mineral pickups bursting from boss center
- f. Guaranteed weapon drop: Epic rarity weapon
- g. After explosion settles: show "RUN COMPLETE" banner text
- h. Wait 3s → transition to Run Summary screen

### 4.7.9 Create boss arena

- a. Boss sector uses slightly larger arena (12000×12000 vs 10000×10000)
- b. Fewer asteroids in center — clear space for boss fight movement
- c. Ring of asteroids around edges — provides cover and mineral opportunities
- d. Dramatic lighting: darker ambient, spotlight on boss, red accent lights
- e. Boss-specific skybox tint: slightly redder/more menacing than normal sectors
- f. Add ambient VFX: floating debris, distant lightning, ominous particles

---

## 4.8 Event Encounter (First Event)

### 4.8.1 Create AEventTrigger

- a. Create `ShatteredWorld/Public/EventTrigger.h` inheriting `AActor`
- b. Add `USphereComponent* TriggerVolume` — radius 500, trigger on player overlap
- c. Add `UPROPERTY`: `FName EventName` — look up event data from DataTable
- d. On player overlap: pause gameplay context, open event UI widget
- e. Create `FEventData` struct: `FName Name, FText Description, TArray<FEventChoice> Choices`
- f. Create `FEventChoice` struct: `FText Label, FText Tooltip, FName OutcomeID`
- g. Add visual beacon: glowing marker visible from distance so player knows event exists

### 4.8.2 Create event UI widget

- a. Create `WBP_EventScreen` — full-screen modal overlay
- b. Center panel: event description text (3-4 lines of narrative)
- c. Below description: 2-3 choice buttons with hover tooltips showing risk/reward hints
- d. Choice buttons styled as "communication options" — fits space theme
- e. Background: dimmed gameplay, event beacon glow visible behind panel
- f. Ambient audio: radio static / transmission sound while event UI is open

### 4.8.3 Implement "Distress Signal" event

- a. Create `DT_Events` DataTable, add row `DistressSignal`
- b. Description: "You received a faint distress signal from a damaged freighter. Scanners show hostile signatures nearby."
- c. Choice A: "Respond to Signal" (Help) — risk: enemy wave, reward: minerals + weapon
- d. Choice B: "Ignore and Continue" — no risk, no reward
- e. (Future: Choice C for professions like Smuggler: "Salvage the Wreckage" — unique outcome)

### 4.8.4 Help outcome

- a. On choosing "Respond": close event UI, spawn NPC freighter actor in sector
- b. Spawn enemy wave: budget=12, focused on attacking NPC and player
- c. NPC freighter has HP bar (200 HP) — if it dies, reward is halved
- d. If NPC survives: reward 50 Minerals + random Uncommon weapon
- e. If NPC dies: reward 25 Minerals only
- f. NPC freighter: stationary, cannot fight back, player must defend it

### 4.8.5 Ignore outcome

- a. On choosing "Ignore": close event UI, nothing happens
- b. Brief radio message: "Signal fading... No response sent."
- c. Event trigger is consumed (can't re-trigger)
- d. Sector continues normally — jump gate available

### 4.8.6 Create event NPC ship actor

- a. Create `ANPCShip` — non-controllable ship pawn with health component
- b. Mesh: battered freighter model, larger than player, visibly damaged
- c. HP bar: small green bar visible above ship
- d. Behavior: stationary, no weapons, emits distress VFX (flashing lights, smoke)
- e. On death: explosion VFX, removes from sector
- f. On help success: plays "thank you" radio transmission audio

### 4.8.7 Add event complete notification

- a. Create `WBP_EventBanner` — top-of-screen notification banner
- b. Text: "Event Complete: +50 Minerals, +1 Weapon" (varies by outcome)
- c. Fade in (0.3s), hold (2s), fade out (0.5s)
- d. Banner color matches outcome: green=positive, yellow=neutral
- e. Play notification chime SFX on banner appearance

---

## 4.9 Run Flow

### 4.9.1 Create ARunManager

- a. Create `ShatteredWorld/Public/RunManager.h` inheriting `AActor`
- b. Add `ERunState` enum: PreRun, InRun, RunComplete, RunFailed
- c. Add `UPROPERTY`: `ERunState CurrentState`, `FRunStats RunStats`
- d. Add `FRunStats` struct: `int32 SectorsVisited, int32 EnemiesKilled, int32 MineralsEarned, int32 WeaponsFound, float RunTime`
- e. Add `UFUNCTION`: `StartRun()`, `FailRun()`, `CompleteRun()`
- f. Add delegates: `FOnRunStateChanged` — UI listens for state changes

### 4.9.2 Implement run start

- a. `StartRun()`: set state to InRun, generate galaxy map, load first sector
- b. Show galaxy map briefly (or auto-jump to sector 0)
- c. Initialize RunStats to zero
- d. Start run timer
- e. Player begins in Sector 0 with starting loadout

### 4.9.3 Track run stats

- a. `EnemiesKilled`: increment on each enemy death event
- b. `MineralsEarned`: increment on each mineral pickup (track cumulative)
- c. `WeaponsFound`: increment when weapon pickup is collected
- d. `SectorsVisited`: increment on each sector transition
- e. `RunTime`: accumulate `DeltaTime` every tick while InRun state
- f. All stats stored in `FRunStats` on RunManager

### 4.9.4 Implement Run Complete

- a. Triggered by boss death in final sector
- b. Set state to RunComplete
- c. Stop run timer
- d. Award persistent currency (RD) if applicable (M4+)
- e. Short delay (3s) then show Run Summary screen

### 4.9.5 Implement Run Failed

- a. Triggered on player death (solo) or all players dead (co-op)
- b. Set state to RunFailed
- c. Stop run timer
- d. Award partial persistent currency (50% of earned RD for M4+)
- e. Show Run Failed screen (updated from M2 death screen with more stats)

### 4.9.6 Create Run Summary screen

- a. Create `WBP_RunSummary` — full-screen results overlay
- b. Header: "RUN COMPLETE" (green) or "SIGNAL LOST" (red) based on outcome
- c. Stats table: two columns, label and value, for each tracked stat
- d. Run time: formatted as "MM:SS"
- e. Buttons: "Return to Hub" (or main menu in M3)
- f. Future (M4+): show RD earned, unlocks progress

### 4.9.7 Implement return to menu

- a. "Return to Hub" button: cleanup all run actors
- b. Destroy all enemies, pickups, sectors, projectiles
- c. Reset RunManager state to PreRun
- d. Load main menu level or Hub level
- e. Transition: fade to black (1s), load menu, fade in (0.5s)

---

## 4.10 Sector Environment: Asteroid Field

### 4.10.1 Create environment config DataTable

- a. Create `DT_Environments` DataTable using `FEnvironmentConfig` struct
- b. `FEnvironmentConfig` fields: `FName EnvName`, `float AsteroidDensity`, `FLinearColor FogColor`, `FLinearColor AmbientColor`
- c. Add field: `TSoftObjectPtr<UMaterialInterface> SkyboxMaterial`
- d. Add field: `TArray<TSoftObjectPtr<UStaticMesh>> AsteroidMeshes`
- e. Add field: `TSoftObjectPtr<UNiagaraSystem> AmbientParticles`
- f. Add `AsteroidField` row with warm amber lighting, moderate density

### 4.10.2 Procedural asteroid placement

- a. Create scatter algorithm in `ASectorManager::SpawnEnvironment()`
- b. Inputs: arena bounds, density parameter (0.0-1.0), min spacing, random seed
- c. Use Poisson disc sampling for natural-looking distribution
- d. Higher density = more asteroids, tighter spacing
- e. Reject points too close to center (player spawn zone)
- f. Reject points too close to station locations (if sector has station)
- g. Save positions so layout is consistent for the duration of sector

### 4.10.3 Add asteroid size variation

- a. Roll random size class per asteroid: Small (40%), Medium (40%), Large (20%)
- b. Small: scales 0.3-0.6×, HP=20, mineral drop=3
- c. Medium: scales 0.7-1.2×, HP=50, mineral drop=8
- d. Large: scales 1.5-2.5×, HP=100, mineral drop=15
- e. Vary within class too: ±20% random scale variation per instance
- f. Assign random rotation at spawn for visual uniqueness

### 4.10.4 Add environmental lighting

- a. For Asteroid Field: warm amber directional light as primary sun
- b. Intensity moderate — space still feels dark but rocks are visible
- c. Subtle rim light (cool blue, low intensity) from opposite direction
- d. Point lights on mineral-rich asteroids (gold, low range)
- e. No fog for asteroid field (clear space, good visibility)

### 4.10.5 Add distant background elements

- a. Spawn far-plane decorative asteroids at 5000-10000 unit distance
- b. Scale very large (5×-10×) but no collision, just visual backdrop
- c. Add parallax movement: background objects move at 10% of camera speed
- d. Add distant nebula cloud sprites at 15000+ units — faint color patches
- e. Subtle starfield particle system: very slow-moving tiny bright dots
- f. Combine with skybox for depth: near objects, far objects, skybox layers
