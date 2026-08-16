"use client";

import DataTable from "@/components/dashboard/kanban/shared/data-table";
import Toolbar from "@/components/dashboard/kanban/toolbar";
import {
  projectColumns,
  projectTableFeatures,
} from "@/components/dashboard/project/project-columns";
import { useProjects } from "@/hooks/projects/use-projects";

const ProjectPage = () => {
  const { data: projects } = useProjects();

  console.log({projects})
  return (
    <div className={"flex flex-col gap-1 p-4"}>
      <Toolbar page={"projects"} view={"list"} onViewChange={() => {}} />
      <div className={"m-2"}>
        <DataTable
          features={projectTableFeatures}
          columns={projectColumns}
          data={projects??[]}
          getRowId={(project) => project.id}
          emptyMessage="No projects found."
        />
      </div>
    </div>
  );
};

export default ProjectPage;
