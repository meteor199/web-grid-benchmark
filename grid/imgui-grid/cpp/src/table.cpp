#include "table.h"
#include "imgui.h"
#include <iostream>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include "../lib/json.hpp"

//
#define DISABLE_PERFORMANCE_LOGGING

#ifndef DISABLE_PERFORMANCE_LOGGING
class PerformanceLogger {
private:
  std::chrono::high_resolution_clock::time_point start_time;
  std::chrono::high_resolution_clock::time_point last_time;
  const char *section_name;
  int total_items;
  int processed_items;

public:
  PerformanceLogger(const char *name)
      : section_name(name), total_items(0), processed_items(0) {
    start_time = std::chrono::high_resolution_clock::now();
    last_time = start_time;
  }

  void setTotalItems(int total) { total_items = total; }

  void logStep(int items_in_step, const char *step_name) {
    auto current_time = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(
                        current_time - last_time)
                        .count();

    if (items_in_step > 0) {
      std::cout << "[Performance][" << section_name << "] " << step_name
                << ": processed " << items_in_step << " items in " << duration
                << " microseconds (" << duration / items_in_step
                << " microseconds per item)" << std::endl;
    }

    processed_items += items_in_step;
    last_time = current_time;
  }

  ~PerformanceLogger() {
    if (processed_items > 0) {
      auto total_duration =
          std::chrono::duration_cast<std::chrono::microseconds>(
              std::chrono::high_resolution_clock::now() - start_time)
              .count();
      std::cout << "[Performance][" << section_name << "] Total: processed "
                << processed_items << "/" << total_items << " items in "
                << total_duration << " microseconds ("
                << total_duration / processed_items
                << " microseconds per item average)" << std::endl;
    }
  }
};

#define PERF_LOG(name) PerformanceLogger perf_logger(name)
#define PERF_SET_TOTAL(total) perf_logger.setTotalItems(total)
#define PERF_LOG_STEP(items, name) perf_logger.logStep(items, name)

#else

#define PERF_LOG(name)
#define PERF_SET_TOTAL(total)
#define PERF_LOG_STEP(items, name)

#endif

// TableRenderer
TableRenderer::TableRenderer()
    : sortAscending(true), scroll_top(0), should_update_scroll(false) {}

TableRenderer &TableRenderer::getInstance() {
  static TableRenderer instance;
  return instance;
}

void TableRenderer::setColumns(const nlohmann::json &colsJson) {
  if (!colsJson.is_array()) {
    std::cout << "Error: columns config must be an array" << std::endl;
    return;
  }

  columns.clear();
  for (const auto &col : colsJson) {
    ColumnDef def;
    if (col.contains("field")) {
        def.field = col["field"].get<std::string>();
    }
    if (col.contains("header")) {
        def.header = col["header"].get<std::string>();
    }
    if (col.contains("type")) {
        def.type = col["type"].get<std::string>();
    }
    if (col.contains("width")) {
        def.width = col["width"].get<float>();
    }
    if (col.contains("pinned")) {
        def.pinned = col["pinned"].get<bool>();
    }
    if (col.contains("sortable")) {
        def.sortable = col["sortable"].get<bool>();
    }
    columns.push_back(def);
  }
}

void TableRenderer::setScrollTop(float scrollTop) { scroll_top = scrollTop; }

void TableRenderer::setData(const ImVector<EmployeeData *> &newData) {
  data = newData;
}

//
std::string getFieldValue(const EmployeeData *data, const std::string &field) {
  if (!data)
    return "";

  static const std::unordered_map<
      std::string, std::function<std::string(const EmployeeData *)>>
      fieldGetters = {
          {"id", [](const EmployeeData *d) { return d->id; }},
          {"name", [](const EmployeeData *d) { return d->name; }},
          {"email", [](const EmployeeData *d) { return d->email; }},
          {"department", [](const EmployeeData *d) { return d->department; }},
          {"position", [](const EmployeeData *d) { return d->position; }},
          {"team", [](const EmployeeData *d) { return d->team; }},
          {"skills", [](const EmployeeData *d) { return d->skills; }}};

  auto it = fieldGetters.find(field);
  return it != fieldGetters.end() ? it->second(data) : "";
}

void TableRenderer::performSort() {
  PERF_LOG("Sort");
  if (data.Size <= 0)
    return;

  std::cout << "[Sort] Column: " << sortedColumn
            << ", Direction: " << (sortAscending ? "Ascending" : "Descending")
            << ", Data Size: " << data.Size << std::endl;

  std::sort(data.begin(), data.end(),
            [this](const EmployeeData *a, const EmployeeData *b) {
              if (!a || !b)
                return false;
              std::string valA = getFieldValue(a, sortedColumn);
              std::string valB = getFieldValue(b, sortedColumn);
              int cmp = valA.compare(valB);
              return sortAscending ? (cmp < 0) : (cmp > 0);
            });
}

