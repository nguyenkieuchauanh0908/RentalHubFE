import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { handleError } from './handle-errors';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUser = false;
  isHost = false;
  isAdmin = false;
  isInspector = false;

  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, pw: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/login', {
        _email: email,
        _password: pw,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.handleAuthentication(res.data);
        })
      );
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    console.log('CA');
    if (userData) {
      const user: any = JSON.parse(userData);
      console.log(user);
      const loadedUserData = new User(
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
      console.log('loadedUserData: ', loadedUserData);
      if (!loadedUserData.ACToken && loadedUserData.RFToken) {
        console.log('on reseting token!');
        this.resetACToken(loadedUserData.RFToken);
        // console.log('CA: ', loadedUserData.ACToken, loadedUserData.RFToken);
        this.user.next(loadedUserData);
      }
      if (loadedUserData.ACToken && loadedUserData.RFToken) {
        this.user.next(loadedUserData);
      }
      const expirationDuration = loadedUserData._RFExpiredTime - Date.now();
      this.autoLogout(expirationDuration, loadedUserData.RFToken);
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

  logout(refreshToken: any) {
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
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
          // console.log(res);
          this.user.next(null);
        })
      );
  }

  autoLogout(expirationDuration: number, refreshToken: any) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout(refreshToken);
      if (localStorage.getItem('userData')) {
        localStorage.removeItem('userData');
      }
    }, expirationDuration);
  }

  resetACToken(RFToken: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/reset-token', {
        refreshToken: RFToken,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          console.log(res);
          // cập nhật lại user
          // cập nhật lại local storage
        })
      );
  }

  private handleAuthentication(data: any) {
    const user = new User(
      data._fname,
      data._lname,
      data._dob,
      data._phone,
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
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log(user._RFExpiredTime, user.RFToken);
    const expirationDuration = user._RFExpiredTime - Date.now();
    this.autoLogout(expirationDuration, user.RFToken);
    this.isUser = true;
  }
}
