import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import KanbanShell from "@/components/dashboard/kanban/kanban-shell";
import { taskKeys } from "@/hooks/tasks/task-keys";
import { serverApi } from "@/lib/api/server-api";
import { getTasks } from "@/lib/api/tasks-api";
import { getQueryClient } from "@/lib/query/get-query-client";

const TasksPage = async () => {
  const queryClient = getQueryClient();
  const api = await serverApi();

  await queryClient.prefetchQuery({
    queryKey: taskKeys.list(),
    queryFn: () => getTasks(undefined, api),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KanbanShell />
    </HydrationBoundary>
  );
};

export default TasksPage;
