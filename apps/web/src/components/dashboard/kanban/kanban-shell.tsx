import KanbanBoard from "@/components/dashboard/kanban/kanban-board";
import KanbanToolbar from "@/components/dashboard/kanban/kanban-header/kanban-toolbar";

const KanbanShell = () => {
  return (
    <div className={"flex flex-col gap-4 p-6"}>
      <KanbanToolbar />
      <KanbanBoard />
    </div>
  );
};

export default KanbanShell;
