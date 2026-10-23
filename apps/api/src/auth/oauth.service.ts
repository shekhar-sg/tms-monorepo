import { createHash, randomBytes } from "node:crypto";
import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";

export const sessionCookie = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
});
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");

@Injectable()
export class OAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly users: UsersService
  ) {}

  availability() {
    return {
      google: Boolean(
        this.config.get("GOOGLE_CLIENT_ID") &&
          this.config.get("GOOGLE_CLIENT_SECRET") &&
          this.config.get("GOOGLE_CALLBACK_URL")
      ),
      ai: Boolean(this.config.get("GROQ_API_KEY")),
    };
  }

  async start(req: Request, res: Response) {
    if (!this.availability().google)
      throw new ServiceUnavailableException("Google sign-in is not configured");
    let guestId: string | undefined;
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(
        req.cookies?.accessToken ?? ""
      );
      const user = await this.users.findById(payload.sub);
      if (user?.isGuest && !user.disabledAt) guestId = user.id;
    } catch {
      /* Anonymous sign-in remains valid. */
    }
    const state = randomBytes(32).toString("hex");
    const browser = randomBytes(32).toString("hex");
    await this.prisma.oAuthAttempt.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    await this.prisma.oAuthAttempt.create({
      data: {
        id: hash(state),
        browserHash: hash(browser),
        guestId,
        returnTo: "/dashboard",
        expiresAt: new Date(Date.now() + 600_000),
      },
    });
    res.cookie("oauthBrowser", browser, {
      ...sessionCookie(),
      maxAge: 600_000,
    });
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({
      client_id: this.config.getOrThrow("GOOGLE_CLIENT_ID"),
      redirect_uri: this.config.getOrThrow("GOOGLE_CALLBACK_URL"),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    }).toString();
    res.redirect(url.toString());
  }

  async callback(req: Request, res: Response) {
    try {
      const state = typeof req.query.state === "string" ? req.query.state : "";
      const browser = req.cookies?.oauthBrowser;
      if (!state || !browser) throw new UnauthorizedException();
      const attempt = await this.prisma.$transaction(async (tx) => {
        const found = await tx.oAuthAttempt.findUnique({
          where: { id: hash(state) },
        });
        if (
          !found ||
          found.browserHash !== hash(browser) ||
          found.expiresAt < new Date()
        )
          throw new UnauthorizedException();
        const consumed = await tx.oAuthAttempt.deleteMany({
          where: { id: found.id },
        });
        if (consumed.count !== 1) throw new UnauthorizedException();
        return found;
      });
      if (req.query.error || typeof req.query.code !== "string")
        throw new UnauthorizedException();
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: req.query.code,
          client_id: this.config.getOrThrow("GOOGLE_CLIENT_ID"),
          client_secret: this.config.getOrThrow("GOOGLE_CLIENT_SECRET"),
          redirect_uri: this.config.getOrThrow("GOOGLE_CALLBACK_URL"),
          grant_type: "authorization_code",
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const tokens = (await tokenResponse.json()) as { access_token?: string };
      if (!tokenResponse.ok || !tokens.access_token)
        throw new UnauthorizedException();
      const profileResponse = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
          signal: AbortSignal.timeout(15_000),
        }
      );
      const profile = (await profileResponse.json()) as {
        sub?: string;
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
      };
      if (
        !profileResponse.ok ||
        !profile.sub ||
        !profile.email ||
        profile.email_verified !== true
      )
        throw new UnauthorizedException();
      const user = await this.users.linkGoogle(
        {
          providerAccountId: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
        },
        attempt.guestId
      );
      const accessToken = await this.jwt.signAsync({
        sub: user.id,
        isGuest: false,
      });
      res.cookie("accessToken", accessToken, {
        ...sessionCookie(),
        maxAge: 604_800_000,
      });
      res.clearCookie("oauthBrowser", sessionCookie());
      res.redirect(
        `${this.config.get("FRONTEND_URL") ?? "http://localhost:3000"}${attempt.returnTo}`
      );
    } catch {
      res.clearCookie("oauthBrowser", sessionCookie());
      res.redirect(
        `${this.config.get("FRONTEND_URL") ?? "http://localhost:3000"}/auth-error`
      );
    }
  }
}
