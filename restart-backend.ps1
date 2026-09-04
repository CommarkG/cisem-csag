# Restart CISEM FastAPI Backend on Port 8000
$oldConn = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
$oldPid = if ($oldConn) { $oldConn.OwningProcess } else { "NONE" }

Write-Host "Stopping legacy backend process (PID: $oldPid)..." -ForegroundColor Yellow
if ($oldConn) {
    Stop-Process -Id $oldConn.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "Starting new FastAPI backend process..." -ForegroundColor Yellow
Start-Process -FilePath "uv" -ArgumentList "run uvicorn src.backend.main:app --port 8000 --reload" -WorkingDirectory "c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\backend" -WindowStyle Minimized
Start-Sleep -Seconds 4

$newConn = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
$newPid = if ($newConn) { $newConn.OwningProcess } else { "UNKNOWN" }

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "BACKEND RESTART COMPLETE:" -ForegroundColor Green
Write-Host "  · BEFORE PID : $oldPid" -ForegroundColor Red
Write-Host "  · AFTER PID  : $newPid" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
