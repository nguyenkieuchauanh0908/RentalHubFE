import { NgModule } from '@angular/core';
import {
  ExtraOptions,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileLayoutComponent } from './shared/layout/profile-layout/profile-layout.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
export const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
};
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'forget-password/:uId/:token',
    component: ForgetPasswordComponent,
  },

  {
    path: 'posts',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./posts/posts.module').then((m) => m.PostsModule),
  },

  {
    path: 'profile',
    component: ProfileLayoutComponent,
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'hosts',
    component: MainLayoutComponent,
    loadChildren: () => import('./host/host.module').then((m) => m.HostsModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/posts#start',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    RouterModule.forRoot(routes, routerOptions),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
