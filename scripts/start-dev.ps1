param(
  [string]$HostName = '127.0.0.1',
  [int]$Port = 4200,
  [int]$MaxRetries = 5
)

$ErrorActionPreference = 'Stop'

function Unblock-EsbuildBinary {
  $esbuildPath = Join-Path $PSScriptRoot '..\node_modules\@esbuild\win32-x64\esbuild.exe'
  $resolvedPath = [System.IO.Path]::GetFullPath($esbuildPath)

  if (Test-Path $resolvedPath) {
    try { Unblock-File -Path $resolvedPath -ErrorAction SilentlyContinue } catch {}
    try { attrib -R $resolvedPath | Out-Null } catch {}
  }
}

function Is-RecentEpermFailure {
  $tempRoot = [System.IO.Path]::GetTempPath()
  $ngLogs = Get-ChildItem -Path $tempRoot -Directory -Filter 'ng-*' -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 6

  foreach ($folder in $ngLogs) {
    $logPath = Join-Path $folder.FullName 'angular-errors.log'
    if (Test-Path $logPath) {
      $content = Get-Content -Path $logPath -Raw -ErrorAction SilentlyContinue
      if ($content -match 'spawn EPERM') {
        return $true
      }
    }
  }

  return $false
}

$ngCmd = Join-Path $PSScriptRoot '..\node_modules\.bin\ng.cmd'
$ngCmd = [System.IO.Path]::GetFullPath($ngCmd)

if (!(Test-Path $ngCmd)) {
  Write-Error "Angular CLI nem talalhato: $ngCmd. Futtasd: npm install"
  exit 1
}

$nodeVersion = (& node -v).TrimStart('v')
$majorNode = [int]($nodeVersion.Split('.')[0])
if (($majorNode % 2) -eq 1) {
  Write-Error "Paratlan Node verzio fut ($nodeVersion). Ez okozza az EPERM hibakat. Telepits Node 22 vagy 20 LTS verziot, majd futtasd: npm install"
  exit 1
}

for ($attempt = 1; $attempt -le $MaxRetries; $attempt++) {
  Unblock-EsbuildBinary

  Write-Host "Dev szerver inditas (probalkozas $attempt/$MaxRetries): http://$HostName`:$Port" -ForegroundColor Cyan

  & $ngCmd serve --host $HostName --port $Port
  $exitCode = $LASTEXITCODE

  if ($exitCode -eq 0) {
    exit 0
  }

  if (Is-RecentEpermFailure) {
    Write-Warning "EPERM hiba tortent (esbuild). Ujra probalkozas 2 mp mulva..."
    Start-Sleep -Seconds 2
    continue
  }

  Write-Error "Az ng serve hibaval leallt (exit code: $exitCode)."
  exit $exitCode
}

Write-Error "A dev szerver $MaxRetries probalkozas utan sem indult el EPERM nelkul."
exit 1
