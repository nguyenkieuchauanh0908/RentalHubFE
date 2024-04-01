import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription, filter, map } from 'rxjs';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { PostService } from '../post.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-posts-search-result',
  templateUrl: './posts-search-result.component.html',
  styleUrls: ['./posts-search-result.component.scss'],
})
export class PostsSearchResultComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  currentState$: Observable<any> = new Observable<any>();
  stateData: any;
  searchResult!: PostItem[];
  searchResultChangedSub: Subscription = new Subscription();
  currentPage: number = 1;
  pageItemLimit: number = 5;
  totalPages: number = this.paginationService.pagination?.total;
  currentKeyword: string = this.postService.searchKeyword;
  ngOnInit() {
    this.searchResultChangedSub =
      this.postService.searchResultsChanged.subscribe(
        (searchResult: PostItem[]) => {
          this.searchResult = searchResult;
          console.log(
            '🚀 ~ file: posts-search-result.component.ts:35 ~ PostsSearchResultComponent ~ ngOnInit ~ this.currentPage:',
            this.currentPage
          );
          this.currentKeyword = this.postService.searchKeyword;
          this.totalPages = this.paginationService.pagination.total;
        }
      );
    this.postService.searchKeywordChanged.subscribe((keyword: string) => {
      this.currentKeyword = keyword;
    });
  }

  ngOnDestroy(): void {
    this.searchResultChangedSub.unsubscribe();
  }

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private paginationService: PaginationService,
    private postService: PostService,
    private notifierService: NotifierService
  ) {
    this.stateData = this.router.getCurrentNavigation()?.extras.state;
    this.searchResult = this.stateData.searchResult;
    if (this.stateData.searchResult && this.stateData.pagination) {
      this.searchResult = this.stateData.searchResult;
      this.paginationService.pagination = this.stateData.pagination;
      this.paginationService.paginationChanged.next(this.stateData.pagination);
      // this.currentPage = this.paginationService.pagination.page;
      console.log(
        '🚀 ~ file: posts-search-result.component.ts:63 ~ PostsSearchResultComponent ~ this.currentPage:',
        this.currentPage
      );
      this.currentKeyword = this.postService.searchKeyword;
      this.totalPages = this.paginationService.pagination.total;
    }
  }

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(position: number) {
    console.log('On changing page...');
    console.log('Your keyword is: ', this.currentKeyword);
    this.currentPage = this.paginationService.navigatePage(
      position,
      this.currentPage
    );
    console.log(
      '🚀 ~ file: posts-search-result.component.ts:80 ~ PostsSearchResultComponent ~ changeCurrentPage ~ this.currentPage:',
      this.currentPage
    );
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
    this.searchResultChangedSub =
      this.postService.searchResultsChanged.subscribe(
        (searchResult: PostItem[]) => {
          this.searchResult = searchResult;
        }
      );
    this.router.navigate(
      [
        '/posts/search',
        {
          keyword: this.currentKeyword,
          page: this.currentPage,
        },
      ],
      {
        state: {
          searchResult: this.stateData.searchResult,
          pagination: this.stateData.pagination,
        },
      }
    );
  }
}
