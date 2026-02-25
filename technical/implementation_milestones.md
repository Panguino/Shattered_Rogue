# 🗺️ Shattered Rogue — Complete Implementation Milestones

> **3-level breakdown:** Milestones → Steps → Sub-steps
> Every sub-step is a single, actionable task that can be handed to an AI coding agent or developer.

---

## Phase 1 — Foundation & Project Setup

### 1.1 UE5 Project Initialization

#### 1.1.1 Create UE5 blank project (C++ template, no starter content)

#### 1.1.2 Configure project settings — target platform (PC), rendering (Forward+), frame rate (60fps cap)

#### 1.1.3 Set up folder structure: `/Source`, `/Content/Blueprints`, `/Content/VFX`, `/Content/UI`, `/Content/Audio`, `/Content/Meshes`, `/Content/Materials`

#### 1.1.4 Create GameInstance, GameMode, GameState, PlayerState base C++ classes

#### 1.1.5 Create primary game module and register with build system

### 1.2 Version Control Setup

#### 1.2.1 Initialize Git repository with `.gitignore` for UE5 (Binaries, Intermediate, DerivedDataCache, Saved)

#### 1.2.2 Configure Git LFS for `.uasset`, `.umap`, `.png`, `.wav`, `.mp3`, `.fbx` extensions

#### 1.2.3 Create `main` and `develop` branches with branch protection rules

#### 1.2.4 Push initial commit to GitHub remote

#### 1.2.5 Verify LFS tracking with a test binary asset push/pull

### 1.3 Core Plugin Architecture

#### 1.3.1 Create `ShatteredCore` gameplay module — shared types, enums, data tables

#### 1.3.2 Create `ShatteredShip` module — ship movement, hull definitions, input handling

#### 1.3.3 Create `ShatteredCombat` module — damage system, weapons, projectiles

#### 1.3.4 Create `ShatteredWorld` module — sector generation, galaxy map, environment

#### 1.3.5 Create `ShatteredUI` module — HUD, menus, widgets

#### 1.3.6 Set up module dependency chain (Core → Ship/Combat/World → UI)

### 1.4 Data Architecture

#### 1.4.1 Create `FHullData` struct — max speed, acceleration, drag, boost params, HP, shield, slots

#### 1.4.2 Create `FWeaponData` struct — damage, fire rate, projectile speed, rarity, type, VFX ref

#### 1.4.3 Create `FEnemyChassisData` struct — base HP, speed, size, weapon slots, trait slots

#### 1.4.4 Create `FTraitData` struct — movement/attack/defense/special modifiers

#### 1.4.5 Create `FSectorData` struct — environment type, encounter type, difficulty, loot tier

#### 1.4.6 Create DataTable assets for each struct — importable from CSV for rapid iteration

#### 1.4.7 Create `UShatteredDataSubsystem` — centralized data access from any module

### 1.5 Input System Setup

#### 1.5.1 Create Enhanced Input mapping context for gameplay

#### 1.5.2 Define input actions: Move, Aim, PrimaryFire, SecondaryFire, Boost, Ability, Interact, Map, Inventory, Pause

#### 1.5.3 Create KB/M input mapping — WASD move, mouse aim, LMB/RMB fire, Shift boost, Space ability

#### 1.5.4 Create Gamepad input mapping — left stick move, right stick aim, triggers fire, bumpers boost/ability

#### 1.5.5 Create `AShatteredPlayerController` — binds input actions, handles input mode switching

#### 1.5.6 Implement input remapping save/load to config file

---

## Phase 2 — M1: Ship Flies

### 2.1 Ship Actor

#### 2.1.1 Create `AShipPawn` base class — mesh component, movement component, collision capsule

#### 2.1.2 Add `UFloatingPawnMovement` component — configure max speed, acceleration, deceleration

#### 2.1.3 Implement arcade drift movement — apply thrust in input direction, apply drag when no input

#### 2.1.4 Tune drag curve — ship stops within ~0.5s of releasing input (adjustable per hull)

#### 2.1.5 Implement instant rotation — ship mesh always faces aim direction (mouse world position)

#### 2.1.6 Add ship mesh socket points — weapon mount (front), engine (back), shield origin (center)

#### 2.1.7 Load hull parameters from DataTable — speed, accel, drag, HP from `FHullData`

#### 2.1.8 Create Interceptor hull DataTable row with tuned values

### 2.2 Boost/Dash System

#### 2.2.1 Create `UBoostComponent` — manages boost state, cooldown timer, speed multiplier

#### 2.2.2 Implement boost activation — multiply current velocity by 1.5× in movement direction

#### 2.2.3 Implement boost duration timer (0.3–0.6s based on hull)

#### 2.2.4 Implement boost cooldown (3–6s based on hull, read from DataTable)

#### 2.2.5 Add boost VFX — engine trail intensifies (Niagara system, color from engine socket)

#### 2.2.6 Add boost audio — whoosh SFX on activation, engine rev during boost

#### 2.2.7 Add boost camera effect — slight FOV increase (+5°) during boost, lerp back on end

### 2.3 Camera System

#### 2.3.1 Create `AShatteredCameraActor` — spring arm + camera, top-down ~55° angle

#### 2.3.2 Set base height (~2000 units), FOV, and aspect ratio

#### 2.3.3 Implement smooth follow — lerp camera position to ship position (0.1s smoothing)

#### 2.3.4 Implement look-ahead — offset camera +200 units in aim direction

#### 2.3.5 Implement dynamic zoom-out on boost (lerp FOV +5° during boost, back on end)

#### 2.3.6 Add screen shake system — `UCameraShakeComponent` with configurable intensity/duration

#### 2.3.7 Implement damage vignette — red overlay at screen edges when taking damage

### 2.4 Primary Weapon (Pulse Cannon)

#### 2.4.1 Create `AWeaponBase` class — fire rate timer, projectile spawn, socket attachment

#### 2.4.2 Create `AProjectileBase` class — movement, collision, damage payload, lifetime

#### 2.4.3 Implement Pulse Cannon — rapid-fire (0.15s interval), orange projectiles, 25 damage

