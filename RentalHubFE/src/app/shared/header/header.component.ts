import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
import { Pagination } from '../pagination/pagination.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';

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
  ) {}

  ngOnInit() {
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
      this.notificationService.getCurrentSeenNotifications
        .pipe(takeUntil(this.$destroy))
        .subscribe((notifications) => {
          this.seenNotiList = notifications;
        });

      //Lấy các noti chưa xem
      this.notificationService.getCurrentUnseenNotifications
        .pipe(takeUntil(this.$destroy))
        .subscribe((unseenNotifications) => {
          this.unseenNotificaionList = unseenNotifications;
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
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.notificationService.destroy();
  }

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

  markAsReadAll() {
    this.notificationService
      .markAsReadAll()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
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

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    let stateData!: {
      searchResult: PostItem[] | null;
      pagination: Pagination;
      keyword: string;
    };
    if (searchForm.search) {
      this.postService
        .searchPostsByKeyword(searchForm.search, 1, 5)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            console.log('On navigating to search result page...');
            stateData = {
              searchResult: res.data,
              pagination: res.pagination,
              keyword: searchForm.search,
            };
            this.router.navigate(
              [
                '/posts/search',
                {
                  keyword: searchForm.search,
                },
              ],
              {
                state: stateData,
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
}
