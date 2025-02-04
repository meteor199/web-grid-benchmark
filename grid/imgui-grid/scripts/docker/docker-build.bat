@echo off
setlocal

REM Pull the base image first
docker pull emscripten/emsdk:3.1.45

REM Build the Docker image with proxy settings for the daemon
docker build ^
    --network=host ^
    --build-arg HTTP_PROXY=http://127.0.0.1:10811 ^
    --build-arg HTTPS_PROXY=http://127.0.0.1:10811 ^
    --build-arg http_proxy=http://127.0.0.1:10811 ^
    --build-arg https_proxy=http://127.0.0.1:10811 ^
    -t imgui-grid-builder .

REM Create output directory if it doesn't exist
if not exist dist mkdir dist

REM Run the container with volume mounts and proxy settings
docker run --rm ^
    --network=host ^
    -v %cd%/src:/app/src ^
    -v %cd%/dist:/app/build/bin ^
    -v %cd%/imgui:/app/imgui ^
    --env HTTP_PROXY=http://127.0.0.1:10811 ^
    --env HTTPS_PROXY=http://127.0.0.1:10811 ^
    --env http_proxy=http://127.0.0.1:10811 ^
    --env https_proxy=http://127.0.0.1:10811 ^
    imgui-grid-builder

echo Build complete! Output files are in the dist/ directory.
echo You can serve the files using Python's HTTP server:
echo cd dist
echo python -m http.server 8080
