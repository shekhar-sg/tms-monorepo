import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(userId: string) {
    return this.prisma.label.findMany({
      where: { ownerId: userId },
      orderBy: { name: "asc" },
    });
  }
  async findById(id: string, userId: string) {
    const label = await this.prisma.label.findFirst({
      where: { id, ownerId: userId },
    });
    if (!label) throw new NotFoundException("Label not found");
    return label;
  }
  create(userId: string, name: string, color?: string) {
    return this.prisma.label.create({ data: { ownerId: userId, name, color } });
  }
  async update(
    id: string,
    userId: string,
    name?: string,
    color?: string | null
  ) {
    await this.findById(id, userId);
    return this.prisma.label.update({ where: { id }, data: { name, color } });
  }
  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.label.delete({ where: { id } });
  }
}
