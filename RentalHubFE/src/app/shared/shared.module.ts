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
  ],
})
export class SharedModule {}
