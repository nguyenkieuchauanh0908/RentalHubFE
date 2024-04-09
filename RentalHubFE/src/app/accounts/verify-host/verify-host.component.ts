import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AccountService } from '../accounts.service';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';

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
  idCardVerified: boolean = false;
  uId: string = '';
  selectedFileFronts?: FileList;
  selectedFileBacks?: FileList;
  selectedFileFrontNames?: String[];
  selectedFileBackNames?: String[];
  progressInfos: any[] = [];
  message: string[] = [];
  previewFront: string = '';
  previewBack: string = '';
  imageInfos?: Observable<any>;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
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
    this.idCardVerified = false;
    this.uId = this.accountService.getCurrentUserId()!;
  }

  //Step 1: Send OTP SMS successfully, go to step 2
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

  //Step 2: Verify OTP successfully, go to step 3
  verifyOTP(stepper: MatStepper) {
    this.otpVerified = false;
    this.isLoading = true;
    let otp = this.secondFormGroup.value.secondCtrl!;
    this.accountService.confirmOtp(otp, this.phone).subscribe(
      (res) => {
        if (res.data) {
          this.isLoading = false;
          this.notifierService.notify('success', 'Xác thực OTP thành công!');
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

  //Step 3: Verify National ID card successfully, go to step 4
  verifyNationalIDCard(stepper: MatStepper) {
    console.log('Uploading files...');
    this.isLoading = true;
    this.message = [];
    if (this.selectedFileFronts && this.selectedFileBacks) {
      this.accountService
        .verifyNationalIDCard(
          this.selectedFileFronts[0],
          this.selectedFileBacks[0]
        )
        .subscribe(
          (res) => {
            if (res.data) {
              stepper.next();
              this.notifierService.notify(
                'success',
                'Yêu cầu thành công, hồ sơ của bạn sẽ được duyệt trong thời gian sớm nhất có thể!'
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
    } else {
      this.notifierService.notify(
        'warning',
        'Vui lòng chọn đủ ảnh mặt trước và mặt sau CCCD!'
      );
    }
    this.isLoading = false;
    this.idCardVerified = true;
  }

  selectFiles(event: any, type: string): void {
    console.log('On selecting image...');
    this.message = [];

    switch (type) {
      case 'front':
        this.previewFront = '';
        this.selectedFileFrontNames = [];
        this.selectedFileFronts = event.target.files;
        if (this.selectedFileFronts) {
          const numberOfFiles = this.selectedFileFronts.length;
          for (let i = 0; i < numberOfFiles; i++) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              console.log(e.target.result);
              this.previewFront = e.target.result;
            };
            reader.readAsDataURL(this.selectedFileFronts[i]);
            this.selectedFileFrontNames.push(this.selectedFileFronts[i].name);
          }
        }
        break;
      case 'back':
        this.selectedFileBackNames = [];

        this.previewBack = '';
        this.selectedFileBacks = event.target.files;
        if (this.selectedFileBacks) {
          const numberOfFiles = this.selectedFileBacks.length;
          for (let i = 0; i < numberOfFiles; i++) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              console.log(e.target.result);
              this.previewBack = e.target.result;
            };
            reader.readAsDataURL(this.selectedFileBacks[i]);
            this.selectedFileBackNames.push(this.selectedFileBacks[i].name);
          }
        }
        break;
      default:
    }
  }

  // goToPostNew() {
  //   this.router.navigate(['profile/post-new/', this.uId]);
  // }

  goToHome() {
    this.router.navigate(['posts']);
  }
}
