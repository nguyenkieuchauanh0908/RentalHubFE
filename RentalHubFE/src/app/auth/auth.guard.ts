import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, tap, take, mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AccountService } from '../accounts/accounts.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
     private router: Router, private accountService: AccountService) {}
  //   ngOnInit(): void {
  //     this.authService.autoLogin();
  //   }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    console.log("---------------------------------------------")
    return this.accountService.getCurrentUser.pipe(
      take(1),
      mergeMap(async (user) => {
        console.log('Token before call api: ', user?.ACToken, user?.RFToken);
        if (user?.ACToken === null && user?.RFToken) {
          try {
            const auth = await this.authService
              .resetACToken(user.RFToken)
              .toPromise();
            console.log(
              '🚀 ~ file: auth.guard.ts:35 ~ AuthGuard ~ map ~ auth:',
              // this.authService.user.getValue()
            );
            return true;
          } catch (error) {
            console.log('🚀 ~ AuthGuard ~ map ~ errorMsg:', error);
          }
        }
        if (user?.ACToken && user?.RFToken) {
          return true;
        }
        return this.router.createUrlTree(['/auth/login']);
      }), mergeMap(result => from(Promise.resolve(result)))
    );
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   router: RouterStateSnapshot
  // ):
  //   | boolean
  //   | UrlTree
  //   | Promise<boolean | UrlTree>
  //   | Observable<boolean | UrlTree> {
  //   let isAuth = false;
  //   function checkToken(token: unknown, refresh: string) {
  //     return new Promise((resolve, reject) => {
  //       if (token) {
  //         reject(token);
  //       } else {
  //         resolve(refresh);
  //       }
  //     });
  //   }
  //   return this.authService.user.pipe(
  //     take(1),
  //     map((user) => {
  //       console.log('Token before call api: ', user?.ACToken, user?.RFToken);
  //       if (user?.RFToken) {
  //         checkToken(user.ACToken, user.RFToken)
  //           .then((tk) => {
  //             const re = tk as string;
  //             console.log(tk);
  //             return this.authService.resetACToken(re);
  //           })
  //           .then((value) => {
  //             isAuth = true;
  //             return true;
  //           })
  //           .catch((err) => {
  //             console.log('Token chua het han');
  //             isAuth = true;
  //             return true;
  //           });
  //       } else {
  //         return this.router.createUrlTree(['/auth/login']);
  //       }

  //       console.log('Auth: ', isAuth);
  //       return true;
  //       // const isAuth = !!user?.ACToken;
  //       // if (isAuth) {
  //       //   return true;
  //       // }
  //     })
  //   );
  // }
}
