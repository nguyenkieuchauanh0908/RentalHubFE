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
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    console.log('---------------------------------------------');
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
              '🚀 ~ file: auth.guard.ts:35 ~ AuthGuard ~ map ~ auth:'
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
      }),
      mergeMap((result) => from(Promise.resolve(result)))
    );
  }
}
