import { NgModule } from '@angular/core';
import { MapComponent } from "./components/map/map.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { AuthService } from "./services/auth.service";
import { UtilsService } from "./services/utils.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptor/auth.interceptor";
import { AuthGuard } from "./guards/auth.guard";
import { ApiService } from "./services/api.service";
import {LeafletDrawModule} from "@asymmetrik/ngx-leaflet-draw";
import { AxiLoaderComponent } from './components/axi-loader/axi-loader.component';
import { NzSpinModule } from "ng-zorro-antd/spin";

@NgModule({
  imports: [LeafletModule, LeafletDrawModule, NzSpinModule],
  declarations: [MapComponent, AxiLoaderComponent],
    exports: [MapComponent, AxiLoaderComponent],
  providers: [
    ApiService,
    AuthService,
    AuthInterceptor,
    AuthGuard,
    UtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
