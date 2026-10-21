param([Parameter(Mandatory=$true)][uri]$BaseURL)
$ErrorActionPreference = 'Stop'
if ($BaseURL.Scheme -ne 'https' -or $BaseURL.Host -eq 'example.org') { throw 'Provide the real HTTPS site URL.' }
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
    & '.\.tools\hugo\hugo.exe' --gc --minify --baseURL $BaseURL.AbsoluteUri
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
} finally { Pop-Location }
