import { Component, Inject, Optional } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

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
  notificationList!: any;
  notificationTotals!: number;
  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private notificationService: NotificationService,
    private authService: AuthService // private dialog: MatDialog, // @Optional() public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) // @Inject(MAT_DIALOG_DATA) public dialogData: any
  {
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

  ngOnInit() {
    this.userSub = this.accountService.getCurrentUser.subscribe((user) => {
      console.log('On rendering headers...');
      console.log(user);
      this.isAuthenticatedUser = !!user;
      console.log('User is authenticated: ', this.isAuthenticatedUser);
      this.user = user;
      if (this.user?._fname && this.user?._lname) {
        this.fullName = this.user?._fname + ' ' + this.user._lname;
      }
    });
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
    // this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   width: '400px',
    //   data: 'Bạn có chắc muốn đăng xuất?',
    // });
    // const sub = this.dialogRef.componentInstance.confirmYes.subscribe(() => {
    //   let logoutObs: Observable<resDataDTO>;
    //   logoutObs = this.authService.logout(this.user?.RFToken);
    //   logoutObs.subscribe();
    //   this.router.navigate(['/posts']);
    // });
    // this.dialogRef.afterClosed().subscribe(() => {
    //   sub.unsubscribe();
    // });
    let logoutObs: Observable<resDataDTO>;
    logoutObs = this.authService.logout(this.user?.RFToken);
    logoutObs.subscribe();
    this.router.navigate(['/posts']);
  }

  toSeeAllNotifications() {
    this.router.navigate(['/profile/notifications/', this.user?._id]);
  }
}
