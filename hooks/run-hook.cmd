@echo off
REM Cross-platform hook runner using Node.js
if "%~1"=="" exit /b 1
set "HOOK_NAME=%~1"
set "SCRIPT_DIR=%~dp0"

REM Convert .sh to .cjs
set "JS_SCRIPT=%HOOK_NAME:.sh=.cjs%"
node "%SCRIPT_DIR%%JS_SCRIPT%"
