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

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          // Không có thông tin user -> Không có ACToken -> Request gửi đi không có ACToken -> Văng lỗi Unauthorized => Thông báo
          return next.handle(req);
        } else {
          if (!user.RFToken) {
            console.log('You need to login again!');
            this.router.navigate(['/login']);
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
