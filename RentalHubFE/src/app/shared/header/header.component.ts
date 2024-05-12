import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { NotificationService } from '../notifications/notification.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { resDataDTO } from '../resDataDTO';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { ViewEncapsulation } from '@angular/compiler';
import { DisplayNotiDialogComponent } from '../display-noti-dialog/display-noti-dialog.component';
import { PostEditDialogComponent } from 'src/app/accounts/posting-history/post-edit-dialog/post-edit-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input('matBadge')
  @Input('matTooltipClass')
  content: string | number | undefined | null;
  tooltipClass: any;

  isLoading = false;
  error: string = '';
  searchResultChangedSub: Subscription = new Subscription();
  user!: User | null;
  fullName!: string;
  isAuthenticatedUser: boolean = false;
  seenNotiList!: any;
  unseenNotificaionList!: any;
  notificationTotals!: number;
  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private notificationService: NotificationService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('On rendering headers...');
        this.isAuthenticatedUser = !!user;
        console.log('User is authenticated: ', this.isAuthenticatedUser);
        this.user = user;
        if (this.user?._fname && this.user?._lname) {
          this.fullName = this.user?._fname + ' ' + this.user._lname;
        }
      });

    if (this.isAuthenticatedUser) {
      //Lấy các noti đã xem
      this.notificationService.getCurrentSeenNotifications.subscribe(
        (notifications) => {
          this.seenNotiList = notifications;
        }
      );

      //Lấy các noti chưa xem
      this.notificationService.getCurrentUnseenNotifications.subscribe(
        (unseenNotifications) => {
          this.unseenNotificaionList = unseenNotifications;
        }
      );

      //Lấy tổng các noti chưa xem
      this.notificationService.getTotalNotifications.subscribe(
        (notificationTotal) => {
          this.notificationTotals = notificationTotal;
        }
      );
    } else {
      this.notificationTotals = 0;
      this.notificationService.setCurrentSeenNotifications([]);
      this.notificationService.setCurrentUnseenNotifications([]);
    }
  }

  ngOnInit() {}

  toMyPosting() {
    let uId = this.user?._id;
    this.router.navigate(['/profile/posting-history/', uId]);
  }

  toPostNew() {
    if (this.user !== null) {
      let uId = this.user?._id;
      this.router.navigate(['/profile/post-new/', uId]);
    } else {
      this.notifierService.notify('error', 'Vui lòng đăng nhập để đăng bài!');
    }
  }

  // toSeeAllNotifications() {
  //   this.router.navigate(['/profile/notifications/', this.user?._id]);
  // }

  markAsReadAll() {
    this.notificationService.markAsReadAll().subscribe(
      (res) => {
        if (res.data) {
          this.notifierService.notify(
            'success',
            'Đánh dấu đã đọc toàn bộ thông báo thành công'
          );
        }
      },
      (errMsg) => {
        this.notifierService.notify(
          'error',
          'Đã có lỗi xảy ra, vui lòng thử lại sau'
        );
      }
    );
  }

  readNotiDetail(noti: any) {
    if (noti._type !== 'REPORTED_POST') {
      const dialog = this.dialog.open(DisplayNotiDialogComponent, {
        width: '600px',
        data: noti,
      });
    } else {
      //Hiện lên chi tiết bài post kèm message thông báo
      this.postService.getReportPostDetails(noti._id).subscribe((res) => {
        if (res.data) {
          const dialogRef = this.dialog.open(PostEditDialogComponent, {
            width: '1000px',
            data: res.data,
          });
          dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: + $(result)`);
          });
        }
      });
    }
  }

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    if (searchForm.search) {
      this.postService
        .searchPostsByKeyword(searchForm.search, 1, 5)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            this.postService.searchResultsChanged.next([...res.data]);
            console.log('On navigating to search result page...');
            this.router.navigate(
              [
                '/posts/search',
                {
                  keyword: searchForm.search,
                },
              ],
              {
                state: {
                  searchResult: res.data,
                  pagination: res.pagination,
                  keyword: searchForm.search,
                },
              }
            );
          },
          (errorMsg) => {
            this.isLoading = false;
            this.error = errorMsg;
            console.log(this.error);
            this.notifierService.notify('error', errorMsg);
          }
        );
    } else {
      this.router.navigate(['']).then(() => {
        window.location.reload();
      });
    }
  }

  toHome() {
    this.router.navigate(['']);
    // .then(() => {
    //   window.location.reload();
    // });
  }

  ngOnDestroy() {
    this.$destroy.next(true);
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn đăng xuất?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      let logoutObs: Observable<resDataDTO>;
      logoutObs = this.authService.logout(this.user?.RFToken);
      logoutObs.subscribe();
      this.router.navigate(['/posts']);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
