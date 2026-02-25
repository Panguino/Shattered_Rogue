# Phases 5–6 — M4: Progression Feels & M5: Co-op Joins

---

## Phase 5 — M4: Progression Feels

---

### 5.1 Research Data Currency

#### 5.1.1 Create RD as persistent currency

- a. In `UShatteredGameInstance`: add `UPROPERTY(SaveGame): int32 ResearchData`
- b. RD persists across runs — stored in save file, never lost on death
- c. Create `AddRD(int32 Amount)` / `SpendRD(int32 Amount) → bool` on GameInstance
- d. Add delegate `FOnRDChanged` for UI binding

#### 5.1.2 Add RD drops

- a. Create `ARDPickup` inheriting `APickupBase` — purple shimmer crystal
- b. Elite enemies (Strikers, Bombers): guaranteed 3-5 RD on death
- c. Bosses: guaranteed 15-25 RD on death
- d. Drop chance on regular enemies: 5% → 1-2 RD

#### 5.1.3 Create pickup visuals

- a. Mesh: small geometric shard, purple emissive material (pulsing 1Hz)
- b. `NS_RDPickup_Idle` — orbiting purple+white motes around shard
- c. Collect VFX: purple trail arcing toward HUD (similar to mineral collect)
- d. Distinct from minerals: purple vs gold, angular vs rounded

#### 5.1.4 Add RD to run summary

- a. In `WBP_RunSummary`: add "Research Data Earned: +X" line
- b. Show with purple icon next to count
- c. On Run Complete: award 100% of earned RD. On Run Failed: award 50%.

#### 5.1.5 Add RD to HUD

- a. Contextual display near mineral counter (bottom-left)
- b. Shows only when RD is picked up — appears for 3s then fades
- c. Purple icon + count, pop animation on gain

---

### 5.2 Hub Station (Between Runs)

#### 5.2.1 Create Hub game mode

- a. Create `AHubGameMode` inheriting from `AGameModeBase`
- b. Set default pawn to none (menu-driven, no ship pawn in hub)
- c. Create `Map_Hub` level — background vista of space station exterior
- d. Hub is loaded after run end or on game start

#### 5.2.2 Create Hub main menu widget

- a. Create `WBP_HubMenu` — center-screen panel with large buttons
- b. Buttons: "🚀 Launch Run", "🔬 Research Lab", "⚙ Loadout", "🔧 Settings"
- c. Each button navigates to a sub-widget or triggers an action
- d. "Launch Run" → opens pre-run loadout/selection screen

#### 5.2.3 Display currencies

- a. Top-right of Hub menu: show current RD balance (purple) and Mineral balance (gold)
- b. Bind to GameInstance values, update on change

#### 5.2.4 Add ship preview

- a. Spawn 3D ship pawn in Hub level as decoration — slowly rotating
- b. Ship model updates when player changes hull selection
- c. Positioned behind menu panel, visible as background element

#### 5.2.5 Store Hub state in save

- a. Create `UShatteredSaveGame` inheriting `USaveGame`
- b. Fields: `int32 ResearchData`, `int32 Minerals`, `TArray<FName> UnlockedItems`, `TMap<FName, bool> TogglePool`
- c. Save on run end, unlock purchase, toggle change
- d. Load on game start → populate GameInstance
- e. Auto-save slot: "ShatteredRogue_Slot0"

---

### 5.3 Unlock System (Research Lab)

#### 5.3.1 Create UUnlockSubsystem

- a. Create `ShatteredCore/Public/UnlockSubsystem.h` inheriting `UGameInstanceSubsystem`
- b. Add `TArray<FName> UnlockedItems` — all purchased unlocks
- c. Add `UFUNCTION`: `IsUnlocked(FName) → bool`, `PurchaseUnlock(FName) → bool`, `GetAllUnlockable() → TArray`
- d. Load state from save game on init

#### 5.3.2 Create unlock tree DataTable

- a. Create `FUnlockEntry` struct: `FName ItemName`, `int32 RDCost`, `FText Description`, `FName PrerequisiteItem`
- b. Create `DT_Unlocks` DataTable
- c. Add entries for unlockable weapons with costs and prerequisites

