import { Injectable } from '@nestjs/common';
import { IExcelModel } from '../mapper/excel.mapper';
import { Years } from './metrics.year.service';

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
  general: {
    MRRMonthly: MRRPerSignature
    MRRDays360: MRRPerSignature
    MRRAnnually: MRRPerSignature
    MRRBiennial: MRRPerSignature
    MRR: string
  }
  perYear: {
    "2022": {
      MRRMonthly: MRRPerSignature
      MRRDays360: MRRPerSignature
      MRRAnnually: MRRPerSignature
      MRRBiennial: MRRPerSignature
      MRR: string
    },
    "2023": {
      MRRMonthly: MRRPerSignature
      MRRDays360: MRRPerSignature
      MRRAnnually: MRRPerSignature
      MRRBiennial: MRRPerSignature
      MRR: string
    },
    "2024": {
      MRRMonthly: MRRPerSignature
      MRRDays360: MRRPerSignature
      MRRAnnually: MRRPerSignature
      MRRBiennial: MRRPerSignature
      MRR: string
    },
    "2025": {
      MRRMonthly: MRRPerSignature
      MRRDays360: MRRPerSignature
      MRRAnnually: MRRPerSignature
      MRRBiennial: MRRPerSignature
      MRR: string
    },
  }
}

@Injectable()
export class MetricsSignatureService {
  public async metrics(json: IExcelModel[], years: Years): Promise<IMetrics> {
    const signature22 = this.separatePerTypeOfSignature(years["2022"])
    const MRRMonthly22 = this.MRRforSignature(signature22.monthly, 1);
    const MRRDays36022 = this.MRRforSignature(signature22.days360, 12);
    const MRRAnnually22 = this.MRRforSignature(signature22.annually, 12);
    const MRRBiennial22 = this.MRRforSignature(signature22.biennial, 24);
    const MRR22 = this.monthlyRecurringRevenue(MRRMonthly22, MRRDays36022, MRRAnnually22, MRRBiennial22);

    const signature23 = this.separatePerTypeOfSignature(years["2023"]);
    const MRRMonthly23 = this.MRRforSignature(signature23.monthly, 1);
    const MRRDays36023 = this.MRRforSignature(signature23.days360, 12);
    const MRRAnnually23 = this.MRRforSignature(signature23.annually, 12);
    const MRRBiennial23 = this.MRRforSignature(signature23.biennial, 24);
    const MRR23 = this.monthlyRecurringRevenue(MRRMonthly23, MRRDays36023, MRRAnnually23, MRRBiennial23);

    const signature24 = this.separatePerTypeOfSignature(years["2024"]);
    const MRRMonthly24 = this.MRRforSignature(signature24.monthly, 1);
    const MRRDays36024 = this.MRRforSignature(signature24.days360, 12);
    const MRRAnnually24 = this.MRRforSignature(signature24.annually, 12);
    const MRRBiennial24 = this.MRRforSignature(signature24.biennial, 24);
    const MRR24 = this.monthlyRecurringRevenue(MRRMonthly24, MRRDays36024, MRRAnnually24, MRRBiennial24);


    const signature25 = this.separatePerTypeOfSignature(years["2025"]);
    const MRRMonthly25 = this.MRRforSignature(signature25.monthly, 1);
    const MRRDays36025 = this.MRRforSignature(signature25.days360, 12);
    const MRRAnnually25 = this.MRRforSignature(signature25.annually, 12);
    const MRRBiennial25 = this.MRRforSignature(signature25.biennial, 24);
    const MRR25 = this.monthlyRecurringRevenue(MRRMonthly25, MRRDays36025, MRRAnnually25, MRRBiennial25);

    
    const separated = this.separatePerTypeOfSignature(json);
    const MRRMonthly = this.MRRforSignature(separated.monthly, 1);
    const MRRDays360 = this.MRRforSignature(separated.days360, 12);
    const MRRAnnually = this.MRRforSignature(separated.annually, 12);
    const MRRBiennial = this.MRRforSignature(separated.biennial, 24);
    const MRR = this.monthlyRecurringRevenue(MRRMonthly, MRRDays360, MRRAnnually, MRRBiennial);

    return {
      general: {
        MRR,
        MRRMonthly,
        MRRDays360,
        MRRAnnually,
        MRRBiennial
      },
      perYear: {
        "2022": {
          MRR: MRR22,
          MRRMonthly: MRRMonthly22,
          MRRDays360: MRRDays36022,
          MRRAnnually: MRRAnnually22,
          MRRBiennial: MRRBiennial22
        },
        "2023": {
          MRR: MRR23,
          MRRMonthly: MRRMonthly23,
          MRRDays360: MRRDays36023,
          MRRAnnually: MRRAnnually23,
          MRRBiennial: MRRBiennial23
        },
        "2024": {
          MRR: MRR24,
          MRRMonthly: MRRMonthly24,
          MRRDays360: MRRDays36024,
          MRRAnnually: MRRAnnually24,
          MRRBiennial: MRRBiennial24
        },
        "2025": {
          MRR: MRR25,
          MRRMonthly: MRRMonthly25,
          MRRDays360: MRRDays36025,
          MRRAnnually: MRRAnnually25,
          MRRBiennial: MRRBiennial25
        }
      }
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
