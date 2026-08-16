import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  type CreateTaskInput,
  createTaskSchema,
  type MoveTaskInput,
  moveTaskSchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from "@repo/types";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { TasksService } from "./tasks.service";

@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() request: Request, @Query("projectId") projectId?: string) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.tasksService.findAll(request.user.userId, projectId);
  }

  @Get(":id")
  findById(@Param("id") id: string, @Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.tasksService.findById(id, request.user.userId);
  }

  @Post()
  create(
    @Req() request: Request,
    @Body(new ZodValidationPipe(createTaskSchema))
    body: CreateTaskInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.tasksService.create(body, request.user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() request: Request,
    @Body(new ZodValidationPipe(updateTaskSchema))
    body: UpdateTaskInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.tasksService.update(id, body, request.user.userId);
  }

  @Patch(":id/move")
  move(
    @Param("id") id: string,
    @Req() request: Request,
    @Body(new ZodValidationPipe(moveTaskSchema))
    body: MoveTaskInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.tasksService.move(id, body, request.user.userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.tasksService.remove(id, request.user.userId);
  }
}
