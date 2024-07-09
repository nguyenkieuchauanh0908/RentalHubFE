import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { resDataDTO } from '../resDataDTO';
import { User } from 'src/app/auth/user.model';
import { AccountService } from 'src/app/accounts/accounts.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDetailUpdateDialogComponent } from 'src/app/accounts/login-detail-update-dialog/login-detail-update-dialog.component';
import { AccountEditDialogComponent } from 'src/app/accounts/account-edit-dialog/account-edit-dialog.component';
import { UpdateAvatarDialogComponent } from 'src/app/accounts/update-avatar-dialog/update-avatar-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  myProfile: User | null = null;
  loginType: number | 0 = 0;
  $destroy: Subject<boolean> = new Subject();

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.myProfile = user;
        if (this.myProfile) {
          this.loginType = Number(localStorage.getItem('loginType'));
        }
      });
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  showAccount() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(AccountEditDialogComponent, {
      width: '400px',
      data: this.myProfile,
    });
  }

  toLoginDetail() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(LoginDetailUpdateDialogComponent, {
      width: '400px',
      data: this.myProfile?._email,
    });
  }

  logout() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn đăng xuất?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      let logoutObs: Observable<resDataDTO>;
      logoutObs = this.authService.logout(this.myProfile?.RFToken);
      logoutObs.subscribe();
      this.router.navigate(['/posts']);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  toMyFavoritePosts() {
    this.router.navigate(['/profile/favorites-posts', this.myProfile?._id]);
  }

  toPostingHistory() {
    this.router.navigate(['/profile/posting-history', this.myProfile?._id]);
  }

  toIdentityCardManagement() {
    this.router.navigate(['/profile/manage-identity', this.myProfile?._id]);
  }

  toRegisterNewAddress() {
    this.router.navigate(['/profile/register-address', this.myProfile?._id]);
  }

  toPostNew() {
    this.router.navigate(['/profile/post-new', this.myProfile?._id]);
  }

  toAddressesManagement() {
    this.router.navigate(['/profile/manage-addresses', this.myProfile?._id]);
  }

  editAvatar() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(UpdateAvatarDialogComponent, {
      width: '400px',
      data: this.myProfile?._avatar,
    });
  }
}
