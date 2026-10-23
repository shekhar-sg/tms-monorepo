import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import {
  type AiApplyInput,
  type AiAssistInput,
  aiApplySchema,
  aiAssistSchema,
} from "@repo/types";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { AiService } from "./ai.service";
@UseGuards(JwtAuthGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}
  @Post("assist") assist(
    @Body(new ZodValidationPipe(aiAssistSchema)) input: AiAssistInput,
    @Req() req: Request
  ) {
    return this.ai.assist(
      input,
      req.user!,
      req.ip ?? req.socket.remoteAddress ?? "unknown"
    );
  }
  @Post("apply") apply(
    @Body(new ZodValidationPipe(aiApplySchema)) input: AiApplyInput,
    @Req() req: Request
  ) {
    return this.ai.apply(input, req.user!.userId);
  }
}
