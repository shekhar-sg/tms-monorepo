import { PrismaPg } from "@prisma/adapter-pg";
import type { Prisma } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const;

const priorities = ["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const titles = [
  "Implement authentication flow",
  "Build dashboard layout",
  "Create task management API",
  "Implement Google OAuth",
  "Add guest login",
  "Build project management",
  "Add task filtering",
  "Implement task search",
  "Create responsive sidebar",
  "Improve mobile layout",
  "Add dark mode",
  "Implement drag and drop",
  "Create task details page",
  "Build project settings",
  "Create user profile",
  "Implement notifications",
  "Add task comments",
  "Create activity timeline",
  "Optimize API queries",
  "Write unit tests",
  "Write integration tests",
  "Fix dashboard spacing",
  "Improve loading states",
  "Add error handling",
  "Review accessibility",
  "Optimize database queries",
  "Add pagination",
  "Implement task sorting",
  "Add project permissions",
  "Review RBAC implementation",
];

const descriptions = [
  "Implement the feature and make sure it works across desktop and mobile.",
  "Review the existing implementation and improve the overall user experience.",
  "Create the required API endpoints and connect them to the frontend.",
  "Make sure the implementation follows the existing project architecture.",
  null,
];

async function main() {
  console.log("Starting seed...");

  const guestUser = await prisma.user.findFirst({
    where: {
      isGuest: true,
    },
  });

  if (!guestUser) {
    throw new Error(
      "No guest user found. Login as guest first, then run the seed."
    );
  }

  console.log(`Using guest user: ${guestUser.id}`);

  let project = await prisma.project.findFirst({
    where: {
      // leadId: guestUser.id,
      leadId: "0c553125-8571-4f2c-91b2-c1d065fd7ba9",
    },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        title: "Kanban Test Project",
        priority: "HIGH",
        leadId: guestUser.id,
      },
    });

    console.log(`Created project: ${project.id}`);
  } else {
    console.log(`Using existing project: ${project.id}`);
  }

  // Get other users for assignees
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: guestUser.id,
      },
    },
    take: 5,
  });

  // Remove existing test tasks from this project.
  // This makes the seed safe to run repeatedly.
  await prisma.task.deleteMany({
    where: {
      projectId: project.id,
    },
  });

  const tasksToCreate: Prisma.TaskCreateManyInput[] = [];

  for (let i = 0; i < 50; i++) {
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];

    const assignee =
      i % 5 === 0
        ? null
        : users.length > 0
          ? users[i % users.length]
          : guestUser;

    tasksToCreate.push({
      title: `${titles[i % titles.length]} ${i + 1}`,
      description: descriptions[i % descriptions.length],
      priority: priority as (typeof priorities)[number],
      status: status as (typeof statuses)[number],
      projectId: project.id,
      assigneeId: assignee?.id ?? null,
      parentId: null,
      dueDate:
        i % 4 === 0
          ? new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000)
          : null,
      position: (i + 1) * 100,
    });
  }

  await prisma.task.createMany({
    data: tasksToCreate,
  });

  // Create a few subtasks for testing.
  const parentTasks = await prisma.task.findMany({
    where: {
      projectId: project.id,
      parentId: null,
    },
    orderBy: {
      position: "asc",
    },
    take: 10,
  });

  for (let i = 0; i < parentTasks.length; i++) {
    const parent = parentTasks[i];

    await prisma.task.createMany({
      data: [
        {
          title: `Research ${parent.title}`,
          description: "Research requirements and existing implementation.",
          priority: "LOW",
          status: "TODO",
          projectId: project.id,
          assigneeId: guestUser.id,
          parentId: parent.id,
          position: 100,
        },
        {
          title: `Implement ${parent.title}`,
          description: "Implement the required functionality.",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
          projectId: project.id,
          assigneeId: users[0]?.id ?? guestUser.id,
          parentId: parent.id,
          position: 200,
        },
      ],
    });
  }

  console.log("Seed completed.");
  console.log(`Project: ${project.title}`);
  console.log("Created: 50 tasks + subtasks");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
