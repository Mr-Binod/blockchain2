import { Test, TestingModule } from '@nestjs/testing';
import { UserOpsService } from './user-ops.service';

describe('UserOpsService', () => {
  let service: UserOpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOpsService],
    }).compile();

    service = module.get<UserOpsService>(UserOpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
