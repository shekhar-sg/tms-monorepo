// Only operates on the single disposable browser schema created by browser-fixture.cjs.
const { Client } = require("pg");
require("node:process").loadEnvFile(".env");
async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const schemas = await client.query(
    "SELECT nspname FROM pg_namespace WHERE nspname LIKE 'codex_verify_ui_%'"
  );
  await client.end();
  if (schemas.rows.length !== 1)
    throw new Error("Expected exactly one isolated browser schema");
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schemas.rows[0].nspname);
  process.env.DATABASE_URL = url.toString();
  const { PrismaService } = require("../dist/src/prisma/prisma.service.js");
  const { TasksService } = require("../dist/src/tasks/tasks.service.js");
  const db = new PrismaService();
  try {
    const service = new TasksService(db);
    for (const user of await db.user.findMany({
      where: { isGuest: true, ledProjects: { none: {} } },
    })) {
      const project = await db.project.create({
        data: { title: "Release planning", leadId: user.id },
      });
      for (const [title, status, priority] of [
        ["Review release checklist", "TODO", "HIGH"],
        ["Prepare onboarding guide", "TODO", "MEDIUM"],
        ["Confirm rollout schedule", "TODO", "LOW"],
        ["Validate account migration", "IN_PROGRESS", "HIGH"],
        ["Document API contracts", "DONE", "NONE"],
      ]) {
        await service.create(
          {
            title,
            status,
            priority,
            projectId: project.id,
            reporterId: user.id,
            members: [],
            labels: [],
            endDate: "2026-10-27T12:00:00.000Z",
          },
          user.id
        );
      }
    }
    console.log("Isolated browser fixtures ready");
  } finally {
    await db.$disconnect();
  }
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
