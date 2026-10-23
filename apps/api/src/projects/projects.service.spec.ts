import { NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import { ProjectsService } from "./projects.service";

describe("Project ownership and edits", () => {
  const prisma = {
    project: { findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
  };
  const service = new ProjectsService(prisma as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
    prisma.project.findFirst.mockResolvedValue({ id: "project" });
  });
  it("rejects deletion by another owner", async () => {
    prisma.project.findFirst.mockResolvedValue(null);
    await expect(service.remove("project", "stranger")).rejects.toBeInstanceOf(
      NotFoundException
    );
    expect(prisma.project.delete).not.toHaveBeenCalled();
  });
  it("preserves an omitted due date and clears an explicit null", async () => {
    await service.update("project", { title: "Renamed" }, "owner");
    expect(prisma.project.update.mock.calls[0][0].data.dueDate).toBeUndefined();
    await service.update("project", { dueDate: null }, "owner");
    expect(prisma.project.update.mock.calls[1][0].data.dueDate).toBeNull();
  });
});
