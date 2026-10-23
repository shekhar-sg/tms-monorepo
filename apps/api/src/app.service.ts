import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getStatus() {
    return {
      message: "Task Manager API is running",
      data: { service: "Task Manager API", status: "ok" },
    };
  }
}
