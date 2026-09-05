# Focuses the running -game client, optionally clicks a point in it, and saves a
# plate.
#
# Windows denies SetForegroundWindow to a background shell unless that shell has
# recently synthesised input, so a throwaway ALT tap is sent first. Clicks go
# through SendInput for the same reason Slate ignores posted messages.
param(
    [int]$ClickX = -1,
    [int]$ClickY = -1,
    [int]$SettleMs = 1200,
    [int]$Wheel = 0,
    [string]$Out = "$PSScriptRoot\plate.png",
    [string]$ProcessName = "UnrealEditor-Cmd"
)

Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class Win32Client
{
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern void keybd_event(byte v, byte s, uint f, UIntPtr e);
    [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, UIntPtr e);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

[void][Win32Client]::SetProcessDPIAware()

$Process = Get-Process -Name $ProcessName -ErrorAction Stop |
    Where-Object { $_.MainWindowHandle -ne 0 } |
    Select-Object -First 1

if (-not $Process) {
    throw "No $ProcessName window is open yet."
}

$Handle = $Process.MainWindowHandle
for ($Attempt = 0; $Attempt -lt 5; $Attempt++) {
    [Win32Client]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero)
    [Win32Client]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
    [void][Win32Client]::ShowWindow($Handle, 9)
    [void][Win32Client]::SetForegroundWindow($Handle)
    Start-Sleep -Milliseconds 500
    if ([Win32Client]::GetForegroundWindow() -eq $Handle) { break }
}

if ([Win32Client]::GetForegroundWindow() -ne $Handle) {
    throw "$ProcessName never reached the foreground."
}

$Rect = New-Object Win32Client+RECT
[void][Win32Client]::GetWindowRect($Handle, [ref]$Rect)

if ($ClickX -ge 0 -and $ClickY -ge 0) {
    [void][Win32Client]::SetCursorPos($Rect.Left + $ClickX, $Rect.Top + $ClickY)
    Start-Sleep -Milliseconds 250
    [Win32Client]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
    Start-Sleep -Milliseconds 80
    [Win32Client]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
    Start-Sleep -Milliseconds $SettleMs
}

[void][Win32Client]::GetWindowRect($Handle, [ref]$Rect)
$Width = $Rect.Right - $Rect.Left
$Height = $Rect.Bottom - $Rect.Top
$Bitmap = New-Object System.Drawing.Bitmap $Width, $Height
$Graphics = [System.Drawing.Graphics]::FromImage($Bitmap)
$Graphics.CopyFromScreen($Rect.Left, $Rect.Top, 0, 0, $Bitmap.Size)
$Bitmap.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$Graphics.Dispose()
$Bitmap.Dispose()

Write-Output "Saved $Out ($Width x $Height)"
