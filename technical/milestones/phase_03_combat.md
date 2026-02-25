# Phase 3 — M2: Combat Works

---

## 3.1 Damage System

### 3.1.1 Create UHealthComponent

- a. Create `ShatteredCombat/Public/HealthComponent.h` inheriting `UActorComponent`
- b. Add `UPROPERTY(Replicated)`: `float CurrentHP`, `float MaxHP`
- c. Add `UPROPERTY(Replicated)`: `float CurrentShield`, `float MaxShield`
- d. Add `UPROPERTY`: `float ShieldRegenRate`, `float ShieldRegenDelay`
- e. Add private: `float ShieldRegenTimer` — counts up from 0 after last damage
- f. Add delegates: `FOnHealthChanged`, `FOnShieldChanged`, `FOnDeath`
- g. Add `UFUNCTION(BlueprintCallable)`: `ApplyDamage(float Amount, EShatteredDamageType Type, AActor* Instigator)`
- h. Add `UFUNCTION`: `Heal(float Amount)`, `RestoreShield(float Amount)`
- i. Initialize values from owning actor's DataTable row in `BeginPlay()`

### 3.1.2 Implement damage application

- a. In `ApplyDamage()`: first check if shield > 0
- b. If shielded: subtract damage from shield. If damage exceeds shield, overflow to HP.
- c. `float ShieldDamage = FMath::Min(CurrentShield, Amount)`
- d. `float HPDamage = Amount - ShieldDamage`
- e. `CurrentShield -= ShieldDamage` → broadcast `OnShieldChanged`
- f. `CurrentHP -= HPDamage` → broadcast `OnHealthChanged`
- g. Reset `ShieldRegenTimer = 0` (damage restarts regen delay)
- h. If `CurrentHP <= 0`: broadcast `OnDeath`, set `bIsDead = true`
- i. Apply damage type modifiers (future: Kinetic does +20% to shields, Energy does +20% to HP)

### 3.1.3 Create damage types enum

- a. Verify `EShatteredDamageType` exists in ShatteredCore (created in 1.3.1)
- b. MVP types: `Kinetic` (bullets, physical), `Energy` (lasers, beams)
- c. Future types: `Explosive` (missiles, AoE), `Void` (Breach-born special)
- d. Create `FDamageTypeModifiers` struct — per-type multiplier vs shields, vs HP
- e. Default modifiers: Kinetic 1.0/1.0, Energy 0.8/1.2 (weaker vs shields, stronger vs HP)
- f. Apply modifiers in `ApplyDamage()` — multiply amount by relevant modifier

### 3.1.4 Implement shield regen

- a. In `TickComponent()`: if shield < max and not dead
- b. Increment `ShieldRegenTimer += DeltaTime`
- c. If `ShieldRegenTimer >= ShieldRegenDelay` (default 3.0s): start regenerating
- d. `CurrentShield = FMath::Min(CurrentShield + ShieldRegenRate * DeltaTime, MaxShield)`
- e. Broadcast `OnShieldChanged` when shield value changes
- f. Stop regen once shield is full (`CurrentShield >= MaxShield`)
- g. Any new damage resets `ShieldRegenTimer = 0` (restart the delay)

### 3.1.5 Add shield visual

- a. Create `UStaticMeshComponent* ShieldBubble` on ship pawn — sphere mesh around ship
- b. Create `MI_ShieldBubble` material instance — translucent, cyan emissive, fresnel edge glow
- c. Add material parameter `ShieldOpacity` — scales 0.0-1.0 based on shield %
- d. At 100% shield: `ShieldOpacity = 0.15` (barely visible). At 50%: `ShieldOpacity = 0.3`
- e. Below 20%: add crack decal overlay — hexagonal crack pattern on shield surface
- f. Bind `OnShieldChanged` → update material opacity parameter dynamically

### 3.1.6 Add shield break VFX

- a. Create Niagara System `NS_ShieldBreak` — burst of cyan hexagonal fragments
- b. Emitter: 15-20 hex-shaped mesh particles, burst outward from shield sphere
- c. Color: bright cyan core with white edges, fade to transparent over 0.4s
- d. On `OnShieldChanged` when `CurrentShield` reaches 0: spawn `NS_ShieldBreak` at ship center
- e. Add audio: crisp glass-shatter sound layered with energy discharge
- f. Hide `ShieldBubble` mesh when shield is 0, show when regen begins

### 3.1.7 Add damage flash

- a. On `OnHealthChanged` (HP damage taken): trigger flash on ship mesh
- b. Create dynamic material instance of ship material, store reference
- c. Set `EmissiveColor` parameter to white (10.0 intensity) for 0.1s
- d. After 0.1s: reset `EmissiveColor` to default
- e. Use `FTimerHandle` for the reset delay, not tick-based counting
- f. Flash applies to all mesh elements of the ship (hull + any attached parts)

