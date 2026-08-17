"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateTaskInput,
  createTaskSchema,
  updateTaskSchema,
} from "@repo/types";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Controller, type Resolver, useForm } from "react-hook-form";
import {
  LuEye,
  LuLock,
  LuLockOpen,
  LuPanelLeft,
  LuShare2,
} from "react-icons/lu";
import { TbDots } from "react-icons/tb";
import TaskComments from "@/components/dashboard/tasks/new/task-comments";
import TaskDetailsSidebar from "@/components/dashboard/tasks/new/task-detail-sidebar";
import TaskMetadataProperties from "@/components/dashboard/tasks/new/task-metadata";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

export const AVAILABLE_LABELS = [
  "Research",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Frontend",
  "Backend",
];

export type CreateTaskInputWithMore = CreateTaskInput & {
  labels?: typeof AVAILABLE_LABELS;
  resource?: string;
  dateRange?: DateRange;
  members?: string[];
};

const TaskPage = () => {
  const [title, setTitle] = useState("Write API Documentation");
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [description, setDescription] = useState(
    "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively."
  );
  const [isUpdate, setIsUpdate] = useState(true);
  const isMobile = useIsMobile();
  const resolver = (
    isUpdate ? zodResolver(createTaskSchema) : zodResolver(updateTaskSchema)
  ) as Resolver<CreateTaskInputWithMore>;

  const { control } = useForm<CreateTaskInputWithMore>({
    resolver,
  });

  return (
    <div className={"space-y-5 p-6 items-center justify-center"}>
      <div
        className={"flex flex-col-reverse gap-4 sm:flex-row justify-between"}
      >
        <div className={"max-w-3xl"}>
          <Controller
            control={control}
            name={"title"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type={"text"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => console.log("blur title")}
                  className={
                    "w-full bg-transparent text-2xl! font-semibold focus-visible:ring-0 tracking-tight p-0 border-none m-0"
                  }
                  placeholder={"Untitled Task"}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={"description"}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <Textarea
                  {...field}
                  cols={399}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => console.log("blur text area")}
                  className={
                    "w-full resize-none min-h-fit border-none p-0 text-muted-foreground focus-visible:ring-0 text-sm leading-relaxed"
                  }
                  placeholder={"Add a description..."}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className={"flex gap-2 max-sm:self-end max-sm:w-full"}>
          <Button
            variant={"outline"}
            size={"icon"}
            className={"rounded-[4px] cursor-pointer"}
            onClick={() => {
              setIsUpdate((prev) => !prev);
            }}
          >
            {isUpdate ? <LuLockOpen /> : <LuLock />}
          </Button>
          <Button
            variant={"outline"}
            className={"rounded-[4px] cursor-pointer"}
          >
            <LuEye /> &nbsp;1
          </Button>
          <Button variant={"outline"} size={"icon"} className={"rounded-[4px]"}>
            <LuShare2 />
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            className={"rounded-[4px] max-sm:ml-auto"}
          >
            <TbDots />
          </Button>
          <Button
            variant={isDetailsOpen ? "secondary" : "outline"}
            size={"icon"}
            className={"rounded-[4px] max-md:hidden"}
            onClick={() => {
              setIsDetailsOpen((prev) => !prev);
            }}
          >
            <LuPanelLeft />
          </Button>
        </div>
      </div>
      <div className={"flex gap-5"}>
        <div className={"space-y-5 flex-1"}>
          <TaskMetadataProperties control={control} />
          {isMobile && <TaskDetailsSidebar isOpen={true} control={control} />}
          <TaskComments />
        </div>
        {!isMobile && (
          <TaskDetailsSidebar isOpen={isDetailsOpen} control={control} />
        )}
      </div>
    </div>
  );
};

export default TaskPage;
