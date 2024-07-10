import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription, Observable, Subject, takeUntil } from 'rxjs';
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
export class FavoritePostsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject();
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  favoredPosts: PostItem[] | any = new Array<PostItem>();
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
    data: this.favoredPosts,
  };

  currentFavourites: String[] | null = [];

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    private paginationService: PaginationService,
    public dialog: MatDialog,
    private router: Router,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.isLoading = true;
    this.favoredPosts = [];
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.currentUid = user._id;
          this.myProfile = user;
          this.postService
            .getFavorites(1, this.pageItemLimit)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
              (res) => {
                this.postService.getCurrentFavorites.subscribe(
                  (postingHistory) => {
                    this.favoredPosts = postingHistory!;
                  }
                );
                this.paginationService.pagination = res.pagination;
                this.totalPages = res.pagination.total;
                this.isLoading = false;
              },
              (errorMsg) => {
                this.isLoading = false;
              }
            );
          this.postService.getCurrentFavoritesId
            .pipe(takeUntil(this.$destroy))
            .subscribe((favourites) => {
              this.currentFavourites = favourites;
            });
        }
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  toPostDetail(postId: String) {
    this.router.navigate(['/posts/', postId]);
  }

  toUnfavorPost(postId: String) {
    this.postService.getCurrentFavorites
      .pipe(takeUntil(this.$destroy))
      .subscribe((favorites) => {
        if (favorites) {
          favorites = favorites.filter((post) => {
            console.log(post._postId, postId);
            return String(post._postId) !== postId;
          });
          this.favoredPosts = favorites;
        }
      });
    this.postService
      .createFavorite(postId)
      .pipe(takeUntil(this.$destroy))
      .subscribe();
    this.postService
      .getFavorites(this.currentPage, this.pageItemLimit).pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            this.postService.getCurrentFavorites
              .pipe(takeUntil(this.$destroy))
              .subscribe((favorites) => {
                if (favorites) {
                  favorites = favorites.filter((post) => {
                    console.log(post._postId, postId);
                    return String(post._postId) !== postId;
                  });
                  this.favoredPosts = favorites;
                  this.notifier.notify(
                    'success',
                    'Bỏ thích bài viết thành công!'
                  );
                }
              });
          }

          this.paginationService.pagination = res.pagination;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        },
        (errorMsg) => {
          this.isLoading = false;
        }
      );
  }

  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
    this.isLoading = true;
    this.favoredPosts = [];
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

    this.postService
      .getFavorites(this.currentPage, this.pageItemLimit)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          window.scrollTo(0, 0); // Scrolls the page to the top
          this.favoredPosts = res.data;
          this.postService.getCurrentFavorites
            .pipe(takeUntil(this.$destroy))
            .subscribe((postingHistory) => {
              this.favoredPosts = postingHistory!;
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
