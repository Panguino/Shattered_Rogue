# Phases 7–10 — Content Expansion: Hulls, Weapons, Enemies & Drones

---

## Phase 7 — Full Hulls & Professions

---

### 7.1 Remaining 4 Hulls

#### 7.1.1 Create Hauler hull

- a. `DT_Hulls` row: MaxSpeed=650, MaxHP=120, MaxShield=60, CargoSlots=5, PrimaryWeaponSlots=1
- b. Special ability: Tractor Beam
- c. Hauler's niche: resource acquisition and survivability through supplies, not combat power

#### 7.1.2 Create Hauler mesh

- a. AI-generate or model `SM_Hauler` — wide, boxy, visible cargo pod bays along sides
- b. Size: ~90 units wide, shorter than Gunship but wider
- c. Materials: industrial, cargo markings, worn paint

#### 7.1.3 Implement Tractor Beam

- a. Create `UAbilityTractorBeam` component on Hauler
- b. On activate: pull all pickups within 800 unit radius toward player at high speed
- c. Duration: instant pulse, 8s cooldown
- d. VFX: expanding green ring from ship, pickups glow and streak toward player
- e. SFX: bass hum pulse, metallic clink as items arrive

#### 7.1.4 Create Phantom hull

- a. `DT_Hulls` row: MaxSpeed=900, MaxHP=60, MaxShield=30, CargoSlots=2, PrimaryWeaponSlots=1
- b. Glass cannon — fastest, fragile, high risk/reward
- c. Special ability: Cloak

#### 7.1.5 Create Phantom mesh

- a. `SM_Phantom` — sleek, angular, stealth-fighter silhouette, razor-thin profile
- b. Size: ~45 units, smallest hull
- c. Materials: dark matte, minimal markings, sharp edges

#### 7.1.6 Implement Cloak

- a. Create `UAbilityCloak` component
- b. On activate: ship becomes invisible (mesh opacity → 0.1), enemies lose target for 3s
- c. Break conditions: firing any weapon immediately breaks cloak
- d. First shot after cloak = guaranteed crit (2× damage)
- e. VFX: shimmer/distortion effect on ship mesh using post-process refraction
- f. SFX: phase-shift hum on activate, shimmer on deactivate
- g. Cooldown: 12s

#### 7.1.7 Create Juggernaut hull

- a. `DT_Hulls` row: MaxSpeed=450, MaxHP=250, MaxShield=150, CargoSlots=3, PrimaryWeaponSlots=1, ModuleSlots=4
- b. Slowest, tankiest — mobile fortress
- c. Special ability: Fortify

#### 7.1.8 Create Juggernaut mesh

- a. `SM_Juggernaut` — massive, heavily armored, visible shield generators on hull
- b. Size: ~150 units, largest player ship
- c. Materials: thick plate armor, reinforced seams, utility look

#### 7.1.9 Implement Fortify

- a. Create `UAbilityFortify` component
- b. On activate: 80% damage reduction for 4s, but ship cannot move during Fortify
- c. Can still aim and fire weapons — turret mode
- d. VFX: shield dome intensifies to near-opaque, golden glow
- e. SFX: heavy shield power-up hum, clank on activation
- f. Cooldown: 15s

#### 7.1.10 Create Carrier hull

- a. `DT_Hulls` row: MaxSpeed=550, MaxHP=100, MaxShield=50, DroneSlots=4
- b. Unique system: drone flock (detailed in Phase 10)
- c. Special ability: Drone Surge

#### 7.1.11 Create Carrier mesh

- a. `SM_Carrier` — wide hull with visible drone launch bays (2-4 deployable openings)
- b. Size: ~100 units wide
- c. Materials: flight deck aesthetic, lit bay interiors, operational look

#### 7.1.12 Carrier drone system stub

- a. Add `UDroneManagerComponent` to Carrier hull (empty implementation)
- b. Full drone system implemented in Phase 10
- c. For now: Carrier functions as normal hull without drones

---

### 7.2 Remaining 4 Professions

#### 7.2.1 Create Gunner profession

- a. `DT_Professions` row: Gunner, +15% fire rate (+0.15 FireRateMod), +10% damage, +5% crit chance
- b. Description: "Combat specialist. Increased rate of fire and damage output."
- c. Visual: red engine tint

#### 7.2.2 Create Engineer profession

