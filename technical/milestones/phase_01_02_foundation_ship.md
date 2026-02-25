# Phase 1 — Foundation & Project Setup

---

## 1.1 UE5 Project Initialization

### 1.1.1 Create UE5 blank project

- a. Open Epic Games Launcher → Unreal Engine 5.5 → New Project
- b. Select "Blank" C++ template, uncheck "Starter Content"
- c. Set project name to `ShatteredRogue`, set target directory
- d. Choose target platform: Windows (Desktop)
- e. Click Create, wait for initial compile and editor launch

### 1.1.2 Configure project settings

- a. Edit → Project Settings → Target Hardware → Desktop, Maximum Quality
- b. Set Rendering → Default RHI to DirectX 12
- c. Enable Forward Shading (Project Settings → Rendering → Forward Renderer)
- d. Set frame rate cap: Project Settings → General Settings → Frame Rate Limit → 60
- e. Enable Enhanced Input plugin: Edit → Plugins → search "Enhanced Input" → Enable
- f. Enable Niagara plugin (should be default, verify enabled)

### 1.1.3 Set up folder structure

- a. In Content Browser, create top-level folders: `Blueprints`, `VFX`, `UI`, `Audio`, `Meshes`, `Materials`, `DataTables`, `Maps`, `Textures`
- b. Under `Blueprints/`, create: `Ship`, `Weapons`, `Enemies`, `Pickups`, `World`, `UI`
- c. Under `VFX/`, create: `Weapons`, `Enemies`, `Environment`, `UI`, `Ship`
- d. Under `Audio/`, create: `Music`, `SFX`, `Ambient`
- e. Under `Maps/`, create: `Sectors`, `Hub`, `Menus`
- f. Create `Source/ShatteredRogue/` subfolders matching module names: `Core`, `Ship`, `Combat`, `World`, `UI`

### 1.1.4 Create base C++ gameplay classes

- a. Create `UShatteredGameInstance` — inherits `UGameInstance`, will hold persistent data (currencies, unlocks)
- b. Add `UPROPERTY` stubs: `PlayerMinerals`, `PlayerRD`, `UnlockedItems TArray`
- c. Create `AShatteredGameMode` — inherits `AGameModeBase`, will manage run state
- d. Override `InitGame()`, `StartPlay()`, `HandleStartingNewPlayer()` with empty bodies
- e. Create `AShatteredGameState` — inherits `AGameStateBase`, will hold shared run data
- f. Add `UPROPERTY` stub: `CurrentSector`, `WaveNumber`, `ActiveEnemyCount`
- g. Create `AShatteredPlayerState` — inherits `APlayerState`, will hold per-player data
- h. Add `UPROPERTY` stubs: `CurrentHP`, `CurrentShield`, `EquippedWeapon`, `CargoSlots`
- i. Set GameMode defaults in Project Settings → Maps & Modes → Default GameMode

### 1.1.5 Create primary game module

- a. Verify `ShatteredRogue.Build.cs` exists with correct module dependencies
- b. Add `PublicDependencyModuleNames`: `Core`, `CoreUObject`, `Engine`, `InputCore`, `EnhancedInput`, `Niagara`, `UMG`
- c. Create `ShatteredRogue.h` and `ShatteredRogue.cpp` module files with `IMPLEMENT_PRIMARY_GAME_MODULE`
- d. Build solution from IDE, verify clean compile with zero errors
- e. Run editor from IDE, verify project opens with no warnings

---

## 1.2 Version Control Setup

### 1.2.1 Initialize Git repository

- a. Open terminal in project root directory
- b. Run `git init`
- c. Create `.gitignore` with UE5 patterns: `Binaries/`, `Intermediate/`, `DerivedDataCache/`, `Saved/`, `.vs/`, `*.sln`, `*.suo`
- d. Add `*.uproject` to tracked files (do NOT ignore)
- e. Add `Config/`, `Content/`, `Source/` to tracked files
- f. Verify `.gitignore` by running `git status` — only desired files should appear

### 1.2.2 Configure Git LFS

- a. Run `git lfs install` in project root
- b. Run `git lfs track "*.uasset"` — all Unreal assets
- c. Run `git lfs track "*.umap"` — all Unreal maps
- d. Run `git lfs track "*.png" "*.jpg" "*.tga" "*.bmp"` — textures
- e. Run `git lfs track "*.wav" "*.mp3" "*.ogg"` — audio
- f. Run `git lfs track "*.fbx" "*.obj"` — 3D models
- g. Verify `.gitattributes` file was created with all tracking rules
- h. Add `.gitattributes` to git tracking

### 1.2.3 Create branches

- a. Run `git add -A && git commit -m "Initial UE5 project setup"`
- b. Push to GitHub: `git remote add origin <repo-url> && git push -u origin main`
- c. Create develop branch: `git checkout -b develop && git push -u origin develop`
- d. Set up branch protection on `main` in GitHub repo settings (require PR for merge)
- e. Switch back to develop for active work: `git checkout develop`

### 1.2.4 Push initial commit

- a. Verify all files are committed: `git status` shows clean working tree
- b. Push main: `git push origin main`
- c. Verify on GitHub web UI that all files appear, LFS files show correct sizes
- d. Check LFS storage usage on GitHub to confirm binary tracking

### 1.2.5 Verify LFS tracking

- a. Create a small test texture (100×100 PNG) in `Content/Textures/`
- b. Run `git add Content/Textures/test.png`
- c. Run `git lfs ls-files` — verify test.png appears in LFS file list
- d. Commit and push, verify on GitHub the file shows "Stored with Git LFS"
- e. Delete local file, pull from remote, verify file restores correctly
- f. Delete test file and commit cleanup

