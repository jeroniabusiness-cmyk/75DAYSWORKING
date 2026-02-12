@echo off
echo ===================================================
echo   DESTRUCTIVE ACTION: REMOVING PROJECT
echo ===================================================
echo.
echo 1. Removing Vercel Project (Taking down website)...
call npx vercel project remove hard-mode-75 --yes
call npx vercel remove --yes

echo.
echo 2. Logging out...
call npx vercel logout

echo.
echo 3. Deleting Local Files...
echo    WARNING: This deletes source code in this folder.
rmdir /s /q app
rmdir /s /q components
rmdir /s /q hooks
rmdir /s /q constants
rmdir /s /q scripts
rmdir /s /q utils
rmdir /s /q .expo
rmdir /s /q .vercel
rmdir /s /q dist
del /q *.json
del /q *.js
del /q *.ts
del /q *.tsx
del /q *.bat
del /q *.md
del /q *.txt

echo.
echo ===================================================
echo   CLEANUP COMPLETE.
echo   You can now start fresh.
echo ===================================================
pause
