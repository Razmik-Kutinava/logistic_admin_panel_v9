# Script to fix .env file - change port from 6543 to 5432
Write-Host "Fixing .env file..." -ForegroundColor Cyan

if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    exit 1
}

$content = Get-Content .env -Raw
$originalContent = $content

# Replace port 6543 with 5432
$content = $content -replace ':6543/', ':5432/'
$content = $content -replace ':6543"', ':5432"'
$content = $content -replace ':6543$', ':5432'

# Remove pgbouncer parameter if exists (not needed for direct connection)
$content = $content -replace '&pgbouncer=true', ''
$content = $content -replace '\?pgbouncer=true', '?'

if ($content -ne $originalContent) {
    Set-Content .env -Value $content -NoNewline
    Write-Host "OK: .env file updated!" -ForegroundColor Green
    Write-Host "Changed port from 6543 to 5432" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "New DATABASE_URL:" -ForegroundColor Cyan
    ($content -split "`n" | Where-Object { $_ -match 'DATABASE_URL' }) -replace '://postgres:[^@]+@', '://postgres:***@'
} else {
    Write-Host "No changes needed. Port is already 5432 or different format." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Now try: npx prisma db push" -ForegroundColor Cyan

