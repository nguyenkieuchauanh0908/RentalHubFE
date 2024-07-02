import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-update-avatar-dialog',
  templateUrl: './update-avatar-dialog.component.html',
  styleUrls: ['./update-avatar-dialog.component.scss'],
})
export class UpdateAvatarDialogComponent {
  isLoading = false;
  error: string = '';
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  preview: string = '';
  imageInfos?: Observable<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {
    this.accountService.getCurrentUser.subscribe((user) => {
      if (user) {
        this.preview = user?._avatar;
      }
    });
    console.log(
      '🚀 ~ UpdateAvatarDialogComponent ~ this.preview:',
      this.preview
    );
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.preview = '';
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  uploadFiles(): void {
    console.log('Uploading files...');
    this.isLoading = true;
    this.message = [];
    if (this.selectedFiles) {
      window.scrollTo(0, 0); // Scrolls the page to the to
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: 'Xác nhận cập nhật ảnh đại diện?',
      });
      const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
        for (let i = 0; i < this.selectedFiles!.length; i++) {
          console.log(typeof this.selectedFiles![i]);
          this.accountService.updateAvatar(this.selectedFiles![i]).subscribe(
            (res) => {
              if (res.data) {
                console.log(res.data);
                this.isLoading = false;
                this.notifierService.notify(
                  'success',
                  'Cập nhật ảnh đại diện thành công!'
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
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.isLoading = false;
      this.notifierService.notify(
        'warning',
        'Vui lòng chọn ảnh muốn cập nhật!'
      );
    }
  }
}
