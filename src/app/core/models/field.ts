export interface Field {
  fieldId: number;
  name: string;
  default: boolean;
  externalId: string;
  sowingDate?: null;
  coordinateList: Coorditate[],
  ndviDataList: NdviData[],
}

export interface Coorditate {
  latitude: number;
  longitude: number;

  field?: number;
  coordinateId?: number;
}

export interface NdviData {
  ndviDataId: number;
  observationDate: string;
  imageUrl: string;
  meanNDVI: number;
  status: "SUCCESS" | "ERROR" | string;
  type: string;
  field: number
}
