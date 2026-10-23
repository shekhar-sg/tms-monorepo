import { NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import { CommentsService } from "./comments.service";

describe("Comment access and replies", () => {
  const prisma = {
    task: { findFirst: jest.fn() },
    comment: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() },
    taskActivity: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  const service = new CommentsService(prisma as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
    prisma.task.findFirst.mockResolvedValue({ id: "task" });
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
  });
  it("rejects comments on inaccessible tasks", async () => {
    prisma.task.findFirst.mockResolvedValue(null);
    await expect(
      service.create("task", { content: "hello" }, "stranger")
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.comment.create).not.toHaveBeenCalled();
  });
  it("rejects replies to comments from another task", async () => {
    prisma.comment.findFirst.mockResolvedValue(null);
    await expect(
      service.create("task", { content: "reply", parentId: "other" }, "owner")
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.comment.findFirst).toHaveBeenCalledWith({
      where: { id: "other", taskId: "task" },
      select: { id: true },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
  it("creates a reply and its activity together", async () => {
    prisma.comment.findFirst.mockResolvedValue({ id: "parent" });
    prisma.comment.create.mockResolvedValue({ id: "reply" });
    await service.create(
      "task",
      { content: "reply", parentId: "parent" },
      "owner"
    );
    expect(prisma.comment.create.mock.calls[0][0].data).toMatchObject({
      taskId: "task",
      parentId: "parent",
      authorId: "owner",
    });
    expect(prisma.taskActivity.create.mock.calls[0][0].data).toMatchObject({
      type: "COMMENT_ADDED",
      metadata: { commentId: "reply", parentId: "parent" },
    });
  });
});
