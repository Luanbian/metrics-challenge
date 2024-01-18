import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [AppService],
})
export class AppModule {}