#### 5.3.3 Create Research Lab widget

- a. Create `WBP_ResearchLab` — grid/tree view of unlockable items
- b. Each item: card showing name, icon, cost, locked/unlocked/purchasable state
- c. Locked items: greyed out, show prerequisite name
- d. Purchasable: highlighted border, RD cost shown
- e. Unlocked: green checkmark, fully visible

#### 5.3.4 Implement purchase

- a. On item click → confirm dialog: "Spend X RD to unlock [Item]?"
- b. Check `GameInstance->ResearchData >= Cost`
- c. If affordable: deduct RD, add to UnlockedItems, save game
- d. VFX: unlock animation on card (flash + reveal), satisfying SFX
- e. Update loot pools: newly unlocked weapon now appears in run drop tables

#### 5.3.5 Add 3 unlockable weapons

- a. `MissileLauncher`: Cost=8 RD, prerequisite=none
- b. `TeslaCoil`: Cost=12 RD, prerequisite=none
- c. `Railgun`: Cost=15 RD, prerequisite=MissileLauncher

#### 5.3.6 Create Missile Launcher

- a. DataTable row: Damage=60, FireRate=1.0 (1/s), ProjectileSpeed=1500, bIsHoming=true
- b. Projectile: slow, tracks target — `UProjectileMovementComponent::bIsHomingProjectile = true`
- c. AoE splash on impact: 150 unit radius, 50% falloff at edge
- d. Muzzle VFX: smoke puff. Trail VFX: white smoke trail. Impact VFX: orange explosion sphere
- e. SFX: whoosh on launch, sizzle during flight, boom on impact

#### 5.3.7 Create Tesla Coil

- a. DataTable row: Damage=30, FireRate=2.0, Range=800, ChainTargets=2
- b. On primary hit: find 2 nearest enemies within 400 units of target → chain 20 damage each
- c. Chain VFX: lightning arc Niagara between hit targets (bright blue-white)
- d. SFX: electric zap + crackle on chain
- e. Highly effective vs swarms (Drones)

#### 5.3.8 Create Railgun

- a. DataTable row: Damage=150, ChargeTime=1.2s, ProjectileSpeed=8000, bPiercing=true
- b. Hold fire button to charge: visual/audio charge buildup
- c. Release: fires piercing projectile through all enemies in line
- d. Charge VFX: accumulating energy particles at muzzle, growing brighter
- e. Fire VFX: massive muzzle blast, thick beam trail, screen shake (heavy)
- f. SFX: rising whine during charge → powerful crack on release

---

### 5.4 Toggle Pool System

#### 5.4.1 Create Toggle Pool widget

- a. In `WBP_ResearchLab` or separate `WBP_TogglePool`: list of all unlocked weapons
- b. Each entry: weapon name + icon + toggle switch (on/off)
- c. "On" weapons appear in run loot drop tables; "Off" weapons do not
- d. Default: all weapons toggled On when unlocked

#### 5.4.2 Implement toggle logic

- a. `UUnlockSubsystem`: maintain `TMap<FName, bool> ToggleStates`
- b. When rolling loot drops: filter loot pool to only include toggled-on items
- c. `GetAvailableWeapons() → TArray<FName>` — returns only toggled-on unlocked weapons

#### 5.4.3 Save toggle preferences

- a. Store `ToggleStates` in save game alongside unlocked items
- b. Load on game start, apply to loot pool filter

#### 5.4.4 Show in pre-run loadout

- a. Before launching run: quick review bar showing active loot pool
- b. Small icons for each toggled-on weapon, tap to toggle off/on
- c. Confirm and launch

---

### 5.5 Hex Grid Galaxy Map

#### 5.5.1 Replace linear chain with hex grid

- a. Update `GalaxyMapSubsystem::GenerateMap()` to create hex-based layout
- b. 3 concentric rings: Ring 1 (4 sectors), Ring 2 (8 sectors), Center (1 boss sector)
- c. Total: 13 sectors per run map
- d. Hex connections: each sector connects to adjacent hexes (2-3 neighbors)

#### 5.5.2 Create hex grid generation

