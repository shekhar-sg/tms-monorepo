"use client";
import { useState } from "react";
import { LuEye, LuLock, LuPanelLeft, LuShare2 } from "react-icons/lu";
import { TbDots } from "react-icons/tb";
import TaskComments from "@/components/dashboard/tasks/new/task-comments";
import TaskDetailsSidebar from "@/components/dashboard/tasks/new/task-detail-sidebar";
import TaskMetadataProperties from "@/components/dashboard/tasks/new/task-metadata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

const TaskPage = () => {
  const [title, setTitle] = useState("Write API Documentation");
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [description, setDescription] = useState(
    "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively."
  );
  const isMobile = useIsMobile();

  return (
    <div className={"space-y-5 p-6 items-center justify-center"}>
      <div
        className={"flex flex-col-reverse gap-4 sm:flex-row justify-between"}
      >
        <div className={"max-w-3xl"}>
          <Input
            type={"text"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => console.log("blur title")}
            className={
              "w-full bg-transparent text-2xl! font-semibold focus-visible:ring-0 tracking-tight p-0 border-none m-0"
            }
            placeholder={"Untitled Task"}
          />

          <Textarea
            cols={399}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => console.log("blur text area")}
            className={
              "w-full resize-none min-h-fit border-none p-0 text-muted-foreground focus-visible:ring-0 text-sm leading-relaxed"
            }
            placeholder={"Add a description..."}
          />
        </div>

        <div className={"flex gap-2 max-sm:self-end max-sm:w-full"}>
          <Button variant={"outline"} size={"icon"} className={"rounded-[4px]"}>
            <LuLock />
          </Button>
          <Button variant={"outline"} className={"rounded-[4px]"}>
            <LuEye /> &nbsp;1
          </Button>
          <Button variant={"outline"} size={"icon"} className={"rounded-[4px]"}>
            <LuShare2 />
          </Button>
          <Button variant={"outline"} size={"icon"} className={"rounded-[4px] max-sm:ml-auto"}>
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
          <TaskMetadataProperties />
          {isMobile && <TaskDetailsSidebar isOpen={true} />}
          <TaskComments />
        </div>
        {!isMobile && <TaskDetailsSidebar isOpen={isDetailsOpen} />}
      </div>
    </div>
  );
};

export default TaskPage;
