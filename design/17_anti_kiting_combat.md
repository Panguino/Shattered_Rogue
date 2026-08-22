# 🛰️ Dynamic 3D Combat & Anti-Kiting

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md). Related: [12_combat_and_coop.md](12_combat_and_coop.md), [15_controls_and_camera.md](15_controls_and_camera.md), [06_enemy_catalog.md](06_enemy_catalog.md), [03_weapons_and_upgrades.md](03_weapons_and_upgrades.md).
>
> **Not in the POC.** Pirate Raid can stay dumb-chase until the loop is fun. This is the North Star for post-POC AI and the reason kiting should not win fights.

---

## 1. The failure mode

Open 3D space combat often collapses into a **kite fest**:

1. Player fires, then flies away.
2. Every enemy points at the player.
3. Enemies form a blob or conga line behind the player.
4. The player shoots backward (or periodically turns).
5. The fight becomes one long chase.

That is not a speed problem. Faster enemies just make a faster conga line.

The math:

> If moving directly away preserves DPS while reducing incoming danger, retreating in a straight line is optimal.

If every AI uses `steerToward(target.position)`, the AI *will* blob.

**Desired rhythm:**

**Position → Commit → Attack run → Overshoot → Evade / drift → Reposition → Re-engage**

Ships fly **through and around** the fight. Running away stays useful, but it has costs. The player is choosing **COMMIT vs DISENGAGE**, not merely “toward enemy / away from enemy.”

---

## 2. Current architecture (POC)

Sibling Unreal project: `C:\Projects\_personal\Shattered\ShatteredRogue`. Solo only; `Pawn` / `PlayerController` / `GameMode` / `GameState` / `GameInstance` are already split.

| System | Where | What it does today |
| --- | --- | --- |
| Player flight | `AShatteredPawn` | 6DOF inertial velocity, separate forward / strafe / vertical thrust, mouse steering, roll, timed boost, brake damping |
| Player fire | `AShatteredPawn::TryFire` | Hitscan-aim along control rotation; one `APulseProjectile` family |
| Projectiles | `APulseProjectile` | Thin emissive bolts; hits pawns / world, applies damage, impact burst, expires at a fixed travel range |
| Enemy AI | `APiratePawn` | Per-tick seek toward player. Roles: Chase, Strafe, Tank, Flagship |
| Waves | `AShatteredGameMode` | Warmup → 3 waves → flagship. No squad object, no coordinator |
| Training | `AShatteredTrainingGameMode` | Same arena, no enemies — flight lab, not a combat test bed |
| Stats | pawn UPROPERTY defaults | HP, speed, fire rate. No shields, no subsystems, no weapon envelopes |

There is **no** fleet, formation, intercept prediction, attack slot, or pursuit policy. Each pirate independently:

- finds the player with `UGameplayStatics::GetPlayerPawn`
- steers along `ToPlayer`
- rotates to face the player
- fires along `ToPlayer` if in range

---

## 3. Why kiting happens in *this* code

Tied to current `APiratePawn`, not generic theory.

| Cause | Code | Result |
| --- | --- | --- |
| Pure pursuit | Chase / Tank / Flagship `Desired = ToPlayer.GetSafeNormal()` | Destination is the player *now*, never the intercept point |
| Shared heading | `SetActorRotation(... ToPlayer.Rotation())` | Every ship faces the same vector |
| No separation | Each pawn ticks alone | Identical inputs → stacked trail |
| Strafe still homes | Strafe adds lateral, then still adds `ToPlayer` when far | Flankers collapse into pursuit at range |
| Instant facing fire | `FireDirection = ToPlayer.GetSafeNormal()` | Rear shots work at any aspect; no need to commit to a pass |
| One weapon, one range | Pulse at 1600 / flagship 2800 | No reason to enter a dangerous envelope |
| Boost is a burst, not a tax on turning | Player `BoostDuration` 0.4s, then cruise clamp | Escape is cheap; turn authority does not fall off at high speed |
| Arena leash is a sphere bounce | `ApplySphericalBounds` clamp + outbound velocity flip | Not tactical pursuit; pirates graze the shell and resume chase |
| No objective pressure in training | Training mode has zero enemies | Fine for flight feel; Pirate Raid *is* “kill everything” |

Chase even parks inside 380 units (`Desired = 0`) while still facing the player — a tail-sit, not an attack run.

---

## 4. Design principle

> **Moving directly away must not always be the safest *and* most damaging option. Moving directly toward the target must not always be the AI’s best response.**

Combat should keep changing **angle, distance, velocity, orientation, role, threat, and commitment**.

