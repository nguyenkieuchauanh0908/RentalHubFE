import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Output() toPrevPage: EventEmitter<number> = new EventEmitter();
  @Output() toNextPage: EventEmitter<number> = new EventEmitter();
  @Output() toFirstPage: EventEmitter<boolean> = new EventEmitter();
  @Output() toLastPage: EventEmitter<boolean> = new EventEmitter();

  currentPageChangedSub: Subscription = new Subscription();
  reachPrevPaginationLimit: boolean = false;
  reachNextPaginationLimit: boolean = false;

  constructor(private paginationService: PaginationService) {}

  ngOnInit() {
    console.log('Current page: ' + this.currentPage);
    console.log('🚀 ~ PaginationComponent ~ totalPages:', this.totalPages);
  }

  ngOnDestroy(): void {
    this.currentPageChangedSub.unsubscribe();
  }

  prevPage() {
    this.reachPrevPaginationLimit = false;
    if (this.totalPages && this.currentPage === 1) {
      this.reachPrevPaginationLimit = true;
      // console.log('prev pagination limit: ', this.reachPrevPaginationLimit);
    } else {
      if (this.reachPrevPaginationLimit === false) {
        this.toPrevPage.emit(-1);
        this.currentPage -= 1;
      }
      this.paginationService.pagination.page = this.currentPage;
      console.log(
        'total page: ' + this.totalPages,
        ', current page: ' + this.currentPage
      );
    }
  }

  nextPage() {
    this.reachNextPaginationLimit = false;
    if (this.totalPages && this.currentPage === this.totalPages) {
      this.reachNextPaginationLimit = true;
      // console.log('next pagination limit: ', this.reachNextPaginationLimit);
    } else {
      if (this.reachNextPaginationLimit === false) {
        this.toNextPage.emit(1);
        this.currentPage += 1;
      }
    }
    this.paginationService.pagination.page = this.currentPage;
    console.log('AAAA');
    console.log(
      'total page: ' + this.totalPages,
      ', current page: ' + this.currentPage
    );
  }

  firstPage() {
    this.toFirstPage.emit(true);
  }
  lastPage() {
    this.toLastPage.emit(true);
  }
}
