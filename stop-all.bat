@echo off
setlocal

echo Closing Ethos Gate API window...
taskkill /FI "WINDOWTITLE eq Ethos Gate API*" >nul 2>&1

echo Closing Ethos Gate Demo window...
taskkill /FI "WINDOWTITLE eq Ethos Gate Demo*" >nul 2>&1

echo Stop complete.
endlocal
