import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ru_RU } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {LoginComponent} from "./pages/login/login.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzNotificationService} from "ng-zorro-antd/notification";
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { NzFormModule } from "ng-zorro-antd/form";
import { RegisterComponent } from "./pages/register/register.component";

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
    imports: [
        NzNotificationModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NzGridModule,
        NzCardModule,
        ReactiveFormsModule,
        NzInputModule,
        NzButtonModule,
        LeafletModule,
        LeafletDrawModule,
        NzFormModule
    ],
  providers: [
    NzNotificationService,
    { provide: NZ_I18N, useValue: ru_RU }],
  bootstrap: [AppComponent]
})
export class AppModule { }
