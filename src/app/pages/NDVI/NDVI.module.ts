import { NgModule } from '@angular/core';

import { NDVIRoutingModule } from './NDVI-routing.module';

import { NDVIComponent } from './NDVI.component';
import {CoreModule} from "../../core/core.module";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {IconsProviderModule} from "../../icons-provider.module";
import {CommonModule} from "@angular/common";
import { FieldComponent } from './field/field.component';
import { CreateComponent } from './create/create.component';
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzWaveModule } from "ng-zorro-antd/core/wave";
import { NzButtonModule } from "ng-zorro-antd/button";
import { LineChartModule } from "@swimlane/ngx-charts";


@NgModule({
  imports: [
    NDVIRoutingModule,
    CoreModule,
    NzLayoutModule,
    IconsProviderModule,
    NzMenuModule,
    CommonModule,
    NzInputModule,
    FormsModule,
    NzDatePickerModule,
    NzWaveModule,
    NzButtonModule,
    LineChartModule
  ],
  declarations: [NDVIComponent, FieldComponent, CreateComponent],
  exports: [NDVIComponent]
})
export class NDVIModule { }
