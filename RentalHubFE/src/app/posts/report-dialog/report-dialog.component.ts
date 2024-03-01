import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';

export interface ReportContent {
  id: Number;
  content: String;
  isChecked: boolean;
}

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss'],
})
export class ReportDialogComponent {
  isLoading = false;
  warningMessage: String = '';
  reportContents: ReportContent[] = [
    {
      id: 0,
      content: 'Nội dung rác',
      isChecked: false,
    },
    {
      id: 1,
      content: 'Hình ảnh không phù hợp (khỏa thân, bạo lực,...)',
      isChecked: false,
    },
    {
      id: 2,
      content: 'Ngôn từ không phù hợp (gây chia rẽ, thù ghét, kích động,...)',
      isChecked: false,
    },
    {
      id: 3,
      content: 'Thông tin sai sự thật',
      isChecked: false,
    },
  ];
  otherReportedContent: ReportContent = {
    id: -1,
    content: '',
    isChecked: false,
  };
  updatedReportedContent!: String;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: String,
    private postService: PostService,
    private notifierService: NotifierService
  ) {
    this.updatedReportedContent = '';
    this.isLoading = false;
  }

  setOnly(checked: Boolean, reportContent: ReportContent) {
    this.reportContents.forEach((content) => {
      if (content.id !== reportContent.id) {
        if (checked) {
          content.isChecked = !checked;
        }
      }
    });
    if (reportContent.id !== -1) {
      this.updatedReportedContent = reportContent.content;
      this.otherReportedContent.isChecked = false;
    } else {
      this.updatedReportedContent = this.otherReportedContent.content;
    }
  }

  submitReport() {
    this.isLoading = true;
    console.log('On reporting...', this.updatedReportedContent);
    if (this.updatedReportedContent) {
      this.postService
        .reportPosts(this.data, this.updatedReportedContent)
        .subscribe((res) => {
          if (res.data) {
            this.isLoading = true;
            this.notifierService.notify(
              'success',
              'Đã báo cáo bài viết thành công!'
            );
          }
        });
    } else {
      this.warningMessage = 'Vui lòng chọn hoặc điền nội dung báo cáo!';
    }
  }
}
