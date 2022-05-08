import { Injectable } from '@angular/core';
import {NzNotificationPlacement, NzNotificationService} from "ng-zorro-antd/notification";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  placement: NzNotificationPlacement = 'topRight';

  constructor(private notification: NzNotificationService) {}

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
}
