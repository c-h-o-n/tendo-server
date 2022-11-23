import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { MatchService } from './match.service';
import { AppModule } from 'src/app.module';

import * as moment from "moment";

describe('POST /match', () => {
  let app: INestApplication;
  let matchService: MatchService;
  let accessToken = '';
  const teamAId = 'some-uuid'
  const teamBId = 'some-uuid'

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MatchService)
      .useValue(matchService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // create user
    await request(app.getHttpServer())
      .post('/match')
      .set('Accept', 'application/json')
      .send({
        username: 'test',
        password: 'test',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@johndoe.com',
        birthDate: new Date('1985-12-12'),
        location: 'Budapest',
      });

    const auth = await request(app.getHttpServer())
      .post('/auth/signin')
      .set('Accept', 'application/json')
      .send({ username: 'test', password: 'test' });

    accessToken = auth.body.access_token;
  });

  it('responds with the created match', async () => {
    const tommorrow = moment().add(1, 'days');

    const response = await await request(app.getHttpServer())
      .post('/match')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        teamAId: teamAId,
        teamBId: teamAId,
        dateTime: tommorrow,
      });

    console.log(response.status);

    expect(response.type).toBe('application/json');
    expect(response.status).toBe(201);
  });
});
