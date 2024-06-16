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

@NgModule({
  declarations: [
    ForumHomeComponent,
    ForumLayoutComponent,
    ProfileComponent,
    ForumHeaderComponent,
    ForumPostComponent,
  ],
  imports: [CommonModule, ForumRoutingModule, SharedModule, FormsModule],
  providers: [],
})
export class ForumModule {}
