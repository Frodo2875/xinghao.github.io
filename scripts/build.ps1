param([Parameter(Mandatory=$true)][uri]$BaseURL)
$ErrorActionPreference = 'Stop'
if ($BaseURL.Scheme -ne 'https' -or $BaseURL.Host -eq 'example.org') { throw 'Provide the real HTTPS site URL.' }
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
    # Hugo GitInfo needs unquoted Unicode paths for Chinese article folders.
    & git config --local core.quotepath false
    if ($LASTEXITCODE -ne 0) { throw 'Git timestamp configuration failed.' }
    & '.\.tools\hugo\hugo.exe' --gc --minify --baseURL $BaseURL.AbsoluteUri
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
} finally { Pop-Location }
