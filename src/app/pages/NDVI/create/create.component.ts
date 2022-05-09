import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../core/services/api.service";
import {UtilsService} from "../../../core/services/utils.service";
import {CreateFieldModel} from "../../../core/models/create-field-model";
import {AuthService} from "../../../core/services/auth.service";
import {Coorditate} from "../../../core/models/field";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  fieldName!: string;

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private router: Router,
              private utilsService: UtilsService) { }

  ngOnInit(): void {
  }

  createField(event: any): void {
    if (!this.fieldName) {
      this.utilsService.warningMessage('Необходимо указать название поля!', 'Ошибка заполнения');
      return;
    }
    const coordinateList: Coorditate[] = [];
    for (const coordinate of event[0]) {
      coordinateList.push({
        latitude: coordinate.lat,
        longitude: coordinate.lng,
      })
    }
    coordinateList.push({
      latitude: event[0][0]?.lat,
      longitude: event[0][0]?.lng,
    })
    const newField: CreateFieldModel = new CreateFieldModel(
      this.fieldName, this.authService.userDTO, coordinateList
    );
    this.apiService.createField(newField).subscribe(
      (fieldId) => {
          this.router.navigate([`/field/${fieldId}`]).then(() => window.location.reload())
          this.utilsService.successMessage('Поле успешно создано', '');
      },
      () => this.utilsService.errorMessage(),
    );
  }

}
