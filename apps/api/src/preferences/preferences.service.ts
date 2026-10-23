import { Injectable } from "@nestjs/common";
import type { UpdateUserPreferenceInput } from "@repo/types";
import { AccentColor, Theme } from "../../generated/prisma/enums";
import { lockOwner } from "../common/owner-lock";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    return this.prisma.userPreference.upsert({
      where: {
        userId,
      },
      create: {
        userId,
      },
      update: {},
    });
  }

  async update(userId: string, data: UpdateUserPreferenceInput) {
    return this.prisma.$transaction(async (tx) => {
      await lockOwner(tx, userId);
      const current = await tx.userPreference.findUnique({ where: { userId } });
      const taskViews = data.taskViews
        ? {
            ...((current?.taskViews as Record<string, never>) ?? {}),
            ...data.taskViews,
          }
        : undefined;
      const values = {
        ...(data.theme && { theme: data.theme as Theme }),
        ...(data.accentColor && {
          accentColor: data.accentColor as AccentColor,
        }),
        ...(taskViews && { taskViews }),
      };
      return tx.userPreference.upsert({
        where: { userId },
        create: { userId, ...values },
        update: values,
      });
    });
  }
}
