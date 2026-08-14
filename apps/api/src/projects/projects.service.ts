import { Injectable } from "@nestjs/common";
import type { Priority } from "../../generated/prisma/enums";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        lead: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: true,
      },
    });
  }

  async create(data: {
    title: string;
    priority?: Priority;
    leadId?: string;
    dueDate?: string;
  }) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        priority: data.priority,
        leadId: data.leadId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: {
        lead: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      priority?: Priority;
      leadId?: string | null;
      dueDate?: string | null;
    }
  ) {
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

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
