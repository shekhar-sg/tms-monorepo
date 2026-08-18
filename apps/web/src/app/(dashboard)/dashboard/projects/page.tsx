import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProjectListing from "@/components/dashboard/project/project-listing";
import { projectKeys } from "@/hooks/projects/project-keys";
import { getProjects } from "@/lib/api/projects-api";
import { serverApi } from "@/lib/api/server-api";
import { getQueryClient } from "@/lib/query/get-query-client";

const ProjectsPage = async () => {
  const queryClient = getQueryClient();
  const api = await serverApi();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.all,
    queryFn: () => getProjects(api),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectListing />
    </HydrationBoundary>
  );
};

export default ProjectsPage;
