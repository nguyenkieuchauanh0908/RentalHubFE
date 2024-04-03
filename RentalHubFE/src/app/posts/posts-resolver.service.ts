import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { PostItem } from './posts-list/post-item/post-item.model';
import { Observable } from 'rxjs';
import { FilterCriteria } from './posts-list/posts-list.component';

@Injectable({ providedIn: 'root' })
export class PostsResolverService implements Resolve<PostItem[]> {
  filterCriteria: FilterCriteria = {
    roomPrice: {
      lowToHigh: false,
      highToLow: false,
      greaterThan: 0,
      lowerThan: 10000000,
      checked: false,
    },
    electricityPrice: {
      lowToHigh: false,
      highToLow: false,
      greaterThan: 0,
      lowerThan: 10000000,
      checked: false,
    },
    waterPrice: {
      lowToHigh: false,
      highToLow: false,
      greaterThan: 0,
      lowerThan: 10000000,
      checked: false,
    },
    priorities: [''],
  };
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const posts = this.postService.posts;
    if (posts.length === 0) {
      return this.postService.getPostList(1, 3, this.filterCriteria);
    } else {
      return posts;
    }
  }
}
