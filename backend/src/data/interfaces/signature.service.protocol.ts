import { IExcelModel } from "../mapper/excel.mapper";

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