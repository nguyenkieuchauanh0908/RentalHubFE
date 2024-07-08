import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../notifications/notification.service';
import { NotifierService } from 'angular-notifier';
import { NavigationExtras, Router } from '@angular/router';
import { ResourceLoader } from '@angular/compiler';
import { User } from 'src/app/auth/user.model';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-display-noti-dialog',
  templateUrl: './display-noti-dialog.component.html',
  styleUrls: ['./display-noti-dialog.component.scss'],
})
export class DisplayNotiDialogComponent implements OnInit, OnDestroy {
  user: User | null = null;
  $destroy: Subject<boolean> = new Subject();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private accountService: AccountService,
    private notificationService: NotificationService,
    public notifier: NotifierService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });
  }

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

  redirectoManagement(type: string) {
    if (this.user) {
      switch (type) {
        case 'CREATE_POST_FAIL':
          if (!this.data._read) {
            this.markAsRead();
          }
          this.router.navigate(['/profile/posting-history', this.user._id]);
          break;

        case 'REGISTER_ADDRESS_FAIL':
          if (!this.data._read) {
            this.markAsRead();
          }
          this.router.navigate(['/profile/manage-addresses', this.user._id]);
          break;
        case 'ACTIVE_HOST_FAIL':
          if (this.data._read) {
            this.markAsRead();
          }
          this.router.navigate(['/profile/post-new', this.user._id]);

          break;

        default:
      }
    } else {
      window.location.reload();
      this.notifier.notify('warning', 'Vui lòng đăng nhập để tiếp tục');
    }
  }
}
