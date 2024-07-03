import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { handleError } from '../shared/handle-errors';
import { BehaviorSubject, Subject, Subscription, catchError, tap } from 'rxjs';
import { ForumPostModel } from './forum-post/forum-post.model';
import { Pagination } from '../shared/pagination/pagination.service';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  $destroy: Subject<boolean> = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  //Status of social posts: 0: Đang đăng, 1: Khóa (do chủ bài đăng), 2: Bị report (đã được duyệt)
  currentKeyword = new BehaviorSubject<string | null>(null);
  getCurrentKeyword = this.currentKeyword.asObservable();
  setCurrentKeyword(updatedKeyword: string | null) {
    this.currentKeyword.next(updatedKeyword);
  }

  goToSocialPostDetailStatus = new BehaviorSubject<boolean>(false);
  getGoToSocialPostDetailStatus =
    this.goToSocialPostDetailStatus.asObservable();
  setGoToSocialPostDetailStatus(updatedStatus: boolean) {
    this.goToSocialPostDetailStatus.next(updatedStatus);
  }

  currentSearchResultPosts = new BehaviorSubject<ForumPostModel[] | null>(null);
  getCurrentSearchResultPosts = this.currentSearchResultPosts.asObservable();
  setCurrentSearchResultPosts(searchResult: ForumPostModel[] | null) {
    this.currentSearchResultPosts.next(searchResult);
  }

  currentSearchResultAccounts = new BehaviorSubject<any[] | null>(null);
  getCurrentSearchResultAccounts =
    this.currentSearchResultAccounts.asObservable();
  setCurrentSearchResultAccounts(accounts: any[] | null) {
    this.currentSearchResultAccounts.next(accounts);
  }

  currentSearchResultPostPagination = new BehaviorSubject<Pagination | null>(
    null
  );
  getCurrentSearchResultPostPagination =
    this.currentSearchResultPostPagination.asObservable();
  setCurrentSearchResultPostPagination(pagination: Pagination) {
    this.currentSearchResultPostPagination.next(pagination);
  }

  currentSearchResultAccountPagination = new BehaviorSubject<Pagination | null>(
    null
  );
  getCurrentSearchResultAccountPagination =
    this.currentSearchResultAccountPagination.asObservable();
  setCurrentSearchResultAccountPagination(pagination: Pagination) {
    this.currentSearchResultAccountPagination.next(pagination);
  }

  constructor(private http: HttpClient) {}

  destroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    console.log(
      'destroying subscription of chat service!',
      this.subscriptions.length
    );
  }

  getSocialPosts(
    page: number,
    limit: number,
    status: number | null,
    uId: string | null
  ) {
    let queryParams = new HttpParams()
      .append('limit', limit)
      .append('page', page);
    if (status !== null) {
      queryParams = queryParams.append('status', status);
    }
    if (uId !== null) {
      queryParams = queryParams.append('userId', uId);
    }
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'social', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Get social posts successfully!');
          }
        })
      );
  }

  getSocialPostById(pId: string) {
    let queryParams = new HttpParams().append('postId', pId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'social/get-social-post-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  createSocialPost(form: any, image: File) {
    console.log(form);
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let body = new FormData();
    body.append('_title', form.titleInputControl);
    body.append('_content', form.contentInputControl);
    body.append('_image', image);
    return this.http
      .post<resDataDTO>(
        environment.baseUrl + 'social/create-social-post',
        body,
        {
          headers: headers,
        }
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Create social post successfully...!');
          }
        })
      );
  }

  updateSocialPost(pId: string, form: any, image: File | null) {
    console.log(form);
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let body = new FormData();
    body.append('_id', pId!);
    body.append('_title', form.titleInputControl!);
    body.append('_content', form.contentInputControl!);
    if (image !== null) {
      body.append('_image', image);
    }

    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'social/update-social-post',
        body,
        {
          headers: headers,
        }
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Update social post successfully...!');
          }
        })
      );
  }

  changeSocialPostStatus(postId: string) {
    let queryParams = new HttpParams().append('postId', postId);
    return this.http
      .delete<resDataDTO>(environment.baseUrl + 'social/cancle-social-post', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Updata social post status successfully...', res.data);
          }
        })
      );
  }

  likeOrUnlikePost(postId: string) {
    return this.http.patch<resDataDTO>(
      environment.baseUrl + 'social/react-social-post',
      {
        postId: postId,
      }
    );
  }

  getParentCommentsOfPost(postId: string, page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('postId', postId)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'comment/get-parent-comments', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getRepliesOfAParentComment(parentId: string, page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('parentId', parentId)
      .append('page', page)
      .append('limit', limit);
    return this.http.get<resDataDTO>(
      environment.baseUrl + 'comment/get-reply-comments',
      {
        params: queryParams,
      }
    );
  }

  createComment(
    _postId: string,
    _parentId: string | null,
    _content: string,
    _images: FileList | null
  ) {
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let body = new FormData();
    body.append('_postId', _postId);
    body.append('_content', _content);
    if (_parentId) {
      body.append('_parentId', _parentId);
    }
    if (_images) {
      const numberOfImages = _images.length;
      for (let i = 0; i < numberOfImages; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(_images[i]);
        body.append('_images', _images[i]);
        // console.log(
        //   '🚀 ~ file: post.service.ts:85 ~ PostService ~ createPost ~ images[i]:',
        //   images[i]
        // );
      }
    }

    return this.http
      .post<resDataDTO>(environment.baseUrl + 'comment/create-comment', body, {
        headers: headers,
      })
      .pipe(catchError(handleError));
  }

  reportSocialPost(_postId: string, _reason: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'social/report-social-post', {
        _postId: _postId,
        _reason: _reason,
      })
      .pipe(catchError(handleError));
  }

  hideComment(commentId: string) {
    let queryParams = new HttpParams().append('commentId', commentId);
    return this.http
      .delete<resDataDTO>(environment.baseUrl + 'comment/hide-comment', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  updateComment(
    _commentId: string,
    _content: string,
    _images: FileList,
    _deleteImageIndexes: number[]
  ) {
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let body = new FormData();
    body.append('_content', _content);
    if (_images) {
      const numberOfImages = _images.length;
      for (let i = 0; i < numberOfImages; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(_images[i]);
        body.append('_images', _images[i]);
        // console.log(
        //   '🚀 ~ file: post.service.ts:85 ~ PostService ~ createPost ~ images[i]:',
        //   images[i]
        // );
      }
    }
    if (_deleteImageIndexes.length > 0) {
      body.append('_deleteImages', _deleteImageIndexes.toString());
      console.log(
        '🚀 ~ ForumService ~ updateComment ~  _deleteImageIndexes.toString():',
        _deleteImageIndexes.toString()
      );
    }
    let queryParams = new HttpParams().append('commentId', _commentId);
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'comment/update-comment', body, {
        headers: headers,
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  searchByKeyword(keyword: string, type: number, page: number, limit: number) {
    console.log(
      '🚀 ~ ForumService ~ searchByKeyword ~ keyword ~ type:',
      keyword,
      type
    );
    // status 0: search posts, 1: search accounts
    let queryParams = new HttpParams()
      .append('keyword', keyword)
      .append('type', type)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'social/search-social-medias', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('🚀 ~ ForumService ~ tap ~ res.data:', res.data);
            // if (type === 0) {
            //   console.log('🚀 ~ ForumService ~ tap ~ type:', type);

            //   let updatedPostSearchResult: any[] | null = [];
            //   this.setCurrentSearchResultPostPagination(res.pagination);
            //   let postSearchSub = this.getCurrentSearchResultPosts.subscribe(
            //     (posts) => {
            //       console.log('🚀 ~ ForumService ~ tap ~ posts:', posts);
            //       if (posts) {
            //         updatedPostSearchResult = posts.concat(res.data);
            //       } else {
            //         updatedPostSearchResult = res.data;
            //         console.log(
            //           '🚀 ~ ForumService ~ tap ~ res.data:',
            //           res.data
            //         );
            //       }
            //     }
            //   );
            //   if (updatedPostSearchResult) {
            //     this.setCurrentSearchResultPosts(updatedPostSearchResult);
            //   }
            //   console.log(
            //     '🚀 ~ ForumService ~ tap ~ updatedPostSearchResult:',
            //     updatedPostSearchResult
            //   );

            //   this.subscriptions.push(postSearchSub);
            // } else {
            //   console.log('🚀 ~ ForumService ~ tap ~ type:', type);
            //   let updatedAccountsSearchResult: any[] | null = [];
            //   this.setCurrentSearchResultAccountPagination(res.pagination);
            //   let accountResultSub =
            //     this.getCurrentSearchResultAccounts.subscribe((accounts) => {
            //       if (accounts) {
            //         updatedAccountsSearchResult = accounts.concat(res.data);
            //       } else {
            //         updatedAccountsSearchResult = res.data;
            //       }
            //     });
            //   if (updatedAccountsSearchResult) {
            //     this.setCurrentSearchResultAccounts(
            //       updatedAccountsSearchResult
            //     );
            //   }
            //   this.subscriptions.push(accountResultSub);
            // }
          }
        })
      );
  }
}
