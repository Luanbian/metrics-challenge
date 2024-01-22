import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { FileController } from '../controllers/file.controller';
import { MetricsSignatureService } from '../../data/services/metrics.signature.service';
import { ChurnRateService } from '../../data/services/churn.rate.service';
import { NestApplication } from '@nestjs/core';
import { MetricsYearService } from '../../data/services/metrics.year.service';
import { MetricsMonthService } from '../../data/services/metrics.month.service';

describe('FileController', () => {
  let app: NestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should upload a file', async () => {
    const filePath = path.join(__dirname, 'model_test.csv');
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', fs.readFileSync(filePath), {
        filename: 'modelo_test.csv',
        contentType: 'text/csv'
      });
    expect(response.status).toBe(201);
  });
});
