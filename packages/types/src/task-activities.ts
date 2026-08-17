export type TaskActivityType =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "PROJECT_CHANGED"
  | "REPORTER_CHANGED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "LABEL_ADDED"
  | "LABEL_REMOVED"
  | "RESOURCE_CHANGED"
  | "COMMENT_ADDED";

export type TaskActivity = {
  id: string;
  taskId: string;
  userId: string;
  type: TaskActivityType;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
};
