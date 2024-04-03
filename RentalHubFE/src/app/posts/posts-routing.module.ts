import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostsComponent } from './posts.component';
import { PostsResolverService } from './posts-resolver.service';
import { PostsSearchResultComponent } from './posts-search-result/posts-search-result.component';
import { AuthGuard } from '../auth/auth.guard';
import { FavoritesPostResolverService } from './favorites-post-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
    children: [
      {
        path: 'search',
        component: PostsSearchResultComponent,
      },
      {
        path: ':id',
        component: PostDetailComponent,
        canActivate: [AuthGuard],
        resolve: {
          favoritesPosts: FavoritesPostResolverService,
        },
      },
      {
        path: '',
        component: PostsListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
