import type { Status, Task } from "@repo/types";

export type TaskStatusGroup = {
  id: Status;
  title: string;
};

export const taskStatusGroups: TaskStatusGroup[] = [
  { id: "BACKLOG", title: "Backlog" },
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
];

export type TasksByStatus = Record<Status, Task[]>;

export function groupTasksByStatus(tasks: Task[]): TasksByStatus {
  const items: TasksByStatus = {
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  };

  for (const task of tasks) {
    items[task.status].push(task);
  }

  return items;
}
