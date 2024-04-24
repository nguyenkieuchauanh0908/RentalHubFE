import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { AccountService } from '../../accounts.service';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-identity-update-dialog',
  templateUrl: './identity-update-dialog.component.html',
  styleUrls: ['./identity-update-dialog.component.scss'],
})
export class IdentityUpdateDialogComponent {
  title: String = 'Cập nhật CCCD';
  isLoading = false;
  selectedFileFronts?: FileList;
  selectedFileBacks?: FileList;
  selectedFileFrontNames?: String[];
  selectedFileBackNames?: String[];
  progressInfos: any[] = [];
  message: string[] = [];
  previewFront: string = '';
  previewBack: string = '';
  imageInfos?: Observable<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService,
    public notifierService: NotifierService
  ) {
    this.title = this.data;
  }

  verifyNationalIDCard() {
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
              this.notifierService.notify(
                'success',
                'Yêu cầu thành công, hồ sơ của bạn sẽ được duyệt trong thời gian sớm nhất có thể!'
              );
              //Cập nhật lại currentUser và currentIdCard
              let updatedUser: User;
              this.accountService.getCurrentUser.subscribe((currentUser) => {
                if (currentUser) {
                  currentUser._isHost = false;
                  updatedUser = currentUser;
                  localStorage.setItem('userData', JSON.stringify(updatedUser));
                }
              });
              this.accountService.setCurrentUser(updatedUser!);
              this.accountService.setCurrentIDCard(null);
            }
          },
          (errorMsg) => {
            this.isLoading = false;

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
}