---

## 1.3 Core Plugin Architecture

### 1.3.1 Create ShatteredCore module

- a. Create directory `Source/ShatteredCore/`
- b. Create `ShatteredCore.Build.cs` with module definition, depends on `Core`, `CoreUObject`, `Engine`
- c. Create `ShatteredCore.h` — module declaration with `DECLARE_LOG_CATEGORY_EXTERN`
- d. Create `ShatteredCore.cpp` — `IMPLEMENT_MODULE` macro
- e. Create `Public/Types/` directory for shared enums and structs
- f. Create `EShatteredDamageType` enum — `Kinetic`, `Energy` (MVP), `Explosive`, `Void` (future)
- g. Create `EShatteredRarity` enum — `Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`
- h. Create `EShatteredEnvironment` enum — `AsteroidField`, `Nebula`, `VoidRift`, etc.
- i. Add ShatteredCore to `.uproject` modules list and verify compile

### 1.3.2 Create ShatteredShip module

- a. Create directory `Source/ShatteredShip/`
- b. Create `ShatteredShip.Build.cs` — depends on `ShatteredCore`, `EnhancedInput`
- c. Create module boilerplate (`.h`, `.cpp`)
- d. Create `Public/` directory for ship pawn, movement, boost component headers
- e. Create `Private/` directory for implementations
- f. Verify clean compile, module loads in editor

### 1.3.3 Create ShatteredCombat module

- a. Create directory `Source/ShatteredCombat/`
- b. Create `ShatteredCombat.Build.cs` — depends on `ShatteredCore`, `ShatteredShip`, `Niagara`
- c. Create module boilerplate
- d. Create `Public/` for weapon base, projectile base, damage system headers
- e. Create `Private/` for implementations
- f. Verify clean compile

### 1.3.4 Create ShatteredWorld module

- a. Create directory `Source/ShatteredWorld/`
- b. Create `ShatteredWorld.Build.cs` — depends on `ShatteredCore`
- c. Create module boilerplate
- d. Create `Public/` for sector manager, galaxy map, spawn manager headers
- e. Create `Private/` for implementations
- f. Verify clean compile

### 1.3.5 Create ShatteredUI module

- a. Create directory `Source/ShatteredUI/`
- b. Create `ShatteredUI.Build.cs` — depends on `ShatteredCore`, `ShatteredShip`, `ShatteredCombat`, `UMG`, `Slate`, `SlateCore`
- c. Create module boilerplate
- d. Create `Public/` for HUD, widget base classes
- e. Create `Private/` for implementations
- f. Verify clean compile

### 1.3.6 Set up module dependency chain

- a. Update main `ShatteredRogue.Build.cs` to depend on all 5 modules
- b. Verify dependency order: Core → Ship/Combat/World → UI → Main
- c. Build full solution from clean — `Build → Rebuild Solution`
- d. Verify all 6 modules load in editor: Window → Developer Tools → Modules
- e. Test hot-reload: make trivial change in ShatteredCore, verify all dependent modules reload

---

## 1.4 Data Architecture

### 1.4.1 Create FHullData struct

- a. Create `ShatteredCore/Public/Types/ShatteredHullData.h`
- b. Define `USTRUCT(BlueprintType) FHullData`
- c. Add `UPROPERTY` fields: `FName HullName`, `float MaxSpeed`, `float Acceleration`, `float Drag`
- d. Add `UPROPERTY` fields: `float BoostSpeedMultiplier`, `float BoostDuration`, `float BoostCooldown`
- e. Add `UPROPERTY` fields: `int32 MaxHP`, `int32 MaxShield`, `float ShieldRegenRate`, `float ShieldRegenDelay`
- f. Add `UPROPERTY` fields: `int32 PrimaryWeaponSlots`, `int32 SecondaryWeaponSlots`, `int32 ModuleSlots`, `int32 CargoSlots`
- g. Add `UPROPERTY` fields: `int32 JumpRange`, `float ShipRadius`, `TSoftObjectPtr<UStaticMesh> ShipMesh`
- h. Verify struct compiles and is visible in Blueprint

### 1.4.2 Create FWeaponData struct

- a. Create `ShatteredCore/Public/Types/ShatteredWeaponData.h`
- b. Define `USTRUCT(BlueprintType) FWeaponData`
- c. Add fields: `FName WeaponName`, `EShatteredRarity Rarity`, `float BaseDamage`, `float FireRate`
- d. Add fields: `float ProjectileSpeed`, `float Range`, `EShatteredDamageType DamageType`
- e. Add fields: `int32 ProjectilesPerShot`, `float SpreadAngle`, `bool bIsBeam`, `bool bIsHoming`
- f. Add fields: `TSoftObjectPtr<UNiagaraSystem> MuzzleFlashVFX`, `TSoftObjectPtr<UNiagaraSystem> ImpactVFX`
- g. Add fields: `TSoftObjectPtr<USoundBase> FireSFX`, `TSoftObjectPtr<USoundBase> ImpactSFX`
- h. Add field: `int32 MineralValue` (scrap value)

### 1.4.3 Create FEnemyChassisData struct