- a. Define hex positions using axial coordinates (q, r system)
- b. Ring 1: place 4 sectors at distance 1 from center
- c. Ring 2: place 8 sectors at distance 2 from center
- d. Center: boss sector at (0,0)
- e. Player starts at a random Ring 2 edge sector

#### 5.5.3 Assign sector types procedurally

- a. Ring 2 (outer): 60% Mining, 25% Combat, 15% Station
- b. Ring 1 (inner): 40% Combat, 30% Station, 20% Event, 10% Mining
- c. Center: always Boss
- d. Guarantee at least 1 Station per ring

#### 5.5.4 Implement Jump Range

- a. Add `JumpRange` field to HullData (Interceptor=2, Gunship=1)
- b. In map widget: calculate reachable sectors based on current position + JumpRange
- c. JumpRange=2 means can reach sectors up to 2 hex steps away
- d. Show reachable/unreachable sectors with different opacity

#### 5.5.5 Show reachable sectors

- a. Reachable + revealed: bright icon, clickable
- b. Reachable + unrevealed: dim "?" icon, still clickable (explore unknown)
- c. Unreachable: very dim, not clickable, perhaps shown with lock icon
- d. Pulse animation on reachable sectors when map opens

#### 5.5.6 Implement Warp Crystal cost

- a. Create `WarpCrystals` currency — run-local (not persistent)
- b. Start run with 5 crystals. Each jump costs 1-2 crystals (further = more)
- c. Adjacent hex: 1 crystal. 2-hex jump: 2 crystals.
- d. Crystals drop from enemies (uncommon) and mining (moderate)

#### 5.5.7 Add Warp Crystal drops

- a. Create `AWarpCrystalPickup` — blue glowing shard
- b. Drop rate: 10% from combat enemies, 30% from mining asteroids
- c. Show crystal count on HUD near mineral counter (blue icon)

#### 5.5.8 Implement fog reveal

- a. On visiting a sector: reveal all directly connected hexes
- b. With JumpRange=2: also reveal sectors 1 step beyond connections
- c. Scout profession (future) reveals even more on visit

---

### 5.6 Second Hull: Gunship

#### 5.6.1 Create Gunship DataTable row

- a. Add to `DT_Hulls`: RowName=`Gunship`
- b. MaxSpeed=600, Acceleration=1500, Drag=1800 (heavy, responsive stop)
- c. MaxHP=150, MaxShield=75, ShieldRegenRate=8, ShieldRegenDelay=3.5
- d. PrimaryWeaponSlots=2, CargoSlots=3, ModuleSlots=3
- e. JumpRange=1, BoostMultiplier=1.3, BoostDuration=0.5, BoostCooldown=5

#### 5.6.2 Create Gunship mesh

- a. Create/generate `SM_Gunship` — bulkier, wider, clearly heavier than Interceptor
- b. Visible weapon ports on both sides (dual weapon mounts)
- c. Thicker armor plating, more industrial look
- d. Size: ~80 units wide (vs Interceptor ~50)

#### 5.6.3 Implement dual weapons

- a. Gunship spawns 2 primary weapon actors, attached to left and right weapon sockets
- b. Both fire simultaneously on PrimaryFire input
- c. Can equip different weapons in each slot (mix and match)
- d. Loadout screen shows 2 primary slots instead of 1

#### 5.6.4 Add hull selection to pre-run screen

- a. Create `WBP_HullSelect` — carousel or card grid showing available hulls
- b. Show hull name, stat summary, special ability, 3D preview
- c. Side-by-side stat comparison between hulls
- d. Player selects hull → stored for run → proceed to profession selection

#### 5.6.5 Tune Gunship movement

- a. Higher drag = stops faster, less drift than Interceptor
- b. Lower max speed = feels heavier, more deliberate
- c. Stronger boost = compensates for lower speed with burst mobility
- d. Playtest: Gunship should feel "tanky but powerful" vs Interceptor's "agile and fast"

---

### 5.7 First Profession: Miner

#### 5.7.1 Create profession system

- a. Create `FProfessionData` struct: `FName Name`, `FText Description`, `float MineralYieldMod`, `float MagnetRadiusMod`, `float SpeedMod`, `float DamageMod`
- b. Create `DT_Professions` DataTable
- c. Apply profession modifiers to ship components on run start via `ARunManager`

