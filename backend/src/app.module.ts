import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MetricsService } from './data/services/metrics.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [FileController],
  providers: [MetricsService],
})
export class AppModule {}
