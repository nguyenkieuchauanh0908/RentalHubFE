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

@NgModule({
  declarations: [
    TagsComponent,
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
    SliderComponent,
    HostCardComponent,
    MainLayoutComponent,
    AddTagDialogComponent,
    ConfirmDialogComponent,
    OtpDialogComponent,
  ],
  imports: [
    CommonModule,
    NgMaterialsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NotifierModule,
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
  ],
})
export class SharedModule {}
