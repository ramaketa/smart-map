import { NgModule } from '@angular/core';

import { NDVIRoutingModule } from './NDVI-routing.module';

import { NDVIComponent } from './NDVI.component';
import {CoreModule} from "../../core/core.module";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {IconsProviderModule} from "../../icons-provider.module";
import {CommonModule} from "@angular/common";
import { FieldComponent } from './field/field.component';


@NgModule({
    imports: [
        NDVIRoutingModule,
        CoreModule,
        NzLayoutModule,
        IconsProviderModule,
        NzMenuModule,
        CommonModule
    ],
  declarations: [NDVIComponent, FieldComponent],
  exports: [NDVIComponent]
})
export class NDVIModule { }
