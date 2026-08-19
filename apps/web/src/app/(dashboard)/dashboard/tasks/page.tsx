import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import KanbanShell from "@/components/dashboard/kanban/kanban-shell";
import { taskKeys } from "@/hooks/tasks/task-keys";
import { serverApi } from "@/lib/api/server-api";
import { getTasks } from "@/lib/api/tasks-api";
import { getQueryClient } from "@/lib/query/get-query-client";
import {
  parseTaskQueryParams,
  type TaskQueryParams,
} from "@/lib/tasks/task-query";

interface TasksPageProps {
  searchParams: Promise<TaskQueryParams>;
}

const TasksPage = async ({ searchParams }: TasksPageProps) => {
  const params = await searchParams;

  const query = parseTaskQueryParams(params);

  const queryClient = getQueryClient();
  const api = await serverApi();

  await queryClient.prefetchQuery({
    queryKey: taskKeys.list(undefined, query),
    queryFn: () => getTasks(undefined, query, api),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KanbanShell />
    </HydrationBoundary>
  );
};

export default TasksPage;
