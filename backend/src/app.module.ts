import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './data/services/file.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class AppModule {}
