import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { PreferencesService } from "./preferences.service";

describe("PreferencesService", () => {
  let service: PreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferencesService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
