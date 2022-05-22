import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {AuthService} from "../../core/services/auth.service";
import {Field} from "../../core/models/field";
import { ActivatedRoute, Router } from "@angular/router";
import {FieldService} from "../../core/services/field.service";
import { UtilsService } from "../../core/services/utils.service";
import { Subscription } from "rxjs";
import { Browser } from "leaflet";
import win = Browser.win;

@Component({
  selector: 'app-ndvi',
  templateUrl: './NDVI.component.html',
  styleUrls: ['./NDVI.component.scss']
})
export class NDVIComponent implements OnInit  {

  isCollapsed = false;
  isLoading: boolean = false;
  isVisible: boolean = false;
  deleteLoading: boolean = false;
  isLoading$: Subscription;
  selectedField: Field;

  fieldList!: Field[]

  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private utilsService: UtilsService,
              private fieldService: FieldService,
              private authService: AuthService) {
    this.utilsService.isLoading$.subscribe((loading) => this.isLoading = loading);
  }

  ngOnInit() {
    this.utilsService.loading = true;
    // @ts-ignore
    this.apiService.getFieldList(this.authService.userDTO.backUserId)
      .subscribe(
        ((data: Field[]) => {
          this.fieldList = data;
          this.fieldService.setFieldList(data);
          // for (const field of data) {
          //   if (field.default) {
          //     this.fieldService.defaultField = field;
          //     this.router.navigate([`/field/${field.fieldId}`])
          //   }
          // }
        }),
        ((error) => {
          this.utilsService.errorMessage('Возникла ошибка при получении списка полей',
            'Попробуйте снова или обратитесь в поддержку');
          console.log(error);
        }),
      ).add(() => this.utilsService.loading = false)
  }

  navigateToField(fieldId: number): void {
    this.router.navigate([`/field/${fieldId}`]).then(() => {
      window.location.reload();
    })
  }

  deleteField(): void {
    this.utilsService.loading = true;
    this.isVisible = false;
    this.apiService.deleteFieldByFieldId(this.selectedField.fieldId)
      .subscribe(
        (data) => {
          if (data.status === 'SUCCESS') {
            this.utilsService.successMessage(data.message, 'Успешно');
          }
          if (data.status === 'FIELD_DELETE_ERROR') {
            this.utilsService.errorMessage(data.message, 'Что-то пошло не так');
          }
          setTimeout(() => {
            this.utilsService.loading = false
            this.router.navigate(['/create'])
              .then(() => window.location.reload());
          }, 2000)
        },
        (error) => {
          console.error(error);
          this.utilsService.loading = false
          this.utilsService.errorMessage();
        }
      )
  }

  logout(): void {
    this.authService.logout();
  }

  showSettingsPopup(): void {
    this.isVisible = true;
  }

  setCheckSelected(state: boolean, field: Field): void {
    if (state) {
      this.selectedField = field;
    }
  }

}