- a. Create `ShatteredCore/Public/Types/ShatteredEnemyData.h`
- b. Define `USTRUCT(BlueprintType) FEnemyChassisData`
- c. Add fields: `FName ChassisName`, `int32 BaseHP`, `int32 BaseShield`, `float BaseSpeed`
- d. Add fields: `float Size`, `int32 SpawnCost`, `int32 TraitSlots`
- e. Add fields: `TSoftObjectPtr<UBehaviorTree> DefaultBehaviorTree`
- f. Add fields: `TSoftObjectPtr<UStaticMesh> BaseMesh`, `float CorruptionLevel`
- g. Add fields: `TArray<FName> AllowedTraitCategories`

### 1.4.4 Create FTraitData struct

- a. In same file or new `ShatteredTraitData.h`
- b. Define `USTRUCT(BlueprintType) FTraitData`
- c. Add fields: `FName TraitName`, `ETraitCategory Category` (Movement, Attack, Defense, Special)
- d. Add fields: `FString Description`, `float SpeedModifier`, `float DamageModifier`, `float HPModifier`
- e. Add fields: `TSoftObjectPtr<UBehaviorTree> TraitBehaviorTreeOverride`
- f. Add fields: `TSoftObjectPtr<UNiagaraSystem> TraitVFX`

### 1.4.5 Create FSectorData struct

- a. Create `ShatteredCore/Public/Types/ShatteredSectorData.h`
- b. Define `USTRUCT(BlueprintType) FSectorData`
- c. Add fields: `FName SectorName`, `EShatteredEnvironment Environment`, `ESectorType SectorType` (Combat, Mining, Station, Boss, Event)
- d. Add fields: `int32 DifficultyTier`, `int32 RingIndex`, `float LootMultiplier`
- e. Add fields: `TArray<FVector2D> HexGridPosition`, `TArray<int32> ConnectedSectorIndices`
- f. Add fields: `bool bIsRevealed`, `bool bIsVisited`, `bool bIsCompleted`

### 1.4.6 Create DataTable assets

- a. In Editor, create DataTable asset `DT_Hulls` using `FHullData` row struct
- b. Add Interceptor row with tuned values from design doc 15
- c. Create DataTable asset `DT_Weapons` using `FWeaponData` row struct
- d. Add Pulse Cannon row with tuned values
- e. Create DataTable asset `DT_EnemyChassis` using `FEnemyChassisData` row struct
- f. Add Drone, Striker, Bomber rows (leave empty initially, fill in M2)
- g. Create DataTable asset `DT_Traits` using `FTraitData` row struct (empty for now)
- h. Create DataTable asset `DT_Sectors` using `FSectorData` row struct (empty for now)
- i. Save all DataTables to `Content/DataTables/` folder

### 1.4.7 Create UShatteredDataSubsystem

- a. Create `ShatteredCore/Public/ShatteredDataSubsystem.h`
- b. Inherit from `UGameInstanceSubsystem` — auto-created with GameInstance
- c. Add `UPROPERTY` refs to all DataTables: `UDataTable* HullDataTable`, `UDataTable* WeaponDataTable`, etc.
- d. Create `Initialize()` override — load DataTable references from asset paths
- e. Create `GetHullData(FName HullName)` → returns `FHullData*` row lookup
- f. Create `GetWeaponData(FName WeaponName)` → returns `FWeaponData*` row lookup
- g. Create `GetChassisData(FName ChassisName)` → returns `FEnemyChassisData*` row lookup
- h. Test in editor: spawn test actor, call subsystem, verify data returns correctly

---

## 1.5 Input System Setup

### 1.5.1 Create Enhanced Input mapping context

- a. In Editor: Content Browser → right-click → Input → Input Mapping Context → name `IMC_Gameplay`
- b. Save to `Content/Input/IMC_Gameplay`
- c. Create second context `IMC_Menu` for menu navigation (separate from gameplay)

### 1.5.2 Define input actions

- a. Create Input Action assets in `Content/Input/Actions/`:
- b. `IA_Move` — Value Type: Axis2D (vector input for 2D movement)
- c. `IA_Aim` — Value Type: Axis2D (mouse position or right stick)
- d. `IA_PrimaryFire` — Value Type: Digital (bool, hold to fire)
- e. `IA_SecondaryFire` — Value Type: Digital (bool, hold to fire)
- f. `IA_Boost` — Value Type: Digital (press to activate)
- g. `IA_Ability` — Value Type: Digital (press to activate hull ability)
- h. `IA_Interact` — Value Type: Digital (press to dock/pick up)
- i. `IA_ToggleMap` — Value Type: Digital (press to toggle galaxy map)
- j. `IA_ToggleInventory` — Value Type: Digital (press to toggle cargo screen)
- k. `IA_Pause` — Value Type: Digital (press to pause/menu)
- l. `IA_Ping` — Value Type: Digital (press to ping location for co-op)
- m. `IA_DroneCommand` — Value Type: Digital (press to cycle drone behavior)

### 1.5.3 Create KB/M input mapping

- a. Open `IMC_Gameplay` in editor
- b. Add `IA_Move` → Key: W (Modifier: Swizzle Y→X positive), S (negative Y), A (negative X), D (positive X)
- c. Add `IA_Aim` → Key: Mouse XY 2D-Axis
- d. Add `IA_PrimaryFire` → Key: Left Mouse Button
- e. Add `IA_SecondaryFire` → Key: Right Mouse Button
- f. Add `IA_Boost` → Key: Left Shift
- g. Add `IA_Ability` → Key: Space Bar
- h. Add `IA_Interact` → Key: E
- i. Add `IA_ToggleMap` → Key: Tab (+ alternate: M)
- j. Add `IA_ToggleInventory` → Key: I
- k. Add `IA_Pause` → Key: Escape
- l. Add `IA_Ping` → Key: Middle Mouse Button
- m. Add `IA_DroneCommand` → Key: Q

