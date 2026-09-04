# 🎮 Controls, Camera & Ship Movement

**Status:** Implemented — matches the live build.

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md). Source of truth: `AShatteredPawn` (`ShatteredPawn.h/.cpp`, bindings in `CreateInputMapping`) and `AShatteredPlayerController`.

---

> [!IMPORTANT]
> **The ship must feel good in 5 seconds.** Before loot, before enemies, before everything — the ship has to be fun to fly. This doc describes exactly how movement, aiming, camera, and input work in the build. The owner's direction is to keep this camera and control scheme and iterate on feel from here.

---

## 1. Movement Model — 6DOF Inertial Flight

The POC pivoted from a top-down movement plane to **Avorion-style full 3D flight**:

- **W/S** applies forward/reverse engine thrust; **A/D** strafes laterally; **Space/C** strafes vertically.
- Velocity is world-space and persists after thrust is released. Passive damping (`InertialDamping` 0.8) keeps the ship controllable without erasing inertia.
- **X** engages strong inertia dampeners for deliberate braking (`BrakeDamping` 3.5).
- **Q/E** rolls the hull (`RollAcceleration` 900, `MaxRollSpeed` 220°/s), and the camera rig is mounted to the hull, so a barrel roll carries the view around with it rather than spinning the ship inside a fixed frame.
- The mouse rotates the hull **about its own axes**, not the world's. Pitch is applied about the ship's right, yaw about the ship's up, so the controls mean the same thing at every attitude. `TurnResponsiveness` (14) smooths the turn *rate* rather than chasing a separate heading; `LookDegreesPerUnit` (2.5) times the Options sensitivity sets how far one unit of mouse travel turns the hull.

> **Why body-relative, not a world heading.** Steering originally chased a world-framed control rotation, which holds together only while the ship is upright. Roll ninety degrees and world yaw is no longer the ship's yaw: pushing the mouse sideways makes the nose climb. A world heading also cannot express "inverted", so it quietly fights any sustained roll. Rotating locally is the only formulation that survives arbitrary attitude, which is the whole point of 6DOF.
>
> Two engine defaults have to be turned off for this to hold. `bUseControllerRotationYaw` is on by default and makes `APawn::FaceRotation` snap yaw onto the control rotation every frame, rebuilding the hull's orientation from Euler angles and losing roll near vertical. The spring arm's `bUsePawnControlRotation` does the same to the camera, forcing its roll to zero. After each steer the pawn writes its own rotation back into the controller so gun aim and the HUD read the hull.
- Forward thrust dominates. **Reverse and strafe are capped near 120–150 uu/s against a forward max of 800** — `ComputeAxisThrust` simply stops adding once an axis is at its cap, so momentum and drift survive but nobody flies backwards for a living. This is the movement half of [17_anti_kiting_combat.md](17_anti_kiting_combat.md).
- Boost may exceed the forward cap; the surplus bleeds off through damping instead of being clamped away.
- Collisions: the hull slides along the hit surface at 45% of its speed. Relative impact speed above 220 uu/s costs hull at 0.055 per uu/s, capped at 45 per hit and gated to one hit per 0.25s.

The target is approachable space combat rather than a rigid Newtonian simulator: inertia matters, but the ship remains readable and recoverable.

Post-POC, max speed is travel / intercept / escape, not automatically the best dogfight state. Combat speed should keep turning and tracking; boost stays a short resource. Drift (face one way, fly another) is allowed if reverse thrust stays weak so it cannot become infinite reverse-kiting. Full AI and envelope rules: [17_anti_kiting_combat.md](17_anti_kiting_combat.md).

### Movement Parameters

Movement numbers below are for the Ace interceptor, the only flyable hull in the build. Hull variants are parked in [Ideas: Hull roster](ideas/hull_roster_and_professions.md).

