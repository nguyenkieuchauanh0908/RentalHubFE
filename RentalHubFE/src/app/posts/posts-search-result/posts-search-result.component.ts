import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  filter,
  map,
  takeUntil,
} from 'rxjs';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';
import {
  FilterCriteria,
  PriceRanges,
} from '../posts-list/posts-list.component';

@Component({
  selector: 'app-posts-search-result',
  templateUrl: './posts-search-result.component.html',
  styleUrls: ['./posts-search-result.component.scss'],
})
export class PostsSearchResultComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  $destroy: Subject<boolean> = new Subject();
  stateData: any;
  searchResult!: PostItem[] | null;
  searchResultChangedSub: Subscription = new Subscription();
  currentPage: number = this.paginationService.currentPage;
  pageItemLimit: number = 5;
  totalPages: number = this.paginationService.pagination?.total;
  currentKeyword: string = this.postService.searchKeyword;
  filterCriteria!: FilterCriteria;
  priceRanges!: PriceRanges;

  currentFavourites: String[] | null = [];
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private paginationService: PaginationService,
    private postService: PostService,
    private notifierService: NotifierService
  ) {}
  ngOnInit() {
    console.log('ngOnInit...');
    this.resetFilter();
    this.currentPage = 1;
    let stateData: {
      searchResult: PostItem[] | null;
      pagination: Pagination;
      keyword: string;
    } = history.state;
    if (stateData) {
      console.log(
        '🚀 ~ PostsSearchResultComponent ~ ngOnInit ~ stateData:',
        stateData
      );
      this.searchResult = stateData.searchResult;
    }
    this.postService.searchResultsChanged
      .pipe(takeUntil(this.$destroy))
      .subscribe((results) => {
        console.log(
          '🚀 ~ PostsSearchResultComponent ~ .subscribe ~ results:',
          results
        );
        this.searchResult = results;
      });
    this.postService.searchKeywordChanged
      .pipe(takeUntil(this.$destroy))
      .subscribe((keyword: string) => {
        this.currentKeyword = keyword;
        console.log(
          '🚀 ~ PostsSearchResultComponent ~ this.postService.searchKeywordChanged.subscribe ~ this.currentKeyword:',
          this.currentKeyword
        );
        this.paginationService.paginationChanged
          .pipe(takeUntil(this.$destroy))
          .subscribe((pagination) => {
            this.totalPages = pagination.total;
            this.currentPage = pagination.page;
          });
      });

    this.postService.getCurrentFavoritesId
      .pipe(takeUntil(this.$destroy))
      .subscribe((favourites) => {
        this.currentFavourites = favourites;
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  applyFilter() {
    console.log('On applying filter...');
    console.log(this.filterCriteria.range);
    this.isLoading = true;
    this.currentPage = 1;

    this.postService
      .searchPostsByKeyword(
        this.currentKeyword!,
        this.currentPage,
        this.pageItemLimit
      )
      .subscribe(
        (res) => {
          this.searchResult = res.data;
          this.paginationService.pagination = res.pagination;
          this.totalPages = res.pagination.total;
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          console.log(this.error);
          this.notifierService.hideAll();
          this.notifierService.notify('error', this.error);
        }
      );
    // this.searchResultChangedSub =
    //   this.postService.searchResultsChanged.pipe(takeUntil(this.$destroy)).subscribe(
    //     (searchResult: PostItem[]) => {
    //       this.searchResult = searchResult;
    //     }
    //   );
    // this.router.navigate(
    //   [
    //     '/posts/search',
    //     {
    //       keyword: this.currentKeyword,
    //     },
    //   ],
    //   {
    //     state: {
    //       searchResult: this.stateData.searchResult,
    //       pagination: this.stateData.pagination,
    //     },
    //   }
    // );
    this.isLoading = false;
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
      this.searchResult = posts;
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
    console.log('On changing page...');
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
      .searchPostsByKeyword(
        this.currentKeyword!,
        this.currentPage,
        this.pageItemLimit
      )
      .subscribe(
        (res) => {
          this.searchResult = res.data;
          this.paginationService.pagination = res.pagination;
          this.totalPages = res.pagination.total;
        },
        (errorMsg) => {
          this.isLoading = false;
          this.error = errorMsg;
          console.log(this.error);
          this.notifierService.hideAll();
          this.notifierService.notify('error', this.error);
        }
      );
    // this.searchResultChangedSub =
    //   this.postService.searchResultsChanged.pipe(takeUntil(this.$destroy)).subscribe(
    //     (searchResult: PostItem[]) => {
    //       this.searchResult = searchResult;
    //     }
    //   );
    // this.router.navigate(
    //   [
    //     '/posts/search',
    //     {
    //       keyword: this.currentKeyword,
    //     },
    //   ],
    //   {
    //     state: {
    //       searchResult: this.stateData.searchResult,
    //       pagination: this.stateData.pagination,
    //     },
    //   }
    // );
  }
}
