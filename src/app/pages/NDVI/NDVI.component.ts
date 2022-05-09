import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {AuthService} from "../../core/services/auth.service";
import {Field} from "../../core/models/field";
import {Router} from "@angular/router";
import {FieldService} from "../../core/services/field.service";

@Component({
  selector: 'app-ndvi',
  templateUrl: './NDVI.component.html',
  styleUrls: ['./NDVI.component.scss']
})
export class NDVIComponent implements OnInit  {

  isCollapsed = false;
  fieldList!: Field[]

  constructor(private apiService: ApiService,
              private router: Router,
              private fieldService: FieldService,
              private authService: AuthService) { }

  ngOnInit() {
    this.apiService.getFieldList(this.authService.userDTO.backUserId)
      .subscribe(
        ((data: Field[]) => {
          this.fieldList = data;
          this.fieldService.setFieldList(data);
          for (const field of data) {
            if (field.default) {
              this.fieldService.defaultField = field;
              this.router.navigate([`/field/${field.fieldId}`])
            }
          }
        }),
        ((error) => console.log(error))
      )
  }

}
