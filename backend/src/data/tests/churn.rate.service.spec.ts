import { NestApplication } from "@nestjs/core";
import { ChurnRateService } from "../services/churn.rate.service";
import { Test, TestingModule } from "@nestjs/testing";
import { FileController } from "../../presentation/controllers/file.controller";
import { MetricsSignatureService } from "../services/metrics.signature.service";
import { MetricsYearService } from "../services/metrics.year.service";
import { MetricsMonthService } from "../services/metrics.month.service";
import { jsonMock } from "./mocks/json.mock";

describe('ChurnRateService', () => {
  let app: NestApplication;
  let sut: ChurnRateService;
  let years: MetricsYearService;
  let months: MetricsMonthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sut = moduleRef.get<ChurnRateService>(ChurnRateService);
    years = moduleRef.get<MetricsYearService>(MetricsYearService);
    months = moduleRef.get<MetricsMonthService>(MetricsMonthService);
  });

  it('should return metrics general and per year', async () => {
    const metric = await sut.metrics(jsonMock);
    expect(metric.general).toBeDefined();
    expect(metric.perYear).toBeDefined();
  })
  it('should call services with correct params', async () => {
    const yearServiceSpy = jest.spyOn(years, 'metrics');
    const monthServiceSpy = jest.spyOn(months, 'metrics');
    await sut.metrics(jsonMock);
    const yearParam = await years.metrics(jsonMock, 'churn');
    expect(yearServiceSpy).toHaveBeenCalledWith(jsonMock, 'churn');
    expect(monthServiceSpy).toHaveBeenCalledWith(yearParam);
  })
  it('should return error if status not be valid', async () => {
    jsonMock[0].status = 'invalid'
    const metric = sut.metrics(jsonMock);
    await expect(metric).rejects.toThrow("Status do user_1 não reconhecido");
  })
})