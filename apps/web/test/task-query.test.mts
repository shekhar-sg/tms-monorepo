import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from "../src/lib/tasks/filter-url.ts";
import { parseTaskQueryParams } from "../src/lib/tasks/task-query.ts";

test("malformed filters cannot crash a page or discard valid filters", () => {
  assert.deepEqual(
    parseTaskQueryParams({
      search: "  launch  ",
      status: "INVALID",
      priority: "HIGH",
      labels: "not-a-uuid",
      dueDateFrom: "not-a-date",
    }),
    { search: "launch", priority: ["HIGH"] }
  );
});
test("empty query has no implicit filters", () =>
  assert.deepEqual(parseTaskQueryParams({}), {}));
test("valid date ranges and status lists survive URL round-trips", () => {
  const original = new URLSearchParams({
    search: "keep me",
    projectId: "project",
  });
  const filters = {
    status: ["TODO", "DONE"],
    priority: ["HIGH"],
    dueDate: ["2026-10-23T00:00:00.000Z", "2026-10-24T23:59:59.999Z"],
  };
  const params = filtersToSearchParams(filters, original);
  assert.equal(params.get("search"), "keep me");
  assert.equal(params.get("projectId"), "project");
  assert.deepEqual(searchParamsToFilters(params), filters);
});
test("clearing filters preserves unrelated context and search", () => {
  const params = filtersToSearchParams(
    {},
    new URLSearchParams(
      "status=DONE&priority=HIGH&search=hello&projectId=project"
    )
  );
  assert.equal(params.toString(), "search=hello&projectId=project");
});
