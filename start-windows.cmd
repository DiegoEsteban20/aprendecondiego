@echo off
cd /d "%~dp0"
node --version >nul 2>&1
if errorlevel 1 (
  echo Instala Node.js 22 o posterior y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
echo Abre http://127.0.0.1:3000 en tu navegador.
node server.js
pause
