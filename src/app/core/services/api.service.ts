import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Field} from "../models/field";
import {CreateFieldModel} from "../models/create-field-model";
import {NDVIFilter} from "../models/NDVI-filter.model";
import {NDVIResponse} from "../models/NDVI-response.model";

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

  createField(field: CreateFieldModel): Observable<number> {
    return this.httpClient.post<number>('/ndvi/field/', field);
  }

  deleteFieldByFieldId(fieldId: number): Observable<void> {
    return this.httpClient.delete<void>(`/ndvi/field/${fieldId}`);
  }

  getNDVIForField(NDVIFilter: NDVIFilter): Observable<NDVIResponse[]> {
    return this.httpClient.post<NDVIResponse[]>('/ndvi/field/filter', NDVIFilter);
  }

  getNDVIImageById(ndviDataId: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`/ndvi/field/file/${ndviDataId}`);
  }
}
