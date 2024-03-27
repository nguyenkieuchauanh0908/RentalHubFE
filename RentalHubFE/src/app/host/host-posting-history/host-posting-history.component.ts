import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { HostProfile } from '../host.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-host-posting-history',
  templateUrl: './host-posting-history.component.html',
  styleUrls: ['./host-posting-history.component.scss'],
})
export class HostPostingHistoryComponent implements OnInit {
  hostProfile: HostProfile = {
    email: '',
    fname: '',
    lname: '',
    phone: '',
    avatar: '',
    id: '',
  };
  isLoading = false;
  error: string = '';
  stateData: any;
  private getPostHistorySub!: Subscription;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  seeMyProfile = false;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = this.paginationService.currentPage;
  pageItemLimit: number = 5;

  currentActiveStatus = {
    status: 4, //All posts
    data: this.historyPosts,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private paginationService: PaginationService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.currentPage = 1;
    this.currentUid = '';
    this.currentUid = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    if (this.currentUid) {
      this.getPostHistorySub = this.postService
        .getPostsHistoryOfAUser(this.currentUid, 1, 5)
        .subscribe((res) => {
          this.historyPosts = res.data;
          this.hostProfile.fname = res.data[0].authorFName;
          this.hostProfile.lname = res.data[0].authorLName;
          this.hostProfile.id = res.data[0].authorId;
          this.hostProfile.avatar = res.data[0].avatarAuthor;
          this.hostProfile.phone = res.data[0].phoneNumber;
          this.hostProfile.email = res.data[0].authorEmail;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        });
    }
  }

  ngOnDestroy(): void {}

  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean
  ) {
    this.historyPosts = [];
    if (position === 1 || position === -1) {
      this.currentPage = this.paginationService.navigatePage(
        position,
        this.currentPage
      );
    }
    if (toFirstPage) {
      this.currentPage = 1;
    } else if (toLastPage) {
      this.currentPage = this.totalPages;
    }

    if (this.currentUid) {
      this.getPostHistorySub = this.postService
        .getPostsHistoryOfAUser(this.currentUid, this.currentPage, 5)
        .subscribe((res) => {
          if (res.data) {
            this.historyPosts = res.data;
            this.totalPages = res.pagination.total;
          } else {
            this.historyPosts = [];
          }
          // console.log(this.historyPosts);
          // console.log(this.currentActiveStatus.status);
        });
    }
  }

  goToPost(id: string) {
    if (id) {
      this.router.navigate(['/posts/', id]);
    } else {
      this.notifierService.notify(
        'error',
        'Xảy ra lỗi trong quá trình điều hướng!'
      );
    }
  }
}
