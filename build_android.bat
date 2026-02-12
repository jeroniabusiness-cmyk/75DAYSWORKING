@echo off
echo ===================================================
echo   BUILDING ANDROID APP (APK)
echo ===================================================
echo.
echo This will generate a downloadable .apk file.
echo.
echo 1. Logging in to Expo...
call npx eas-cli login

echo.
echo 2. Starting Cloud Build...
echo    (This takes 10-15 minutes on Expo servers)
echo.
call npx eas-cli build --platform android --profile preview --non-interactive

echo.
echo ===================================================
echo   Once finished, the DOWNLOAD LINK will appear above.
echo ===================================================
pause
