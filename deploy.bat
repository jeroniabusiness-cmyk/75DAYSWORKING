@echo off
echo ===================================================
echo   HARD MODE 75 - WEB DEPLOYMENT
echo ===================================================
echo.
echo [1/3] Building Web App...
call npx expo export --platform web 2>NUL
if %errorlevel% neq 0 (
    echo Build failed!
    exit /b %errorlevel%
)

echo.
echo [2/3] Configuring...
copy vercel.json dist\vercel.json >NUL

echo.
echo [3/3] Deploying to Vercel...
echo    NOTE: If asked to log in, please follow the prompts!
echo.
call npx vercel deploy dist --prod

echo.
echo ===================================================
echo   Deployment Complete!
echo ===================================================
