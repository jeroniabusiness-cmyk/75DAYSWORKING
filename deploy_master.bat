@echo off
echo ===================================================
echo   HARD MODE 75 - ULTIMATE DEPLOYMENT
echo ===================================================
echo.
echo ===================================================
echo   PART 1: WEB DEPLOYMENT (VERCEL)
echo ===================================================
echo.
echo 1. Building Website...
call npx expo export --platform web 2>NUL
copy vercel.json dist\vercel.json >NUL
echo.
echo 2. Uploading to Internet...
echo    [ACTION REQUIRED] Log in if asked!
call npx vercel deploy dist --prod

echo.
echo ===================================================
echo   PART 2: ANDROID APP (APK)
echo ===================================================
echo.
set /p run_android="Do you want to generate the Android APK now? (y/n): "
if /i "%run_android%" neq "y" goto :end

echo.
echo 1. Logging into Expo (EAS)...
echo    [ACTION REQUIRED] Log in with your Expo account.
call npx eas-cli login

echo.
echo 2. Configure Project...
call npx eas-cli build:configure

echo.
echo 3. Building APK (Cloud Build)...
echo    This runs on Expo servers. It might take 10-20 mins.
echo    You will get a DOWNLOAD LINK when done.
call npx eas-cli build --platform android --profile preview --non-interactive

:end
echo.
echo ===================================================
echo   ALL TASKS COMPLETED.
echo ===================================================
pause
