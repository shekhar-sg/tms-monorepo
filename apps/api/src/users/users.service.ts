import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateUserInput } from "@repo/types";
import { lockOwner } from "../common/owner-lock";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createGuest() {
    return this.prisma.user.create({
      data: {
        name: "Guest",
        isGuest: true,
      },
    });
  }

  async linkGoogle(
    data: {
      providerAccountId: string;
      email: string;
      name?: string;
      avatar?: string;
    },
    guestId?: string | null
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        // A shared transaction lock prevents duplicate account creation by concurrent callbacks.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(932478)`;
        const account = await tx.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "GOOGLE",
              providerAccountId: data.providerAccountId,
            },
          },
          include: { user: true },
        });
        const existing =
          account?.user ??
          (await tx.user.findUnique({ where: { email: data.email } }));
        const guest = guestId
          ? await tx.user.findUnique({ where: { id: guestId } })
          : null;
        const validGuest = guest?.isGuest && !guest.disabledAt ? guest : null;
        const target = existing ?? validGuest;
        if (existing?.disabledAt)
          throw new BadRequestException("This account is unavailable");
        if (target) await lockOwner(tx, target.id);
        if (validGuest && existing && existing.id !== validGuest.id)
          await lockOwner(tx, validGuest.id);
        const user = target
          ? await tx.user.update({
              where: { id: target.id },
              data: {
                email: data.email,
                isGuest: false,
                name: existing?.name ?? data.name,
                avatar: data.avatar ?? target.avatar,
              },
            })
          : await tx.user.create({
              data: {
                email: data.email,
                isGuest: false,
                name: data.name,
                avatar: data.avatar,
              },
            });
        if (!account)
          await tx.account.create({
            data: {
              userId: user.id,
              provider: "GOOGLE",
              providerAccountId: data.providerAccountId,
            },
          });
        if (validGuest && validGuest.id !== user.id) {
          const from = validGuest.id;
          await tx.project.updateMany({
            where: { leadId: from },
            data: { leadId: user.id },
          });
          await tx.task.updateMany({
            where: { reporterId: from },
            data: { reporterId: user.id },
          });
          await tx.comment.updateMany({
            where: { authorId: from },
            data: { authorId: user.id },
          });
          await tx.taskActivity.updateMany({
            where: { userId: from },
            data: { userId: user.id },
          });
          const memberships = await tx.taskMember.findMany({
            where: { userId: from },
          });
          await tx.taskMember.createMany({
            data: memberships.map((m) => ({
              taskId: m.taskId,
              userId: user.id,
            })),
            skipDuplicates: true,
          });
          await tx.taskMember.deleteMany({ where: { userId: from } });
          for (const label of await tx.label.findMany({
            where: { ownerId: from },
          })) {
            const duplicate = await tx.label.findUnique({
              where: { ownerId_name: { ownerId: user.id, name: label.name } },
            });
            if (duplicate) {
              const links = await tx.taskLabel.findMany({
                where: { labelId: label.id },
              });
              await tx.taskLabel.createMany({
                data: links.map((l) => ({
                  taskId: l.taskId,
                  labelId: duplicate.id,
                })),
                skipDuplicates: true,
              });
              await tx.label.delete({ where: { id: label.id } });
            } else
              await tx.label.update({
                where: { id: label.id },
                data: { ownerId: user.id },
              });
          }
          const preferences = await tx.userPreference.findUnique({
            where: { userId: from },
          });
          if (
            preferences &&
            !(await tx.userPreference.findUnique({
              where: { userId: user.id },
            }))
          ) {
            await tx.userPreference.update({
              where: { userId: from },
              data: { userId: user.id },
            });
          }
          // Rerank the combined workspace deterministically after transfer.
          const mergedTasks = await tx.task.findMany({
            where: { project: { leadId: user.id } },
            orderBy: [{ position: "asc" }, { createdAt: "asc" }, { id: "asc" }],
          });
          const ranks = new Map<string, number>();
          for (const task of mergedTasks) {
            const group = `${task.parentId ?? "root"}:${task.status}`;
            const rank = (ranks.get(group) ?? 0) + 1024;
            ranks.set(group, rank);
            await tx.task.update({
              where: { id: task.id },
              data: { position: rank, revision: { increment: 1 } },
            });
          }
          await tx.user.update({
            where: { id: from },
            data: { disabledAt: new Date() },
          });
        }
        return user;
      },
      { timeout: 30_000 }
    );
  }

  async findAll(userId: string) {
    return this.prisma.user.findMany({
      where: { id: userId, disabledAt: null },
      orderBy: {
        name: "asc",
      },
    });
  }

  async updateMe(id: string, data: UpdateUserInput) {
    if (data.email !== undefined) {
      throw new BadRequestException("Your email is managed by Google sign-in");
    }
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isGuest && data.email !== undefined) {
      throw new BadRequestException("Guest users cannot update their email");
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async leaveWorkspace(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
