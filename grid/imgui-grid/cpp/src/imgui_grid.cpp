#include "emscripten/html5.h"

#include "backends/imgui_impl_glfw.h"
#include "backends/imgui_impl_opengl3.h"
#include "imgui.h"
#include "imgui_internal.h"
#include "misc/cpp/imgui_stdlib.h"

#include "./imgui_glfw_gl3.h"

#include "../lib/json.hpp"
#include "table.h"
#include <GLFW/glfw3.h> // Will drag system OpenGL headers
#include <iostream>
#include <stdio.h>
#include <stdlib.h>

using json = nlohmann::json;

ImVector<EmployeeData *> gb_temp_data_array;

void view_cb(void *arg) {
  ImGui::SetNextWindowPos(ImVec2(0, 0));
  ImGui::SetNextWindowSize(ImGui::GetIO().DisplaySize);
  if (ImGui::Begin("test")) {
    TableRenderer::getInstance().render();
  }
  ImGui::End();
  return;
}

ImguiGlfwGl3 igg3;

void msg_loop() { igg3.msg_loop(); }

int init_main(const char *&config) {
  json rootConfig;
  std::cout << "[ImGui Grid] Starting initialization..." << std::endl;

  rootConfig = json::parse(std::string(config));
  if (rootConfig.is_discarded()) {
    std::cout << "[ImGui Grid] Failed to parse configuration JSON" << std::endl;
    return false;
  }
  if (!rootConfig.contains("columns")) {
    std::cout << "[ImGui Grid] 'columns' key is missing in configuration JSON"
              << std::endl;
    return false;
  }
  int width =
      rootConfig["width"].is_number() ? rootConfig["width"].get<int>() : 1280;
  int height =
      rootConfig["height"].is_number() ? rootConfig["height"].get<int>() : 780;

  TableRenderer::getInstance().setColumns(rootConfig["columns"]);
  igg3.init("Grid Benchmark", width, height);
  std::cout << "[ImGui Grid] ImGui/GLFW initialized" << std::endl;

  igg3.setViewCallBack(view_cb, nullptr);
  std::cout << "[ImGui Grid] View callback set" << std::endl;
  //   emscripten_set_main_loop(msg_loop, 0, 1);
  std::cout << "[ImGui Grid] Main loop started" << std::endl;

  return 0;
}

