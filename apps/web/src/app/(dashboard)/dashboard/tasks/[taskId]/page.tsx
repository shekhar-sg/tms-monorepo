import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TaskPage from "@/components/dashboard/tasks/detail/task-page";
import { taskKeys } from "@/hooks/tasks/task-keys";
import { serverApi } from "@/lib/api/server-api";
import { getTask } from "@/lib/api/tasks-api";
import { getQueryClient } from "@/lib/query/get-query-client";

interface TaskUpsertPageProps {
  params: Promise<{
    taskId: string;
  }>;
  searchParams: Promise<{
    projectId?: string;
    parentId?: string;
  }>;
}

const TaskUpsertPage = async ({
  params,
  searchParams,
}: TaskUpsertPageProps) => {
  const { taskId } = await params;
  const { projectId, parentId } = await searchParams;
  const queryClient = getQueryClient();
  const api = await serverApi();

  if (taskId !== "new") {
    await queryClient.prefetchQuery({
      queryKey: taskKeys.detail(taskId),
      queryFn: () => getTask(taskId, api),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPage
        taskId={taskId}
        projectId={projectId}
        parentId={parentId}
      />
    </HydrationBoundary>
  );
};

export default TaskUpsertPage;
