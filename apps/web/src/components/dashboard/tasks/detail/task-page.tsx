"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  type CreateTaskInput,
  createTaskSchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from "@repo/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { LuLock, LuLockOpen, LuPanelLeft, LuShare2 } from "react-icons/lu";
import AutoSave from "@/components/dashboard/tasks/detail/auto-save";
import TaskComments from "@/components/dashboard/tasks/detail/task-comments";
import TaskDetailsSidebar from "@/components/dashboard/tasks/detail/task-detail-sidebar";
import TaskMetadataProperties from "@/components/dashboard/tasks/detail/task-metadata";
import TaskActions from "@/components/dashboard/tasks/feed/shared/task-actions";
import TaskSubtasks from "@/components/dashboard/tasks/subtasks/subtasks";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/ui/query-state";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCurrentUser } from "@/hooks/auth/use-auth";
import { useProjects } from "@/hooks/projects/use-projects";

import { useCreateTask, useTask, useUpdateTask } from "@/hooks/tasks/use-tasks";

import { useIsMobile } from "@/hooks/use-mobile";

import { useBreadcrumb } from "@/providers/breadcrumb-context";

export type TaskFormValues = Omit<CreateTaskInput, "reporterId"> & {
  reporterId: string | null;

  dateRange?: DateRange;
};

