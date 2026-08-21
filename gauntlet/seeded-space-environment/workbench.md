# Workbench — Seeded Procedural Space Environment

Wave: implementation complete (recipe + director + materials + Flight Lab seed + tests + docs)

## How to run
1. Open `C:\Projects\_personal\Shattered\ShatteredRogue\ShatteredRogue.uproject`
2. Play → Flight Training (or PIE on `M_PirateRaid`)
3. Press `\` (PIE) or F8 (standalone) for Flight Lab
4. Note ENVIRONMENT SEED / LAYOUT HASH; APPLY SEED; NEW SEED

Automation: Session Frontend → `ShatteredRogue.Environment.RecipeDeterminism`

## Proof
- Test passed 2026-08-21: RecipeDeterminism Success (0.015s)
- PIE log: `ShatteredEnvironment seed=28092 hash=2939300232 planets=1 asteroids=29 clouds=3` (repeated on double BeginPlay)
- Materials: `Content/Materials/Environment/M_Space*.uasset`
- Map: stock sky/asteroids stripped from `M_PirateRaid`
- Refs: `gauntlet/seeded-space-environment/refs/` (editor captures; in-viewport capture is editor-cam, use PIE/game view)

## Largest remaining gap
Sky/nebula read dark in first raid PIE (player died before a clean fly-around). Skylight real-time capture disabled; sky emissive boosted. Needs a Flight Training visual pass with APPLY SEED on a 0-planet and 3-planet seed.
