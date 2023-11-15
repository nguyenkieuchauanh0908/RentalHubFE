import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { TagsComponent } from '../shared/tags/tags.component';

@NgModule({
  declarations: [ContentComponent, SidebarComponent, TagsComponent],
  imports: [CommonModule],
})
export class ContentModule {}
