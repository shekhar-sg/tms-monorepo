import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskActivityKeys } from "@/hooks/tasks/use-task-activities";
import { createTaskComment, getTaskComments } from "@/lib/api/comments-api";

const commentKeys = {
  all: ["comments"] as const,

  task: (taskId: string) => [...commentKeys.all, "task", taskId] as const,
};

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.task(taskId),
    queryFn: () => getTaskComments(taskId),
    enabled: Boolean(taskId),
  });
}

export function useCreateTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.task(variables.taskId),
      });
      queryClient.invalidateQueries({
        queryKey: taskActivityKeys.task(variables.taskId),
      });
    },
  });
}
