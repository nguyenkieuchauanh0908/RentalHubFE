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
  currentPage: number = 1;
  pageLimit: number = 5;
  totalPages: number = 0;
  currentPostStatus: number | null = null;
  currentSearchType: number = 0; //0: search bài viết, 1: search tài khoản

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
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('Authentication status checked');
        this.isAuthenticated = !!user;
        if (this.isAuthenticated) {
          console.log('User is authenticated');
          this.loadSocialPosts();
          this.initialized = true;
        }
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.scrollSubscription?.unsubscribe();
  }

  loadSocialPosts() {
    this.isLoading = true;
    this.forumService
      .getSocialPosts(
        this.currentPage,
        this.pageLimit,
        this.currentPostStatus,
        null
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.isLoading = false;
          this.currentPage = res.pagination.page;
          this.totalPages = res.pagination.total;
          if (!this.socialPostsToDisplay) {
            this.socialPostsToDisplay = res.data;
          } else {
            this.socialPostsToDisplay = this.socialPostsToDisplay.concat(
              res.data
            );
          }
          setTimeout(() => {
            if (this.currentPage < this.totalPages) {
              console.log('Maintain scroll position');
              this.renderer.setProperty(
                this.forumSearchResultContainer.nativeElement,
                'scrollTop',
                this.currentScrollTopPosition
              );
              this.currentScrollTopPosition =
                this.forumSearchResultContainer.nativeElement.scrollTop + 2000;
            }
          }, 100);
        }
      });
  }

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
    if (
      element.scrollTop >= this.currentScrollTopPosition &&
      !this.isLoading &&
      this.currentPage < this.totalPages
    ) {
      this.currentPage++;
      if (this.initialized) {
        if (this.currentSearchType === 0) {
          // this.loadSocialPosts();
        } else {
          //loadAccounts()
        }
      }
    }
  }

  changeSearchType(type: number): void {
    switch (type) {
      case 0:
        console.log('Search posts....');
        this.currentSearchType = 0;
        //Call API
        break;
      case 1:
        //Call API
        console.log('Search accounts....');
        this.currentSearchType = 1;
        break;

      default:
    }
    // this.currentPage = 1;
    // this.dataSource = null;
    // this.hostService
    //   .getActiveHostByRequests(
    //     this.currentHostReqStatus,
    //     this.currentPage,
    //     this.pageItemLimit
    //   )
    //   .subscribe(
    //     (res) => {
    //       if (res.data) {
    //         this.dataSource = res.data;
    //         this.totalPages = res.pagination.total;
    //       }
    //       this.isLoading = false;
    //     },
    //     (errMsg) => {
    //       this.isLoading = false;
    //     }
    //   );
  }
}
