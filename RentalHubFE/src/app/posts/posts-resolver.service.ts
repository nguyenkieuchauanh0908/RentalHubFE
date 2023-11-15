import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { PostItem } from './posts-list/post-item/post-item.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsResolverService implements Resolve<PostItem[]> {
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const posts = this.postService.posts;
    if (posts.length === 0) {
      return this.postService.getPostList(1, 3);
    } else {
      return posts;
    }
  }
}
