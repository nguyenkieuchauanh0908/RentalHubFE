import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumHomeComponent } from './forum-home/forum-home.component';
import { ForumLayoutComponent } from './forum-layout/forum-layout.component';
import { SharedModule } from '../shared/shared.module';
import { ForumRoutingModule } from './forum-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ForumHeaderComponent } from './forum-header/forum-header.component';
import { FormsModule } from '@angular/forms';
import { ForumPostComponent } from './forum-post/forum-post.component';
import { SocialPostEditDialogComponent } from './social-post-edit-dialog/social-post-edit-dialog.component';
import { ForumSidemenuComponent } from './forum-sidemenu/forum-sidemenu.component';
import {
  HtmlEditorService,
  RichTextEditorModule,
  ToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  declarations: [
    ForumHomeComponent,
    ForumLayoutComponent,
    ProfileComponent,
    ForumHeaderComponent,
    ForumPostComponent,
    SocialPostEditDialogComponent,
    ForumSidemenuComponent,
  ],
  imports: [
    CommonModule,
    ForumRoutingModule,
    SharedModule,
    FormsModule,
    RichTextEditorModule,
  ],
  providers: [ToolbarService, HtmlEditorService],
})
export class ForumModule {}
