import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../notifications/notification.service';
import { NotifierService } from 'angular-notifier';
import { NavigationExtras, Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-display-noti-dialog',
  templateUrl: './display-noti-dialog.component.html',
  styleUrls: ['./display-noti-dialog.component.scss'],
})
export class DisplayNotiDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    public notifier: NotifierService,
    private router: Router
  ) {}

  markAsRead() {
    this.notificationService
      .markNotiFicationAsReadById(this.data._id)
      .subscribe((res) => {
        if (res.data) {
          this.notifier.notify(
            'success',
            'Đánh dấu thông báo đã đọc thành công!'
          );
        }
      });
  }

  // seeSocialPost() {
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //       data: this.data,
  //     },
  //   };
  //   this.router
  //     .navigate(['/forum/post/', this.data._postId], navigationExtras)
  //     .then(() => {
  //       window.location.reload();
  //     });
  // }
}
