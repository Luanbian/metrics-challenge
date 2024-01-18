import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class FileController {
  constructor(private readonly appService: AppService) {}

  @Post('/file')
  receiveFile(): string {
    return this.appService.getHello();
  }
}
