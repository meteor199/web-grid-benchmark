#pragma once
#include "imgui.h"
#include <functional>
#include <string>
#include <vector>
#include <unordered_map>
#include "../lib/json.hpp"

// 
ImVec4 getDepartmentColor(const std::string& department);
void renderProgressBar(float progress, const char* text);
void renderNameWithIcon(const char *name);

// 
struct ColumnDef {
    std::string field;      // 
    std::string header;     // 
    std::string type;       // 
    float width;           // 
    bool pinned;          // 
    bool sortable;        // 
};

struct EmployeeData {
  char id[32];
  char name[64];
  char email[128];
  int32_t age;
  double salary;
  char department[64];
  char position[64];
  char startDate[32];
  bool isActive;
  double performance;
  char phone[32];
  char address[256];
  char city[64];
  char country[64];
  int32_t projects;
  double rating;
  char lastEvaluation[32];
  double bonus;
  double efficiency;
  char team[64];
  char skills[256];
  int32_t certifications;
  double overtime;
  int32_t vacationDays;
  int32_t trainings;
  char reportsTo[64];
  char office[64];
  double expenses;
  double satisfaction;
  char notes[512];
};
// 
class TableRenderer {
public:
    // 
    TableRenderer();
    static TableRenderer& getInstance();

    // 
    void setColumns(const nlohmann::json& colsJson);
    void setScrollTop(float scrollTop);
    void setData(const ImVector<EmployeeData*>& newData);

    // 
    void render();
    void sort(const std::string& column, bool ascending);
    void filter(const std::string& column, const std::string& op, const std::string& value);

private:
    // 
    std::vector<ColumnDef> columns;
    bool sortAscending;
    std::string sortedColumn;
    float scroll_top;
    bool should_update_scroll;
    ImVector<EmployeeData*> data;
    ImVector<EmployeeData*> originalData;
    std::string filterColumn;
    std::string filterOp;
    std::string filterValue;

    // 
    void performSort();
    void performFilter();
};

// 
