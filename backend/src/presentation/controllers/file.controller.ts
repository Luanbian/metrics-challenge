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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

const allowedFileTypes = ['.xlsx', '.csv'];

@ApiTags('API')
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
      const extension = extname(file.originalname || '').toLowerCase();
      if (allowedFileTypes.includes(extension)) {
        callback(null, true);
      }
    },
  }))
  @ApiBody({description: 'Arquivo a ser processado (formatos suportados: .xlsx, .csv)'})
  @ApiResponse({ status: 200, description: 'Retorna MRR e Churn rate calculados com base no arquivo enviado' })
  @ApiResponse({ status: 400, description: 'Requisição inválida ou arquivo não recebido' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
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
