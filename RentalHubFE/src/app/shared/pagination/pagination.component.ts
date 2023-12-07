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
  @Output() toPrevPage: EventEmitter<number> = new EventEmitter();
  @Output() toNextPage: EventEmitter<number> = new EventEmitter();

  currentPageChangedSub: Subscription = new Subscription();
  reachPrevPaginationLimit: boolean = false;
  reachNextPaginationLimit: boolean = false;
  currentPage: number = 1;

  constructor(private paginationService: PaginationService) {}

  ngOnInit() {
    console.log('On getting current page index from param...');
    this.currentPage = this.paginationService.getCurrentPageIndexFromParam();
    console.log('Current page: ' + this.currentPage);
  }

  ngOnDestroy(): void {
    this.currentPageChangedSub.unsubscribe();
  }

  prevPage() {
    this.currentPage = this.paginationService.currentPage;
    this.reachPrevPaginationLimit = false;
    if (this.totalPages && this.currentPage === 1) {
      this.reachPrevPaginationLimit = true;
      console.log('prev pagination limit: ', this.reachPrevPaginationLimit);
    } else {
      if (this.reachPrevPaginationLimit === false) {
        this.toPrevPage.emit(-1);
        this.currentPage -= 1;
      }
      console.log(
        'total page: ' + this.totalPages,
        ', current page: ' + this.currentPage
      );
    }
  }

  nextPage() {
    this.currentPage = this.paginationService.currentPage;
    this.reachNextPaginationLimit = false;
    if (this.totalPages && this.currentPage === this.totalPages) {
      this.reachNextPaginationLimit = true;
      console.log('next pagination limit: ', this.reachNextPaginationLimit);
    } else {
      if (this.reachNextPaginationLimit === false) {
        this.toNextPage.emit(1);
        this.currentPage += 1;
      }
    }
    console.log(
      'total page: ' + this.totalPages,
      ', current page: ' + this.currentPage
    );
  }
}
