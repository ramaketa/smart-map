export interface ProcessingRequest {
  processingRequestId: number,
  startDate: string,
  endDate: string,
  processingRequestStatus: ProcessingRequestType,
}

export type ProcessingRequestType = 'PROCESS' | 'SUCCESS' | 'ERROR' | 'NO_DATA';

export const ProcessingRequestEnum = {
  PROCESS: "В обработке",
  SUCCESS: "Успешно",
  ERROR: "Ошибка во время обработки",
  NO_DATA: "Нет новых данных NDVI за выбранный период",
}