#### 2.4.4 Spawn projectiles from weapon socket, facing aim direction

#### 2.4.5 Add muzzle flash VFX — bright orange burst at weapon socket (0.05s lifetime)

#### 2.4.6 Add projectile trail VFX — short orange streak behind projectile

#### 2.4.7 Add screen shake on fire — tiny (0.5px) per shot

#### 2.4.8 Add fire audio — punchy blaster SFX, slight pitch randomization per shot

### 2.5 Arena Environment

#### 2.5.1 Create `AArenaVolume` — defines playable area boundaries with invisible wall collision

#### 2.5.2 Create asteroid static mesh set — 3-4 rock shapes at different scales

#### 2.5.3 Spawn 20-30 asteroids randomly within arena bounds

#### 2.5.4 Implement asteroid collision — ship bounces off, takes minor damage (5 HP)

#### 2.5.5 Implement destructible asteroids — shoot to break, spawn 2-3 smaller fragments

#### 2.5.6 Add asteroid break VFX — rock chunks + dust cloud (Niagara burst emitter)

#### 2.5.7 Add mineral drop on asteroid break — gold glowing pickup spawns from fragments

#### 2.5.8 Create space skybox — dark, starfield, subtle nebula in background (NMS-inspired)

### 2.6 Basic HUD (M1)

#### 2.6.1 Create `UShatteredHUD` base widget — canvas panel with anchored regions

#### 2.6.2 Add HP bar — top-left, horizontal, green→red gradient as HP drops

#### 2.6.3 Add boost cooldown indicator — small arc near ship, fills as cooldown resets

#### 2.6.4 Add mineral counter — bottom-left, gold icon + number

#### 2.6.5 Implement mineral pickup — fly over gold pickup, counter increments, pop animation

---

## Phase 3 — M2: Combat Works

### 3.1 Damage System

#### 3.1.1 Create `UHealthComponent` — current HP, max HP, shield HP, shield max, shield regen rate

#### 3.1.2 Implement damage application — shields absorb first, then HP, with damage type modifiers

#### 3.1.3 Create damage types enum — Kinetic, Energy (2 types for MVP)

#### 3.1.4 Implement shield regen — starts after 3s of no damage, regens at X/sec

#### 3.1.5 Add shield visual — cyan bubble mesh around ship, opacity scales with shield %

#### 3.1.6 Add shield break VFX — bubble shatters with cyan particle burst

#### 3.1.7 Add damage flash — ship mesh flashes white for 0.1s on hit

#### 3.1.8 Add low HP warning — red vignette pulse at screen edges when < 20% HP

### 3.2 Enemy AI Framework

#### 3.2.1 Create `AEnemyShipBase` class — inherits from AShipPawn, adds AI controller slot

#### 3.2.2 Create `AShatteredAIController` — base AI controller with behavior tree reference

#### 3.2.3 Create Blackboard — target actor, distance to target, current state, home position

#### 3.2.4 Create base behavior tree — acquire target → move to engagement range → attack → repeat

#### 3.2.5 Implement target acquisition — find nearest player, set as Blackboard target

#### 3.2.6 Create `BTTask_MoveToEngagementRange` — fly within weapon range of target

#### 3.2.7 Create `BTTask_FireAtTarget` — activate weapon, aim at target leading position

#### 3.2.8 Add aim prediction — enemies lead shots based on target velocity and projectile speed

### 3.3 Enemy Type: Drone (Swarm)

#### 3.3.1 Create Drone DataTable row — low HP (30), high speed (700), small size, no shields

#### 3.3.2 Create Drone behavior tree — chase target directly, close range engagement

#### 3.3.3 Create Drone weapon — weak rapid-fire (10 dmg, 0.3s interval), short range

#### 3.3.4 Create Drone mesh — small ship shape with faint purple glow (corruption 10-20%)

#### 3.3.5 Implement swarm grouping — Drones spawn in packs of 3-5, loose formation

#### 3.3.6 Add Drone death VFX — small pop explosion, purple ooze particles dissipate

### 3.4 Enemy Type: Striker (Fast)

#### 3.4.1 Create Striker DataTable row — medium HP (80), high speed (650), medium size, light shields

#### 3.4.2 Create Striker behavior tree — strafe around target, attack from angles, disengage when low

#### 3.4.3 Create `BTTask_StrafeTarget` — orbit target at engagement range, change direction periodically

#### 3.4.4 Create Striker weapon — medium damage burst fire (20 dmg × 3 rounds, 0.8s burst interval)

#### 3.4.5 Create Striker mesh — angular ship shape with purple-red tendrils on hull

#### 3.4.6 Add Striker death VFX — medium explosion, hull fragments + ooze spray

### 3.5 Enemy Type: Bomber (Slow AoE)

#### 3.5.1 Create Bomber DataTable row — high HP (150), low speed (350), large size, medium shields

#### 3.5.2 Create Bomber behavior tree — approach slowly, detonate AoE at close range

#### 3.5.3 Create `AoEAttack` ability — charge indicator (1.5s warning), then area damage in radius

#### 3.5.4 Create AoE warning VFX — red expanding circle on ground showing blast radius

#### 3.5.5 Create Bomber mesh — bulky ship shape with pulsing purple-red ooze sacs

#### 3.5.6 Add Bomber death VFX — large explosion, ooze splatter, debris chunks

### 3.6 Wave Spawning System

#### 3.6.1 Create `ASpawnManager` — manages wave state, enemy count, spawn budget

#### 3.6.2 Implement budget system — each enemy type has a spawn cost (Drone=1, Striker=3, Bomber=5)

#### 3.6.3 Create wave definitions — Wave 1: budget 6, Wave 2: budget 12, Wave 3: budget 20

#### 3.6.4 Implement spawn points — pick positions at arena edges, outside camera view

#### 3.6.5 Implement staggered spawning — enemies appear in small groups over 2-3 seconds, not all at once

#### 3.6.6 Implement calm period — 5s pause between waves, no enemies alive triggers next wave

