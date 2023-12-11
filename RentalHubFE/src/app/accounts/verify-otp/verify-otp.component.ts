import { Component, OnDestroy } from '@angular/core';
import { AccountService } from '../accounts.service';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnDestroy {
  isLoading = false;
  error: string = '';
  otpVerifySub!: Subscription;
  constructor(
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}
  ngOnDestroy() {
    this.otpVerifySub.unsubscribe();
  }
  onSubmitOtp(form: any) {
    console.log('on submitting otp...');
    this.otpVerifySub = this.accountService.confirmOtp(form.otp).subscribe(
      (res) => {
        if (res.data) {
          this.notifierService.notify(
            'success',
            'Kích hoạt tài khoản chủ nhà thành công!'
          );
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
