import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

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

  getCurrentPageIndexFromParam() {
    this.currentRoute.queryParams.subscribe((params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      }
    });
    return this.currentPage;
  }

  navigatePage(position: number, currentPage: number) {
    console.log('Position: ' + position);
    if (position > 0 || position < 0) {
      this.currentPage = currentPage + position;
      console.log(
        '🚀 ~ PaginationService ~ navigatePage ~ this.currentPage:',
        this.currentPage
      );
    }
    return this.currentPage;
  }
}
