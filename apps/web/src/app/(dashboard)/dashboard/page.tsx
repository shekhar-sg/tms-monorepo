import { formatDate } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { getProjects } from "@/lib/api/projects-api";
import { serverApi } from "@/lib/api/server-api";
import { getTasks } from "@/lib/api/tasks-api";
import { STATUS_OPTIONS } from "@/lib/tasks/filter-config";

const DashboardPage = async () => {
  const api = await serverApi();

  const [tasks, projects] = await Promise.all([
    getTasks(undefined, undefined, api),
    getProjects(api),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const openTasks = tasks.filter((task) => task.status !== "DONE");

  const dueToday = tasks.filter((task) => {
    if (!task.endDate) {
      return false;
    }

    const dueDate = new Date(task.endDate);

    return dueDate >= today && dueDate < tomorrow;
  });

  const overdue = tasks.filter((task) => {
    if (!task.endDate || task.status === "DONE") {
      return false;
    }

    return new Date(task.endDate) < today;
  });

  const statusCounts = tasks.reduce<Record<string, number>>(
    (accumulator, task) => {
      accumulator[task.status] = (accumulator[task.status] ?? 0) + 1;

      return accumulator;
    },
    {}
  );

  const upcomingTasks = tasks
    .filter((task) => task.endDate && task.status !== "DONE")
    .sort(
      (a, b) =>
        new Date(a.endDate ?? "").getTime() -
        new Date(b.endDate ?? "").getTime()
    )
    .slice(0, 5);

  const statsMap: { name: string; value: number }[] = [
    {
      name: "Total Tasks",
      value: tasks.length,
    },
    {
      name: "Open Tasks",
      value: openTasks.length,
    },
    {
      name: "Due Today",
      value: dueToday.length,
    },
    {
      name: "Overdue",
      value: overdue.length,
    },
  ];

  return (
    <main className={"@container space-y-6 p-6 w-full"}>
      <div
        className={
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        }
      >
        <div className={"space-y-1"}>
          <h1 className={"text-2xl font-semibold tracking-tight"}>Dashboard</h1>

          <p className={"text-sm text-muted-foreground"}>
            Here's an overview of your work.
          </p>
        </div>
        <div className={"flex gap-2"}>
          <Button
            nativeButton={false}
            variant={"outline"}
            render={<Link href={"/dashboard/tasks"} />}
          >
            View Tasks
          </Button>

          <Button
            nativeButton={false}
            className={"text-primary-foreground!"}
            render={<Link href={"/dashboard/tasks/new"} />}
          >
            Create Task
          </Button>
        </div>
      </div>

      <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
        {statsMap.map(({ name, value }, index) => (
          <Card key={name + value + index}>
            <CardHeader className={"pb-2"}>
              <CardTitle className={"text-muted-foreground"}>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={"text-3xl font-semibold tracking-tight"}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={"grid gap-6 lg:grid-cols-3"}>
        <Card className={"lg:col-span-1"}>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Your latest projects.</CardDescription>
            <CardAction>
              <Button
                nativeButton={false}
                variant={"outline"}
                size={"sm"}
                render={<Link href={"/dashboard/projects"} />}
              >
                View Projects
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div
                className={
                  "flex flex-col items-center justify-center gap-3 py-8 text-center"
                }
              >
                <p className={"text-sm text-muted-foreground"}>
                  No projects found.
                </p>

                <Button
                  size={"sm"}
                  render={<Link href={"/dashboard/projects"} />}
                >
                  Create Project
                </Button>
              </div>
            ) : (
              <ItemGroup className={"space-y-1"}>
                {projects.slice(0, 5).map((project) => (
                  <Item
                    variant={"outline"}
                    key={project.id}
                    render={
                      <Link
                        href={`/dashboard/projects?projectId=${project.id}`}
                      />
                    }
                  >
                    <ItemContent>
                      <ItemTitle>{project.title} :</ItemTitle>
                      <ItemDescription>
                        {project.dueDate
                          ? `Due ${formatDate(project.dueDate, "dd MMM yyy")}`
                          : "No due date"}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={"outline"}>{project.priority}</Badge>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </CardContent>
        </Card>
        <Card className={"lg:col-span-1"}>
          <CardHeader>
            <CardTitle>Upcoming Task Deadlines</CardTitle>
            <CardDescription>
              Tasks that need your attention next.
            </CardDescription>

            <CardAction>
              <Button
                nativeButton={false}
                variant={"outline"}
                render={<Link href={"/dashboard/tasks"} />}
              >
                View all
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className={"py-6 text-center text-sm text-muted-foreground"}>
                No upcoming deadlines.
              </p>
            ) : (
              <ItemGroup>
                {upcomingTasks.map((task) => (
                  <Item
                    variant={"outline"}
                    key={task.id}
                    render={<Link href={`/dashboard/tasks/${task.id}`} />}
                  >
                    <ItemContent>
                      <ItemTitle>{task.title}</ItemTitle>
                      <ItemDescription>{task.description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={"outline"}>{task.status}</Badge>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </CardContent>
        </Card>
        <Card className={"lg:col-span-1"}>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>
              Current distribution of your tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className={"space-y-5"}>
            {STATUS_OPTIONS.map(({ value }) => {
              const count = statusCounts[value] ?? 0;
              const percentage =
                tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;

              return (
                <Progress key={value} value={percentage} className={"h-10"}>
                  <ProgressLabel>
                    {value} : {count}
                  </ProgressLabel>
                  <ProgressValue />
                </Progress>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div
        className={
          "text-primary/10 mt-8 flex select-none pointer-events-none flex-col items-center justify-center font-black text-[clamp(1rem,12cqw,12rem)] leading-none whitespace-nowrap"
        }
      >
        TASK MANAGER
      </div>
    </main>
  );
};

export default DashboardPage;
