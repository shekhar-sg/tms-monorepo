import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.label.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string) {
    const label = await this.prisma.label.findUnique({
      where: { id },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    return label;
  }

  async create(name: string, color?: string) {
    const existingLabel = await this.prisma.label.findUnique({
      where: { name },
    });

    if (existingLabel) {
      throw new ConflictException("Label already exists");
    }

    return this.prisma.label.create({
      data: {
        name,
        color,
      },
    });
  }

  async update(id: string, name?: string, color?: string | null) {
    await this.findById(id);

    return this.prisma.label.update({
      where: { id },
      data: {
        name,
        color,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.label.delete({
      where: { id },
    });
  }
}
