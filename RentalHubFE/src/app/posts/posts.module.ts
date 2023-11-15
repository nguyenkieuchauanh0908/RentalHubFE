import { NgModule } from '@angular/core';
import { PostsComponent } from './posts.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsRoutingModule } from './posts-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { PostItemComponent } from './posts-list/post-item/post-item.component';
import { PostCardComponent } from './post-card/post-card.component';

@NgModule({
  declarations: [PostsComponent, PostDetailComponent, PostCardComponent],
  imports: [
    PostsRoutingModule,
    AuthRoutingModule,
    SharedModule,
    PostsListComponent,
  ],
})
export class PostsModule {}
