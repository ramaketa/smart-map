import { Component, OnInit, ViewChild } from '@angular/core';
import {Field} from "../../../core/models/field";
import {FieldService} from "../../../core/services/field.service";
import {ActivatedRoute} from "@angular/router";
import { ApiService } from "../../../core/services/api.service";
import { UtilsService } from "../../../core/services/utils.service";
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";

import * as moment from 'moment';
import { Subscription, switchMap, timer } from "rxjs";
import { ProcessingRequestEnum } from "../../../core/models/processing-request.model";
import { NDVIFilter } from "../../../core/models/NDVI-filter.model";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  field!: Field;
  currentFieldId: number;

  startValue: Date | null = null;
  endValue: Date | null = null;

  minStartDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 12));
  maxStartDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 1));

  isLoading: boolean = false;
  receiveStatusSubscription!: Subscription;

  NDVIFilter!: NDVIFilter;

  chartData: any[] = [
    {
      name: 'NDVI',
      series: []
    }
  ];
  view: [number, number] = [700, 300];

  xAxis: boolean = true;
  yAxis: boolean = true;

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(private fieldService: FieldService,
              private apiService: ApiService,
              private utilsService: UtilsService,
              private route: ActivatedRoute) {
    this.currentFieldId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentFieldId = Number(this.route.snapshot.paramMap.get('id'));
      this.getField(this.currentFieldId);
    })
  }

  getField(fieldId: number) {
    this.apiService.getFieldByFieldId(fieldId)
      .subscribe(
        (data) => {
          this.field = data;
          this.getDataForChart();
        },
        () => {
          this.utilsService.errorMessage('Возникла ошибка при получении поля', 'Что-то пошло не так')
        }
      )
  }

  getDataForChart(): void {
    for (const ndviData of this.field.ndviDataList) {
      this.chartData[0].series.push({
        name: moment(ndviData.observationDate, 'YYYY-MM-DD').format('DD.MM.YYYY'),
        value: ndviData.meanNDVI
      })
    }
  }

  // getNDVIForField(fieldId: number) {
  //   this.NDVIFilter = {
  //     fieldIdList: [fieldId],
  //     ndviDataStatusEnumList: ['SUCCESS']
  //   }
  //
  //   this.apiService.getFieldByFieldId(fieldId)
  //     .subscribe(
  //       (data) => {
  //         this.field = data;
  //       },
  //       () => {
  //         this.utilsService.errorMessage('Возникла ошибка при получении поля', 'Что-то пошло не так')
  //       }
  //     )
  // }

  disabledStartDate = (startValue: Date): boolean => {
    return startValue > this.maxStartDate || startValue < this.minStartDate;
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!this.startValue) {
      return false;
    }
    return endValue > this.maxStartDate || endValue < this.minStartDate || endValue < this.startValue;
  };

  getActualData(): void {
    this.isLoading = true;
    const startDate = moment(this.startValue).format('YYYY-MM-DD');
    const endDate = moment(this.endValue).format('YYYY-MM-DD');

    this.apiService.getProcessingData(this.field.fieldId, startDate, endDate)
      .subscribe(
        (data) => {
          if (data) {
            this.receiveStatusProcessingRequest(data);
            return;
          }
          this.isLoading = false;
          this.utilsService.warningMessage('Не найдено подходящих данных', 'Внимание!');
        },
        () => {
          this.utilsService.errorMessage('Возникла ошибка при данных по полю', 'Что-то пошло не так');
          this.isLoading = false;
        }
      )
  }

  receiveStatusProcessingRequest(processingId: number): void {
    this.receiveStatusSubscription = timer(0, 1000)
      .pipe(
        switchMap(() =>
          this.apiService.getProcessingRequest(processingId)
        )
      )
      .subscribe(
        (data) => {
          if (data.processingRequestStatus !== 'PROCESS') {
            this.receiveStatusSubscription.unsubscribe();
            this.isLoading = false;
          }

          if (data.processingRequestStatus === 'ERROR') {
            this.utilsService.errorMessage(ProcessingRequestEnum[data.processingRequestStatus], 'Что-то пошло не так!');
          }

          if (data.processingRequestStatus === 'NO_DATA') {
            this.utilsService.warningMessage(ProcessingRequestEnum[data.processingRequestStatus], 'Внимание!');
          }

          if (data.processingRequestStatus === "SUCCESS") {
            this.getField(this.field.fieldId);
            this.utilsService.successMessage(ProcessingRequestEnum[data.processingRequestStatus], 'Успешно!');
          }
        }
      )
  }
}
