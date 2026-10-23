// Disposable API for UI checks. No fixtures are written to the application schema.
const { Client } = require("pg");
const { spawn, spawnSync } = require("node:child_process");
const { randomBytes } = require("node:crypto");
const { loadEnvFile } = require("node:process");
loadEnvFile(".env");
const schema = `codex_verify_ui_${Date.now()}_${randomBytes(4).toString("hex")}`;
const client = new Client({ connectionString: process.env.DATABASE_URL });
let api;
let db;
let interval;
let cleaning = false;
async function cleanup() {
  if (cleaning) return;
  cleaning = true;
  clearInterval(interval);
  if (api) api.kill();
  await db?.$disconnect();
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await client.end();
  console.log("Disposable browser database removed.");
}
async function main() {
  await client.connect();
  await client.query(`CREATE SCHEMA "${schema}"`);
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  const env = {
    ...process.env,
    DATABASE_URL: url.toString(),
    PORT: "4010",
    FRONTEND_URL: "http://127.0.0.1:3001",
    GROQ_API_KEY: "",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
  };
  const migrated = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env, encoding: "utf8" }
  );
  if (migrated.status !== 0) throw new Error(migrated.stderr);
  process.env.DATABASE_URL = url.toString();
  const { PrismaService } = require("../dist/src/prisma/prisma.service.js");
  const { TasksService } = require("../dist/src/tasks/tasks.service.js");
  db = new PrismaService();
  const service = new TasksService(db);
  api = spawn(process.execPath, ["dist/src/main.js"], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  api.stderr.on("data", (chunk) => process.stderr.write(chunk));
  console.log(
    "Disposable API on http://localhost:4010; sign in as guest on the test web app to populate fixtures."
  );
  let seeding = false;
  interval = setInterval(async () => {
    if (seeding) return;
    const user = await db.user.findFirst({ where: { isGuest: true } });
    if (!user) return;
    seeding = true;
    clearInterval(interval);
    const project = await db.project.create({
      data: {
        title: "Release planning",
        leadId: user.id,
        priority: "HIGH",
        dueDate: new Date("2026-10-30T12:00:00Z"),
      },
    });
    const records = [
      ["Review release checklist", "TODO", "HIGH"],
      ["Prepare onboarding guide", "TODO", "MEDIUM"],
      ["Confirm rollout schedule", "TODO", "LOW"],
      ["Validate account migration", "IN_PROGRESS", "HIGH"],
      ["Document API contracts", "DONE", "NONE"],
    ];
    let parent;
    for (const [title, status, priority] of records) {
      const task = await service.create(
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
      parent ??= task;
    }
    await service.create(
      {
        title: "Check rollback steps",
        status: "TODO",
        priority: "HIGH",
        parentId: parent.id,
        projectId: project.id,
        reporterId: user.id,
        members: [],
        labels: [],
      },
      user.id
    );
    console.log("Disposable board/table/subtask fixtures are ready.");
  }, 1500);
  process.on("SIGINT", () => void cleanup().then(() => process.exit()));
  process.on("SIGTERM", () => void cleanup().then(() => process.exit()));
  process.stdin.resume();
  process.stdin.on("data", () => void cleanup().then(() => process.exit()));
}
main().catch(async (error) => {
  console.error(error.message);
  await cleanup();
  process.exitCode = 1;
});
