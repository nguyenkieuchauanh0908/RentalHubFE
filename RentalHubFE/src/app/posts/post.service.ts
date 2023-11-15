import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { PostItem } from './posts-list/post-item/post-item.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import {
  Pagination,
  PaginationService,
} from '../shared/pagination/pagination.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  postListChanged = new Subject<PostItem[]>();
  posts: PostItem[] = [];

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService
  ) {}

  getPostList(page: number, limit: number) {
    const queryParams = { page: page, limit: limit };
    this.http
      .get<resDataDTO>(environment.baseUrl + 'posts', {
        params: queryParams,
      })
      .pipe(
        //    catchError(),
        tap((res) => {
          this.posts = res.data;
          this.paginationService.pagination = res.data.pagination;
          this.paginationService.paginationChanged.next(res.pagination);
          this.postListChanged.next([...this.posts]);
        })
      )
      .subscribe();

    return this.posts.slice();
  }

  getPostItem(postId: string): PostItem | undefined {
    return this.posts.find((post) => post._id === postId);
  }
}
