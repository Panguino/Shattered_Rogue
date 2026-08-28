# Launches Flight Training with diagnostic console commands and captures a plate.
#
# Focus is forced with an ALT tap because Windows refuses SetForegroundWindow
# from a background shell; capture-plate.ps1 throws rather than shoot the wrong
# window, so the plate is only taken once the client really owns the foreground.
param(
    [Parameter(Mandatory = $true)][string]$ExecCmds,
    [Parameter(Mandatory = $true)][string]$OutputName,
    [int]$Seed = 196
)

$ErrorActionPreference = "Stop"
$Engine = "C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe"
$Project = "C:\Projects\_personal\Shattered\ShatteredRogue\ShatteredRogue.uproject"
$Plates = "C:\Projects\_personal\Shattered\Shattered_Rogue\art\hud\plates"

Get-Process -Name "UnrealEditor-Cmd" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

$Arguments = @(
    $Project,
    "/Game/Maps/M_PirateRaid?game=/Script/ShatteredRogue.ShatteredTrainingGameMode",
    "-game", "-windowed", "-ResX=1920", "-ResY=1080", "-NoHotReloadFromIDE",
    "-EnvironmentSeed=$Seed",
    # The value must stay quoted: Start-Process joins the list on spaces, so an
    # unquoted "viewmode unlit" reaches the engine as two arguments and silently
    # does nothing.
    "-ExecCmds=`"$ExecCmds`"",
    "-abslog=C:\Projects\_personal\Shattered\ShatteredRogue\Saved\Logs\Diagnostic.log"
)
Start-Process -FilePath $Engine -ArgumentList $Arguments

$Deadline = (Get-Date).AddSeconds(150)
$Client = $null
while ((Get-Date) -lt $Deadline) {
    $Client = Get-Process -Name "UnrealEditor-Cmd" -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne 0 } |
        Select-Object -First 1
    if ($Client) { break }
    Start-Sleep -Seconds 3
}
if (-not $Client) { throw "Client window never appeared." }
Start-Sleep -Seconds 10

Add-Type @"
using System;
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential)]
public struct DiagRect { public int Left; public int Top; public int Right; public int Bottom; }

[StructLayout(LayoutKind.Sequential)]
public struct DiagPoint { public int X; public int Y; }

public static class DiagFocus
{
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern void keybd_event(byte v, byte s, uint f, UIntPtr e);
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out DiagRect r);
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern bool GetCursorPos(out DiagPoint p);
    [DllImport("user32.dll")] public static extern void mouse_event(uint f, int dx, int dy, uint d, UIntPtr e);
}
"@

$Handle = $Client.MainWindowHandle
$Focused = $false
for ($Attempt = 0; $Attempt -lt 8; $Attempt++) {
    [DiagFocus]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero)
    [DiagFocus]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
    [void][DiagFocus]::ShowWindow($Handle, 9)
    [void][DiagFocus]::BringWindowToTop($Handle)
    [void][DiagFocus]::SetForegroundWindow($Handle)
    Start-Sleep -Milliseconds 500
    if ([DiagFocus]::GetForegroundWindow() -eq $Handle) { $Focused = $true; break }
}

# Windows only grants foreground to a process the user last interacted with, so
# a background shell can be refused outright. A synthetic click on the title bar
# activates the window without delivering input to the game itself.
if (-not $Focused) {
    $Bounds = New-Object DiagRect
    if ([DiagFocus]::GetWindowRect($Handle, [ref]$Bounds)) {
        $Origin = New-Object DiagPoint
        [void][DiagFocus]::GetCursorPos([ref]$Origin)
        $TitleX = [int]((($Bounds.Left + $Bounds.Right) / 2))
        $TitleY = [int]($Bounds.Top + 8)
        [void][DiagFocus]::SetCursorPos($TitleX, $TitleY)
        Start-Sleep -Milliseconds 150
        [DiagFocus]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
        [DiagFocus]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
        Start-Sleep -Milliseconds 400
        [void][DiagFocus]::SetCursorPos($Origin.X, $Origin.Y)
    }
}
Start-Sleep -Seconds 2

& "$Plates\capture-plate.ps1" | Out-Null
Move-Item -LiteralPath "$Plates\plate.png" -Destination "$Plates\$OutputName" -Force
Write-Output "Saved $OutputName"
