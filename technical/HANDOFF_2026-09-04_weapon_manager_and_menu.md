# Handoff: gimbal weapons, Ship Weapon Manager, main menu (2026-09-04)

Paste this into a fresh session as the opening prompt. It describes what exists,
where it lives, how to verify it, and what is next. Nothing below is committed
yet in either repo.

---

## Prompt

You are continuing work on **Shattered Slop**, a UE 5.8 6DOF roguelite. Two
sibling repos under `C:\Projects\_personal\Shattered\`:

- `creative/` — design docs, art, HTML mockups, static wiki. Never compile or
  launch Unreal from here.
- `game/` — the Unreal C++ project (module still named `ShatteredRogue`).

Rules that matter: read `game/.cursor/rules/ue-session.mdc` and
`creative/.cursor/skills/ue-playtest/SKILL.md` before touching Unreal. Inventory
`UnrealEditor*` processes first. Never kill a full `UnrealEditor.exe` without
asking; an agent-started `UnrealEditor-Cmd.exe -game` may be stopped before a
C++ link (LNK1104 on the DLL means it is still running). Build with:

```
"C:\Program Files\Epic Games\UE_5.8\Engine\Build\BatchFiles\Build.bat" ShatteredRogueEditor Win64 Development "C:\Projects\_personal\Shattered\game\ShatteredRogue.uproject" -WaitMutex -NoHotReloadFromIDE
```

Launch the menu for testing with:

```
UnrealEditor-Cmd.exe "<uproject>" /Game/Maps/M_MainMenu -game -windowed -ResX=1920 -ResY=1080 -NoHotReloadFromIDE -abslog="<game>\Saved\Logs\WeaponManagerTest.log"
```

Capture and click it with `creative/art/hud/plates/click-and-capture.ps1`
(`-ClickX/-ClickY` are window pixels at 1.45x DPI, `-Wheel N` zooms,
`send-key.ps1 -VirtualKey 0xBB` presses `=`). The wiki dev server is
`node creative/art/hud/mockup/serve.mjs --root dist --port 4173` after
`node creative/wiki/build.mjs`.

### What was built this session

**Player weapon system (game)**

- `ShatteredWeaponMounts.h/.cpp`: `FShatteredWeaponMountConfig` (base mount,
  `PivotOffset`, per-cartridge mounts, hardpoints with position/rotation/scale,
  loadout, limits) with JSON round-trip at `game/Saved/Config/WeaponMounts.json`.
  `UShatteredGimbalMountComponent` builds YawPivot → BaseMesh and
  YawPivot → PitchPivot(`PivotOffset`) → GunMesh, plus a cyan pivot ball and
  +X tick for the preview. `BuildRig()` is shared by the player pawn and the
  preview actor. Pitch limits are 0..90 (a gimbal cannot look into itself).
- Tuned defaults are baked in `MakeDefault()` / `EnsureHardpoints()` from the
  user's in-game tuning: base yaw 90, pivot (1, 0, 19), laser offset (15, 0, -7)
  scale 0.4172, seeker (1, -1, -4) scale 0.2266, coil (6, -1, -3) yaw -180 scale
  0.2361; wing pads at x -0.1185L, y ±0.283L; nose pads at x 0.3445L, y ±0.07L,
  roll ±60, scale 0.8. Hull length L is 291.8 for Ace. Hardpoint Z is snapped
  onto the hull on a fresh config.
- Meshes: `Content/Meshes/Ships/SM_Interceptor_Ace` (48,394 tris) and
  `Content/Meshes/Weapons/SM_Weapon_{GimbalBase,LaserCannon,SeekerRocket,LightningCoil}`.
  Import scripts: `Scripts/import_ace_hull.py`, `Scripts/import_weapon_kit.py`,
  then **always** `Scripts/disable_nanite_kit.py`. The game runs SM5 where
  Nanite draws its reduced fallback, so imported meshes must have Nanite off.
  Run scripts with `UnrealEditor.exe <uproject> -ExecutePythonScript=<path> -<Flag>Quit -unattended -nosplash`.

**Ship Weapon Manager (game, Admin/Debug → A3)**

- `ShatteredWeaponManagerWidget.h/.cpp` + `ShatteredShipPreviewActor.h/.cpp`.
  Rail on the left in the mockup style: loadout rows (gun chip cycles, EDIT
  selects, gold rule on the selected pad), EDIT TARGET chips PAD / BASE MESH /
  GUN MESH / GUN PIVOT plus ALIGN +X and FLIP 180, readout, two-column nudge
  grid (pos ±10/±1, rot ±15/±1, scale ±0.1/±0.01), SNAP PAD Z TO HULL, gimbal
  yaw/pitch sliders, SWEEP, PAD MARKERS (pink/black checkerboards and pivot
  markers), SAVE + COPY JSON (file + clipboard), RESET, BACK. AUTO ROTATE is a
  checkbox bottom-centre of the preview band, off by default.
- Preview actor: Ace on a turntable framed in the right band, camera fill and
  rim lights, complex-collision hull trace for snapping.
- Handoff loop with the user: they tune in-game, press SAVE + COPY JSON, paste
  the JSON; you bake the numbers into `MakeDefault()`/`EnsureHardpoints()`.

**Main menu (game)**

- `ShatteredMenu.h/.cpp` rebuilt to match `creative/art/hud/mockup/menu.html`:
  logo lockup (`/Game/UI/T_LogoLockup`, main screen only), left rail of
  `UShatteredMenuEntryButton` manifest rows (index, label, sub, gold hover
  rule), tech-head strips on sub-screens, Chakra Petch via
  `ShatteredUiFont.h` (reads `Content/UI/Fonts/*.ttf` off disk, same as the
  HUD), 30% dim over the live generated sector, camera framed on the sun and
  biggest planet with slow drift, Escape goes back, `=` rerolls the sector.
  Footer: `BUILD <ProjectVersion>` left (from `DefaultGame.ini`, currently
  0.1.0), `SECTOR SEED n  = REROLL` right, 9px.
- Backdrop seed is 731348, hand-picked by the user, in `ShatteredMenuStyle`.
  The previews switch the director to sky-only so rocks never cross the
  turntable; rail screens restore the full field.

**Mockup / wiki (creative)**

- `art/hud/mockup/menu.html` + `menu.css`: matches the game one for one,
  including the manager screen (class `screen wm`; do not name it `loadout`,
  the HUD stylesheet hides that class). Ship sits in the right band via
  `camera.setViewOffset`. Seed default 731348, orbit off by default.
- Wiki (`creative/wiki/build.mjs`) has a mockups page, weapon catalog with the
  gimbal mount spec, and the Ace style master.
- Logo assets in `art/logo/`, Codex prompts alongside.

### Verified state

- Menu, Admin, Pirate Raid, Options, and the manager all render in the
  `-game` client and were screenshot-checked. Save writes the JSON and fills
  the clipboard. Gimbal pitch tilts about the placed pivot once the gun barrel
  is on +X.
- Both repos are uncommitted: roughly 25 files in `game/`, 31 in `creative/`.
  Commit both before starting anything new.

### Next steps, in order

1. Commit both repos (separate commits per repo; describe the weapon system,
   the manager, the menu, and the mockup).
2. Auto-aim: use the rig on `AShatteredPawn` (`WeaponRig`), drive `SetAim()`
   toward the nearest hostile within `Limits`, fire from
   `GetMuzzleTransform()`. Respect `TraverseDegreesPerSecond`.
3. Level Generator screen (Admin A2) is a dimmed placeholder in-game; the
   mockup version exists in `menu.html` (`data-screen="levelgen"`).
4. Optional: keyboard navigation for the rail (the mockup has it), and a
   per-hull config once a second ship exists.

### Gotchas already paid for

- Nanite fallback under SM5 (above). Verify with `get_num_triangles(0)`.
- Bash heredocs containing backticks fail in this tool; write scripts with
  the Write tool and run them.
- `menu.html` uses `const` bindings that must come after `SCENE`.
- The Interchange import stages into `/Game/.../Imports` then renames over
  the runtime path so material names cannot collide.
- Old `WeaponMounts.json` files with `trunnionHeight` migrate on load into
  `PivotOffset.Z`.

---
