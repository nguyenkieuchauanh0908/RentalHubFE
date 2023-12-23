import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AccountService } from '../accounts.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-verify-host',
  templateUrl: './verify-host.component.html',
  styleUrls: ['./verify-host.component.scss'],
})
export class VerifyHostComponent implements OnInit {
  isEditable = false;
  isLoading = false;
  error: string = '';
  otpSent: boolean = false;
  phoneVerified: boolean = false;
  otpVerified: boolean = false;
  uId: string = '';

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.uId = this.accountService.getCurrentUserId()!;
  }

  verifyPhone(stepper: MatStepper) {
    let phone = this.firstFormGroup.value.firstCtrl;
    this.accountService.verifyAccount(phone!).subscribe(
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
            this.phoneVerified = true;
            stepper.next();
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

  verifyOTP(stepper: MatStepper) {
    let otp = this.secondFormGroup.value.secondCtrl!;
    this.accountService.confirmOtp(otp).subscribe(
      (res) => {
        if (res.data) {
          this.notifierService.notify(
            'success',
            'Kích hoạt tài khoản chủ nhà thành công!'
          );
          this.otpVerified = true;
          stepper.next();
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

  goToPostNew() {
    this.router.navigate(['profile/post-new/', this.uId]);
  }

  goToHome() {
    this.router.navigate(['posts']);
  }
}
