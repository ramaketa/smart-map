import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Field} from "../models/field";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {}

  getFieldList(backUserId: number): Observable<Field[]> {
    return this.httpClient.get<Field[]>(`/ndvi/field/list/${backUserId}`);
  }
}
