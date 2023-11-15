import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountsEditComponent } from './accounts-edit/accounts-edit.component';
import { PostingHistoryComponent } from './posting-history/posting-history.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      { path: 'posting-history', component: PostingHistoryComponent },
      { path: 'post-new', component: PostsEditComponent },
      { path: 'user/:id', component: AccountsEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
