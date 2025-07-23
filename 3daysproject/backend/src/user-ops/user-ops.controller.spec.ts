import { Test, TestingModule } from '@nestjs/testing';
import { UserOpsController } from './user-ops.controller';
import { UserOpsService } from './user-ops.service';

describe('UserOpsController', () => {
  let controller: UserOpsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOpsController],
      providers: [UserOpsService],
    }).compile();

    controller = module.get<UserOpsController>(UserOpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
