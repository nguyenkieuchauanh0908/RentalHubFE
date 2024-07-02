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
import { PostsModule } from 'src/app/posts/posts.module';
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
  private getProfileSub!: Subscription;
  private getPostHistorySub!: Subscription;
  $destroy: Subject<boolean> = new Subject<boolean>();
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  isHost: boolean = false;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  previews: string[] = [];
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];
  imageInfos?: Observable<any>;

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
          this.currentUid = user._id;
          this.myProfile = user;
          this.getPostHistorySub = this.postService
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
          this.getTagSub = this.postService
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

  toAllPostHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(4, 1, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            this.historyPosts = res.data;
            this.paginationService.pagination = res.pagination;
            this.totalPages = res.pagination.total;
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
    this.currentActiveStatus.status = 4;
    this.paginationService.currentPage = 1;
  }

  toStackPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(0, 1, 5)
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
    this.currentActiveStatus.status = 0;
    this.paginationService.currentPage = 1;
  }

  toOnWallPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(1, 1, 5)
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
    this.currentActiveStatus.status = 1;
    this.paginationService.currentPage = 1;
  }

  toUnSensoredPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(3, 1, 5)
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
    this.currentActiveStatus.status = 3;
    this.paginationService.currentPage = 1;
  }

  toHiddenPostsHistory() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.isLoading = true;
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(2, 1, 5)
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
          //console.log(this.historyPosts);
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
    this.currentActiveStatus.status = 2;
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
    this.getPostHistorySub = this.postService
      .getPostsHistory(this.currentActiveStatus.status, this.currentPage, 5)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            window.scrollTo(0, 0); // Scrolls the page to the top
            this.historyPosts = res.data;
            this.totalPages = res.pagination.total;
            this.isLoading = false;
          } else {
            this.historyPosts = [];
            this.isLoading = false;
          }
          // console.log(this.historyPosts);
          // console.log(this.currentActiveStatus.status);
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  toEditPostDialog(post: any) {
    this.postService.setCurrentChosenTags(post._tags);
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(PostEditDialogComponent, {
      width: '1000px',
      data: post,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: + $(result)`);
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
            this.isLoading = false;
          }
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
  }
}
