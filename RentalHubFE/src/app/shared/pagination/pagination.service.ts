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

  caculateCurrentPage(position: number) {
    console.log('On caculating current page...');
    if (position > 0 || position < 0) {
      this.currentPage = this.currentPage + position;
    }
    console.log('Current page: ' + this.currentPage);
    return this.currentPage;
  }

  navigatePage(position: number) {
    this.getCurrentPageIndexFromParam();
    if (position > 0 || position < 0) {
      this.currentPage = this.currentPage + position;
    }
    return this.currentPage;
  }
}
