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
import {
  Subject,
  takeUntil,
  Subscription,
  fromEvent,
  throttleTime,
} from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ForumService } from '../forum.service';
import 'moment/locale/vi';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { ForumPostModel } from '../forum-post/forum-post.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PostService } from 'src/app/posts/post.service';
import { FilterCriteria } from 'src/app/posts/posts-list/posts-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum-home',
  templateUrl: './forum-home.component.html',
  styleUrls: ['./forum-home.component.scss'],
})
export class ForumHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialPostContainer', { static: false })
  private socialPostContainer!: ElementRef;
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
  rentalPosts: PostItem[] | any[] = [];
  rentalFilterCriteria!: FilterCriteria;
  currentFavourites: String[] | null = [];

  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private notifier: NotifierService,
    private postService: PostService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    console.log('forum-home component ngAfterViewInit');
    setTimeout(() => {
      this.initializeScrollEvent();
    }, 100);
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.isLoading = true;
    this.currentScrollTopPosition = 0;
    this.initialized = false;
    this.moment = moment;
    this.moment.locale('vn');
    this.currentPostStatus = null;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('Authentication status checked');
        this.isAuthenticated = !!user;
        if (this.isAuthenticated) {
          console.log('User is authenticated');
          this.getFavoritePostId();
          this.loadSocialPosts();
          this.getRentalPosts();
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
                this.socialPostContainer.nativeElement,
                'scrollTop',
                this.currentScrollTopPosition
              );
              this.currentScrollTopPosition =
                this.socialPostContainer.nativeElement.scrollTop + 2000;
            }
          }, 100);
        }
      });
  }

  initializeScrollEvent() {
    if (this.socialPostContainer) {
      console.log('socialPostContainer is ready');
      this.attachScrollEvent();
    } else {
      console.error('socialPostContainer is still not ready');
      // Retry attaching the event after a slight delay
      setTimeout(() => this.initializeScrollEvent(), 100);
    }
  }

  attachScrollEvent() {
    console.log(' before attachScrollEvent');
    if (this.socialPostContainer) {
      console.log('Attaching scroll event listener');
      this.scrollSubscription = fromEvent(
        this.socialPostContainer.nativeElement,
        'scroll'
      )
        .pipe(throttleTime(200))
        .subscribe(() => this.onScroll());
    }
  }

  onScroll() {
    console.log('Scroll event detected');
    const element = this.socialPostContainer!.nativeElement;
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
        this.loadSocialPosts();
      }
    }
  }

  changePostStatus($event: any) {
    console.log('🚀 ~ ForumHomeComponent ~ changePostStatus ~ $event:', $event);
    this.forumService.changeSocialPostStatus($event.pId).subscribe((res) => {
      if (res.data) {
        this.isLoading = false;
        this.notifier.notify('success', 'Cập nhật trạng thái thành công');
        if ($event.status === 1) {
          if (this.socialPostContainer) {
            this.socialPostsToDisplay = this.socialPostsToDisplay!.filter(
              (post) => post._id !== $event.pId
            );
          }
        }
      }
    });
  }

  getFavoritePostId() {
    this.postService.getCurrentFavoritesId.subscribe((favourites) => {
      this.currentFavourites = favourites;
    });
  }

  setRentalFiltterCriteria() {
    this.rentalFilterCriteria = {
      roomPrice: {
        lowToHigh: false,
        highToLow: false,
        greaterThan: 0,
        lowerThan: 10000000,
        checked: false,
      },
      electricityPrice: {
        lowToHigh: false,
        highToLow: false,
        greaterThan: 0,
        lowerThan: 10000000,
        checked: false,
      },
      waterPrice: {
        lowToHigh: false,
        highToLow: false,
        greaterThan: 0,
        lowerThan: 10000000,
        checked: false,
      },
      range: {
        priceRange: { max: 10000000000, min: 100000 },
        electricRanges: { max: 10000000000, min: 100000 },
        waterRange: { max: 10000000000, min: 100000 },
      },
      priorities: new Array<String>(),
    };
  }

  getRentalPosts() {
    this.isLoading = true;
    this.setRentalFiltterCriteria();
    if (this.rentalFilterCriteria) {
      this.postService
        .getPostList(1, 5, this.rentalFilterCriteria)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.postService.postListChanged.subscribe((posts: any[]) => {
                console.log(
                  '🚀 ~ ForumHomeComponent ~ this.postService.postListChanged.subscribe ~ posts:',
                  posts
                );
                this.rentalPosts = [...posts];
                this.isLoading = false;
              });
              console.log(
                '🚀 ~ ForumHomeComponent ~ this.postService.postListChanged.subscribe ~ this.rentalPosts:',
                this.rentalPosts
              );
            }
          },
          (err) => {
            this.isLoading = false;
          }
        );
    }
  }

  toRentalPosts() {
    this.router.navigate(['']);
  }
}