### 3.1.8 Add low HP warning

- a. In camera's damage vignette system (from 2.3.7): bind to `OnHealthChanged`
- b. When `CurrentHP / MaxHP < 0.2`: enable persistent pulse mode
- c. Pulse: oscillate vignette intensity between 0.1 and 0.3 using sine wave (1Hz)
- d. Add heartbeat audio — low, rhythmic thump at 1Hz, volume scales with danger
- e. When HP recovers above 20%: disable pulse, fade vignette to 0
- f. Optional: slightly desaturate screen color when below 20% HP

---

## 3.2 Enemy AI Framework

### 3.2.1 Create AEnemyShipBase class

- a. Create `ShatteredCombat/Public/EnemyShipBase.h` inheriting `AShipPawn`
- b. Add `UPROPERTY`: `FName ChassisName` — lookup key for enemy DataTable
- c. Add `UPROPERTY`: `int32 MineralDropAmount`, `float WeaponDropChance`
- d. Add `UPROPERTY`: `UHealthComponent* HealthComp` — auto-created in constructor
- e. Override `BeginPlay()` — load chassis data from DataTable, apply HP/speed/size
- f. Bind `HealthComp->OnDeath` → call `HandleDeath()` — spawn loot, VFX, destroy
- g. Add `UPROPERTY`: `AActor* CurrentTarget` — set by AI controller
- h. Add purple corruption material overlay — intensity from `CorruptionLevel` in DataTable

### 3.2.2 Create AShatteredAIController

- a. Create `ShatteredCombat/Public/ShatteredAIController.h` inheriting `AAIController`
- b. Add `UPROPERTY`: `UBehaviorTreeComponent* BTComp`, `UBlackboardComponent* BBComp`
- c. Override `OnPossess()` — initialize blackboard, start behavior tree
- d. Load behavior tree from chassis DataTable entry
- e. Create `InitializeBlackboard()` — set default key values
- f. Set AI perception: `UAIPerceptionComponent` with sight sense (detect players within range)

### 3.2.3 Create Blackboard

- a. Create Blackboard asset `BB_Enemy` in `Content/AI/`
- b. Add key `TargetActor` — type: Object (Actor class filter)
- c. Add key `DistanceToTarget` — type: Float
- d. Add key `CurrentState` — type: Enum (Idle, Chasing, Attacking, Fleeing)
- e. Add key `HomePosition` — type: Vector (spawn point, for patrol/return)
- f. Add key `EngagementRange` — type: Float (preferred combat distance)
- g. Add key `bHasTarget` — type: Bool (quick check for decorators)

### 3.2.4 Create base behavior tree

- a. Create Behavior Tree asset `BT_EnemyBase` in `Content/AI/`
- b. Root → Selector node with 3 branches:
- c. Branch 1 (highest priority): Check `bHasTarget` → Sequence: Move to engagement range → Attack target
- d. Branch 2: No target → Run `BTTask_AcquireTarget` → set `TargetActor` if found
- e. Branch 3 (fallback): Idle — wait 1s, then try to acquire target again
- f. Add `BTDecorator_BlackboardBased` conditions on each branch
- g. Set loop behavior — tree continuously re-evaluates

### 3.2.5 Implement target acquisition

- a. Create `BTTask_AcquireTarget` — custom task node
- b. In `ExecuteTask()`: get all actors of class `AShipPawn` with tag "Player"
- c. Filter: only living players (`HealthComponent->bIsDead == false`)
- d. Find nearest player by distance from AI pawn location
- e. Set `TargetActor` on blackboard to nearest player
- f. Set `bHasTarget = true`
- g. Return `EBTNodeResult::Succeeded` if target found, `Failed` if no players alive
- h. Re-run acquisition if target dies mid-combat

### 3.2.6 Create BTTask_MoveToEngagementRange

- a. Create custom BT task `BTTask_MoveToEngagement`
- b. Read `EngagementRange` from blackboard (set per-chassis: Drone=200, Striker=500, Bomber=300)
- c. Get target location from `TargetActor`
- d. Calculate desired position: `TargetLocation + DirectionFromTarget * EngagementRange`
- e. Call `AIController->MoveToLocation(DesiredPosition)` using pathfinding
- f. Task succeeds when within 10% of engagement range
- g. Task fails if target is lost during movement
- h. Update `DistanceToTarget` on blackboard each tick during movement

### 3.2.7 Create BTTask_FireAtTarget

- a. Create custom BT task `BTTask_FireAtTarget`
- b. Get `TargetActor` from blackboard, get target's velocity for prediction
- c. Calculate lead position: `TargetPos + TargetVelocity * (Distance / ProjectileSpeed)`
- d. Aim AI pawn at lead position: `SetActorRotation(LeadDirection.Rotation())`
- e. Call equipped weapon's `StartFiring()` — fires at DataTable-defined rate
- f. Task runs for `FireDuration` seconds (e.g., Drone = continuous, Striker = 2s burst)
- g. After duration: call `StopFiring()`, return Succeeded
- h. Abort if target dies or moves out of range

