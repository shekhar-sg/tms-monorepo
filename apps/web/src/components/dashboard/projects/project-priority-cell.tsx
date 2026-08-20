import type { Priority } from "@repo/types";
import FilterSelect from "@/components/dashboard/tasks/feed/shared/filter-select";
import { useUpdateProject } from "@/hooks/projects/use-projects";
import { PRIORITY_OPTIONS } from "@/lib/tasks/filter-config";

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