### 1.5.4 Create Gamepad input mapping

- a. Duplicate `IMC_Gameplay` as `IMC_Gameplay_Gamepad` or add gamepad bindings to same context
- b. Map `IA_Move` → Gamepad Left Thumbstick
- c. Map `IA_Aim` → Gamepad Right Thumbstick
- d. Map `IA_PrimaryFire` → Gamepad Right Trigger
- e. Map `IA_SecondaryFire` → Gamepad Left Trigger
- f. Map `IA_Boost` → Gamepad Left Shoulder (bumper)
- g. Map `IA_Ability` → Gamepad Right Shoulder (bumper)
- h. Map `IA_Interact` → Gamepad Face Button Bottom (A/Cross)
- i. Map `IA_ToggleMap` → Gamepad D-pad Up
- j. Map `IA_ToggleInventory` → Gamepad D-pad Right
- k. Map `IA_Pause` → Gamepad Special Right (Start)
- l. Map `IA_Ping` → Gamepad D-pad Down
- m. Map `IA_DroneCommand` → Gamepad D-pad Left

### 1.5.5 Create AShatteredPlayerController

- a. Create `ShatteredShip/Public/ShatteredPlayerController.h` inheriting `APlayerController`
- b. Add `UPROPERTY` for `UInputMappingContext* GameplayMappingContext`
- c. Override `BeginPlay()` — add mapping context to Enhanced Input Subsystem with priority 0
- d. Create `SetupInputComponent()` override — bind all `IA_*` actions to handler functions
- e. Create stub handler functions: `HandleMove(FInputActionValue)`, `HandleAim(FInputActionValue)`, `HandlePrimaryFire(FInputActionValue)`, etc.
- f. Implement `HandleMove` — extract `FVector2D` from action value, store as `MoveInput` member
- g. Implement `HandleAim` — for mouse: project screen position to world plane, store as `AimWorldPosition`
- h. Set as default PlayerController in GameMode defaults

### 1.5.6 Implement input remapping

- a. Create `UShatteredInputSettings` — `USaveGame` subclass storing key bindings
- b. Add `TMap<FName, FKey> KeyBindings` — maps action name to key
- c. Create `SaveBindings()` — serialize to save slot "InputSettings"
- d. Create `LoadBindings()` — deserialize from save slot, apply to mapping context
- e. Create `ResetToDefaults()` — restore original bindings from default mapping context
- f. Hook into Settings menu (placeholder — actual UI built later)

---

## Phase 2 — M1: Ship Flies

---

## 2.1 Ship Actor

### 2.1.1 Create AShipPawn base class

- a. Create `ShatteredShip/Public/ShipPawn.h` inheriting `APawn`
- b. Create `USceneComponent` as `RootComponent` (default scene root)
- c. Create `UStaticMeshComponent* ShipMesh` — attach to root, set default mesh to nullptr
- d. Create `UCapsuleComponent* CollisionCapsule` — attach to root, set as collision primitive
- e. Set capsule half-height and radius for medium ship profile (~100×50)
- f. Set collision profile on capsule: `Pawn`, generate overlap events for pickups
- g. Add `UPROPERTY(EditAnywhere) FName HullName` — used to look up DataTable row
- h. Compile, create Blueprint child `BP_ShipPawn`, verify appears in editor

### 2.1.2 Add movement component

- a. Add `UFloatingPawnMovement* MovementComponent` to AShipPawn constructor
- b. Set `MaxSpeed` from DataTable → `FHullData.MaxSpeed` (default 800 for Interceptor)
- c. Set `Acceleration` from DataTable → `FHullData.Acceleration` (default 2000)
- d. Set `Deceleration` from DataTable → drag value (default 1500 for medium drag)
- e. Set `TurningBoost` to 0 — rotation is handled separately (instant aim)
- f. Override `Tick()` — apply movement input from PlayerController's `MoveInput` vector
- g. Call `AddMovementInput(WorldDirection, ScaleValue)` each tick based on input

### 2.1.3 Implement arcade drift movement

- a. In `Tick()`, read `MoveInput` vector from owning PlayerController
- b. Convert 2D input to 3D world direction (X=forward, Y=right in top-down view)
- c. Apply thrust: `AddMovementInput(Direction, InputMagnitude)` — acceleration handled by component
- d. When no input, movement component's deceleration applies drag automatically
- e. Tune drag so ship stops within ~0.5-1.0s of releasing input
- f. Clamp velocity to MaxSpeed × 1.0 (boosted speed handled separately)

### 2.1.4 Tune drag curve

- a. Create `UCurveFloat* DragCurve` asset — maps speed ratio (0-1) to drag multiplier
- b. At high speed: high drag (ship slows fast). At low speed: lower drag (smooth stop)
- c. Apply curve in Tick: `float DragMult = DragCurve->GetFloatValue(CurrentSpeed / MaxSpeed)`
- d. Multiply deceleration by DragMult each frame
- e. Test: ship should feel responsive on start, smooth on stop, slight drift at high speed
- f. Hull-specific tuning: Phantom = low drag (slippery), Juggernaut = high drag (tanky)

### 2.1.5 Implement instant rotation

