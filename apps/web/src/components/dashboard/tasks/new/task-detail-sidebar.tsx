"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import { type Control, Controller } from "react-hook-form";
import { PiArrowRight } from "react-icons/pi";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "@/components/dashboard/kanban/toolbar/filter-config";
import CollapsibleCard from "@/components/dashboard/tasks/new/collapsible-card";
import DatePicker from "@/components/dashboard/tasks/new/date-picker";
import LabelsCombobox from "@/components/dashboard/tasks/new/labels-combobox";
import MembersSelect from "@/components/dashboard/tasks/new/members-select";
import ProjectSelect from "@/components/dashboard/tasks/new/project-select";
import ReporterSelect from "@/components/dashboard/tasks/new/reporter-select";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import { TaskFormValues } from "@/components/dashboard/tasks/new/task-page";
import TaskUpdates from "@/components/dashboard/tasks/new/task-updates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { Item, ItemActions, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";

interface TaskSidebarProps {
  isOpen: boolean;
  control: Control<TaskFormValues>;
  taskId: string;
}

const TaskDetailsSidebar = (props: TaskSidebarProps) => {
  const { isOpen, control, taskId } = props;
  return (
    <aside
      className={cn("max-w-xs space-y-5", {
        hidden: !isOpen,
      })}
    >
      <CollapsibleCard title={"details"}>
        <DetailItem title={"Project"}>
          <ProjectSelect control={control} />
        </DetailItem>
        <DetailItem title={"Status"}>
          <Controller
            name={"status"}
            control={control}
            render={({ field, fieldState }) => {
              const selected = STATUS_OPTIONS.find(
                (option) => option.value === field.value
              );

              const SelectedIcon = selected?.icon;

              return (
                <Field>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 justify-start gap-2 px-2"
                        >
                          {SelectedIcon && (
                            <SelectedIcon className={selected.color} />
                          )}

                          {selected?.label ?? "Status"}
                        </Button>
                      }
                    />

                    <DropdownMenuContent className="w-48 p-1.5">
                      <SelectOptions
                        options={STATUS_OPTIONS}
                        type="single-select"
                        selected={field.value ? [field.value] : []}
                        onChange={(values: string[]) => {
                          field.onChange(values[0] ?? "");
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </DetailItem>
        <DetailItem title="Priority">
          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState }) => {
              const selected = PRIORITY_OPTIONS.find(
                (option) => option.value === field.value
              );

              const SelectedIcon = selected?.icon;

              return (
                <Field>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 justify-start gap-2 px-2"
                        >
                          {SelectedIcon && (
                            <SelectedIcon className={selected.color} />
                          )}

                          {selected?.label ?? "Priority"}
                        </Button>
                      }
                    />

                    <DropdownMenuContent className={"w-48 p-1.5"}>
                      <SelectOptions
                        options={PRIORITY_OPTIONS}
                        type="single-select"
                        selected={field.value ? [field.value] : []}
                        onChange={(values: string[]) => {
                          field.onChange(values[0] ?? "");
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </DetailItem>
        <DetailItem title={"Members"}>
          <Controller
            name={"members"}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <MembersSelect control={control} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </DetailItem>
        <DetailItem title={"Dates"}>
          <DatePicker
            control={control}
            Trigger={({ range }) => (
              <Button
                variant={"ghost"}
                className={
                  "flex cursor-pointer items-center justify-start gap-2.5 text-muted-foreground"
                }
              >
                <Badge variant="outline">
                  <CalendarIcon />
                  {range?.from ? format(range.from, "d MMM") : "Start"}
                </Badge>

                <PiArrowRight />

                <Badge variant="outline">
                  <CalendarIcon />
                  {range?.to ? format(range.to, "d MMM") : "End"}
                </Badge>
              </Button>
            )}
          />
        </DetailItem>
        <DetailItem title={"Labels"}>
          <LabelsCombobox control={control} />
        </DetailItem>
        <DetailItem title={"Reporter"}>
          <ReporterSelect control={control} />
        </DetailItem>
      </CollapsibleCard>

      <TaskUpdates taskId={taskId} />
    </aside>
  );
};

export default TaskDetailsSidebar;

const DetailItem = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <Item className={"flex-nowrap p-0"}>
      <ItemTitle className={"w-full max-w-16 text-muted-foreground"}>
        {title}
      </ItemTitle>

      <ItemActions>{children}</ItemActions>
    </Item>
  );
};
