import { NestApplication } from "@nestjs/core";
import { MetricsSignatureService } from "../services/metrics.signature.service";
import { FileController } from "../../presentation/controllers/file.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { MetricsYearService } from "../services/metrics.year.service";
import { MetricsMonthService } from "../services/metrics.month.service";
import { ChurnRateService } from "../services/churn.rate.service";
import { metricsMock } from "./mocks/metrics.mock";
import { jsonMock } from "./mocks/json.mock";

describe('MetricsSignatureService', () => {
  let app: NestApplication;
  let sut: MetricsSignatureService;
  let years: MetricsYearService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sut = moduleRef.get<MetricsSignatureService>(MetricsSignatureService);
    years = moduleRef.get<MetricsYearService>(MetricsYearService);
  });

  it('should return MRR general and per year if success', async () => {
    jest.spyOn(sut, 'metrics').mockImplementationOnce(async () => metricsMock);
    const metrics = await sut.metrics(jsonMock);
    expect(metrics).toEqual(metricsMock);
  })
  it('should call year service with correct param', async () => {
    const yearServiceSpy = jest.spyOn(years, 'metrics');
    await sut.metrics(jsonMock);
    expect(yearServiceSpy).toHaveBeenCalledWith(jsonMock, 'mrr')
    expect(yearServiceSpy).toHaveBeenCalledTimes(1);
  })
  it('should return error if signature not be valid', async () => {
    jsonMock[0].billingEveryXDays = 'invalid'
    const metric = sut.metrics(jsonMock);
    await expect(metric).rejects.toThrow("user_1 fora do padrão de assinatura");
  })
})