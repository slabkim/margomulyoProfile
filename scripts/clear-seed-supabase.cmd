@echo off
setlocal
cd /d "%~dp0\.."
set SUPABASE_TELEMETRY_DISABLED=1

echo.
echo ============================================
echo   HAPUS DATA DUMMY DESA Margomulyo
echo ============================================
echo.
echo Perintah ini hanya menghapus data dengan UUID dummy bawaan seeder.
set /p CONFIRM="Hapus seluruh data dummy? (Y/N): "
if /I not "%CONFIRM%"=="Y" goto :cancelled

call npx.cmd supabase db query --linked --file supabase/clear-seed.sql
if errorlevel 1 goto :error

echo Data dummy berhasil dihapus.
exit /b 0

:cancelled
echo Penghapusan dibatalkan.
exit /b 0

:error
echo Penghapusan gagal. Pastikan project sudah terhubung.
exit /b 1
