@echo off
setlocal
cd /d "%~dp0\.."
set SUPABASE_TELEMETRY_DISABLED=1

echo.
echo ============================================
echo   MIGRASI DATABASE DESA MARGO MULYO
echo ============================================
echo.
echo Project: gwmhopqlfvmjkxzthqya
echo.

echo [1/4] Login ke Supabase...
call npx.cmd supabase login
if errorlevel 1 goto :error

echo.
echo [2/4] Menghubungkan project remote...
call npx.cmd supabase link --project-ref gwmhopqlfvmjkxzthqya
if errorlevel 1 goto :error

echo.
echo [3/4] Memeriksa migration yang akan dijalankan...
call npx.cmd supabase db push --dry-run
if errorlevel 1 goto :error

echo.
set /p CONFIRM="Jalankan migration ke database remote? (Y/N): "
if /I not "%CONFIRM%"=="Y" goto :cancelled

echo.
echo [4/4] Menjalankan migration...
call npx.cmd supabase db push
if errorlevel 1 goto :error

echo.
echo ============================================
echo   MIGRASI BERHASIL
echo ============================================
echo Selanjutnya buat user di Supabase Authentication,
echo lalu daftarkan UUID-nya ke tabel admin_users.
echo.
exit /b 0

:cancelled
echo.
echo Migration dibatalkan. Database tidak diubah.
exit /b 0

:error
echo.
echo Migration gagal. Periksa pesan error di atas.
exit /b 1