- a. Row: Engineer, +20% shield regen rate, +1 module slot, 20% station repair discount
- b. Description: "Tech specialist. Enhanced shield systems and module capacity."
- c. Visual: blue engine tint

#### 7.2.3 Create Scout profession

- a. Row: Scout, +15% speed, +2 jump range, reveal sectors 2 hexes out on visit
- b. Description: "Recon specialist. Faster ship and extended navigation range."
- c. Visual: white/cyan engine tint

#### 7.2.4 Create Smuggler profession

- a. Row: Smuggler, Black Market prices -30%, contraband item access, +10% evasion
- b. Description: "Shady operator. Black Market discounts and unique contraband."
- c. Visual: purple engine tint

#### 7.2.5 Implement profession-specific event options

- a. In event data: add optional `RequiredProfession` field per choice
- b. If player has matching profession: show bonus choice option
- c. Example: Smuggler gets "Bribe the Pirates" option in combat events

#### 7.2.6 Create profession selection UI

- a. In `WBP_HullSelect`: after hull selection, show profession cards
- b. Each card: name, description, stat modifier list, visual preview of engine color
- c. Show combo synergy name if hull+profession has one

---

### 7.3 Hull × Profession Combos

#### 7.3.1 Implement combo synergy bonuses

- a. Create `FComboSynergy` struct: `FName HullName, FName ProfessionName, FName SynergyName, FText Description, float BonusMod`
- b. On run start: check if current hull+profession pair has a synergy entry
- c. If yes: apply additional bonus modifier and show synergy name on HUD

#### 7.3.2 Create 30 combo DataTable entries

- a. Create `DT_Combos` DataTable with 30 rows (6 hulls × 5 professions)
- b. Each has unique name and small bonus (e.g., "Ghost Operative" = Phantom+Smuggler, +15% cloak duration)
- c. Populate from design doc synergy list

#### 7.3.3 Display combo on pre-run screen

- a. When both hull and profession are selected: show synergy card
- b. Card: synergy name, bonus description, animated reveal
- c. Motivates players to try all combinations

#### 7.3.4 Achievement-based hull unlocks

- a. Create `FUnlockCondition` struct: `FName HullName, FText Condition, bool bMet`
- b. Interceptor: unlocked by default
- c. Gunship: complete 1 run (any outcome)
- d. Hauler: collect 500 total minerals
- e. Phantom: complete a run in under 10 minutes
- f. Juggernaut: survive 50 waves total
- g. Carrier: unlock all other hulls
- h. Check conditions on run end, unlock if met

#### 7.3.5 Profession unlock system

- a. All professions start locked except Miner (default)
- b. Gunner: kill 100 enemies total
- c. Engineer: repair at stations 10 times
- d. Scout: visit 30 sectors total
- e. Smuggler: scrap 20 items at stations

---

## Phase 8 — Full Weapons & Upgrades

---

### 8.1 Full Weapon Catalog

#### 8.1.1 Create remaining primary weapons

- a. From design doc 03: Flak Cannon (AoE burst), Plasma Caster (slow heavy projectile), Gatling Gun (very fast low damage)
- b. Each weapon: DataTable row → weapon Blueprint → projectile Blueprint → VFX → SFX
- c. Follow Phase 3 weapon creation pattern for each
- d. Target: 10+ primary weapons total in pool

#### 8.1.2 Create secondary weapon slot

- a. Add `SecondaryWeaponSlots` to hull data (already exists)
- b. Bind `IA_SecondaryFire` to secondary weapon component
- c. Secondary weapons fire independently from primary
- d. Update loadout screen to show secondary slot

#### 8.1.3 Create secondary weapons

- a. Missile variants: Swarm Missiles (8 small, low damage), Heavy Missile (1 big, high damage)
- b. Mine Layer: drops proximity mines behind ship, detonate on enemy contact
- c. Point Defense: auto-targets nearest enemy projectile, shoots it down (defensive)
- d. Each: DataTable → Blueprint → VFX → SFX

#### 8.1.4 Create Legendary rarity

- a. Add `Legendary` to rarity enum — gold color, unique VFX
- b. Legendary weapons have unique proc effects not available on lower rarities
- c. Drop rate: <1% from normal enemies, 5% from bosses, guaranteed from special events
- d. Visual: gold particle aura, unique model variation

