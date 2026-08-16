import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  type CreateProjectInput,
  createProjectSchema,
  type UpdateProjectInput,
  updateProjectSchema,
} from "@repo/types";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ProjectsService } from "./projects.service";

@UseGuards(JwtAuthGuard)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return this.projectsService.findAll(request.user.userId);
  }

  @Get(":id")
  findById(@Param("id") id: string, @Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return this.projectsService.findById(id, request.user.userId);
  }

  @Post()
  create(
    @Req() request: Request,
    @Body(new ZodValidationPipe(createProjectSchema))
    body: CreateProjectInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.projectsService.create(body, request.user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() request: Request,
    @Body(new ZodValidationPipe(updateProjectSchema))
    body: UpdateProjectInput
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return this.projectsService.update(id, body, request.user.userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return this.projectsService.remove(id, request.user.userId);
  }
}
