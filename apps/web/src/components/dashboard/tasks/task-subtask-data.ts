import type { Task } from "@/components/dashboard/kanban/Board-static-data";

export const initialSubtasks: Omit<Task, "labels">[] = [
  {
    id: "subtask-1",
    title: "Create API overview",
    column: "todo",
    priority: "high",
    assignee: {
      id: "user-1",
      name: "Dexter",
      avatar: "/avatars/dexter.png",
    },
    dueDate: "12 Sep 2026",
  },
  {
    id: "subtask-2",
    title: "Document authentication",
    column: "todo",
    priority: "low",
    assignee: {
      id: "user-2",
      name: "Chris Nelson",
    },
    dueDate: "15 Sep 2026",
  },
  {
    id: "subtask-3",
    title: "Add request examples",
    column: "todo",
    priority: "medium",
    dueDate: "18 Sep 2026",
  },
];
