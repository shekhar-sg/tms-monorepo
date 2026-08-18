"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import { type Control, Controller } from "react-hook-form";
import { PiArrowRight } from "react-icons/pi";
import FilterSelect from "@/components/dashboard/kanban/shared/filter-select";
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
import { TaskFormValues } from "@/components/dashboard/tasks/new/task-page";
import TaskUpdates from "@/components/dashboard/tasks/new/task-updates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
            render={({ field, fieldState }) => (
              <Field>
                <FilterSelect
                  value={field.value}
                  options={STATUS_OPTIONS}
                  placeholder="Status"
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </DetailItem>
        <DetailItem title={"Priority"}>
          <Controller
            name={"priority"}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FilterSelect
                  value={field.value}
                  options={PRIORITY_OPTIONS}
                  placeholder={"Priority"}
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