- a. In `Tick()`, get aim target position from PlayerController (`AimWorldPosition`)
- b. Calculate direction from ship to aim target: `(AimTarget - ShipLocation).GetSafeNormal2D()`
- c. Set ship rotation: `SetActorRotation(DirectionVector.Rotation())` — instant, no interpolation
- d. Ship mesh always faces cursor/stick direction regardless of movement direction
- e. Test: ship should pivot instantly to face mouse, movement direction independent of facing

### 2.1.6 Add mesh socket points

- a. Open ship static mesh in editor (or create placeholder box mesh)
- b. Add socket `WeaponMount_Primary` at front of ship mesh
- c. Add socket `WeaponMount_Secondary` offset left or right of primary
- d. Add socket `Engine_Main` at rear center of ship
- e. Add socket `ShieldOrigin` at center of ship
- f. Add socket `BoostTrail` at rear, slightly below engine
- g. Set socket defaults (location, rotation) appropriate for top-down view alignment

### 2.1.7 Load hull parameters from DataTable

- a. In `AShipPawn::BeginPlay()`, get `UShatteredDataSubsystem` from GameInstance
- b. Call `GetHullData(HullName)` to get `FHullData*` pointer
- c. If valid: apply `MaxSpeed`, `Acceleration`, `Drag` to movement component
- d. Apply `MaxHP`, `MaxShield` to health component (created later in M2)
- e. Set `ShipMesh->SetStaticMesh(HullData->ShipMesh.LoadSynchronous())`
- f. Store slot counts (`PrimaryWeaponSlots`, `CargoSlots`, etc.) as member variables
- g. Log warning if DataTable row not found for `HullName`

### 2.1.8 Create Interceptor hull DataTable row

- a. Open `DT_Hulls` DataTable in editor
- b. Add row with RowName = `Interceptor`
- c. Set values: MaxSpeed=800, Acceleration=2000, Drag=1500
- d. Set values: BoostSpeedMultiplier=1.5, BoostDuration=0.4, BoostCooldown=3.0
- e. Set values: MaxHP=100, MaxShield=50, ShieldRegenRate=10, ShieldRegenDelay=3.0
- f. Set values: PrimaryWeaponSlots=1, SecondaryWeaponSlots=1, ModuleSlots=2, CargoSlots=3
- g. Set values: JumpRange=2, ShipRadius=50
- h. Leave ShipMesh as nullptr for now (placeholder used)
- i. Save DataTable

---

## 2.2 Boost/Dash System

### 2.2.1 Create UBoostComponent

- a. Create `ShatteredShip/Public/BoostComponent.h` inheriting `UActorComponent`
- b. Add `UPROPERTY`: `float BoostSpeedMultiplier`, `float BoostDuration`, `float BoostCooldown`
- c. Add `UPROPERTY`: `bool bIsBoosting`, `bool bIsOnCooldown`
- d. Add private: `float BoostTimer`, `float CooldownTimer`
- e. Add `UFUNCTION(BlueprintCallable)` for `ActivateBoost()` and `bool CanBoost()`
- f. Add delegate: `FOnBoostStateChanged` — broadcasts start and end of boost for VFX/audio hooks

### 2.2.2 Implement boost activation

- a. `ActivateBoost()` — check `CanBoost()` (not boosting, not on cooldown)
- b. Set `bIsBoosting = true`, `BoostTimer = BoostDuration`
- c. Get owning pawn's movement component, multiply current velocity by `BoostSpeedMultiplier`
- d. Temporarily increase movement component's `MaxSpeed` to `MaxSpeed × BoostSpeedMultiplier`
- e. Broadcast `OnBoostStateChanged(true)` for VFX/audio listeners
- f. In player controller's `HandleBoost()`, call `BoostComponent->ActivateBoost()`

### 2.2.3 Implement boost duration timer

- a. In `TickComponent()`, if `bIsBoosting`: decrement `BoostTimer -= DeltaTime`
- b. When `BoostTimer <= 0`: set `bIsBoosting = false`
- c. Restore movement component's `MaxSpeed` to normal value
- d. Start cooldown: set `bIsOnCooldown = true`, `CooldownTimer = BoostCooldown`
- e. Broadcast `OnBoostStateChanged(false)`

### 2.2.4 Implement boost cooldown

- a. In `TickComponent()`, if `bIsOnCooldown`: decrement `CooldownTimer -= DeltaTime`
- b. When `CooldownTimer <= 0`: set `bIsOnCooldown = false`
- c. `CanBoost()` returns `!bIsBoosting && !bIsOnCooldown`
- d. Expose `GetCooldownProgress()` → returns 0.0-1.0 for HUD display
- e. Load boost params from DataTable in `BeginPlay()` via owning pawn's hull data

### 2.2.5 Add boost VFX

- a. Create Niagara System `NS_BoostTrail` in `Content/VFX/Ship/`
- b. Emitter: continuous ribbon, emitting from `BoostTrail` socket
- c. Color: bright cyan-white core, fading to blue at edges
- d. Lifetime: particles live 0.3s, ribbon length ~200 units
- e. Scale: width increases during boost (thin idle trail → thick boost trail)
- f. On AShipPawn: spawn/activate Niagara component on `OnBoostStateChanged(true)`
- g. On `OnBoostStateChanged(false)`: deactivate emitter (let existing particles fade)

### 2.2.6 Add boost audio

- a. Create `USoundCue` `SC_BoostActivate` — short whoosh + engine rev layered
- b. Create `USoundCue` `SC_BoostEnd` — engine wind-down sound
- c. On `OnBoostStateChanged(true)`: play `SC_BoostActivate` at ship location
- d. On `OnBoostStateChanged(false)`: play `SC_BoostEnd` at ship location
- e. Set sound attenuation: audible within ~3000 units, falloff curve for co-op awareness