extern "C" {

EMSCRIPTEN_KEEPALIVE
void set_data() { TableRenderer::getInstance().setData(gb_temp_data_array); }
//
//
EMSCRIPTEN_KEEPALIVE
void init_table(const char *config) { init_main(config); }
EMSCRIPTEN_KEEPALIVE
void cancel_main_loop() {
  emscripten_cancel_main_loop();
  igg3.cleanup();
  printf("cancel_main_loop()\n");
}

EMSCRIPTEN_KEEPALIVE
void msg_loop_ems() { igg3.msg_loop(); }

EMSCRIPTEN_KEEPALIVE
void set_scroll_top(float scrollTop) {
  TableRenderer::getInstance().setScrollTop(scrollTop);
}

EMSCRIPTEN_KEEPALIVE
EmployeeData **create_employee_data_array(int count) {

  gb_temp_data_array.clear();
  gb_temp_data_array.reserve(count);
  for (int i = 0; i < count; i++) {
    gb_temp_data_array.push_back(new EmployeeData());
  }
  return gb_temp_data_array.Data;
}
EMSCRIPTEN_KEEPALIVE
const char *get_test_employee_data() {
  json result = json::array();

  //
  std::vector<int> indices = {0, 4, 9, 80000};

  for (int index : indices) {
    EmployeeData *emp = gb_temp_data_array[index];
    json employee;

    employee["index"] = index;
    employee["id"] = emp->id;
    employee["name"] = emp->name;
    employee["email"] = emp->email;
    employee["age"] = emp->age;
    employee["salary"] = emp->salary;
    employee["department"] = emp->department;
    employee["position"] = emp->position;
    employee["startDate"] = emp->startDate;
    employee["isActive"] = emp->isActive;
    employee["performance"] = emp->performance;
    employee["phone"] = emp->phone;
    employee["address"] = emp->address;
    employee["city"] = emp->city;
    employee["country"] = emp->country;
    employee["projects"] = emp->projects;
    employee["rating"] = emp->rating;
    employee["lastEvaluation"] = emp->lastEvaluation;
    employee["bonus"] = emp->bonus;
    employee["efficiency"] = emp->efficiency;
    employee["team"] = emp->team;
    employee["skills"] = emp->skills;
    employee["certifications"] = emp->certifications;
    employee["overtime"] = emp->overtime;
    employee["vacationDays"] = emp->vacationDays;
    employee["trainings"] = emp->trainings;
    employee["reportsTo"] = emp->reportsTo;
    employee["office"] = emp->office;
    employee["expenses"] = emp->expenses;
    employee["satisfaction"] = emp->satisfaction;
    employee["notes"] = emp->notes;

    result.push_back(employee);
  }

  //
  std::string jsonStr = result.dump();

  //
  char *result_str = (char *)malloc(jsonStr.length() + 1);
  strcpy(result_str, jsonStr.c_str());

  return result_str;
}

EMSCRIPTEN_KEEPALIVE
const char *get_employee_data_layout() {
  json layout;

  //
  layout["id"] = {offsetof(EmployeeData, id), sizeof(((EmployeeData *)0)->id)};
  layout["name"] = {offsetof(EmployeeData, name),
                    sizeof(((EmployeeData *)0)->name)};
  layout["email"] = {offsetof(EmployeeData, email),
                     sizeof(((EmployeeData *)0)->email)};
  layout["age"] = {offsetof(EmployeeData, age),
                   sizeof(((EmployeeData *)0)->age)};
  layout["salary"] = {offsetof(EmployeeData, salary),
                      sizeof(((EmployeeData *)0)->salary)};
  layout["department"] = {offsetof(EmployeeData, department),
                          sizeof(((EmployeeData *)0)->department)};
  layout["position"] = {offsetof(EmployeeData, position),
                        sizeof(((EmployeeData *)0)->position)};
  layout["startDate"] = {offsetof(EmployeeData, startDate),
                         sizeof(((EmployeeData *)0)->startDate)};
  layout["isActive"] = {offsetof(EmployeeData, isActive),
                        sizeof(((EmployeeData *)0)->isActive)};
  layout["performance"] = {offsetof(EmployeeData, performance),
                           sizeof(((EmployeeData *)0)->performance)};
  layout["phone"] = {offsetof(EmployeeData, phone),
                     sizeof(((EmployeeData *)0)->phone)};
  layout["address"] = {offsetof(EmployeeData, address),
                       sizeof(((EmployeeData *)0)->address)};
  layout["city"] = {offsetof(EmployeeData, city),
                    sizeof(((EmployeeData *)0)->city)};
  layout["country"] = {offsetof(EmployeeData, country),
                       sizeof(((EmployeeData *)0)->country)};
  layout["projects"] = {offsetof(EmployeeData, projects),
                        sizeof(((EmployeeData *)0)->projects)};
  layout["rating"] = {offsetof(EmployeeData, rating),
                      sizeof(((EmployeeData *)0)->rating)};
  layout["lastEvaluation"] = {offsetof(EmployeeData, lastEvaluation),
                              sizeof(((EmployeeData *)0)->lastEvaluation)};
  layout["bonus"] = {offsetof(EmployeeData, bonus),
                     sizeof(((EmployeeData *)0)->bonus)};
  layout["efficiency"] = {offsetof(EmployeeData, efficiency),
                          sizeof(((EmployeeData *)0)->efficiency)};
  layout["team"] = {offsetof(EmployeeData, team),
                    sizeof(((EmployeeData *)0)->team)};
  layout["skills"] = {offsetof(EmployeeData, skills),
                      sizeof(((EmployeeData *)0)->skills)};
  layout["certifications"] = {offsetof(EmployeeData, certifications),
                              sizeof(((EmployeeData *)0)->certifications)};
  layout["overtime"] = {offsetof(EmployeeData, overtime),
                        sizeof(((EmployeeData *)0)->overtime)};
  layout["vacationDays"] = {offsetof(EmployeeData, vacationDays),
                            sizeof(((EmployeeData *)0)->vacationDays)};
  layout["trainings"] = {offsetof(EmployeeData, trainings),
                         sizeof(((EmployeeData *)0)->trainings)};
  layout["reportsTo"] = {offsetof(EmployeeData, reportsTo),
                         sizeof(((EmployeeData *)0)->reportsTo)};
  layout["office"] = {offsetof(EmployeeData, office),
                      sizeof(((EmployeeData *)0)->office)};
  layout["expenses"] = {offsetof(EmployeeData, expenses),
                        sizeof(((EmployeeData *)0)->expenses)};
  layout["satisfaction"] = {offsetof(EmployeeData, satisfaction),
                            sizeof(((EmployeeData *)0)->satisfaction)};
  layout["notes"] = {offsetof(EmployeeData, notes),
                     sizeof(((EmployeeData *)0)->notes)};

  //
  std::string jsonStr = layout.dump();

  //
  char *result = (char *)malloc(jsonStr.length() + 1);
  strcpy(result, jsonStr.c_str());

  return result;
}

EMSCRIPTEN_KEEPALIVE
EmployeeData **insertData(int count) {
    auto oldSize = gb_temp_data_array.size();
    gb_temp_data_array.resize(oldSize + count);
    
    // Move existing elements to make space at the beginning
    for (int i = oldSize - 1; i >= 0; i--) {
        gb_temp_data_array[i + count] = gb_temp_data_array[i];
    }
    
    // Insert new empty elements at the beginning
    for (int i = 0; i < count; i++) {
        gb_temp_data_array[i] = new EmployeeData();
    }
    
    return gb_temp_data_array.Data;
}

EMSCRIPTEN_KEEPALIVE
void sort_data(const char *column, bool ascending) {
  TableRenderer::getInstance().sort(column, ascending);
}

EMSCRIPTEN_KEEPALIVE
void filter_data(const char *column, const char *op, const char *value) {
  TableRenderer::getInstance().filter(column, op, value);
}

EMSCRIPTEN_KEEPALIVE
size_t get_employee_data_size() { return sizeof(EmployeeData); }
}