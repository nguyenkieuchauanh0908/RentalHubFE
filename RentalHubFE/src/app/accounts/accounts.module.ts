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
import { FormsModule } from '@angular/forms';
import { ChangeAvatarComponent } from './change-avatar/change-avatar.component';
import { PostEditDialogComponent } from './posting-history/post-edit-dialog/post-edit-dialog.component';
import { LoginDetailUpdateDialogComponent } from './login-detail-update-dialog/login-detail-update-dialog.component';
import { AccountEditDialogComponent } from './account-edit-dialog/account-edit-dialog.component';
import { UpdateAvatarDialogComponent } from './update-avatar-dialog/update-avatar-dialog.component';
import { VerifyHostComponent } from './verify-host/verify-host.component';
import { FavoritePostsComponent } from './favorite-posts/favorite-posts.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpdateAvatarComponent } from './update-avatar/update-avatar.component';
import { LoginDetailUpdateComponent } from './login-detail-update/login-detail-update.component';
import { RegisterAddressComponent } from './register-address/register-address.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { AddressDetailComponent } from './manage-addresses/address-detail/address-detail.component';
import { ManageIdentityComponent } from './manage-identity/manage-identity.component';
import { IdentityUpdateDialogComponent } from './manage-identity/identity-update-dialog/identity-update-dialog.component';
import {
  ToolbarService,
  HtmlEditorService,
  RichTextEditorModule,
} from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  declarations: [
    AccountsComponent,
    SidebarComponent,
    AccountsEditComponent,
    PostsEditComponent,
    ChangeAvatarComponent,
    PostEditDialogComponent,
    LoginDetailUpdateDialogComponent,
    AccountEditDialogComponent,
    UpdateAvatarDialogComponent,
    VerifyHostComponent,
    FavoritePostsComponent,
    NotificationsComponent,
    UpdateAvatarComponent,
    LoginDetailUpdateComponent,
    RegisterAddressComponent,
    ManageAddressesComponent,
    AddressDetailComponent,
    ManageIdentityComponent,
    IdentityUpdateDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AccountRoutingModule,
    SharedModule,
    PostingHistoryComponent,
    RichTextEditorModule,
  ],
  providers: [ToolbarService, HtmlEditorService],
})
export class AccountsModule {}
