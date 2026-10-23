import { Test, TestingModule } from "@nestjs/testing";
import { PreferencesController } from "./preferences.controller";
import { PreferencesService } from "./preferences.service";

describe("PreferencesController", () => {
  let controller: PreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PreferencesService, useValue: {} }],
      controllers: [PreferencesController],
    }).compile();

    controller = module.get<PreferencesController>(PreferencesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
