import { Injectable } from '@nestjs/common';
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

export interface IMetrics {
  MRRMonthly: MRRPerSignature
  MRRDays360: MRRPerSignature
  MRRAnnually: MRRPerSignature
  MRRBiennial: MRRPerSignature
  MRR: string
}

@Injectable()
export class MetricsSignatureService {
  public async getFile(json: IExcelModel[]): Promise<IMetrics> {
    const separated = this.separatePerTypeOfSignature(json);
    const MRRMonthly = this.MRRforSignature(separated.monthly, 1);
    const MRRDays360 = this.MRRforSignature(separated.days360, 12);
    const MRRAnnually = this.MRRforSignature(separated.annually, 12);
    const MRRBiennial = this.MRRforSignature(separated.biennial, 24);
    const MRR = this.monthlyRecurringRevenue(MRRMonthly, MRRDays360, MRRAnnually, MRRBiennial)
    return {
      MRR,
      MRRMonthly,
      MRRDays360,
      MRRAnnually,
      MRRBiennial
    };
  }

  private monthlyRecurringRevenue(
    MRRMonthly: MRRPerSignature,
    MRRDays360: MRRPerSignature,
    MRRAnnually: MRRPerSignature,
    MRRBiennial: MRRPerSignature): string {
      const value = Number(MRRMonthly.value) + Number(MRRDays360.value) + Number(MRRAnnually.value) + Number(MRRBiennial.value);
      return value.toFixed(2);
  }

  private MRRforSignature (array: IExcelModel[], divisor: number): MRRPerSignature {
    const value = (array
      .reduce((acumulador, objeto) => acumulador + (Number(objeto.value) || 0), 0) / divisor)
      .toFixed(2);
    return {
      numberOfClients: array.length,
      value
    }
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
