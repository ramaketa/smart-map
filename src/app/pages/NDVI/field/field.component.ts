import { Component, OnInit } from '@angular/core';
import {Field} from "../../../core/models/field";
import {FieldService} from "../../../core/services/field.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  field!: Field;
  currentFieldId: number;

  constructor(private fieldService: FieldService,
              private route: ActivatedRoute) {
    this.currentFieldId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (!this.fieldService.fieldList) {
      this.fieldService.fieldList$.subscribe((fieldList: Field[]) => {
        this.setCurrentField(fieldList);
      })
      return;
    }
    this.setCurrentField(this.fieldService.fieldList);
  }

  setCurrentField(fieldList: Field[]) {
    this.field = fieldList.filter((field) => field.fieldId === this.currentFieldId)?.[0];
  }

}
