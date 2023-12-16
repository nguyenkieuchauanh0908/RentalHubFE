import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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

@Component({
  standalone: true,
  imports: [
    RouterModule,
    PostsListComponent,
    CommonModule,
    SharedModule,
    FormsModule,
  ],
  selector: 'app-posting-history',
  templateUrl: './posting-history.component.html',
  styleUrls: ['./posting-history.component.scss'],
})
export class PostingHistoryComponent {
  private getProfileSub!: Subscription;
  private getPostHistorySub!: Subscription;
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

  currentActiveStatus = {
    status: 4, //All posts
    data: this.historyPosts,
  };
  notifierService: any;
  authService: any;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private postService: PostService,
    private paginationService: PaginationService,
    public dialog: MatDialog
  ) {
    this.currentUid = this.accountService.getCurrentUserId(this.route);
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit() {
    this.historyPosts = [];
    this.getTagSub = this.postService.getAllTags().subscribe((res) => {
      if (res.data) {
        console.log('Get tags successfully...');
        res.data.forEach((tag: Tags) => {
          this.sourceTags.add(tag);
        });
      }
    });

    this.currentUid = this.accountService.getCurrentUserId(this.route);
    this.getPostHistorySub = this.postService
      .getPostsHistory(4, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        console.log(
          '🚀 ~ file: posting-history.component.ts:88 ~ PostingHistoryComponent ~ .subscribe ~ this.historyPosts:',
          this.historyPosts
        );
        this.totalPages = res.pagination.total;
      });
  }
  ngOnDestroy(): void {
    this.getPostHistorySub.unsubscribe();
  }

  toAllPostHistory() {
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(4, 1, 5)
      .subscribe((res) => {
        if (res.data) {
          this.historyPosts = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.historyPosts = [];
        }
        //console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 4;
    this.paginationService.currentPage = 1;
  }

  toStackPostsHistory() {
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(0, 1, 5)
      .subscribe((res) => {
        if (res.data) {
          this.historyPosts = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.historyPosts = [];
        }
        //console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 0;
    this.paginationService.currentPage = 1;
  }

  toOnWallPostsHistory() {
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(1, 1, 5)
      .subscribe((res) => {
        if (res.data) {
          this.historyPosts = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.historyPosts = [];
        }
        //console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 1;
    this.paginationService.currentPage = 1;
  }

  toReportedPostsHistory() {
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(3, 1, 5)
      .subscribe((res) => {
        if (res.data) {
          this.historyPosts = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.historyPosts = [];
        }
        //console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 3;
    this.paginationService.currentPage = 1;
  }

  toHiddenPostsHistory() {
    this.historyPosts = [];
    this.getPostHistorySub = this.postService
      .getPostsHistory(2, 1, 5)
      .subscribe((res) => {
        if (res.data) {
          this.historyPosts = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.historyPosts = [];
        }
        //console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 2;
    this.paginationService.currentPage = 1;
  }

  changeCurrentPage(position: number) {
    this.historyPosts = [];
    this.currentPage = this.paginationService.caculateCurrentPage(position);
    this.getPostHistorySub = this.postService
      .getPostsHistory(this.currentActiveStatus.status, this.currentPage, 5)
      .subscribe((res) => {
        if (res.data) {
          this.historyPosts = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.historyPosts = [];
        }
        //console.log(this.historyPosts);
        console.log(this.historyPosts);
        console.log(this.currentActiveStatus.status);
      });
  }

  toEditPostDialog(post: any) {
    const dialogRef = this.dialog.open(PostEditDialogComponent, {
      width: '1000px',
      data: post,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: + $(result)`);
    });
  }
}
