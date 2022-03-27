import { NgModule } from '@angular/core';
import { MapComponent } from "./components/map/map.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

@NgModule({
  imports: [LeafletModule],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class CoreModule { }
