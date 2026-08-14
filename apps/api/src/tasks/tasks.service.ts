import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { CreateTaskInput, UpdateTaskInput } from "@repo/types";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId?: string) {
    return this.prisma.task.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        assignee: true,
        subtasks: true,
      },
      orderBy: [{ status: "asc" }, { position: "asc" }],
    });
  }

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        project: true,
        subtasks: true,
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async create(data: CreateTaskInput) {
    await this.validateParentTask(data.parentId);

    const status = data.status ?? "TODO";

    const lastTask = await this.prisma.task.findFirst({
      where: {
        projectId: data.projectId,
        status,
        parentId: data.parentId ?? null,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const position = (lastTask?.position ?? 0) + 100;

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        parentId: data.parentId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        position,
      },
      include: {
        assignee: true,
        subtasks: true,
      },
    });
  }

  async update(id: string, data: UpdateTaskInput) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        parentId: true,
      },
    });

    if (!existingTask) {
      throw new NotFoundException("Task not found");
    }

    if (data.parentId !== undefined) {
      await this.validateParentTask(data.parentId);

      // Prevent a task from becoming its own parent.
      if (data.parentId === id) {
        throw new BadRequestException("A task cannot be its own parent");
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        parentId: data.parentId,
        dueDate:
          data.dueDate === null
            ? null
            : data.dueDate
              ? new Date(data.dueDate)
              : undefined,
        position: data.position,
      },
      include: {
        assignee: true,
        subtasks: true,
      },
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  private async validateParentTask(parentId?: string) {
    if (!parentId) {
      return;
    }

    const parentTask = await this.prisma.task.findUnique({
      where: { id: parentId },
      select: {
        id: true,
        parentId: true,
      },
    });

    if (!parentTask) {
      throw new NotFoundException("Parent task not found");
    }

    if (parentTask.parentId !== null) {
      throw new BadRequestException("A subtask cannot have subtasks");
    }
  }
}
