import { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";
import type { PrismaService } from "../prisma/prisma.service";
import type { UsersService } from "../users/users.service";
import { OAuthService } from "./oauth.service";

describe("Google OAuth state", () => {
  const prisma = {
    oAuthAttempt: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const jwt = { verifyAsync: jest.fn() };
  const users = { findById: jest.fn(), linkGoogle: jest.fn() };
  const config = new ConfigService({
    GOOGLE_CLIENT_ID: "id",
    GOOGLE_CLIENT_SECRET: "secret",
    GOOGLE_CALLBACK_URL: "http://localhost:3000/api/auth/google/callback",
    FRONTEND_URL: "http://localhost:3000",
  });
  const service = new OAuthService(
    prisma as unknown as PrismaService,
    config,
    jwt as unknown as JwtService,
    users as unknown as UsersService
  );
  const response = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    redirect: jest.fn(),
  };
  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation((fn) => fn(prisma));
  });
  it("binds guest upgrade to one expiring browser attempt", async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: "guest" });
    users.findById.mockResolvedValue({
      id: "guest",
      isGuest: true,
      disabledAt: null,
    });
    await service.start(
      { cookies: { accessToken: "token" } } as Request,
      response as unknown as Response
    );
    expect(prisma.oAuthAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        guestId: "guest",
        browserHash: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    });
    expect(response.redirect.mock.calls[0][0]).toContain(
      "https://accounts.google.com/"
    );
    expect(response.cookie).toHaveBeenCalledWith(
      "oauthBrowser",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: "lax" })
    );
  });
  it("rejects invalid or replayed state without changing the guest session", async () => {
    prisma.oAuthAttempt.findUnique.mockResolvedValue(null);
    await service.callback(
      {
        query: { state: "replayed", code: "unused" },
        cookies: { oauthBrowser: "browser" },
      } as unknown as Request,
      response as unknown as Response
    );
    expect(users.linkGoogle).not.toHaveBeenCalled();
    expect(response.cookie).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(
      "http://localhost:3000/auth-error"
    );
    expect(response.clearCookie).toHaveBeenCalledWith(
      "oauthBrowser",
      expect.anything()
    );
  });
});
