import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  type UpdateUserPreferenceInput,
  updateUserPreferenceSchema,
} from "@repo/types";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { PreferencesService } from "./preferences.service";

@UseGuards(JwtAuthGuard)
@Controller("preferences")
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  get(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return this.preferencesService.get(request.user.userId);
  }

  @Patch()
  update(
    @Req() request: Request,
    @Body(new ZodValidationPipe(updateUserPreferenceSchema))
    body: UpdateUserPreferenceInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return this.preferencesService.update(request.user.userId, body);
  }
}
