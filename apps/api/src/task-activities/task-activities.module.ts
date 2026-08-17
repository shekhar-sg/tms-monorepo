import { Module } from "@nestjs/common";

import { TaskActivitiesController } from "./task-activities.controller";
import { TaskActivitiesService } from "./task-activities.service";

@Module({
  controllers: [TaskActivitiesController],
  providers: [TaskActivitiesService],
})
export class TaskActivitiesModule {}
