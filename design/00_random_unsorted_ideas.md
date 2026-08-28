# Random unsorted ideas

Scratch pad for concepts not yet folded into the main design docs.

---

## Mining skill and timing (Elite-style tiers)

**Verbatim**

> Mining as a process which requires some skill and timing. Elite Dangerous has some very cool mechanics where there are three types of mining and each give progressively better rewards. 1: simple shooting asteroids and you get some resources. 2: sub-surface mining where you fire drill explosives into the asteroid, they tunnel to a certain level (some skill involved in stopping them at the optimal level) and then they explode and eject resources out. 3: rock cracking - place sticky explosives on structural points on large asteroids. A timer starts as soon as you put the first one down, and you have to hit the right amount of spots before the timer reaches zero. If you do, the rock cracks and you get high value resources from the center. If you don't make it in time it still cracks but you get less valuable or less quantity of resources.

### Cursor additional suggestions

- Map tier 1–3 to **risk / exposure**: higher tiers take longer and attract attention (pirates, patrols, environmental hazards), so the skill gate doubles as a tension knob.
- Sub-surface: consider **readable feedback** (depth meter, colour shift, audio “click” at sweet spot) so mastery is learnable, not opaque.
- Rock cracking: **route planning** on the asteroid surface (thruster game + weak points) pairs well with co-op—one player plants, another clears threats.
- Tie ore types to **crafting branches** so players choose which tier to pursue per run, not always grind tier 3.

---

## Warp transition as loading / travel

**Verbatim**

> Warp transition as the loading screen between systems - camera flying alongside your ship as you're going through warp while the level loads. Gives good immersion.

### Cursor additional suggestions

- Use the moment for **light interactivity** (minor course corrections, flare deploy, comm static) so it feels like play, not only a mask for I/O.
- **Variable length** by hardware or chunk size; loopable middle section with seamless start/end beats avoids “dead” feeling on slow loads.
- Sneak in **micro-narrative** (faction chatter, anomaly streak) or run-state hints (damage sparks, cargo vibration) to sell continuity.

---

## System progression (Inscryption-like routes)

**Verbatim**

> System progression as a linear route with branching and coverging paths like in Inscryption. Forces choices about what player's value when they can only choose one route to go down, and the route might consist of two or three nodes before it converges back in again, so you may have to choose to go for one good thing but miss out on several others.

### Cursor additional suggestions

- Show **ghosted or silhouetted** paths the player skipped after the choice for regret / anticipation on future runs.
- Convergence nodes as **“boss” or shop** beats make the fork meaningful—both branches should offer different *types* of power (econ vs combat vs repair), not just bigger numbers.
- Seed **secret re-join** edges rarely so route maths stays readable but surprises exist.

---

## Push-forward pressure (mining / stations vs FTL-style fleet)

**Verbatim**

> I think you need something to keep players pushing on. Mining sectors and trade stations are good but you don't want them to spend too much time there building up too many resources or fixing up too much of their ship. FTL uses the idea of an approaching enemy fleet to give you limited time in each zone, but you have some time once they arrive to tank it out and push your luck.

### Cursor additional suggestions

- Layer **two clocks**: a soft “interest” clock (prices drop, scans increase) and a hard “you must leave” event, so overstaying is a gamble with readable stages.
- Stations could **lock down** or charge premium fees when the threat is imminent—narrative justification for leaving the comfort zone.
- Offer **one clear outs** (bribe, side quest, expensive jump fuel) so tanking it out is a build-supported choice, not only frustration.

---

## Derelicts, secret hulls, scanner tradeoffs

**Verbatim**

> Ship parts and upgrades found on derilict ships. Maybe also secret hulls which you can only find and unlock on your runs. You could have modules you can use on the ship to help detect these, but at the cost of a module slot that might be used for weapons or otherwise.

### Cursor additional suggestions

- **Signature minigame** per derelict (power routing, breach timing) so finds feel earned, not RNG icons on a map.
- Detection modules: expose **confidence bands** (“weak signal in this sector”) instead of exact waypoints to keep exploration spicy.
- Secret hulls: tie unlocks to **optional keys** found across runs (meta) vs single-run keys (roguelike tension)—pick one philosophy early.

---

## Co-op: split to different systems

**Verbatim**

> Choice for players to split up in co-op and travel to different systems - maximise loot but at the cost of additional risk to the player.

### Cursor additional suggestions

- Define **rejoin rules** (same sector next node? warp sync?) so split never strands someone in loading limbo.
- Risk should scale with **distance** or **time apart** (escalating local spawns) so the choice is legible.
- Shared **objective windows** (e.g. one player must hold a point while another completes a node) turn split into coordinated plays, not only parallel farming.

---

## Scalable difficulty by player count

**Verbatim**

> Scalable difficulty - enemy strength increases base on number of players.

### Cursor additional suggestions

