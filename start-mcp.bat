@echo off
setlocal
chcp 65001 >nul

REM ============================================
REM  openCRM - MCP server launcher (standalone)
REM  Use this if you start nanobot manually (e.g. `nanobot webui`)
REM  so the openCRM-MCP tools are available. start-all.bat already
REM  starts this server for you.
REM ============================================

cd /d "%~dp0"
set "VENV_PYTHON=%~dp0.openCRM-venv\Scripts\python.exe"

if not exist "%VENV_PYTHON%" (
  echo ERROR: .openCRM-venv not found.
  echo        Run the backend setup first: python -m venv .openCRM-venv
  echo        then: .openCRM-venv\Scripts\activate ^& pip install -r requirements.txt
  pause
  exit /b 1
)

echo Starting openCRM MCP Server on http://127.0.0.1:8100/mcp ...
echo (Close this window to stop it. Requires the Django backend on :8000)
"%VENV_PYTHON%" Agent/mcp/opencrm_server.py --http
