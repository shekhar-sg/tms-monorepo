"use client";

import KanbanCard from "@/components/dashboard/kanban/kanban-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { RiMoreLine } from "react-icons/ri";
import { MdDragIndicator } from "react-icons/md";

const KanbanColumn = ({ length }: { length: number }) => {
  return (
    <Card data-size={"xs"} className={"bg-accent h-min rounded-md"}>
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle
          className={
            "flex items-center justify-start gap-1.5 text-xs font-semibold"
          }
        >
          <MdDragIndicator size={16} /> To Do
        </CardTitle>
        <CardAction>
          <Button variant={"ghost"} size={"icon-sm"}>
            <LuPlus />
          </Button>
          <Button variant={"ghost"} size={"icon-sm"}>
            <RiMoreLine />
          </Button>
        </CardAction>
      </CardHeader>
      {/*<ScrollArea className={"h-200"}>*/}
      <CardContent className={"flex flex-col gap-2 my-1"}>
        {Array.from({ length }, (_, index) => (
          <KanbanCard key={index} />
        ))}
      </CardContent>
      <ScrollBar />
      {/*</ScrollArea>*/}
      <CardAction className={"px-2.5"}>
        <Button variant={"ghost"}>
          <LuPlus /> Add Task
        </Button>
      </CardAction>
    </Card>
  );
};

export default KanbanColumn;