#### 5.7.2 Create Miner DataTable row

- a. RowName=`Miner`, MineralYieldMod=1.5 (+50%), MagnetRadiusMod=2.0 (double pickup range)
- b. All other modifiers: 1.0 (no change)
- c. Description: "Specialist in resource extraction. Enhanced mineral yields and collection range."

#### 5.7.3 Implement profession modifiers

- a. On run start: read active profession from player selection
- b. Apply `MineralYieldMod` — multiply all mineral pickup values
- c. Apply `MagnetRadiusMod` — scale magnet sphere radius on all pickups near player
- d. Apply any speed/damage mods to ship components

#### 5.7.4 Add profession selection

- a. In pre-run screen, after hull selection: show profession cards
- b. Card: profession name, icon, stat modifiers summary
- c. Select profession → stored for run

#### 5.7.5 Create Miner visual indicator

- a. When Miner profession active: subtle green tint on ship engine glow
- b. Particle effect: tiny green mineral dust orbiting ship (very subtle)
- c. Helps co-op partners identify each other's profession at a glance

---

### 5.8–5.11 (Additional Enemies, Events, Nebula, Rarity)

> These sub-steps follow the same pattern as Phase 3 enemies/Phase 4 events. Each item in the original outline (Tank, Artillery, Carrier chassis; Derelict Ship & Asteroid Jackpot events; Nebula environment; Rarity system) is broken down into DataTable row creation → behavior tree → mesh → VFX → SFX → integration micro-steps.

#### 5.8 — Three More Enemy Chassis

- Tank: high HP (200), slow, frontal shield plate, charge attack, heavy mesh, BT with advance→shield→charge logic
- Artillery: medium HP (100), max range preference, slow high-damage projectiles, BT with maintain-distance→bombard→relocate logic
- Carrier: medium HP (120), spawns 2 mini-drones every 10s, flees if approached, wide mesh with drone bays

#### 5.9 — Two More Events

- "Derelict Ship": choice to Search (60% treasure / 40% ambush trap) or Leave
- "Asteroid Jackpot": 15s timed mining rush, bonus for clearing all mineral rocks

#### 5.10 — Nebula Environment

- Volumetric fog (colored, reduced visibility), energy damage zones (purple-cyan patches)
- Nebula skybox (purple/cyan swirls), enemy trait bias toward Energy types
- Environment config: `DT_Environments` row `Nebula` with fog settings

#### 5.11 — Item Rarity System

- Rarity enum (Common/Uncommon/Rare/Epic) with stat multipliers (+0/20/40/70%)
- Rarity-weighted drop tables (scaling by ring depth)
- Visual: glow color per rarity on pickups + tooltip display + loadout screen indicators

---

## Phase 6 — M5: Co-op Joins

---

### 6.1 Networking Foundation

#### 6.1.1 Convert GameMode to replicated

- a. Add `bReplicates = true` to `AShatteredGameMode` constructor
- b. Implement `GetLifetimeReplicatedProps()` for run state, wave state
- c. Server-authoritative: GameMode only exists on server, clients request through RPCs
- d. GameState replicates shared data to all clients

#### 6.1.2 Convert ShipPawn to replicated

- a. Set `bReplicates = true`, `bReplicateMovement = true` on `AShipPawn`
- b. Replicate: position, rotation (via movement replication)
- c. Replicate: `CurrentHP`, `CurrentShield` via `HealthComponent` `GetLifetimeReplicatedProps`
- d. Smoothing: `bNetUseOwnerRelevancy`, interpolation for remote pawns
- e. Test: 2 clients see each other's ships moving smoothly

#### 6.1.3 Set up Listen Server

- a. Host player acts as Listen Server — runs server + client simultaneously
- b. Configure `AShatteredGameMode` for Listen Server mode
- c. Set `DefaultPawnClass`, `PlayerControllerClass` in GameMode
- d. Max players: 2 for MVP (expand to 4 in Phase 16)
- e. Test: host can play while client connects and plays alongside

