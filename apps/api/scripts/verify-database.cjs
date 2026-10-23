// Creates and removes only its own isolated schema; never migrates the configured application schema.
const { Client } = require("pg");
const { spawnSync } = require("node:child_process");
const { randomBytes } = require("node:crypto");
const { loadEnvFile } = require("node:process");
const { readdirSync, readFileSync } = require("node:fs");
loadEnvFile(".env");
const schema = `codex_verify_${Date.now()}_${randomBytes(4).toString("hex")}`;
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function main() {
  await client.connect();
  try {
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);
    const migrations = readdirSync("prisma/migrations")
      .filter((name) => name !== "migration_lock.toml")
      .sort();
    for (const name of migrations.slice(0, -1))
      await client.query(
        readFileSync(`prisma/migrations/${name}/migration.sql`, "utf8")
      );
    await client.query(`INSERT INTO "User" (id, "updatedAt") VALUES ('owner-a', now()), ('owner-b', now());
      INSERT INTO "Project" (id, title, "leadId", "updatedAt") VALUES ('project-a', 'A', 'owner-a', now()), ('project-b', 'B', 'owner-b', now());
      INSERT INTO "Task" (id, title, "projectId", "updatedAt") VALUES ('task-a', 'A', 'project-a', now()), ('task-b', 'B', 'project-b', now());
      INSERT INTO "Label" (id, name, "updatedAt") VALUES ('shared-label', 'Shared', now());
      INSERT INTO "TaskLabel" ("taskId", "labelId") VALUES ('task-a', 'shared-label'), ('task-b', 'shared-label');`);
    await client.query(
      readFileSync(
        `prisma/migrations/${migrations.at(-1)}/migration.sql`,
        "utf8"
      )
    );
    const backfill = await client.query(
      `SELECT l."ownerId", p."leadId" FROM "TaskLabel" tl JOIN "Label" l ON l.id = tl."labelId" JOIN "Task" t ON t.id = tl."taskId" JOIN "Project" p ON p.id = t."projectId"`
    );
    if (
      backfill.rows.length !== 2 ||
      backfill.rows.some((row) => row.ownerId !== row.leadId)
    )
      throw new Error("Label backfill lost ownership or assignments");
    console.log("Populated migration backfill: passed");
    await client.query(`DROP SCHEMA "${schema}" CASCADE`);
    await client.query(`CREATE SCHEMA "${schema}"`);
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set("schema", schema);
    const env = {
      ...process.env,
      DATABASE_URL: url.toString(),
      TMS_TEST_DATABASE_URL: url.toString(),
    };
    for (const args of [
      ["node_modules/prisma/build/index.js", "migrate", "deploy"],
      [
        "--experimental-vm-modules",
        "node_modules/jest/bin/jest.js",
        "--runInBand",
        "--testPathPatterns=workspace.integration",
      ],
    ]) {
      const result = spawnSync(process.execPath, args, {
        env,
        encoding: "utf8",
      });
      process.stdout.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
      if (result.status !== 0) throw new Error("Database verification failed");
    }
  } finally {
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await client.end();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
