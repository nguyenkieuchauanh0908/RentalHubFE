import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountsEditComponent } from './accounts-edit/accounts-edit.component';
import { PostingHistoryComponent } from './posting-history/posting-history.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ChangeAvatarComponent } from './change-avatar/change-avatar.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
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
      // { path: 'user/:uId', component: AccountsEditComponent, canActivate: [AuthGuard], },
      // { path: 'user/edit-avatar/:uId', component: ChangeAvatarComponent, canActivate: [AuthGuard], },
      {
        path: 'verify-account/:uId',
        children: [
          {
            path: '',
            component: VerifyAccountComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'verify-otp',
            component: VerifyOtpComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
