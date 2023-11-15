import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './accounts-routing.module';
import { AccountsEditComponent } from './accounts-edit/accounts-edit.component';
import { PostingHistoryComponent } from './posting-history/posting-history.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';

@NgModule({
  declarations: [
    AccountsComponent,
    SidebarComponent,
    AccountsEditComponent,
    PostsEditComponent,
  ],
  imports: [
    RouterModule,
    AccountRoutingModule,
    SharedModule,
    PostingHistoryComponent,
  ],
})
export class AccountsModule {}
