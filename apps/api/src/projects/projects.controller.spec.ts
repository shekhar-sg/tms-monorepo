import { Test, TestingModule } from "@nestjs/testing";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

describe("ProjectsController", () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ProjectsService, useValue: {} }],
      controllers: [ProjectsController],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
