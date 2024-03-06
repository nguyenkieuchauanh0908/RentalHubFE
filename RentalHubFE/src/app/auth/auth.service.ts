import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { handleError } from '../shared/handle-errors';
import { User } from './user.model';
import { AccountService } from '../accounts/accounts.service';
import { PostService } from '../posts/post.service';
import { NotificationService } from '../shared/notifications/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUser = false;
  isHost = true;

  user = new BehaviorSubject<User | null>(null);
  resetToken: User | undefined;
  private tokenExpirationTimer: any;

  resetUser: User | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService,
    private postService: PostService,
    private notiService: NotificationService
  ) {
    this.user.subscribe((user) => {
      if (user) {
        this.resetUser = user;
      }
    });
  }

  login(email: string, pw: string) {
    console.log('On log in........');
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/login', {
        _email: email,
        _password: pw,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.handleAuthentication(res.data);
          this.getFavoredPostLogin();
          this.getPostsNotifictionsLogin();
        })
      );
  }

  autoLogin() {
    console.log('On auto login ...');
    const userData = localStorage.getItem('userData');
    if (userData) {
      let expirationDuration = 0;
      const user: any = JSON.parse(userData);
      const loadedUserData = new User(
        user?._id,
        user?._fname,
        user?._lname,
        user?._dob,
        user?._phone,
        user?._active,
        user?._rating,
        user?._email,
        user?._address,
        user?._avatar,
        user?._role,
        user?._isHost,
        user?._RFToken,
        user?._RFExpiredTime,
        user?._ACToken,
        user?._ACExpiredTime
      );
      this.accountService.setCurrentUser(loadedUserData);
      if (loadedUserData.ACToken && loadedUserData.RFToken) {
        this.accountService.setCurrentUser(loadedUserData);

        expirationDuration = loadedUserData._RFExpiredTime - Date.now();
      }
      if (!loadedUserData.ACToken && loadedUserData.RFToken) {
        this.resetACToken(loadedUserData.RFToken);
        expirationDuration = loadedUserData._RFExpiredTime - Date.now();
      }
      console.log('expiration duration:', expirationDuration);
      this.autoLogout(expirationDuration, loadedUserData.RFToken);
      if (expirationDuration !== 0) {
        this.getFavoredPostLogin();
        this.getPostsNotifictionsLogin();
      }
    } else {
      return;
    }
  }

  signup(email: string, pw: string, _pwconfirm: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/registor', {
        _email: email,
        _pw: pw,
        _pwconfirm: _pwconfirm,
      })
      .pipe(catchError(handleError));
  }

  signupOTP(email: string, pw: string, _pwconfirm: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/registor-user', {
        _email: email,
        _pw: pw,
        _pwconfirm: _pwconfirm,
      })
      .pipe(catchError(handleError));
  }

  verifyUser(email: string, otp: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/verify-user', {
        _email: email,
        otp: otp,
      })
      .pipe(catchError(handleError));
  }

  logout(refreshToken: any) {
    console.log('On loging out ...');
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('userData');
    localStorage.removeItem('favorite-posts');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/logout', {
        refreshToken: refreshToken,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res);
          this.accountService.setCurrentUser(null);
        })
      );
  }

  autoLogout(expirationDuration: number, refreshToken: any) {
    console.log('auto loggin out...');
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout(refreshToken);
      this.isUser = false;
      if (
        localStorage.getItem('userData') ||
        localStorage.getItem('favorite-posts')
      ) {
        localStorage.removeItem('userData');
        localStorage.removeItem('favorite-posts');
      }
    }, expirationDuration);
  }

  resetACToken(refreshToken: string) {
    console.log('On reseting token ...');
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/reset-token', {
        refreshToken: refreshToken,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log('on reset AC token function');
          console.log(res);
          // cập nhật lại user với AC token mới
          this.accountService.getCurrentUser.subscribe((currentUser) => {
            console.log('Current user: ', currentUser);
            if (currentUser) {
              console.log('On updating user with reseting AC token...');
              this.resetUser = new User(
                currentUser._id,
                currentUser._fname,
                currentUser._lname,
                currentUser._phone,
                currentUser._dob,
                currentUser._active,
                currentUser._rating,
                currentUser._email,
                currentUser._address,
                currentUser._avatar,
                currentUser._role,
                currentUser._isHost,
                res.data.refreshToken,
                res.data.expiredRefresh,
                res.data.accessToken,
                res.data.expiredAccess
              );
              this.isHost = currentUser._isHost;
              console.log('After reset token, isHost: ', this.isHost);
              localStorage.setItem('userData', JSON.stringify(this.resetUser));
            }
          });
          if (this.resetUser) {
            this.accountService.setCurrentUser(this.resetUser);
            console.log(
              '🚀 ~ file: auth.service.ts:168 ~ AuthService ~ tap ~ this.user.next:',
              this.accountService.getCurrentUser
            );
          }
        })
      );
  }

  verifyAccount(phone: string) {
    console.log('On verifying account ...');
    return this.http
      .post(environment.baseUrl + 'users/accounts/verify-host', {
        _phone: phone,
      })
      .pipe(catchError(handleError));
  }

  sendForgetPwMail(email: string) {
    // console.log('Send forgetPwMail to email:', email);
    return this.http
      .post<resDataDTO>(
        environment.baseUrl + 'users/accounts/forgot-password',
        {
          url: 'http://localhost:4200/forget-password',
          _email: email,
        }
      )
      .pipe(catchError(handleError));
  }

  resetPassword(
    pw: string,
    pw_confirm: string,
    uId: string,
    resetPassToken: string
  ) {
    return this.http
      .post<resDataDTO>(
        environment.baseUrl +
          'users/accounts/reset-password/' +
          uId +
          '/' +
          resetPassToken,
        {
          _pw: pw,
          _pwconfirm: pw_confirm,
        }
      )
      .pipe(catchError(handleError));
  }

  private handleAuthentication(data: any) {
    const user = new User(
      data._id,
      data._fname,
      data._lname,
      data._phone,
      data._dob,
      data._active,
      data._rating,
      data._email,
      data._address,
      data._avatar,
      data._role,
      data._isHost,
      data.refreshToken,
      data.expiredRefresh,
      data.accessToken,
      data.expiredAccess
    );
    this.accountService.setCurrentUser(user);
    this.isUser = true;
    this.isHost = user._isHost;
    localStorage.setItem('userData', JSON.stringify(user));
    const expirationDuration = user._RFExpiredTime - Date.now();
    console.log('Expiration duration:', expirationDuration);
    this.autoLogout(expirationDuration, user.RFToken);
  }

  getFavoredPostLogin() {
    const favoredPostsData = localStorage.getItem('favorite-posts');
    let favorites: String[] | null = new Array();
    //Nếu post yêu thích được lưu trong local storage
    if (favoredPostsData) {
      favorites = JSON.parse(favoredPostsData);
      console.log('🚀 ~ AuthService ~ tap ~ favorites:', favorites);
      this.postService.setCurrentFavoritesId(favorites);
    }
    //Nếu không có trong local storage thì lấy từ server rồi lưu vào local storage
    else {
      this.postService.getFavoritesId().subscribe();
      this.postService.getCurrentFavoritesId.subscribe((favoritesId) => {
        favorites = favoritesId;
      });
      localStorage.setItem('favorite-posts', JSON.stringify(favorites));
    }
  }

  getPostsNotifictionsLogin() {
    this.notiService.getPostNotifications().subscribe();
  }
}
