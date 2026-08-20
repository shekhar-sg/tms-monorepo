"use client";

import type { Task } from "@repo/types";
import { LuChevronDown } from "react-icons/lu";
import TaskTable from "@/components/dashboard/tasks/feed/list/task-table";
import EmptyState from "@/components/dashboard/tasks/feed/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type TaskListGroupProps = {
  id: string;
  title: string;
  index: number;
  tasks: Task[];
};

const TaskListGroup = (props: TaskListGroupProps) => {
  const { id, title, tasks } = props;

  return (
    <Collapsible defaultOpen>
      <section>
        <CollapsibleTrigger render={<Button variant={"link"} />}>
          <LuChevronDown />
          {title}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <TaskTable columnId={id} tasks={tasks} />
          )}
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
};

export default TaskListGroup;