#### 3.6.7 Add wave start audio cue — warning klaxon or radar ping before new wave

#### 3.6.8 Track active enemies — maintain count, wave completes when all killed

### 3.7 Loot & Pickup System

#### 3.7.1 Create `APickupBase` class — floating item, proximity detection, magnet pull-in

#### 3.7.2 Create `AMineralPickup` — gold glowing orb, adds to Mineral currency on collect

#### 3.7.3 Create `AWeaponPickup` — floating weapon mesh, shows weapon name/stats on proximity

#### 3.7.4 Implement loot drop tables — enemies roll on death: 100% Minerals, 15% weapon chance

#### 3.7.5 Implement weapon pickup — pressing Interact near weapon pickup equips it, drops current

#### 3.7.6 Add loot magnet — pickups within 200 units slowly drift toward player

#### 3.7.7 Add pickup VFX — gold sparkle trail on Minerals, colored glow on weapons by rarity

#### 3.7.8 Add pickup audio — satisfying "ding" on Mineral collect, distinct sound for weapon pickup

### 3.8 Additional Weapons

#### 3.8.1 Create Spread Shot — fires 5 projectiles in 30° cone, 15 dmg each, 0.4s interval

#### 3.8.2 Create Spread Shot VFX — multiple orange-yellow projectile trails fanning outward

#### 3.8.3 Create Beam Laser — continuous beam (hold fire), 40 DPS, short-medium range

#### 3.8.4 Create Beam Laser VFX — bright cyan beam with heat shimmer at contact point

#### 3.8.5 Create impact VFX per weapon type — sparks (Pulse), multi-sparks (Spread), burn glow (Beam)

#### 3.8.6 Create weapon switch system — Interact on new weapon drops current, old becomes pickup

#### 3.8.7 Add weapon icon to HUD — bottom-right, shows equipped primary weapon with icon

### 3.9 Death & Restart

#### 3.9.1 Implement ship death — HP reaches 0, disable input, play explosion sequence

#### 3.9.2 Create death explosion VFX — large burst, ship fragments fly outward, slow-mo 0.3s

#### 3.9.3 Create "Run Failed" screen — overlay widget: "SIGNAL LOST", kills count, minerals earned, retry button

#### 3.9.4 Implement restart — button press resets arena, respawns player, resets waves

#### 3.9.5 Add death audio — explosion boom, brief silence, then somber tone

### 3.10 Combat HUD Additions

#### 3.10.1 Add shield bar — above HP bar, cyan color, drains separately

#### 3.10.2 Add minimap — top-right, radar circle, red dots for enemies, gold dots for loot

#### 3.10.3 Add damage numbers — floating text on enemy hit, white normal, gold crit, float upward and fade

#### 3.10.4 Add hit markers — subtle crosshair flash on successful hit (white=normal, orange=crit)

#### 3.10.5 Add kill counter — small counter near minimap, increments with pop animation

---

## Phase 4 — M3: Run Structure

### 4.1 Galaxy Map System

#### 4.1.1 Create `UGalaxyMapSubsystem` — manages sector graph, player position, fog of war

#### 4.1.2 Create `FSectorNode` — position, type, environment, connections to adjacent sectors, visited state

#### 4.1.3 Generate linear 5-sector chain — start → 3 variable sectors → boss sector

#### 4.1.4 For each variable sector, randomly assign type: Combat, Mining, or Station

#### 4.1.5 Guarantee at least 1 Station sector in the chain (re-roll if needed)

#### 4.1.6 Create `UGalaxyMapWidget` — 2D node graph showing sectors as icons with connecting lines

#### 4.1.7 Implement sector selection — click adjacent sector to set as jump target

#### 4.1.8 Implement fog of war — unseen sectors show as "?" icons, adjacent show type icon

### 4.2 Sector Loading & Transitions

#### 4.2.1 Create `ASectorManager` — handles sector loading, streaming, transition state

#### 4.2.2 Create sector level template — arena volume + environment spawning + encounter trigger

#### 4.2.3 Implement jump gate actor — placed at sector edge, interact to leave sector

#### 4.2.4 Create warp transition — screen wipe/star streak effect (0.5s), load target sector

#### 4.2.5 Implement sector entry cinematic — brief camera pan showing sector layout (2s), then snap to ship

#### 4.2.6 Track sector completion state — all waves cleared = sector marked as complete

#### 4.2.7 Show jump gate highlight after sector is complete — glow effect, interact prompt

### 4.3 Combat Sector

#### 4.3.1 Combat sector inherits M2 wave spawning — 3 waves of enemies

#### 4.3.2 Scale wave budgets by sector position — sector 1: low budget, sector 3: medium, sector 5: high

#### 4.3.3 Spawn mineral deposits (asteroids with minerals) between waves

#### 4.3.4 Add completion reward — bonus Mineral drop after clearing all waves

### 4.4 Mining Sector

#### 4.4.1 Create Mining sector variant — dense asteroid field, scattered mineral-rich rocks

#### 4.4.2 Create mineral-rich asteroids — glow gold, drop 3-5× Minerals when broken

#### 4.4.3 Spawn light enemy presence — 1 small wave mid-mining to add pressure

#### 4.4.4 Add mining timer — optional time pressure (bonus rewards for fast clearing)

#### 4.4.5 Add mining sector VFX — gold dust particles in the field, glow on rich asteroids

### 4.5 Station Sector

#### 4.5.1 Create `AStationActor` — dockable object, triggers station UI on interaction

#### 4.5.2 Create station mesh — space station model (placeholder, AI-generated later)

#### 4.5.3 Implement docking — fly within range, press Interact, ship attaches, UI opens

#### 4.5.4 Create Shipyard station UI — Install weapons, Repair hull, Scrap items, Leave

#### 4.5.5 Implement Install — drag weapon from cargo to loadout slot, stat comparison shown

#### 4.5.6 Implement Repair — spend Minerals to restore HP (cost = 2 Minerals per HP)

#### 4.5.7 Implement Scrap — destroy cargo item for Mineral return (50% of item value)

