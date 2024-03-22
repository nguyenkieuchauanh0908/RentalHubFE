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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input('matBadge')
  content: string | number | undefined | null;
  @Input('matTooltipClass')
  tooltipClass: any;

  isLoading = false;
  error: string = '';
  searchResultChangedSub: Subscription = new Subscription();
  user!: User | null;
  fullName!: string;
  isAuthenticatedUser: boolean = false;
  notificationList!: any;
  notificationTotals!: number;
  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('On rendering headers...');
        console.log(user);
        this.isAuthenticatedUser = !!user;
        console.log('User is authenticated: ', this.isAuthenticatedUser);
        this.user = user;
        if (this.user?._fname && this.user?._lname) {
          this.fullName = this.user?._fname + ' ' + this.user._lname;
        }
      });

    if (this.isAuthenticatedUser) {
      this.notificationService.getCurrentNotifications.subscribe(
        (notifications) => {
          this.notificationList = notifications;
        }
      );
      this.notificationService.getTotalNotifications.subscribe(
        (notificationTotal) => {
          console.log(
            '🚀 ~ HeaderComponent ~ .subscribe ~ notificationTotal:',
            notificationTotal
          );
          this.notificationTotals = notificationTotal;
        }
      );
    } else {
      this.notificationTotals = 0;
      this.notificationService.setCurrentNotifications([]);
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

  toSeeAllNotifications() {
    this.router.navigate(['/profile/notifications/', this.user?._id]);
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
    //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //     width: '400px',
    //     data: 'Bạn có chắc muốn đăng xuất?',
    //   });
    //   const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
    //     let logoutObs: Observable<resDataDTO>;
    //     logoutObs = this.authService.logout(this.user?.RFToken);
    //     logoutObs.subscribe();
    //     this.router.navigate(['/posts']);
    //   });
    //   dialogRef.afterClosed().subscribe(() => {
    //     sub.unsubscribe();
    //   });
    let logoutObs: Observable<resDataDTO>;
    logoutObs = this.authService.logout(this.user?.RFToken);
    logoutObs.subscribe();
    this.router.navigate(['/posts']);
  }
}
