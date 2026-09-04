# Restart CISEM FastAPI Backend on Port 8000
$pids = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($pids) {
    Write-Host "Stopping legacy backend process(es): $pids" -ForegroundColor Yellow
    foreach ($p in $pids) {
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "No active process on Port 8000." -ForegroundColor Green
}

Write-Host "Starting new FastAPI backend process..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m uvicorn src.backend.main:app --port 8000 --reload" -WorkingDirectory "c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\backend" -WindowStyle Minimized
Start-Sleep -Seconds 4

$newConn = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
$newPid = if ($newConn) { ($newConn | Select-Object -ExpandProperty OwningProcess -Unique) -join ', ' } else { "UNKNOWN" }

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "BACKEND RESTART COMPLETE:" -ForegroundColor Green
Write-Host "  · ACTIVE LISTEN PID(s) : $newPid" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
