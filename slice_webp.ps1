Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

$inputFile = (Get-Item "1787637120542_0.webp").FullName
$outputDir = Join-Path (Get-Location) "assets"
if (-not (Test-Path $outputDir)) { 
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null 
}

try {
    $uri = New-Object System.Uri($inputFile)
    $decoder = [System.Windows.Media.Imaging.BitmapDecoder]::Create($uri, [System.Windows.Media.Imaging.BitmapCreateOptions]::None, [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
    $frame = $decoder.Frames[0]

    $w = $frame.PixelWidth
    $h = $frame.PixelHeight
    Write-Host "Loaded WebP Image: $w x $h"

    function Export-Crop {
        param(
            [double]$cropX,
            [double]$cropY,
            [double]$cropW,
            [double]$cropH,
            [string]$filename
        )
        $rect = New-Object System.Windows.Int32Rect([int]$cropX, [int]$cropY, [int]$cropW, [int]$cropH)
        $cropped = New-Object System.Windows.Media.Imaging.CroppedBitmap($frame, $rect)
        
        $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
        $bmFrame = [System.Windows.Media.Imaging.BitmapFrame]::Create($cropped)
        $encoder.Frames.Add($bmFrame)
        
        $outPath = Join-Path $outputDir $filename
        $stream = [System.IO.File]::Create($outPath)
        $encoder.Save($stream)
        $stream.Close()
        Write-Host "Saved asset: $filename ($cropW x $cropH)"
    }

    # 1. Hero Building
    Export-Crop ($w * 0.35) 0 ($w * 0.65) ($h * 0.22) "hero_building.png"

    # 2. Interior Living Room
    Export-Crop ($w * 0.42) ($h * 0.32) ($w * 0.58) ($h * 0.14) "interior_living.png"

    # 3. Map Location
    Export-Crop 0 ($h * 0.55) ($w * 0.52) ($h * 0.14) "location_map.png"

    # 4. Floor Plans
    Export-Crop ($w * 0.17) ($h * 0.725) ($w * 0.17) ($h * 0.08) "flat_a.png"
    Export-Crop ($w * 0.47) ($h * 0.725) ($w * 0.17) ($h * 0.08) "flat_b.png"
    Export-Crop ($w * 0.77) ($h * 0.725) ($w * 0.19) ($h * 0.08) "flat_c.png"

    # 5. Cherry Blossom Banner
    Export-Crop 0 ($h * 0.81) ($w * 0.55) ($h * 0.07) "cherry_blossom.png"

    Write-Host "SUCCESS: All 7 image assets generated in assets/ folder!"
} catch {
    Write-Error $_.Exception.Message
}
