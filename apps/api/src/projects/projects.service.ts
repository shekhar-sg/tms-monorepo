import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateProjectInput, UpdateProjectInput } from "@repo/types";
import { lockOwner } from "../common/owner-lock";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOwnedProject(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        leadId: userId,
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return project;
  }

  async findAll(userId: string) {
    const [projects, counts] = await Promise.all([
      this.prisma.project.findMany({
        where: { leadId: userId },
        include: { lead: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.task.groupBy({
        by: ["projectId", "status"],
        where: { project: { leadId: userId }, parentId: null },
        _count: true,
      }),
    ]);
    return projects.map((project) => ({
      ...project,
      taskCount: counts
        .filter((c) => c.projectId === project.id)
        .reduce((n, c) => n + c._count, 0),
      completedTaskCount:
        counts.find((c) => c.projectId === project.id && c.status === "DONE")
          ?._count ?? 0,
    }));
  }

  async findById(id: string, userId: string) {
    const project = await this.findOwnedProject(id, userId);
    return this.prisma.project.findUnique({
      where: { id: project.id },
      include: {
        lead: true,
      },
    });
  }

  async create(data: CreateProjectInput, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      return new ProjectsService(tx as PrismaService).createLocked(
        data,
        userId
      );
    });
  }

  private async createLocked(data: CreateProjectInput, userId: string) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        priority: data.priority,
        leadId: userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        lead: true,
      },
    });
  }

  async update(id: string, data: UpdateProjectInput, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      return new ProjectsService(tx as PrismaService).updateLocked(
        id,
        data,
        userId
      );
    });
  }

  private async updateLocked(
    id: string,
    data: UpdateProjectInput,
    userId: string
  ) {
    if (data.leadId !== undefined && data.leadId !== userId)
      throw new NotFoundException("User not found");
    await this.findOwnedProject(id, userId);

    return this.prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        priority: data.priority,
        leadId: data.leadId,
        dueDate:
          data.dueDate === null
            ? null
            : data.dueDate
              ? new Date(data.dueDate)
              : undefined,
      },
      include: {
        lead: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      return new ProjectsService(tx as PrismaService).removeLocked(id, userId);
    });
  }

  private async removeLocked(id: string, userId: string) {
    await this.findOwnedProject(id, userId);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
