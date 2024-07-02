import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { HostProfile } from '../host.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-host-posting-history',
  templateUrl: './host-posting-history.component.html',
  styleUrls: ['./host-posting-history.component.scss'],
})
export class HostPostingHistoryComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject();
  hostProfile: HostProfile = {
    email: '',
    fname: '',
    lname: '',
    phone: '',
    avatar: '',
    id: '',
  };
  favoredPosts!: String[] | null | any[];
  isLoading = false;
  error: string = '';
  stateData: any;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  seeMyProfile = false;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = this.paginationService.currentPage;
  pageItemLimit: number = 5;

  currentActiveStatus = {
    status: 4, //All posts
    data: this.historyPosts,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private paginationService: PaginationService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.currentPage = 1;
    this.currentUid = '';
    this.currentUid = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    if (this.currentUid) {
      this.postService.getCurrentFavoritesId
        .pipe(takeUntil(this.$destroy))
        .subscribe((favourites) => {
          this.favoredPosts = favourites;
        });
      this.postService
        .getPostsHistoryOfAUser(this.currentUid, 1, 5)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          this.historyPosts = res.data;
          this.hostProfile.fname = res.data[0].authorFName;
          this.hostProfile.lname = res.data[0].authorLName;
          this.hostProfile.id = res.data[0].authorId;
          this.hostProfile.avatar = res.data[0].avatarAuthor;
          this.hostProfile.phone = res.data[0].phoneNumber;
          this.hostProfile.email = res.data[0].authorEmail;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
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

    if (this.currentUid) {
      this.postService
        .getPostsHistoryOfAUser(this.currentUid, this.currentPage, 5)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            window.scrollTo(0, 0); // Scrolls the page to the top
            this.historyPosts = res.data;
            this.totalPages = res.pagination.total;
          } else {
            this.historyPosts = [];
          }
        });
    }
  }

  goToPost(id: string) {
    if (id) {
      this.router.navigate(['/posts/', id]);
    } else {
      this.notifierService.notify(
        'error',
        'Xảy ra lỗi trong quá trình điều hướng!'
      );
    }
  }

  addOrRemovePostToFavorites(postId: string, add: boolean) {
    this.postService
      .createFavorite(postId)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            if (add) {
              this.notifierService.notify(
                'success',
                'Thêm bài viết yêu thích thành công!'
              );
            } else {
              this.notifierService.notify(
                'success',
                'Bỏ yêu thích bài viết thành công!'
              );
            }
          }
        },
        (errMsg) => {
          this.notifierService.notify(
            'error',
            'Đã có lỗi xảy ra, chúng tôi sẽ sớm khắc phục!'
          );
        }
      );
  }
}