| Parameter | Value | `AShatteredPawn` field |
| --- | --- | --- |
| **Max speed** | 800 | `MaxSpeed` |
| **Forward acceleration** | 3200 | `Acceleration` |
| **Reverse acceleration / cap** | 700 / 120 | `ReverseAcceleration`, `MaxReverseSpeed` |
| **Strafe acceleration / cap** | 900 / 150 | `StrafeAcceleration`, `MaxStrafeSpeed` |
| **Vertical acceleration / cap** | 900 / 150 | `VerticalAcceleration`, `MaxVerticalSpeed` |
| **Inertial / brake damping** | 0.8 / 3.5 | `InertialDamping`, `BrakeDamping` |
| **Boost speed** | 1550 (≈1.9× max) | `BoostSpeed` |
| **Boost duration / cooldown** | 0.4s / 3s | `BoostDuration`, `BoostCooldown` |

The F8 / `\` debug panel edits max speed, acceleration, damping, strafe and reverse caps, roll speed and camera height live; chosen numbers get written back into these defaults.

---

## 2. Aim & Firing

**Mouse + Keyboard:**

- Mouse steers the hull in 3D; the camera is mounted to the hull and follows it.
- The reticle is the **projected impact point** of a muzzle-sized sweep along the hull's forward axis (`GetWeaponAimPoint`). In chase view the camera sits above the ship, so a fixed screen-centre mark lies on a different parallel line and can promise a hit the cannon will miss. The reticle moves to the first pawn/world collision or the weapon's range endpoint and changes from dim cyan to gold when the sweep has a blocking hit.
- Left click = pulse cannon (hold to fire). `TryFire` spawns an `APulseProjectile` 175 units ahead of the hull along the hull forward vector at 8 shots/s, 2400 uu/s, 6000 range, 10 damage.
- Hull and weapon aim never diverge: the gun points where the ship points.

**Controller:**

- Right stick = hull pitch and yaw, in the ship's own frame, through the same `Steer` path as the mouse.
- Right trigger = pulse cannon.
- No aim assist. None is planned for the POC.

### Firing Feel

| Element           | In the build                                                         |
| ----------------- | -------------------------------------------------------------------- |
| **Camera kick**   | `CameraKick` +0.65 per shot (cap 7), jitters the boom socket and decays at 14/s. Damage taken kicks too |
| **Muzzle flash**  | `MuzzleLight` point light, 6500 intensity for 45ms per shot, blue-white |
| **Bolt**          | Thin emissive mesh plus a short point light; expires at range         |
| **Impact burst**  | The bolt itself becomes a scaled burst mesh and light on hit (`BecomeImpactBurst`) |
| **Kill pop**      | Pirate hides its mesh and spawns several bursts; the flagship's is larger |
| **Audio**         | `A_Cannon_Laser` per shot with 6% pitch scatter, mixed at 0.22 so held fire does not clip |

---

## 3. Camera System

### Base Camera

| Parameter | Value |
| --- | --- |
| **Default** | Third-person chase, `CameraBoom` 850 units behind the hull, raised `CameraHeightOffset` 190 so the hull sits below the crosshair |
| **First-person** | F1 toggles the arm to 0 with no height offset; the hull and thruster plumes are owner-hidden |
| **Aim** | Hull forward drives the weapon; the HUD projects that exact muzzle line and first blocking hit into the camera view |
| **Mounting** | Boom inherits the hull's full transform, roll included, so the height offset rides around during a barrel roll |
| **Follow** | `CameraLagSpeed` 8, `CameraRotationLagSpeed` 10 |
| **Boost** | Arm lengthens to 1050 while boosting, interpolating at 5/s both ways |
| **Collision** | `bDoCollisionTest` shortens the arm around nearby asteroids |

### Dynamic Camera Behaviors

| Trigger                  | Camera Response                                              |
| ------------------------ | ------------------------------------------------------------ |
| **Boosting**             | Chase camera pulls back; returns smoothly                    |
| **Firing / taking damage** | Socket-offset jitter from `CameraKick`; damage also pulses `DamageFlashLight` on the hull (red for hull, cyan for shield) |
| **Dense asteroid field** | Spring-arm collision prevents camera clipping                |
| **Flagship**             | Normal chase framing; flagship scale provides context        |

Not in the build: low-HP vignette or heartbeat pulse, sector-entry pans, docking zoom. Each player would own an independent camera in any later co-op.

---

## 4. Input Mapping

Bindings are created in code (`CreateInputMapping` builds a runtime `UInputMappingContext`; `DefaultInput.ini` only selects Enhanced Input). Remapping is deferred past the POC — the Options screen says so.

### Keyboard + Mouse (Primary)

| Action             | Binding         | Notes                              |
| ------------------ | --------------- | ---------------------------------- |
| **Forward/reverse**| W / S           | Main-engine thrust                 |
| **Strafe**         | A / D           | Lateral thrusters                  |
| **Vertical strafe**| Space / C       | Up/down thrusters                  |
| **Roll**           | Q / E           | Roll acceleration with inertia     |
| **Aim / steer**    | Mouse           | Pitch/yaw in the hull's own frame  |
| **Fire**           | Left click      | Hold to auto-fire                  |
| **Boost**          | Left Shift      | Short thrust burst, cooldown       |
| **Hard brake**     | X (hold)        | Strong inertia dampening           |
| **Camera toggle**  | F1              | Third-person / first-person        |
| **Headlight**      | F               | Forward spotlight for sunless sectors; starts off |
| **Collision wireframe** | - / numpad - | Debug: draw collision shapes     |
| **Pause**          | Esc             | Pause overlay; works while paused  |
| **Debug panel**    | F8 or `\`       | Flight lab sliders; `\` because PIE eats F8 |
| **Reseed sector**  | =               | Roll a new environment seed and rebuild |

### Controller (Gamepad)

| Action             | Binding         | Notes                       |
| ------------------ | --------------- | --------------------------- |
| **Thrust**         | Left stick      | Y = forward/reverse, X = strafe. Thrust in that direction; the hull does not turn to face it |
| **Steer**          | Right stick     | Pitch/yaw in the hull's own frame |
| **Fire**           | Right trigger   | Hold to auto-fire           |
| **Brake**          | Left trigger    | Hold                        |
| **Boost**          | Left stick click | Short burst, cooldown      |

Vertical thrust, roll, camera toggle, headlight, pause and the debug keys have no gamepad binding yet. There is no dead-zone or response-curve tuning on the sticks.

---

## 5. Boost Mechanic

The boost is a short, fast burst that serves as both offense and defense:

| Aspect            | In the build                                                  |
| ----------------- | ------------------------------------------------------------- |
| **Activation**    | Press Shift / stick click — instant; ignored during cooldown  |
| **Direction**     | Current thrust input direction in the hull frame; hull forward when no thrust is held |
| **Speed**         | Velocity is set to 1550 (≈1.9× max speed)                     |
| **Duration**      | 0.4s with thrust and damping suspended, then momentum bleeds off through normal damping |
| **Cooldown**      | 3s; the HUD boost arc shows the recharge                      |
| **Invincibility** | None — boost is for positioning, not i-frames                 |
| **VFX**           | Thruster plumes and exhaust trail run hotter, wider and whiter; camera arm pulls back |
| **Audio**         | `A_Boost_Burst`, only on a burn that actually fired           |

---

## 6. Not implemented, candidates

Ideas that have appeared in earlier drafts and are **not bound or coded**. They stay here so nobody reads them as shipped:

| Candidate | Sketch |
| --- | --- |
| Ship screen | `Tab` toggles one overlay with SHIP / MAP pages; `M` and `I` jump to a page. Throttle stays live, guns go offline. See [16_ui_hud_vfx.md](16_ui_hud_vfx.md#loadout-overlay-tab). |
| Secondary fire | Right click / left trigger — needs a second weapon to exist first |
| Hull ability | One per hull on a long cooldown; see [Ideas: Hull roster](ideas/hull_roster_and_professions.md) |
| Interact | Dock / pick up, when stations enter scope |
| Ping | Middle click / D-pad down, co-op only |
| Drone command | Carrier-only, cycle drone behaviour |
| Remappable bindings | Options stub after the POC |
