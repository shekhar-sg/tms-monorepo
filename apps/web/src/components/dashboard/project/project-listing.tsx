"use client";

import { LuPlus } from "react-icons/lu";
import DataTable from "@/components/dashboard/kanban/shared/data-table";
import Toolbar from "@/components/dashboard/kanban/toolbar";
import {
  projectColumns,
  projectTableFeatures,
} from "@/components/dashboard/project/project-columns";
import { useCreateProject, useProjects } from "@/hooks/projects/use-projects";

const ProjectListing = () => {
  const { data: projects } = useProjects();

  const { mutate: createProject, isPending } = useCreateProject();

  const handleAddProject = () => {
    createProject({
      title: "Untitled Project",
    });
  };

  return (
    <div className={"flex flex-col gap-1 p-4"}>
      <Toolbar page={"projects"} view={"list"} onViewChange={() => {}} />
      <div className={"m-2"}>
        <DataTable
          features={projectTableFeatures}
          columns={projectColumns}
          data={projects ?? []}
          getRowId={(project) => project.id}
          emptyMessage="No projects found."
          addButtonProps={{
            disabled: isPending,
            onClick: handleAddProject,
            children: (
              <>
                <LuPlus />
                {isPending ? "Adding..." : "Add Project"}
              </>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ProjectListing;
