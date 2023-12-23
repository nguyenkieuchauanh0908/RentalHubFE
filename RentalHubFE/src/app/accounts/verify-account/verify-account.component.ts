import { Component } from '@angular/core';
import { AccountService } from '../accounts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent {
  isLoading = false;
  error: string = '';
  otpSent: boolean = false;
  sendOTPSub: Subscription = new Subscription();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private notifierService: NotifierService
  ) {}

  onSubmitUserPhone(form: any) {
    console.log('on handling form data...');
    let phone = form.phone_number;
    this.sendOTPSub = this.accountService.verifyAccount(phone).subscribe(
      (res) => {
        if (res.data) {
          this.otpSent = res.data;
          console.log('otp sent: ', this.otpSent);
          if (this.otpSent === true) {
            console.log(
              'Please check your registered mail to get otp code ...'
            );
            console.log(
              'There is one more step, please provide correct otp code to become host...'
            );

            this.onNavigateToVerifyOTP();
          }
        }
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        console.log(
          '🚀 ~ file: verify-account.component.ts:48 ~ VerifyAccountComponent ~ onSubmitUserPhone ~ this.error:',
          this.error
        );
        this.notifierService.notify('error', errorMsg);
      }
    );
  }

  onNavigateToVerifyOTP() {
    console.log('on navigating to otp verification page...');
    this.router.navigate(['verify-otp'], {
      relativeTo: this.currentRoute,
    });
    this.notifierService.notify(
      'success',
      'Vui lòng kiểm tra mã OTP được gửi tới mail!'
    );
  }
}
