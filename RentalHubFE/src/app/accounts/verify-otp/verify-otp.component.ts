import { Component, OnDestroy } from '@angular/core';
import { AccountService } from '../accounts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnDestroy {
  otpVerifySub!: Subscription;
  constructor(private accountService: AccountService) {}
  ngOnDestroy() {
    this.otpVerifySub.unsubscribe();
  }
  onSubmitOtp(form: any) {
    console.log('on submitting otp...');
    this.otpVerifySub = this.accountService
      .confirmOtp(form.otp)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
