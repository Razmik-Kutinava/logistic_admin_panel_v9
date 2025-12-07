# Script to check Supabase connection
Write-Host "Checking Supabase connection..." -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Create .env file with DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: .env file found" -ForegroundColor Green

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$dbUrl = $env:DATABASE_URL

if (-not $dbUrl) {
    Write-Host "ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "OK: DATABASE_URL found" -ForegroundColor Green

# Check URL format
if ($dbUrl -notmatch '^postgresql://') {
    Write-Host "ERROR: Wrong DATABASE_URL format. Must start with 'postgresql://'" -ForegroundColor Red
    exit 1
}

# Check port
if ($dbUrl -match ':6543/') {
    Write-Host "WARNING: Using port 6543 (pooler)!" -ForegroundColor Yellow
    Write-Host "For migrations use port 5432 (direct connection)" -ForegroundColor Yellow
    Write-Host "Current URL: $dbUrl" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Fix: Change port from 6543 to 5432 in .env file" -ForegroundColor Cyan
}

if ($dbUrl -match ':5432/') {
    Write-Host "OK: Using correct port 5432 (direct connection)" -ForegroundColor Green
}

# Check if password exists
if ($dbUrl -match 'postgres://postgres:@' -or $dbUrl -match 'postgresql://postgres:@') {
    Write-Host "ERROR: Password missing in DATABASE_URL!" -ForegroundColor Red
    Write-Host "Format: postgresql://postgres:[PASSWORD]@..." -ForegroundColor Yellow
    exit 1
}

# Check sslmode
if ($dbUrl -notmatch 'sslmode=require') {
    Write-Host "WARNING: sslmode=require missing!" -ForegroundColor Yellow
    Write-Host "Supabase requires SSL connection" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Attempting connection..." -ForegroundColor Cyan
Write-Host "Running: npx prisma db push" -ForegroundColor Gray
npx prisma db push 2>&1 | Tee-Object -Variable output

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Connection successful!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Connection failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "1. Wrong password - check in Supabase Dashboard" -ForegroundColor White
    Write-Host "2. Special characters in password not encoded (see FIX_AUTHENTICATION.md)" -ForegroundColor White
    Write-Host "3. Using pooler (port 6543) instead of direct connection (port 5432)" -ForegroundColor White
    Write-Host ""
    Write-Host "Current DATABASE_URL (password hidden):" -ForegroundColor Cyan
    $hiddenUrl = $dbUrl -replace '://postgres:[^@]+@', '://postgres:***@'
    Write-Host $hiddenUrl -ForegroundColor Gray
}

