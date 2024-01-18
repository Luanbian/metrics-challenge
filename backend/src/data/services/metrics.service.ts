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

export interface MRRPerSignature {
  numberOfClients: number,
  value: string
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
    const MRRMonthly = this.MRRforMonthlySignature(separated.monthly);
    const MRRDays360 = this.MRRforDays360Signature(separated.days360);
    const MRRAnnually = this.MRRforAnnuallySignature(separated.annually);
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

  private MRRforMonthlySignature (monthly: IExcelModel[]): MRRPerSignature {
    const value = monthly
      .reduce((acumulador, objeto) => acumulador + (Number(objeto.value) || 0), 0)
      .toFixed(2);
    return {
      numberOfClients: monthly.length,
      value
    }
  }

  private MRRforDays360Signature (days360: IExcelModel[]): MRRPerSignature {
    const value = (days360
      .reduce((acumulador, objeto) => acumulador + (Number(objeto.value) || 0), 0) / 12)
      .toFixed(2);
    return {
      numberOfClients: days360.length,
      value
    }
  }

  private MRRforAnnuallySignature(annually: IExcelModel[]): MRRPerSignature {
    const value = (annually
      .reduce((acumulador, objeto) => acumulador + (Number(objeto.value) || 0), 0) / 12)
      .toFixed(2);
    return {
      numberOfClients: annually.length,
      value
    }
  }
}
