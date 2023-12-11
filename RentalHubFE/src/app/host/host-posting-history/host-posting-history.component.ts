import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';

@Component({
  selector: 'app-host-posting-history',
  templateUrl: './host-posting-history.component.html',
  styleUrls: ['./host-posting-history.component.scss'],
})
export class HostPostingHistoryComponent {
  private myProfileSub!: Subscription;
  private getProfileSub!: Subscription;
  private getPostHistorySub!: Subscription;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  seeMyProfile = false;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;

  currentActiveStatus = {
    status: 4, //All posts
    data: this.historyPosts,
  };

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private postService: PostService,
    private paginationService: PaginationService
  ) {
    this.currentUid = this.accountService.getCurrentUserId(this.route);
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit() {
    this.myProfileSub = this.accountService.getCurrentUser.subscribe(
      (myProfile) => {
        this.myProfile = myProfile;
      }
    );
    this.currentUid = this.accountService.getCurrentUserId(this.route);
    this.getPostHistorySub = this.postService
      .getPostsHistory(4, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
      });
  }
  ngOnDestroy(): void {
    this.getPostHistorySub.unsubscribe();
  }

  toAllPostHistory() {
    this.getPostHistorySub = this.postService
      .getPostsHistory(4, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
      });
    this.currentActiveStatus.status = 4;
    this.paginationService.currentPage = 1;
  }

  toStackPostsHistory() {
    this.getPostHistorySub = this.postService
      .getPostsHistory(0, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
        // console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 0;
    this.paginationService.currentPage = 1;
  }

  toOnWallPostsHistory() {
    this.getPostHistorySub = this.postService
      .getPostsHistory(1, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
        // console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 1;
    this.paginationService.currentPage = 1;
  }

  toReportedPostsHistory() {
    this.getPostHistorySub = this.postService
      .getPostsHistory(3, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
        // console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 3;
    this.paginationService.currentPage = 1;
  }

  toHiddenPostsHistory() {
    this.getPostHistorySub = this.postService
      .getPostsHistory(2, 1, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
        // console.log(this.historyPosts);
      });
    this.currentActiveStatus.status = 2;
    this.paginationService.currentPage = 1;
  }

  changeCurrentPage(position: number) {
    this.currentPage = this.paginationService.caculateCurrentPage(position);
    this.getPostHistorySub = this.postService
      .getPostsHistory(this.currentActiveStatus.status, this.currentPage, 5)
      .subscribe((res) => {
        this.historyPosts = res.data;
        this.totalPages = res.pagination.total;
        console.log(this.historyPosts);
        console.log(this.currentActiveStatus.status);
      });
  }
}
