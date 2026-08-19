"use client";

import type { SubtaskSummary } from "@repo/types";
import { useRouter } from "next/navigation";

import DataTable from "@/components/dashboard/kanban/shared/data-table";
import {
  subtaskColumns,
  subtaskTableFeatures,
} from "@/components/dashboard/tasks/subtasks/subtask-column";
import SubtaskListRow from "@/components/dashboard/tasks/subtasks/subtask-row";

interface TaskSubtasksProps {
  taskId: string;
  projectId: string;
  subtasks: SubtaskSummary[];
}

const TaskSubtasks = ({ taskId, projectId, subtasks }: TaskSubtasksProps) => {
  const router = useRouter();

  const handleAddSubtask = () => {
    const params = new URLSearchParams({
      projectId,
      parentId: taskId,
    });

    router.push(`/dashboard/tasks/new?${params.toString()}`);
  };

  return (
    <section className="space-y-3">
      <h2 className="font-medium">Subtasks</h2>

      <DataTable
        features={subtaskTableFeatures}
        columns={subtaskColumns}
        data={subtasks}
        getRowId={(subtask) => subtask.id}
        emptyMessage="No subtasks"
        renderRow={(row) => <SubtaskListRow key={row.id} row={row.original} />}
        addButtonProps={{
          children: "Add Task",
          onClick: handleAddSubtask,
        }}
      />
    </section>
  );
};

export default TaskSubtasks;
