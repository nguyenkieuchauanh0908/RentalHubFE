import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItemComponent } from './post-item/post-item.component';
import { PostItem } from './post-item/post-item.model';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { PostService } from '../post.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { FormsModule } from '@angular/forms';
import { PostCardComponent } from '../post-card/post-card.component';
import { User } from 'src/app/auth/user.model';
import { AccountService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';

export interface Range {
  max: number;
  min: number;
}

export interface PriceRanges {
  priceRange: Range;
  electricRanges: Range;
  waterRange: Range;
}

export interface PriceCriteria {
  lowToHigh: boolean;
  highToLow: boolean;
  greaterThan: number;
  lowerThan: number;
  checked: boolean;
}

export interface FilterCriteria {
  roomPrice: PriceCriteria;
  electricityPrice: PriceCriteria;
  waterPrice: PriceCriteria;
  range: PriceRanges;
  priorities: String[];
}
@Component({
  standalone: true,
  imports: [SharedModule, PostItemComponent, FormsModule, PostCardComponent],
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit, OnDestroy {
  backgroundImages = [
    '../../../assets/images/background_3.jpg',
    '../../../assets/images/background_2.jpg',
    '../../../assets/images/background_1.jpg',
  ];
  imageIndex = 0;
  filterCriteria!: FilterCriteria;
  priceRanges!: PriceRanges;

  currentFavourites: String[] | null = [];

  isLoading: boolean = false;
  postList!: PostItem[];
  postListChangedSub: Subscription = new Subscription();
  currentPage: number = this.paginationService.currentPage;
  pageItemLimit: number = 16;
  totalPages!: number;
  $destroy: Subject<boolean> = new Subject<boolean>();
  currentUser: User | null = null;
  typeOfLogin: number = 0;
  private fragment: string = '';
  constructor(
    private postService: PostService,
    private paginationService: PaginationService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.resetFilter();
    this.route.fragment.subscribe((fragment) => {
      this.fragment = fragment!;
    });
    this.isLoading = true;
    this.currentPage = 1;

    this.authService.getTypeOfLogin.subscribe((type) => {
      //Đăng nhập bằng GG
      if (type === 1) {
        console.log('On getting user identity in case loggin in with GG');
        this.authService
          .getUserGmailLoginIdentity()
          .pipe(takeUntil(this.$destroy))
          .subscribe((res) => {
            if (res.data) {
              this.accountService.getCurrentUser
                .pipe(takeUntil(this.$destroy))
                .subscribe((user) => {
                  console.log(
                    '🚀 ~ PostsListComponent ~ .subscribe ~ user:',
                    user
                  );
                  if (!user) {
                    console.log('Login with GG failed...');
                    this.router.navigate(['/auth/login']);
                  } else {
                    this.currentUser = user;
                    this.postService
                      .getPostList(
                        this.currentPage,
                        this.pageItemLimit,
                        this.filterCriteria
                      )
                      .subscribe((res) => {
                        this.priceRanges = res.data[res.data.length - 1];
                      });

                    this.postService.postListChanged.subscribe(
                      (posts: any[]) => {
                        this.postList = [...posts];
                        this.isLoading = false;
                      }
                    );

                    this.paginationService.paginationChanged.subscribe(
                      (pagination: Pagination) => {
                        this.totalPages = pagination.total;
                      }
                    );

                    this.postService.getCurrentFavoritesId.subscribe(
                      (favourites) => {
                        this.currentFavourites = favourites;
                      }
                    );
                  }
                });
            }
          });
      }

      //Đăng nhập bình thường
      else if (type === 0) {
        console.log('On getting user identity in case loggin in normally');
        this.postService
          .getPostList(
            this.currentPage,
            this.pageItemLimit,
            this.filterCriteria
          )
          .subscribe((res) => {
            this.priceRanges = res.data[res.data.length - 1];
          });

        this.postService.postListChanged.subscribe((posts: any[]) => {
          this.postList = [...posts];
          this.isLoading = false;
        });

        this.paginationService.paginationChanged.subscribe(
          (pagination: Pagination) => {
            this.totalPages = pagination.total;
          }
        );

        this.postService.getCurrentFavoritesId.subscribe((favourites) => {
          this.currentFavourites = favourites;
        });
      }
    });
  }

  navigateNextSilderImage(next: boolean) {
    let maxIndex = this.backgroundImages.length - 1;
    if (next) {
      if (this.imageIndex < maxIndex) {
        this.imageIndex = this.imageIndex + 1;
      } else {
        this.imageIndex = 0;
      }
    } else {
      if (this.imageIndex === 0) {
        this.imageIndex = maxIndex;
      } else {
        this.imageIndex = this.imageIndex - 1;
      }
    }
  }

  forceNavigate(name: string) {
    console.log('forceNavigate', name);
    this.router.navigate(['/posts'], { fragment: name });
  }

  ngOnDestroy() {
    this.postListChangedSub.unsubscribe();
  }

  checkPriceFilter(checked: boolean, type: string, criteria: string) {
    if (checked === true) {
      switch (type) {
        case 'roomPrice':
          this.filterCriteria.roomPrice.checked = true;
          this.filterCriteria.priorities.push('rental');
          if (criteria === 'lowToHigh') {
            this.filterCriteria.roomPrice.highToLow = !checked;
          } else {
            this.filterCriteria.roomPrice.lowToHigh = !checked;
          }
          break;
        case 'electricityPrice':
          this.filterCriteria.electricityPrice.checked = true;
          this.filterCriteria.priorities.push('electric');
          if (criteria === 'lowToHigh') {
            this.filterCriteria.electricityPrice.highToLow = !checked;
          } else {
            this.filterCriteria.electricityPrice.lowToHigh = !checked;
          }
          break;
        case 'waterPrice':
          this.filterCriteria.waterPrice.checked = true;
          this.filterCriteria.priorities.push('water');
          if (criteria === 'lowToHigh') {
            this.filterCriteria.waterPrice.highToLow = !checked;
          } else {
            this.filterCriteria.waterPrice.lowToHigh = !checked;
          }
          break;
        default:
      }
    } else {
      switch (type) {
        case 'roomPrice':
          if (this.filterCriteria.roomPrice.checked) {
            this.filterCriteria.roomPrice.checked = false;
            this.filterCriteria.priorities =
              this.filterCriteria.priorities.filter(
                (priority) => priority !== 'rental'
              );
          }
          break;
        case 'electricityPrice':
          if (this.filterCriteria.electricityPrice.checked) {
            this.filterCriteria.electricityPrice.checked = false;
            this.filterCriteria.priorities =
              this.filterCriteria.priorities.filter(
                (priority) => priority !== 'electric'
              );
          }
          break;
        case 'waterPrice':
          if (this.filterCriteria.waterPrice.checked) {
            this.filterCriteria.waterPrice.checked = false;
            this.filterCriteria.priorities =
              this.filterCriteria.priorities.filter(
                (priority) => priority !== 'water'
              );
          }
          break;
        default:
      }
    }
    console.log(this.filterCriteria);
  }

  resetFilter() {
    this.filterCriteria = {
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

    this.priceRanges = {
      priceRange: { max: 10000000000, min: 100000 },
      electricRanges: { max: 10000000000, min: 100000 },
      waterRange: { max: 10000000000, min: 100000 },
    };

    this.postService.getPostList(
      this.currentPage,
      this.pageItemLimit,
      this.filterCriteria
    );
    this.isLoading = false;

    this.postService.postListChanged.subscribe((posts: PostItem[]) => {
      this.postList = posts;
      this.isLoading = false;
    });

    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }

  sliderValueChanged(value: any, type: string, from: boolean) {
    if (from === true) {
      switch (type) {
        case 'roomPrice':
          this.filterCriteria.range.priceRange.min = value;
          break;
        case 'electricityPrice':
          this.filterCriteria.range.electricRanges.min = value;
          break;
        case 'waterPrice':
          this.filterCriteria.range.waterRange.min = value;
          break;
        default:
      }
    } else {
      switch (type) {
        case 'roomPrice':
          this.filterCriteria.range.priceRange.max = value;
          break;
        case 'electricityPrice':
          this.filterCriteria.range.electricRanges.max = value;
          break;
        case 'waterPrice':
          this.filterCriteria.range.waterRange.max = value;

          break;
        default:
      }
    }
    console.log(
      '🚀 ~ PostsListComponent ~ sliderValueChanged ~ this.filterCriteria.range:',
      this.filterCriteria.range
    );
  }

  applyFilter() {
    console.log('On applying filter...');
    console.log(this.filterCriteria.range);
    this.isLoading = true;
    this.currentPage = 1;

    this.postService
      .getPostList(this.currentPage, this.pageItemLimit, this.filterCriteria)
      .subscribe((res) => {
        if (res.data) {
          this.priceRanges = res.data[res.data.length - 1];
        }
      });
    this.isLoading = false;

    this.postService.postListChanged.subscribe((posts: PostItem[]) => {
      this.postList = posts;
      this.isLoading = false;
    });

    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
      }
    );
  }

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
    this.isLoading = true;
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
      .getPostList(this.currentPage, this.pageItemLimit, this.filterCriteria)
      .subscribe((res) => {
        if (res.data) {
          this.priceRanges = res.data[res.data.length - 1];
        }
      });
    this.postListChangedSub = this.postService.postListChanged.subscribe(
      (posts: PostItem[]) => {
        this.postList = posts;
        this.isLoading = false;
      }
    );
    this.router.navigate(['/posts'], {
      queryParams: { page: this.currentPage },
    });
  }
}
