"use client";

import type { SubtaskSummary } from "@repo/types";
import { useRouter } from "next/navigation";
import { RiMoreLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface SubtaskListRowProps {
  row: SubtaskSummary;
}

const priorityVariant = {
  NONE: "ghost",
  URGENT: "destructive",
  HIGH: "destructive",
  MEDIUM: "outline",
  LOW: "secondary",
} as const;

const SubtaskListRow = ({ row }: SubtaskListRowProps) => {
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/dashboard/tasks/${row.id}`);
  };

  return (
    <TableRow>
      <TableCell className={"font-medium"}>{row.title}</TableCell>

      <TableCell>
        <Badge variant={priorityVariant[row.priority]}>
          {row.priority === "NONE" ? "No Priority" : row.priority}
        </Badge>
      </TableCell>

      <TableCell>
        {row.members?.length ? (
          <div className={"flex -space-x-2"}>
            {row.members.slice(0, 3).map((member) => (
              <Avatar key={member.userId} size={"sm"}>
                {member.user.avatar && <AvatarImage src={member.user.avatar} />}
                <AvatarFallback>
                  {member.user.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2) ?? "U"}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <span className={"text-muted-foreground"}>—</span>
        )}
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
