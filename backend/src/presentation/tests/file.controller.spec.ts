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
import { badRequest } from '../helpers/http.helper';

describe('FileController', () => {
  let app: NestApplication;
  let sut: FileController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sut = moduleRef.get<FileController>(FileController);
  });

  it('should upload a file', async () => {
    const filePath = path.join(__dirname, 'model_test.csv');
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', fs.readFileSync(filePath), {
        filename: 'modelo_test.csv',
        contentType: 'text/csv'
      });
    expect(response.statusCode).toBe(201);
  });
  it('should return error file not found', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', undefined, {});
    expect(response.body.statusCode).toBe(400);
    expect(response.body.body).toBe("Arquivo não recebido");
  })
  it('should return error type of file not permited', async () => {
    const filePath = path.join(__dirname, 'model_test.txt');
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', fs.readFileSync(filePath), {
        filename: 'modelo_test.txt',
        contentType: 'text/txt'
      });
    expect(response.statusCode).toEqual(500);
  })
  it('should return bad request if file is not received', async () => {
    const result = await sut.receiveFile(null);
    expect(result).toEqual(badRequest('Arquivo não recebido'));
  });
});
