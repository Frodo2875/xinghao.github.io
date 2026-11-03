param([switch]$Drafts)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
    # Hugo GitInfo needs unquoted Unicode paths for Chinese article folders.
    & git config --local core.quotepath false
    if ($LASTEXITCODE -ne 0) { throw 'Git timestamp configuration failed.' }
    $hugoPath = Join-Path $projectRoot '.tools/hugo/hugo.exe'
    if (!(Test-Path $hugoPath)) { throw 'Run scripts/setup.ps1 first.' }
    $hugoArgs = @('server', '--bind', '127.0.0.1', '--baseURL', 'http://localhost:1313/', '--disableFastRender')
    if ($Drafts) { $hugoArgs += '-D' }
    & $hugoPath @hugoArgs
    if ($LASTEXITCODE -ne 0) { throw 'Preview failed.' }
} finally { Pop-Location }
