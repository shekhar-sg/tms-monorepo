"use client";

import type { SubtaskSummary, Task } from "@repo/types";
import { useRouter } from "next/navigation";
import DataTable from "@/components/dashboard/tasks/feed/shared/data-table";
import {
  subtaskColumns,
  subtaskTableFeatures,
} from "@/components/dashboard/tasks/subtasks/subtask-column";
import SubtaskListRow from "@/components/dashboard/tasks/subtasks/subtask-row";
import { taskStatusGroups } from "../feed/task-feed-utils";
import { TaskOrdering } from "../feed/task-ordering";

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

      <TaskOrdering
        tasks={
          subtasks.map((t) => ({
            ...t,
            labels: [],
            reporter: null,
            subtasks: [],
          })) as Task[]
        }
        manual={true}
        columns={taskStatusGroups}
      >
        {(items) => (
          <DataTable
            features={subtaskTableFeatures}
            columns={subtaskColumns}
            data={taskStatusGroups
              .flatMap((g) => items[g.id])
              .map(({ subtasks: _subtasks, ...task }) => task)}
            getRowId={(subtask) => subtask.id}
            emptyMessage="No subtasks"
            renderRow={(row) => (
              <SubtaskListRow
                key={row.id}
                row={row.original}
                index={items[row.original.status].findIndex(
                  (t) => t.id === row.original.id
                )}
              />
            )}
            addButtonProps={{
              children: "Add Task",
              onClick: handleAddSubtask,
            }}
          />
        )}
      </TaskOrdering>
    </section>
  );
};

export default TaskSubtasks;
