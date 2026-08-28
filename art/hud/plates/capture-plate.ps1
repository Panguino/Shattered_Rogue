# Captures the running -game client window to a PNG.
#
# The client is a borderless window on a per-monitor DPI display, so the shot is
# taken from screen coordinates after the process is marked DPI aware: grabbing
# the window DC directly returns a scaled, blurry surface.
param(
    [string]$Out = "$PSScriptRoot\plate.png",
    [string]$ProcessName = "UnrealEditor-Cmd"
)

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class Win32Capture
{
    [DllImport("user32.dll")]
    public static extern bool SetProcessDPIAware();

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern bool MoveWindow(
        IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

[void][Win32Capture]::SetProcessDPIAware()

$Process = Get-Process -Name $ProcessName -ErrorAction Stop |
    Where-Object { $_.MainWindowHandle -ne 0 } |
    Select-Object -First 1

if (-not $Process) {
    throw "No $ProcessName window is open yet."
}

# CopyFromScreen reads whatever pixels occupy the rect, so a client that stayed
# behind another window yields a plate of that window instead. Windows also
# refuses focus changes requested from a background shell, so restore, ask, and
# confirm before trusting the screen.
$Foreground = [IntPtr]::Zero
for ($Attempt = 0; $Attempt -lt 5; $Attempt++) {
    [void][Win32Capture]::ShowWindow($Process.MainWindowHandle, 9)
    [void][Win32Capture]::SetForegroundWindow($Process.MainWindowHandle)
    Start-Sleep -Milliseconds 600
    $Foreground = [Win32Capture]::GetForegroundWindow()
    if ($Foreground -eq $Process.MainWindowHandle) {
        break
    }
}

if ($Foreground -ne $Process.MainWindowHandle) {
    throw "$ProcessName never reached the foreground; the plate would show another window. Click the client and retry."
}

# A 1920x1080 client is larger than some of this desk's monitors once DPI
# scaling is applied, so the launcher can place it straddling a monitor edge.
# The parts hanging off the desktop come back as blank, and whatever sits on the
# neighbouring display bleeds into the rest. Park it on a screen that fits.
$Bounds = New-Object Win32Capture+RECT
[void][Win32Capture]::GetWindowRect($Process.MainWindowHandle, [ref]$Bounds)
$WindowWidth = $Bounds.Right - $Bounds.Left
$WindowHeight = $Bounds.Bottom - $Bounds.Top

$Contains = [System.Windows.Forms.Screen]::AllScreens | Where-Object {
    $Bounds.Left -ge $_.Bounds.Left -and $Bounds.Top -ge $_.Bounds.Top -and
    $Bounds.Right -le $_.Bounds.Right -and $Bounds.Bottom -le $_.Bounds.Bottom
}

if (-not $Contains) {
    $Host_ = [System.Windows.Forms.Screen]::AllScreens |
        Where-Object {
            $_.Bounds.Width -ge $WindowWidth -and $_.Bounds.Height -ge $WindowHeight
        } |
        Select-Object -First 1

    if (-not $Host_) {
        throw "No monitor can contain the ${WindowWidth}x${WindowHeight} client. Launch with a smaller -ResX/-ResY."
    }

    [void][Win32Capture]::MoveWindow(
        $Process.MainWindowHandle,
        $Host_.Bounds.Left,
        $Host_.Bounds.Top,
        $WindowWidth,
        $WindowHeight,
        $true)
    [void][Win32Capture]::SetForegroundWindow($Process.MainWindowHandle)
    Start-Sleep -Milliseconds 900
}

$Rect = New-Object Win32Capture+RECT
[void][Win32Capture]::GetWindowRect($Process.MainWindowHandle, [ref]$Rect)

$Width = $Rect.Right - $Rect.Left
$Height = $Rect.Bottom - $Rect.Top
$Bitmap = New-Object System.Drawing.Bitmap $Width, $Height
$Graphics = [System.Drawing.Graphics]::FromImage($Bitmap)
$Graphics.CopyFromScreen($Rect.Left, $Rect.Top, 0, 0, $Bitmap.Size)
$Bitmap.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$Graphics.Dispose()
$Bitmap.Dispose()

Write-Output "Saved $Out ($Width x $Height)"
