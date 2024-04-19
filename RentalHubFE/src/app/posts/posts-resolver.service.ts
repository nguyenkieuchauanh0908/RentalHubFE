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
    range: {
      priceRange: { max: 10000000000, min: 100000 },
      electricRanges: { max: 10000000000, min: 100000 },
      waterRange: { max: 10000000000, min: 100000 },
    },
    priorities: [''],
  };
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const posts = this.postService.posts;

    return posts;
  }
}
