# CISEM Platform Unified Single-Line Service Launcher v1.0
Set-Location "c:\Users\finky\Desktop\AntiGravity\Cisem CsAg"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  CISEM PLATFORM UNIFIED LAUNCHER v1.0" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Start Backend on Port 8000 if not listening
$backendPort = 8000
$backendCheck = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue
if (-not $backendCheck) {
    Write-Host "[+] Starting Backend (FastAPI on Port 8000)..." -ForegroundColor Yellow
    Start-Process -FilePath "uv" -ArgumentList "run uvicorn src.backend.main:app --port 8000 --reload" -WorkingDirectory "c:\Users\finky\Desktop\AntiGravity\Cisem CsAg\backend" -WindowStyle Minimized
    Start-Sleep -Seconds 2
} else {
    Write-Host "[✓] Backend already listening on Port 8000." -ForegroundColor Green
}

# 2. Start Frontend on Port 3000 if not listening
$frontendPort = 3000
$frontendCheck = Get-NetTCPConnection -LocalPort $frontendPort -State Listen -ErrorAction SilentlyContinue
if (-not $frontendCheck) {
    Write-Host "[+] Starting Frontend (Next.js on Port 3000)..." -ForegroundColor Yellow
    Start-Process -FilePath "npx" -ArgumentList "next dev -p 3000" -WorkingDirectory "c:\Users\finky\Desktop\AntiGravity\Cisem CsAg" -WindowStyle Minimized
    Start-Sleep -Seconds 3
} else {
    Write-Host "[✓] Frontend already listening on Port 3000." -ForegroundColor Green
}

Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host "ACTIVE SERVICE STATUS:" -ForegroundColor White
Write-Host "  · Backend API : http://localhost:8000 (Port 8000)" -ForegroundColor Cyan
Write-Host "  · Frontend UI  : http://localhost:3000/?tab=quote_builder (Port 3000)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Green
