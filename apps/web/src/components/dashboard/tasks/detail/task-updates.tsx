"use client";

import type { TaskActivity } from "@repo/types";
import CollapsibleCard from "@/components/dashboard/tasks/detail/collapsible-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useTaskActivities } from "@/hooks/tasks/use-task-activities";

interface TaskUpdatesProps {
  taskId: string;
}

const TaskUpdates = ({ taskId }: TaskUpdatesProps) => {
  const { data: activities = [] } = useTaskActivities(taskId);

  return (
    <CollapsibleCard title={"Updates"}>
      {activities.map((activity) => (
        <Item key={activity.id} variant={"default"} className={"p-0"}>
          <ItemMedia className={"mt-1.5"}>
            <Avatar size={"sm"}>
              <AvatarImage src={activity.user.avatar ?? undefined} />
              <AvatarFallback>
                {activity.user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>

          <ItemContent className={"gap-0"}>
            <ItemTitle>{activity.user.name ?? "User"}</ItemTitle>

            <ItemDescription
              className={"min-w-0 flex-1 line-clamp-1 text-ellipsis"}
            >
              {getActivityDescription(activity)}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </CollapsibleCard>
  );
};

const getActivityDescription = (activity: TaskActivity) => {
  const metadata = activity.metadata ?? {};

  switch (activity.type) {
    case "CREATED":
      return "created this task";

    case "STATUS_CHANGED":
      return `changed status from ${String(metadata.from)} to ${String(metadata.to)}`;

    case "PRIORITY_CHANGED":
      return `changed priority from ${String(metadata.from)} to ${String(metadata.to)}`;

    case "PROJECT_CHANGED":
      return "changed the projects";

    case "REPORTER_CHANGED":
      return "changed the reporter";

    case "RESOURCE_CHANGED":
      return "changed the resource";

    case "MEMBER_ADDED":
      return "added a member";

    case "MEMBER_REMOVED":
      return "removed a member";

    case "LABEL_ADDED":
      return "added a label";

    case "LABEL_REMOVED":
      return "removed a label";

    case "UPDATED":
      return "updated this task";

    case "COMMENT_ADDED":
      return metadata.parentId ? "replied to a comment" : "added a comment";

    default:
      return "updated this task";
  }
};

export default TaskUpdates;
