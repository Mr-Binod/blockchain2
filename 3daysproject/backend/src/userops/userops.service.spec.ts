import { Test, TestingModule } from '@nestjs/testing';
import { UseropsService } from './userops.service';

describe('UseropsService', () => {
  let service: UseropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UseropsService],
    }).compile();

    service = module.get<UseropsService>(UseropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
