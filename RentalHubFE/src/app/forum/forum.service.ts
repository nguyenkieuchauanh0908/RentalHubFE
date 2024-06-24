import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { handleError } from '../shared/handle-errors';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  //0: Đang đăng, 1: Khóa (do chủ bài đăng), 2: Bị report (đã được duyệt)
  constructor(private http: HttpClient) {}

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
}
