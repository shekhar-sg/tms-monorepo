import type { ActiveFilters } from "./filter-config";

export const searchParamsToFilters = (
  params: URLSearchParams
): ActiveFilters => {
  const filters: ActiveFilters = {};

  const status = params.get("status");
  if (status) {
    filters.status = status.split(",");
  }

  const priority = params.get("priority");
  if (priority) {
    filters.priority = priority.split(",");
  }

  const labels = params.get("labels");
  if (labels) {
    filters.labels = labels.split(",");
  }

  const dueDateFrom = params.get("dueDateFrom");
  const dueDateTo = params.get("dueDateTo");
  if (dueDateFrom || dueDateTo) {
    filters.dueDate = [dueDateFrom ?? "", dueDateTo ?? ""];
  }

  return filters;
};

export const filtersToSearchParams = (
  filters: ActiveFilters,
  currentParams: URLSearchParams
): URLSearchParams => {
  const params = new URLSearchParams(currentParams);

  console.log("filters in method",filters);
  params.delete("status");
  params.delete("priority");
  params.delete("labels");
  params.delete("dueDateFrom");
  params.delete("dueDateTo");

  if (filters.status?.length) {
    params.set("status", filters.status.join(","));
  }

  if (filters.priority?.length) {
    params.set("priority", filters.priority.join(","));
  }

  if (filters.labels?.length) {
    params.set("labels", filters.labels.join(","));
  }

  if (filters.dueDate?.length) {
    const [from, to] = filters.dueDate;

    if (from) {
      params.set("dueDateFrom", from);
    }

    if (to) {
      params.set("dueDateTo", to);
    }
  }

  return params;
};
