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

export interface IMRRtypes {
  MRRMonthly: MRRPerSignature;
  MRRDays360: MRRPerSignature;
  MRRAnnually: MRRPerSignature;
  MRRBiennial: MRRPerSignature;
  MRR: MRRPerSignature;
}

export interface IMetrics {
  general: IMRRtypes
  perYear: {
    [year: string]: IMRRtypes
  };
}