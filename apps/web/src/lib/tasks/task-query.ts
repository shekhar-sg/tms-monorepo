import { type GetTasksQuery, getTasksQuerySchema } from "@repo/types";

export interface TaskQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  labels?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export const parseTaskQueryParams = (
  params: TaskQueryParams
): GetTasksQuery => {
  return getTasksQuerySchema.parse(params);
};
