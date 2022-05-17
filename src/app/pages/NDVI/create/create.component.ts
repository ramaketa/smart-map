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
  isVisible = false;

  fieldEvent: any;

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private router: Router,
              private utilsService: UtilsService) { }

  ngOnInit(): void {}

  handleCancel(): void {
    this.fieldEvent = undefined;
    this.fieldName = '';
    this.isVisible = false;
  }

  handleOk(): void {
    this.apiCreate(this.fieldEvent);
  }

  createField(event: any): void {
    this.fieldEvent = event;
    this.isVisible = true;
  }

  apiCreate(event: any): void {
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
    this.utilsService.loading = true;
    this.isVisible = false;
    this.apiService.createField(newField).subscribe(
      (data) => {
        if (data.status === 'SUCCESS') {
          this.router.navigate([`/field/${data.data}`]).then(() => window.location.reload())
          this.utilsService.successMessage(data.message, '');
        }
        if (data.status === 'FIELD_ADD_ERROR') {
          this.utilsService.errorMessage(data.message)
        }
      },
      () => this.utilsService.errorMessage(),
    ).add(() => this.utilsService.loading = false);
  }

}
