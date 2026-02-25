# 🎮 Controls, Camera & Ship Movement

> **Parent doc:** [00_GAME_DEVELOPMENT_PLAN.md](../00_GAME_DEVELOPMENT_PLAN.md)

---

> [!IMPORTANT]
> **The ship must feel good in 5 seconds.** Before loot, before enemies, before everything — the ship has to be fun to fly. This doc defines exactly how movement, aiming, camera, and input work.

---

## 1. Movement Model — Arcade Drift Hybrid

Not pure twin-stick (too twitchy) and not Newtonian (too floaty). The ships use an **arcade drift hybrid**:

- **Thrust** is directional — push a direction, ship accelerates that way
- **Momentum** carries slightly — releasing thrust doesn't stop you instantly
- **Drag** kicks in quickly — ships slow to a stop within ~0.5–1s (varies by hull)
- **Rotation** is instant — the ship always faces the aim direction (no turn radius)

This gives the feel of Asteroids-style drift but with tight, responsive control. Think _Hades_ character movement but in space.

### Movement Parameters by Hull

| Parameter          | Interceptor | Gunship | Hauler  | Phantom   | Juggernaut | Carrier  |
| ------------------ | ----------- | ------- | ------- | --------- | ---------- | -------- |
| **Max Speed**      | 800         | 600     | 500     | 900       | 400        | 550      |
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

- Ship always faces the mouse cursor
- Left click = primary weapon (hold to fire)
- Right click = secondary weapon (hold to fire)
- Aim is instant — no aim lag or smoothing

**Controller:**

- Right stick = aim direction (ship faces stick direction)
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

| Parameter      | Value                                               |
| -------------- | --------------------------------------------------- |
| **Angle**      | Top-down, ~55° from horizontal (not pure 90°)       |
| **Height**     | ~2000 units above ship (adjustable per context)     |
| **Follow**     | Smooth follow with slight lag (lerp, 0.1s)          |
| **Look-ahead** | Camera leads slightly in aim direction (+200 units) |
| **Aspect**     | Widescreen, full viewport                           |

### Dynamic Camera Behaviors

| Trigger                  | Camera Response                                              |
| ------------------------ | ------------------------------------------------------------ |
| **Boosting**             | Slight zoom out (FOV +5°), pulls back in on stop             |
| **Boss encounter**       | Zoom out further to show full arena                          |
| **Dense asteroid field** | Slight zoom in for tighter navigation feel                   |
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
| **Move**           | WASD            | Thrust in direction                |
| **Aim**            | Mouse position  | Ship faces cursor                  |
| **Primary fire**   | Left click      | Hold to auto-fire                  |
| **Secondary fire** | Right click     | Hold to auto-fire                  |
| **Boost/Dash**     | Shift           | Short burst, cooldown              |
| **Hull ability**   | Space           | Unique per hull                    |
| **Interact**       | E               | Dock at station, pick up items     |
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
