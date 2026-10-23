import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { PrismaService } from "../../prisma/prisma.service";
import { JwtStrategy } from "./jwt.strategy";

describe("Guest session invalidation", () => {
  const prisma = { user: { findUnique: jest.fn() } };
  const strategy = new JwtStrategy(
    new ConfigService({ JWT_SECRET: "test-secret" }),
    prisma as unknown as PrismaService
  );
  it("rejects the old guest token after an in-place Google upgrade", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user",
      isGuest: false,
      disabledAt: null,
    });
    await expect(
      strategy.validate({ sub: "user", isGuest: true })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it("rejects a disabled merged guest identity", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user",
      isGuest: true,
      disabledAt: new Date(),
    });
    await expect(
      strategy.validate({ sub: "user", isGuest: true })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it("uses the current database identity for a valid account", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user",
      isGuest: false,
      disabledAt: null,
    });
    expect(await strategy.validate({ sub: "user", isGuest: false })).toEqual({
      userId: "user",
      isGuest: false,
    });
  });
});
