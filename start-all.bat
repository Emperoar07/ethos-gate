@echo off
setlocal

set ROOT=%~dp0

echo Starting Ethos Gate API...
start "Ethos Gate API" powershell -NoExit -Command "cd /d %ROOT%packages\api; deno task dev"

echo Starting Ethos Gate SDK watcher...
start "Ethos Gate SDK" powershell -NoExit -Command "cd /d %ROOT%packages\sdk; pnpm dev"

echo Starting Ethos Gate Demo...
start "Ethos Gate Demo" powershell -NoExit -Command "cd /d %ROOT%packages\demo; pnpm dev"

echo Done. API: http://localhost:8000 ^| Demo: http://localhost:5173
endlocal
