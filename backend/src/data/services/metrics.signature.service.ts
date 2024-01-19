import { Injectable } from '@nestjs/common';
import { IExcelModel } from '../mapper/excel.mapper';
import { Years } from './metrics.year.service';

export interface Itypesignature {
  monthly: IExcelModel[];
  days360: IExcelModel[];
  annually: IExcelModel[];
  biennial: IExcelModel[];
}

export interface MRRPerSignature {
  numberOfClients: number;
  value: string;
}

export interface IMetrics {
  general: {
    MRRMonthly: MRRPerSignature;
    MRRDays360: MRRPerSignature;
    MRRAnnually: MRRPerSignature;
    MRRBiennial: MRRPerSignature;
    MRR: string;
  };
  perYear: {
    [year: string]: {
      MRRMonthly: MRRPerSignature;
      MRRDays360: MRRPerSignature;
      MRRAnnually: MRRPerSignature;
      MRRBiennial: MRRPerSignature;
      MRR: string;
    };
  };
}

@Injectable()
export class MetricsSignatureService {
  public async metrics(json: IExcelModel[], years: Years): Promise<IMetrics> {
    const getSignatureValues = (signature: Itypesignature) => {
      return {
        MRRMonthly: this.MRRforSignature(signature.monthly, 1),
        MRRDays360: this.MRRforSignature(signature.days360, 12),
        MRRAnnually: this.MRRforSignature(signature.annually, 12),
        MRRBiennial: this.MRRforSignature(signature.biennial, 24),
      };
    };
    const calculateYearlyMRR = (year: string) => {
      const signatureValues = getSignatureValues(
        this.separatePerTypeOfSignature(years[year]),
      );
      const { MRRMonthly, MRRDays360, MRRAnnually, MRRBiennial } =
        signatureValues;
      const MRR = this.monthlyRecurringRevenue(
        MRRMonthly,
        MRRDays360,
        MRRAnnually,
        MRRBiennial,
      );
      return {
        MRR,
        MRRMonthly,
        MRRDays360,
        MRRAnnually,
        MRRBiennial,
      };
    };
    const calculateGeneralMRR = () => {
      const signatureValues = getSignatureValues(
        this.separatePerTypeOfSignature(json),
      );
      const { MRRMonthly, MRRDays360, MRRAnnually, MRRBiennial } =
        signatureValues;
      const MRR = this.monthlyRecurringRevenue(
        MRRMonthly,
        MRRDays360,
        MRRAnnually,
        MRRBiennial,
      );
      return {
        MRRMonthly,
        MRRDays360,
        MRRAnnually,
        MRRBiennial,
        MRR,
      };
    };
    const perYear = {};
    for (const year in years) {
      perYear[year] = calculateYearlyMRR(year);
    }
    const general = calculateGeneralMRR();
    return {
      general,
      perYear,
    };
  }

  private monthlyRecurringRevenue(
    MRRMonthly: MRRPerSignature,
    MRRDays360: MRRPerSignature,
    MRRAnnually: MRRPerSignature,
    MRRBiennial: MRRPerSignature,
  ): string {
    const value =
      Number(MRRMonthly.value) +
      Number(MRRDays360.value) +
      Number(MRRAnnually.value) +
      Number(MRRBiennial.value);
    return value.toFixed(2);
  }

  private MRRforSignature(
    array: IExcelModel[],
    divisor: number,
  ): MRRPerSignature {
    const value = (array
      .reduce((acumulador, objeto) => acumulador + (Number(objeto.value) || 0),0,) / divisor)
      .toFixed(2);
    return {
      numberOfClients: array.length,
      value,
    };
  }

  private separatePerTypeOfSignature(json: IExcelModel[]): Itypesignature {
    const separate: Itypesignature = {
      monthly: [],
      days360: [],
      annually: [],
      biennial: [],
    };
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
          throw new Error(`${item} fora do padrão de assinatura`);
      }
    }
    return separate;
  }
}