### 2.2.7 Add boost camera effect

- a. In camera manager or camera actor, listen for `OnBoostStateChanged`
- b. On boost start: lerp FOV from default to `default + 5°` over 0.1s
- c. On boost end: lerp FOV back to default over 0.3s (slower return feels better)
- d. Use `FMath::FInterpTo` for smooth FOV transition each tick
- e. Add slight motion blur post-process during boost (PostProcessSettings.MotionBlurAmount = 0.3)
- f. Reset motion blur on boost end

---

## 2.3 Camera System

### 2.3.1 Create AShatteredCameraActor

- a. Create `ShatteredShip/Public/ShatteredCameraActor.h` inheriting `AActor`
- b. Add `USpringArmComponent* SpringArm` — set length to ~2000, angle to -55° pitch
- c. Add `UCameraComponent* Camera` — attached to spring arm end
- d. Disable spring arm collision (no arm shrinking from obstacles in space)
- e. Set `bDoCollisionTest = false` on spring arm
- f. Spawn camera in GameMode's `HandleStartingNewPlayer()`, possess by player
- g. Alternative: use `APlayerCameraManager` override approach for cleaner integration

### 2.3.2 Set base camera parameters

- a. Set spring arm length: 2000 units
- b. Set spring arm rotation: Pitch = -55°, Yaw = 0°, Roll = 0°
- c. Set camera FOV: 90° (adjustable in settings)
- d. Set camera aspect ratio: use viewport default (widescreen)
- e. Enable post-process on camera: set bloom intensity to 0.3, auto-exposure to manual
- f. Set fixed exposure level to 1.0 (space scenes need consistent lighting)

### 2.3.3 Implement smooth follow

- a. In `Tick()`, get target position from possessed pawn (ship location)
- b. Calculate desired camera position: target position + spring arm offset
- c. Use `FMath::VInterpTo(CurrentPos, DesiredPos, DeltaTime, InterpSpeed)` with speed ~10
- d. Set camera actor location to interpolated position
- e. Result: camera follows ship with slight lag, feels cinematic without being sluggish
- f. Tune InterpSpeed: too high = snappy (bad), too low = laggy (bad), 8-12 is sweet spot

### 2.3.4 Implement look-ahead

- a. Get aim direction from player controller: `(AimWorldPosition - ShipPosition).GetSafeNormal2D()`
- b. Calculate offset: `AimDirection * LookAheadDistance` (default 200 units)
- c. Add offset to target position before smooth follow calculation
- d. Result: camera leads slightly in aim direction, showing more of what you're aiming at
- e. Tune: 150-250 units feels right. Too much = disorienting. Too little = no benefit.
- f. Add look-ahead interpolation so it doesn't snap when rapidly changing aim direction

### 2.3.5 Implement dynamic zoom-out on boost

- a. Listen for `OnBoostStateChanged` from ship's boost component
- b. On boost start: target spring arm length = 2200 (from 2000)
- c. In `Tick()`: `SpringArm->TargetArmLength = FMath::FInterpTo(Current, Target, DT, 5.0f)`
- d. On boost end: target arm length = 2000
- e. Return to normal is slightly slower (lerp speed 3.0 vs 5.0)

### 2.3.6 Add screen shake system

- a. Create `UShatteredCameraShake` class inheriting `UCameraShakeBase`
- b. Create preset instances: `ShakeWeaponFire` (tiny, 0.05s), `ShakeImpact` (small, 0.1s), `ShakeDeath` (large, 0.5s)
- c. Each shake defines: Duration, Amplitude (translation + rotation), Frequency
- d. Create `PlayShake(ShakePreset)` function callable from anywhere via player controller
- e. In `AShatteredPlayerController`, implement `ClientPlayCameraShake()` wrapper
- f. Test: verify shake is visible but not nauseating. Respect player accessibility settings.

### 2.3.7 Implement damage vignette

- a. Create `UMaterialInterface` post-process material `M_DamageVignette`
- b. Material: red tint at screen edges, intensity parameter (0-1)
- c. Add post-process material to camera's post-process settings
- d. Expose `float DamageVignetteIntensity` — set via Blueprint/code
- e. On damage event: set intensity to 0.5, lerp back to 0 over 0.3s
- f. On low HP (<20%): pulse intensity between 0.1 and 0.3 at heartbeat rate (1Hz)
- g. On full HP: intensity = 0 (no vignette)

---

## 2.4 Primary Weapon (Pulse Cannon)

### 2.4.1 Create AWeaponBase class

- a. Create `ShatteredCombat/Public/WeaponBase.h` inheriting `AActor`
- b. Add `UPROPERTY`: `FName WeaponName`, stores DataTable row reference
- c. Add `UPROPERTY`: `USceneComponent* MuzzlePoint` — spawn point for projectiles
- d. Add state: `float FireTimer` (countdown between shots), `bool bIsFiring`
- e. Add `UFUNCTION`: `StartFiring()`, `StopFiring()`, `Fire()` (single shot)
- f. Attach to owning ship's weapon socket on spawn (`AttachToComponent`)
- g. In `Tick()`: if `bIsFiring` and `FireTimer <= 0`, call `Fire()`, reset timer to `1.0f / FireRate`
- h. Decrement `FireTimer` every tick

### 2.4.2 Create AProjectileBase class

