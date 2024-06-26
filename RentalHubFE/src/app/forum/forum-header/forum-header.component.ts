import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { keyDown } from '@syncfusion/ej2-angular-richtexteditor';
import { NotifierService } from 'angular-notifier';
import { Subscription, Subject, takeUntil, Observable } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { PostEditDialogComponent } from 'src/app/accounts/posting-history/post-edit-dialog/post-edit-dialog.component';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { DisplayNotiDialogComponent } from 'src/app/shared/display-noti-dialog/display-noti-dialog.component';
import { NotificationService } from 'src/app/shared/notifications/notification.service';
import { Pagination } from 'src/app/shared/pagination/pagination.service';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { ForumService } from '../forum.service';
import { ForumPostModel } from '../forum-post/forum-post.model';
@Component({
  selector: 'app-forum-header',
  templateUrl: './forum-header.component.html',
  styleUrls: ['./forum-header.component.scss'],
})
export class ForumHeaderComponent implements OnInit, OnDestroy {
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
    private forumService: ForumService,
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

  toMyWall() {
    //Chuyển tới trang cá nhân
    if (this.user) {
      let navigationExtras: NavigationExtras = {
        state: {
          profileName: this.user._fname + this.user._lname,
          profileImage: this.user._avatar,
        },
      };

      this.router.navigate(['/forum/profile', this.user._id], navigationExtras);
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
    if (noti._type !== 'REPORTED_POST') {
      const dialog = this.dialog.open(DisplayNotiDialogComponent, {
        width: '600px',
        data: noti,
      });
    } else {
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
    }
  }

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    let stateData!: {
      searchResult: ForumPostModel[] | null;
      pagination: Pagination;
      keyword: string;
    };

    this.forumService.setCurrentKeyword(searchForm.search);
    if (searchForm.search) {
      this.forumService
        .searchByKeyword(searchForm.search, 0, 1, 5)
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
                '/forum/search',
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
      this.router.navigate(['/forum/home']);
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
