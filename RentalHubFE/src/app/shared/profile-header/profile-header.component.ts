import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
import { Pagination } from '../pagination/pagination.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  private userSub!: Subscription;
  private searchSub!: Subscription;
  searchResultChangedSub: Subscription = new Subscription();
  user!: User | null;
  fullName!: string;
  isAuthenticatedUser: boolean = false;
  seenNotiList!: any;
  seenNotiPagination: Pagination = { page: 0, total: 1, limit: 10 };
  unseenNotificaionList!: any;
  unseenNotiPagination: Pagination = { page: 0, total: 1, limit: 10 };
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
  ) {}
  ngOnDestroy() {
    console.log('destroying profile header...');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.notificationService.destroy();
  }

  ngOnInit() {
    console.log('init profile header...');
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('On rendering headers...');
        this.isAuthenticatedUser = !!user;
        this.user = user;
        if (this.user?._fname && this.user?._lname) {
          this.fullName = this.user?._fname + ' ' + this.user._lname;
        }
        if (this.isAuthenticatedUser) {
          //Lấy các noti đã xem
          this.notificationService.getCurrentSeenNotifications
            .pipe(takeUntil(this.$destroy))
            .subscribe((notifications) => {
              if (notifications) {
                this.seenNotiList = notifications;
                console.log(
                  '🚀 ~ ProfileHeaderComponent ~ .subscribe ~ this.seenNotiList:',
                  this.seenNotiList
                );
              } else {
                this.seenNotiList = [];
              }
            });
          //Lấy pagination của các noti đã xem
          this.notificationService.getSeenNotificationsPagination
            .pipe(takeUntil(this.$destroy))
            .subscribe((seenNotiPagination: any) => {
              this.seenNotiPagination = seenNotiPagination;
              console.log(
                '🚀 ~ ProfileHeaderComponent ~ .subscribe ~   this.seenNotiPagination:',
                this.seenNotiPagination
              );
            });

          //Lấy các noti chưa xem
          this.notificationService.getCurrentUnseenNotifications
            .pipe(takeUntil(this.$destroy))
            .subscribe((unseenNotifications) => {
              if (unseenNotifications) {
                this.unseenNotificaionList = unseenNotifications;
              } else {
                this.unseenNotificaionList = [];
              }
            });
          //Lấy pagination của các noti chưa xem
          this.notificationService.getUnseenNotificationspagination
            .pipe(takeUntil(this.$destroy))
            .subscribe((unseenNotiPagination: Pagination) => {
              this.unseenNotiPagination = unseenNotiPagination;
            });

          //Lấy tổng các noti chưa xem
          this.notificationService.getTotalNotifications
            .pipe(takeUntil(this.$destroy))
            .subscribe((notificationTotal) => {
              this.notificationTotals = notificationTotal;
            });
        } else {
          this.notificationTotals = 0;
          this.notificationService.setCurrentSeenNotifications([]);
          this.notificationService.setCurrentUnseenNotifications([]);
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

  seeMoreNoti(type: string) {
    switch (type) {
      case 'unseen':
        console.log('Getting more unseen notifications...');
        this.notificationService
          .getUnseenNotifications(
            this.unseenNotiPagination!.page + 1,
            this.unseenNotiPagination!.limit
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe();
        break;
      case 'seen':
        console.log('Getting more seen notifications...');
        this.notificationService
          .getSeenNotifications(
            this.seenNotiPagination!.page + 1,
            this.seenNotiPagination!.limit
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe();

        break;
      default:
        this.notificationService
          .getUnseenNotifications(
            this.seenNotiPagination!.page,
            this.seenNotiPagination!.limit
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe();
    }
  }

  readNotiDetail(noti: any) {
    switch (noti._type) {
      case 'REPORTED_POST':
        //Hiện lên chi tiết bài post kèm message thông báo
        this.postService
          .getReportPostDetails(noti._id)
          .pipe(takeUntil(this.$destroy))
          .subscribe((res) => {
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
        break;
      case 'NEW_COMMENT':
        this.markAsRead(noti);
        this.seeSocialPost(noti);
        break;
      case 'UPDATE_COMMENT':
        this.markAsRead(noti);
        this.seeSocialPost(noti);
        break;
      default:
        window.scrollTo(0, 0); // Scrolls the page to the top
        const dialog = this.dialog.open(DisplayNotiDialogComponent, {
          width: '600px',
          data: noti,
        });
    }
    // if (noti._type !== 'REPORTED_POST') {
    //   window.scrollTo(0, 0); // Scrolls the page to the top
    //   const dialog = this.dialog.open(DisplayNotiDialogComponent, {
    //     width: '600px',
    //     data: noti,
    //   });
    // } else {
    //   //Hiện lên chi tiết bài post kèm message thông báo
    //   this.postService
    //     .getReportPostDetails(noti._id)
    //     .pipe(takeUntil(this.$destroy))
    //     .subscribe((res) => {
    //       if (res.data) {
    //         window.scrollTo(0, 0); // Scrolls the page to the top
    //         const dialogRef = this.dialog.open(PostEditDialogComponent, {
    //           width: '1000px',
    //           data: res.data,
    //         });
    //         dialogRef.afterClosed().subscribe((result) => {
    //           console.log(`Dialog result: + $(result)`);
    //         });
    //       }
    //     });
    // }
  }

  seeSocialPost(noti: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: noti,
      },
    };
    this.router
      .navigate(['/forum/post/', noti._postId], navigationExtras)
      .then(() => {
        window.location.reload();
      });
  }

  markAsRead(noti: any) {
    this.notificationService.markNotiFicationAsReadById(noti._id).subscribe();
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
