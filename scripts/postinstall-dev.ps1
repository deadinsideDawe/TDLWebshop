$ErrorActionPreference = 'Stop'

$esbuildPath = Join-Path $PSScriptRoot '..\node_modules\@esbuild\win32-x64\esbuild.exe'
$resolvedPath = [System.IO.Path]::GetFullPath($esbuildPath)

if (Test-Path $resolvedPath) {
  try { Unblock-File -Path $resolvedPath -ErrorAction SilentlyContinue } catch {}
  try { attrib -R $resolvedPath | Out-Null } catch {}
  Write-Host "esbuild binary ellenorizve/feloldva: $resolvedPath" -ForegroundColor Green
} else {
  Write-Host "esbuild binary nem talalhato (ez normalis lehet install kozben)." -ForegroundColor Yellow
}