- Scale **pressure** (spawn rate, elite mix) more than only HP sponges to keep time-to-kill satisfying.
- **Downed-state** or support roles scale so solo isn’t the unintended “easiest” mode.
- Surface the scaling in UI (“Squad threat: High”) so players understand wipes aren’t arbitrary.

---

## Missiles (Macross-level patterns)

**Verbatim**

> Missiles. Missiles everywhere. I want Macross level flower pattern missile spreads converging from and to you.

### Cursor additional suggestions

- Give enemies and players **distinct silhouette patterns** (colour, trail, audio chirp) so dense volleys remain readable.
- **Counterplay** (flares, PD lasers, i-frames on well-timed boosts) keeps spectacle from feeling unfair.
- Boss phases built around **geometric salvo tells** (spiral in, then pause—dash window) teach the eye without UI clutter.

---

## Cel shading

**Verbatim**

> Cel shading. Everything looks better in cel shading.

### Cursor additional suggestions

- Pair toon ramps with **strong rim lights** in space so ships pop against nebula noise.
- VFX (warp, missiles) often need **hybrid** treatment—full toon on hulls, slightly softer gradients on glows—to avoid banding on HDR displays.

---

## Recurring NPCs

**Verbatim**

> Recurring NPCs - shop owners, rivals, other pilots, etc. Possible allies that can temporarily join you to help you fight in a sector. 2D character portraits and dialogue.

### Cursor additional suggestions

- Lightweight **relationship flags** (saved, betrayed, paid debt) that change prices or ambush tables—not full RPG, just hooks.
- Temporary allies: **clear duration** (this sector only / one fight) and collision rules so they don’t steal agency.
- Portraits: **silhouette + palette** locks per character so players recognize reruns instantly.

---

## Music: high intensity battles

**Verbatim**

> Sick beats. High intesity music for battles, drum and bass. Something which works well with the high energy arcardey space battles.

### Cursor additional suggestions

- **Stems** layered by combat intensity keep loops fresh without jarring starts/stops.
- Sidechain or **ducking** under SFX for missile warnings and hull alerts preserves readability.
- Genre palette per faction (DnB vs industrial vs synthwave) sells identity faster than exposition.

---

## Enemy waves

**Verbatim**

> Enemy waves. Enemies which come in periodically and in stronger numbers.

### Cursor additional suggestions

- **Telegraph** waves (dropouts, carrier warp, beacon pulse) so players can reposition or burn cooldowns deliberately.
- Escalation curves per **biome or heat** tie waves to long-run tension, not arbitrary timers.
- Optional **endless wave** extract nodes (Dungeon of the Endless style) as a contract type.

---

## Long engine trails

**Verbatim**

> Long engine trails.

### Cursor additional suggestions

- Trails as **readable motion history** for PvE reads (player dodge lines) but cap length in PvP-style modes if you add competitive angles.
- Cosmetic / upgrade **trail density** hooks into progression without mandatory performance hit—LOD and pooling matter here.

---

## Limited palettes by system type

**Verbatim**

> Limited colour palettes depending on system type? Voids have very high contrast black/white/red/yellow, more sedate systems have green/blue colour schemes?

### Cursor additional suggestions

- Keep **enemy and hazard hues** consistent across biomes (e.g. hostile red always means danger) even when background palettes shift.
- Accessibility: offer **preset alternatives** for void high-contrast (motion / migraine sensitivity).
- Palette swap as **forecast** in the route map so players mentally prep before warp.

---

## Inspiration (store links)

**Verbatim**

> - Strike Suit Infinity: https://store.steampowered.com/app/234160/Strike_Suit_Infinity/ (watch the video, very cool arcade style. Missiles! Warping in fleets!)
> - X4: https://store.steampowered.com/app/392160/X4_Foundations/
> - FTL: https://store.steampowered.com/app/212680/FTL_Faster_Than_Light/
> - House of the Dying Sun: https://store.steampowered.com/app/283160/House_of_the_Dying_Sun/
> - Inscryption: https://store.steampowered.com/app/1092790/Inscryption/
> - Nova Drift: https://store.steampowered.com/app/858210/Nova_Drift/
> - Everspace: https://store.steampowered.com/app/396750/EVERSPACE/
> - Dungeon of the Endless https://store.steampowered.com/app/249050/Dungeon_of_the_ENDLESS/ (like the idea of you activating the exit point triggers enemy waves which you have to survive until the warp is ready)

### Cursor additional suggestions

- **Strike Suit / House of the Dying Sun**: study mission cadence and “weight” of capitals warping in—good references for spectacle + readability.
- **X4**: economy and station fantasy without adopting sim scope—cherry-pick station *feel*, not spreadsheets.
- **FTL / Inscryption**: route choice and clocks are the lift; space combat is your differentiator—merge carefully so neither system fights the other.
- **Nova Drift / Everspace**: upgrade density and moment-to-moment readability for arcade roguelike pacing.
- **Dungeon of the Endless**: hold-the-point exit is a strong **contract type** for a sector: activate spire, survive N waves, extract—maps cleanly to co-op roles.
