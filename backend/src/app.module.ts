import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AppService } from './data/services/app.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [FileController],
  providers: [AppService],
})
export class AppModule {}
