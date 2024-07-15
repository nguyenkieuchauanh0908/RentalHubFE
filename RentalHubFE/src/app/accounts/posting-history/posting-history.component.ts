import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostsListComponent } from 'src/app/posts/posts-list/posts-list.component';
import { AccountService } from '../accounts.service';
import { CommonModule } from '@angular/common';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PostService } from 'src/app/posts/post.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostEditDialogComponent } from './post-edit-dialog/post-edit-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { NotifierService } from 'angular-notifier';
import { PostItemComponent } from 'src/app/posts/posts-list/post-item/post-item.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    PostsListComponent,
    CommonModule,
    SharedModule,
    FormsModule,
    PostItemComponent,
  ],
  selector: 'app-posting-history',
  templateUrl: './posting-history.component.html',
  styleUrls: ['./posting-history.component.scss'],
})
export class PostingHistoryComponent {
  //Status bài viết: 0: Chờ duyệt 1:Public 2: Host tư khóa 3: Bị KDV từ chối duyệt 4: Bị khóa do report
  $destroy: Subject<boolean> = new Subject<boolean>();
  myProfile!: User | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  previews: string[] = [];
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  message: string[] = [];

  sourceTags: Set<Tags> = new Set();
  selectedTags: Set<Tags> = new Set();

  isLoading: boolean = false;

  currentActiveStatus = {
    status: 0, //All posts
    data: this.historyPosts,
  };

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    private paginationService: PaginationService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.historyPosts = [];
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.myProfile = user;
          this.postService
            .getPostsHistory(0, this.currentPage, this.pageItemLimit)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
              (res) => {
                this.historyPosts = res.data;
                this.postService.getCurrentPostingHistory
                  .pipe(takeUntil(this.$destroy))
                  .subscribe((postingHistory) => {
                    this.historyPosts = postingHistory!;
                  });
                this.paginationService.pagination = res.pagination;
                this.totalPages = res.pagination.total;
                this.isLoading = false;
              },
              (errorMsg) => {
                this.isLoading = false;
              }
            );
          this.postService
            .getAllTags()
            .pipe(takeUntil(this.$destroy))
            .subscribe((res) => {
              if (res.data) {
                console.log('Get tags successfully...');
                res.data.forEach((tag: Tags) => {
                  this.sourceTags.add(tag);
                });
              }
            });
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  getPostByStatus(status: number) {
    this.postService
      .getPostsHistory(
        this.currentActiveStatus.status,
        this.currentPage,
        this.pageItemLimit
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            this.historyPosts = res.data;
            this.totalPages = res.pagination.total;
            this.paginationService.pagination = res.pagination;
            this.isLoading = false;
          } else {
            this.historyPosts = [];
            this.isLoading = false;
          }
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  //Status: 0
  toStackPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.currentActiveStatus.status = 0;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostByStatus(this.currentActiveStatus.status);
    this.paginationService.currentPage = 1;
  }

  //Status: 1
  toOnWallPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.currentActiveStatus.status = 1;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostByStatus(this.currentActiveStatus.status);
    this.paginationService.currentPage = 1;
  }

  //Status: 3
  toUnSensoredPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.currentActiveStatus.status = 3;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostByStatus(this.currentActiveStatus.status);
    this.paginationService.currentPage = 1;
  }

  //Status: 2
  toHiddenPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.currentActiveStatus.status = 2;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostByStatus(this.currentActiveStatus.status);
    this.paginationService.currentPage = 1;
  }

  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
    this.isLoading = true;
    this.historyPosts = [];
    if (position === 1 || position === -1) {
      this.currentPage = this.paginationService.navigatePage(
        position,
        this.currentPage
      );
    }
    if (toFirstPage) {
      this.currentPage = 1;
    } else if (toLastPage) {
      this.currentPage = this.totalPages;
    }
    this.getPostByStatus(this.currentActiveStatus.status);
  }

  toEditPostDialog(post: any) {
    this.postService.setCurrentChosenTags(post._tags);
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(PostEditDialogComponent, {
      width: '1000px',
      data: post,
    });
  }

  activatePost(postId: string) {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn yêu cầu duyệt lại bài viết này không?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.postService.updatePostStatus(postId, true).subscribe((res) => {
        if (res.data) {
          console.log(res.data);
          this.notifierService.hideAll();
          this.notifierService.notify('success', 'Gửi yêu cầu thành công!');
        }
      });
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  search(form: any) {
    console.log('On searching...');
    if (form.keyword) {
      this.isLoading = true;
      this.postService
        .findPostByIdAndStatus(
          form.keyword,
          this.currentActiveStatus.status.toString()
        )
        .subscribe(
          (res) => {
            if (res.data) {
              console.log(res.data);
              this.isLoading = false;
              this.historyPosts = [];
              this.currentPage = 1;
              this.totalPages = 1;
              this.historyPosts.push(res.data);
            }

            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            this.notifierService.notify(
              'error',
              'Không có kết quả tìm kiếm trùng khớp!'
            );
          }
        );
    }
  }

  reloadData() {
    this.isLoading = true;
    this.currentPage = 1;
    this.getPostByStatus(this.currentActiveStatus.status);
  }
}
