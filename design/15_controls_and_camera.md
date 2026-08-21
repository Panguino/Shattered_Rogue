# 🎮 Controls, Camera & Ship Movement

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **The ship must feel good in 5 seconds.** Before loot, before enemies, before everything — the ship has to be fun to fly. This doc defines exactly how movement, aiming, camera, and input work.

---

## 1. Movement Model — 6DOF Inertial Flight

The POC pivoted from a top-down movement plane to **Avorion-style full 3D flight**:

- **W/S** applies forward/reverse engine thrust; **A/D** strafes laterally; **Space/C** strafes vertically.
- Velocity is world-space and persists after thrust is released. Passive damping keeps the ship controllable without erasing inertia.
- **X** engages strong inertia dampeners for deliberate braking.
- **Q/E** rolls the hull, and the chase camera banks with it so a barrel roll reads on screen. Pitch and yaw are limited by turn responsiveness rather than snapping instantly.
- The mouse controls the camera heading; the ship rotates toward that heading as quickly as its maneuverability allows.
- Forward thrust dominates. **Reverse and strafe are capped near 120–150 uu/s against a forward max of 800** — thrust simply stops adding once an axis is at its cap, so momentum and drift survive but nobody flies backwards for a living. This is the movement half of [17_anti_kiting_combat.md](17_anti_kiting_combat.md).
- Boost may exceed the forward cap; the surplus bleeds off through damping instead of being clamped away.

The target is approachable space combat rather than a rigid Newtonian simulator: inertia matters, but the ship remains readable and recoverable.

Post-POC, max speed is travel / intercept / escape, not automatically the best dogfight state. Combat speed should keep turning and tracking; boost stays a short resource. Drift (face one way, fly another) is allowed if reverse thrust stays weak so it cannot become infinite reverse-kiting. Full AI and envelope rules: [17_anti_kiting_combat.md](17_anti_kiting_combat.md).

### Movement Parameters by Hull

| Parameter          | Interceptor | Gunship | Hauler  | Phantom   | Juggernaut | Carrier  |
| ------------------ | ----------- | ------- | ------- | --------- | ---------- | -------- |
| **Max Speed**      | 800         | 600     | 500     | 900       | 400        | 550      |
| **Reverse / Strafe Cap** | 120 / 150 | 100 / 120 | 90 / 100 | 140 / 180 | 70 / 80 | 100 / 110 |
| **Acceleration**   | High        | Medium  | Medium  | Very High | Low        | Medium   |
| **Drag**           | Medium      | High    | High    | Low       | Very High  | Medium   |
| **Drift Feel**     | Moderate    | Minimal | Minimal | Slippery  | Tank-like  | Moderate |
| **Boost Speed**    | 1200        | 900     | 750     | 1400      | 600        | 800      |
| **Boost Duration** | 0.4s        | 0.3s    | 0.3s    | 0.6s      | 0.5s       | 0.4s     |
| **Boost Cooldown** | 3s          | 4s      | 5s      | 2s        | 6s         | 4s       |
| **Ship Radius**    | Small       | Medium  | Medium  | Small     | Large      | Large    |

> **MVP:** Only Interceptor and Gunship initially. Others added in M4+.

---

## 2. Aim & Firing

**Mouse + Keyboard:**

- Mouse looks/aims in 3D; ship attitude follows the camera with maneuverability-limited lag.
- Center crosshair is the weapon aim direction.
- Left click = primary weapon (hold to fire).
- Hull and weapon aim may briefly diverge while the ship rotates toward the view.

**Controller:**

- Right stick = camera/aim heading; ship follows with turn lag.
- Right trigger = primary weapon
- Left trigger = secondary weapon
- **Aim assist:** Slight magnetism toward nearest enemy (15° cone, subtle)

### Firing Feel

| Element           | Spec                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| **Screen shake**  | Tiny shake on each shot (0.5px), larger on impact (2px)              |
| **Muzzle flash**  | Bright, short-lived flash at weapon port — color matches weapon type |
| **Recoil**        | Very slight camera nudge backward on heavy weapons                   |
| **Hit markers**   | Subtle crosshair flash on enemy hit (white = normal, orange = crit)  |
| **Impact sparks** | Niagara particle burst at point of impact — Crab Champions style     |
| **Kill pop**      | Satisfying explosion + mineral fragments fly toward player           |

---

## 3. Camera System

### Base Camera

| Parameter | Value |
| --- | --- |
| **Default** | Third-person chase, approximately 850 units behind the hull |
| **First-person** | F1 toggles a nose/cockpit-adjacent view |
| **Aim** | Camera heading drives the center crosshair; hull turns toward it |
| **Follow** | Smooth positional and rotational lag |
| **Boost** | Chase arm pulls back to communicate speed |
| **Collision** | Spring arm shortens around nearby asteroids |