- a. Create `ShatteredCombat/Public/ProjectileBase.h` inheriting `AActor`
- b. Add `UProjectileMovementComponent` — handles movement, speed, homing
- c. Add `USphereComponent* CollisionSphere` — small radius (10-20), overlap events
- d. Add `UStaticMeshComponent* ProjectileMesh` — optional visible mesh or use VFX only
- e. Add `UPROPERTY`: `float Damage`, `EShatteredDamageType DamageType`, `float Lifetime`
- f. On `BeginOverlap` with enemy: apply damage to target's HealthComponent, then destroy self
- g. On `BeginOverlap` with environment: spawn impact VFX, destroy self
- h. Set lifetime: destroy self after `Lifetime` seconds if no hit (default 3.0s)
- i. Ignore collision with owning player (set ignore actor on spawn)

### 2.4.3 Implement Pulse Cannon

- a. Create DataTable row `PulseCannon` in `DT_Weapons`
- b. Values: Damage=25, FireRate=6.67 (0.15s interval), ProjectileSpeed=3000, Range=2000
- c. DamageType=Kinetic, ProjectilesPerShot=1, SpreadAngle=0, bIsBeam=false, bIsHoming=false
- d. Create Blueprint `BP_PulseCannon` child of AWeaponBase, set WeaponName = `PulseCannon`
- e. Override `Fire()`: spawn `BP_PulseProjectile` at muzzle point, facing aim direction
- f. Set projectile initial speed and damage from DataTable values

### 2.4.4 Spawn projectiles from weapon socket

- a. In `AWeaponBase::Fire()`, get muzzle point world location and rotation
- b. Calculate fire direction: from muzzle toward `AimWorldPosition` from player controller
- c. Spawn projectile: `GetWorld()->SpawnActor<AProjectileBase>(ProjectileClass, MuzzleTransform)`
- d. Set projectile velocity: `FireDirection * ProjectileSpeed`
- e. Set projectile damage and damage type from weapon data
- f. Set projectile instigator to owning player (for damage attribution in co-op)

### 2.4.5 Add muzzle flash VFX

- a. Create Niagara System `NS_PulseCannon_MuzzleFlash` in `Content/VFX/Weapons/`
- b. Emitter: burst, 8-12 particles, spread in cone from muzzle direction
- c. Color: bright orange center, fading to yellow at edges
- d. Lifetime: 0.05s — very fast, just a flash
- e. Scale: particles ~20-30 units radius
- f. In `AWeaponBase::Fire()`: spawn Niagara component at muzzle point, auto-destroy

### 2.4.6 Add projectile trail VFX

- a. Create Niagara System `NS_PulseProjectile_Trail`
- b. Emitter: ribbon trail, emitting from projectile center
- c. Color: orange with slight glow (emissive material)
- d. Width: 5-10 units, narrow streak
- e. Lifetime: 0.15s per ribbon segment
- f. Attach to projectile actor in `BeginPlay()`, auto-detach on destroy (trail fades)

### 2.4.7 Add screen shake on fire

- a. Create `UShatteredCameraShake` preset `Shake_PulseFire`
- b. Settings: Duration=0.05, Amplitude=0.5px translation, no rotation
- c. In `AWeaponBase::Fire()`, call `PlayerController->ClientPlayCameraShake(Shake_PulseFire)`
- d. Shake is tiny — subliminal feedback, not disorienting
- e. Test: rapid-fire should create a subtle vibration feel, not jarring motion

### 2.4.8 Add fire audio

- a. Create `USoundCue` `SC_PulseCannon_Fire` — short blaster sound
- b. Add 3-4 sound wave variations with random node for variety per shot
- c. Add pitch randomization: ±5% per shot to avoid machine-gun repetition
- d. Set volume: moderate (not ear-piercing during rapid fire)
- e. In `AWeaponBase::Fire()`: `UGameplayStatics::PlaySoundAtLocation(MuzzlePoint, FireSFX)`
- f. Set attenuation: audible within 2000 units

---

## 2.5 Arena Environment

### 2.5.1 Create AArenaVolume

- a. Create `ShatteredWorld/Public/ArenaVolume.h` inheriting `AActor`
- b. Add `UBoxComponent* Boundary` — large box defining playable area (10000×10000×2000)
- c. Set collision to `WorldStatic`, block all movement
- d. Make boundary invisible (no mesh, just collision)
- e. Add visible boundary indicator — faint grid lines or edge glow so player knows bounds
- f. Optional: create `OnActorReachedBoundary` event for UI warning
- g. Place in level, adjust size to desired arena dimensions

### 2.5.2 Create asteroid mesh set

- a. Create or source 4 asteroid static meshes: `SM_Asteroid_Small`, `SM_Asteroid_Medium`, `SM_Asteroid_Large`, `SM_Asteroid_Flat`
- b. Option A: use AI model generation (Meshy/Tripo) to create stylized rock shapes
- c. Option B: use UE5 modeling tools to create simple rock shapes from deformed cubes
- d. Create 2 material instances `MI_Asteroid_Dark` and `MI_Asteroid_Light` — grey/brown rocky
- e. Apply materials to meshes, set roughness high (0.8+), metallic low (0.1)
- f. Save to `Content/Meshes/Environment/Asteroids/`

### 2.5.3 Spawn asteroids in arena

- a. Create `AAsteroidSpawner` actor — placed in level or spawned by sector manager
- b. In `BeginPlay()`: spawn 20-30 asteroids at random positions within arena bounds
- c. Use random stream with seed for deterministic placement (same sector = same layout)
- d. Ensure minimum spacing between asteroids (~200 units) to avoid overlapping
- e. Randomize rotation per asteroid for visual variety
- f. Randomize scale per asteroid: 0.5× to 2.0× base size
- g. Keep center ~500 radius clear of asteroids for player spawn zone

