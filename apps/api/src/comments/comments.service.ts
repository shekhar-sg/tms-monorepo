import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateCommentInput } from "@repo/types";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CommentsService {
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

    return this.prisma.comment.findMany({
      where: {
        taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async create(taskId: string, data: CreateCommentInput, userId: string) {
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

    if (data.parentId) {
      const parentComment = await this.prisma.comment.findFirst({
        where: {
          id: data.parentId,
          taskId,
        },
        select: {
          id: true,
        },
      });

      if (!parentComment) {
        throw new NotFoundException("Parent comment not found");
      }
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        taskId,
        authorId: userId,
        parentId: data.parentId ?? null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }
}
