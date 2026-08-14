import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  type CreateTaskInput,
  createTaskSchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from "@repo/types";

import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query("projectId") projectId?: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.tasksService.findById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createTaskSchema))
    body: CreateTaskInput
  ) {
    return this.tasksService.create(body);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateTaskSchema))
    body: UpdateTaskInput
  ) {
    return this.tasksService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(id);
  }
}