#### 8.1.5 Implement proc chains

- a. Create `FWeaponProc` struct: `EProc Type (Burn, Chain, Pierce, Slow)`, `float Chance`, `float Value`
- b. On hit: roll proc chance → if triggered, apply secondary effect
- c. Burn: target takes 5 DPS for 3s, fire VFX
- d. Chain: damage chains to 1 nearby enemy, lightning VFX
- e. Pierce: projectile continues through target (reduced damage)
- f. Slow: target speed reduced 30% for 2s, ice VFX

---

### 8.2 Module System

#### 8.2.1 Create module slot system

- a. Create `UModuleComponent` on ShipPawn — manages equipped passive modules
- b. `TArray<FName> EquippedModules`, size = hull's `ModuleSlots`
- c. `EquipModule(FName, int32 Slot)`, `UnequipModule(int32 Slot)`
- d. Apply module stat buffs on equip, remove on unequip

#### 8.2.2 Create module DataTable

- a. `FModuleData` struct: `FName Name`, `EShatteredRarity Rarity`, `FText Description`, `float HPMod`, `float ShieldMod`, `float SpeedMod`, `float DamageMod`
- b. Add field: `FName SetName` — modules with matching SetName form a set
- c. Create `DT_Modules` DataTable with 10+ module types

#### 8.2.3 Create module types

- a. Shield Booster: +20% shield max, +10% shield regen
- b. Engine Tuner: +10% max speed, +15% acceleration
- c. Armor Plate: +15% max HP, -5% speed (trade-off)
- d. Targeting Computer: +10% weapon range, +5% crit chance
- e. Cargo Expander: +1 cargo slot, +20% mineral magnet range
- f. Each at Common/Uncommon/Rare tiers with scaling bonuses

#### 8.2.4 Module equip UI

- a. In loadout screen: show module slots below weapon slots
- b. Empty slots: dark squares with "+" icon
- c. Click to open module inventory → select module to equip
- d. Stat comparison shown on hover (before/after equip)

#### 8.2.5 Module set bonuses

- a. Create `FSetBonus` struct: `FName SetName, int32 RequiredCount, FText Bonus, float BonusValue`
- b. Example: "Defense Set" (2 pieces) = +10% all damage reduction
- c. Check set completion on equip/unequip, apply/remove bonus
- d. Show set progress on module tooltip: "Defense Set (1/2)"

---

### 8.3 Specialty Slot

#### 8.3.1 Create specialty slot

- a. 1 per ship — special slot for rare powerful passives
- b. `USpecialtyComponent` with single `FName EquippedSpecialty`
- c. Specialty items found as rare drops or event rewards

#### 8.3.2 Create specialty items

- a. 10+ specialty items from design doc 03
- b. Examples: "Volatile Reactor" (kills explode for AoE), "Vampiric Hull" (heal 5% damage dealt)
- c. Build-defining: each specialty changes playstyle significantly
- d. Displayed prominently on character sheet / loadout screen

#### 8.3.3 Implement catalog

- a. DataTable for specialties: `FSpecialtyData` with name, description, rarity, proc behavior
- b. Specialties apply via gameplay effect system or direct component modification
- c. Toggle pool support for specialties (can disable unwanted ones)

---

### 8.4 Weapon Upgrade System

#### 8.4.1 Implement weapon rank-up

- a. At stations: "Upgrade Weapon" option — spend Minerals to increase rank
- b. Each rank: +5% base stats (damage, fire rate, range)
- c. Cost: Rank 1→2 = 20 Minerals, 2→3 = 35, 3→4 = 55, etc. (escalating)
- d. Rank displayed as "Pulse Cannon +3" in UI

#### 8.4.2 Create rank VFX

- a. At rank 3: weapon gains faint emissive glow
- b. At rank 5: weapon glow brightens, adds particle trail
- c. At rank 7+: weapon has visible energy aura, distinct particle effects
- d. Material parameter driven: `RankGlow = Rank / MaxRank`

#### 8.4.3 Implement rank cap per rarity

- a. Common: max rank 3, Uncommon: 5, Rare: 7, Epic: 9, Legendary: 10
- b. Higher rarity = more room to grow = more valuable long-term
- c. Show max rank in weapon tooltip: "Rank 3/5 (Uncommon)"
- d. At max rank: weapon name gets star icon ★

