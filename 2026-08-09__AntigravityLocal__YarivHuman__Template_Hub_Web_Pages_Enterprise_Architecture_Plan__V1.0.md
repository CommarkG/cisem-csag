$configPath = "$env:USERPROFILE\.gemini\antigravity-cli\settings.json"
if (Test-Path $configPath) {
    (Get-Content $configPath) -replace '"useAiCredits": true', '"useAiCredits": false' | Set-Content $configPath
    Write-Host "Updated Antigravity CLI configuration to disable AI Credits mode." -ForegroundColor Green
} else {
    Write-Host "Config file not found, creating clean settings..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path (Split-Path $configPath)
    '{"useAiCredits": false}' | Out-File -FilePath $configPath -Encoding utf8
}

