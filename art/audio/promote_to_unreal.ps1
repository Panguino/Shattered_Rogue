# Promotes chosen audio candidates into the playable Unreal project.
#
# Candidates keep their generation-history names in this repo (v01, v02, ...).
# The engine gets stable gameplay names instead, because C++ references an asset
# path and that path must not change every time a better take is picked. The map
# below is therefore the record of which take is live.
#
# Imports run through the ImportAssets commandlet rather than the editor UI so
# promotion is repeatable and reviewable. UE 5.8's sound factory reads mp3 as
# well as wav, so approved takes are imported as generated rather than
# regenerated into another format.

$ErrorActionPreference = "Stop"

$Engine = "C:\Program Files\Epic Games\UE_5.8"
$Project = "C:\Projects\_personal\Shattered\game"
$Candidates = Join-Path $PSScriptRoot "elevenlabs\sfx"
$Staging = Join-Path $Project "Intermediate\AudioImport"

# Source candidate -> asset name, destination content path.
$Promotions = @(
    @{ Source = "weapons\laser_cannon_rapid_v08.wav";        Asset = "A_Cannon_Laser";  Dest = "/Game/Audio/SFX/Weapons" }
    @{ Source = "collisions\ship_asteroid_hull_smash_v02.mp3"; Asset = "A_HullSmash_01"; Dest = "/Game/Audio/SFX/Collisions" }
    @{ Source = "collisions\ship_asteroid_hull_smash_v03.mp3"; Asset = "A_HullSmash_02"; Dest = "/Game/Audio/SFX/Collisions" }
    @{ Source = "movement\engine_hum_drive_v08.wav";          Asset = "A_Engine_Drive"; Dest = "/Game/Audio/SFX/Movement" }
    @{ Source = "movement\engine_boost_burst_v02.wav";        Asset = "A_Boost_Burst";  Dest = "/Game/Audio/SFX/Movement" }
    @{ Source = "pickups\xp_orb_v02.wav";                     Asset = "A_Pickup_Xp";       Dest = "/Game/Audio/SFX/Pickups" }
    @{ Source = "pickups\boost_orb_v03.wav";                  Asset = "A_Pickup_Boost";    Dest = "/Game/Audio/SFX/Pickups" }
    @{ Source = "impacts\enemy_destroyed_v05.mp3";            Asset = "A_Enemy_Destroyed"; Dest = "/Game/Audio/SFX/Impacts" }
    @{ Source = "impacts\asteroid_shatter_v02.mp3";           Asset = "A_Asteroid_Shatter"; Dest = "/Game/Audio/SFX/Impacts" }
)

# A_Engine_Drive needs USoundWave::bLooping, which this path cannot author:
# the commandlet only forwards an ImportSettings block to factories implementing
# IImportSettingsParser, and USoundFactory does not. The pawn sets the flag on
# load instead; see the engine audio setup in ShatteredPawn.cpp.

if (Test-Path $Staging) { Remove-Item -Recurse -Force $Staging }
New-Item -ItemType Directory -Force -Path $Staging | Out-Null

# The commandlet names each asset after its source file, so staging copies are
# renamed first. Staging lives under Intermediate because it is derived data.
$Groups = @{}
foreach ($Promotion in $Promotions) {
    $SourcePath = Join-Path $Candidates $Promotion.Source
    if (-not (Test-Path $SourcePath)) { throw "Missing candidate: $SourcePath" }

    $StagedName = $Promotion.Asset + [System.IO.Path]::GetExtension($SourcePath)
    $StagedPath = Join-Path $Staging $StagedName
    Copy-Item $SourcePath $StagedPath -Force

    if (-not $Groups.ContainsKey($Promotion.Dest)) { $Groups[$Promotion.Dest] = @() }
    $Groups[$Promotion.Dest] += $StagedPath.Replace('\', '/')
}

$ImportGroups = foreach ($Dest in $Groups.Keys) {
    [ordered]@{
        Filenames        = @($Groups[$Dest])
        DestinationPath  = $Dest
        FactoryName      = "SoundFactory"
        bReplaceExisting = $true
    }
}

$SettingsPath = Join-Path $Staging "import.json"
@{ ImportGroups = @($ImportGroups) } | ConvertTo-Json -Depth 6 | Set-Content -Path $SettingsPath -Encoding UTF8

Write-Host "Importing $($Promotions.Count) asset(s)..."

# -dest is redundant next to -importsettings, since every group carries its own
# destination, but the commandlet validates its global import data regardless and
# logs an "Invalid Destination Path ()" error without it.
& "$Engine\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" `
    "$Project\ShatteredRogue.uproject" `
    -run=ImportAssets `
    -importsettings="$SettingsPath" `
    -dest="/Game/Audio" `
    -nosourcecontrol -unattended -nopause -nosplash |
    Select-String -Pattern "LogAutomatedImport|LogAudioDerivedData: Display: (\w+) compressed"

# The commandlet's exit code cannot be trusted here: ParseImportSettings returns
# a success flag it never assigns, so a settings-file import always reports
# failure. Verify the assets instead.
$Missing = $Promotions | Where-Object {
    $Package = $_.Dest -replace "^/Game", (Join-Path $Project "Content")
    -not (Test-Path (Join-Path $Package "$($_.Asset).uasset"))
}
if ($Missing) { throw "Import produced no asset for: $($Missing.Asset -join ', ')" }

Get-ChildItem -Recurse -File -Path (Join-Path $Project "Content\Audio") |
    ForEach-Object { "  " + $_.FullName.Replace("$Project\", "") + "  " + $_.Length }
