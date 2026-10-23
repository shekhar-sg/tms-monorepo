"use client";

import {
  projectColumns,
  projectTableFeatures,
} from "@/components/dashboard/projects/project-columns";
import DataTable from "@/components/dashboard/tasks/feed/shared/data-table";
import { QueryState } from "@/components/ui/query-state";

import { useCreateProject, useProjects } from "@/hooks/projects/use-projects";

const ProjectListing = () => {
  const { data: projects, isPending: loading, error, refetch } = useProjects();

  const { mutate: createProject, isPending } = useCreateProject();

  const handleAddProject = () => {
    if (isPending) return;

    createProject({
      title: "Untitled Project",
    });
  };

  return (
    <div className="workspace-page space-y-6">
      <header>
        <h1 className="page-heading">Projects</h1>
        <p className="page-description">
          Bring related tasks together and keep your priorities in view.
        </p>
      </header>

      <div className="min-w-0">
        {loading ? (
          <QueryState loading title="Loading projects…" />
        ) : error ? (
          <QueryState
            error
            title="Projects unavailable"
            onRetry={() => void refetch()}
          />
        ) : (
          <>
            <DataTable
              features={projectTableFeatures}
              columns={projectColumns}
              data={projects ?? []}
              getRowId={(project) => project.id}
              emptyMessage="No projects found."
              addButtonProps={{
                disabled: isPending,

                onClick: handleAddProject,

                children: <>{isPending ? "Adding..." : "Add Project"}</>,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectListing;