void TableRenderer::performFilter() {
  PERF_LOG("Filter");
  if (originalData.empty()) {
    originalData = data;
  }

  if (filterColumn.empty() || filterOp.empty()) {
    data = originalData;
    return;
  }

  data.clear();
  for (auto item : originalData) {
    if (!item)
      continue;

    std::string itemValue = getFieldValue(item, filterColumn);
    bool match = false;

    if (filterOp == "contains") {
      match = itemValue.find(filterValue) != std::string::npos;
    } else if (filterOp == "equals") {
      match = itemValue == filterValue;
    } else if (filterOp == "startsWith") {
      match = itemValue.substr(0, filterValue.length()) == filterValue;
    } else if (filterOp == "endsWith") {
      if (filterValue.length() <= itemValue.length()) {
        match = itemValue.substr(itemValue.length() - filterValue.length()) ==
                filterValue;
      }
    }

    if (match) {
      data.push_back(item);
    }
  }

  std::cout << "[Filter] Filtered data size: " << data.Size << std::endl;
}

void TableRenderer::sort(const std::string &column, bool ascending) {
  sortedColumn = column;
  sortAscending = ascending;
  performSort();
}

void TableRenderer::filter(const std::string &column, const std::string &op,
                           const std::string &value) {
  filterColumn = column;
  filterOp = op;
  filterValue = value;
  performFilter();
}


void TableRenderer::render() {
  PERF_LOG("TableRender");
  PERF_SET_TOTAL(data.Size);

  // 1.
  if (ImGui::BeginTable(
          "EmployeeTable", columns.size(),
          ImGuiTableFlags_Resizable | ImGuiTableFlags_Reorderable |
              ImGuiTableFlags_Hideable | ImGuiTableFlags_Sortable |
              ImGuiTableFlags_SortMulti | ImGuiTableFlags_RowBg |
              ImGuiTableFlags_NoBordersInBody | ImGuiTableFlags_ScrollX |
              ImGuiTableFlags_ScrollY | ImGuiTableFlags_HighlightHoveredColumn |
              ImGuiTableFlags_SizingFixedFit | ImGuiTableFlags_SortTristate)) {
    // 2.
    for (const auto &col : columns) {
      ImGui::TableSetupColumn(col.header.c_str(),
                              ImGuiTableColumnFlags_DefaultSort, col.width);
    }
    ImGui::TableHeadersRow();

    //
    if (ImGuiTableSortSpecs *sorts_specs = ImGui::TableGetSortSpecs()) {
      if (sorts_specs->SpecsDirty) {
        if (sorts_specs->SpecsCount > 0) {
          const ImGuiTableColumnSortSpecs *sort_spec = &sorts_specs->Specs[0];
          sort(columns[sort_spec->ColumnIndex].field,
               sort_spec->SortDirection == ImGuiSortDirection_Ascending);
          sorts_specs->SpecsDirty = false;
        }
      }
    }

    PERF_LOG_STEP(columns.size(), "Setup Columns");
    if (data.Size <= 0) {
      ImGui::EndTable();
      return;
    }

    ImGui::SetScrollY(scroll_top);

    // 3.
    ImGuiListClipper clipper;
    clipper.Begin(data.Size);

    int total_rows_rendered = 0;

    while (clipper.Step()) {
      int rows_rendered = 0;
      for (int row_n = clipper.DisplayStart; row_n < clipper.DisplayEnd;
           row_n++) {
        if (row_n >= data.Size) {
          std::cout << "[Warning] Row index out of bounds: " << row_n
                    << std::endl;
          continue;
        }

        const auto &row = data[row_n];
        if (!row) {
          std::cout << "[Warning] Null row at index: " << row_n << std::endl;
          continue;
        }

        ImGui::TableNextRow();
        int col = 0;

        for (const auto &colDef : columns) {
          ImGui::TableSetColumnIndex(col);

          if (colDef.field == "id")
            ImGui::Text("%s", row->id);
          else if (colDef.field == "name")
            renderNameWithIcon(row->name);
          else if (colDef.field == "email")
            ImGui::Text("%s", row->email);
          else if (colDef.field == "age")
            ImGui::Text("%d", row->age);
          else if (colDef.field == "salary")
            ImGui::Text("$%.2f", row->salary);
          else if (colDef.field == "department") {
            ImVec4 bgColor = getDepartmentColor(row->department);
            ImGui::PushStyleColor(ImGuiCol_ChildBg, bgColor);
            ImGui::PushStyleColor(ImGuiCol_Text,
                                  ImVec4(1.0f, 1.0f, 1.0f, 1.0f));
            std::string childId = std::string("dept_") + row->id;
            ImGui::BeginChild(childId.c_str(), ImVec2(-1, 20), false);
            ImGui::Text("%s", row->department);
            ImGui::EndChild();
            ImGui::PopStyleColor(2);
          } else if (colDef.field == "position")
            ImGui::Text("%s", row->position);
          else if (colDef.field == "startDate")
            ImGui::Text("%s", row->startDate);
          else if (colDef.field == "isActive")
            ImGui::Text("%s", row->isActive ? "Yes" : "No");
          else if (colDef.field == "performance") {
            char buf[32];
            snprintf(buf, sizeof(buf), "%.1f%%", row->performance * 100);
            renderProgressBar(row->performance, buf);
          } else if (colDef.field == "phone")
            ImGui::Text("%s", row->phone);
          else if (colDef.field == "address")
            ImGui::Text("%s", row->address);
          else if (colDef.field == "city")
            ImGui::Text("%s", row->city);
          else if (colDef.field == "country")
            ImGui::Text("%s", row->country);
          else if (colDef.field == "projects")
            ImGui::Text("%d", row->projects);
          else if (colDef.field == "rating")
            ImGui::Text("%.1f", row->rating);
          else if (colDef.field == "lastEvaluation")
            ImGui::Text("%s", row->lastEvaluation);
          else if (colDef.field == "bonus")
            ImGui::Text("$%.2f", row->bonus);
          else if (colDef.field == "efficiency")
            ImGui::Text("%.1f%%", row->efficiency * 100);
          else if (colDef.field == "team")
            ImGui::Text("%s", row->team);
          else if (colDef.field == "skills")
            ImGui::Text("%s", row->skills);
          else if (colDef.field == "certifications")
            ImGui::Text("%d", row->certifications);
          else if (colDef.field == "overtime")
            ImGui::Text("%.1f", row->overtime);
          else if (colDef.field == "vacationDays")
            ImGui::Text("%d", row->vacationDays);
          else if (colDef.field == "trainings")
            ImGui::Text("%d", row->trainings);
          else if (colDef.field == "reportsTo")
            ImGui::Text("%s", row->reportsTo);
          else if (colDef.field == "office")
            ImGui::Text("%s", row->office);
          else if (colDef.field == "expenses")
            ImGui::Text("$%.2f", row->expenses);
          else if (colDef.field == "satisfaction")
            ImGui::Text("%.1f%%", row->satisfaction * 100);
          else if (colDef.field == "notes")
            ImGui::Text("%s", row->notes);

          col++;
        }

        rows_rendered++;
        total_rows_rendered++;
      }

      PERF_LOG_STEP(rows_rendered, "Render Visible Rows");
    }

    // 4.
    ImGui::EndTable();
  }
}

