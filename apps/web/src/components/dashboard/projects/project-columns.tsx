// "use client";
//
// import type { Project } from "@repo/types";
// import {
//   type ColumnDef,
//   columnVisibilityFeature,
//   createColumnHelper,
//   type TableFeatures,
//   tableFeatures,
// } from "@tanstack/react-table";
// import { useForm } from "react-hook-form";
// import { RiMoreLine } from "react-icons/ri";
// import { PRIORITY_OPTIONS } from "@/components/dashboard/kanban/toolbar/filter-config";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useUpdateProject } from "@/hooks/projects/use-projects";
//
// export const projectTableFeatures = tableFeatures({
//   columnVisibilityFeature,
// });
//
// const columnHelper = createColumnHelper<typeof projectTableFeatures, Project>();
//
// export const useProjectColumns = () => {
//   const { mutate, isPending } = useUpdateProject();
//   const { control, reset, handleSubmit } = useForm({});
//
//   const projectColumns: ColumnDef<TableFeatures, Project>[] =
//     columnHelper.columns([
//       columnHelper.accessor("title", {
//         header: "Project",
//       }),
//
//       columnHelper.accessor("priority", {
//         header: "Priority",
//
//         cell: ({ row }) => {
//           const priority = row.original.priority;
//           const option = PRIORITY_OPTIONS.find(
//             (item) => item.value === priority
//           );
//
//           const label = option?.label ?? "No Priority";
//           const Icon = option?.icon;
//           return (
//             <Badge variant={"ghost"} className={option?.color}>
//               {Icon && <Icon />}
//               {label}
//             </Badge>
//           );
//         },
//       }),
//
//       columnHelper.accessor("lead", {
//         header: "Lead",
//
//         cell: ({ row }) => {
//           const lead = row.original.lead;
//           if (!lead) {
//             return <span className="text-muted-foreground">—</span>;
//           }
//           return (
//             <Avatar size={"sm"}>
//               {lead.avatar && (
//                 <AvatarImage src={lead.avatar} alt={lead.name ?? ""} />
//               )}
//               <AvatarFallback>
//                 {lead.name
//                   ?.split(" ")
//                   .map((part) => part[0])
//                   .join("")
//                   .slice(0, 2)
//                   .toUpperCase() ?? "U"}
//               </AvatarFallback>
//             </Avatar>
//           );
//         },
//       }),
//
//       columnHelper.accessor("dueDate", {
//         header: "Due Date",
//         cell: ({ row }) => {
//           const dueData = row.original.dueDate;
//           return <span className="text-muted-foreground">{dueData}</span>;
//         },
//       }),
//
//       columnHelper.display({
//         id: "actions",
//         header: "Actions",
//         enableHiding: false,
//
//         cell: ({ row }) => (
//           <Button variant={"ghost"} size={"icon-sm"}>
//             <RiMoreLine />
//           </Button>
//         ),
//       }),
//     ]) as ColumnDef<TableFeatures, Project>[];
//
//   return { projectColumns };
// };

"use client";

import type { Priority, Project } from "@repo/types";
import {
  type ColumnDef,
  columnVisibilityFeature,
  createColumnHelper,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import { RiMoreLine } from "react-icons/ri";
import ProjectDueDateCell from "@/components/dashboard/projects/project-due-date-cell";
import ProjectPriorityCell from "@/components/dashboard/projects/project-priority-cell";
import ProjectTitleCell from "@/components/dashboard/projects/project-title-cell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const projectTableFeatures = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof projectTableFeatures, Project>();

export const projectColumns: ColumnDef<TableFeatures, Project>[] =
  columnHelper.columns([
    columnHelper.accessor("title", {
      header: "Project",

      cell: ({ row }) => (
        <ProjectTitleCell
          projectId={row.original.id}
          title={row.original.title}
        />
      ),
    }),

    columnHelper.accessor("priority", {
      header: "Priority",

      cell: ({ row }) => (
        <ProjectPriorityCell
          projectId={row.original.id}
          priority={row.original.priority as Priority}
        />
      ),
    }),

    columnHelper.accessor("lead", {
      header: "Lead",

      cell: ({ row }) => {
        const lead = row.original.lead;
        return (
          <Avatar size="sm">
            {lead.avatar && (
              <AvatarImage src={lead.avatar} alt={lead.name ?? ""} />
            )}
            <AvatarFallback>
              {lead.name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        );
      },
    }),

    columnHelper.accessor("dueDate", {
      header: "Due Date",

      cell: ({ row }) => (
        <ProjectDueDateCell
          projectId={row.original.id}
          dueDate={row.original.dueDate}
        />
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: () => (
        <Button variant="ghost" size={"icon-sm"}>
          <RiMoreLine />
        </Button>
      ),
    }),
  ]) as ColumnDef<TableFeatures, Project>[];
