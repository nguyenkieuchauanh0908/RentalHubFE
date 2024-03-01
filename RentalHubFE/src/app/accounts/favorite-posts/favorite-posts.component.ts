import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { AccountService } from '../accounts.service';
import { PostEditDialogComponent } from '../posting-history/post-edit-dialog/post-edit-dialog.component';

@Component({
  selector: 'app-favorite-posts',
  templateUrl: './favorite-posts.component.html',
  styleUrls: ['./favorite-posts.component.scss'],
})
export class FavoritePostsComponent {
  private getPostHistorySub!: Subscription;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  historyPosts: PostItem[] | any = new Array<PostItem>();
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
    private router: Router
  ) {
    this.isLoading = true;
    this.historyPosts = [];
    this.currentUid = this.accountService.getCurrentUserId();
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
    this.getPostHistorySub = this.postService
      .getFavorites(1, this.pageItemLimit)
      .subscribe(
        (res) => {
          this.postService.getCurrentFavorites.subscribe((postingHistory) => {
            this.historyPosts = postingHistory!;
          });
          this.paginationService.pagination = res.pagination;
          console.log(
            '🚀 ~ FavoritePostsComponent ~ res.pagination:',
            res.pagination
          );
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  ngOnInit() {
    this.currentUid = this.accountService.getCurrentUserId();
  }
  ngOnDestroy(): void {
    this.getPostHistorySub.unsubscribe();
  }

  toPostDetail(postId: String) {
    this.router.navigate(['/posts/', postId]);
  }

  toUnfavorPost(postId: String) {
    this.postService.createFavorite(postId).subscribe();
    this.getPostHistorySub = this.postService
      .getFavorites(this.currentPage, this.pageItemLimit)
      .subscribe(
        (res) => {
          this.postService.getCurrentFavorites.subscribe((postingHistory) => {
            console.log(
              '🚀 ~ FavoritePostsComponent ~ this.postService.getCurrentFavorites.subscribe ~ postingHistory:',
              postingHistory
            );
            if (postingHistory) {
              postingHistory = postingHistory.filter((post) => {
                console.log(post._postId, postId);
                return String(post._postId) !== postId;
              });
              this.historyPosts = postingHistory;
              console.log(
                '🚀 ~ FavoritePostsComponent ~ this.historyPosts=postingHistory!.filter ~ this.historyPosts:',
                this.historyPosts
              );
            }
          });

          this.paginationService.pagination = res.pagination;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  changeCurrentPage(position: number) {
    this.isLoading = true;
    this.historyPosts = [];
    this.currentPage = this.paginationService.pagination.page;
    this.currentPage = this.paginationService.navigatePage(
      position,
      this.currentPage
    );
    console.log(
      '🚀 ~ file: posting-history.component.ts:249 ~ PostingHistoryComponent ~ changeCurrentPage ~ this.currentPage:',
      this.currentPage
    );
    this.getPostHistorySub = this.postService
      .getFavorites(this.currentPage, this.pageItemLimit)
      .subscribe(
        (res) => {
          console.log(res.data);
          this.historyPosts = res.data;
          this.postService.getCurrentFavorites.subscribe((postingHistory) => {
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
  }
}
