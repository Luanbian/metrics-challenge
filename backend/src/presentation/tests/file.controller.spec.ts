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

const createTempFile = (content, fileName) => {
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, content);

  return filePath;
};

const deleteTempFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

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
    const filePath = createTempFile('test,model.csv,data\n1,2,3', 'test_model.csv');
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', fs.readFileSync(filePath), {
        filename: 'modelo_test.csv',
        contentType: 'text/csv'
      });
    expect(response.statusCode).toBe(201);
    deleteTempFile(filePath);
  });
  it('should return error file not found', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/file')
      .attach('file', undefined, {});
    expect(response.body.statusCode).toBe(400);
    expect(response.body.body).toBe("Arquivo não recebido");
  })
  it('should return bad request if file is not received', async () => {
    const result = await sut.receiveFile(null);
    expect(result).toEqual(badRequest('Arquivo não recebido'));
  });
});
