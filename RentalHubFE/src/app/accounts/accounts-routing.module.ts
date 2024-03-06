import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { PostingHistoryComponent } from './posting-history/posting-history.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { VerifyHostComponent } from './verify-host/verify-host.component';
import { FavoritePostsComponent } from './favorite-posts/favorite-posts.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      {
        path: 'notifications/:uId',
        component: NotificationsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'favorites-posts/:uId',
        component: FavoritePostsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'posting-history/:uId',
        component: PostingHistoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'post-new/:uId',
        component: PostsEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'verify-account/:uId',
        children: [
          {
            path: '',
            component: VerifyHostComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
