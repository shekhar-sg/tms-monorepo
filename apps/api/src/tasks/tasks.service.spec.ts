import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { updateTaskSchema } from "@repo/types";
import type { PrismaService } from "../prisma/prisma.service";
import { TasksService } from "./tasks.service";

describe("Task workflow regressions", () => {
  const task = {
    id: "task",
    revision: 0,
    projectId: "project",
    parentId: null,
    status: "TODO",
    priority: "NONE",
    resource: null,
    reporterId: null,
    members: [{ userId: "member" }],
    labels: [{ labelId: "label" }],
  };
  const prisma = {
    task: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    project: { findFirst: jest.fn() },
    user: { count: jest.fn(), update: jest.fn() },
    label: { count: jest.fn() },
    taskActivity: { create: jest.fn(), createMany: jest.fn() },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
  };
  const service = new TasksService(prisma as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
    prisma.user.update.mockResolvedValue({ disabledAt: null });
    prisma.task.findFirst.mockResolvedValue(task);
    prisma.task.findMany.mockResolvedValue([]);
    prisma.task.update.mockResolvedValue(task);
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
  });
  it("does not default omitted relation arrays in a partial update", async () => {
    const input = updateTaskSchema.parse({ title: "Renamed" });
    expect(input).toEqual({ title: "Renamed" });
    await service.update("task", input, "owner");
    const data = prisma.task.update.mock.calls[0][0].data;
    expect(data).not.toHaveProperty("members");
    expect(data).not.toHaveProperty("labels");
    expect(data.projectId).toBeUndefined();
  });
  it("supports explicit clearing of optional fields and relations", async () => {
    await service.update(
      "task",
      updateTaskSchema.parse({
        resource: null,
        reporterId: null,
        members: [],
        labels: [],
      }),
      "owner"
    );
    expect(prisma.task.update.mock.calls[0][0].data).toMatchObject({
      resource: null,
      reporterId: null,
      members: { deleteMany: {}, create: [] },
      labels: { deleteMany: {}, create: [] },
    });
  });
  it("preserves existing legacy members while rejecting new inaccessible identities", async () => {
    await service.update(
      "task",
      { title: "Renamed", members: ["member"] },
      "owner"
    );
    expect(prisma.task.update).toHaveBeenCalled();
    prisma.task.update.mockClear();
    await expect(
      service.update("task", { members: ["stranger"] }, "owner")
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.task.update).not.toHaveBeenCalled();
  });
  it("rejects unauthorized updates before performing any writes", async () => {
    prisma.task.findFirst.mockResolvedValue(null);
    await expect(
      service.update("task", { title: "Denied" }, "stranger")
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.task.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "task", project: { leadId: "stranger" } },
      })
    );
    expect(prisma.task.update).not.toHaveBeenCalled();
  });
  it("writes a status change and its activity in the same transaction", async () => {
    prisma.task.findFirst
      .mockResolvedValueOnce(task)
      .mockResolvedValueOnce({ position: 200 });
    await service.move("task", { status: "DONE" }, "owner");
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "DONE", position: 1224, revision: { increment: 1 } },
      })
    );
    expect(prisma.taskActivity.create).toHaveBeenCalledWith({
      data: {
        taskId: "task",
        userId: "owner",
        type: "STATUS_CHANGED",
        metadata: { from: "TODO", to: "DONE" },
      },
    });
  });
  it("does not create a status activity for a reorder within one status", async () => {
    await service.move("task", { status: "TODO" }, "owner");
    expect(prisma.taskActivity.create).not.toHaveBeenCalled();
  });
  it.each([
    [
      {
        id: "neighbor",
        projectId: "project",
        parentId: "different-parent",
        status: "DONE",
        position: 100,
      },
    ],
    [
      {
        id: "neighbor",
        projectId: "project",
        parentId: null,
        status: "TODO",
        position: 100,
      },
    ],
  ])(
    "rejects a neighbor outside the destination group: %o",
    async (neighbor) => {
      prisma.task.findMany.mockResolvedValue([neighbor]);
      await expect(
        service.move(
          "task",
          { status: "DONE", beforeTaskId: "neighbor" },
          "owner"
        )
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.task.update).not.toHaveBeenCalled();
    }
  );
  it("propagates transaction failure rather than reporting a successful move", async () => {
    prisma.taskActivity.create.mockRejectedValue(
      new Error("activity write failed")
    );
    await expect(
      service.move("task", { status: "DONE" }, "owner")
    ).rejects.toThrow("activity write failed");
  });
  it("prevents moving a parent to another project while its subtasks remain", async () => {
    prisma.project.findFirst.mockResolvedValue({ id: "other" });
    prisma.task.count.mockResolvedValue(1);
    await expect(
      service.update("task", { projectId: "other" }, "owner")
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.task.update).not.toHaveBeenCalled();
  });
});

describe("Order revision and shared owner scope", () => {
  const tx = {
    user: { update: jest.fn() },
    $queryRaw: jest.fn(),
    task: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    taskActivity: { create: jest.fn() },
  };
  const service = new TasksService({
    $transaction: (fn: (value: unknown) => unknown) => fn(tx),
  } as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
    tx.user.update.mockResolvedValue({ disabledAt: null });
    tx.task.findFirst.mockResolvedValue({
      id: "task",
      parentId: null,
      projectId: "one",
      status: "TODO",
      revision: 2,
    });
  });
  it("rejects a stale revision before writing", async () => {
    await expect(
      service.move("task", { status: "DONE", revision: 1 }, "owner")
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tx.task.update).not.toHaveBeenCalled();
  });
  it("allows top-level neighbors from another project owned by the user", async () => {
    tx.task.findMany.mockResolvedValue([
      {
        id: "neighbor",
        parentId: null,
        projectId: "two",
        status: "TODO",
        position: 1024,
      },
    ]);
    tx.task.update.mockResolvedValue({ id: "task" });
    await service.move(
      "task",
      { status: "TODO", beforeTaskId: "neighbor", revision: 2 },
      "owner"
    );
    expect(tx.task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: "TODO", position: 2048, revision: { increment: 1 } },
      })
    );
    expect(tx.task.findMany.mock.calls[0][0].where.project).toEqual({
      leadId: "owner",
    });
  });
  it("rejects reversed neighbors", async () => {
    tx.task.findMany.mockResolvedValue([
      { id: "a", parentId: null, status: "TODO", position: 200 },
      { id: "b", parentId: null, status: "TODO", position: 100 },
    ]);
    await expect(
      service.move(
        "task",
        { status: "TODO", beforeTaskId: "a", afterTaskId: "b" },
        "owner"
      )
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
