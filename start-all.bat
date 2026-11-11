@echo off
setlocal
chcp 65001 >nul

REM ============================================
REM  openCRM v0.05 一键启动脚本 (Windows)
REM  启动: Django后端 + 自动拉起 MCP Server + SvelteKit前端 + nanobot AI
REM  nanobot 配置: 项目根 .nanobot/config.json（已预置 openCRM MCP）
REM ============================================

cd /d "%~dp0"

set "VENV_PYTHON=%~dp0.openCRM-venv\Scripts\python.exe"

echo.
echo ============================================
echo   openCRM v0.05 - Starting all services...
echo ============================================
echo.

REM ---------- 1. Django Backend + 自动 MCP Server (Blue window) ----------
REM manage.py 会自动在 runserver 时拉起 backend/mcp/opencrm_server.py --http
echo [1/3] Starting Django Backend + MCP on port 8000/8001...
start "openCRM - Django + MCP (:8000 + :8001)" cmd /k "color 1F && cd /d ""%~dp0backend"" && if exist ""%VENV_PYTHON%"" ( echo Using venv: %VENV_PYTHON% && echo Django:  http://127.0.0.1:8000 && echo MCP:     http://127.0.0.1:8001/mcp && echo. && ""%VENV_PYTHON%"" manage.py runserver ) else ( echo ERROR: Virtual environment .openCRM-venv not found! && echo Run: python -m venv .openCRM-venv ^&^& .openCRM-venv\Scripts\activate ^&^& pip install -r requirements.txt && pause )"

timeout /t 3 /nobreak >nul

REM ---------- 2. SvelteKit Frontend (Green window) ----------
echo [2/3] Starting SvelteKit Frontend on port 5173...
start "openCRM - Frontend (SvelteKit :5173)" cmd /k "color 2F && cd /d ""%~dp0frontend"" && set ""PATH=D:\nodejs;%PATH%"" && if exist node_modules ( echo node_modules found ) else ( echo WARNING: node_modules missing, run npm install first. ) && where npm >nul 2>nul && npm run dev || ( echo ERROR: Node.js not found! Install Node.js and add to PATH, or set D:\nodejs && pause )"

timeout /t 2 /nobreak >nul

REM ---------- 3. nanobot AI Agent (Purple window) ----------
REM 读取 .nanobot/config.json（项目根，已预置 openCRM MCP + SSRF 白名单）
echo [3/3] Starting nanobot AI Agent (gateway) on port 8765...
start "openCRM - AI Agent (nanobot :8765)" cmd /k "color 5F && cd /d ""%~dp0"" && if exist ""%~dp0.openCRM-venv\Scripts\nanobot.exe"" ( echo Using venv nanobot && echo Config:  %~dp0.nanobot\config.json && echo openCRM MCP: http://127.0.0.1:8001/mcp && ""%~dp0.openCRM-venv\Scripts\nanobot.exe"" gateway ) else ( echo ERROR: nanobot not installed. && echo Run: cd Agent\nanobot-main ^&^& %~dp0.openCRM-venv\Scripts\python.exe -m pip install -e . && pause )"

echo.
echo ============================================
echo   All services launched!
echo ============================================
echo.
echo   CRM 主界面       http://localhost:5173
echo   CRM + AI 集成    http://localhost:5173/agent
echo   Django API       http://localhost:8000/swagger-ui/
echo   Django Admin     http://localhost:8000/admin/
echo   nanobot 独立 UI   http://127.0.0.1:8765
echo   openCRM MCP      http://127.0.0.1:8001/mcp
echo.
echo   登录: admin@example.com  /  testpass123
echo.
echo   关闭方式: 逐个关闭各服务窗口。
echo   本窗口关闭不影响已启动的服务。
echo.
pause
