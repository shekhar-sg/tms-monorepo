import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TaskActivitiesService } from "./task-activities.service";

@UseGuards(JwtAuthGuard)
@Controller("tasks/:taskId/activities")
export class TaskActivitiesController {
  constructor(private readonly taskActivitiesService: TaskActivitiesService) {}

  @Get()
  findAll(@Param("taskId") taskId: string, @Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.taskActivitiesService.findAll(taskId, request.user.userId);
  }
}
