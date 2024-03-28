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
  phone: string | null | undefined;
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
    this.error = '';
    this.otpSent = false;
    this.otpVerified = false;
    this.phoneVerified = false;
    this.uId = this.accountService.getCurrentUserId()!;
  }

  verifyPhone(stepper: MatStepper) {
    this.phoneVerified = false;
    this.otpSent = false;
    this.isLoading = true;
    this.phone = this.firstFormGroup.value.firstCtrl;
    this.accountService.verifyAccount(this.phone!).subscribe(
      (res) => {
        if (res.data) {
          this.isLoading = false;
          this.otpSent = res.data;
          console.log('otp sent: ', this.otpSent);
          if (this.otpSent === true) {
            this.phoneVerified = true;
            this.notifierService.notify(
              'success',
              'OTP đã được gửi tới điện thoại!'
            );
            stepper.next();
          }
        }
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
        this.notifierService.notify('error', errorMsg);
      }
    );
  }

  verifyOTP(stepper: MatStepper) {
    this.otpVerified = false;
    this.isLoading = true;
    let otp = this.secondFormGroup.value.secondCtrl!;
    this.accountService.confirmOtp(otp, this.phone).subscribe(
      (res) => {
        if (res.data) {
          this.isLoading = false;
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
