import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MetricsSignatureService } from './data/services/metrics.signature.service';
import { MetricsYearService } from './data/services/metrics.year.service';
import { MetricsMonthService } from './data/services/metrics.month.service';
import { ChurnRateService } from './data/services/churn.rate.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [FileController],
  providers: [MetricsSignatureService, MetricsYearService, MetricsMonthService, ChurnRateService],
})
export class AppModule {}
