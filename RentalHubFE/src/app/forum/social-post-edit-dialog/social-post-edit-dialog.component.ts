import { Component, OnDestroy } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';
import { FileUploadService } from 'src/app/shared/file-upload.services';
import { ForumService } from '../forum.service';
import { Form } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-social-post-edit-dialog',
  templateUrl: './social-post-edit-dialog.component.html',
  styleUrls: ['./social-post-edit-dialog.component.scss'],
})
export class SocialPostEditDialogComponent implements OnDestroy {
  isLoading: boolean = false;
  $destroy: Subject<boolean> = new Subject();
  error: string = '';
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];

  constructor(
    private uploadService: FileUploadService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private forumService: ForumService
  ) {}
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  saveSocialPost(form: any) {
    console.log('On saving social post...', form.value);
    if (this.selectedFiles) {
      //Gọi API
      this.forumService
        .createSocialPost(
          form.value.title,
          form.value.content,
          this.selectedFiles[0]
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify('success', 'Tạo bài viết thành công');
            }
          },
          (err) => {
            this.notifierService.notify(
              'error',
              'Đã có lỗi xảy ra, vui lòng thử lại sau!'
            );
          }
        );
    }
  }

  selectFiles(event: any): void {
    this.message = [];
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
  }
}