---

## Phase 9 — Full Enemies & Environments

---

### 9.1 Procedural Trait System

#### 9.1.1 Implement trait layering

- a. On enemy spawn: roll 1-3 traits from trait pool based on chassis TraitSlots
- b. Apply trait modifiers to enemy stats (speed, damage, HP, behavior)
- c. Outer ring enemies: 0-1 traits. Mid ring: 1-2. Inner ring: 2-3.
- d. Traits stack — enemy with Regenerator + Shield Wall is very tanky

#### 9.1.2 Create movement traits (7)

- a. Zigzag: periodic lateral juke during chase (±100 units, 2Hz)
- b. Flanker: always approaches from behind player's aim direction
- c. Burrower: teleports short distance (300u) every 5s, reappears behind cover
- d. Teleporter: teleports to random position near target every 8s
- e. Charger: periodically rushes at target at 2× speed for 1s
- f. Orbiter: always circles target, never approaches directly
- g. Lurker: stays at max range, only approaches when player is engaged with others

#### 9.1.3 Create attack traits (8)

- a. Rapid Fire: +50% fire rate, -20% per-shot damage
- b. Sniper: +100% range, +50% damage, -60% fire rate
- c. Bomber: projectiles explode on impact for AoE (200u radius, 50% damage)
- d. Leech: damage dealt heals the enemy for 20% of damage
- e. Piercing: projectiles pass through targets, hit multiple players
- f. Scattershot: fires 3 projectiles per shot in a spread
- g. Homing: projectiles weakly home toward target
- h. Overcharge: every 4th shot deals 3× damage with distinct VFX warning

#### 9.1.4 Create defense traits (7)

- a. Regenerator: heals 5 HP/s passively
- b. Shield Wall: frontal shield absorbs 50 damage before breaking (recharges 10s)
- c. Phase Shift: 20% chance to dodge incoming projectile entirely (flicker VFX)
- d. Reflector: 10% chance to reflect projectile back at attacker
- e. Armored: 30% damage reduction, visually heavier plating
- f. Adaptive: after taking 3 hits of same damage type, gain 50% resistance to it
- g. Last Stand: at 20% HP, gain 50% damage boost for 5s (desperation mode)

#### 9.1.5 Create special traits (8)

- a. Splitter: on death, splits into 2 smaller versions (50% HP each)
- b. Summoner: spawns 1 Drone ally every 12s (max 3 summons)
- c. Kamikaze: on death, explodes for AoE damage (200u radius, 30 damage)
- d. Enrage: when ally dies within 500u, gain +30% speed and damage for 5s
- e. Cloaker: periodically goes invisible for 3s, reappears with surprise attack
- f. Mine Layer: drops explosive mines while moving (5s interval, 10s lifetime)
- g. Corruptor: contact with player applies 5s DoT (corruption damage)
- h. Nexus: nearby allies gain +15% damage (aura effect, 400u radius)

#### 9.1.6 Implement visual trait indicators

- a. Each trait category has a distinct visual cue on the enemy mesh
- b. Movement traits: colored engine trail (green)
- c. Attack traits: weapon glow color shift (red)
- d. Defense traits: visible armor/shield plates or shimmer (blue)
- e. Special traits: unique particle effect (purple orbs, mine trail, etc.)
- f. Multiple traits = multiple visual layers (readable at a glance)

#### 9.1.7 Environment trait biasing

- a. Each environment config specifies weighted trait pools
- b. Nebula: +50% weight for Energy attack traits
- c. Void Rift: +50% weight for Phase Shift and Teleporter traits
- d. Crystal Caves: +50% weight for Reflector and Armor traits
- e. Apply bias in trait roll during spawn

---

### 9.2 Corruption Visual System

#### 9.2.1 Create corruption material function

- a. Create `MF_Corruption` material function in UE5
- b. Input parameter: `CorruptionLevel` (0.0-1.0)
- c. At 0.0: no corruption, clean ship material
- d. At 0.5: purple veins overlay, subtle glow along seams
- e. At 1.0: fully organic, no ship material, all purple-red parasite tissue
- f. Gradient: purple (outer rim) → red-purple (mid) → deep red (inner/core)

#### 9.2.2 Apply corruption by ring

