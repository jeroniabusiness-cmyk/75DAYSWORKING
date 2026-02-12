@echo off
echo ===================================================
echo   FULL WEB DEPLOYMENT SETUP (v2)
echo ===================================================
echo.
echo [Step 1/5] Building your app...
call npx expo export --platform web
if %errorlevel% neq 0 (
    echo Build failed! 
    pause
    exit /b %errorlevel%
)

echo.
echo [Step 2/5] configuring Vercel...
copy vercel.json dist\vercel.json

echo.
echo [Step 3/5] Logging into Vercel...
echo    (If a browser opens, please log in)
call npx vercel login
if %errorlevel% neq 0 (
    echo Login failed! 
    pause
    exit /b %errorlevel%
)

echo.
echo [Step 4/5] Linking Project...
echo    (Press ENTER to accept all defaults)
call npx vercel link
if %errorlevel% neq 0 (
    echo Linking failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [Step 5/5] Deploying to Production...
call npx vercel deploy dist --prod

echo.
echo ===================================================
echo   SUCCESS! 
echo   Your app should now be working.
echo   Check the URL above (under "Production")
echo ===================================================
pause
