# Sends a virtual key to the running -game client.
#
# Focus first, then SendInput via keybd_event: posting straight to the window
# handle does not work, because Slate reads the keyboard through the raw input
# queue rather than the window message it would receive.
param(
    [Parameter(Mandatory = $true)][byte]$VirtualKey,
    [string]$ProcessName = "UnrealEditor-Cmd"
)

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class Win32SendKey
{
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
}
"@

$Process = Get-Process -Name $ProcessName -ErrorAction Stop |
    Where-Object { $_.MainWindowHandle -ne 0 } |
    Select-Object -First 1

if (-not $Process) {
    throw "No $ProcessName window is open yet."
}

[void][Win32SendKey]::SetForegroundWindow($Process.MainWindowHandle)
Start-Sleep -Milliseconds 800

[Win32SendKey]::keybd_event($VirtualKey, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 90
[Win32SendKey]::keybd_event($VirtualKey, 0, 2, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 900
