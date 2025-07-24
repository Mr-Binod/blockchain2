import { Test, TestingModule } from '@nestjs/testing';
import { UseropsController } from './userops.controller';
import { UseropsService } from './userops.service';

describe('UseropsController', () => {
  let controller: UseropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UseropsController],
      providers: [UseropsService],
    }).compile();

    controller = module.get<UseropsController>(UseropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
