import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { PostingHistoryComponent } from './posting-history/posting-history.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { VerifyHostComponent } from './verify-host/verify-host.component';
import { FavoritePostsComponent } from './favorite-posts/favorite-posts.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpdateAvatarComponent } from './update-avatar/update-avatar.component';
import { LoginDetailUpdateComponent } from './login-detail-update/login-detail-update.component';
import { RegisterAddressComponent } from './register-address/register-address.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { ManageIdentityComponent } from './manage-identity/manage-identity.component';
import { PaymentPackagesComponent } from '../payment/payment-packages/payment-packages.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      {
        path: 'update-login-detail/:uId',
        component: LoginDetailUpdateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'update-avatar/:uId',
        component: UpdateAvatarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-identity/:uId',
        component: ManageIdentityComponent,
        canActivate: [AuthGuard],
      },
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
        path: 'register-address/:uId',
        component: RegisterAddressComponent,
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
      {
        path: 'manage-addresses/:uId',
        component: ManageAddressesComponent,
        canActivate: [AuthGuard],
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
