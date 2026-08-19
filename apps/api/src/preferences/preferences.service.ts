import { Injectable } from "@nestjs/common";
import type { UpdateUserPreferenceInput } from "@repo/types";
import { AccentColor, Theme } from "../../generated/prisma/enums";
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
    return this.prisma.userPreference.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        ...(data.theme && {
          theme: data.theme as Theme,
        }),
        ...(data.accentColor && {
          accentColor: data.accentColor as AccentColor,
        }),
      },
      update: {
        ...(data.theme && {
          theme: data.theme as Theme,
        }),
        ...(data.accentColor && {
          accentColor: data.accentColor as AccentColor,
        }),
      },
    });
  }
}
