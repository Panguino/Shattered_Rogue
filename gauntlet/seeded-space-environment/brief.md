# Seeded Procedural Space Environment

Slug: `seeded-space-environment`
Scope: task
Repo: `C:\Projects\_personal\Shattered\Shattered_Rogue` (design) + sibling `ShatteredRogue` Unreal project
Created: 2026-08-21
Clock: ~4h
Height: polished
Spend cap: none
Lead model: default strong
Autonomy: full
Stop: clock | user-stop | compile + determinism + visual review pass

## Outcome
Pirate Raid / Flight Training no longer uses a terrestrial default sky. A seeded director builds a space sector: one lighting sun, 0–3 planets, dust/nebula, starfield, and colliding asteroids. Seeds replay from Flight Lab.

## Quality bar
- No blue horizon or volumetric earth clouds in the raid map
- Same seed → same layout hash across PIE runs
- Sun always present and is the directional light
- Planet count in 0–3, including forced 0 and 3 in tests
- Automation `ShatteredRogue.Environment.RecipeDeterminism` passes

## Out of bounds
Do not:
- Implement the other seven gameplay biomes or hazards
- Add galaxy-map / New Game seed UI
- Add PCG graphs or networked replication
- Replace the player/pirate placeholder meshes

## Must-prove
- Recipe determinism test
- Log line `ShatteredEnvironment seed=… hash=…`
- PIE screenshot of a space backdrop (not default UE sky)

## Fit
fits as one asteroid-sector slice using shader illusion + engine primitives.

## Run prompt
See `gauntlet-prompt.md`.
