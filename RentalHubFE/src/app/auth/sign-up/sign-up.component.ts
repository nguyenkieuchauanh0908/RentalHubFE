import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  isLoading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  onSubmit(form: NgForm) {
    this.notifierService.hideAll();
    console.log('onSubmit....');
    let signupObs: Observable<resDataDTO>;
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pw = form.value.password;
    const pw_confirm = form.value.pw_confirm;

    if (pw === pw_confirm) {
      signupObs = this.authService.signup(email, pw, pw_confirm);
      this.isLoading = true;
      signupObs.subscribe(
        (res) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          this.notifierService.notify(
            'success',
            'Đăng ký tài khoản thành công!'
          );
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
      this.notifierService.notify('error', this.error);
    }
  }
}
