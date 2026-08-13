import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guards/google-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("guest")
  guestLogin() {
    return this.authService.guestLogin();
  }

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() request: Request) {
    return this.authService.googleLogin(
      request.user as {
        providerAccountId: string;
        email?: string;
        name?: string;
        avatar?: string;
      }
    );
  }
}
