import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { SendForgetPwEmailComponent } from 'src/app/shared/send-forget-pw-email/send-forget-pw-email.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginObs!: Observable<resDataDTO>;
  password: string = 'password';
  isShow: boolean = false;
  isLoading = false;
  error: string = '';
  forgetPassEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.password = 'password';
  }

  ngOnDestroy(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pw = form.value.password;

    this.loginObs = this.authService.login(email, pw);
    console.log(
      '🚀 ~ file: login.component.ts:28 ~ LoginComponent ~ onSubmit ~ this.loginObs:',
      this.loginObs
    );

    this.isLoading = true;
    this.notifierService.hideAll();
    this.loginObs.subscribe(
      (res) => {
        console.log(
          '🚀 ~ file: login.component.ts:32 ~ LoginComponent ~ onSubmit ~ res:',
          res
        );
        this.notifierService.notify('success', 'Đăng nhập thành công!');
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 1000);
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
  }

  onEyesClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.isShow = true;
    } else {
      this.password = 'password';
      this.isShow = false;
    }
  }

  onForgetPasswordClick() {
    const dialogRef = this.dialog.open(SendForgetPwEmailComponent, {
      data: { title: 'Quên mật khẩu', inputLabel: 'Email' },
      width: '400px',
    });
    const sub = dialogRef.componentInstance.closeDialog.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.forgetPassEmail = result;
    });
  }
}
