export interface NDVIFilter {
  fieldIdList?: number[];
  ndviDataStatusEnumList?: NDVIDataStatusType[];

  observationDateFrom?: string;
  observationDateTo?: string;
}

export type NDVIDataStatusType = 'PROCESS' | 'ERROR' | 'SUCCESS';
