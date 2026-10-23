import type { GetTasksQuery, Task } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { taskActivityKeys } from "@/hooks/tasks/use-task-activities";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  moveTask,
  updateTask,
} from "@/lib/api/tasks-api";

import { taskKeys } from "./task-keys";

export function useTasks(projectId?: string, query?: GetTasksQuery) {
  return useQuery({
    queryKey: taskKeys.list(projectId, query),
    queryFn: () => getTasks(projectId, query),
  });
}

export function useTask(taskId: string) {
  return useQuery<Task>({
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (variables.parentId)
        queryClient.invalidateQueries({
          queryKey: taskKeys.detail(variables.parentId),
        });
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,

    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(taskKeys.detail(task.id), task);

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: taskActivityKeys.task(task.id),
      });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveTask,
    scope: { id: "task-moves" },

    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(taskKeys.detail(task.id), task);
      queryClient.invalidateQueries({
        queryKey: taskActivityKeys.task(task.id),
      });

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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.removeQueries({
        queryKey: taskKeys.detail(taskId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}
