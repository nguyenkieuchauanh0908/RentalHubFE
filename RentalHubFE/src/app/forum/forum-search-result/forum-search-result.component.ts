import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import {
  Subscription,
  Subject,
  takeUntil,
  fromEvent,
  throttleTime,
} from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ForumPostModel } from '../forum-post/forum-post.model';
import { ForumService } from '../forum.service';
import { Pagination } from 'src/app/shared/pagination/pagination.service';

@Component({
  selector: 'app-forum-search-result',
  templateUrl: './forum-search-result.component.html',
  styleUrls: ['./forum-search-result.component.scss'],
})
export class ForumSearchResultComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('forumSearchResultContainer', { static: false })
  private forumSearchResultContainer!: ElementRef;
  scrollSubscription: Subscription | undefined;
  currentScrollTopPosition: number = 0;
  moment!: any;
  isLoading = false;
  initialized: boolean = false;
  $destroy: Subject<Boolean> = new Subject();
  isAuthenticated: boolean = false;
  socialPostsToDisplay: ForumPostModel[] | null = null;
  searchResult!: ForumPostModel[] | any[] | null;
  currentKeyword: string | null = null;
  postsPagination!: Pagination;
  accountPagination!: Pagination;
  currentPageOfAccountResult: number = 1;
  pageLimit: number = 10;
  totalPages: number = 0;
  currentPostStatus: number | null = null;
  currentSearchType: number = 0; //0: search bài viết, 1: search tài khoản
  currentSearchPostsResult: ForumPostModel[] | null = null;
  currentSearchAccountsResult: any[] | null = null;

  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private notifier: NotifierService
  ) {}
  ngAfterViewInit(): void {
    console.log('forum-search component ngAfterViewInit');
    setTimeout(() => {
      this.initializeScrollEvent();
    }, 100);
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.isLoading = true;
    this.currentScrollTopPosition = 0;
    this.initialized = false;
    this.moment = moment;
    this.moment.locale('vn');
    this.currentPostStatus = null;
    this.currentSearchType = 0;
    this.resetPagination();
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('Authentication status checked');
        this.isAuthenticated = !!user;
        if (this.isAuthenticated) {
          console.log('User is authenticated');
          let stateData: {
            searchResult: ForumPostModel[] | null;
            pagination: Pagination;
            keyword: string;
          } = history.state;
          if (stateData) {
            this.currentSearchPostsResult = stateData.searchResult;
            this.currentKeyword = stateData.keyword;
            this.postsPagination = stateData.pagination;
          }
          this.forumService.getCurrentKeyword
            .pipe(takeUntil(this.$destroy))
            .subscribe((keyword) => {
              if (keyword) {
                this.currentKeyword = keyword;
                this.resetSearchResults();
                this.resetPagination();
                this.loadSearchResults(
                  this.postsPagination.page + 1,
                  this.postsPagination.total
                );
              }
            });
          // this.forumService.getCurrentSearchResultPosts
          //   .pipe(takeUntil(this.$destroy))
          //   .subscribe((posts) => {
          //     if (posts) {
          //       if (this.currentSearchPostsResult) {
          //         this.currentSearchPostsResult =
          //           this.currentSearchPostsResult.concat(posts);
          //       } else {
          //         this.currentSearchPostsResult = posts;
          //       }
          //     }
          //   });
          // this.forumService.getCurrentSearchResultAccounts
          //   .pipe(takeUntil(this.$destroy))
          //   .subscribe((accounts) => {
          //     if (accounts) {
          //       if (this.currentSearchAccountsResult) {
          //         this.currentSearchAccountsResult =
          //           this.currentSearchAccountsResult.concat(accounts);
          //       } else {
          //         this.currentSearchAccountsResult = accounts;
          //       }
          //     }
          //   });
          // this.forumService.getCurrentSearchResultPostPagination
          //   .pipe(takeUntil(this.$destroy))
          //   .subscribe((pagination) => {
          //     if (pagination) {
          //       if (pagination) {
          //         this.postsPagination.page = pagination.page;
          //         this.postsPagination.total = pagination.total;
          //       }
          //     }
          //   });

          // this.forumService.getCurrentSearchResultAccountPagination
          //  .pipe(takeUntil(this.$destroy))
          //   .subscribe((pagination) => {
          //     if (pagination) {
          //       this.accountPagination.page = pagination.page;
          //       this.accountPagination.total = pagination.total;
          //     }
          //   });
          this.initialized = true;
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called xxxx');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.scrollSubscription?.unsubscribe();
  }

  resetPagination() {
    this.postsPagination = {
      page: 0,
      total: 1,
      limit: this.pageLimit,
    };
    this.accountPagination = {
      page: 0,
      total: 1,
      limit: this.pageLimit,
    };
  }

  resetSearchResults() {
    this.currentSearchAccountsResult = null;
    this.currentSearchPostsResult = null;
  }

  // loadSocialPosts() {
  //   this.isLoading = true;
  //   this.forumService
  //     .getSocialPosts(
  //       this.currentPage,
  //       this.pageLimit,
  //       this.currentPostStatus,
  //       null
  //     )
  //     .pipe(takeUntil(this.$destroy))
  //     .subscribe((res) => {
  //       if (res.data) {
  //         this.isLoading = false;
  //         this.currentPage = res.pagination.page;
  //         this.totalPages = res.pagination.total;
  //         if (!this.socialPostsToDisplay) {
  //           this.socialPostsToDisplay = res.data;
  //         } else {
  //           this.socialPostsToDisplay = this.socialPostsToDisplay.concat(
  //             res.data
  //           );
  //         }
  //         setTimeout(() => {
  //           if (this.currentPage < this.totalPages) {
  //             console.log('Maintain scroll position');
  //             this.renderer.setProperty(
  //               this.forumSearchResultContainer.nativeElement,
  //               'scrollTop',
  //               this.currentScrollTopPosition
  //             );
  //             this.currentScrollTopPosition =
  //               this.forumSearchResultContainer.nativeElement.scrollTop + 2000;
  //           }
  //         }, 100);
  //       }
  //     });
  // }

  initializeScrollEvent() {
    if (this.forumSearchResultContainer) {
      console.log('forumSearchResultContainer is ready');
      this.attachScrollEvent();
    } else {
      console.error('forumSearchResultContainer is still not ready');
      // Retry attaching the event after a slight delay
      setTimeout(() => this.initializeScrollEvent(), 100);
    }
  }

  attachScrollEvent() {
    console.log(' before attachScrollEvent');
    if (this.forumSearchResultContainer) {
      console.log('Attaching scroll event listener');
      this.scrollSubscription = fromEvent(
        this.forumSearchResultContainer.nativeElement,
        'scroll'
      )
        .pipe(throttleTime(200))
        .subscribe(() => this.onScroll());
    }
  }

  onScroll() {
    console.log('Scroll event detected');
    const element = this.forumSearchResultContainer!.nativeElement;
    console.log(
      '🚀 ~ onScroll ~ element:',
      element.scrollTop,
      this.currentScrollTopPosition
    );
    // if (
    //   element.scrollTop >= this.currentScrollTopPosition &&
    //   !this.isLoading &&
    //   this.currentPage < this.totalPages
    // ) {
    //   this.currentPage++;
    //   if (this.initialized) {
    //     if (this.currentSearchType === 0) {
    //       // this.loadSocialPosts();
    //     } else {
    //       //loadAccounts()
    //     }
    //   }
    // }
  }

  changeSearchType(type: number): void {
    console.log('changeSearchType...');
    let currentPage = 0;
    let totalPages = 1;
    switch (type) {
      case 0:
        console.log('Search posts....');
        this.currentSearchType = 0;
        currentPage = this.postsPagination.page + 1;
        totalPages = this.postsPagination.total;
        if (!this.currentSearchPostsResult) {
          this.loadSearchResults(totalPages, currentPage);
        }
        this.isLoading = false;
        break;
      case 1:
        console.log('Search accounts....');
        this.currentSearchType = 1;
        currentPage = this.accountPagination.page + 1;
        totalPages = this.accountPagination.total;
        if (!this.currentSearchAccountsResult) {
          this.loadSearchResults(currentPage, totalPages);
        }
        this.isLoading = false;
        break;

      default:
        this.currentSearchType = 0;
        currentPage = this.postsPagination.page + 1;
        totalPages = this.postsPagination.total;
    }
  }

  loadSearchResults(currentPage: number, totalPages: number) {
    console.log(currentPage, totalPages, this.currentKeyword);
    this.isLoading = true;
    if (this.currentKeyword && currentPage <= totalPages) {
      this.forumService
        .searchByKeyword(
          this.currentKeyword,
          this.currentSearchType,
          currentPage,
          this.pageLimit
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              if (this.currentSearchType === 0) {
                this.postsPagination = res.pagination;
                if (this.currentSearchPostsResult) {
                  this.currentSearchPostsResult =
                    this.currentSearchPostsResult.concat(res.data);
                } else {
                  this.currentSearchPostsResult = null;
                  this.currentSearchPostsResult = res.data;
                }
              } else {
                this.accountPagination = res.pagination;
                if (this.currentSearchAccountsResult) {
                  this.currentSearchAccountsResult =
                    this.currentSearchAccountsResult.concat(res.data);
                } else {
                  this.currentSearchAccountsResult = null;
                  this.currentSearchAccountsResult = res.data;
                }
              }
            }
          },
          (err) => {
            this.isLoading = false;
            this.resetSearchResults();
            this.resetPagination();
          }
        );
    }
  }
}
