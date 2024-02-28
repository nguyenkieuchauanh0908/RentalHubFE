import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from './post.service';
import { User } from '../auth/user.model';
import { PostItem } from './posts-list/post-item/post-item.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesPostResolverService {
  constructor(private postService: PostService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<String[]> | Promise<String[]> | String[] {
    let postItems: String[] | null = new Array();
    this.postService.getCurrentFavoritesId.subscribe((data) => {
      postItems = data;
    });
    return postItems;
  }
}
