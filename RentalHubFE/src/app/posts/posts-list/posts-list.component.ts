import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItemComponent } from './post-item/post-item.component';
import { PostItem } from './post-item/post-item.model';
import { Observable, Subscription } from 'rxjs';
import { PostService } from '../post.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  Pagination,
  PaginationService,
} from 'src/app/shared/pagination/pagination.service';
import { FormsModule } from '@angular/forms';

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
  priorities: String[];
}
@Component({
  standalone: true,
  imports: [SharedModule, PostItemComponent, FormsModule],
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit, OnDestroy {
  filterCriteria: FilterCriteria = {
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
    priorities: new Array<String>(),
  };

  isLoading: boolean = false;
  postList!: PostItem[];
  postListChangedSub: Subscription = new Subscription();

  currentPage: number = this.paginationService.currentPage;
  pageItemLimit: number = 10;
  totalPages!: number;
  constructor(
    private postService: PostService,
    private paginationService: PaginationService,
    private router: Router
  ) {
    this.resetFilter();
  }

  ngOnInit() {
    this.isLoading = true;
    this.currentPage = 1;

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
    // console.log(this.filterCriteria);
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
      priorities: new Array<String>(),
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

  applyFilter() {
    console.log('On applying filter...');
    this.isLoading = true;
    this.currentPage = 1;

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
    this.postService.getPostList(
      this.currentPage,
      this.pageItemLimit,
      this.filterCriteria
    );
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
