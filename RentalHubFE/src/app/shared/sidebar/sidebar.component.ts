import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
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
  @Input() profile!: User | null;
  @Input() myProfile!: User | null;
  @Input() seeMyProfile!: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('Am I seeing my profile from sidebar: ', this.seeMyProfile);
  }

  ngOnDestroy() {}

  showAccount() {
    // this.router.navigate(['/profile/user', this.myProfile?._id]);
    console.log();
    const dialogRef = this.dialog.open(AccountEditDialogComponent, {
      width: '400px',
      data: this.myProfile,
    });
    console.log(
      '🚀 ~ file: sidebar.component.ts:43 ~ SidebarComponent ~ showAccount ~ this.myProfile:',
      this.myProfile
    );
  }

  toLoginDetail() {
    console.log('On opening up edit login detail component...');
    const dialogRef = this.dialog.open(LoginDetailUpdateDialogComponent, {
      width: '400px',
      data: this.myProfile?._email,
    });
  }

  logout() {
    console.log('On logging out...');
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

  toPostNew() {
    this.router.navigate(['/profile/post-new', this.myProfile?._id]);
  }

  editAvatar() {
    // this.router.navigate(['/profile/user/edit-avatar', this.myProfile?._id]);
    const dialogRef = this.dialog.open(UpdateAvatarDialogComponent, {
      width: '400px',
      data: this.myProfile?._avatar,
    });
  }
}