#### 4.5.8 Implement Leave — close UI, undock, resume sector

### 4.6 Cargo Hold System

#### 4.6.1 Create `UCargoComponent` — inventory array (3 slots), add/remove/query items

#### 4.6.2 Modify weapon pickup — weapons now go to cargo instead of auto-equipping

#### 4.6.3 Handle full cargo — prompt to swap or leave when cargo is full

#### 4.6.4 Create cargo HUD indicator — small icons showing cargo contents, flash on new pickup

#### 4.6.5 Create full Cargo/Loadout screen — grid view: equipped weapon slots + cargo slots

#### 4.6.6 Implement drag-and-drop — drag cargo item to loadout slot to install, old goes to cargo

### 4.7 Boss Encounter

#### 4.7.1 Create `ABossEnemyBase` — larger enemy pawn with phase system, boss HP bar

#### 4.7.2 Create first boss: "Sector Warden" — 500 HP, shields, 2 phases

#### 4.7.3 Phase 1: Shield phase — boss has rotating shield, only vulnerable from one angle

#### 4.7.4 Phase 1 attack pattern — sweeping beam + homing missile barrage

#### 4.7.5 Phase transition: shield breaks at 50% HP — VFX explosion, 2s stagger, phase 2 starts

#### 4.7.6 Phase 2: Aggressive — boss moves faster, fires spread patterns, summons 3 Drones

#### 4.7.7 Create boss HP bar widget — top center, wide bar, boss name, phase indicator dots

#### 4.7.8 Boss death sequence — large slow-mo explosion, mineral rain, "Run Complete" trigger

#### 4.7.9 Create boss arena — slightly larger sector with clear space and cover asteroids around edges

### 4.8 Event Encounter (First Event)

#### 4.8.1 Create `AEventTrigger` — trigger volume that spawns event UI when player enters

#### 4.8.2 Create event UI widget — text description, 2-3 choice buttons, outcome display

#### 4.8.3 Implement "Distress Signal" event — NPC ship needs help, choice: Help / Ignore / Ambush?

#### 4.8.4 Help outcome: fight 1 small wave defending NPC, reward: 50 Minerals + random weapon

#### 4.8.5 Ignore outcome: nothing happens, continue

#### 4.8.6 Create event NPC ship actor — friendly ship mesh, follows player during defense

#### 4.8.7 Add event complete notification — banner at top "Event Complete: +50 Minerals"

### 4.9 Run Flow

#### 4.9.1 Create `ARunManager` — manages run state: pre-run → in-run → run-complete / run-failed

#### 4.9.2 Implement run start — spawn at sector 1, show galaxy map, player picks first move

#### 4.9.3 Track run stats — sectors visited, enemies killed, minerals earned, weapons found, time

#### 4.9.4 Implement Run Complete — triggered after boss death, show summary screen

#### 4.9.5 Implement Run Failed — triggered on player death, show summary screen with stats

#### 4.9.6 Create Run Summary screen — stats table, "Return to Hub" button, total run time

#### 4.9.7 Implement return to menu — cleanup all actors, return to main menu / hub

### 4.10 Sector Environment: Asteroid Field

#### 4.10.1 Create environment config DataTable — asteroid density, fog color, skybox, hazard types

#### 4.10.2 Procedural asteroid placement — scatter algorithm with minimum spacing, density parameter

#### 4.10.3 Add asteroid size variation — small/medium/large rocks, different HP and mineral yields

#### 4.10.4 Add environmental lighting — warm orange/amber for asteroid fields

#### 4.10.5 Add distant background elements — far asteroids, nebula clouds, dim stars (parallax)

---

## Phase 5 — M4: Progression Feels

### 5.1 Research Data Currency

#### 5.1.1 Create Research Data (RD) as persistent currency — survives death, stored globally

#### 5.1.2 Add RD drops to elite enemies (guaranteed) and bosses (large amount)

#### 5.1.3 Create `ARDPickup` — purple shimmer pickup, distinct from Minerals

#### 5.1.4 Add RD to run summary screen — "Research Data Earned: +42"

#### 5.1.5 Add RD to HUD — contextual display, shows when earned, fades after 3s

### 5.2 Hub Station (Between Runs)

#### 5.2.1 Create Hub game mode — separate from run game mode, menu-based interface

#### 5.2.2 Create Hub main menu widget — "Launch Run", "Research Lab" (spend RD), "Loadout", "Settings"

#### 5.2.3 Display current RD balance and Mineral balance in Hub

#### 5.2.4 Add ship preview — rotating 3D ship model in background of Hub menu

#### 5.2.5 Store Hub state in save file — unlocked items, currencies, settings

### 5.3 Unlock System (Research Lab)

#### 5.3.1 Create `UUnlockSubsystem` — manages unlock tree, purchased unlocks, toggle states

#### 5.3.2 Create unlock tree DataTable — items, RD cost, prerequisites, description

#### 5.3.3 Create Research Lab widget — grid of unlockable items with RD cost, locked/unlocked state

#### 5.3.4 Implement purchase — spend RD, mark item as unlocked, add to run loot pool

#### 5.3.5 Add 3 unlockable weapons: Missile Launcher (8 RD), Tesla Coil (12 RD), Railgun (15 RD)

#### 5.3.6 Create Missile Launcher — slow fire, homing projectile, 60 dmg, AoE splash

#### 5.3.7 Create Tesla Coil — chain lightning, hits target + 2 nearby enemies, 30 dmg each

#### 5.3.8 Create Railgun — charge shot (1.2s), pierces enemies, 150 dmg, long cooldown

### 5.4 Toggle Pool System

#### 5.4.1 Create Toggle Pool widget — list of all unlocked weapons with on/off toggle

#### 5.4.2 Implement toggle logic — only toggled-on weapons appear in run drop pools

#### 5.4.3 Save toggle preferences to player profile

#### 5.4.4 Show toggle pool in pre-run loadout screen — review before launching

### 5.5 Hex Grid Galaxy Map

#### 5.5.1 Replace linear chain with hex grid — 3 rings, ~12 sectors total

