import { NestApplication } from "@nestjs/core";
import { MetricsMonthService } from "../services/metrics.month.service"
import { FileController } from "../../presentation/controllers/file.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { MetricsSignatureService } from "../services/metrics.signature.service";
import { MetricsYearService } from "../services/metrics.year.service";
import { ChurnRateService } from "../services/churn.rate.service";
import { yearsMock } from "./mocks/years.mock";
import { jsonMock } from "./mocks/json.mock";

describe('MetricsMonthService', () => {
  let app: NestApplication;
  let sut: MetricsYearService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sut = moduleRef.get<MetricsYearService>(MetricsYearService);
  });

  it('should return data separated by years', async () => {
    jest.spyOn(sut, 'metrics').mockImplementationOnce(async () => yearsMock);
    const metrics = await sut.metrics(jsonMock, 'mrr');
    expect(metrics).toEqual(yearsMock);
  })
})