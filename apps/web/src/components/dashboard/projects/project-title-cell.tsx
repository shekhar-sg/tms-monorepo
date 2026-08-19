import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateProject } from "@/hooks/projects/use-projects";

interface ProjectTitleCellProps {
  projectId: string;
  title: string;
}

const ProjectTitleCell = ({ projectId, title }: ProjectTitleCellProps) => {
  const [value, setValue] = useState(title);

  const { mutate: updateProject, isPending } = useUpdateProject();

  useEffect(() => {
    setValue(title);
  }, [title]);

  const save = () => {
    const nextValue = value.trim();

    if (!nextValue || nextValue === title) {
      setValue(title);
      return;
    }

    updateProject(
      {
        projectId,
        data: {
          title: nextValue,
        },
      },
      {
        onError: () => {
          setValue(title);
        },
      }
    );
  };

  return (
    <Input
      value={value}
      disabled={isPending}
      className={"border-none"}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onBlur={save}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          save();
        }
        if (event.key === "Escape") {
          setValue(title);
        }
      }}
    />
  );
};

export default ProjectTitleCell;
