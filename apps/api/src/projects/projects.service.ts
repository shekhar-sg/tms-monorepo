import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateProjectInput, UpdateProjectInput } from "@repo/types";
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
    return this.prisma.project.findMany({
      where: { leadId: userId },
      include: {
        lead: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
    return this.prisma.project.create({
      data: {
        title: data.title,
        priority: data.priority,
        leadId: userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: {
        lead: true,
      },
    });
  }

  async update(id: string, data: UpdateProjectInput, userId: string) {
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
    await this.findOwnedProject(id, userId);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
