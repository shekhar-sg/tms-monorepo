"use client";

import type { UpdateTaskInput } from "@repo/types";
import { useEffect } from "react";
import { type Control, useFormState, useWatch } from "react-hook-form";
import type { TaskFormValues } from "@/components/dashboard/tasks/new/task-page";
import { useUpdateTask } from "@/hooks/tasks/use-tasks";

interface TaskAutoSaveProps {
  control: Control<TaskFormValues>;
  taskId: string;
  enabled: boolean;
}

const TaskAutoSave = ({ control, taskId, enabled }: TaskAutoSaveProps) => {
  const { mutate: updateTask } = useUpdateTask();

  const values = useWatch({
    control,
  });

  const { isDirty } = useFormState({
    control,
  });

  useEffect(() => {
    if (!enabled || !isDirty) {
      return;
    }

    const timeout = setTimeout(() => {
      const { dateRange, ...taskValues } = values;

      const payload: UpdateTaskInput = {
        ...taskValues,
        title: taskValues.title ?? "",
        members: taskValues.members ?? [],
        labels: taskValues.labels ?? [],
        startDate: dateRange?.from?.toISOString() ?? null,
        endDate: dateRange?.to?.toISOString() ?? null,
      };

      updateTask({
        taskId,
        data: payload,
      });
    }, 700);

    return () => {
      clearTimeout(timeout);
    };
  }, [enabled, isDirty, taskId, updateTask, values]);

  return null;
};

export default TaskAutoSave;
