import { Injectable } from "@nestjs/common";
import { IExcelModel } from "../mapper/excel.mapper";
import { Years } from "../interfaces/year.service.protocol";

export interface SignatureStatus {
  actives: IExcelModel[]
  overDues: IExcelModel[]
  canceleds: IExcelModel[]
  canceledsTrial: IExcelModel[]
  upgrades: IExcelModel[]
}

@Injectable()
export class ChurnRateService {
  public async metrics (json: IExcelModel[], years: Years) {
    const perYear = {};
    for(const year in years) {
      perYear[year] = this.calculateChurnRate(years[year]);
    }
    const general = this.calculateChurnRate(json);
    return {
      general,
      perYear
    }
  }

  private calculateChurnRate (data: IExcelModel[]) {
    const separate = this.separateActivesAndCanceleds(data);
    const canceleds = separate.canceleds.length + separate.canceledsTrial.length;
    const totalCustomers = data.length - 1;
    const calculate = ((canceleds / totalCustomers) * 100)
    const churnRate = Number.isNaN(calculate) ? 0 : calculate;
    return `${churnRate.toFixed(2)}%`;
  }

  private separateActivesAndCanceleds (json: IExcelModel[]) {
    const separate: SignatureStatus = {
      actives: [],
      canceleds: [],
      canceledsTrial: [],
      overDues: [],
      upgrades: []
    }
    for (const item of json) {
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