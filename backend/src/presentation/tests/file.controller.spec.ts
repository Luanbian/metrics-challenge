import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { FileController } from '../controllers/file.controller';
import { MetricsSignatureService } from '../../data/services/metrics.signature.service';
import { ChurnRateService } from '../../data/services/churn.rate.service';
import { NestApplication } from '@nestjs/core';

describe('FileController', () => {
  let app: NestApplication;
  let sut: FileController;
  let mrrService: MetricsSignatureService;
  let churnService: ChurnRateService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, ChurnRateService],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();
    mrrService = moduleRef.get<MetricsSignatureService>(MetricsSignatureService);
    churnService = moduleRef.get<ChurnRateService>(ChurnRateService);
  });

  it('should upload a file', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', Buffer.from('file content'), {
        filename: 'modelo_test.csv',
        contentType: 'text/csv'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('MRR');
    expect(response.body).toHaveProperty('churn');
  });
});
