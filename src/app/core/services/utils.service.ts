import {Injectable} from '@angular/core';
import {NzNotificationPlacement, NzNotificationService} from "ng-zorro-antd/notification";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import { Coorditate } from "../models/field";
import { latLng, LatLngBoundsExpression } from "leaflet";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  placement: NzNotificationPlacement = 'topRight';

  isLoading$ = new Subject<boolean>();
  private isLoading = false;

  constructor(private notification: NzNotificationService,
              private sanitizer: DomSanitizer) {}


  set loading(state: boolean) {
    this.isLoading = state;
    this.isLoading$.next(state);
  }

  get loading(): boolean {
    return this.isLoading;
  }

  defaultMessage(title: string, message: string): void {
    this.notification.blank(
      title,
      message,
      { nzPlacement: this.placement }
    );
  }

  errorMessage(title: string = 'Извините, что-то пошло не так',
               message: string = 'Попробуйте снова, либо обратитесь в поддержку'): void {
    this.notification.error(
      title,
      message,
      { nzPlacement: this.placement }
    );
  }

  successMessage(title: string, message: string): void {
    this.notification.success(
      title,
      message,
      { nzPlacement: this.placement }
    );
  }

  warningMessage(title: string, message: string): void {
    this.notification.warning(
      title,
      message,
      { nzPlacement: this.placement }
    );
  }

  getImageUrlFromBlobResponse(blobImage: Blob): SafeUrl {
    return window.URL.createObjectURL(blobImage);
  }

  getPolygonLatLngs(coordinateList: Coorditate[]): any {
    const latLng = [];
    for (const coordinate of coordinateList) {
      latLng.push(
        [coordinate.latitude, coordinate.longitude]
      )
    }
    return latLng;
  }
}
