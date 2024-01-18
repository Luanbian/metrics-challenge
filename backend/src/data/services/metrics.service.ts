import { Injectable } from '@nestjs/common';
import { csvToJson } from 'src/utils/csv.to.json';
import { xlsxToJson } from 'src/utils/xlsx.to.json';
import { IExcelModel } from '../mapper/excel.mapper';

@Injectable()
export class MetricsService {
  public async getFile(file: Express.Multer.File, extension: string): Promise<IExcelModel[]> {
    let json: IExcelModel[];
    if(extension === '.xlsx') {
      json = xlsxToJson(file.path);
    } else {
      json = await csvToJson(file.path);
    }
    return json;
  }
}
