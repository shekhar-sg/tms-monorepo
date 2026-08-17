import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TaskActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(taskId: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          leadId: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return this.prisma.taskActivity.findMany({
      where: {
        taskId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
