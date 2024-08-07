import { NgModule, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TagsComponent } from './tags/tags.component';
import { NgMaterialsModule } from './ng-materials/ng-materials.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination/pagination.component';
import { SliderComponent } from './slider/slider.component';
import { HostCardComponent } from './host-card/host-card.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NotifierModule } from 'angular-notifier';
import { AddTagDialogComponent } from './tags/add-tag-dialog/add-tag-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { OtpDialogComponent } from './otp-dialog/otp-dialog.component';
import { ProfileLayoutComponent } from './layout/profile-layout/profile-layout.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { SendForgetPwEmailComponent } from './send-forget-pw-email/send-forget-pw-email.component';
import { ReportDialogComponent } from '../posts/report-dialog/report-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { PostCardComponent } from '../posts/post-card/post-card.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { DisplayNotiDialogComponent } from './display-noti-dialog/display-noti-dialog.component';
import { ChatUserComponent } from './chat-bot/chat-user/chat-user.component';
import { ChatWithComponent } from './chat-bot/chat-with/chat-with.component';
import { ForumIconLinkComponent } from './forum-icon-link/forum-icon-link.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { PostCommentDialogComponent } from './post-comment-dialog/post-comment-dialog.component';
import { WritePostCommentFormComponent } from './post-comment/write-post-comment-form/write-post-comment-form.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PostCommentEditDialogComponent } from './post-comment/post-comment-edit-dialog/post-comment-edit-dialog.component';
import { PostReplyCommentComponent } from './post-comment/post-reply-comment/post-reply-comment.component';
import { MatChipsModule } from '@angular/material/chips';
import { ChatFilterPipe } from './pipe/chat-filter.pipe';
import { MatCardModule } from '@angular/material/card';
import { LinkyModule, LinkyPipe } from 'ngx-linky';

@NgModule({
  declarations: [
    TagsComponent,
    HeaderComponent,
    FooterComponent,
    ProfileHeaderComponent,
    PaginationComponent,
    SliderComponent,
    HostCardComponent,
    MainLayoutComponent,
    ProfileLayoutComponent,
    AddTagDialogComponent,
    ConfirmDialogComponent,
    OtpDialogComponent,
    ProfileLayoutComponent,
    ProfileHeaderComponent,
    SendForgetPwEmailComponent,
    ReportDialogComponent,
    ChatBotComponent,
    DisplayNotiDialogComponent,
    ChatUserComponent,
    ChatWithComponent,
    ForumIconLinkComponent,
    PostCommentComponent,
    PostCommentDialogComponent,
    WritePostCommentFormComponent,
    PostCommentEditDialogComponent,
    PostReplyCommentComponent,
    ChatFilterPipe,
  ],
  imports: [
    CommonModule,
    NgMaterialsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NotifierModule,
    PostCardComponent,
    PickerComponent,
    MatChipsModule,
    MatCardModule,
    LinkyModule,
  ],
  exports: [
    CommonModule,
    ScrollingModule,
    NgMaterialsModule,
    TagsComponent,
    HeaderComponent,
    FooterComponent,
    RouterModule,
    PaginationComponent,
    SliderComponent,
    HostCardComponent,
    MainLayoutComponent,
    NotifierModule,
    ReactiveFormsModule,
    PostCardComponent,
    ChatBotComponent,
    ForumIconLinkComponent,
    PostCommentComponent,
    WritePostCommentFormComponent,
    PickerComponent,
    MatChipsModule,
    ChatFilterPipe,
    MatCardModule,
    LinkyModule,
  ],
})
export class SharedModule {}
