import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  private searchSub!: Subscription;
  searchResultChangedSub: Subscription = new Subscription();
  user!: User | null;
  fullName!: string;
  isAuthenticatedUser: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticatedUser = !!user;
      console.log('User is authenticated: ', this.isAuthenticatedUser);
      this.user = user;
      if (this.user?._fname && this.user?._lname) {
        this.fullName = this.user?._fname + ' ' + this.user._lname;
      }
    });
  }

  toMyProfile() {
    if (this.user !== null) {
      let uId = this.user?._id;
      this.router.navigate(['/profile/user/', uId]);
    }
  }

  toPostNew() {
    if (this.user !== null) {
      let uId = this.user?._id;
      this.router.navigate(['/profile/post-new/', uId]);
    }
  }

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    this.searchSub = this.postService
      .searchPostsByKeyword(searchForm.search, 1, 5)
      .subscribe((res) => {
        this.postService.searchResultsChanged.next([...res.data]);
        console.log('On navigating to search result page...');
        this.router.navigate(
          [
            '/posts/search',
            {
              keyword: searchForm.search,
            },
          ],
          {
            state: {
              searchResult: res.data,
              pagination: res.pagination,
              keyword: searchForm.search,
            },
          }
        );
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    // this.searchSub.unsubscribe();
  }
}
