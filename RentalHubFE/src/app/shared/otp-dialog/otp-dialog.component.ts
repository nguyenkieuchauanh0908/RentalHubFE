import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss'],
})
export class OtpDialogComponent {
  isLoading = false;
  error: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private authService: AuthService,
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private router: Router
  ) {
    console.log(data);
  }

  saveChanges(form: any) {
    console.log('On saving updates on account details...', form);
    this.isLoading = true;
    this.authService.verifyUser(this.data, form.otp).subscribe(
      (res) => {
        if (res.data) {
          this.isLoading = false;
          this.notifierService.notify(
            'success',
            'Đăng ký tài khoản thành công!'
          );
          this.dialog.closeAll();
          this.router.navigate(['/auth/login']);
        }
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
  }
}
