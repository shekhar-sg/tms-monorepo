"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import type { SubtaskSummary } from "@repo/types";
import { GripVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiMoreLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface SubtaskListRowProps {
  row: SubtaskSummary;
  index: number;
}

const priorityVariant = {
  NONE: "ghost",
  URGENT: "destructive",
  HIGH: "destructive",
  MEDIUM: "outline",
  LOW: "secondary",
} as const;

const SubtaskListRow = ({ row, index }: SubtaskListRowProps) => {
  const router = useRouter();
  const { ref, handleRef, isDragging } = useSortable({
    id: row.id,
    index,
    group: row.status,
    type: "task",
    accept: "task",
  });

  const handleOpen = () => {
    router.push(`/dashboard/tasks/${row.id}`);
  };

  return (
    <TableRow ref={ref} className={isDragging ? "opacity-40" : ""}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Button
            ref={handleRef}
            variant="ghost"
            size="icon-sm"
            className="cursor-grab touch-none"
            aria-label={`Move ${row.title}`}
          >
            <GripVertical />
          </Button>
          <span className={`status-dot status-${row.status}`} />
          <Link
            className="hover:text-primary"
            href={`/dashboard/tasks/${row.id}`}
          >
            {row.title}
          </Link>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={priorityVariant[row.priority]}>
          {row.priority === "NONE" ? "No Priority" : row.priority}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge variant="secondary">
          {row.status.replaceAll("_", " ").toLowerCase()}
        </Badge>
      </TableCell>

      <TableCell className={"text-muted-foreground"}>
        {row.endDate ? new Date(row.endDate).toLocaleDateString() : "—"}
      </TableCell>

      <TableCell className={"text-muted-foreground"}>
        <Button variant={"ghost"} size={"icon"} onClick={handleOpen}>
          <RiMoreLine />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SubtaskListRow;
