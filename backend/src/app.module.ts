import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MetricsSignatureService } from './data/services/metrics.signature.service';
import { MetricsYearService } from './data/services/metrics.year.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [FileController],
  providers: [MetricsSignatureService, MetricsYearService],
})
export class AppModule {}
