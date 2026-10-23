import { format } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CheckCheck,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProjects } from "@/lib/api/projects-api";
import { serverApi } from "@/lib/api/server-api";
import { getTasks } from "@/lib/api/tasks-api";
import { STATUS_OPTIONS } from "@/lib/tasks/filter-config";

export default async function DashboardPage() {
  const api = await serverApi();
  const [tasks, projects] = await Promise.all([
    getTasks(undefined, undefined, api),
    getProjects(api),
  ]);
  const today = new Date();
  const todayKey = format(today, "yyyy-MM-dd");
  const open = tasks.filter((task) => task.status !== "DONE");
  const dueToday = open.filter(
    (task) =>
      task.endDate && format(new Date(task.endDate), "yyyy-MM-dd") === todayKey
  );
  const overdue = open.filter(
    (task) =>
      task.endDate && format(new Date(task.endDate), "yyyy-MM-dd") < todayKey
  );
  const deadlines = open
    .filter((task) => task.endDate)
    .sort(
      (a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime()
    )
    .slice(0, 6);
  const completed = tasks.length - open.length;
  const metrics = [
    {
      label: "Total tasks",
      value: tasks.length,
      detail: `${projects.length} projects in your workspace`,
      icon: ListTodo,
    },
    {
      label: "Open tasks",
      value: open.length,
      detail: "Work still in progress",
      icon: Clock3,
    },
    {
      label: "Due today",
      value: dueToday.length,
      detail: "Open tasks due today",
      icon: CalendarDays,
    },
    {
      label: "Overdue",
      value: overdue.length,
      detail: "Open tasks past their deadline",
      icon: CheckCheck,
    },
  ];
  return (
    <div className="workspace-page space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Workspace overview
          </p>
          <h1 className="page-heading">Overview</h1>
          <p className="page-description">
            Your priorities, deadlines, and project progress.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link
              href={
                projects.length ? "/dashboard/tasks/new" : "/dashboard/projects"
              }
            />
          }
        >
          <Plus />
          {projects.length ? "Create task" : "Create a project"}
        </Button>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <Card
            key={label}
            className="gap-4 rounded-xl border shadow-none ring-0"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-xl border shadow-none ring-0 xl:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Deadlines to watch</CardTitle>
              <CardDescription className="mt-1">
                Your next open tasks, with overdue work first.
              </CardDescription>
            </div>
            <Button
              nativeButton={false}
              variant="ghost"
              size="sm"
              render={<Link href="/dashboard/tasks" />}
            >
              All tasks <ArrowRight />
            </Button>
          </CardHeader>
          <CardContent>
            {deadlines.length ? (
              <div className="divide-y">
                {deadlines.map((task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {
                          STATUS_OPTIONS.find(
                            (option) => option.value === task.status
                          )?.label
                        }
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.endDate &&
                        format(new Date(task.endDate), "yyyy-MM-dd") < todayKey
                          ? "destructive"
                          : "outline"
                      }
                      className="shrink-0"
                    >
                      <CalendarDays />
                      {format(new Date(task.endDate!), "d MMM")}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
                <CheckCheck className="size-6 text-muted-foreground" />
                <p className="text-sm font-medium">No pending deadlines</p>
                <p className="text-xs text-muted-foreground">
                  Tasks with due dates will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-none ring-0">
          <CardHeader>
            <CardTitle>Work by status</CardTitle>
            <CardDescription>
              {completed} of {tasks.length} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {STATUS_OPTIONS.map(({ value, label }) => {
              const count = tasks.filter(
                (task) => task.status === value
              ).length;
              const percentage = tasks.length
                ? Math.round((count / tasks.length) * 100)
                : 0;
              return (
                <div key={value}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span>{label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {count} · {percentage}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                    role="meter"
                    aria-label={label}
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent projects</h2>
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={<Link href="/dashboard/projects" />}
          >
            All projects <ArrowRight />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group min-w-0 rounded-xl border bg-card p-5 shadow-none transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-lg bg-muted p-2">
                  <FolderKanban className="size-4 text-primary" />
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="truncate text-sm font-semibold">
                {project.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {project.dueDate
                  ? `Due ${format(new Date(project.dueDate), "d MMM yyyy")}`
                  : "No due date set"}
              </p>
            </Link>
          ))}
        </div>
        {!projects.length && (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Organize your work with your first project.
            </p>
            <Button
              className="mt-4"
              nativeButton={false}
              render={<Link href="/dashboard/projects" />}
            >
              Create a project
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
