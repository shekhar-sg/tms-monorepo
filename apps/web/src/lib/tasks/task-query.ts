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
  const query: GetTasksQuery = {};
  // Validate each field independently so a malformed URL cannot crash a page
  // or discard other valid filters. API request validation remains strict.
  for (const key of Object.keys(
    getTasksQuerySchema.shape
  ) as (keyof TaskQueryParams)[]) {
    if (params[key] === undefined) continue;
    const parsed = getTasksQuerySchema.safeParse({ [key]: params[key] });
    if (parsed.success) Object.assign(query, parsed.data);
  }
  return query;
};
