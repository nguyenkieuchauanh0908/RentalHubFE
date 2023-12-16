import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../accounts/accounts.service';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    // private authService: AuthService,
    private router: Router,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.accountService.getCurrentUser.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          // Không có thông tin user -> Không có ACToken -> Request gửi đi không có ACToken -> Văng lỗi Unauthorized => Thông báo
          return next.handle(req);
        } else {
          if (!user.RFToken) {
            this.notifierService.notify(
              'warning',
              'Bạn cần phải đăng nhập lại để tiếp tục!'
            );
            console.log('You need to login again!');
            this.router.navigate(['/auth/login']);
          } else {
            if (user.ACToken && user.RFToken) {
              console.log('ACToken in interceptor: ', user.ACToken);
              console.log('On adding ACToken to request header...');
              const headers = new HttpHeaders({
                Authorization: `Bearer ${user.ACToken}`,
              });
              const tokenReq = req.clone({ headers: headers });
              return next.handle(tokenReq);
            }
          }

          return next.handle(req);
        }
      })
    );
  }
}
