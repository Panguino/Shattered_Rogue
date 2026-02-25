# 🏗️ Technical Architecture

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

## 1. UE5 C++ vs Blueprint Strategy

> [!IMPORTANT]
> **Target: 90% C++ / 10% Blueprint.** Core systems in C++, exposed to Blueprint for designer tuning and visual scripting where appropriate.

| Layer               | Language  | Rationale                                                                          |
| ------------------- | --------- | ---------------------------------------------------------------------------------- |
| **Core Systems**    | C++       | Performance, type safety, version control — weapon system, proc engine, networking |
| **Game Logic**      | C++       | Enemy AI, galaxy generation, progression, upgrade system                           |
| **UI**              | UMG + C++ | C++ backend logic, UMG widgets for visual layout                                   |
| **Prototyping**     | Blueprint | Rapid iteration on level design, VFX, animation state machines                     |
| **Designer Tuning** | Blueprint | Exposed variables for balance tuning without code changes                          |
| **Animation**       | AnimBP    | Animation state machines, blend spaces, montages                                   |

### C++ Architecture Guidelines

| Principle                  | Details                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| **Component-based design** | Favor UActorComponents over deep inheritance hierarchies             |
| **Data-driven**            | Use DataAssets and DataTables for game data (weapons, enemies, etc.) |
| **Interface contracts**    | Define interfaces for systems that need to be swappable/mockable     |
| **Event-driven**           | Use delegates and event dispatchers for loose coupling               |
| **Plugin architecture**    | Each major system (weapons, enemies, progression) is a plugin        |

---

## 2. UE5 Built-in AI Systems

Leverage Unreal's AI stack instead of rolling custom:

| UE5 System                  | Our Use Case                                                       |
| --------------------------- | ------------------------------------------------------------------ |
| **Behavior Trees**          | Enemy AI decision-making (attack, flee, patrol, support)           |
| **Environment Query (EQS)** | Spatial reasoning — find cover, flanking positions, mining targets |
| **AI Perception**           | Sight, hearing, damage sense for enemy awareness                   |
| **Smart Objects**           | Station interaction points, mining nodes, scan targets             |
| **Navigation Mesh**         | 3D NavMesh for space navigation (custom volume-based)              |
| **Mass Entity (future)**    | Drone flock simulation at scale if needed                          |
| **State Trees**             | Alternative to BTs for simpler enemies (drones, fodder)            |
| **MetaSound**               | Adaptive music system, spatial SFX, dynamic mixing                 |

### Boids Implementation (Carrier Drones)

| Component             | Implementation                                              |
| --------------------- | ----------------------------------------------------------- |
| **Flock Manager**     | C++ UActorComponent on Carrier hull — manages all drones    |
| **Boid Agent**        | C++ class per drone — separation, alignment, cohesion rules |
| **Engagement System** | EQS query to find nearest enemy → switch to combat behavior |
| **Formation Presets** | DataAsset with orbit radius, spacing, formation patterns    |
| **Visual Polish**     | Niagara particle trails, dynamic light on each drone        |

---

## 3. Networking Architecture (Co-op)

| Aspect               | Approach                                                         |
| -------------------- | ---------------------------------------------------------------- |
| **Model**            | Authoritative server (host is server). Clients predict + correct |
| **Replication**      | Replicate ship positions, weapons, health. Loot is client-side   |
| **RPCs**             | Server RPCs for damage, pickup, jump. Client RPCs for UI updates |
| **Session**          | Steam / Epic Online Services for matchmaking and lobbies         |
| **Max Players**      | 4 players per session                                            |
| **Tick Rate**        | 30 Hz server tick, 60 Hz client simulation with interpolation    |
| **Lag Compensation** | Projectile rollback for hit registration                         |

---

## 4. Plugin/Module Structure

```
ShatteredRogue/
├── Source/
│   ├── ShatteredCore/          ← Game framework, utility, data types
│   ├── ShatteredShips/         ← Hull, profession, slot system, movement
│   ├── ShatteredWeapons/       ← Weapon base, projectiles, proc system
│   ├── ShatteredEnemies/       ← Chassis, traits, spawning, wave budget
│   ├── ShatteredDrones/        ← Boids, drone types, flock manager
│   ├── ShatteredProgression/   ← Research Data, meta unlocks, XP, levels
│   ├── ShatteredGalaxy/        ← Grid generation, sectors, navigation
│   ├── ShatteredStations/      ← Station types, services, UI
│   ├── ShatteredEvents/        ← Event catalog, profession options
│   ├── ShatteredCoop/          ← Networking, replication, session
│   ├── ShatteredAudio/         ← MetaSound graphs, adaptive music
│   └── ShatteredUI/            ← UMG widgets, HUD, menus
├── Content/
│   ├── Data/                   ← DataAssets, DataTables
│   ├── Ships/                  ← Ship models, materials, animations
│   ├── Enemies/                ← Enemy chassis, trait visuals
│   ├── Environments/           ← Level assets, skyboxes, props
│   ├── Audio/                  ← Music stems, SFX, MetaSound
│   ├── UI/                     ← Widget blueprints, textures
│   └── VFX/                    ← Niagara systems, materials
└── Plugins/
    └── (third-party plugins)
```

---

## 5. Blueprint Documentation Standards

All Blueprints must follow these standards for maintainability:

| Standard                | Details                                                        |
| ----------------------- | -------------------------------------------------------------- |
| **Comment headers**     | Every Blueprint graph starts with a comment explaining purpose |
| **Color coding**        | Blue = input, Green = logic, Red = output, Yellow = debug      |
| **Collapsed subgraphs** | Any section > 15 nodes must be collapsed with a clear name     |
| **Named reroute nodes** | Use named reroutes at every wire crossing                      |
| **Variable categories** | Group variables: Config, Runtime, Debug, References            |
| **Event dispatchers**   | Use dispatchers over direct references for decoupling          |
| **C++ base classes**    | Blueprints should extend C++ classes, not other Blueprints     |

---

## 6. Development Phases & Milestones

| Phase                 | Duration    | Deliverables                                                      |
| --------------------- | ----------- | ----------------------------------------------------------------- |
| **Phase 1: Research** | ✅ Complete | Game vision, design docs, AI toolchain evaluation                 |
| **Phase 2: MVP**      | 8–12 weeks  | Single hull, single profession, 3 sectors, basic combat, 1 boss   |
| **Phase 3: Co-op**    | 6–8 weeks   | Networking, 2-player co-op, session management                    |
| **Phase 4: Content**  | 12–16 weeks | All 6 hulls, 5 professions, full enemy system, stations, events   |
| **Phase 5: Polish**   | 4–6 weeks   | VFX, SFX, music, UI polish, achievement system                    |
| **Phase 6: Testing**  | 4–6 weeks   | Playtesting, balance tuning, performance optimization, bug fixing |

---

## 7. Performance Targets

| Metric                | Target           | Notes                                    |
| --------------------- | ---------------- | ---------------------------------------- |
| **Frame Rate**        | 60 FPS stable    | On mid-range hardware (RTX 3060 equiv)   |
| **Load Times**        | <5s per sector   | Async streaming, level instances         |
| **Max Entities**      | 200 simultaneous | Enemies + drones + projectiles + loot    |
| **Network Bandwidth** | <50 KB/s/player  | Efficient replication, delta compression |
| **Memory**            | <4 GB            | Streaming textures, LOD system           |
