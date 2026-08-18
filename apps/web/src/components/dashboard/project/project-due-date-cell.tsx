import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateProject } from "@/hooks/projects/use-projects";

interface ProjectDueDateCellProps {
  projectId: string;
  dueDate: string | null;
}

const ProjectDueDateCell = ({
  projectId,
  dueDate,
}: ProjectDueDateCellProps) => {
  const { mutate: updateProject, isPending } = useUpdateProject();

  const selectedDate = dueDate ? new Date(dueDate) : undefined;

  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(selectedDate)
    : "No date";

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            disabled={isPending}
            className="h-auto justify-start px-2 font-normal"
          >
            {formattedDate}
          </Button>
        }
      />

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={"single"}
          selected={selectedDate}
          onSelect={(date) => {
            updateProject({
              projectId,
              data: {
                dueDate: date?.toISOString() ?? null,
              },
            });
          }}
        />

        {dueDate && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                updateProject({
                  projectId,
                  data: {
                    dueDate: null,
                  },
                });
              }}
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProjectDueDateCell;
