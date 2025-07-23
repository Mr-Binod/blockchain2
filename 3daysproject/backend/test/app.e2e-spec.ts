import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    Logger.overrideLogger(false);  // enable logging (false = enable, true = disable)
  });
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    )
    Logger.overrideLogger(false);
    await app.init();
  });



  describe('account', () => {
    it('POST', () => {
      const data = request(app.getHttpServer())
        .post('/account')
        .send({
          id: 'bing',
          email: 'bing11@gmail.com',
          salt: 'hi',
          domain: 'google'
        })
      console.log(data)
    })
    it('GET', () => {
      const data = request(app.getHttpServer())
      .get('/account')

      console.log(data)
    })
  })
})