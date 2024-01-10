import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PostsResolverService } from './posts/posts-resolver.service';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { HostComponent } from './host/host.component';
import { ProfileLayoutComponent } from './shared/layout/profile-layout/profile-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
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
    redirectTo: '/posts',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
