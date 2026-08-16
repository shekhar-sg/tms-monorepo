import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "@/lib/api/projects-api";

import { projectKeys } from "./project-keys";

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: getProjects,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(),
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,

    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(project.id), project);

      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(),
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

    onSuccess: (_, projectId) => {
      queryClient.removeQueries({
        queryKey: projectKeys.detail(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(),
      });
    },
  });
}