### Dynamic Camera Behaviors

| Trigger                  | Camera Response                                              |
| ------------------------ | ------------------------------------------------------------ |
| **Boosting**             | Chase camera pulls back; returns smoothly                    |
| **Boss encounter**       | Keep normal chase framing; flagship scale provides context   |
| **Dense asteroid field** | Spring-arm collision prevents camera clipping                |
| **Taking heavy damage**  | Light red vignette + subtle shake                            |
| **Low HP (<20%)**        | Persistent light screen pulse (heartbeat rhythm)             |
| **Entering new sector**  | Brief cinematic pan showing sector layout, then snap to ship |
| **Station approach**     | Zoom in slightly as player docks                             |

### Co-op Camera

Each player has their own independent camera (online only — no split-screen). Camera behavior is identical per player.

---

## 4. Input Mapping

### Keyboard + Mouse (Primary)

| Action             | Default Binding | Notes                              |
| ------------------ | --------------- | ---------------------------------- |
| **Forward/reverse**| W / S           | Main-engine thrust                 |
| **Strafe**         | A / D           | Lateral thrusters                  |
| **Vertical strafe**| Space / C       | Up/down thrusters                  |
| **Roll**           | Q / E           | Roll acceleration with inertia     |
| **Aim / steer**    | Mouse           | Camera heading; hull follows       |
| **Primary fire**   | Left click      | Hold to auto-fire                  |
| **Secondary fire** | Right click     | Hold to auto-fire                  |
| **Boost/Dash**     | Shift           | Short thrust burst, cooldown       |
| **Hard brake**     | X               | Strong inertia dampening           |
| **Camera toggle**  | F1              | Third-person / first-person        |
| **Hull ability**   | Unassigned      | POC reserves Space/C for vertical  |
| **Interact**       | Unassigned      | Rebind when stations enter scope   |
| **Map**            | Tab / M         | Toggle galaxy map                  |
| **Inventory**      | I               | Toggle cargo/loadout screen        |
| **Drone command**  | Q               | Carrier-only: cycle drone behavior |
| **Ping**           | Middle click    | Co-op: ping location for team      |
| **Pause / Menu**   | Esc             | Pause (solo) / Menu (co-op)        |

### Controller (Gamepad)

| Action             | Default Binding | Notes                       |
| ------------------ | --------------- | --------------------------- |
| **Move**           | Left stick      | Thrust in direction         |
| **Aim**            | Right stick     | Ship faces stick direction  |
| **Primary fire**   | Right trigger   | Hold to auto-fire           |
| **Secondary fire** | Left trigger    | Hold to auto-fire           |
| **Boost/Dash**     | Left bumper     | Short burst, cooldown       |
| **Hull ability**   | Right bumper    | Unique per hull             |
| **Interact**       | A / X           | Dock, pick up               |
| **Map**            | D-pad Up        | Toggle galaxy map           |
| **Inventory**      | D-pad Right     | Toggle cargo/loadout screen |
| **Drone command**  | D-pad Left      | Carrier-only                |
| **Ping**           | D-pad Down      | Co-op ping                  |
| **Pause / Menu**   | Start           | Pause / Menu                |

> All bindings are remappable in settings.

---

## 5. Boost / Dash Mechanic

The boost is a short, fast burst that serves as both offense and defense:

| Aspect            | Spec                                                      |
| ----------------- | --------------------------------------------------------- |
| **Activation**    | Press Shift/bumper — instant response                     |
| **Direction**     | Boosts in current movement direction (not aim direction)  |
| **Speed**         | 1.5× max speed for duration                               |
| **Duration**      | 0.3–0.6s (varies by hull)                                 |
| **Cooldown**      | 2–6s (varies by hull)                                     |
| **Invincibility** | None — boost is for positioning, not i-frames             |
| **VFX**           | Engine trail intensifies, slight motion blur, speed lines |
| **Audio**         | Whoosh + engine rev                                       |

---

## 6. Hull Abilities

Each hull has one unique ability on a longer cooldown. These are NOT in M1–M2 but designed for M4+:

| Hull            | Ability      | Effect                                      | Cooldown |
| --------------- | ------------ | ------------------------------------------- | -------- |
| **Interceptor** | Afterburner  | 2× speed for 3s, can't fire during          | 12s      |
| **Gunship**     | Weapons Hot  | All weapons fire 50% faster for 4s          | 15s      |
| **Hauler**      | Tractor Beam | Pull all nearby loot to ship (wide radius)  | 10s      |
| **Phantom**     | Cloak        | Invisible for 3s, break on fire, bonus crit | 18s      |
| **Juggernaut**  | Fortify      | 80% damage reduction for 4s, can't move     | 20s      |
| **Carrier**     | Drone Surge  | All drones fire rate doubled for 5s         | 14s      |
