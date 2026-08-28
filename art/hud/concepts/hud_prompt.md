# Flight HUD — generation prompt

Source of truth for the information architecture is
[16_ui_hud_vfx.md](../../../design/16_ui_hud_vfx.md) §2. Art direction is
[01_game_vision.md](../../../design/01_game_vision.md) §4. This file exists so the
prompt is versioned alongside the output, and so a re-roll produces a comparable
image instead of a new art style.

These are **concepts**, not assets. They set the look; the shippable layout is
settled in `art/hud/mockup/` where the geometry maps to UMG.

## Reference images passed in

| File | What it anchors |
| ---- | --------------- |
| `art/hud/plates/plate_asteroid_field_01.png` | The real backdrop — palette, nebula, asteroid and ship scale |
| `art/hud/concepts/hud_concept_glass.png` | The frameless glass treatment we already picked |
| `art/ships/interceptor/ace.png` | The hull the blueprint silhouette must resemble |

## Shared base

> Video game HUD concept art, 16:9. Third-person chase view of a stylized cartoon
> space shooter. Background: dark navy-black void, soft magenta and violet nebula
> clouds, small sharp white stars, chunky low-poly brown-grey asteroids with
> craters, lit by one warm directional key light. Low and centered, seen from
> behind, a small stylized interceptor — red and white hull, gold engine collars,
> three glowing cyan engine plumes.
>
> Overlay a semi-transparent flight HUD. **Frameless glass only — no metal
> bezels, no rivets, no chrome.** Thin single-pixel cyan rim lines, angular
> broken-corner brackets, short cardinal rails. Clean geometric sans-serif, short
> all-caps labels. Cartoon-clean sci-fi (Astroneer / Super Mario Galaxy
> readability) with StarCraft angularity — never gritty milsim.
>
> Palette: cyan `#89EDFF` primary and shields, coral `#FFA293` hull and damage,
> gold `#FFDD7C` boost and highlights, pale blue-white `#EFF7FF` text, muted
> blue-grey `#ADC4D4` secondary text. Glass fills are dark desaturated teal at
> roughly 40% opacity. High contrast against dark space; the HUD must never
> obscure the ship or the asteroids.
>
> Information layout, exactly:
> - **Around the ship**, screen-space arcs, not boxes: cyan shield arc above,
>   coral hull arc below, gold boost wedge at the rear near the engines.
> - **Screen center**, an angular impact reticle — open middle, four short
>   cardinal rails, broken corner brackets, small center dot, with two small
>   weapon-ready ticks attached to it.
> - **Top center**, a small scenario chip: mission name and a one-line objective.
> - **Top left**, score and combo, plus a small round radar disc with enemy dots.
> - **Top right**, a compact currency column: four small icons with counts
>   (minerals, warp crystals, research data, power cores).
> - **Bottom left**, flight telemetry: one large speed number, then a short stack
>   of small labeled bars for forward, strafe, vertical and roll.
> - **Bottom center**, a small orthographic wireframe blueprint of the ship with
>   glowing gold hardpoint pads on the wings and engines, showing loadout slots.

## Variants

| # | Name | The idea |
| - | ---- | -------- |
| A | Line halo | Most restrained. Ship vitals are pure thin line-art arcs, frame info in small glass chips. Maximum view of the game. |
| B | Glass pods | Closest to what is in the build now — corner glass panels plus the new ship halo. Denser, more grounded. |
| C | Holo schematic | Most playful. Chunkier rounded glass, bigger icons, a prominent holographic ship blueprint. Astroneer end of the range. |
