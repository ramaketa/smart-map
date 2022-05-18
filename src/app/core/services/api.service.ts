import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";
import {Field} from "../models/field";
import {CreateFieldModel} from "../models/create-field-model";
import {NDVIFilter} from "../models/NDVI-filter.model";
import {NDVIResponse} from "../models/NDVI-response.model";
import { ProcessingRequest } from "../models/processing-request.model";
import { ApiResponse } from "../models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {}

  getFieldList(backUserId: number): Observable<Field[]> {
    return this.httpClient.get<Field[]>(`/ndvi/field/list/${backUserId}`);
  }

  getFieldByFieldId(fieldId: number): Observable<Field> {
    return this.httpClient.get<Field>(`/ndvi/field/${fieldId}`);
  }

  createField(field: CreateFieldModel): Observable<ApiResponse<number>> {
    return this.httpClient.post<ApiResponse<number>>('/ndvi/field/', field);
  }

  deleteFieldByFieldId(fieldId: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(`/ndvi/field/${fieldId}`);
  }

  getNDVIForField(NDVIFilter: NDVIFilter): Observable<NDVIResponse[]> {
    return this.httpClient.post<NDVIResponse[]>('/ndvi/field/filter', NDVIFilter);
  }

  getNDVIImageById(ndviDataId: number): Observable<Blob> {
    // @ts-ignore
    return this.httpClient.get<Blob>(`/ndvi/field/file/${ndviDataId}`, { responseType: 'blob' });
  }

  getProcessingData(fieldId: number, startDate: string, endDate: string, withPrediction = false): Observable<ApiResponse<number>> {
    return this.httpClient.post<ApiResponse<number>>(
      `/ndvi/field/processing?fieldId=${fieldId}&startDate=${startDate}&endDate=${endDate}&withPrediction=${withPrediction}`, {})
  }

  getProcessingRequest(processingId: number): Observable<ProcessingRequest> {
    return this.httpClient.get<ProcessingRequest>(`/ndvi/field/processing/request/${processingId}`);
  }
}
