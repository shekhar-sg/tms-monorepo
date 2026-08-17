import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  CreateTaskInput,
  MoveTaskInput,
  UpdateTaskInput,
} from "@repo/types";

import { PrismaService } from "../prisma/prisma.service";

const taskInclude = {
  reporter: true,
  members: {
    include: {
      user: true,
    },
  },
  labels: {
    include: {
      label: true,
    },
  },
  subtasks: true,
} as const;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, projectId?: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
        project: {
          leadId: userId,
        },
      },
      include: taskInclude,
      orderBy: [{ status: "asc" }, { position: "asc" }],
    });
  }

  async findById(id: string, userId: string) {
    await this.findAccessibleTask(id, userId);

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...taskInclude,
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async create(data: CreateTaskInput, userId: string) {
    await this.validateProjectAccess(data.projectId, userId);
    await this.validateParentTask(data.parentId, data.projectId, userId);

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
        resource: data.resource,
        priority: data.priority,
        status,
        projectId: data.projectId,
        reporterId: data.reporterId,
        parentId: data.parentId,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        position,
        members: data.members?.length
          ? {
              create: data.members.map((userId) => ({
                userId,
              })),
            }
          : undefined,
        labels: data.labels?.length
          ? {
              create: data.labels.map((labelId) => ({
                labelId,
              })),
            }
          : undefined,
      },
      include: {
        reporter: true,
        members: {
          include: {
            user: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        subtasks: true,
      },
    });
  }

  async update(id: string, data: UpdateTaskInput, userId: string) {
    const existingTask = await this.findAccessibleTask(id, userId);

    if (data.projectId) {
      await this.validateProjectAccess(data.projectId, userId);
    }

    if (data.parentId !== undefined) {
      await this.validateParentTask(
        data.parentId,
        data.projectId ?? existingTask.projectId,
        userId
      );

      if (data.parentId === id) {
        throw new BadRequestException("A task cannot be its own parent");
      }
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        resource: data.resource,
        priority: data.priority,
        status: data.status,
        projectId: data.projectId,
        reporterId: data.reporterId,
        parentId: data.parentId,
        startDate:
          data.startDate === null
            ? null
            : data.startDate
              ? new Date(data.startDate)
              : undefined,
        endDate:
          data.endDate === null
            ? null
            : data.endDate
              ? new Date(data.endDate)
              : undefined,
        position: data.position,
        ...(data.members !== undefined && {
          members: {
            deleteMany: {},
            create: data.members.map((userId) => ({
              userId,
            })),
          },
        }),
        ...(data.labels !== undefined && {
          labels: {
            deleteMany: {},
            create: data.labels.map((labelId) => ({
              labelId,
            })),
          },
        }),
      },
      include: {
        reporter: true,
        members: {
          include: {
            user: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        subtasks: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findAccessibleTask(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async move(id: string, data: MoveTaskInput, userId: string) {
    const task = await this.findAccessibleTask(id, userId);

    if (data.beforeTaskId === id || data.afterTaskId === id) {
      throw new BadRequestException(
        "A task cannot be positioned relative to itself"
      );
    }

    const neighborIds = [data.beforeTaskId, data.afterTaskId].filter(
      (taskId): taskId is string => Boolean(taskId)
    );

    const neighbors = await this.prisma.task.findMany({
      where: {
        id: {
          in: neighborIds,
        },
        project: {
          leadId: userId,
        },
      },
      select: {
        id: true,
        projectId: true,
        status: true,
        position: true,
      },
    });

    if (neighbors.length !== neighborIds.length) {
      throw new NotFoundException("One or more adjacent tasks not found");
    }

    for (const neighbor of neighbors) {
      if (neighbor.projectId !== task.projectId) {
        throw new BadRequestException(
          "Adjacent tasks must belong to the same project"
        );
      }

      if (neighbor.status !== data.status) {
        throw new BadRequestException(
          "Adjacent tasks must belong to the destination status"
        );
      }
    }

    const beforeTask = neighbors.find(
      (neighbor) => neighbor.id === data.beforeTaskId
    );

    const afterTask = neighbors.find(
      (neighbor) => neighbor.id === data.afterTaskId
    );

    let position: number;

    if (beforeTask && afterTask) {
      position = (beforeTask.position + afterTask.position) / 2;
    } else if (beforeTask) {
      position = beforeTask.position + 100;
    } else if (afterTask) {
      position = afterTask.position / 2;
    } else {
      const lastTask = await this.prisma.task.findFirst({
        where: {
          projectId: task.projectId,
          status: data.status,
          id: {
            not: task.id,
          },
        },
        orderBy: {
          position: "desc",
        },
        select: {
          position: true,
        },
      });

      position = (lastTask?.position ?? 0) + 100;
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        status: data.status,
        position,
      },
      include: taskInclude,
    });
  }

  private async findAccessibleTask(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        project: {
          leadId: userId,
        },
      },
      select: {
        id: true,
        projectId: true,
        parentId: true,
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  private async validateProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        leadId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }
  }

  private async validateParentTask(
    parentId: string | null | undefined,
    projectId: string,
    userId: string
  ) {
    if (!parentId) {
      return;
    }

    const parentTask = await this.prisma.task.findFirst({
      where: {
        id: parentId,
        projectId,
        project: {
          leadId: userId,
        },
      },
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

  private async validateIds(model: "user" | "label", ids: string[]) {
    const uniqueIds = [...new Set(ids)];

    const count =
      model === "user"
        ? await this.prisma.user.count({
            where: {
              id: {
                in: uniqueIds,
              },
            },
          })
        : await this.prisma.label.count({
            where: {
              id: {
                in: uniqueIds,
              },
            },
          });

    if (count !== uniqueIds.length) {
      throw new NotFoundException(`One or more ${model}s not found`);
    }
  }
}
