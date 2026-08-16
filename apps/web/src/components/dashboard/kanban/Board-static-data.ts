import type { Status, Task } from "@repo/types";

export type BoardItems = Record<Status, Task[]>;

export type Column = {
  id: Status;
  title: string;
};

export const columns: Column[] = [
  { id: "BACKLOG", title: "Backlog" },
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
];

export function groupTasksByStatus(tasks: Task[]): BoardItems {
  const items: BoardItems = {
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
