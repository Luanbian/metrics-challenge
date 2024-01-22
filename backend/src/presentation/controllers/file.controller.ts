import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpResponse } from '../../@types/http';
import { badRequest, ok, serverError } from '../helpers/http.helper';
import { MetricsSignatureService } from '../../data/services/metrics.signature.service';
import { xlsxToJson } from '../../utils/xlsx.to.json';
import { csvToJson } from '../../utils/csv.to.json';
import { ChurnRateService } from '../../data/services/churn.rate.service';

const allowedFileTypes = ['.xlsx', '.csv'];

@Controller('api/file')
export class FileController {
  constructor (
    private readonly mrr: MetricsSignatureService,
    private readonly churn: ChurnRateService,
  ) {}

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
      const json = extension === '.xlsx' ? xlsxToJson(file.path) : await csvToJson(file.path);

      const MRR = await this.mrr.metrics(json);
      const churn = await this.churn.metrics(json);

      const body = { MRR, churn }
      return ok(body);
    } catch (error) {
      return serverError(error);
    }
  }
}
