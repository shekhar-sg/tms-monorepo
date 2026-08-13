import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth-guard";
import type { GoogleAuthRequest } from "./types/google-auth-request";

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
  googleCallback(@Req() request: GoogleAuthRequest) {
    return this.authService.googleLogin(request.user);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() request: Request) {
    return request.user;
  }
}