**Do not overcorrect.** No invisible walls, teleports, cheat-speed interceptors, stun spam, identical circling, perfect prediction, or instant direction changes. Pilots are imperfect (`reactionTime`, `predictionAccuracy`, `aggression`, `pursuitWillingness`).

---

## 5. Combat envelope (the core system)

An engagement owns an invisible **Combat Envelope** around the target (player, flagship, convoy, station). Ships **reserve different regions**. They do not all occupy “behind the player.”

Slots move with the target’s position, velocity, and facing. They are noisy, not robotic.

Possible slot families: forward pressure, rear pursuit, port / starboard flank, high / low, intercept, attack-run staging, support / missile, reserve.

```
                     INTERCEPT
                         ▲
              SUPPORT          SUPPORT
        FLANK       COMBAT CORE       FLANK
              ATTACK           ATTACK
                         ▼
                      RESERVE
```

**Layer split (do not merge into one mega state machine):**

| Layer | Question | Examples |
| --- | --- | --- |
| Strategic | What matters? | Defend flagship, kill Ace, preserve cohesion |
| Tactical | What is *my* job? | Flank, intercept, attack run, escort, pursue, support |
| Steering | How do I get there? | Intercept, arrive, separate, avoid asteroids, evade |

Coordinator assigns **intent**. The pawn solves **steering**.

```
CombatEncounter
  CombatEnvelope
  TacticalCoordinator
  Participants
  AttackAssignments
  PursuitPolicy
  Objectives
```

Local blend so slots do not restack:

```
desiredVelocity =
    tacticalObjective
    + collisionAvoidance
    + friendlySeparation
    + obstacleAvoidance
    + formationInfluence
```

---

## 6. Pillars (post-POC)

### 6.1 Predictive interception (not pure pursuit)

Destination = predicted intercept, not `target.location`. Interceptors cut across the escape vector. Prediction strength varies by class / “pilot skill.”

### 6.2 Attack slots / 3D envelope

No two ships independently take the same ideal rear seat. Variance so it stays organic.

### 6.3 Squadron roles

A six-ship squad is **not** six pursuers. Example split: 2 pressure, 2 flankers, 1 interceptor, 1 support. **Not every ship gets PURSUE.**

Roles: Pressure, Intercept, Flank, Attack Run, Support, Screen, Reserve, Pursuer.

### 6.4 Pursuit doctrine

Do not drag the whole fleet 20 km because one Ace ran. Evaluate distance to objective / flagship, cohesion, remaining pursuers, threat, target HP. Then: *two interceptors pursue; the rest reform on the carrier.* Must feel tactical, not like a leash radius.

Squad states: Forming, Approaching, Engaging, Attack Run, Pursuing, Disengaging, Reforming, Defending, Retreating.

### 6.5 Attack runs, not tail sitting

Stage → accelerate → weapons hot → pass → break / evade → cooldown → reposition. Ships should visibly scream through the volume.

### 6.6 Optimal maneuvering speed

Max throttle is travel / intercept / escape / attack-run. Combat speed (~40–60% of max) is best turning, strafing, and tracking. High speed = larger turn radius and worse weapon track. Tune for fun, not realism.

### 6.7 Boost as a resource

Already a short burst + cooldown on the Interceptor. Keep it that way: close, escape, pass, evade — not hold-forever. Later: capacitor, heat, or drift-after-boost.

### 6.8 Drift / decoupled facing

Velocity can persist while facing changes (pass, shoot, reverse). **Do not** make this infinite reverse-kite: weak reverse thrust (already true vs forward on the pawn), optional duration / cost, turn limits. Forward accel stays stronger than reverse.

### 6.9 Retreat exposes risk

Fleeing presents engines. Subsystem hits: less accel, no boost, no warp. Prefer exposed systems over “rear armor is just thinner.”

### 6.10 Weapon envelopes

One pulse that works at every range is why kiting keeps DPS. Families should *behave* differently, not only fall off:

| Family | Envelope |
| --- | --- |
| Plasma / scatter | Devastating close, slow, misses juking range |
| Autocannon | Close–medium |
| Laser / beam | Medium, heat-limited |
| Railgun | Long, high velocity, poor close track, charge |
| Missile | Punishes straight retreat; countered by maneuver / cover / ECM |
| Torpedo | Arms at range; capital threat; interceptable |
| Flak | Area denial, punishes certain vectors |

See [03_weapons_and_upgrades.md](03_weapons_and_upgrades.md) for the loot layer; this table is the *movement* reason for those families.

### 6.11 Anti-kite ship roles

Class is not “more HP / more DPS.” Interceptor cuts off. Disruptor jams engines. Brawler owns close. Artillery punishes predictable lines. Bomber / escort / controller / support as in the enemy catalog.

