import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-login-detail-update-dialog',
  templateUrl: './login-detail-update-dialog.component.html',
  styleUrls: ['./login-detail-update-dialog.component.scss'],
})
export class LoginDetailUpdateDialogComponent {
  isLoading = false;
  error: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    console.log(this.data);
  }

  saveChanges(form: any) {
    console.log('On saving updates on account details...', form);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận cập nhật thông tin?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.accountService
        .updateEmailPassword(form.email, form.pw, form.repw)
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Cập nhật thông tin đăng nhập thành công!Vui lòng đăng nhập lại!'
              );
              this.dialog.closeAll();
              this.authService.logout(this.accountService.getCurrentUserId());
            }
          },
          (errorMsg) => {
            this.isLoading = false;
            this.error = errorMsg;
            console.log(this.error);
            this.notifierService.notify('error', errorMsg);
          }
        );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
