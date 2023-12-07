import { Component } from '@angular/core';
import { AccountService } from '../accounts.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent {
  otpSent: boolean = false;
  sendOTPSub: Subscription = new Subscription();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) {}

  onSubmitUserPhone(form: any) {
    console.log('on handling form data...');
    let phone = form.phone_number;
    this.sendOTPSub = this.accountService
      .verifyAccount(phone)
      .subscribe((res) => {
        this.otpSent = res.data;
        console.log('otp sent: ', this.otpSent);
        if (this.otpSent === true) {
          console.log('Please check your registered mail to get otp code ...');
          console.log(
            'There is one more step, please provide correct otp code to become host...'
          );
          this.onNavigateToVerifyOTP();
        }
      });
  }

  onNavigateToVerifyOTP() {
    console.log('on navigating to otp verification page...');
    this.router.navigate(['verify-otp'], {
      relativeTo: this.currentRoute,
    });
  }
}
