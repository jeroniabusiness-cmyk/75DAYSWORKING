@echo off
echo ===================================================
echo   Switching Vercel Account
echo ===================================================
echo.
echo 1. Logging out of current account...
call npx vercel logout
echo.
echo 2. Starting fresh setup...
echo    (You will be asked to log in again)
echo.
call setup_deploy.bat
