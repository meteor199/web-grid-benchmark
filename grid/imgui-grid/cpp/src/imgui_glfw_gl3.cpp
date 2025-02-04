#include "imgui_glfw_gl3.h"

static void glfw_error_callback(int error, const char *description) {
  fprintf(stderr, "GLFW Error %d: %s\n", error, description);
}

ImguiGlfwGl3::ImguiGlfwGl3() {
}

void ImguiGlfwGl3::init(const char *window_title, int window_width,
                        int window_height, float font_size) {
  glfwSetErrorCallback(glfw_error_callback);
  if (!glfwInit())
    return;

  glfwWindowHint(GLFW_DEPTH_BITS, 24);
  glfwWindowHint(GLFW_STENCIL_BITS, 8);
  glfwWindowHint(GLFW_CLIENT_API, GLFW_OPENGL_ES_API);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);
  glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_FALSE);

  ImGui::CreateContext();

  // Create window with graphics context
  this->window = glfwCreateWindow(window_width, window_height, window_title,
                                  nullptr, nullptr);
  IM_ASSERT(window != nullptr);

  glfwMakeContextCurrent(window);
  // glfwSwapInterval(1); // Enable vsync

  ImGuiIO &io = ImGui::GetIO();

  io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
  io.ConfigFlags |= ImGuiConfigFlags_NoMouseCursorChange;

  io.ConfigViewportsNoAutoMerge = true;
  io.IniFilename = NULL;

  ImGui_ImplGlfw_InitForOpenGL(window, true);
  ImGui_ImplGlfw_InstallEmscriptenCallbacks(window, "#canvas");
  ImGui_ImplOpenGL3_Init("#version 300 es");



  ImGuiStyle &style = ImGui::GetStyle();

  return;
}

void ImguiGlfwGl3::poll() {
  glfwPollEvents();
  return;
}

void ImguiGlfwGl3::setViewCallBack(void (*callback)(void *arg), void *arg) {
  this->viewCallBack = callback;
  this->varg = arg;
  return;
}

void ImguiGlfwGl3::new_frame() {
  ImGui_ImplOpenGL3_NewFrame();
  ImGui_ImplGlfw_NewFrame();
  ImGui::NewFrame();
  return;
}

void ImguiGlfwGl3::render() {
  // Rendering
  ImGui::Render();
  int display_w, display_h;
  glfwGetFramebufferSize(window, &display_w, &display_h);
  glViewport(0, 0, display_w, display_h);
  glClearColor(clear_color.x * clear_color.w, clear_color.y * clear_color.w,
               clear_color.z * clear_color.w, clear_color.w);
  glClear(GL_COLOR_BUFFER_BIT);
  ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
  glfwSwapBuffers(this->window);

  return;
}

void ImguiGlfwGl3::msg_loop() {
  this->poll();
  this->new_frame();
  this->viewCallBack(this->varg);
  this->render();
}
void ImguiGlfwGl3::cleanup() {
  // Cleanup
  ImGui_ImplOpenGL3_Shutdown();
  ImGui_ImplGlfw_Shutdown();
  ImGui::DestroyContext();
  glfwDestroyWindow(this->window);
  glfwTerminate();

  return;
}
