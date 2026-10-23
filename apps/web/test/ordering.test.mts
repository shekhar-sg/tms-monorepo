import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { Task } from "@repo/types";
import { replayMoves } from "../src/lib/tasks/ordering.ts";
const task = (id: string, position: number, status: Task["status"] = "TODO") => ({ id, position, status } as Task);
test("rapid optimistic moves preserve each task exactly once", () => {
  const groups = replayMoves([task("a", 1), task("b", 2), task("c", 3)], [
    { taskId: "b", data: { status: "DONE" } },
    { taskId: "a", data: { status: "DONE", afterTaskId: "b" } },
    { taskId: "b", data: { status: "REVIEW" } },
  ]);
  assert.deepEqual(groups.TODO.map((t) => t.id), ["c"]);
  assert.deepEqual(groups.DONE.map((t) => t.id), ["a"]);
  assert.deepEqual(groups.REVIEW.map((t) => t.id), ["b"]);
  assert.equal(Object.values(groups).flat().length, 3);
});
test("rolling back an earlier failed move keeps later user intentions", () => {
  const groups = replayMoves([task("a", 1), task("b", 2), task("c", 3)], [
    { taskId: "c", data: { status: "TODO", afterTaskId: "a" } },
  ]);
  assert.deepEqual(groups.TODO.map((t) => t.id), ["c", "a", "b"]);
});
test("stable rank ties and missing neighbors reconcile deterministically", () => {
  const groups = replayMoves([task("b", 1), task("a", 1)], [{ taskId: "a", data: { status: "DONE", afterTaskId: "deleted" } }]);
  assert.deepEqual(groups.TODO.map((t) => t.id), ["b"]);
  assert.deepEqual(groups.DONE.map((t) => t.id), ["a"]);
});
