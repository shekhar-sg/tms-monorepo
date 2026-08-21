import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TaskFeedPreferencesProvider } from "@/components/dashboard/tasks/feed/task-feed-preferences-context";
import TaskFeedShell from "@/components/dashboard/tasks/feed/task-feed-shell";
import { taskKeys } from "@/hooks/tasks/task-keys";
import { serverApi } from "@/lib/api/server-api";
import { getTasks } from "@/lib/api/tasks-api";
import { getQueryClient } from "@/lib/query/get-query-client";
import { parseTaskQueryParams, TaskQueryParams } from "@/lib/tasks/task-query";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<TaskQueryParams>;
}

const ProjectPage = async ({ params, searchParams }: ProjectPageProps) => {
  const { projectId } = await params;
  const queryParams = await searchParams;
  const query = parseTaskQueryParams(queryParams);
  const queryClient = getQueryClient();
  const api = await serverApi();

  await queryClient.prefetchQuery({
    queryKey: taskKeys.list(projectId, query),
    queryFn: () => getTasks(projectId, query, api),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskFeedPreferencesProvider>
        <TaskFeedShell reorder={true} projectId={projectId}/>
      </TaskFeedPreferencesProvider>
    </HydrationBoundary>
  );
};

export default ProjectPage;
