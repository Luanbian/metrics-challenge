import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpResponse } from 'src/@types/http';
import { badRequest, ok, serverError } from '../helpers/http.helper';
import { MetricsService } from 'src/data/services/metrics.service';

const allowedFileTypes = ['.xlsx', '.csv'];

@Controller('api/file')
export class FileController {
  constructor (private readonly service: MetricsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname || '').toLowerCase();
        const filename = file.fieldname + '-' + unique + extension;
        callback(null, filename);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname || !file) {
        return callback(new Error('Nome do arquivo não encontrado'), false);
      }

      const extension = extname(file.originalname || '').toLowerCase();
      if (allowedFileTypes.includes(extension)) {
        callback(null, true);
      } else {
        callback(new Error('Tipo de arquivo não permitido'), false);
      }
    },
  }))
  async receiveFile(@UploadedFile() file: Express.Multer.File): Promise<HttpResponse> {
    if (!file) {
      return badRequest('Arquivo não recebido');
    }
    try {
      const extension = extname(file.originalname).toLowerCase();
      const json = await this.service.getFile(file, extension);
      return ok(json);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
