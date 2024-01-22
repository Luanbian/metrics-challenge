import { NestApplication } from "@nestjs/core";
import { MetricsMonthService } from "../services/metrics.month.service"
import { FileController } from "../../presentation/controllers/file.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { MetricsSignatureService } from "../services/metrics.signature.service";
import { MetricsYearService } from "../services/metrics.year.service";
import { ChurnRateService } from "../services/churn.rate.service";
import { yearsMock } from "./mocks/years.mock";
import { monthMock } from "./mocks/month.mock";

describe('MetricsMonthService', () => {
  let app: NestApplication;
  let sut: MetricsMonthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sut = moduleRef.get<MetricsMonthService>(MetricsMonthService);
  });

  it('should return data separated by months', async () => {
    jest.spyOn(sut, 'metrics').mockImplementationOnce(async () => monthMock)
    const metrics = await sut.metrics(yearsMock);
    expect(metrics).toEqual(monthMock);
  })
})