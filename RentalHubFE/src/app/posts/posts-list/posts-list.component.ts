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

@Component({
  standalone: true,
  imports: [SharedModule, PostItemComponent],
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit, OnDestroy {
  constructor(
    private postService: PostService,
    private paginationService: PaginationService,
    private router: Router
  ) {}

  isLoading: boolean = false;
  postList!: PostItem[];
  postListChangedSub: Subscription = new Subscription();

  currentPage: number = 1;
  pageItemLimit: number = 10;
  totalPages: number = this.paginationService.pagination?.total;

  ngOnInit() {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.postList = this.postService.posts;
    if (this.postList.length === 0) {
      this.postService.getPostList(this.currentPage, this.pageItemLimit);
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
    this.postService.postListChanged.subscribe((posts: PostItem[]) => {
      this.postList = posts;
      this.isLoading = false;
    });

    this.paginationService.paginationChanged.subscribe(
      (pagination: Pagination) => {
        this.totalPages = pagination.total;
        // console.log('Total pages: ' + this.totalPages);
      }
    );
    console.log(
      '🚀 ~ file: posts-list.component.ts:46 ~ PostsListComponent ~ this.postService.postListChanged.subscribe ~ this.isLoading:',
      this.isLoading
    );
  }

  ngOnDestroy() {
    this.postListChangedSub.unsubscribe();
  }

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(position: number) {
    this.isLoading = true;
    this.currentPage = this.paginationService.navigatePage(position);
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
