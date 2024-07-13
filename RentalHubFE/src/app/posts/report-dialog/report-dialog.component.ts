import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { Router } from '@angular/router';
import { ForumService } from 'src/app/forum/forum.service';

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
export class ReportDialogComponent implements OnDestroy, OnInit {
  postType: number = 0; //0: Bài viết cho thuê trọ, 1: Bài viết MXH
  $destroy: Subject<boolean> = new Subject();
  isLoading = false;
  warningMessage: String = '';
  isAuthenticated = false;
  postIdToReport: string;
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
    @Inject(MAT_DIALOG_DATA) public data: { postId: string; postType: number },
    public matDialog: MatDialog,
    private accountService: AccountService,
    private router: Router,
    private forumService: ForumService,
    private postService: PostService,
    private notifierService: NotifierService
  ) {
    this.updatedReportedContent = '';
    console.log(data);
    this.postIdToReport = data.postId;
    this.postType = data.postType;
  }
  ngOnInit(): void {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
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
    if (this.isAuthenticated) {
      //Báo cáo bài viết cho thuê trọ
      if (this.postType === 0) {
        this.postService
          .reportPosts(this.postIdToReport, this.updatedReportedContent)
          .subscribe((res) => {
            if (res.data) {
              this.isLoading = false;
              this.notifierService.notify(
                'success',
                'Đã báo cáo bài viết thành công!'
              );
              this.matDialog.closeAll();
            }
          });
      }
      //Báo cáo bài viết MXH
      else {
        this.forumService
          .reportSocialPost(
            this.postIdToReport,
            this.updatedReportedContent.toString()
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe(
            (res) => {
              if (res.data) {
                this.isLoading = false;
                this.notifierService.notify(
                  'success',
                  'Báo cáo của bạn đã được ghi nhận!'
                );
                this.matDialog.closeAll();
              }
            },
            (err) => {
              this.isLoading = false;
              this.notifierService.notify(
                'error',
                'Đã có lỗi xảy ra, vui lòng thử lại sau'
              );
            }
          );
      }
    } else {
      this.notifierService.notify('warning', 'Phiên đăng nhập đã hết hạn');
      this.router.navigate(['/']);
    }
  }
}
