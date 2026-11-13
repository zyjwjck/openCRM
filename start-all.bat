@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

REM ============================================
REM  openCRM - one-click launcher (Windows)
REM  Starts: Django backend + SvelteKit frontend + nanobot AI + MCP server
REM  Each service runs in its own window (close that window to stop it).
REM ============================================

cd /d "%~dp0"

set "VENV_PYTHON=%~dp0.openCRM-venv\Scripts\python.exe"

echo.
echo ============================================
echo   openCRM - Starting all services...
echo ============================================
echo.

REM ---------- 0. ensure nanobot env dir (under .nanobot) ----------
if not exist "%~dp0.nanobot\workspace" mkdir "%~dp0.nanobot\workspace"

REM ---------- 1. Django Backend (blue window) ----------
echo [1/4] Starting Django Backend on port 8000...
start "openCRM - Backend (Django :8000)" cmd /k "color 1F && cd /d ""%~dp0backend"" && if exist ""%VENV_PYTHON%"" ( ""%VENV_PYTHON%"" manage.py runserver ) else ( echo ERROR: .openCRM-venv not found. & echo Run: python -m venv .openCRM-venv & echo Then: .openCRM-venv\Scripts\activate & echo Then: pip install -r requirements.txt & pause )"

timeout /t 2 /nobreak >nul

REM ---------- 2. openCRM MCP Server (teal window) ----------
REM HTTP mode on :8100; nanobot connects via streamableHTTP
echo [2/4] Starting openCRM MCP Server on port 8100...
start "openCRM - MCP Server (:8100)" cmd /k "color 3B && cd /d ""%~dp0Agent\mcp"" && if exist ""%VENV_PYTHON%"" ( echo MCP endpoint: http://127.0.0.1:8100/mcp & echo Tools: 20 tools (Lead CRUD + Kanban + Pipeline + Auth) & ""%VENV_PYTHON%"" opencrm_server.py --http ) else ( echo ERROR: venv not found. & pause )"

timeout /t 2 /nobreak >nul

REM ---------- 3. SvelteKit Frontend (green window) ----------
REM Auto-detect Node.js from PATH, then common install locations.
echo [3/4] Starting SvelteKit Frontend on port 5173...
set "NODE_FOUND=0"
where node >nul 2>nul && set "NODE_FOUND=1"
if %NODE_FOUND%==0 if exist "C:\Program Files\nodejs\node.exe" ( set "PATH=C:\Program Files\nodejs;%PATH%" & set "NODE_FOUND=1" )
if %NODE_FOUND%==0 if exist "D:\nodejs\node.exe" ( set "PATH=D:\nodejs;%PATH%" & set "NODE_FOUND=1" )
if %NODE_FOUND%==0 if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" ( set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%" & set "NODE_FOUND=1" )
start "openCRM - Frontend (SvelteKit :5173)" cmd /k "color 2F && cd /d ""%~dp0frontend"" && where node >nul 2>nul && ( if exist node_modules ( npm run dev ) else ( echo WARNING: node_modules missing, running npm install first... & npm install & npm run dev ) ) || ( echo ERROR: Node.js not found. & echo Install Node.js (https://nodejs.org) or add its install dir to PATH. & pause )"

timeout /t 2 /nobreak >nul

REM ---------- wait for MCP server to be ready (prevents "Connection failed") ----------
echo Waiting for openCRM MCP Server on :8100 ...
set "MCP_READY=0"
for /L %%i in (1,1,40) do (
  powershell -NoProfile -Command "try { (New-Object System.Net.Sockets.TcpClient).Connect('127.0.0.1', 8100); exit 0 } catch { exit 1 }" >nul 2>&1
  if !ERRORLEVEL! EQU 0 (
    set "MCP_READY=1"
    goto :mcp_ready
  )
  timeout /t 1 /nobreak >nul
)
echo   WARNING: MCP server not reachable on :8100 after 40s. nanobot may show "Connection failed".
:mcp_ready
if !MCP_READY! EQU 1 echo   MCP server is up - nanobot will connect.

REM ---------- 4. nanobot AI Agent (purple window) ----------
REM Uses project config .nanobot\nanobot.config.json (openCRM MCP + SSRF allowlist preset)
REM NANOBOT_WORKSPACE is set explicitly so the workspace path is portable (no hardcoded drive).
echo [4/4] Starting nanobot AI Agent (gateway) on port 8765...
start "openCRM - AI Agent (nanobot :8765)" cmd /k "color 5F && set "NANOBOT_HOME=%~dp0.nanobot" && set "NANOBOT_WORKSPACE=%~dp0.nanobot\workspace" && cd /d ""%~dp0Agent\nanobot-main"" && if exist ""%~dp0.openCRM-venv\Scripts\nanobot.exe"" ( echo NANOBOT_HOME: %~dp0.nanobot & echo Config: %~dp0.nanobot\nanobot.config.json & echo openCRM MCP: http://127.0.0.1:8100/mcp & ""%~dp0.openCRM-venv\Scripts\nanobot.exe"" gateway -c ""%~dp0.nanobot\nanobot.config.json"" ) else ( echo ERROR: nanobot not installed. & echo Run: cd Agent\nanobot-main & echo Then: %~dp0.openCRM-venv\Scripts\python.exe -m pip install -e . & pause )"

echo.
echo ============================================
echo   All services launched!
echo ============================================
echo.
echo   CRM UI            http://localhost:5173
echo   CRM + AI          http://localhost:5173/agent
echo   Django API        http://localhost:8000/swagger-ui/
echo   Django Admin      http://localhost:8000/admin/
echo   nanobot UI        http://127.0.0.1:8765
echo   openCRM MCP       http://127.0.0.1:8100/mcp
echo.
echo   Login: admin@example.com  /  testpass123
echo.
echo   Stop a service by closing its window.
echo   This window can be closed; services keep running.
echo.
pause
