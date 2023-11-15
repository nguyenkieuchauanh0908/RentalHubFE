import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class PaginationService {
  paginationChanged: Subject<Pagination> = new Subject<Pagination>();
  pagination!: Pagination;
  currentPage: number = 1;

  constructor(private currentRoute: ActivatedRoute, private router: Router) {}

  getCurrentPageIndex() {
    this.currentRoute.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      }
    });
    return this.currentPage;
  }

  navigatePage(position: number) {
    this.getCurrentPageIndex();
    if (position > 0 || position < 0) {
      this.currentPage = this.currentPage + position;
    }
    return this.currentPage;
  }
}