#### 5.5.2 Create hex grid generation algorithm — ring 1 (4 sectors), ring 2 (8 sectors), center boss

#### 5.5.3 Assign sector types procedurally — weighted random by ring (more combat inner, more mining outer)

#### 5.5.4 Implement Jump Range — Interceptor = 2, Gunship = 1, set per hull in DataTable

#### 5.5.5 Show reachable sectors based on Jump Range — highlight/glow on valid targets

#### 5.5.6 Implement Warp Crystal cost — jumps cost 1-3 crystals based on ring depth

#### 5.5.7 Add Warp Crystal drops — rare drop from enemies and mining, shown in HUD

#### 5.5.8 Implement fog reveal — jumping to a sector reveals adjacent sectors

### 5.6 Second Hull: Gunship

#### 5.6.1 Create Gunship hull DataTable row — slower (600), more HP (150), more weapon slots

#### 5.6.2 Create Gunship mesh — bulkier silhouette, more weapon port sockets

#### 5.6.3 Implement 2 primary weapon slots for Gunship — both fire simultaneously

#### 5.6.4 Add hull selection to pre-run screen — choose Interceptor or Gunship before launch

#### 5.6.5 Tune Gunship movement feel — heavier drag, less drift, more deliberate

### 5.7 First Profession: Miner

#### 5.7.1 Create profession system — `FProfessionData` struct, applied to ship at run start

#### 5.7.2 Create Miner profession DataTable row — +50% mineral yield, mineral magnet radius +100%

#### 5.7.3 Implement profession modifiers — apply stat changes to ship components on run start

#### 5.7.4 Add profession selection to pre-run screen — choose after hull selection

#### 5.7.5 Create Miner visual indicator — subtle green glow on ship hull (profession-specific tint)

### 5.8 Additional Enemies (3 More)

#### 5.8.1 Create Tank chassis — high HP (200), slow, frontal shield plate, charges player

#### 5.8.2 Create Tank behavior tree — advance slowly, raise shield, charge when close, ram damage

#### 5.8.3 Create Tank mesh — heavy armored ship with visible frontal shield plate + purple corruption

#### 5.8.4 Create Artillery chassis — medium HP (100), stays far, long-range bombardment

#### 5.8.5 Create Artillery behavior tree — maintain max range, fire slow high-damage projectiles, relocate if approached

#### 5.8.6 Create Artillery mesh — long-barreled ship with sensor arrays + faint corruption veins

#### 5.8.7 Create Carrier chassis — medium HP (120), spawns mini-drones, stays at mid-range

#### 5.8.8 Create Carrier behavior tree — spawn 2 mini-drones every 10s, flee if player gets close

#### 5.8.9 Create Carrier mesh — wide ship with visible drone bays + pulsing ooze sacs

### 5.9 Additional Events (2 More)

#### 5.9.1 Create "Derelict Ship" event — explore abandoned ship, choice: Search (risk + reward) or Leave

#### 5.9.2 Search outcome A (60%): find rare weapon + Minerals

#### 5.9.3 Search outcome B (40%): trap, ambush wave spawns

#### 5.9.4 Create "Asteroid Jackpot" event — dense mineral asteroid, timed mining rush

#### 5.9.5 Implement mining timer — 15s to break as many mineral rocks as possible, bonus for clearing all

### 5.10 Second Environment: Nebula

#### 5.10.1 Create Nebula environment config — reduced visibility (fog), energy damage zones

#### 5.10.2 Implement volumetric fog — colored translucent fog, reduced draw distance

#### 5.10.3 Create energy damage zones — visible purple-cyan patches, deal Energy damage on contact

#### 5.10.4 Add Nebula skybox — purple/cyan swirls, NMS-style volumetric clouds in background

#### 5.10.5 Add Nebula enemy trait bias — Energy-type enemies more common in Nebula sectors

### 5.11 Item Rarity System

#### 5.11.1 Create rarity enum — Common (white), Uncommon (green), Rare (blue), Epic (purple)

#### 5.11.2 Apply rarity multipliers to weapons — Uncommon +20% stats, Rare +40%, Epic +70%

#### 5.11.3 Implement rarity-weighted drop tables — higher rarity = lower drop chance

#### 5.11.4 Add rarity glow VFX to pickups — border glow color matches rarity

#### 5.11.5 Add rarity display to weapon tooltips and loadout screen

#### 5.11.6 Scale rarity chances by ring — inner rings have higher rare/epic chances

---

## Phase 6 — M5: Co-op Joins

### 6.1 Networking Foundation

#### 6.1.1 Convert GameMode to replicated — `AShatteredGameMode` replication setup

#### 6.1.2 Convert ShipPawn to replicated — position, rotation, health, shield sync

#### 6.1.3 Set up Listen Server model — host player runs server, client joins

#### 6.1.4 Create `AShatteredGameSession` — manages connections, max 2 players for MVP

#### 6.1.5 Implement RPCs for weapon firing — multicast for VFX, server-authoritative damage

#### 6.1.6 Implement RPCs for enemy damage — server calculates, replicates HP to all clients

### 6.2 Lobby System

#### 6.2.1 Create lobby widget — host game button, join by code input, ready indicators

#### 6.2.2 Implement session creation — UE5 Online Subsystem, generate join code

#### 6.2.3 Implement session join — enter code, connect to host's Listen Server

#### 6.2.4 Create lobby state — show connected players, hull/profession selection, ready toggle

#### 6.2.5 Implement launch — host starts run when all players are ready

### 6.3 Shared Galaxy Run

#### 6.3.1 Replicate sector state — all players see same galaxy map, same sectors

#### 6.3.2 Replicate enemy spawns — server spawns, replicates to clients

#### 6.3.3 Implement instanced loot — each player gets own drop rolls, can't see/take partner's loot

#### 6.3.4 Replicate sector transitions — server triggers jump, all players transition together

#### 6.3.5 Replicate events — server presents event, host makes choice, outcome applies to all

### 6.4 Revive Mechanic

