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
}

export interface FilterCriteria {
  roomPrice: PriceCriteria;
  electricityPrice: PriceCriteria;
  waterPrice: PriceCriteria;
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
    roomPrice: { lowToHigh: false, highToLow: false },
    electricityPrice: { lowToHigh: false, highToLow: false },
    waterPrice: { lowToHigh: false, highToLow: false },
  };

  isLoading: boolean = false;
  postList!: PostItem[];
  postListChangedSub: Subscription = new Subscription();

  currentPage: number = this.paginationService.currentPage;
  pageItemLimit: number = 10;
  totalPages: number = this.paginationService.pagination?.total;
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

    this.postService.getPostList(this.currentPage, this.pageItemLimit);
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
          if (criteria === 'lowToHigh') {
            this.filterCriteria.roomPrice.highToLow = !checked;
          } else {
            this.filterCriteria.roomPrice.lowToHigh = !checked;
          }
          break;
        case 'electricityPrice':
          if (criteria === 'lowToHigh') {
            this.filterCriteria.electricityPrice.highToLow = !checked;
          } else {
            this.filterCriteria.electricityPrice.lowToHigh = !checked;
          }
          break;
        case 'waterPrice':
          if (criteria === 'lowToHigh') {
            this.filterCriteria.waterPrice.highToLow = !checked;
          } else {
            this.filterCriteria.waterPrice.lowToHigh = !checked;
          }
          break;
        default:
      }
    }
  }

  resetFilter() {
    this.filterCriteria = {
      roomPrice: { lowToHigh: false, highToLow: false },
      electricityPrice: { lowToHigh: false, highToLow: false },
      waterPrice: { lowToHigh: false, highToLow: false },
    };
  }

  applyFilter() {
    console.log('On applying filter...');
  }

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(position: number) {
    this.isLoading = true;
    console.log(this.currentPage);
    this.currentPage = this.paginationService.navigatePage(
      position,
      this.currentPage
    );
    this.postService.getPostList(this.currentPage, this.pageItemLimit);
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
