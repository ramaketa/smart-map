import { Component, OnInit, ViewChild } from '@angular/core';
import { Field, NdviData } from "../../../core/models/field";
import {FieldService} from "../../../core/services/field.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../core/services/api.service";
import { UtilsService } from "../../../core/services/utils.service";
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";

import * as moment from 'moment';
import { Subject, Subscription, switchMap, timer } from "rxjs";
import { ProcessingRequest, ProcessingRequestEnum } from "../../../core/models/processing-request.model";
import { NDVIFilter } from "../../../core/models/NDVI-filter.model";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  field: Field;
  currentFieldId: number;

  startValue: Date | null = null;
  endValue: Date | null = null;

  minStartDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 12));
  maxStartDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 1));

  isLoading: boolean = false;
  showField: boolean = false;

  withPrediction: boolean = false;
  hasProcessRequest: boolean = false;
  receiveStatusSubscription!: Subscription;

  mapUpdateSubject: Subject<any> = new Subject<any>();
  onMapChange: Subject<any> = new Subject<any>();

  NDVIFilter: NDVIFilter;
  processingRequestEnum = ProcessingRequestEnum;

  chartData: any[] =[];
  view: [number, number] = [document.body.clientWidth / 1.5, 300];

  xAxis: boolean = true;
  yAxis: boolean = true;

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(private fieldService: FieldService,
              private apiService: ApiService,
              private router: Router,
              private utilsService: UtilsService,
              private route: ActivatedRoute) {
    this.currentFieldId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.destroy();

    this.mapUpdateSubject = new Subject<any>();
    this.onMapChange = new Subject<any>();
    this.route.params.subscribe((params) => {
      this.currentFieldId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.currentFieldId) {
        this.getField(this.currentFieldId, true);
      } else {
        this.router.navigate(['/create'])
      }
    })
  }

  getField(fieldId: number, changeMap = false) {
    this.utilsService.loading = true;
    this.showField = false;
    this.apiService.getFieldByFieldId(fieldId)
      .subscribe(
        (data) => {
          this.field = data;
          this.getDataForChart();
          if (changeMap) {
            this.onMapChange.next(data);
          }
          setTimeout(() => {
            this.showField = true;
            this.utilsService.loading = false;
          }, 1000)

          const processingRequestList = data?.processingRequestList?.filter((process) => process.processingRequestStatus === 'PROCESS')
          this.hasProcessRequest = processingRequestList.length > 0

          if (this.hasProcessRequest) {
            this.receiveStatusProcessingRequest(processingRequestList[0].processingRequestId);
          }
        },
        () => {
          this.utilsService.loading = false;
          this.utilsService.errorMessage('Возникла ошибка при получении поля', 'Что-то пошло не так')
        }
      )
  }

  getDataForChart(): void {
    const newData = [
      {
        name: 'NDVI',
        series: []
      }]
    for (const ndviData of this.field.ndviDataList) {
      newData[0].series.push({
        // @ts-ignore
        name: moment(ndviData.observationDate, 'YYYY-MM-DD').format('DD.MM.YYYY'),
        // @ts-ignore
        value: ndviData.meanNDVI
      })
    }
    this.chartData = [...newData];
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
    return endValue > this.maxStartDate || endValue < this.minStartDate || endValue < this.startValue
      || Math.abs(moment(endValue).diff(moment(this.startValue), 'days')) > 30;
  };

  getActualData(): void {
    this.isLoading = true;
    const startDate = moment(this.startValue).format('YYYY-MM-DD');
    const endDate = moment(this.endValue).format('YYYY-MM-DD');

    this.apiService.getProcessingData(this.field.fieldId, startDate, endDate, this.withPrediction)
      .subscribe(
        (data) => {
          if (data.status === 'SUCCESS') {
            this.receiveStatusProcessingRequest(data.data);
            return;
          }
          this.isLoading = false;
          this.utilsService.defaultMessage(data.message, 'Внимание!');
        },
        () => {
          this.utilsService.errorMessage('Возникла ошибка при данных по полю', 'Что-то пошло не так');
          this.isLoading = false;
        }
      )
  }

  receiveStatusProcessingRequest(processingId: number): void {
    this.isLoading = true;
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
            this.hasProcessRequest = false;
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
        },
        () => {
          this.utilsService.errorMessage();
        }
      )
  }

  getNDVIDate(date: string): string {
    return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
  }

  getLastIndex(): number {
    return this.field?.ndviDataList?.length - 1 || 0
  }

  setNDVIData(ndviData: NdviData): void {
    this.mapUpdateSubject.next(ndviData)
  }

  getProcessRequestRange(processingRequest: ProcessingRequest): string {
    return `${moment(processingRequest.startDate, 'YYYY-MM-DD').format('DD.MM.YYYY')} - ${moment(processingRequest.endDate, 'YYYY-MM-DD').format('DD.MM.YYYY')}`
  }

  getProcessRequestStatus(processingRequest: ProcessingRequest): string {
    return this.processingRequestEnum[processingRequest.processingRequestStatus];
  }

  destroy(): void {
    this.mapUpdateSubject?.complete()
    this.mapUpdateSubject?.unsubscribe()
    this.onMapChange?.complete()
    this.onMapChange?.unsubscribe()
  }
}
