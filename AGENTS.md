# Shattered Slop — creative repo

This folder is design docs, art, and the HTML HUD mockup. The playable Unreal 5.8 project is the sibling:

`C:\Projects\_personal\Shattered\game`

C++ HUD/gameplay lives there (`Source/ShatteredRogue/`). Do not look for a `.uproject` here. GitHub remote is `Panguino/shattered_slop_creative`.

## Sessions

- HUD layout iteration: `art/hud/mockup/` over **http://localhost:5173/mockup/** (`node art/hud/mockup/serve.mjs`).
- Runtime HUD: edit `game` C++, then follow `.cursor/skills/ue-playtest/SKILL.md`.
- Process rules (when not to restart Unreal): `.cursor/rules/ue-session.mdc`.
- Fab / Marketplace library: never Add to Project on `game`. Drop packs into the sibling vault `C:\Projects\_personal\Shattered\ShatteredVault`, inspect there, then migrate only the pieces we keep.