### 2.5.4 Implement asteroid collision

- a. On asteroid static mesh actor: set collision to `WorldStatic`, block `Pawn` channel
- b. On ship collision with asteroid: calculate bounce direction (reflect velocity off normal)
- c. Apply bounce: set ship velocity to reflected direction × 0.5 (lose half speed)
- d. Apply minor collision damage: call `HealthComponent->ApplyDamage(5, Kinetic)`
- e. Play collision SFX: dull thud sound on impact
- f. Play collision VFX: small dust puff at contact point

### 2.5.5 Implement destructible asteroids

- a. Add `UHealthComponent` to asteroids — Small: 30 HP, Medium: 60 HP, Large: 100 HP
- b. On asteroid `HealthComponent::OnDeath` event: destroy asteroid actor
- c. Before destroy: spawn 2-3 smaller asteroid fragments at random velocities from center
- d. Create fragment actors — small meshes with 0.3× scale, short lifetime (3s), no collision
- e. Fragments drift outward then fade out (lerp opacity to 0 over lifetime)

### 2.5.6 Add asteroid break VFX

- a. Create Niagara System `NS_AsteroidBreak`
- b. Emitter 1: rock chunks — 6-10 mesh particles (small cube/rock), burst outward, gravity pull down slightly
- c. Emitter 2: dust cloud — 20-30 sprite particles, brown/grey, expand and fade over 0.5s
- d. Emitter 3: mineral sparkles — 5-8 gold glowing particles, drift outward slowly
- e. Color reference: Astroneer-style clean, bright particle pops
- f. Spawn at asteroid location on death

### 2.5.7 Add mineral drop on asteroid break

- a. On asteroid death: spawn `AMineralPickup` at asteroid location
- b. Small asteroid: spawn 1 pickup (5 Minerals), Medium: 2 pickups (10 total), Large: 3 pickups (15 total)
- c. Pickups scatter slightly from center with random velocity
- d. Mineral pickup has bob animation (slight up/down float, 0.5Hz)
- e. Gold glow emissive material on mineral mesh

### 2.5.8 Create space skybox

- a. Create `UMaterialInterface` `M_SpaceSkybox` — cube map material for sky sphere
- b. Paint: dark blue-black base, scattered star points (procedural noise or star texture)
- c. Add distant nebula — soft colored cloud shapes (purple, blue, orange) at low opacity
- d. Inspiration: No Man's Sky cosmic backgrounds — vibrant but not overpowering
- e. Create `BP_SkySphere` — sphere mesh with skybox material, placed at origin, large scale
- f. Set as skybox in level — disable sky atmosphere if default one exists
- g. Add very slow rotation to skybox (0.1°/sec) for subtle parallax during gameplay

---

## 2.6 Basic HUD (M1)

### 2.6.1 Create UShatteredHUD base widget

- a. Create `ShatteredUI/Public/ShatteredHUD.h` inheriting `UUserWidget`
- b. Create Widget Blueprint `WBP_ShatteredHUD` in `Content/UI/`
- c. Add `UCanvasPanel` as root — fills entire screen
- d. Create anchored regions: Top-Left (HP), Top-Right (minimap), Bottom-Left (currencies), Bottom-Right (weapons)
- e. Set `WBP_ShatteredHUD` as default HUD widget in GameMode or PlayerController
- f. In `AShatteredPlayerController::BeginPlay()`: create widget, add to viewport

### 2.6.2 Add HP bar

- a. Create `UProgressBar* HPBar` in top-left region of canvas
- b. Anchor: top-left, offset (20, 20), size (200, 20)
- c. Style: fill color gradient from green (100%) → yellow (50%) → red (< 25%)
- d. Create `UTextBlock* HPText` overlay: "85 / 100" format
- e. Bind to `HealthComponent->CurrentHP / MaxHP` — update every tick or on change event
- f. Add smooth bar drain: when HP drops, bar lerps to new value over 0.2s (feels impactful)

### 2.6.3 Add boost cooldown indicator

- a. Create `UImage* BoostCooldownArc` — circular arc widget near ship position (screen-space or world-space)
- b. Or: create arc in Niagara/material as world-space indicator below ship
- c. Material approach: circular progress ring material, parameter 0-1 for fill
- d. Bind to `BoostComponent->GetCooldownProgress()`
- e. When boost available: ring is full and bright. When on cooldown: ring fills gradually.
- f. Flash/pulse when boost becomes available again

### 2.6.4 Add mineral counter

- a. Create `UHorizontalBox` in bottom-left region
- b. Add `UImage` for mineral icon — small gold crystal sprite
- c. Add `UTextBlock* MineralCount` — displays integer, right-aligned
- d. Bind to player state's `Minerals` count
- e. Style: gold text color, clean sans-serif font

### 2.6.5 Implement mineral pickup

- a. On `AMineralPickup::OnOverlap` with ship: destroy pickup, increment player minerals
- b. In PlayerState: `AddMinerals(int32 Amount)` — increments counter, fires event
- c. HUD listens for `OnMineralsChanged` event — update text
- d. Add pop animation on counter: scale up to 1.2× then back to 1.0× over 0.15s
- e. Play pickup SFX: satisfying "ding" sound, slight pitch increase for rapid pickups
- f. Spawn gold particle trail from pickup position toward HUD counter (cosmetic, optional)
