import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/shared/file-upload.services';
import { AccountService } from '../accounts.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.scss'],
})
export class ChangeAvatarComponent {
  isLoading = false;
  error: string = '';
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

  constructor(
    private uploadService: FileUploadService,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);

        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  uploadFiles(): void {
    console.log('Uploading files...');
    this.message = [];
    this.isLoading = true;
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        console.log(typeof this.selectedFiles[i]);
        this.accountService.updateAvatar(this.selectedFiles[i]).subscribe(
          (res) => {
            if (res.data) {
              console.log(res.data);
              this.isLoading = false;
              this.notifierService.notify(
                'success',
                'Cập nhật avatar thành công!'
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
  }
}
