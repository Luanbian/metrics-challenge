import { Injectable } from "@nestjs/common";
import { IExcelModel } from "../mapper/excel.mapper";
import { Months } from "../interfaces/month.service.protocol";
import { MetricsYearService } from "./metrics.year.service";
import { MetricsMonthService } from "./metrics.month.service";

export interface SignatureStatus {
  actives: IExcelModel[]
  overDues: IExcelModel[]
  canceleds: IExcelModel[]
  canceledsTrial: IExcelModel[]
  upgrades: IExcelModel[]
}

@Injectable()
export class ChurnRateService {
  constructor (
    private readonly years: MetricsYearService,
    private readonly month: MetricsMonthService
  ) {}

  public async metrics (json: IExcelModel[]) {
    const perYear = {};
    const years = await this.years.metrics(json, 'churn');
    const months = await this.month.metrics(years);

    for(const year in years) {
      perYear[year] = {
        yearlyChurnRate: await this.calculateChurnRate(years[year]),
        monthlyChurnRate: await this.calculateMonthlyChurnRate(months[year], years[year]),
      };
    }
    
    const general = await this.calculateChurnRate(json);
    return {
      general,
      perYear
    }
  }

  private async calculateMonthlyChurnRate(monthData: Months, years: IExcelModel[]) {
    const perMonth = {};

    for (const month in monthData) {
      const separate = await this.separateActivesAndCanceleds(monthData[month]);
      const canceleds = separate.canceleds.length + separate.canceledsTrial.length + separate.overDues.length;
      const totalCustomers = years.length - 1;
      const calculate = ((canceleds / totalCustomers) * 100)
      const churnRate = Number.isNaN(calculate) ? 0 : calculate;
      const result = `${churnRate.toFixed(2)}%`;
      perMonth[month] = result;
    }
    return perMonth;
  }

  private async calculateChurnRate (data: IExcelModel[]) {
    const separate = await this.separateActivesAndCanceleds(data);
    const canceleds = separate.canceleds.length + separate.canceledsTrial.length + separate.overDues.length;
    const totalCustomers = data.length - 1;
    const calculate = ((canceleds / totalCustomers) * 100)
    const churnRate = Number.isNaN(calculate) ? 0 : calculate;
    return `${churnRate.toFixed(2)}%`;
  }

  private async separateActivesAndCanceleds (json: IExcelModel[]) {
    const separate: SignatureStatus = {
      actives: [],
      canceleds: [],
      canceledsTrial: [],
      overDues: [],
      upgrades: []
    }
    for await (const item of json) {
      const status = item.status.trim();

      switch (status) {
        case 'Ativa':
          separate.actives.push(item);
          break;
        case 'Cancelada':
          separate.canceleds.push(item);
          break;
        case 'Trial cancelado':
          separate.canceledsTrial.push(item);
          break;
        case 'Atrasada':
          separate.overDues.push(item);
          break;
        case 'Upgrade':
          separate.upgrades.push(item);
          break;
        default:
          throw new Error(`Status do ${item.subscriberID} não reconhecido`);
      }
    }
    return separate;
  }
}