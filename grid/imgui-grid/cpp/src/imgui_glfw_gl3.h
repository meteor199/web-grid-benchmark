#ifndef _IMGUI_GLFW_GL3_H_
#define _IMGUI_GLFW_GL3_H_

#include "emscripten/html5.h"

#include "backends/imgui_impl_glfw.h"
#include "backends/imgui_impl_opengl3.h"
#include "imgui.h"
#include "imgui_internal.h"
#include "misc/cpp/imgui_stdlib.h"

#include <GLFW/glfw3.h> // Will drag system OpenGL headers
#include <iostream>
#include <stdio.h>
#include <string>

class ImguiGlfwGl3 {

public:
  ImguiGlfwGl3();
  void setViewCallBack(void (*cb)(void *arg), void *arg);
  void msg_loop();
  void cleanup();
  void init(const char *window_title, int window_width = 1280,
            int window_height = 780, float font_size = 24.0);
  ~ImguiGlfwGl3() { cleanup(); };

private:
  void poll();
  void new_frame();
  void render();
  void (*viewCallBack)(void *varg);
  void *varg;
  GLFWwindow *window;
  ImVec4 clear_color = ImVec4(0.45f, 0.55f, 0.60f, 1.00f);
};

#endif
