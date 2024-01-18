import { Injectable } from '@nestjs/common';
import { csvToJson } from 'src/utils/csv.to.json';
import { xlsxToJson } from 'src/utils/xlsx.to.json';
import { IExcelModel } from '../mapper/excel.mapper';

export interface Itypesignature {
  monthly: IExcelModel[]
  days360: IExcelModel[]
  annually: IExcelModel[]
  biennial: IExcelModel[]
}

@Injectable()
export class MetricsService {
  public async getFile(file: Express.Multer.File, extension: string): Promise<Itypesignature> {
    let json: IExcelModel[];
    if(extension === '.xlsx') {
      json = xlsxToJson(file.path);
    } else {
      json = await csvToJson(file.path);
    }
    const separated = this.separatePerTypeOfSignature(json);
    return separated;
  }

  private separatePerTypeOfSignature (json: IExcelModel[]): Itypesignature {
    const separate: Itypesignature = {
      monthly: [],
      days360: [],
      annually: [],
      biennial: []
    }
    for (const item of json) {
      const billingEveryXDays = String(item.billingEveryXDays);

      switch (billingEveryXDays) {
        case '30':
          separate.monthly.push(item);
          break;
        case '360':
          separate.days360.push(item);
          break;
        case '365':
          separate.annually.push(item);
          break;
        case '730':
          separate.biennial.push(item);
          break;
        default:
          throw new Error(`${item} fora do padrão de assinatura`)
      }
    }
    return separate;
  }
}