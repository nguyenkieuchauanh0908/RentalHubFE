import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

  postList!: PostItem[];
  postListChangedSub: Subscription = new Subscription();

  currentPage: number = 1;
  pageItemLimit: number = 5;
  totalPages: number = this.paginationService.pagination?.total;

  ngOnInit() {
    this.postList = this.postService.posts;
    if (this.postList.length === 0) {
      this.postService.getPostList(this.currentPage, this.pageItemLimit);
    }
    this.postService.postListChanged.subscribe((posts: PostItem[]) => {
      this.postList = posts;
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

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(position: number) {
    this.currentPage = this.paginationService.navigatePage(position);
    this.postService.getPostList(this.currentPage, this.pageItemLimit);
    this.postListChangedSub = this.postService.postListChanged.subscribe(
      (posts: PostItem[]) => {
        this.postList = posts;
      }
    );
    this.router.navigate(['/posts'], {
      queryParams: { page: this.currentPage },
    });
  }
}
