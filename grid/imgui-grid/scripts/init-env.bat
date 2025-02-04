@echo off
setlocal

cd ..

set http_proxy=http://host.docker.internal:10809
set https_proxy=http://host.docker.internal:10809

REM Create necessary directories
cd %~dp0/../cpp/lib
if not exist imgui-docking (
    curl -L -o imgui-docking.tar.gz https://github.com/ocornut/imgui/archive/refs/tags/v1.91.5-docking.tar.gz
    mkdir imgui-docking
    tar -xzf imgui-docking.tar.gz -C imgui-docking --strip-components=1
    del imgui-docking.tar.gz
    cd imgui-docking
    cd ..
)

cd %~dp0/../cpp/lib
if not exist json.hpp (
    curl -L -o json.hpp https://github.com/nlohmann/json/releases/download/v3.11.3/json.hpp
)

cd %~dp0/../scripts/docker
@REM docker build -t imgui-grid-builder:v1.0 .
docker pull ubuntu:24.04

docker build --progress=plain ^
--build-arg http_proxy=%http_proxy% ^
--build-arg https_proxy=%https_proxy% ^
-t imgui-grid-builder:v1.0 .