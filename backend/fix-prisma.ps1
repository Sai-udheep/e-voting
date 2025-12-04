# Fix Prisma Client Generation
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`nChecking migration status..." -ForegroundColor Yellow
npx prisma migrate status

Write-Host "`nIf migrations are pending, creating migration..." -ForegroundColor Yellow
npx prisma migrate dev --name add_elections_candidates_votes

Write-Host "`nDone! You can now restart your server." -ForegroundColor Green

