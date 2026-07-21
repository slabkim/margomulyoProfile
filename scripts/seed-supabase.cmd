@echo off
setlocal
cd /d "%~dp0\.."
set SUPABASE_TELEMETRY_DISABLED=1

echo.
echo ============================================
echo   SEED DATA DUMMY DESA Margomulyo
echo ============================================
echo.
echo Data yang akan ditambahkan:
echo - 5 berita (4 terbit, 1 draf)
echo - 5 item galeri
echo - 10 data statistik
echo.
set /p CONFIRM="Tambahkan data dummy ke database remote? (Y/N): "
if /I not "%CONFIRM%"=="Y" goto :cancelled

echo.
echo Menjalankan seeder...
call npx.cmd supabase db query --linked --file supabase/seed.sql
if errorlevel 1 goto :error

echo.
echo Seeder berhasil. Data dummy sudah tersedia.
exit /b 0

:cancelled
echo Seeder dibatalkan.
exit /b 0

:error
echo Seeder gagal. Pastikan project sudah dihubungkan melalui npm run db:migrate.
exit /b 1
