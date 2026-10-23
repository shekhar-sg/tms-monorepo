import type { MoveTaskInput, Task } from "@repo/types";
import type { TasksByStatus } from "@/components/dashboard/tasks/feed/task-feed-utils";

export type MoveIntent = { taskId: string; data: MoveTaskInput };
export function replayMoves(
  base: Task[],
  intents: MoveIntent[]
): TasksByStatus {
  const groups: TasksByStatus = {
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  };
  for (const task of [...base].sort(
    (a, b) => a.position - b.position || a.id.localeCompare(b.id)
  ))
    groups[task.status].push(task);
  for (const { taskId, data } of intents) {
    const task = Object.values(groups)
      .flat()
      .find((t) => t.id === taskId);
    if (!task) continue;
    for (const status of Object.keys(groups) as (keyof TasksByStatus)[])
      groups[status] = groups[status].filter((t) => t.id !== taskId);
    const target = groups[data.status];
    const after = target.findIndex((t) => t.id === data.afterTaskId);
    const before = target.findIndex((t) => t.id === data.beforeTaskId);
    target.splice(
      after >= 0 ? after : before >= 0 ? before + 1 : target.length,
      0,
      { ...task, status: data.status }
    );
  }
  return groups;
}
