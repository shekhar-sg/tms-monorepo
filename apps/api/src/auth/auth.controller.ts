import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { OAuthService } from "./oauth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauth: OAuthService
  ) {}

  @Post("guest")
  async guestLogin(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const { accessToken, user } = await this.authService.guestLogin(
      request.cookies?.accessToken
    );

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      user,
    };
  }

  @Get("providers")
  providers() {
    return this.oauth.availability();
  }

  @Get("google")
  googleLogin(@Req() req: Request, @Res() res: Response) {
    return this.oauth.start(req, res);
  }

  @Get("google/callback")
  googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.oauth.callback(req, res);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() request: Request) {
    return request.user;
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  }
}
