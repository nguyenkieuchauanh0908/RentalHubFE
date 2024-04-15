import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { OtpDialogComponent } from 'src/app/shared/otp-dialog/otp-dialog.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  password: string = 'password';
  confirmPassword: string = 'password';
  isPwShown: boolean = false;
  isConfirmPwShown: boolean = false;
  isLoading = false;
  error: string = '';
  temptEmail: string = '';

  constructor(
    private authService: AuthService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    this.confirmPassword = 'password';
    this.temptEmail = '';
  }

  onSubmit(form: NgForm) {
    console.log('onSubmit....');
    console.log(
      '🚀 ~ SignUpComponent ~ onSubmit ~ form.value.email:',
      form.value
    );
    this.temptEmail = form.value.email;
    this.notifierService.hideAll();
    let signupObs: Observable<resDataDTO>;
    if (!form.valid) {
      return;
    }
    const fname = form.value.fname;
    const lname = form.value.lname;
    const email = form.value.email;
    const pw = form.value.password;
    const pw_confirm = form.value.pw_confirm;

    if (pw === pw_confirm) {
      signupObs = this.authService.signupOTP(
        fname,
        lname,
        email,
        pw,
        pw_confirm
      );
      this.isLoading = true;
      signupObs.subscribe(
        (res) => {
          if (res.data) {
            this.isLoading = false;
            this.notifierService.notify(
              'success',
              'OTP đã được gửi đến email đăng ký!'
            );
            const dialogRef = this.dialog.open(OtpDialogComponent, {
              width: '400px',
              data: this.temptEmail,
            });
          }
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          console.log(this.error);
          this.notifierService.notify('error', this.error);
        }
      );
    } else {
      this.error = 'Mật khẩu nhập lại không khớp!';
      console.log(this.error);
      this.notifierService.notify('error', 'Mật khẩu nhập lại không khớp!');
    }
  }
  onEyesSeePwClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.isPwShown = true;
    } else {
      this.password = 'password';
      this.isPwShown = false;
    }
  }

  onEyesSeeConfirmPwClick() {
    if (this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.isConfirmPwShown = true;
    } else {
      this.confirmPassword = 'password';
      this.isConfirmPwShown = false;
    }
  }
}
