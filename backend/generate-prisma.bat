@echo off
echo Generating Prisma Client...
call npx prisma generate
echo.
echo Done! Prisma Client has been generated.
echo You can now run: npm run dev
pause

