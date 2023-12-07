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
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { FormsModule } from '@angular/forms';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ChangeAvatarComponent } from './change-avatar/change-avatar.component';

@NgModule({
  declarations: [
    AccountsComponent,
    SidebarComponent,
    AccountsEditComponent,
    PostsEditComponent,
    VerifyAccountComponent,
    VerifyOtpComponent,
    ChangeAvatarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AccountRoutingModule,
    SharedModule,
    PostingHistoryComponent,
  ],
})
export class AccountsModule {}
