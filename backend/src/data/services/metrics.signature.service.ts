import { Injectable } from '@nestjs/common';
import { IExcelModel } from '../mapper/excel.mapper';
import { IMetrics, Itypesignature, MRRPerSignature } from '../interfaces/signature.service.protocol';
import { Years } from '../interfaces/year.service.protocol';

@Injectable()
export class MetricsSignatureService {
  public async metrics(json: IExcelModel[], years: Years): Promise<IMetrics> {
    const perYear = {};
    for (const year in years) {
      perYear[year] = this.calculateYearlyMRR(years[year]);
    }
    const general = this.calculateGeneralMRR(json);
    return {
      general,
      perYear,
    };
  }

  private calculateGeneralMRR = (json: IExcelModel[]) => {
    const signatureValues = this.getSignatureValues(this.separatePerTypeOfSignature(json));
    const { MRRMonthly, MRRDays360, MRRAnnually, MRRBiennial } = signatureValues;
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

  private calculateYearlyMRR (year: IExcelModel[]) {
    const signatureValues = this.getSignatureValues(this.separatePerTypeOfSignature(year));
    const { MRRMonthly, MRRDays360, MRRAnnually, MRRBiennial } = signatureValues;
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

  private getSignatureValues (signature: Itypesignature) {
    return {
      MRRMonthly: this.MRRforSignature(signature.monthly, 1),
      MRRDays360: this.MRRforSignature(signature.days360, 12),
      MRRAnnually: this.MRRforSignature(signature.annually, 12),
      MRRBiennial: this.MRRforSignature(signature.biennial, 24),
    };
  };

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

  private MRRforSignature(array: IExcelModel[], divisor: number): MRRPerSignature {
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
