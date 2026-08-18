"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateTaskInput,
  createTaskSchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from "@repo/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import AutoSave from "@/components/dashboard/kanban/shared/auto-save";
import TaskComments from "@/components/dashboard/tasks/new/task-comments";
import TaskDetailsSidebar from "@/components/dashboard/tasks/new/task-detail-sidebar";
import TaskMetadataProperties from "@/components/dashboard/tasks/new/task-metadata";
import TaskSubtasks from "@/components/dashboard/tasks/subtasks/subtasks";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask, useTask, useUpdateTask } from "@/hooks/tasks/use-tasks";
import { useIsMobile } from "@/hooks/use-mobile";

export type TaskFormValues = CreateTaskInput & {
  dateRange?: DateRange;
};

const defaultValues: TaskFormValues = {
  title: "",
  description: null,
  resource: null,
  priority: "NONE",
  status: "TODO",
  projectId: "",
  reporterId: null,
  members: [],
  parentId: null,
  startDate: null,
  endDate: null,
  labels: [],
  position: 0,
  dateRange: undefined,
};

interface TaskPageProps {
  taskId: string;
  projectId?: string;
  parentId?: string;
}

const TaskPage = (props: TaskPageProps) => {
  const { taskId, parentId, projectId } = props;
  const isCreate = taskId === "new";
  const { data } = useTask(isCreate ? "" : taskId);
  const router = useRouter();

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isUpdate, setIsUpdate] = useState(true);

  const isMobile = useIsMobile();

  const resolver = (
    isCreate ? zodResolver(createTaskSchema) : zodResolver(updateTaskSchema)
  ) as Resolver<TaskFormValues>;

  const { handleSubmit, control, reset, getValues } = useForm<TaskFormValues>({
    resolver,
    defaultValues: {
      ...defaultValues,
      projectId: projectId ?? data?.projectId,
      parentId: parentId,
    },
  });

  useEffect(() => {
    if (isCreate || !data) {
      return;
    }
    reset({
      ...data,
      members: data.members.map((member) => member.userId),
      labels: data.labels.map((label) => label.labelId),
      dateRange: {
        from: data.startDate ? new Date(data.startDate) : undefined,
        to: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }, [data, isCreate, reset]);

  const onSubmit = (values: TaskFormValues) => {
    const { dateRange, ...taskValues } = values;

    if (isCreate) {
      const payload: CreateTaskInput = {
        ...taskValues,
        startDate: dateRange?.from?.toISOString() ?? null,
        endDate: dateRange?.to?.toISOString() ?? null,
      };

      createTask(payload, {
        onSuccess: ({ id }) => {
          router.push(`/dashboard/tasks/${id}`);
        },
      });

      return;
    }

    const payload: UpdateTaskInput = {
      ...taskValues,
      startDate: dateRange?.from?.toISOString() ?? null,
      endDate: dateRange?.to?.toISOString() ?? null,
    };

    updateTask({
      taskId,
      data: payload,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"space-y-5 p-6 items-center justify-center"}
    >
      {!isCreate && (
        <AutoSave
          control={control}
          getValues={getValues}
          enabled={Boolean(data)}
          transform={(values) => {
            const { dateRange, ...taskValues } = values;
            return {
              ...taskValues,
              title: taskValues.title ?? "",
              members: taskValues.members ?? [],
              labels: taskValues.labels ?? [],
              startDate: dateRange?.from?.toISOString() ?? null,
              endDate: dateRange?.to?.toISOString() ?? null,
            };
          }}
          onSave={(payload) => {
            updateTask({
              taskId,
              data: payload,
            });
          }}
        />
      )}
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
                  value={field.value}
                  aria-invalid={fieldState.invalid}
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
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  cols={399}
                  value={field.value ?? ""}
                  aria-invalid={fieldState.invalid}
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
          {data && !data.parentId && (
            <TaskSubtasks
              subtasks={data.subtasks}
              taskId={taskId}
              projectId={data.projectId}
            />
          )}

          {isMobile && (
            <TaskDetailsSidebar
              isOpen={true}
              control={control}
              taskId={taskId}
            />
          )}
          {!isCreate && <TaskComments taskId={taskId} />}
        </div>
        {!isMobile && (
          <TaskDetailsSidebar
            isOpen={isDetailsOpen}
            control={control}
            taskId={taskId}
          />
        )}
      </div>
      {isCreate && <Button type={"submit"}>Create Task</Button>}
    </form>
  );
};

export default TaskPage;