### 6.12 Soft movement control

Gravity well, tractor pulse, engine disruption, EMP, boost jammer, drag field, micro-jump. Favor **you must fly differently** over **you cannot play for five seconds**.

### 6.13 Terrain with rules

Empty space *is* the kite. Asteroids break locks / LOS. Debris punishes max speed. Nebula shortens radar. Stations and capitals are cover and objectives. The POC asteroid field is the first instance of this.

### 6.14 Capitals as battlefields

Engines, shields, turrets, hangar, reactor — not a giant HP bar. Fighters skim hulls, sit in blind spots, escort bombers, intercept torpedoes.

### 6.15 Objectives beat “kill all”

Pirate Raid already has **destroy the flagship**. That is the right kind of pressure: kiting 2 km away while the flagship lives is a failed raid. Expand later: convoy, station, bombers, escape, disable engines.

### 6.16 Battles evolve

Fighters → bombers → capital → debris → new vector reinforcements → flagship tries to leave. A stable kite pattern should not last the whole fight.

---

## 7. How this fits the existing code

Prefer **extension**, not a rewrite of `AShatteredPawn`.

| New piece | Lives with | Notes |
| --- | --- | --- |
| `UCombatEnvelope` / encounter | `AShatteredGameMode` or a dedicated `ACombatCoordinator` spawned by the mode | GameMode already owns wave/flagship lifecycle |
| Attack assignment | Coordinator, not the pawn | Pawn asks “where is my slot?” |
| Predictive intercept | `APiratePawn` steering (or a steering component extracted from it) | Replace `Desired = ToPlayer` |
| Friendly separation | Same steering blend | Cheap, high value |
| Pursuit policy | Coordinator using `GameState` + flagship actor | Replaces arena-box as the “leash” |
| Attack-run states | Pawn / AI controller | After slots exist |
| Player combat speed / drift | `AShatteredPawn` | Phase 2; F8 already exposes speed / damping |

Do not put strategic “defend the flagship” inside `UpdateMovement`.

---

## 8. Implementation phases

**Do not build all sixteen pillars at once.**

### Phase 1 — Fix the blob (first prototype)

1. Predictive interception  
2. Friendly separation  
3. 3D attack slots / envelope  
4. Squad roles (not everyone pursues)  
5. Limited pursuit (reform on flagship / arena objective)

**Proof:** six fighters vs one Ace spread around the target instead of a line.

**Likely files:** `PiratePawn.*`, new `ShatteredCombatCoordinator.*` / `ShatteredAttackSlot.*`, `ShatteredGameMode.*`, debug draw on F8 or a combat vis toggle.

**Risks:** slots look robotic; prediction too perfect; separation blows formations apart.

**Tune:** prediction time, slot radius / noise, separation weight, max pursuers, intercept lead.

**Debug:** draw slots, intercept point, role/state labels, desired velocity.

### Phase 2 — Combat rhythm

Attack runs, optimal maneuvering speed, keep boost limited, optional drift / decoupled facing.

**Proof:** passes and re-engagements, not permanent tail sits.

### Phase 3 — Position matters

Weapon envelopes, engine/subsystem hits, role identity beyond stats.

### Phase 4 — Fleet scale

Objectives, terrain rules, capital subsystems, phased battles.

---

## 9. First prototype scenario

**Setup:** 1 player fighter, 6 enemy fighters. Use Pirate Raid or a small Combat Lab map (Training is enemy-free today).

| Scenario | Player does | Expected |
| --- | --- | --- |
| A | Flies straight away | Few pursuers; interceptor cuts off; others hold envelope; no blob |
| B | Turns back into the squad | Break, reassign vectors, close chaos without stacking |
| C | Boosts through formation | Not a synchronized U-turn; mixed continue / reposition / intercept |
| D | Runs far from flagship / objective | Limited chase; squad reforms; objective still defended |

---

## 10. Telemetry (later)

Blob detector example: if 80% of hostiles share heading within 15° for >10s, the fight has collapsed into pursuit. Also track engagement distance, time behind target, attack passes, boost use, distance from objective, player reverse-thrust time.

---

## 11. POC vs this doc

| In POC | After POC |
| --- | --- |
| Dumb chase / strafe / tank / flagship | Envelope + coordinator |
| Kill flagship as the raid win | Same idea, more encounter types |
| Asteroid collision | Terrain *rules* (LOS, missile break, speed hazard) |
| Boost burst + F8 damping | Combat speed curve, drift, subsystem rear |
| One pulse | Weapon envelopes |

If playtests show a conga line in Pirate Raid, pull **Phase 1 only** forward. Do not pull capitals, telemetry, or sixteen mechanics into the POC.
