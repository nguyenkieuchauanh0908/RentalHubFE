import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  //   ngOnInit(): void {
  //     this.authService.autoLogin();
  //   }

  //   canActivate(
  //     route: ActivatedRouteSnapshot,
  //     router: RouterStateSnapshot
  //   ):
  //     | boolean
  //     | UrlTree
  //     | Promise<boolean | UrlTree>
  //     | Observable<boolean | UrlTree> {
  //     return this.authService.user.pipe(
  //       take(1),
  //       map((user) => {
  //         console.log('Token before call api: ', user?.ACToken, user?.RFToken);
  //         if (user?.ACToken === null && user?.RFToken) {
  //           this.authService.resetACToken(user.RFToken);
  //           return true;
  //         }
  //         if (user?.ACToken && user?.RFToken) {
  //           return true;
  //         }
  //         // const isAuth = !!user?.ACToken;
  //         // if (isAuth) {
  //         //   return true;
  //         // }
  //         return this.router.createUrlTree(['/auth/login']);
  //       })
  //     );
  //   }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    let isAuth = false;
    function checkToken(token: unknown, refresh: string) {
      return new Promise((resolve, reject) => {
        if (token) {
          reject(token);
        } else {
          resolve(refresh);
        }
      });
    }
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        console.log('Token before call api: ', user?.ACToken, user?.RFToken);
        if (user?.RFToken) {
          checkToken(user.ACToken, user.RFToken)
            .then((tk) => {
              const re = tk as string;
              console.log(tk);
              return this.authService.resetACToken(re);
            })
            .then((value) => {
              isAuth = true;
              return true;
            })
            .catch((err) => {
              console.log('Token chua het han');
              isAuth = true;
              return true;
            });
        } else {
          return this.router.createUrlTree(['/auth/login']);
        }

        console.log('Auth: ', isAuth);
        return true;
        // const isAuth = !!user?.ACToken;
        // if (isAuth) {
        //   return true;
        // }
      })
    );
  }
}
