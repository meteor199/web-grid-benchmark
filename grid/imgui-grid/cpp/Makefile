CC = emcc
CXX = em++

# Project directories
PROJECT_ROOT_DIR = $(shell pwd)
TEMPLATE_HTML_HOME = resource/

# Third-party GUI settings
3RD_GUI_DIR = imgui-implot
3RD_GUI_SRC = $(3RD_GUI_DIR)/src
IMGUI_DIR=$(PROJECT_ROOT_DIR)/lib/imgui-docking

# Source files
SRC = src

ALL_SOURCES =  $(IMGUI_DIR)/imgui.cpp \
    $(IMGUI_DIR)/imgui_tables.cpp \
    $(IMGUI_DIR)/imgui_draw.cpp \
    $(IMGUI_DIR)/imgui_widgets.cpp \
    $(IMGUI_DIR)/backends/imgui_impl_glfw.cpp \
    $(IMGUI_DIR)/backends/imgui_impl_opengl3.cpp \
    $(IMGUI_DIR)/misc/cpp/imgui_stdlib.cpp \
    $(wildcard $(SRC)/*.cpp)


# Include paths and compiler flags
INC =  -I $(IMGUI_DIR) 

CXXLEVEL = -std=c++23

# Build type (Debug/Release)
BUILD_TYPE ?= Release

# Optimization flags based on build type
ifeq ($(BUILD_TYPE),Debug)
    OPT_FLAGS = -O1 -g -s ASSERTIONS=2 -s SAFE_HEAP=1 --profiling-funcs -s DEMANGLE_SUPPORT=1
else
    OPT_FLAGS = -O3 --closure 1
endif

# Main target configuration
MAIN = imgui_grid

# Main target specific flags
MAIN_EMS = --no-heap-copy \
           -s DISABLE_EXCEPTION_CATCHING=0 \
           -s WASM=1 \
           -s INITIAL_MEMORY=200MB \
           -s NO_EXIT_RUNTIME=0 \
           -s IMPORTED_MEMORY \
           -s STB_IMAGE=1 \
           -s MODULARIZE=1 \
           -s EXPORT_ES6=1 \
           --no-entry \
           -s NO_EXIT_RUNTIME \
           -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
           -s ALLOW_MEMORY_GROWTH=1 \
           -s USE_GLFW=3 \
           -s FULL_ES3=1 \
           -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall","lengthBytesUTF8","stringToUTF8"]' \
           -s ASYNCIFY=1 \
           -s ENVIRONMENT=web,worker \
           -s ELIMINATE_DUPLICATE_FUNCTIONS=1 \
           -fexec-charset=UTF-8 \
           -s NO_FILESYSTEM=1 \
           --shell-file $(TEMPLATE_HTML_HOME)/shell_minimal.html \
           --bind \
           $(OPT_FLAGS) \
           $(CXXLEVEL) 


# 多线程相关
#    -mt \
#    -s SHARED_MEMORY=1 \
#    -s PTHREAD_POOL_SIZE=2 \

# 调试相关
#    --profiling-funcs \
#    -s DEMANGLE_SUPPORT=1 \

#    -s MODULE_CACHE="[1,'imgui_grid']" \
#    -s NO_DISABLE_EXCEPTION_CATCHING \

        #    -fno-rtti \
        #    -fno-exceptions \

# Object files
ALL_OBJS = $(ALL_SOURCES:%.cpp=%.o)

# Build rules
%.o: %.cpp
	$(CXX) $(INC) -c -o $@ $< $(CXXLEVEL) -D __EMSCRIPTEN__

all: $(MAIN)
	@echo Build complete
	gzip -6 -k -f ../public/imgui_grid.wasm
	gzip -6 -k -f ../public/imgui_grid.js

$(MAIN): $(ALL_OBJS) 
	$(CXX) -o ../public/imgui_grid.html $(ALL_OBJS) $(MAIN_EMS) 

clean:
	rm -rf $(SRC)/*.o $(IMGUI_DIR)/*.o ../public/imgui*
