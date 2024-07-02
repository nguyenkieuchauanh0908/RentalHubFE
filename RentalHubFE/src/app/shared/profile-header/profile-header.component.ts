import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { NotificationService } from '../notifications/notification.service';
import { AuthService } from 'src/app/auth/auth.service';
import { resDataDTO } from '../resDataDTO';
import { PostEditDialogComponent } from 'src/app/accounts/posting-history/post-edit-dialog/post-edit-dialog.component';
import { DisplayNotiDialogComponent } from '../display-noti-dialog/display-noti-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent {
  isLoading = false;
  error: string = '';
  private userSub!: Subscription;
  private searchSub!: Subscription;
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
        // console.log(user);
        this.isAuthenticatedUser = !!user;
        // console.log('User is authenticated: ', this.isAuthenticatedUser);
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

  ngOnInit() {
    this.userSub = this.accountService.getCurrentUser.subscribe((user) => {
      console.log('On rendering headers...');
      this.isAuthenticatedUser = !!user;
      console.log('User is authenticated: ', this.isAuthenticatedUser);
      this.user = user;
      if (this.user?._fname && this.user?._lname) {
        this.fullName = this.user?._fname + ' ' + this.user._lname;
      }
    });
  }

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
          window.scrollTo(0, 0); // Scrolls the page to the top

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

  toUpdateLoginDetail() {
    this.router.navigate(['/profile/update-login-detail/', this.user?._id]);
  }

  toIdentityCardManagement() {
    this.router.navigate(['/profile/manage-identity', this.user?._id]);
  }

  toRegisterNewAddress() {
    this.router.navigate(['/profile/register-address', this.user?._id]);
  }

  toAddressesManagement() {
    this.router.navigate(['/profile/manage-addresses', this.user?._id]);
  }

  toUpdateAvatar() {
    this.router.navigate(['/profile/update-avatar/', this.user?._id]);
  }

  toMyPosting() {
    this.router.navigate(['/profile/posting-history/', this.user?._id]);
  }

  toPostNew() {
    if (this.user !== null) {
      this.router.navigate(['/profile/post-new/', this.user?._id]);
    } else {
      this.notifierService.notify('error', 'Vui lòng đăng nhập để đăng bài!');
    }
  }

  toMyFavoritePosts() {
    this.router.navigate(['/profile/favorites-posts', this.user?._id]);
  }

  toPostingHistory() {
    this.router.navigate(['/profile/posting-history', this.user?._id]);
  }

  // toAllNotifications() {
  //   this.router.navigate(['/profile/notifications', this.user?._id]);
  // }

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    if (searchForm.search) {
      this.searchSub = this.postService
        .searchPostsByKeyword(searchForm.search, 1, 5)
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
      this.notifierService.notify('error', 'Vui lòng nhập từ khóa tìm kiếm!');
    }
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  toHome() {
    this.router.navigate(['']);
  }

  logout() {
    window.scrollTo(0, 0); // Scrolls the page to the top

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn đăng xuất?',
    });
    const sub = dialogRef.componentInstance.confirmYes
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.authService
          .logout(this.user?.RFToken)
          .pipe(takeUntil(this.$destroy))
          .subscribe();
      });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        sub.unsubscribe();
      });
  }
  toSeeAllNotifications() {
    this.router.navigate(['/profile/notifications/', this.user?._id]);
  }
}
