import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { PostItem } from './posts-list/post-item/post-item.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { PaginationService } from '../shared/pagination/pagination.service';
import { handleError } from '../shared/handle-errors';
import { NotifierService } from 'angular-notifier';
import { Tags } from '../shared/tags/tag.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  postListChanged = new Subject<PostItem[]>();
  posts: PostItem[] = [];
  searchResultsChanged = new Subject<PostItem[]>();
  searchResult: PostItem[] = [];
  searchKeyword: string = '';
  searchKeywordChanged = new Subject<string>();
  private currentFavoritesId = new BehaviorSubject<String[] | null>([]);
  private currentFavorites = new BehaviorSubject<PostItem[] | null | any[]>([]);
  private currentPostingHistory = new BehaviorSubject<PostItem[] | null>([]);

  private currentTags = new BehaviorSubject<Tags[]>([]);

  private currentChosenTags = new BehaviorSubject<Tags[]>([]);

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService,
    private notifierService: NotifierService
  ) {}

  getCurrentPostingHistory = this.currentPostingHistory.asObservable();

  setCurrentPostingHistory(updatedPostingHistory: PostItem[]) {
    this.currentPostingHistory.next(updatedPostingHistory);
  }

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
            this.paginationService.pagination = res.pagination;
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
    let body = new FormData();
    body.append('_title', form.title);
    body.append('_desc', form.desc);
    body.append('_content', form.content);
    body.append('_street', form.street);
    body.append('_district', form.district);
    body.append('_area', form.area);
    body.append('_price', form.renting_price);
    body.append('_electricPrice', form.electric);
    body.append('_waterPrice', form.water_price);
    body.append('_services', form.services);
    body.append('_utilities', form.utilities);
    if (form.city) {
      body.append('_city', form.city);
    }
    const numberOfImages = images.length;
    for (let i = 0; i < numberOfImages; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(images[i]);
      body.append('_images', images[i]);
      // console.log(
      //   '🚀 ~ file: post.service.ts:85 ~ PostService ~ createPost ~ images[i]:',
      //   images[i]
      // );
    }
    if (selectedTags) {
      for (let tag of selectedTags) {
        body.append('_tags', tag._id);
      }
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

  updatePost(
    form: any,
    images: FileList,
    deletedImageIndexes: number[],
    selectedTags: any,
    postId: string
  ) {
    console.log(form.city);
    let body = new FormData();
    body.append('_title', form.title);
    body.append('_desc', form.desc);
    body.append('_content', form.content);
    body.append('_address', form.address);
    body.append('_area', form.area.toString());
    body.append('_price', form.renting_price.toString());
    body.append('_electricPrice', form.electric.toString());
    body.append('_waterPrice', form.water_price.toString());
    body.append('_services', form.services);
    body.append('_utilities', form.utilities);
    body.append('_street', form.street);
    body.append('_district', form.district);
    if (form.city) {
      body.append('_city', form.city);
    }
    if (images) {
      const numberOfImages = images.length;
      for (let i = 0; i < numberOfImages; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(images[i]);
        body.append('_images', images[i]);
      }
    }

    if (selectedTags) {
      for (let tag of selectedTags) {
        body.append('_tags', tag._id);
      }
    }

    body.append('_deleteImages', deletedImageIndexes.toString());

    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'posts/update-post/' + postId,
        body
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Updated post successfully...', res.data);
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
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.setCurrentPostingHistory(res.data);
          this.paginationService.pagination = res.pagination;
          console.log(
            '🚀 ~ file: post.service.ts:187 ~ PostService ~ tap ~ res.data:',
            res.data
          );
        })
      );
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

  getRelatedPosts(pId: string, page: number, limit: number) {
    console.log('Geting posts similar...');
    let queryParams = new HttpParams()
      .append('postId', pId)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/posts-similar', {
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
          this.paginationService.paginationChanged.next(res.pagination);
          if (res.data) {
            console.log('Search results: ', res.data);
          }
        })
      );
  }

  updatePostStatus(postId: string, status: boolean) {
    console.log('On deactivating post has id: ', postId);
    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'posts/update-post-status/' + postId,
        {
          _active: status,
        }
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          {
            let updatedPostingHistory: PostItem[] = [];
            this.getCurrentPostingHistory.subscribe((postingHistory) => {
              console.log(
                '🚀 ~ file: post.service.ts:252 ~ PostService ~ this.getCurrentPostingHistory.subscribe ~ postingHistory:',
                postingHistory
              );

              updatedPostingHistory = postingHistory!.filter(
                (post) => post._id !== postId
              );
              console.log(
                '🚀 ~ file: post.service.ts:253 ~ PostService ~ this.getCurrentPostingHistory.subscribe ~ updatedPostingHistory:',
                updatedPostingHistory
              );
            });
            this.setCurrentPostingHistory(updatedPostingHistory);
          }
        })
      );
  }

  searchPostByTags(
    tags: string[],
    tagName: string,
    page: number,
    limit: number
  ) {
    console.log('On searching posts by tags...');
    this.searchKeyword = tagName;
    this.searchKeywordChanged.next(this.searchKeyword);
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

  setCurrentTags(updatedTags: Tags[]) {
    this.currentTags.next(updatedTags);
  }

  getCurrentTags = this.currentTags.asObservable();

  setCurrentChosenTags(updatedChosenTags: Tags[]) {
    this.currentChosenTags.next(updatedChosenTags);
  }

  getCurrentChosenTags = this.currentChosenTags.asObservable();

  getAllTags() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-tags')
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.setCurrentTags(res.data);
          }
        })
      );
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

  getCurrentFavoritesId = this.currentFavoritesId.asObservable();

  setCurrentFavoritesId(updateFavorites: String[] | null) {
    this.currentFavoritesId.next(updateFavorites);
  }

  getCurrentFavorites = this.currentFavorites.asObservable();

  setCurrentFavorites(updateFavorites: PostItem[] | null) {
    this.currentFavorites.next(updateFavorites);
  }

  createFavorite(pId: String) {
    let updateFavorites: String[];
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'posts/favorite-post', {
        postId: pId,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.getCurrentFavoritesId.subscribe((favorites) => {
              if (favorites) {
                updateFavorites = favorites;
              }
            });
            let isFavoured = updateFavorites.some((id) => id === pId);
            if (isFavoured) {
              updateFavorites = updateFavorites.filter((id) => id !== pId);
            } else {
              updateFavorites?.push(pId);
            }

            this.setCurrentFavoritesId(updateFavorites);
            localStorage.removeItem('favorite-posts');
            localStorage.setItem(
              'favorite-posts',
              JSON.stringify(updateFavorites)
            );
            console.log('Add to favorite successfully!');
            console.log(
              '🚀 ~ PostService ~ tap ~ updateFavorites:',
              updateFavorites
            );
          }
        })
      );
  }

  getFavorites(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-favorite-post', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.setCurrentFavorites(res.data);
          console.log('Getting favorites sucessfully!', res);
        })
      );
  }

  getFavoritesId() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-array-favorite-post')
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.setCurrentFavoritesId(res.data);
          localStorage.setItem('favorite-posts', JSON.stringify(res.data));
        })
      );
  }

  reportPosts(postId: String, reportContent: String) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'posts/report-post', {
        _postId: postId,
        _content: reportContent,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Report post successfully!', res.data);
          }
        })
      );
  }

  getReportPostDetails(reportedId: any) {
    let queryParams = new HttpParams().append('notiId', reportedId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-report-post-user/', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log(
              'Getting reported post details successfully!',
              res.data
            );
          }
        })
      );
  }
}
