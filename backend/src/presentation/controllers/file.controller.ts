import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpResponse } from 'src/@types/http';
import { badRequest, ok, serverError } from '../helpers/http.helper';
import { MetricsSignatureService } from 'src/data/services/metrics.signature.service';
import { xlsxToJson } from 'src/utils/xlsx.to.json';
import { csvToJson } from 'src/utils/csv.to.json';
import { MetricsYearService } from 'src/data/services/metrics.year.service';
import { ChurnRateService } from 'src/data/services/churn.rate.service';

const allowedFileTypes = ['.xlsx', '.csv'];

@Controller('api/file')
export class FileController {
  constructor (
    private readonly mrr: MetricsSignatureService,
    private readonly year: MetricsYearService,
    private readonly churn: ChurnRateService
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

      const years = await this.year.metrics(json);
      const MRR = await this.mrr.metrics(json, years);
      const churn = await this.churn.metrics(json);
      const metrics = {
        "2022": MRR.perYear[2022],
        "2023": MRR.perYear[2023],
        "2024": MRR.perYear[2024],
        "2025":MRR.perYear[2025]
      }
      const body = {general: MRR.general, metrics, churn}
      return ok(body);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}
