import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  onSubmit(form: NgForm) {
    let loginObs: Observable<resDataDTO>;
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pw = form.value.password;

    loginObs = this.authService.login(email, pw);
    console.log(
      '🚀 ~ file: login.component.ts:28 ~ LoginComponent ~ onSubmit ~ loginObs:',
      loginObs
    );

    this.isLoading = true;
    loginObs.subscribe(
      (res) => {
        console.log(
          '🚀 ~ file: login.component.ts:32 ~ LoginComponent ~ onSubmit ~ res:',
          res
        );
        this.isLoading = false;
        this.router.navigate(['/posts']);
        this.notifierService.notify('success', 'Đăng nhập thành công!');
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(this.error);
        this.notifierService.notify('error', errorMsg);
      }
    );
    console.log(
      '🚀 ~ file: login.component.ts:28 ~ LoginComponent ~ onSubmit ~ loginObs:',
      loginObs
    );
  }
}
