import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { GoogleAuthRequest } from "./types/google-auth-request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("guest")
  async guestLogin(@Res({ passthrough: true }) response: Response) {
    const { accessToken, user } = await this.authService.guestLogin();

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

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() request: GoogleAuthRequest,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, user } = await this.authService.googleLogin(
      request.user
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

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() request: Request) {
    return request.user;
  }
}
