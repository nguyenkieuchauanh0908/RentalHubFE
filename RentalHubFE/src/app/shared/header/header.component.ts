import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = '';
  private userSub!: Subscription;
  private searchSub!: Subscription;
  searchResultChangedSub: Subscription = new Subscription();
  user!: User | null;
  fullName!: string;
  isAuthenticatedUser: boolean = false;

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.userSub = this.accountService.getCurrentUser.subscribe((user) => {
      console.log('On rendering headers...');
      console.log(user);
      this.isAuthenticatedUser = !!user;
      console.log('User is authenticated: ', this.isAuthenticatedUser);
      this.user = user;
      if (this.user?._fname && this.user?._lname) {
        this.fullName = this.user?._fname + ' ' + this.user._lname;
      }
    });
  }

  toMyProfile() {
    let uId = this.user?._id;
    this.router.navigate(['/profile/user/', uId]);
  }

  toPostNew() {
    if (this.user !== null) {
      let uId = this.user?._id;
      this.router.navigate(['/profile/post-new/', uId]);
    } else {
      this.notifierService.notify('error', 'Vui lòng đăng nhập để đăng bài!');
    }
  }

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    if (searchForm.search) {
      this.searchSub = this.postService
        .searchPostsByKeyword(searchForm.search, 1, 5)
        .subscribe(
          (res) => {
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
          },
          (errorMsg) => {
            this.isLoading = false;
            this.error = errorMsg;
            console.log(this.error);
            this.notifierService.notify('error', errorMsg);
          }
        );
    } else {
      this.notifierService.notify('error', 'Vui lòng nhập từ khóa tìm kiếm!');
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    // this.searchSub.unsubscribe();
  }
}
