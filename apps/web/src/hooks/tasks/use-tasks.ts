import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  moveTask,
  updateTask,
} from "@/lib/api/tasks-api";

import { taskKeys } from "./task-keys";

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: taskKeys.list(projectId),
    queryFn: () => getTasks(projectId),
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTask(taskId),
    enabled: Boolean(taskId),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,

    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveTask,

    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onSuccess: (_, taskId) => {
      queryClient.removeQueries({
        queryKey: taskKeys.detail(taskId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}