#### 6.4.1 Create downed state — player at 0 HP enters downed state instead of dying (15s timer)

#### 6.4.2 Create downed visual — ship stops, pulsing ring indicator, SOS beacon

#### 6.4.3 Implement revive — alive player flies within revive radius (300 units) for 3s

#### 6.4.4 Revive progress bar — circular fill over the 3s channel, cancel if player leaves radius

#### 6.4.5 Revived player returns with 30% HP, no shields, brief invincibility (2s)

#### 6.4.6 If timer expires without revive — player dies for real, spectates partner

#### 6.4.7 If all players die — Run Failed for everyone

### 6.5 Co-op Scaling

#### 6.5.1 Scale wave budgets — +50% spawn budget per additional player

#### 6.5.2 Scale enemy HP — +25% HP per additional player

#### 6.5.3 Scale boss HP — +50% HP per additional player, no additional phases

#### 6.5.4 Scale loot quantity — +30% more drops per additional player

#### 6.5.5 Scale mineral rewards — no change (each player has own drops)

### 6.6 Co-op UI

#### 6.6.1 Add teammate indicator — arrow pointing to partner when off-screen

#### 6.6.2 Add teammate HP bar — small bar near partner's ship

#### 6.6.3 Add ping system — middle click to place map ping, visible to partner

#### 6.6.4 Add station sync — "Waiting for Player 2" indicator when one player is using station

#### 6.6.5 Player 2 color scheme — distinct ship color tint (blue vs orange)

---

## Phase 7 — Content Expansion: Hulls & Professions

### 7.1 Remaining 4 Hulls

#### 7.1.1 Create Hauler hull — medium speed, large cargo (5 slots), tractor beam ability

#### 7.1.2 Create Hauler mesh — wide, cargo-pod silhouette with visible hold bays

#### 7.1.3 Implement Hauler ability: Tractor Beam — pull all loot in wide radius on activation

#### 7.1.4 Create Phantom hull — fastest speed, low HP, cloak ability

#### 7.1.5 Create Phantom mesh — sleek, angular, stealth-fighter silhouette

#### 7.1.6 Implement Phantom ability: Cloak — invisible 3s, break on fire, first shot after = guaranteed crit

#### 7.1.7 Create Juggernaut hull — slowest, highest HP/shields, fortify ability

#### 7.1.8 Create Juggernaut mesh — massive, heavily armored, visible shield generators

#### 7.1.9 Implement Juggernaut ability: Fortify — 80% damage reduction 4s, immobile during

#### 7.1.10 Create Carrier hull — medium stats, drone system, drone surge ability

#### 7.1.11 Create Carrier mesh — wide hull with visible drone launch bays

#### 7.1.12 Implement Carrier drone system — see Phase 9

### 7.2 Remaining 4 Professions

#### 7.2.1 Create Gunner profession — +15% fire rate, +10% damage, crit chance +5%

#### 7.2.2 Create Engineer profession — +20% shield regen, module slots +1, repair discount

#### 7.2.3 Create Scout profession — +15% speed, +2 jump range, fog of war reduced

#### 7.2.4 Create Smuggler profession — Black Market prices -30%, contraband access, evasion +10%

#### 7.2.5 Implement profession-specific event options — unique choices based on profession

#### 7.2.6 Create profession selection UI — description, stat modifiers, visual preview

### 7.3 Hull × Profession Combos

#### 7.3.1 Implement combo synergy bonuses — when specific hull + profession pair, apply bonus modifier

#### 7.3.2 Create 30 combo DataTable entries — hull(6) × profession(5) with synergy description

#### 7.3.3 Display combo synergy on pre-run selection screen — name, bonus, description

#### 7.3.4 Implement achievement-based hull unlock system — specific conditions unlock each hull

#### 7.3.5 Implement profession unlock system — tied to progression milestones

---

## Phase 8 — Content Expansion: Weapons & Upgrades

### 8.1 Full Weapon Catalog

#### 8.1.1 Create remaining primary weapons from design doc (Flak Cannon, Plasma Caster, etc.)

#### 8.1.2 Create secondary weapon slot system — separate slot, separate fire button

#### 8.1.3 Create secondary weapons (Missile variants, Mine Layer, Point Defense)

#### 8.1.4 Create Legendary rarity tier — unique visual + special proc effect

#### 8.1.5 Implement proc chains — weapons can trigger effects (burn, chain, pierce, slow)

### 8.2 Module System

#### 8.2.1 Create module slot system — 1-4 passive module slots per hull

#### 8.2.2 Create module DataTable — stat bonuses, set bonuses, rarity tiers

#### 8.2.3 Create module types: Shield Booster, Engine Tuner, Armor Plate, Targeting Computer, etc.

#### 8.2.4 Implement module equip/swap UI in loadout screen

#### 8.2.5 Implement module set bonuses — equip 2-3 matching modules for bonus effect

### 8.3 Specialty Slot

#### 8.3.1 Create specialty slot — 1 per ship, powerful unique passive

#### 8.3.2 Create specialty items — rare drops with build-defining effects

#### 8.3.3 Implement specialty item catalog from design doc 03

### 8.4 Weapon Upgrade System

#### 8.4.1 Implement weapon rank-up — spend Minerals at station to increase weapon rank (+stats)

#### 8.4.2 Create rank VFX — visual change on weapon at ranks 3, 5, 7 (glow intensifies)

#### 8.4.3 Implement rank cap per rarity — Common=3, Uncommon=5, Rare=7, Epic=9, Legendary=10

---

## Phase 9 — Content Expansion: Enemies & Environments

### 9.1 Procedural Trait System

#### 9.1.1 Implement trait layering system — each enemy chassis gets 1-3 random traits at spawn

#### 9.1.2 Create 7 movement traits (Zigzag, Flanker, Burrower, Teleporter, etc.)

#### 9.1.3 Create 8 attack traits (Rapid Fire, Sniper, Bomber, Leech, etc.)

#### 9.1.4 Create 7 defense traits (Regenerator, Shield Wall, Phase Shift, etc.)

