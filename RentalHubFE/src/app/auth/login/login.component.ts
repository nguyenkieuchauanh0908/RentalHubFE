import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
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

  $destroy: Subject<boolean> = new Subject<boolean>();
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

  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pw = form.value.password;

    this.authService
      .login(email, pw)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          this.notifierService.notify('success', 'Đăng nhập thành công!');
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 1000);
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          this.notifierService.notify('error', errorMsg);
        }
      );
    this.isLoading = true;
    this.notifierService.hideAll();
  }

  loginWithGG() {
    this.authService.loginWithGG();
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
      this.forgetPassEmail = result;
    });
  }
}
