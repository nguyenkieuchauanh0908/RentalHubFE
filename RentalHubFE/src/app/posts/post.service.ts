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
import { handleError } from '../shared/handle-errors';
import { NotifierService } from 'angular-notifier';

@Injectable({ providedIn: 'root' })
export class PostService {
  postListChanged = new Subject<PostItem[]>();
  posts: PostItem[] = [];
  searchResultsChanged = new Subject<PostItem[]>();
  searchResult: PostItem[] = [];
  searchKeyword: string = '';
  searchKeywordChanged = new Subject<string>();

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService,
    private notifierService: NotifierService
  ) {}

  getPostList(page: number, limit: number) {
    const queryParams = { page: page, limit: limit };
    this.http
      .get<resDataDTO>(environment.baseUrl + 'posts', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap(
          (res) => {
            this.posts = res.data;
            this.paginationService.pagination = res.data.pagination;
            this.paginationService.paginationChanged.next(res.pagination);
            this.postListChanged.next([...this.posts]);
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      )
      .subscribe();

    return this.posts.slice();
  }

  getPostItem(postId: string) {
    console.log('On getting post detail with postId: ' + postId);
    let queryParams = new HttpParams().append('postId', postId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-post', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  createPost(form: any, images: FileList, selectedTags: any) {
    let tags = ['65167b55baf1f2214d5f7994', '65167b7bbaf1f2214d5f7995'];
    let body = new FormData();

    body.append('_title', form.title);
    body.append('_desc', form.description);
    body.append('_content', form.content);
    body.append('_street', form.street);
    body.append('_district', form.district);
    body.append('_area', form.area);
    body.append('_price', form.renting_price);
    body.append('_electricPrice', form.electric);
    body.append('_waterPrice', form.water_price);
    body.append('_tags', selectedTags);
    body.append('_services', form.services);
    body.append('_ultilities', form.ultilities);
    const numberOfImages = images.length;
    for (let i = 0; i < numberOfImages; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(images[i]);
      body.append('_images', images[i]);
    }
    for (let tag of tags) {
      body.append('_tags', tag);
    }

    return this.http
      .post<resDataDTO>(environment.baseUrl + 'posts/create-post', body)
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Created post successfully...', res.data);
          }
        })
      );
  }

  getPostsHistory(status: number, page: number, limit: number) {
    console.log('Geting posts history...');
    let queryParams = new HttpParams()
      .append('status', status)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/history-post', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getPostsHistoryOfAUser(uId: string, page: number, limit: number) {
    console.log('Geting posts history...');
    let queryParams = new HttpParams()
      .append('uId', uId)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/view-post-user', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  searchPostsByKeyword(keyword: string, page: number, limit: number) {
    console.log('On searching posts by keyword...', keyword);
    let queryParams = new HttpParams()
      .append('search', keyword)
      .append('page', page)
      .append('limit', limit);
    this.searchKeyword = keyword;
    this.searchKeywordChanged.next(this.searchKeyword);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/search-post', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.searchResult = res.data;
          this.searchResultsChanged.next([...this.searchResult]);
          this.paginationService.pagination = res.pagination;
          if (res.data) {
            console.log('Search results: ', res.data);
          }
        })
      );
  }

  searchPostByTags(tags: [string], page: number, limit: number) {
    console.log('On searching posts by tags...');

    let queryParams = new HttpParams()
      .append('tags', tags.join())
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/search-post-tags', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Search results: ', res.data);
          }
        })
      );
  }

  getAllTags() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-tags')
      .pipe(catchError(handleError));
  }

  createTag(tag: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'posts/create-tag', {
        _tag: tag,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Created tag successfully...', res.data);
          }
        })
      );
  }
}
