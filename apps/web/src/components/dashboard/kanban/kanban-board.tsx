import KanbanColumn from "@/components/dashboard/kanban/kanban-column"

const KanbanBoard = () => {
  return (
    <div className={"flex gap-4"}>
      <KanbanColumn />
      <KanbanColumn />
      <KanbanColumn />
    </div>
  )
}

export default KanbanBoard
