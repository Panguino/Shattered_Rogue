---
name: ue-playtest
description: >-
  Rebuild and launch Shattered Slop in Unreal without duplicate processes.
  Use when compiling C++, launching PIE/-game, capturing a HUD plate, or when
  LNK1104 / EADDRINUSE / a locked UnrealEditor-ShatteredRogue.dll appears.
---

# UE playtest

Engine project: `C:\Projects\_personal\Shattered\game`
UE: `C:\Program Files\Epic Games\UE_5.8`
Mockup server: `C:\Projects\_personal\Shattered\creative\art\hud\mockup\serve.mjs` on port **5173**

## 1. Inventory first

```powershell
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -match 'UnrealEditor|UnrealBuildTool' -or $_.CommandLine -like '*serve.mjs*' } |
  Select-Object ProcessId, Name, CommandLine
```

| Already running | Do this |
| --- | --- |
| `UnrealEditor.exe` for this uproject | Do not kill. Build with the editor closed **or** ask the user to stop PIE. Prefer they keep the editor. |
| `UnrealEditor-Cmd.exe … -game` for this uproject | Reuse if the DLL is current. Stop it only before a C++ link. |
| `node serve.mjs` on 5173 | Reuse. GET `/mockup/fonts/ChakraPetch-400.woff2` must be `font/woff2`. Restart only if MIME is `octet-stream` or the process is not this repo. |
| Nothing | Start only what this task needs. |

## 2. Decide restart vs reuse

- Mockup HTML/CSS only → HTTP reload. No Unreal.
- C++ compile only, playtest already open → stop **Cmd -game**, build, relaunch Cmd -game.
- First visual check of HUD → Flight Training map, not `M_MainMenu`.
- User is in the full editor → ask before killing anything; let them press Play.

## 3. Build

Stop agent-owned `-game` Cmd first if the DLL is locked.

```powershell
& "C:\Program Files\Epic Games\UE_5.8\Engine\Build\BatchFiles\Build.bat" `
  ShatteredRogueEditor Win64 Development `
  "C:\Projects\_personal\Shattered\game\ShatteredRogue.uproject" `
  -WaitMutex -NoHotReloadFromIDE
```

Success = `Result: Succeeded`. `LNK1104` = a process still has the DLL; go back to step 1.

## 4. Launch Flight Training

```powershell
& "C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" `
  "C:\Projects\_personal\Shattered\game\ShatteredRogue.uproject" `
  "/Game/Maps/M_PirateRaid?game=/Script/ShatteredRogue.ShatteredTrainingGameMode" `
  -game -windowed -ResX=1920 -ResY=1080 -NoHotReloadFromIDE `
  -abslog="C:\Projects\_personal\Shattered\game\Saved\Logs\HaloPlaytest.log"
```

Wait until `MainWindowHandle` is non-zero (often 15–25s). Then capture with `art/hud/plates/capture-plate.ps1`.

## 5. Mockup

```powershell
cd C:\Projects\_personal\Shattered\creative\art\hud\mockup
node serve.mjs 5173
```

Open `http://localhost:5173/mockup/?shot=1`. Never `file://`.
