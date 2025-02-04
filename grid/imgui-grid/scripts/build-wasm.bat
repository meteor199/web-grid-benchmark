@echo off
setlocal EnableDelayedExpansion

cd %~dp0/..

echo Current Directory: %CD%
echo Script Directory: %~dp0



docker run -it   -v "%CD%:/project" imgui-grid-builder:v1.0 bash -c "cd /project/cpp && make"

if !ERRORLEVEL! neq 0 (
    echo Build failed with error code !ERRORLEVEL!
    exit /b !ERRORLEVEL!
)

@REM make BUILD_TYPE=Debug
@REM make BUILD_TYPE=Release
@REM docker run -it -v "%CD%:/project" imgui-grid-builder:v1.0 /bin/bash
