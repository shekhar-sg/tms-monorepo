import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { LabelsService } from "./labels.service";

describe("LabelsService", () => {
  let service: LabelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabelsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<LabelsService>(LabelsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
