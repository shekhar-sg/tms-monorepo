import type { Priority } from "@repo/types";
import FilterSelect from "@/components/dashboard/kanban/shared/filter-select";
import {PRIORITY_OPTIONS} from "@/components/dashboard/kanban/toolbar/filter-config";
import { useUpdateProject } from "@/hooks/projects/use-projects";

interface ProjectPriorityCellProps {
  projectId: string;
  priority: Priority;
}

const ProjectPriorityCell = ({
  projectId,
  priority,
}: ProjectPriorityCellProps) => {
  const { mutate: updateProject, isPending } = useUpdateProject();
  return (
    <FilterSelect
      value={priority}
      options={PRIORITY_OPTIONS}
      placeholder="Priority"
      disabled={isPending}
      onChange={(value) => {
        updateProject({
          projectId,
          data: {
            priority: value,
          },
        });
      }}
    />
  );
};

export default ProjectPriorityCell;
