import { NgModule } from '@angular/core';
import { ForumHomeComponent } from './forum-home/forum-home.component';
import { AuthGuard } from '../auth/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ForumSearchResultComponent } from './forum-search-result/forum-search-result.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: ForumHomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile/:uId',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'search',
        component: ForumSearchResultComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumRoutingModule {}
