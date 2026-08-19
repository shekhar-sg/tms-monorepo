import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LabelsService } from "./labels.service";

@UseGuards(JwtAuthGuard)
@Controller("labels")
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  findAll() {
    return this.labelsService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.labelsService.findById(id);
  }

  @Post()
  create(
    @Body()
    body: { name: string; color?: string }
  ) {
    return this.labelsService.create(body.name, body.color);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    body: {
      name?: string;
      color?: string | null;
    }
  ) {
    return this.labelsService.update(id, body.name, body.color);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.labelsService.remove(id);
  }
}