### 3.2.8 Add aim prediction

- a. In `BTTask_FireAtTarget`, get target's current velocity vector
- b. Calculate time-to-target: `Distance / ProjectileSpeed`
- c. Predicted position: `TargetPosition + TargetVelocity * TimeToTarget`
- d. Add small randomization to prediction: ±5° angle offset (enemies shouldn't be perfect)
- e. Accuracy scales with chassis type: Striker = accurate, Drone = inaccurate
- f. Add `PredictionAccuracy` field to chassis DataTable (0.0 = no prediction, 1.0 = perfect)
- g. Lerp between current position and predicted position based on accuracy value

---

## 3.3 Enemy Type: Drone (Swarm)

### 3.3.1 Create Drone DataTable row

- a. Open `DT_EnemyChassis` DataTable
- b. Add row: RowName = `Drone`
- c. Set: BaseHP=30, BaseShield=0, BaseSpeed=700, Size=0.5
- d. Set: SpawnCost=1, TraitSlots=0 (no traits for MVP)
- e. Set: EngagementRange=200 (close range fighter)
- f. Set: MineralDrop=5, WeaponDropChance=0.05
- g. Set: CorruptionLevel=0.15 (faint purple veins)
- h. Reference BehaviorTree: `BT_Drone`

### 3.3.2 Create Drone behavior tree

- a. Create `BT_Drone` in `Content/AI/BehaviorTrees/`
- b. Root → Selector:
- c. Branch 1: Has target → Sequence: `BTTask_ChaseTarget` → `BTTask_FireAtTarget(Continuous)`
- d. `BTTask_ChaseTarget`: move directly at target, no strafing, close the distance constantly
- e. Fire while chasing: Drones fire continuously while in range
- f. Branch 2: No target → Wander randomly within 500 units of home position
- g. Key behavior: Drones are aggressive, stupid, and expendable — they just chase

### 3.3.3 Create Drone weapon

- a. Add DataTable row `DroneBlaster` in `DT_Weapons`
- b. Values: Damage=10, FireRate=3.33 (0.3s interval), ProjectileSpeed=2000, Range=800
- c. DamageType=Kinetic, SpreadAngle=10 (slightly inaccurate)
- d. VFX: small purple projectiles (corruption-tinted)
- e. Create `BP_DroneBlaster` weapon Blueprint, equip on Drone in spawn setup
- f. Projectile mesh: tiny glowing purple sphere

### 3.3.4 Create Drone mesh

- a. Create or generate `SM_Drone` — small, angular ship shape (~50 units)
- b. Asymmetric design: looks like a broken shard of a larger ship
- c. Apply base material with slate grey color
- d. Create corruption overlay material instance — faint purple veins along seam lines
- e. Set CorruptionLevel parameter to 0.15 — barely visible, just a hint
- f. Add subtle purple glow point light on the Drone (radius 100, intensity low)

### 3.3.5 Implement swarm grouping

- a. In `ASpawnManager`, when spawning Drone type: spawn in groups of 3-5
- b. Pick group spawn center at arena edge, then offset each Drone ±100 units from center
- c. Add slight delay between each Drone spawn (0.2s stagger) for visual flair
- d. Drones share target acquisition — if one Drone targets a player, nearby Drones target same
- e. Create `FSwarmGroup` struct: `TArray<AEnemyShipBase*> Members`, `AActor* SharedTarget`
- f. Drones in same group maintain loose cohesion — if too far apart (~800 units), drift back

### 3.3.6 Add Drone death VFX

- a. Create Niagara System `NS_DroneDeath` — small pop explosion
- b. Emitter 1: 6-8 metal debris chunks, burst outward with spin
- c. Emitter 2: purple ooze particles (10-15), drift and fade over 0.3s
- d. Emitter 3: small flash — white core, orange edge, 0.05s duration
- e. Colors: Astroneer-style bright pop against dark space
- f. Add death sound: small crackle + burst, pitch-shifted for variety

---

## 3.4 Enemy Type: Striker (Fast)

### 3.4.1 Create Striker DataTable row

- a. Add row: RowName = `Striker` to `DT_EnemyChassis`
- b. Set: BaseHP=80, BaseShield=20, BaseSpeed=650, Size=0.8
- c. Set: SpawnCost=3, TraitSlots=1 (can have one trait in later phases)
- d. Set: EngagementRange=500 (medium range)
- e. Set: MineralDrop=15, WeaponDropChance=0.10
- f. Set: CorruptionLevel=0.35 (noticeable purple-red on hull)
- g. Reference BehaviorTree: `BT_Striker`

### 3.4.2 Create Striker behavior tree

- a. Create `BT_Striker` in `Content/AI/BehaviorTrees/`
- b. Root → Selector:
- c. Branch 1 (low HP <30%): Flee — move away from target for 3s, then re-engage
- d. Branch 2 (has target): Strafe → Fire burst → Reposition → Repeat
- e. Branch 3: No target → Patrol in figure-8 near home position
- f. Key behavior: Strikers are dangerous, evasive, and unpredictable

### 3.4.3 Create BTTask_StrafeTarget

- a. Create custom BT task `BTTask_StrafeTarget`
- b. Calculate orbit position: circle around target at EngagementRange
- c. Pick orbit direction (CW or CCW) randomly on first engagement
- d. Move along orbit arc — angular speed ~45°/s
- e. Periodically (every 3-5s) switch orbit direction for unpredictability
- f. Maintain distance: if player approaches, back away. If too far, close in.
- g. Add perpendicular juke movements (dodge left/right 100 units) every 2-4s
- h. Task runs continuously until aborted by parent tree node

### 3.4.4 Create Striker weapon

- a. Add DataTable row `StrikerBurst` — burst fire weapon
- b. Values: Damage=20, FireRate=10 (fast within burst), BurstCount=3, BurstCooldown=0.8s
- c. ProjectileSpeed=2500, Range=1500, DamageType=Energy
- d. Implement burst fire in weapon: fire 3 shots at 0.1s interval, then wait 0.8s
- e. VFX: cyan-purple projectiles (energy type + corruption tint)
- f. Create burst fire SFX: 3 rapid shots, distinct from single shots

### 3.4.5 Create Striker mesh

- a. Create `SM_Striker` — angular, aggressive ship shape (~80 units)
- b. Design: swept-back wings, sharp nose, predatory silhouette
- c. Apply base material: dark grey/navy with metallic highlights
- d. Corruption overlay: visible purple-red tendrils on wing edges and hull seams
- e. Add engine glow: two small purple-tinted thrust points at rear
- f. Corruption level 0.35: clearly alien but still recognizable as a ship

### 3.4.6 Add Striker death VFX

- a. Create Niagara System `NS_StrikerDeath` — medium explosion
- b. Emitter 1: 10-15 hull fragment meshes, burst with rotation and velocity
- c. Emitter 2: ooze spray — 20-30 purple-red particles, spray in cone from center
- d. Emitter 3: energy discharge — cyan sparks (from shields), dissipate over 0.3s
- e. Emitter 4: flash — brighter than Drone, 0.08s white core
- f. Death sound: satisfying crunch + energy discharge, pitch-shifted

---

## 3.5 Enemy Type: Bomber (Slow AoE)

### 3.5.1 Create Bomber DataTable row

- a. Add row: RowName = `Bomber` to `DT_EnemyChassis`
- b. Set: BaseHP=150, BaseShield=30, BaseSpeed=350, Size=1.2
- c. Set: SpawnCost=5, TraitSlots=1
- d. Set: EngagementRange=300 (needs to get close for AoE)
- e. Set: MineralDrop=25, WeaponDropChance=0.15
- f. Set: CorruptionLevel=0.45 (pulsing ooze sacs visible)
- g. Reference BehaviorTree: `BT_Bomber`

### 3.5.2 Create Bomber behavior tree

- a. Create `BT_Bomber` — slow, deliberate approach
- b. Root → Selector:
- c. Branch 1 (in AoE range <300): Sequence → Show warning → Detonate AoE → Cooldown → Repeat
- d. Branch 2 (has target, far): Move slowly toward target, absorb damage, don't flinch
- e. Branch 3: No target → Drift slowly in random direction
- f. Key behavior: Bombers are tanks — they take hits and keep coming, punish melee range

### 3.5.3 Create AoE attack ability

- a. Create `UBomberAoEAbility` component — manages charge-up and detonation
- b. Charge phase: 1.5s warning period before detonation
- c. During charge: Bomber stops moving, glows red, pulsing sound builds
- d. On detonation: deal 40 damage to all actors within 400 unit radius
- e. Use `UGameplayStatics::ApplyRadialDamage()` with falloff (full at center, 50% at edge)
- f. Cooldown: 4s after detonation before next AoE attempt
- g. Bomber can still take damage during charge — if killed, no detonation

### 3.5.4 Create AoE warning VFX

- a. Create Niagara System `NS_BomberCharging` — pulsing red ring on ground plane
- b. Emitter: expanding ring decal from 0 to 400 units radius over 1.5s
- c. Color: red-orange, opacity increasing as charge progresses
- d. Add inner pulsing glow on Bomber mesh during charge (emissive ramp up)
- e. At detonation: `NS_BomberAoE` — red-orange explosion sphere, expanding and fading
- f. Add charging sound: rising pulse tone, builds urgency, cues player to dodge

### 3.5.5 Create Bomber mesh

- a. Create `SM_Bomber` — bulky, heavy ship shape (~120 units)
- b. Design: rounded, armored, visible ooze sacs on hull (like pustules)
- c. Apply base material: dark grey with red-orange warning stripes
- d. Corruption overlay: pulsing purple-red ooze sacs, visible through hull gaps
- e. Ooze sacs glow brighter during AoE charge (material parameter driven)
- f. Size makes it visually distinct from smaller enemies — reads as a threat

### 3.5.6 Add Bomber death VFX

- a. Create Niagara System `NS_BomberDeath` — large explosion
- b. Emitter 1: 15-20 heavy hull fragments, burst with slower velocity (heavy debris)
- c. Emitter 2: massive ooze splatter — 30-40 purple-red particles, spray in all directions
- d. Emitter 3: shockwave ring — expanding circle, fades at 300 unit radius
- e. Emitter 4: bright flash — 0.1s, screen shake (medium preset)
- f. Death sound: deep boom + wet splatter (ooze), satisfying destruction

---

## 3.6 Wave Spawning System

### 3.6.1 Create ASpawnManager

- a. Create `ShatteredWorld/Public/SpawnManager.h` inheriting `AActor`
- b. Add `UPROPERTY`: `int32 CurrentWave`, `int32 MaxWaves`, `int32 ActiveEnemyCount`
- c. Add `UPROPERTY`: `TArray<FWaveDefinition> WaveDefinitions` — configurable wave table
- d. Add state: `EWaveState` enum (WaitingToStart, Spawning, InProgress, CalmPeriod, Complete)
- e. Add delegates: `FOnWaveStarted`, `FOnWaveCompleted`, `FOnAllWavesCompleted`
- f. Place one SpawnManager per sector level

### 3.6.2 Implement budget system

- a. Create `FWaveDefinition` struct: `int32 Budget`, `float SpawnDelay`, `TArray<FName> AllowedChassis`
- b. Define spawn costs in chassis DataTable (already done: Drone=1, Striker=3, Bomber=5)
- c. In `SpawnWave()`: while remaining budget > 0, pick random allowed chassis
- d. Check chassis spawn cost ≤ remaining budget before selecting
- e. Subtract cost from budget, add chassis to spawn queue
- f. If no chassis fits remaining budget, wave is fully populated
- g. Bias toward variety — don't spawn all same type (track count per type, prefer underrepresented)

### 3.6.3 Create wave definitions

- a. Wave 1: Budget=6 (e.g., 6 Drones, or 2 Strikers, or 1 Striker + 3 Drones)
- b. Wave 2: Budget=12 (e.g., 4 Strikers, or 2 Bombers + 2 Drones, or mix)
- c. Wave 3: Budget=20 (e.g., 1 Bomber + 3 Strikers + 5 Drones)
- d. AllowedChassis per wave: W1=[Drone, Striker], W2=[Drone, Striker, Bomber], W3=[All]
- e. Store as DataTable or direct UPROPERTY array on SpawnManager
- f. Future: scale budgets by sector difficulty tier

### 3.6.4 Implement spawn points

- a. Create `ASpawnPoint` actor — empty marker placed around arena edges
- b. Place 8-12 spawn points around arena perimeter, outside initial camera view
- c. In `SpawnWave()`: pick spawn points randomly for each enemy group
- d. Don't reuse same spawn point consecutively (spread enemies around)
- e. Check spawn point is not currently visible to any player camera (spawn off-screen)
- f. If no valid off-screen point: pick furthest point from all players

### 3.6.5 Implement staggered spawning

- a. Don't spawn all enemies at once — use spawn queue with delay
- b. Create `TQueue<FSpawnRequest>` — chassis name + spawn point
- c. Pop from queue every 0.3-0.5s, spawn enemy at designated point
- d. Groups (like Drone packs) spawn in rapid succession (0.15s between each)
- e. Play spawn VFX at spawn point — purple warp-in effect before enemy appears
- f. Create `NS_EnemyWarpIn` — void tear that opens, enemy flies through, tear closes

### 3.6.6 Implement calm period

- a. After all enemies in current wave are dead: start calm timer (5s)
- b. Broadcast `OnWaveCompleted(CurrentWave)` — HUD shows "Wave X Complete"
- c. During calm: no enemies, player can collect remaining loot, breathe
- d. After calm timer: increment wave counter, broadcast `OnWaveStarted(CurrentWave+1)`
- e. If `CurrentWave > MaxWaves`: broadcast `OnAllWavesCompleted` — sector is done
- f. Display wave counter: "Wave 2/3" in top center HUD during active wave

### 3.6.7 Add wave start audio cue

- a. Create `SC_WaveWarning` — radar ping or klaxon sound, 1s before spawning
- b. Create `SC_WaveStart` — dramatic whoosh + spawn sound on first enemy appearance
- c. Play warning during last 1s of calm period
- d. Play start sound coinciding with first enemy spawn in new wave
- e. Volume and urgency scale with wave number (Wave 3 sounds more intense than Wave 1)

### 3.6.8 Track active enemies

- a. In SpawnManager: `TArray<AEnemyShipBase*> ActiveEnemies` — all living enemies
- b. On enemy spawn: add to array, increment `ActiveEnemyCount`
- c. On enemy death: remove from array, decrement `ActiveEnemyCount`
- d. Bind to each enemy's `OnDeath` delegate in spawn function
- e. When `ActiveEnemyCount == 0` and wave is in progress: trigger wave completion
- f. Expose `GetActiveEnemyCount()` for HUD displays and AI decisions

---

## 3.7 Loot & Pickup System

### 3.7.1 Create APickupBase class

- a. Create `ShatteredCombat/Public/PickupBase.h` inheriting `AActor`
- b. Add `UStaticMeshComponent* PickupMesh` — visual representation
- c. Add `USphereComponent* DetectionSphere` — radius 100, overlap with pawns
- d. Add `USphereComponent* MagnetSphere` — radius 200, triggers drift toward player
- e. Add floating animation: `FMath::Sin(GetGameTimeSinceCreation() * 2.0f) * 10.0f` offset Y
- f. Add slow rotation: 45°/s yaw spin for visual interest
- g. Add `UFUNCTION`: `OnPickedUp(AActor* Collector)` — virtual, override per type
- h. Set lifetime: auto-destroy after 30s if not collected

### 3.7.2 Create AMineralPickup

- a. Create inheriting from `APickupBase`
- b. Set mesh to small gold crystal/ore model
- c. Add `UPROPERTY`: `int32 MineralAmount` — how many minerals this pickup awards
- d. Override `OnPickedUp()`: add minerals to player state, play SFX, destroy self
- e. Create emissive gold material — warm glow, pulsing emissive (0.8-1.2 intensity, 2Hz)
- f. Add gold point light component, radius 80, intensity low — makes it visible in dark areas

### 3.7.3 Create AWeaponPickup

- a. Create inheriting from `APickupBase`
- b. Add `UPROPERTY`: `FName WeaponName` — DataTable row reference for the weapon
- c. Set mesh to weapon model (or generic weapon crate placeholder)
- d. Add proximity info widget: when player within 300 units, show weapon name + key stats
- e. Create `UWidgetComponent` displaying weapon card (name, damage, fire rate, rarity)
- f. Override `OnPickedUp()`: add weapon to player's cargo, play SFX, destroy self
- g. Apply rarity glow color: white=Common, green=Uncommon, blue=Rare, purple=Epic

### 3.7.4 Implement loot drop tables

- a. Create `FLootDropEntry` struct: `TSubclassOf<APickupBase> PickupClass`, `float DropChance`, `int32 MinAmount`, `int32 MaxAmount`
- b. Create `FLootTable` struct: `TArray<FLootDropEntry> Entries`
- c. On `AEnemyShipBase::HandleDeath()`: roll loot table
- d. Minerals: always drop (100%), amount from chassis DataTable `MineralDropAmount`
- e. Weapon: chance from chassis DataTable `WeaponDropChance`, pick random weapon from available pool
- f. Spawn pickups at enemy death location with slight random scatter (±50 units)
- g. Future: rarity chances scale by ring depth and difficulty

### 3.7.5 Implement weapon pickup (direct equip for M2)

- a. In M2 (pre-cargo): picking up weapon auto-equips, dropping current
- b. On weapon pickup overlap: call `PlayerPawn->EquipWeapon(WeaponName)`
- c. `EquipWeapon()`: destroy current weapon actor, spawn new weapon actor from DataTable
- d. Attach new weapon to ship's weapon socket
- e. Spawn dropped weapon pickup at player location with old weapon data
- f. Future (M3): weapons go to cargo instead of auto-equip

### 3.7.6 Implement loot magnet

- a. On `MagnetSphere` overlap with player: set `bMagnetized = true`, store magnet target
- b. In `Tick()` when magnetized: move pickup toward target at increasing speed
- c. Speed: start at 200 units/s, accelerate to 800 units/s over 0.5s
- d. When detection sphere overlaps player: trigger `OnPickedUp()`, collect
- e. Magnet only activates for the player who first enters magnet range
- f. In co-op: each player has own magnet range, instanced loot responds only to its owner

### 3.7.7 Add pickup VFX

- a. Mineral pickups: `NS_MineralIdle` — 4-6 gold sparkle particles orbiting the crystal, slow
- b. Weapon pickups: `NS_WeaponIdle` — rarity-colored particle ring at base
- c. On collect: `NS_PickupCollect` — burst of particles toward collector, trail effect
- d. Mineral collect Niagara: gold trail arcing from pickup to player ship (0.3s, 10 particles)
- e. Weapon collect Niagara: colored flash at pickup location + sparkle burst

### 3.7.8 Add pickup audio

- a. `SC_MineralPickup` — bright "ding" sound, short and satisfying
- b. Add pitch modulation: each consecutive pickup within 1s increases pitch slightly (+2%)
- c. Creates escalating "ding-ding-ding" when collecting many minerals rapidly
- d. `SC_WeaponPickup` — distinct, heavier sound: mechanical lock + chime
- e. `SC_WeaponDrop` — clunk sound when old weapon drops to ground
- f. Volume: pickups audible at close range only (~500 units), not spammy in co-op

---

## 3.8 Additional Weapons

### 3.8.1 Create Spread Shot

- a. Add DataTable row `SpreadShot` in `DT_Weapons`
- b. Values: Damage=15 per pellet, FireRate=2.5, ProjectileSpeed=2500, Range=1200
- c. ProjectilesPerShot=5, SpreadAngle=30, DamageType=Kinetic
- d. Create `BP_SpreadShot` — override `Fire()`: spawn 5 projectiles with angular offset
- e. Angular offsets: -15°, -7.5°, 0°, +7.5°, +15° from aim direction
- f. Each projectile deals individual damage — close range = devastating, long range = weak
- g. Slightly lower projectile speed than Pulse Cannon (close-range bias)

### 3.8.2 Create Spread Shot VFX

- a. Muzzle flash: wider cone VFX (40° spread), orange-yellow
- b. Projectile trails: 5 parallel streaks, thinner than Pulse Cannon trails
- c. Impact VFX per pellet: smaller spark bursts (60% size of Pulse Cannon impact)
- d. Multiple impacts create a satisfying cluster of small explosions on enemy
- e. Fire SFX: shotgun-like blast, lower pitch than Pulse Cannon, punchier

### 3.8.3 Create Beam Laser

- a. Add DataTable row `BeamLaser` in `DT_Weapons`
- b. Values: DPS=40 (damage per second while beam is active), Range=1500
- c. bIsBeam=true, DamageType=Energy, no projectile (continuous ray)
- d. Create `BP_BeamLaser` — override fire behavior for continuous beam
- e. `StartFiring()`: enable beam trace, apply DPS to first overlapped enemy per tick
- f. `StopFiring()`: disable beam trace, deactivate VFX
- g. Beam uses line trace each tick to find hit point and target

### 3.8.4 Create Beam Laser VFX

- a. Create `NS_BeamLaser` Niagara system — continuous beam ribbon from muzzle to hit point
- b. Beam color: bright cyan core (emissive 5.0), teal edges
- c. Width: 10 units at source, 5 units at target (slight taper)
- d. Hit point VFX: heat shimmer + bright glow at contact location
- e. Beam flickers slightly (±2 unit width oscillation) for energy feel
- f. Hit SFX: continuous sizzle/burn sound while beam is on target
- g. Fire SFX: energy hum while beam is active, increases pitch under sustained fire

### 3.8.5 Create impact VFX per weapon type

- a. Pulse Cannon: `NS_Impact_Kinetic` — orange sparks (12-15), burst outward from hit normal
- b. Spread Shot: `NS_Impact_Kinetic_Small` — smaller version, 6-8 sparks, same color
- c. Beam Laser: `NS_Impact_Energy` — cyan glow spot + heat distortion ripple
- d. Each impact spawns at projectile hit location with rotation aligned to hit surface normal
- e. Impact sounds per type: Kinetic = metallic clang, Energy = electric zap
- f. Add Crab Champions-inspired screen shake: small (2px) per impact, stacks slightly

### 3.8.6 Create weapon switch system

- a. On weapon pickup interaction: check if player already has weapon equipped
- b. If equipped: spawn `AWeaponPickup` at player location with current weapon's data
- c. Destroy current weapon actor on ship
- d. Spawn new weapon actor from pickup's DataTable row, attach to ship socket
- e. Brief equip animation: 0.2s where fire is disabled (weapon "installing")
- f. Update HUD weapon icon to new weapon
- g. Play equip SFX: mechanical click/lock sound

### 3.8.7 Add weapon icon to HUD

- a. In `WBP_ShatteredHUD`: add weapon icon region in bottom-right
- b. Create `UImage* WeaponIcon` — shows weapon type icon (placeholder: colored rectangle per type)
- c. Create `UTextBlock* WeaponName` — small text below icon showing weapon name
- d. Add ammo/heat indicator (for future: beam has heat meter, others have ammo count)
- e. Bind to player's equipped weapon — update on weapon change event
- f. Flash icon briefly on weapon swap (scale up 1.2× → 1.0× over 0.2s)

---

## 3.9 Death & Restart

### 3.9.1 Implement ship death

- a. Bind to `HealthComponent->OnDeath` on player ship
- b. On death: disable all input immediately (`PlayerController->DisableInput()`)
- c. Stop all weapon firing, disable movement
- d. Set ship collision to `NoCollision` (don't interact with anything)
- e. Start death sequence: play VFX, wait 1.5s, show Run Failed screen
- f. Flag player as dead: `PlayerState->bIsDead = true`

### 3.9.2 Create death explosion VFX

- a. Create `NS_PlayerDeath` — large, dramatic explosion
- b. Emitter 1: 20-25 hull fragments, burst outward with high velocity + spin
- c. Emitter 2: fire/energy explosion sphere, expanding 200 units, fade over 0.5s
- d. Emitter 3: shockwave ring — bright, expanding, fades at 400 unit radius
- e. Add slow motion: set `UGameplayStatics::SetGlobalTimeDilation(0.3)` for 0.3s real-time
- f. After slow-mo: restore time dilation to 1.0
- g. Camera: slight zoom on death location, hold for 1.5s before UI overlay

### 3.9.3 Create Run Failed screen

- a. Create `WBP_RunFailed` widget — full-screen overlay, dark semi-transparent background
- b. Title: "SIGNAL LOST" in large bold text, fade-in animation (0.5s)
- c. Stats column: Enemies Killed, Minerals Earned, Sectors Visited (M3+), Time
- d. RD earned (if applicable): "Research Data: +X" (M4+)
- e. Buttons: "Retry" (restart run) and "Return to Hub" (go to menu)
- f. Fade-in: delay 1.5s after death, then fade in over 0.5s
- g. Play somber audio tone on screen appearance

### 3.9.4 Implement restart

- a. "Retry" button: close Run Failed widget
- b. Reset GameMode state: `CurrentWave = 0`, `ActiveEnemyCount = 0`
- c. Destroy all remaining actors: enemies, pickups, projectiles
- d. Respawn player ship at arena center with full HP/shields
- e. Re-equip starting weapon (Pulse Cannon)
- f. Reset mineral counter (minerals earned this run = 0)
- g. Restart SpawnManager: begin Wave 1 after 2s delay
- h. Re-enable player input

### 3.9.5 Add death audio

- a. `SC_PlayerDeath` — layered: explosion boom + energy discharge + glass shatter
- b. After explosion (0.5s delay): brief silence (0.3s) for dramatic effect
- c. Then: low, somber tone or drone — signals failure, emotional weight
- d. "SIGNAL LOST" text appears synced with the somber tone
- e. Button hover sounds: subtle click for menu navigation

---

## 3.10 Combat HUD Additions

### 3.10.1 Add shield bar

- a. In `WBP_ShatteredHUD`: add `UProgressBar* ShieldBar` above HP bar
- b. Anchor: top-left, offset (20, 8), size (200, 12) — thinner than HP bar
- c. Fill color: bright cyan (`#00E5FF`)
- d. Bind to `HealthComponent->CurrentShield / MaxShield`
- e. When shield is 0: hide bar or show as empty with cracked visual
- f. When shield is regenerating: add shimmer animation on the bar fill

### 3.10.2 Add minimap

- a. Create `WBP_Minimap` component widget — circular radar display
- b. Anchor: top-right corner, size 150×150 pixels
- c. Background: dark circle with concentric range rings (50%, 100% of radar range)
- d. Player: white dot at center (always centered, map rotates with player heading)
- e. Enemies: red dots, size proportional to enemy size class
- f. Loot: gold dots (minerals), colored dots (weapons, color = rarity)
- g. Radar range: 2000 units (adjustable). Objects beyond range not shown.
- h. Update positions every 0.1s (not every frame — performance)

### 3.10.3 Add damage numbers

- a. Create `AFloatingDamageNumber` actor — spawns at damage location, floats upward
- b. Uses `UWidgetComponent` with `UTextBlock` showing damage amount
- c. White text for normal damage, gold text for critical hits (future)
- d. Font: bold, size 24 (normal) or 36 (crit)
- e. Animation: spawn at hit point, drift upward 100 units over 0.8s, fade out last 0.3s
- f. Slight random horizontal scatter (±30 units) so numbers don't stack
- g. Spawn from `HealthComponent::ApplyDamage()` — pass damage amount and hit location
- h. Object pool: reuse damage number actors to avoid constant spawn/destroy

### 3.10.4 Add hit markers

- a. Create hit marker widget on crosshair/center screen — two small white lines
- b. On enemy damage event: flash hit markers for 0.1s
- c. Normal hit: white markers. Critical hit (future): orange markers, slightly larger.
- d. Bind to `OnEnemyDamaged` event broadcast from weapon/projectile system
- e. Add subtle spread animation: markers start tight, expand slightly, then disappear

### 3.10.5 Add kill counter

- a. In `WBP_ShatteredHUD`: add `UTextBlock* KillCounter` near minimap
- b. Show format: small skull icon + number ("💀 12")
- c. Increment on each enemy death event from SpawnManager
- d. Add pop animation on increment: scale 1.0 → 1.3 → 1.0 over 0.15s
- e. Track total kills in PlayerState for run summary
