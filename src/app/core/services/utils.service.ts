import {Injectable} from '@angular/core';
import {NzNotificationPlacement, NzNotificationService} from "ng-zorro-antd/notification";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  placement: NzNotificationPlacement = 'topRight';

  constructor(private notification: NzNotificationService,
              private sanitizer: DomSanitizer) {}

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
    let objectURL = 'data:image/jpeg;base64,' + blobImage;
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
