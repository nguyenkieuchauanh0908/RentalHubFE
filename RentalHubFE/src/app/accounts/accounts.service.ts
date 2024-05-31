import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { User } from '../auth/user.model';
import { handleError } from '../shared/handle-errors';
import { Identity } from './manage-identity/identity.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  currentUserId = new Subject<string>();
  private currentUser = new BehaviorSubject<User | null>(null);
  private currentIDCard = new BehaviorSubject<Identity | null>(null);
  constructor(
    private http: HttpClient // private authService: AuthService
  ) {}

  getCurrentUser = this.currentUser.asObservable();
  setCurrentUser(updatedUser: User | null) {
    this.currentUser.next(updatedUser);
  }

  getCurrentIDCard = this.currentIDCard.asObservable();
  setCurrentIDCard(updatedIDCard: Identity | null) {
    this.currentIDCard.next(updatedIDCard);
  }

  getCurrentUserId(): string | null {
    console.log('on getting current userId ...');
    let uId: string | null | undefined = null;
    this.getCurrentUser.subscribe((user) => {
      uId = user?._id;
    });
    console.log('current uId: ', uId);
    return uId;
  }

  getProfile(uId: string) {
    console.log('current uId: ', uId);
    let profile: User | null = null;
    this.getCurrentUser.subscribe((user) => {
      profile = user;
    });
    return profile;
  }

  updateProfile(updatedProfile: any) {
    console.log('on calling update profile api...', updatedProfile);
    let updatedtUser: User;
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-profile', {
        _fname: updatedProfile._fname,
        _lname: updatedProfile._lname,
        _dob: updatedProfile._dob,
        _address: '',
        _phone: updatedProfile._phone,
        _email: updatedProfile._email,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.getCurrentUser.subscribe((currentUser) => {
            if (currentUser) {
              currentUser._fname = res.data._fname;
              currentUser._lname = res.data._lname;
              currentUser._email = res.data._email;
              currentUser._phone = res.data._phone;
              updatedtUser = currentUser;
            }
          });
          this.setCurrentUser(updatedtUser);
        })
      );
  }

  updateAvatar(avatar: File) {
    console.log('Your updated avatar type: ', avatar);
    let body = new FormData();
    body.append('_avatar', avatar);
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let updatedtUser: User;
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-avatar', body, {
        headers: headers,
      })
      .pipe(
        tap((res) => {
          this.getCurrentUser.subscribe((currentUser) => {
            if (currentUser) {
              currentUser._avatar = res.data._avatar;
              updatedtUser = currentUser;
              localStorage.setItem('userData', JSON.stringify(updatedtUser));
            }
          });
          this.setCurrentUser(updatedtUser);
        })
      )
      .pipe(catchError(handleError));
  }

  verifyAccount(phone: string) {
    console.log('your phone is: ', phone);
    console.log('sending otp to mail ...');
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/active-host', {
        _phone: phone,
      })
      .pipe(catchError(handleError));
  }

  confirmOtp(otp: string, phone: any) {
    console.log('On verify otp...', otp);
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/verify-host', {
        phone: phone,
        otp: otp,
      })
      .pipe(catchError(handleError));
    //Xử lý otp hết hạn hoặc yêu cầu gửi lại otp
  }

  verifyNationalIDCard(image_front: File, image_back: File) {
    let updatedUser: User;
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let body = new FormData();
    body.append('image_front', image_front);
    body.append('image_back', image_back);
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/verify-indentity', body)
      .pipe(
        catchError(handleError)
        // tap((res) => {
        //   this.getCurrentUser.subscribe((currentUser) => {
        //     if (currentUser) {
        //       currentUser._isHost = true;
        //       updatedUser = currentUser;
        //       localStorage.setItem('userData', JSON.stringify(updatedUser));
        //     }
        //   });
        //   this.setCurrentUser(updatedUser);
        // })
      );
  }

  getIdentityCard() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'users/get-identity')
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.setCurrentIDCard(res.data);
          }
        })
      );
  }

  resetOtp() {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'users/accounts/reset-otp', {})
      .pipe(catchError(handleError));
  }

  updateEmailPassword(email: string, pw: string, repw: string) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-login-info', {
        _email: email,
        _pw: pw,
        _pwconfirm: repw,
      })
      .pipe(catchError(handleError));
  }

  sendForgetPwMail(email: string) {
    console.log('Send forgetPwMail to email:', email);
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

  resetPassword(pw: string, pw_confirm: string, resetPassToken: string) {
    return this.http
      .post<resDataDTO>(
        environment.baseUrl + 'users/accounts/reset-password/' + resetPassToken,
        {
          _pw: 'duyen59@',
          _pwconfirm: 'duyen59@',
        }
      )
      .pipe(catchError(handleError));
  }
}
