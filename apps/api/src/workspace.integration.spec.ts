import { randomUUID } from "node:crypto";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiService } from "./ai/ai.service";
import { LabelsService } from "./labels/labels.service";
import { PrismaService } from "./prisma/prisma.service";
import { TasksService } from "./tasks/tasks.service";
import { UsersService } from "./users/users.service";

const integration = process.env.TMS_TEST_DATABASE_URL
  ? describe
  : describe.skip;
integration("Workspace database invariants", () => {
  let prisma: PrismaService;
  let tasks: TasksService;
  let owner: string;
  let projectId: string;
  let stranger: string;
  beforeAll(async () => {
    const url = new URL(process.env.TMS_TEST_DATABASE_URL!);
    if (!url.searchParams.get("schema")?.startsWith("codex_verify_"))
      throw new Error(
        "Integration tests require an isolated codex_verify_ schema"
      );
    process.env.DATABASE_URL = url.toString();
    prisma = new PrismaService();
    await prisma.$connect();
    tasks = new TasksService(prisma);
    owner = (await prisma.user.create({ data: { isGuest: true } })).id;
    stranger = (await prisma.user.create({ data: { isGuest: true } })).id;
    projectId = (
      await prisma.project.create({
        data: { title: "Ordering test", leadId: owner },
      })
    ).id;
  }, 30_000);
  afterAll(async () => {
    await prisma?.$disconnect();
  });
  const create = (title: string) =>
    tasks.create(
      { title, projectId, reporterId: owner, members: [], labels: [] },
      owner
    );

  it("serializes concurrent creation and preserves distinct ranks", async () => {
    const records = await Promise.all([
      create("One"),
      create("Two"),
      create("Three"),
    ]);
    expect(new Set(records.map((r) => r.position)).size).toBe(3);
  }, 30_000);
  it("does not leak tasks or labels between accounts", async () => {
    const task = await create("Private");
    await expect(tasks.findById(task.id, stranger)).rejects.toBeInstanceOf(
      NotFoundException
    );
    const labels = new LabelsService(prisma);
    const label = await labels.create(owner, "Private label", "#112233");
    expect(await labels.findAll(stranger)).toHaveLength(0);
    await expect(labels.remove(label.id, stranger)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
  it("persists ordering and rejects concurrent edits using stale revisions", async () => {
    const task = await create("Revision");
    const results = await Promise.allSettled([
      tasks.move(task.id, { status: "DONE", revision: task.revision }, owner),
      tasks.move(task.id, { status: "REVIEW", revision: task.revision }, owner),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const rejected = results.find(
      (r) => r.status === "rejected"
    ) as PromiseRejectedResult;
    expect(rejected.reason).toBeInstanceOf(ConflictException);
    expect(
      await prisma.taskActivity.count({
        where: { taskId: task.id, type: "STATUS_CHANGED" },
      })
    ).toBe(1);
  }, 30_000);
  it("rebalances exhausted ranks without losing order", async () => {
    const a = await create("Before"),
      b = await create("After"),
      c = await create("Move");
    await prisma.task.update({ where: { id: a.id }, data: { position: 1 } });
    await prisma.task.update({
      where: { id: b.id },
      data: { position: 1.000001 },
    });
    const moved = await tasks.move(
      c.id,
      { status: "TODO", beforeTaskId: a.id, afterTaskId: b.id },
      owner
    );
    const before = await prisma.task.findUniqueOrThrow({ where: { id: a.id } });
    const after = await prisma.task.findUniqueOrThrow({ where: { id: b.id } });
    expect(moved.position).toBeGreaterThan(before.position);
    expect(moved.position).toBeLessThan(after.position);
  }, 30_000);
  it("atomically applies reviewed AI work and deduplicates retries", async () => {
    const ai = new AiService(prisma, new ConfigService());
    const input = {
      key: randomUUID(),
      proposal: {
        projectId,
        projectTitle: null,
        parentId: null,
        tasks: [
          {
            title: "AI parent",
            description: null,
            priority: "NONE" as const,
            status: "TODO" as const,
            endDate: null,
            subtasks: [
              {
                title: "AI child",
                description: null,
                priority: "LOW" as const,
                status: "TODO" as const,
                endDate: null,
              },
            ],
          },
        ],
      },
    };
    const [a, b] = await Promise.all([
      ai.apply(input, owner),
      ai.apply(input, owner),
    ]);
    expect(a).toEqual(b);
    expect(
      await prisma.task.count({ where: { projectId, title: "AI parent" } })
    ).toBe(1);
    const before = await prisma.task.count();
    await expect(
      ai.apply(
        {
          ...input,
          key: randomUUID(),
          proposal: { ...input.proposal, projectId: randomUUID() },
        },
        owner
      )
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(await prisma.task.count()).toBe(before);
  }, 30_000);
  it("merges a guest into Google without losing work and disables the old identity", async () => {
    const users = new UsersService(prisma);
    const existing = await prisma.user.create({
      data: { email: "integration@example.test", name: "Existing" },
    });
    const guestProject = await prisma.project.create({
      data: { title: "Guest project", leadId: stranger },
    });
    const linked = await users.linkGoogle(
      {
        providerAccountId: "integration-google",
        email: existing.email!,
        name: "Google",
      },
      stranger
    );
    expect(linked.id).toBe(existing.id);
    expect(
      (
        await prisma.project.findUniqueOrThrow({
          where: { id: guestProject.id },
        })
      ).leadId
    ).toBe(existing.id);
    expect(
      (await prisma.user.findUniqueOrThrow({ where: { id: stranger } }))
        .disabledAt
    ).not.toBeNull();
    expect(await users.findAll(existing.id)).toHaveLength(1);
  }, 30_000);
});
