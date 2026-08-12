import CollapsibleCard from "@/components/dashboard/tasks/new/collapsible-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

const TaskUpdates = () => {
  return (
    <CollapsibleCard title={"Updates"}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Item key={i} variant={"default"} className={"p-0"}>
          <ItemMedia className={"mt-1.5"}>
            <Avatar size={"sm"}>
              <AvatarImage src={"https://github.com/evilrabbit.png"} />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className={"gap-0"}>
            <ItemTitle>Evil Rabbit</ItemTitle>
            <ItemDescription
              className={"min-w-0 flex-1 line-clamp-1 text-ellipsis"}
            >
              Last seen 5 months ago before some tasks
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </CollapsibleCard>
  );
};

export default TaskUpdates;