#### 9.1.5 Create 8 special traits (Splitter, Summoner, Kamikaze, etc.)

#### 9.1.6 Implement visual trait indicators — subtle VFX showing active traits

#### 9.1.7 Implement environment trait biasing — Nebula sectors bias Energy traits, etc.

### 9.2 Corruption Visual System

#### 9.2.1 Create corruption material function — parameterized purple-to-red gradient overlay

#### 9.2.2 Apply corruption based on ring — 10-20% Outer, 40-60% Mid, 70-90% Inner, 100% Core

#### 9.2.3 Create jellyfish tendril VFX — trailing Niagara system attached to corrupted enemies

#### 9.2.4 Create ooze pulse VFX — periodic glow pulse on corrupted meshes

#### 9.2.5 Create Core-ring pure alien forms — no ship mesh, fully organic jellyfish models

### 9.3 Remaining Environments (6 More)

#### 9.3.1 Create Void Rift — dark with reality tears, purple light, gravity anomalies

#### 9.3.2 Create Supernova Remnant — super bright, heat damage zones, solar flare hazards

#### 9.3.3 Create Crystal Caves — crystalline asteroids, refraction effects, tight corridors

#### 9.3.4 Create Debris Field — wrecked ships everywhere, moving debris hazards, salvage loot

#### 9.3.5 Create Gas Giant Orbit — dense atmosphere rings, pressure waves, lightning

#### 9.3.6 Create Frozen Expanse — ice asteroids, slippery movement modifier, cryo hazards

#### 9.3.7 Create environment-specific skyboxes, lighting, and ambient particle effects for each

#### 9.3.8 Create environment transition effects — distinct warp-in visual per environment type

### 9.4 Neutral Ships & Wanted System

#### 9.4.1 Create 7 neutral entity types from design doc 06 (miners, convoys, piñatas, etc.)

#### 9.4.2 Implement faction reputation — attacking neutrals raises Wanted level

#### 9.4.3 Implement Wanted bounty hunters — hostile neutral ships hunt player at high Wanted

#### 9.4.4 Create Loot Piñata encounter — timed chase (8-12s), Bronze/Silver/Gold tiers

---

## Phase 10 — Carrier Drone Flock System

### 10.1 Drone Core

#### 10.1.1 Create `ADroneActor` — small AI pawn, follows Carrier hull, Boids flocking behavior

#### 10.1.2 Implement Boids algorithm — separation, alignment, cohesion relative to Carrier

#### 10.1.3 Create drone behavior modes: Follow, Attack, Defend, Harvest

#### 10.1.4 Create drone command input — Q key cycles behavior modes

#### 10.1.5 Create 4+ drone types from design doc 10 (Attack Drone, Shield Drone, Mining Drone, etc.)

#### 10.1.6 Implement drone upgrades — found as loot, improve drone stats/behavior

#### 10.1.7 Create Carrier hull ability: Drone Surge — all drones double fire rate for 5s

#### 10.1.8 Implement drone death/respawn — drones can be destroyed, respawn at stations

---

## Phase 11 — Systems: Difficulty/Heat

### 11.1 Heat System

#### 11.1.1 Create `UHeatSubsystem` — manages 12 toggleable heat modifiers

#### 11.1.2 Create Heat modifier DataTable — 12 modifiers, 4 ranks each, from design doc 11

#### 11.1.3 Create Heat selection UI — pre-run toggles with rank selection, total Heat score display

#### 11.1.4 Implement modifier effects — enemy HP+, damage+, fewer stations, etc.

#### 11.1.5 Implement Heat-based reward scaling — higher Heat = more RD, better rarity chances

#### 11.1.6 Create Heat achievements — specific rewards for reaching Heat thresholds

#### 11.1.7 Display current Heat level on run HUD — small number in corner

---

## Phase 12 — Systems: Full Stations & Hub

### 12.1 Remaining Station Types

#### 12.1.1 Create Trade Post — buy/sell weapons and modules for Minerals

#### 12.1.2 Create Research Lab — spend RD for in-run temporary buffs and scans

#### 12.1.3 Create Black Market — rare items, contraband, high risk/reward trades

#### 12.1.4 Create station-specific UIs for each type

### 12.2 Full Hub Station

#### 12.2.1 Create 3D Hub environment — Outer Rim Station walkable/viewable areas

#### 12.2.2 Create 8 Hub areas from design doc 08 (Hangar, Research Lab, Trophy Room, etc.)

#### 12.2.3 Create Hub NPCs with dialogue — station survivors, each with 2-3 lore lines

#### 12.2.4 Implement unlock manifestation — Hub visually changes as player progresses

#### 12.2.5 Create Trophy Room — display achievements, stats, collected lore fragments

---

## Phase 13 — Full Events & Lore

### 13.1 Remaining Events (19 More)

#### 13.1.1 Implement all 22 events from design doc 05, one at a time

#### 13.1.2 Create event frequency system — weighted random, profession-specific options

#### 13.1.3 Create profession-gated event choices — unique options for specific professions

### 13.2 Lore Fragment System

#### 13.2.1 Create lore fragment collectible system — 37 fragments across 5 categories

#### 13.2.2 Create lore codex UI — viewable from Hub, organized by category

#### 13.2.3 Scatter fragments across events, scan interactions, wreckage, and boss encounters

#### 13.2.4 Create "Archivist" achievement for collecting all 37

---

## Phase 14 — Endgame: Glyphs & Breach Run

### 14.1 Glyph System

#### 14.1.1 Create `UGlyphSubsystem` — tracks collected Glyphs, barrier states

#### 14.1.2 Create 3 Glyph encounters — Glyph Guardian mini-boss, Vault Event, ring boss

#### 14.1.3 Create Glyph pickup VFX — alien symbol flare, barrier crack on galaxy map

#### 14.1.4 Implement Glyph passive bonuses — fog reduction, jump range+, damage reduction

#### 14.1.5 Create Hub Glyph display — pedestals showing collected Glyphs

### 14.2 Breach Run

#### 14.2.1 Create Breach Run game mode — special linear run, 4 phases

