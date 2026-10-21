$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
    $version = (Get-Content '.hugo-version' -Raw).Trim()
    $archiveName = "hugo_extended_${version}_windows-amd64.zip"
    $releaseUrl = "https://github.com/gohugoio/hugo/releases/download/v$version"
    New-Item -ItemType Directory -Force '.tools/hugo' | Out-Null
    Invoke-WebRequest -UseBasicParsing "$releaseUrl/$archiveName" -OutFile ".tools/$archiveName"
    Invoke-WebRequest -UseBasicParsing "$releaseUrl/hugo_${version}_checksums.txt" -OutFile '.tools/checksums.txt'
    $checksumLine = Get-Content '.tools/checksums.txt' | Where-Object { ($_ -split '\s+')[-1] -eq $archiveName }
    if (!$checksumLine -or (Get-FileHash ".tools/$archiveName" -Algorithm SHA256).Hash -ne ($checksumLine -split '\s+')[0]) {
        throw 'Hugo SHA256 verification failed.'
    }
    Expand-Archive -LiteralPath ".tools/$archiveName" -DestinationPath '.tools/hugo' -Force
    git submodule update --init --recursive
    if ($LASTEXITCODE -ne 0) { throw 'Theme initialization failed.' }
    & '.\.tools\hugo\hugo.exe' version
} finally { Pop-Location }
