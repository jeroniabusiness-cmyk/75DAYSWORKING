@echo off
echo ===================================================
echo   FINDING YOUR LINK...
echo ===================================================
echo.
call npx vercel list --prod
echo.
echo ===================================================
echo   If you see a URL above, that is it!
echo   If it says "No deployments found", then the
echo   deployment didn't finish correctly.
echo ===================================================
pause