const defaultValues: TaskFormValues = {
  title: "",

  description: null,

  resource: null,

  priority: "NONE",

  status: "TODO",

  projectId: "",

  reporterId: "",

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

  const {
    data,
    isPending: isLoading,
    error,
    refetch,
  } = useTask(isCreate ? "" : taskId);

  const { data: currentUser } = useCurrentUser();

  const { data: projects } = useProjects();

  const initialized = useRef<string | null>(null);
  const previousServerValues = useRef<TaskFormValues | null>(null);

  const { setDynamicLabel } = useBreadcrumb();

  const router = useRouter();

  const { mutate: createTask, isPending: isCreating } = useCreateTask();

  const { mutateAsync: updateTask } = useUpdateTask();

  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const [isUpdate, setIsUpdate] = useState(true);

  const isMobile = useIsMobile();

  const resolver = (
    isCreate ? zodResolver(createTaskSchema) : zodResolver(updateTaskSchema)
  ) as Resolver<TaskFormValues>;

  const { handleSubmit, control, reset, getValues, trigger, setValue } =
    useForm<TaskFormValues>({
      resolver,

      defaultValues: {
        ...defaultValues,

        projectId: projectId ?? data?.projectId ?? "",

        parentId: parentId,
      },
    });

  useEffect(() => {
    if (isCreate || !data) {
      return;
    }

    const nextValues: TaskFormValues = {
      title: data.title,

      description: data.description,

      resource: data.resource,

      priority: data.priority,

      status: data.status,

      projectId: data.projectId,

      reporterId: data.reporterId,

      members: data.members.map((member) => member.userId),

      parentId: data.parentId,

      startDate: data.startDate,

      endDate: data.endDate,

      labels: data.labels.map((label) => label.labelId),

      position: data.position,

      dateRange: {
        from: data.startDate ? new Date(data.startDate) : undefined,
        to: data.endDate ? new Date(data.endDate) : undefined,
      },
    };
    if (initialized.current !== taskId) {
      initialized.current = taskId;
      reset(nextValues);
    } else if (previousServerValues.current) {
      // Apply external updates only to fields unchanged locally since the last
      // server snapshot. A slow response must never replace newer typing.
      const current = getValues();
      for (const key of Object.keys(nextValues) as (keyof TaskFormValues)[]) {
        if (JSON.stringify(current[key]) === JSON.stringify(previousServerValues.current[key]) &&
            JSON.stringify(current[key]) !== JSON.stringify(nextValues[key])) {
          setValue(key, nextValues[key]);
        }
      }
    }
    previousServerValues.current = nextValues;
  }, [data, isCreate, reset, taskId, getValues, setValue]);

  useEffect(() => {
    if (isCreate && currentUser && !getValues("reporterId"))
      setValue("reporterId", currentUser.id);
  }, [isCreate, currentUser, getValues, setValue]);

  useEffect(() => {
    if (isCreate) {
      setDynamicLabel("Create Task");

      return;
    }

    setDynamicLabel(data?.title ?? null);
  }, [data?.title, isCreate, setDynamicLabel]);

  const onSubmit = (values: TaskFormValues) => {
    const { dateRange, ...taskValues } = values;

    if (isCreate) {
      if (isCreating) return;

      const payload: CreateTaskInput = {
        ...taskValues,
        reporterId: taskValues.reporterId ?? "",

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

    void updateTask({ taskId, data: payload }).catch(() => undefined);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.title,

          text: `Check out "${data?.title}"`,

          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      toast.add({ type: "success", title: "Task link copied" });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        toast.add({
          type: "error",
          title: "Could not share task",
          description: "Copy the address from your browser to share this task.",
        });
    }
  };

  if (!isCreate && (isLoading || (data && initialized.current !== taskId)))
    return (
      <div className="workspace-page">
        <QueryState loading title="Loading task…" />
      </div>
    );

  if (!isCreate && error) {
    const missing = axios.isAxiosError(error) && error.response?.status === 404;

    return (
      <div className="workspace-page">
        <QueryState
          error
          title={missing ? "Task not found" : "Task unavailable"}
          description={
            missing
              ? "This task was removed or you do not have access."
              : "Check your connection and try again."
          }
          onRetry={missing ? undefined : () => void refetch()}
        >
          <Link
            href="/dashboard/tasks"
            className="text-sm text-primary underline"
          >
            Back to tasks
          </Link>
        </QueryState>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="workspace-page space-y-6"
      key={taskId}
    >
      {!isCreate && (
        <AutoSave
          control={control}
          getValues={getValues}
          enabled={Boolean(data) && isUpdate}
          validate={trigger}
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
          onSave={(payload) =>
            updateTask({
              taskId,
              data: { ...payload, reporterId: payload.reporterId || null },
            })
          }
        />
      )}

      <div
        className={"flex flex-col-reverse gap-4 sm:flex-row justify-between"}
      >
        <div className="min-w-0 flex-1 space-y-3">
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
                  className={
                    "w-full bg-transparent! text-2xl! font-semibold focus-visible:ring-0 tracking-tight p-0 border-none m-0"
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
                  value={field.value ?? ""}
                  aria-invalid={fieldState.invalid}
                  className={
                    "w-full bg-transparent! resize-none min-h-fit border-none p-0 text-muted-foreground focus-visible:ring-0 text-sm leading-relaxed"
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

        <div className="flex shrink-0 flex-wrap gap-2">
          {!isCreate && <TaskActions taskId={taskId} />}

          <Button
            type="button"
            aria-label={isUpdate ? "Pause autosave" : "Resume autosave"}
            aria-pressed={!isUpdate}
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              setIsUpdate((prev) => !prev);
            }}
          >
            {isUpdate ? <LuLockOpen /> : <LuLock />}
          </Button>

          <Button
            variant={"outline"}
            size={"icon"}
            className={"rounded-[4px]"}
            type="button"
            aria-label="Share task"
            disabled={isCreate}
            onClick={handleShare}
          >
            <LuShare2 />
          </Button>

          <Button
            type="button"
            aria-label="Toggle task details"
            aria-expanded={isDetailsOpen}
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

      {!isCreate && !isUpdate && (
        <p role="status" className="rounded-lg border bg-muted p-3 text-sm">
          Autosave is paused. Resume autosave to save your edits.
        </p>
      )}

      {isCreate && projects?.length === 0 && (
        <QueryState
          title="Create your first project"
          description="Tasks belong to projects. Create a project before adding a task."
        >
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/projects" />}
          >
            Go to projects
          </Button>
        </QueryState>
      )}

      <div className="flex min-w-0 gap-6">
        <div className="min-w-0 flex-1 space-y-6">
          <TaskMetadataProperties control={control} />

          {data && !data.parentId && (
            <TaskSubtasks
              subtasks={data.subtasks}
              taskId={taskId}
              projectId={data.projectId}
            />
          )}

          {isCreate && (
            <Button
              type="submit"
              disabled={isCreating || projects?.length === 0}
            >
              {isCreating ? "Creating task…" : "Create Task"}
            </Button>
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
    </form>
  );
};

export default TaskPage;
