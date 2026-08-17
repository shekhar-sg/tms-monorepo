import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { type CreateCommentInput, createCommentSchema } from "@repo/types";
import type { Request } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { CommentsService } from "./comments.service";

@UseGuards(JwtAuthGuard)
@Controller("tasks/:taskId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Param("taskId") taskId: string, @Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.commentsService.findAll(taskId, request.user.userId);
  }

  @Post()
  create(
    @Param("taskId") taskId: string,
    @Req() request: Request,
    @Body(new ZodValidationPipe(createCommentSchema))
    body: CreateCommentInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.commentsService.create(taskId, body, request.user.userId);
  }
}