- a. Outer Rim (Ring 2): CorruptionLevel = 0.10-0.20
- b. Mid Ring (Ring 1): CorruptionLevel = 0.40-0.60
- c. Inner Ring: CorruptionLevel = 0.70-0.90
- d. Core: CorruptionLevel = 1.00
- e. Set on enemy spawn based on sector's ring index

#### 9.2.3 Create jellyfish tendril VFX

- a. `NS_CorruptionTendrils` Niagara system — trailing organic tendrils behind corrupted enemies
- b. Ribbon emitters: 2-4 semi-transparent tendrils trailing from rear
- c. Color: purple-pink gradient, softly pulsing
- d. Length scales with CorruptionLevel (longer tendrils = more corrupted)
- e. Attach to enemy mesh rear socket

#### 9.2.4 Create ooze pulse VFX

- a. `NS_CorruptionPulse` — periodic glow wave across enemy surface
- b. Material parameter animation: emissive pulse traveling from core outward (1Hz)
- c. Intensity increases with CorruptionLevel
- d. Subtle at low corruption, very visible at high corruption

#### 9.2.5 Create Core alien forms

- a. For CorruptionLevel ≥ 0.9: use entirely organic mesh instead of ship mesh
- b. Create `SM_AlienJellyfish_Small`, `_Medium`, `_Large` — fully organic models
- c. No metallic parts — pure biological, bioluminescent purple-red
- d. Animated tentacles via vertex shader (waving motion)
- e. These are the "pure Breach-born" — functionally identical to chassis, visually alien

---

### 9.3 Remaining 6 Environments

#### 9.3.1 Void Rift

- a. Visual: dark with glowing reality tears (purple light seams in space)
- b. Hazard: gravity anomaly zones pull/push player
- c. Skybox: near-black with purple crack lines, distant void energy
- d. Trait bias: Phase Shift, Teleporter

#### 9.3.2 Supernova Remnant

- a. Visual: extremely bright, solar flare hazards, heat distortion
- b. Hazard: heat damage zones (orange patches, 10 DPS on contact)
- c. Skybox: bright white/orange sun remnant, lens flare
- d. Trait bias: fire-based attack traits

#### 9.3.3 Crystal Caves

- a. Visual: crystalline asteroid formations, prismatic refraction effects
- b. Gameplay: tighter corridors, more cover, claustrophobic
- c. Skybox: dark with crystal formations catching ambient light
- d. Trait bias: Reflector, Armor

#### 9.3.4 Debris Field

- a. Visual: wrecked ships everywhere, floating hull fragments
- b. Gameplay: moving debris hazards (dodge or shoot), salvage loot
- c. Bonus: derelict wrecks contain random loot crates
- d. Skybox: war aftermath, smoke, distant fires

#### 9.3.5 Gas Giant Orbit

- a. Visual: dense colorful atmosphere rings, volumetric cloud bands
- b. Hazard: pressure waves every 15s (dodge the wave or take damage)
- c. Hazard: lightning strikes in random spots (2s warning indicator)
- d. Skybox: massive gas giant filling half the view, Jupiter-like

#### 9.3.6 Frozen Expanse

- a. Visual: ice asteroids with reflective surfaces, blue-white palette
- b. Gameplay: slippery movement modifier (+50% drift, lower drag)
- c. Hazard: cryo zones freeze ship for 0.5s on contact
- d. Skybox: dim, cold starlight, ice particle ambience

#### 9.3.7–9.3.8 Environment assets

- a. Per environment: unique skybox material, lighting preset, ambient Niagara system
- b. Per environment: unique asteroid/object meshes + materials
- c. Create transition effects: distinct warp-in visual per environment type
- d. Environment-specific ambient SFX loop (wind, hum, creak, etc.)

---

### 9.4 Neutral Ships & Wanted System

#### 9.4.1 Create 7 neutral types

- a. Miners: passive, break asteroids, drop minerals if killed (raises Wanted)
- b. Convoys: travel across sector, carry trade goods, attackable
- c. Patrol: faction ships, neutral unless provoked, tough enemies if hostile
- d. Scavengers: circle wreckage, non-hostile, flee if approached too fast
- e. Loot Piñata: timed chase target, escape in 8-12s if not killed, tiered rewards
- f. Wandering Merchant: can be traded with OR robbed (raises Wanted significantly)
- g. Distress Beacon: NPC in trouble, triggers help event

