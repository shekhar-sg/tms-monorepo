"use client";

import { type Control, Controller } from "react-hook-form";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import type { TaskFormValues } from "@/components/dashboard/tasks/new/task-page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { useProjects } from "@/hooks/projects/use-projects";

interface ProjectSelectProps {
  control: Control<TaskFormValues>;
}

const ProjectSelect = ({ control }: ProjectSelectProps) => {
  const { data: projects = [] } = useProjects();

  return (
    <Controller
      name={"projectId"}
      control={control}
      render={({ field, fieldState }) => {
        const selectedProject = projects.find(
          (project) => project.id === field.value
        );

        return (
          <Field data-invalid={fieldState.invalid}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className={"h-8 justify-start gap-2 px-2"}
                  >
                    {selectedProject?.title ?? "Select project"}
                  </Button>
                }
              />

              <DropdownMenuContent className={"w-48 p-1.5"}>
                <SelectOptions
                  options={projects.map((project) => ({
                    value: project.id,
                    label: project.title,
                  }))}
                  type={"single-select"}
                  selected={field.value ? [field.value] : []}
                  onChange={(values) => {
                    field.onChange(values[0] ?? "");
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default ProjectSelect;
