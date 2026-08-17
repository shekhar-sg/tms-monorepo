import { Test, TestingModule } from '@nestjs/testing';
import { TaskActivitiesService } from './task-activities.service';

describe('TaskActivitiesService', () => {
  let service: TaskActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskActivitiesService],
    }).compile();

    service = module.get<TaskActivitiesService>(TaskActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