//
void renderNameWithIcon(const char *name) {
  if (!name || name[0] == '\0')
    return;

  //
  ImDrawList *draw_list = ImGui::GetWindowDrawList();
  ImVec2 pos = ImGui::GetCursorScreenPos();
  float radius = 10.0f;

  ImU32 circle_col = IM_COL32(0, 122, 255, 255); // #007bff
  draw_list->AddCircleFilled(ImVec2(pos.x + radius, pos.y + radius), radius,
                             circle_col);

  //
  char icon[2] = {(char)std::toupper(name[0]), '\0'};
  ImVec2 text_size = ImGui::CalcTextSize(icon);
  float text_pos_x = pos.x + radius - text_size.x / 2.0f + 0.5f;
  float text_pos_y = pos.y + radius - text_size.y / 2.0f;
  draw_list->AddText(ImVec2(text_pos_x, text_pos_y),
                     IM_COL32(255, 255, 255, 255), icon);

  //
  ImGui::SetCursorPosX(ImGui::GetCursorPosX() + 2 * radius + 5);
  ImGui::Text("%s", name);
  ImGui::SetCursorPosX(ImGui::GetCursorPosX() - (2 * radius + 5));
}

//
ImVec4 getDepartmentColor(const std::string &department) {
  static const std::unordered_map<std::string, ImVec4> departmentColors = {
      {"Engineering", ImVec4(0.0f, 0.478f, 1.0f, 1.0f)}, // #007bff
      {"Sales", ImVec4(0.196f, 0.804f, 0.196f, 1.0f)},   // #32cd32
      {"Marketing", ImVec4(1.0f, 0.647f, 0.0f, 1.0f)},   // #ffa500
      {"HR", ImVec4(0.855f, 0.439f, 0.839f, 1.0f)},      // #da70d6
      {"Finance", ImVec4(0.941f, 0.502f, 0.502f, 1.0f)}, // #f08080
  };

  auto it = departmentColors.find(department);
  return it != departmentColors.end() ? it->second
                                      : ImVec4(0.7f, 0.7f, 0.7f, 1.0f);
}

//
void renderProgressBar(float progress, const char *text) {
  ImVec4 color;
  if (progress < 0.3f)
    color = ImVec4(1.0f, 0.42f, 0.42f, 1.0f); // #ff6b6b
  else if (progress < 0.7f)
    color = ImVec4(0.31f, 0.80f, 0.77f, 1.0f); // #4ecdc4
  else
    color = ImVec4(0.27f, 0.72f, 0.82f, 1.0f); // #45b7d1

  ImGui::PushStyleColor(ImGuiCol_PlotHistogram, color);
  ImGui::ProgressBar(progress, ImVec2(-1, 20), text);
  ImGui::PopStyleColor();
}
