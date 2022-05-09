export interface NDVIResponse {
  ndviDataId: number;
  observationDate: string;
  imageUrl: string;
  meanNDVI: number;
  status: "SUCCESS" | string;
  type: "AGRO" | string;
  field: any;
}