#### 6.1.4 Create GameSession

- a. Create `AShatteredGameSession` inheriting `AGameSession`
- b. Override `RegisterPlayer()` — log connections, enforce max player count
- c. Override `UnregisterPlayer()` — handle disconnects mid-run
- d. Handle reconnection: if player disconnects and reconnects, restore their state

#### 6.1.5 Implement weapon fire RPCs

- a. `Server_FireWeapon()` — client tells server to fire (server validates)
- b. `Multicast_OnWeaponFired()` — server tells all clients to play fire VFX/SFX
- c. Projectile spawned on server, replicated to clients
- d. Client-side prediction: local player sees muzzle flash immediately, server confirms hit
- e. Remote players: see muzzle flash when Multicast arrives (slight delay, acceptable)

#### 6.1.6 Implement enemy damage RPCs

- a. Damage calculation: server-only (via `ApplyDamage` on server)
- b. `HealthComponent` replicates `CurrentHP`, `CurrentShield` to all clients
- c. Damage numbers: spawned locally on client that dealt damage (cosmetic)
- d. Death event: server broadcasts `OnDeath`, all clients react (VFX/loot)
- e. Loot: server spawns pickups, replicates to clients, ownership assigned per-player

---

### 6.2 Lobby System

#### 6.2.1 Create lobby widget

- a. Create `WBP_Lobby` — pre-run screen for multiplayer
- b. "Host Game" button: creates session, generates join code
- c. "Join Game" text input: enter join code to connect
- d. Player list: shows connected players with ready indicators
- e. Hull/profession selection available in lobby for each player

#### 6.2.2 Implement session creation

- a. Use UE5 Online Subsystem (NULL for LAN, Steam for release)
- b. On "Host Game": call `CreateSession()` with settings (MaxPlayers=2, bIsLAN=false)
- c. Generate 6-character alphanumeric join code from session ID
- d. Display code to host: "Share this code: AB12CD"

#### 6.2.3 Implement session join

- a. On code entry + "Join": call `FindSessions()` matching the code
- b. On session found: call `JoinSession()`, connect to host's Listen Server
- c. Error handling: "Session not found", "Session full", "Connection failed"
- d. Loading indicator while connecting

#### 6.2.4 Create lobby state

- a. Replicate lobby data: player names, selected hulls, professions, ready states
- b. Each player can change hull/profession in lobby
- c. Ready toggle: click "Ready" to signal prepared to launch
- d. Both players must be Ready before host can launch

#### 6.2.5 Implement launch

- a. Host clicks "Launch" when all players ready
- b. Server starts run: `RunManager->StartRun()` with co-op flag
- c. All players transition to first sector together
- d. Server generates galaxy map, replicates to all clients

---

### 6.3 Shared Galaxy Run

#### 6.3.1 Replicate sector state

- a. Galaxy map data exists on server (GameState), replicated to all clients
- b. All players see same map, same sectors, same fog of war
- c. Sector selection: host makes navigation decisions (or vote system, future)

#### 6.3.2 Replicate enemy spawns

- a. SpawnManager on server: spawns enemies, they replicate to clients
- b. Enemy pawns set `bReplicates = true`, `bReplicateMovement = true`
- c. AI runs only on server — clients see replicated movement/actions

#### 6.3.3 Implement instanced loot

- a. When loot drops: server creates pickup actor per player (instanced)
- b. Each player's pickups only visible/collectible by that player
- c. Prevents loot stealing, ensures fair distribution
- d. RD drops: shared (both players see same pickup, first to collect gets it — or instanced)

#### 6.3.4 Replicate sector transitions

- a. Jump gate interaction: any player can interact, triggers server transition
- b. Server sends Multicast: all players see warp VFX, load new sector together
- c. If players are in different states (one at station): wait for all to be ready

#### 6.3.5 Replicate events

- a. Event trigger: server spawns event, opens UI for host
- b. Host makes event choice (or: show event to all, host decides)
- c. Outcome applies to both players (rewards split or duplicated)

---

### 6.4 Revive Mechanic

#### 6.4.1 Create downed state

