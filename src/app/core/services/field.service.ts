import { Injectable } from '@angular/core';
import { Field } from "../models/field";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  fieldList!: Field[];
  defaultField!: Field;

  fieldList$: Subject<Field[]> = new Subject<Field[]>()

  constructor() { }

  setFieldList(fieldList: Field[]): void {
    this.fieldList = fieldList;
    this.fieldList$.next(this.fieldList);
  }
}
