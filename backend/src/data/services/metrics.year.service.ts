import { Injectable } from "@nestjs/common";
import { IExcelModel } from "../mapper/excel.mapper";
import { Years } from "../interfaces/year.service.protocol";

@Injectable()
export class MetricsYearService {
  public async metrics(json: IExcelModel[]): Promise<Years> {
    const separatePerYear = this.separatePerYear(json);
    return separatePerYear;
  }

  private separatePerYear(json: IExcelModel[]): Years {
    const separate: Years = {
      "2022": [],
      "2023": [],
      "2024": [],
      "2025": []
    }
    for(const item of json) {
      const { nextCycle } = item;
      const year = nextCycle[nextCycle.length - 1];
      
      switch (year) {
        case '2':
          separate["2022"].push(item);
          break;
        case '3':
          separate["2023"].push(item);
           break;
        case '4':
          separate["2024"].push(item);
          break;
        case '5':
          separate["2025"].push(item);
          break;
        default:
          throw new Error(`${item} está fora do limite de validade`);
      }
    }
    return separate;
  }
}