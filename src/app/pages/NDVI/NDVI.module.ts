import { NgModule } from '@angular/core';

import { NDVIRoutingModule } from './NDVI-routing.module';

import { NDVIComponent } from './NDVI.component';
import {CoreModule} from "../../core/core.module";


@NgModule({
  imports: [NDVIRoutingModule, CoreModule],
  declarations: [NDVIComponent],
  exports: [NDVIComponent]
})
export class NDVIModule { }