#### 9.4.2 Implement faction reputation

- a. Create `Reputation` value: starts at 0 (Neutral), attacking neutrals increases (-10 per kill)
- b. Thresholds: 0-10 = Neutral, 11-30 = Suspicious, 31+ = Wanted
- c. At Wanted: faction bounty hunters spawn periodically to hunt player
- d. Decays slowly over time (1 point per sector visited)

#### 9.4.3 Bounty hunters

- a. Wanted triggers hostile neutral ships spawning every 2 sectors
- b. Bounty hunter chassis: use Striker base with enhanced stats (+50% HP, +25% damage)
- c. Bounty hunters drop better loot but are dangerous optional fights
- d. Clearing wanted level: visit specific Station type or complete event

#### 9.4.4 Loot Piñata encounter

- a. AI: fleeing behavior only — runs away from player at moderate speed
- b. Timed: 8s (Bronze), 10s (Silver), 12s (Gold) before it escapes
- c. HP: 50/100/200 by tier — must DPS it down before timer expires
- d. Rewards: Bronze=30 Minerals, Silver=50+Uncommon weapon, Gold=100+Rare weapon
- e. VFX: trail of gem particles while fleeing, explosion of loot if killed

---

## Phase 10 — Carrier Drone Flock System

---

### 10.1 Drone Core

#### 10.1.1 Create ADroneActor

- a. Create `ShatteredShip/Public/DroneActor.h` inheriting `APawn`
- b. Small size (~20 units), no player input — fully AI-controlled
- c. `UFloatingPawnMovement` for smooth movement
- d. `HealthComponent` with low HP (15-25 depending on drone type)
- e. Belongs to owning Carrier — stores `AShipPawn* Owner` reference

#### 10.1.2 Implement Boids flocking

- a. Create `UBoidsBehavior` component — implements Reynolds flocking rules
- b. Separation: steer away from nearby drones (avoid clumping)
- c. Alignment: match velocity direction of nearby drones
- d. Cohesion: steer toward center of nearby drone group
- e. Owner-follow: additional vector pulling toward Carrier position
- f. Weights tunable per behavior mode (Follow emphasizes Owner-follow, Attack emphasizes target)

#### 10.1.3 Drone behavior modes

- a. Follow: stick close to Carrier in formation, no attacking
- b. Attack: seek nearest enemy within 600u of Carrier, fire on sight
- c. Defend: orbit Carrier at 200u radius, attack enemies that approach
- d. Harvest: seek nearest pickup, collect minerals for Carrier's inventory

#### 10.1.4 Drone command input

- a. Q key (IA_DroneCommand) cycles through modes: Follow → Attack → Defend → Harvest → Follow
- b. HUD shows current mode icon near ship crosshair
- c. Mode change plays short radio chatter SFX ("Drones: attack formation")
- d. All drones switch mode simultaneously

#### 10.1.5 Create 4+ drone types

- a. Attack Drone: small gun, 10 DPS, fragile
- b. Shield Drone: no weapon, projects small shield arc in front of Carrier
- c. Mining Drone: enhanced mineral collection in Harvest mode
- d. Repair Drone: slowly heals Carrier (2 HP/s) when in Follow/Defend mode
- e. Each drone type: DataTable row, mesh, VFX, behavior specialization

#### 10.1.6 Implement drone upgrades

- a. Drone upgrades are loot drops (rare, Carrier-specific)
- b. `FDroneUpgrade` struct: `FName Name, EDroneType AppliesToType, float DamageMod, float HPMod`
- c. Examples: "Reinforced Plating" (+50% drone HP), "Overclocked Weapons" (+30% drone damage)
- d. Equip via loadout screen in Carrier's special drone upgrade slot

#### 10.1.7 Carrier hull ability: Drone Surge

- a. On ability activation: all drones gain 2× fire rate + 50% speed for 5s
- b. VFX: drones glow brighter, engine trails intensify
- c. SFX: power surge hum, rapid fire sounds increase
- d. Cooldown: 20s

#### 10.1.8 Drone death/respawn

- a. Drones can be destroyed by enemy fire (they have HP)
- b. On drone death: small pop VFX, briefly reduces flock size
- c. Drones respawn at next station dock (full flock restored on station visit)
- d. Optional: RD unlock for "Auto-Rebuild" — drones respawn after 30s in-field
