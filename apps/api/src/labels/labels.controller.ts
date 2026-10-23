import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { z } from "zod";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { LabelsService } from "./labels.service";

const labelSchema = z.object({
  name: z.string().trim().min(1).max(60),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .optional(),
});
@UseGuards(JwtAuthGuard)
@Controller("labels")
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}
  @Get() findAll(@Req() req: Request) {
    return this.labelsService.findAll(req.user!.userId);
  }
  @Get(":id") findById(@Param("id") id: string, @Req() req: Request) {
    return this.labelsService.findById(id, req.user!.userId);
  }
  @Post() create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(labelSchema)) body: z.infer<typeof labelSchema>
  ) {
    return this.labelsService.create(
      req.user!.userId,
      body.name,
      body.color ?? undefined
    );
  }
  @Patch(":id") update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body(new ZodValidationPipe(labelSchema.partial())) body: Partial<
      z.infer<typeof labelSchema>
    >
  ) {
    return this.labelsService.update(
      id,
      req.user!.userId,
      body.name,
      body.color
    );
  }
  @Delete(":id") remove(@Param("id") id: string, @Req() req: Request) {
    return this.labelsService.remove(id, req.user!.userId);
  }
}
