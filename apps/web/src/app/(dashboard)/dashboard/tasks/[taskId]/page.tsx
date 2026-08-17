import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TaskPage from "@/components/dashboard/tasks/new/task-page";
import { taskKeys } from "@/hooks/tasks/task-keys";
import { serverApi } from "@/lib/api/server-api";
import { getTask } from "@/lib/api/tasks-api";
import { getQueryClient } from "@/lib/query/get-query-client";

interface TaskUpsertPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

const TaskUpsertPage = async ({ params }: TaskUpsertPageProps) => {
  const { taskId } = await params;
  console.log(taskId);
  const queryClient = getQueryClient();
  const api = await serverApi();

  await queryClient.prefetchQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTask(taskId, api),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPage taskId={taskId} />
    </HydrationBoundary>
  );
};

export default TaskUpsertPage;
