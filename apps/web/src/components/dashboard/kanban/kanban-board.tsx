import KanbanColumn from "@/components/dashboard/kanban/kanban-column";
import { ScrollArea } from "@/components/ui/scroll-area";

const KanbanBoard = () => {
  return (
    <ScrollArea
      className={"w-full border-none rounded-md border whitespace-nowrap"}
    >
      <div className={"flex w-svw gap-4 m-2"}>
        <KanbanColumn length={3} />
        <KanbanColumn length={2} />
        <KanbanColumn length={3} />
        <KanbanColumn length={4} />
      </div>
    </ScrollArea>
  );
};

export default KanbanBoard;