#### 14.2.2 Create gauntlet sector — dense, escalating enemy waves

#### 14.2.3 Create The Warden penultimate boss — corrupted Gate guardian

#### 14.2.4 Create Breach corridor — visual transition into the Breach dimension

#### 14.2.5 Create The Architect final boss — colossal jellyfish entity, 4 phases

#### 14.2.6 Implement Glyph activation during boss phases — VFX + mechanical effects

#### 14.2.7 Create ending cinematic — Breach closes, galaxy map updates

### 14.3 Loop+ / New Game Plus

#### 14.3.1 Create The Echo post-game threat — Architect fragment, justifies NG+ difficulty

#### 14.3.2 Implement NG+ scaling — harder enemies, better loot, new modifiers

#### 14.3.3 Create Loop+ galaxy map variations — new sector layouts, Elite encounters

---

## Phase 15 — Audio & Polish

### 15.1 Adaptive Music System

#### 15.1.1 Implement MetaSounds adaptive music — layers based on combat intensity

#### 15.1.2 Create ring-themed music — Outer Rim (ambient), Mid (tension), Inner (heavy), Core (alien)

#### 15.1.3 Create boss music tracks — unique per boss

#### 15.1.4 Create Hub Station ambient music — calm, safe feeling

#### 15.1.5 Implement crossfade transitions between sector/combat/calm states

### 15.2 SFX Polish

#### 15.2.1 Create/source SFX for all weapons (fire, impact, reload)

#### 15.2.2 Create SFX for all enemy types (engine hum, death, attack)

#### 15.2.3 Create UI SFX (button hover, click, purchase, error, notification)

#### 15.2.4 Create ambient sector SFX (asteroid creaks, nebula hums, void whispers)

#### 15.2.5 Implement spatial audio — 3D positioned sounds for enemies and hazards

### 15.3 VFX Polish

#### 15.3.1 Polish all weapon impact VFX to Crab Champions-level punch

#### 15.3.2 Polish explosion VFX to Astroneer-level color and satisfaction

#### 15.3.3 Polish environment VFX — NMS-scale nebulae, skyboxes, ambient particles

#### 15.3.4 Polish corruption VFX — jellyfish tendrils, ooze glow, ring gradient consistency

#### 15.3.5 Add screen effects — bloom, vignette, chromatic aberration (subtle, toggleable)

### 15.4 UI Polish

#### 15.4.1 Create final UI art pass — consistent style, animations, transitions

#### 15.4.2 Add menu transition animations — slide, fade, scale

#### 15.4.3 Create loading screen art — lore snippets, ship art, tips

#### 15.4.4 Polish HUD animations — smooth bar drains, pop-in numbers, pulse effects

---

## Phase 16 — Co-op Expansion: 3–4 Players

### 16.1 Scale to 4 Players

#### 16.1.1 Update lobby to support 4 player slots

#### 16.1.2 Scale enemy budgets, HP, and loot for 3-4 players

#### 16.1.3 Test network stability with 4 concurrent players

#### 16.1.4 Add color schemes for players 3 and 4

#### 16.1.5 Test revive mechanic with multiple downed players simultaneously

#### 16.1.6 Scale boss encounters for 4-player difficulty

---

## Phase 17 — Statistics, Leaderboards & Social

### 17.1 Statistics System

#### 17.1.1 Implement run summary with 40+ tracked stats from design doc 13

#### 17.1.2 Implement career stats aggregation — all-time records

#### 17.1.3 Implement per-combo stats — track performance for all 30 hull×profession combos

#### 17.1.4 Create statistics UI in Hub — viewable from Trophy Room

### 17.2 Leaderboards

#### 17.2.1 Implement 5 leaderboard types from design doc 13

#### 17.2.2 Create leaderboard UI — searchable, filterable, friend comparisons

#### 17.2.3 Implement seasonal rewards — time-limited leaderboard seasons

#### 17.2.4 Create shareable run cards — screenshot/share summary of best runs

### 17.3 Daily Challenges

#### 17.3.1 Create daily challenge system — preset hull/profession/modifiers, leaderboard

#### 17.3.2 Create challenge rotation — new challenge every 24 hours

#### 17.3.3 Create challenge rewards — unique cosmetics, RD bonuses

---

## Phase 18 — Quality Assurance & Release Prep

### 18.1 Performance Optimization

#### 18.1.1 Profile and optimize particle systems — ensure <2000 active particles on screen

#### 18.1.2 Optimize enemy AI — LOD behavior trees, reduce tick rate for distant enemies

#### 18.1.3 Optimize networking — reduce RPC frequency, compress state data

#### 18.1.4 Implement object pooling for projectiles, pickups, and particles

#### 18.1.5 Profile and optimize sector loading time — target <2s transition

### 18.2 Bug Fix & Stability Pass

#### 18.2.1 Playtest all hulls × profession combinations

#### 18.2.2 Playtest all environments × enemy combinations

#### 18.2.3 Stress test co-op with 4 players over extended sessions

#### 18.2.4 Test save/load integrity — corrupt save recovery, version migration

#### 18.2.5 Fix all critical and major bugs from testing

### 18.3 Balance Pass

#### 18.3.1 Tune weapon damage/fire rates against enemy HP pools

#### 18.3.2 Tune economy — mineral earn rates, station prices, RD progression curve

#### 18.3.3 Tune difficulty curve — ring 1 → 5 enemy scaling, boss difficulty

#### 18.3.4 Tune Heat modifiers — ensure each rank feels impactful but fair

#### 18.3.5 Implement developer balance analytics from design doc 13

### 18.4 Release Prep

#### 18.4.1 Create Steam store page — screenshots, trailer, description

#### 18.4.2 Create game trailer — 60-90s gameplay montage

#### 18.4.3 Set up Steam Workshop integration (if modding supported)

#### 18.4.4 Configure achievements — map to in-game achievement system

#### 18.4.5 Create build pipeline — automated packaging for Windows

#### 18.4.6 Early Access launch preparation — known issues list, roadmap, Discord setup
