import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  CreateTaskInput,
  GetTasksQuery,
  MoveTaskInput,
  UpdateTaskInput,
} from "@repo/types";
import { Prisma } from "../../generated/prisma/client";
import { appendPosition, lockOwner } from "../common/owner-lock";
import { PrismaService } from "../prisma/prisma.service";

const actorSelect = { id: true, name: true, avatar: true } as const;
const taskInclude = {
  project: { select: { id: true, title: true } },
  reporter: { select: actorSelect },
  members: {
    include: {
      user: { select: actorSelect },
    },
  },
  labels: {
    include: {
      label: true,
    },
  },
  subtasks: true,
} as const;

type TaskActivityInput = {
  type: Prisma.TaskActivityCreateManyInput["type"];
  metadata: Prisma.InputJsonValue;
};

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, projectId?: string, query?: GetTasksQuery) {
    const { search, status, priority, labels, dueDateFrom, dueDateTo } =
      query ?? {};

    return this.prisma.task.findMany({
      where: {
        projectId,
        parentId: null,
        project: {
          leadId: userId,
        },

        ...(status?.length && {
          status: {
            in: status,
          },
        }),

        ...(priority?.length && {
          priority: {
            in: priority,
          },
        }),

        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(labels?.length && {
          labels: {
            some: {
              labelId: {
                in: labels,
              },
            },
          },
        }),

        ...(dueDateFrom || dueDateTo
          ? {
              endDate: {
                ...(dueDateFrom && {
                  gte: new Date(dueDateFrom),
                }),
                ...(dueDateTo && {
                  lte: new Date(dueDateTo),
                }),
              },
            }
          : {}),
      },

      include: taskInclude,
      orderBy: [{ status: "asc" }, { position: "asc" }, { id: "asc" }],
    });
  }

  async findById(id: string, userId: string) {
    await this.findAccessibleTask(id, userId);

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...taskInclude,
        project: true,
        subtasks: {
          orderBy: [{ position: "asc" }, { id: "asc" }],
          include: {
            members: {
              include: { user: { select: actorSelect } },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async create(data: CreateTaskInput, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      return new TasksService(tx as PrismaService).createInTransaction(
        data,
        userId
      );
    });
  }

  private async createInTransaction(data: CreateTaskInput, userId: string) {
    await this.validateProjectAccess(data.projectId, userId);
    await this.validateParentTask(data.parentId, data.projectId, userId);

    if (data.members?.length) {
      await this.validateIds("user", data.members, userId);
    }

    if (data.labels?.length) {
      await this.validateIds("label", data.labels, userId);
    }

    const status = data.status ?? "TODO";

    if (data.reporterId !== userId)
      throw new BadRequestException("Reporter must be the current user");
    const position = await appendPosition(
      this.prisma,
      userId,
      status,
      data.parentId ?? null
    );

    return (async (tx: Prisma.TransactionClient) => {
      const task = await tx.task.create({
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
        include: taskInclude,
      });

      await tx.taskActivity.create({
        data: {
          taskId: task.id,
          userId,
          type: "CREATED",
          metadata: {},
        },
      });

      return task;
    })(this.prisma);
  }

  async update(id: string, data: UpdateTaskInput, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      return new TasksService(tx as PrismaService).updateInTransaction(
        id,
        data,
        userId
      );
    });
  }

  private async updateInTransaction(
    id: string,
    data: UpdateTaskInput,
    userId: string
  ) {
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

    if (
      data.parentId &&
      data.parentId !== existingTask.parentId &&
      (await this.prisma.task.count({ where: { parentId: id } }))
    ) {
      throw new BadRequestException(
        "A task with subtasks cannot become a subtask"
      );
    }
    const position =
      (data.status && data.status !== existingTask.status) ||
      (data.parentId !== undefined && data.parentId !== existingTask.parentId)
        ? await appendPosition(
            this.prisma,
            userId,
            data.status ?? existingTask.status,
            data.parentId === undefined ? existingTask.parentId : data.parentId,
            id
          )
        : undefined;
    const activities = this.buildTaskActivities(existingTask, data);

    const newMembers =
      data.members?.filter(
        (id) => !existingTask.members.some((member) => member.userId === id)
      ) ?? [];
    if (newMembers.length) await this.validateIds("user", newMembers, userId);
    if (data.labels?.length)
      await this.validateIds("label", data.labels, userId);
    if (data.reporterId && data.reporterId !== existingTask.reporterId)
      await this.validateIds("user", [data.reporterId], userId);

    if (data.projectId && data.projectId !== existingTask.projectId) {
      await this.validateParentTask(
        data.parentId === undefined ? existingTask.parentId : data.parentId,
        data.projectId,
        userId
      );
      const children = await this.prisma.task.count({
        where: { parentId: id },
      });
      if (children > 0) {
        throw new BadRequestException(
          "Move or remove subtasks before changing this task's project"
        );
      }
    }

    const task = await (async (tx: Prisma.TransactionClient) => {
      const updatedTask = await tx.task.update({
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

          position,
          revision: { increment: 1 },

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

        include: taskInclude,
      });

      if (activities.length > 0) {
        await tx.taskActivity.createMany({
          data: activities.map((activity) => ({
            taskId: id,
            userId,
            type: activity.type,
            metadata: activity.metadata,
          })),
        });
      }

      return updatedTask;
    })(this.prisma);

    return task;
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      await new TasksService(tx as PrismaService).findAccessibleTask(
        id,
        userId
      );
      return tx.task.delete({ where: { id } });
    });
  }

  async move(id: string, data: MoveTaskInput, userId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        await lockOwner(tx, userId);
        const task = await new TasksService(
          tx as PrismaService
        ).findAccessibleTask(id, userId);
        if (data.revision !== undefined && data.revision !== task.revision) {
          throw new ConflictException(
            "This task changed. Refresh and try again."
          );
        }
        const ids = [data.beforeTaskId, data.afterTaskId].filter(
          (v): v is string => Boolean(v)
        );
        if (ids.includes(id) || new Set(ids).size !== ids.length)
          throw new BadRequestException("Invalid task neighbors");
        const neighbors = await tx.task.findMany({
          where: { id: { in: ids }, project: { leadId: userId } },
        });
        if (neighbors.length !== ids.length)
          throw new NotFoundException("Adjacent task not found");
        if (
          neighbors.some(
            (n) => n.parentId !== task.parentId || n.status !== data.status
          )
        )
          throw new BadRequestException(
            "Adjacent tasks must be in the destination group"
          );
        let before = neighbors.find((n) => n.id === data.beforeTaskId);
        let after = neighbors.find((n) => n.id === data.afterTaskId);
        if (before && after && before.position >= after.position)
          throw new ConflictException(
            "Task order changed. Refresh and try again."
          );
        const rank = () =>
          before && after
            ? (before.position + after.position) / 2
            : before
              ? before.position + 1024
              : after
                ? after.position - 1024
                : 0;
        let position = ids.length
          ? rank()
          : await appendPosition(tx, userId, data.status, task.parentId, id);
        if (
          (before && after && after.position - before.position < 0.0001) ||
          !Number.isFinite(position) ||
          Math.abs(position) > 1e12
        ) {
          const siblings = await tx.task.findMany({
            where: {
              project: { leadId: userId },
              parentId: task.parentId,
              status: data.status,
            },
            orderBy: [{ position: "asc" }, { id: "asc" }],
          });
          for (const [i, sibling] of siblings.entries()) {
            const next = (i + 1) * 1024;
            await tx.task.update({
              where: { id: sibling.id },
              data: { position: next },
            });
            if (before?.id === sibling.id)
              before = { ...before, position: next };
            if (after?.id === sibling.id) after = { ...after, position: next };
          }
          position = ids.length
            ? rank()
            : await appendPosition(tx, userId, data.status, task.parentId, id);
        }
        const updated = await tx.task.update({
          where: { id },
          data: { status: data.status, position, revision: { increment: 1 } },
          include: taskInclude,
        });
        if (task.status !== data.status)
          await tx.taskActivity.create({
            data: {
              taskId: id,
              userId,
              type: "STATUS_CHANGED",
              metadata: { from: task.status, to: data.status },
            },
          });
        return updated;
      },
      { timeout: 15_000 }
    );
  }

  private buildTaskActivities(
    existingTask: Awaited<ReturnType<TasksService["findAccessibleTask"]>>,
    data: UpdateTaskInput
  ): TaskActivityInput[] {
    const activities: TaskActivityInput[] = [];

    if (data.status !== undefined && data.status !== existingTask.status) {
      activities.push({
        type: "STATUS_CHANGED",
        metadata: {
          from: existingTask.status,
          to: data.status,
        },
      });
    }

    if (
      data.priority !== undefined &&
      data.priority !== existingTask.priority
    ) {
      activities.push({
        type: "PRIORITY_CHANGED",
        metadata: {
          from: existingTask.priority,
          to: data.priority,
        },
      });
    }

    if (
      data.projectId !== undefined &&
      data.projectId !== existingTask.projectId
    ) {
      activities.push({
        type: "PROJECT_CHANGED",
        metadata: {
          from: existingTask.projectId,
          to: data.projectId,
        },
      });
    }

    if (
      data.reporterId !== undefined &&
      data.reporterId !== existingTask.reporterId
    ) {
      activities.push({
        type: "REPORTER_CHANGED",
        metadata: {
          from: existingTask.reporterId,
          to: data.reporterId,
        },
      });
    }

    if (
      data.resource !== undefined &&
      data.resource !== existingTask.resource
    ) {
      activities.push({
        type: "RESOURCE_CHANGED",
        metadata: {
          from: existingTask.resource,
          to: data.resource,
        },
      });
    }

    if (data.members !== undefined) {
      const existingMemberIds = new Set(
        existingTask.members.map((member) => member.userId)
      );

      const nextMemberIds = new Set(data.members);

      for (const memberId of nextMemberIds) {
        if (!existingMemberIds.has(memberId)) {
          activities.push({
            type: "MEMBER_ADDED",
            metadata: {
              memberId,
            },
          });
        }
      }

      for (const memberId of existingMemberIds) {
        if (!nextMemberIds.has(memberId)) {
          activities.push({
            type: "MEMBER_REMOVED",
            metadata: {
              memberId,
            },
          });
        }
      }
    }

    if (data.labels !== undefined) {
      const existingLabelIds = new Set(
        existingTask.labels.map((label) => label.labelId)
      );

      const nextLabelIds = new Set(data.labels);

      for (const labelId of nextLabelIds) {
        if (!existingLabelIds.has(labelId)) {
          activities.push({
            type: "LABEL_ADDED",
            metadata: {
              labelId,
            },
          });
        }
      }

      for (const labelId of existingLabelIds) {
        if (!nextLabelIds.has(labelId)) {
          activities.push({
            type: "LABEL_REMOVED",
            metadata: {
              labelId,
            },
          });
        }
      }
    }

    return activities;
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
        revision: true,
        projectId: true,
        parentId: true,
        status: true,
        priority: true,
        resource: true,
        reporterId: true,

        members: {
          select: {
            userId: true,
          },
        },

        labels: {
          select: {
            labelId: true,
          },
        },
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

  private async validateIds(
    model: "user" | "label",
    ids: string[],
    userId: string
  ) {
    const uniqueIds = [...new Set(ids)];

    if (model === "user" && uniqueIds.some((id) => id !== userId))
      throw new NotFoundException("User not found");
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
              ownerId: userId,
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
