import { NDVIDataStatusType } from "./NDVI-filter.model";

export interface NDVIResponse {
  ndviDataId: number;
  observationDate: string;
  imageUrl: string;
  meanNDVI: number;
  status: NDVIDataStatusType;
  type: "AGRO" | string;
  field: any;
}
