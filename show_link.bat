@echo off
echo ===================================================
echo   Finding your App URL...
echo ===================================================
echo.
echo Your active deployments:
call npx vercel list --prod
echo.
echo ===================================================
echo   Copy the URL under "AGE" or "URL" above.
echo   It should look like: hard-mode-75-xyz.vercel.app
echo ===================================================
pause
