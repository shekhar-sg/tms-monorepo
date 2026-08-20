import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { UpdateUserInput } from "@repo/types";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("me")
  getCurrent(@Req() request: Request) {
    if (!request.user) throw new UnauthorizedException();
    return this.usersService.findById(request.user.userId);
  }

  @Patch("me")
  updateMe(@Req() request: Request, @Body() data: UpdateUserInput) {
    if (!request.user) throw new UnauthorizedException();
    return this.usersService.updateMe(request.user.userId, data);
  }

  @Delete("me")
  leaveWorkspace(@Req() request: Request) {
    if (!request.user) throw new UnauthorizedException();
    return this.usersService.leaveWorkspace(request.user.userId);
  }
}