- a. When player reaches 0 HP in co-op: enter Downed state instead of dying
- b. `EPlayerLifeState` enum: Alive, Downed, Dead, Spectating
- c. Downed state: 15s bleedout timer counting down
- d. If timer expires: transition to Dead → Spectating

#### 6.4.2 Create downed visual

- a. Ship stops moving, drifts slowly with no control
- b. Ship flickers/sparks — damage VFX loop
- c. Pulsing SOS ring: expanding red circle (1Hz) visible to partner
- d. Audio: distress beacon alarm sound, audible at long range

#### 6.4.3 Implement revive

- a. Partner flies within 300 units of downed player
- b. Hold Interact (E) to channel revive: 3s channel time
- c. Channel interrupts if partner moves out of range or takes damage (optional)
- d. Server validates revive channel, tracks progress

#### 6.4.4 Revive progress bar

- a. Show circular progress fill above downed player for the reviving player
- b. 0% → 100% over 3s channel
- c. If interrupted: progress resets to 0%
- d. Downed player sees "Player 1 is reviving you!" message

#### 6.4.5 Revive completion

- a. On successful revive: player returns to Alive state
- b. Restored with 30% HP, 0% shield, 2s invincibility (golden glow)
- c. Brief screen flash for revived player (white → normal)
- d. Revive VFX: green/gold energy pulse at revive location
- e. Revive SFX: healing chime, satisfying

#### 6.4.6 Bleedout timeout

- a. If 15s timer reaches 0 without revive: player dies permanently (for this run)
- b. Death explosion plays (smaller than normal death)
- c. Player enters Spectating: camera follows surviving partner
- d. Spectator HUD: partner's HP/shield, minimap, no controls

#### 6.4.7 Total party wipe

- a. If all players are Dead: Run Failed for everyone
- b. Show Run Failed screen to all players simultaneously
- c. Run stats shared across all players

---

### 6.5 Co-op Scaling

#### 6.5.1 Scale wave budgets

- a. `GetWaveBudget()`: multiply base budget by `1.0 + 0.5 * (PlayerCount - 1)`
- b. 2 players: 1.5× budget (50% more enemies)
- c. Rounded to nearest integer

#### 6.5.2 Scale enemy HP

- a. On enemy spawn: multiply BaseHP by `1.0 + 0.25 * (PlayerCount - 1)`
- b. 2 players: 1.25× HP per enemy
- c. Apply after trait modifiers

#### 6.5.3 Scale boss HP

- a. Boss HP multiplied by `1.0 + 0.5 * (PlayerCount - 1)`
- b. 2 players: 1.5× boss HP
- c. No additional phases — just more HP pool

#### 6.5.4 Scale loot quantity

- a. 30% more total drops with 2 players
- b. Instanced: each player rolls independently but with boosted rates

#### 6.5.5 Mineral scaling

- a. No change — each player earns own minerals from own drops
- b. Instanced mineral pickups ensure fairness

---

### 6.6 Co-op UI

#### 6.6.1 Teammate indicator

- a. When partner off-screen: show arrow at screen edge pointing toward them
- b. Arrow color: partner's ship color (blue or orange)
- c. Show distance number next to arrow ("450m")
- d. Arrow pulses if partner is downed

#### 6.6.2 Teammate HP bar

- a. Small HP+shield bar floating above partner's ship (world-space widget)
- b. Only visible when partner is within camera view
- c. HP bar color matches partner's status (green/yellow/red)

#### 6.6.3 Ping system

- a. Middle-click (or D-pad Down): place ping marker at aim location
- b. Ping visible to both players: map icon + world-space indicator
- c. Ping persists 5s then fades
- d. Ping SFX: subtle "bloop" sound, audible to both players
- e. RPC: client sends ping location to server, server multicasts to all

#### 6.6.4 Station sync

- a. When one player docks at station: show "Player 1 at Station" to partner
- b. Optional: second player can also dock and use station simultaneously
- c. Jump gate: requires both players to be at gate or consent to jump

#### 6.6.5 Player 2 color scheme

- a. Player 1: orange ship tint (default)
- b. Player 2: blue ship tint
- c. Applied via material parameter on ship mesh
- d. Engine glow, shield color, and boost trail also tinted to match
