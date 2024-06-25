import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import {
  Subscription,
  Subject,
  takeUntil,
  fromEvent,
  throttleTime,
} from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ForumService } from '../forum.service';
import { User } from 'src/app/auth/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ForumPostModel } from '../forum-post/forum-post.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialPostContainer', { static: false })
  private socialPostContainer!: ElementRef;
  scrollSubscription: Subscription | undefined;
  currentScrollTopPosition: number = 0;
  moment!: any;
  isLoading = false;
  initialized: boolean = false;
  $destroy: Subject<Boolean> = new Subject();
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  socialPostsToDisplay: ForumPostModel[] | null = null;
  currentPage: number = 1;
  pageLimit: number = 5;
  totalPages: number = 0;
  currentPostStatus: number | null = 0;
  urlProfileId: string | null = null;
  profileName: string | null = null;
  profileImage: string | null = null;

  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private notifier: NotifierService
  ) {}
  ngAfterViewInit(): void {
    console.log('forum-profile component ngAfterViewInit');
    setTimeout(() => {
      this.initializeScrollEvent();
    }, 100);
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.isLoading = true;
    this.currentScrollTopPosition = 0;
    this.currentPostStatus = 0;
    this.initialized = false;
    this.moment = moment;
    this.moment.locale('vn');
    this.currentPostStatus = null;
    this.urlProfileId = this.route.snapshot.paramMap.get('uId');

    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('Authentication status checked');
        this.isAuthenticated = !!user;
        this.currentUser = user;
        if (this.isAuthenticated) {
          console.log('User is authenticated');
          this.route.params.subscribe((params) => {
            this.urlProfileId = params['uId'];
            this.socialPostsToDisplay = null;
            if (this.urlProfileId) {
              this.loadSocialPosts();
              const stateData = history.state;
              console.log(
                '🚀 ~ ProfileComponent ~ .subscribe ~ stateData:',
                stateData
              );
              if (stateData) {
                this.profileName = stateData['profileName'];
                this.profileImage = stateData['profileImage'];
              }
              this.initialized = true;
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.scrollSubscription?.unsubscribe();
  }

  loadSocialPosts() {
    this.currentPostStatus = 0;
    this.isLoading = true;
    //Profile owner
    if (this.urlProfileId === this.currentUser!._id) {
      //Lấy post có status = 1 và status = 0 của currentUser
      console.log('loading social posts of owners...');
      this.forumService
        .getSocialPosts(
          this.currentPage,
          this.pageLimit,
          this.currentPostStatus,
          null
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.currentPage = res.pagination.page;
              this.totalPages = res.pagination.total;
              if (!this.socialPostsToDisplay) {
                this.socialPostsToDisplay = res.data;
              } else {
                this.socialPostsToDisplay = this.socialPostsToDisplay.concat(
                  res.data
                );
              }
              setTimeout(() => {
                if (this.currentPage < this.totalPages) {
                  console.log('Maintain scroll position');
                  this.renderer.setProperty(
                    this.socialPostContainer.nativeElement,
                    'scrollTop',
                    this.currentScrollTopPosition
                  );
                  this.currentScrollTopPosition =
                    this.socialPostContainer.nativeElement.scrollTop + 2000;
                }
              }, 100);
            }
          },
          (err) => {
            this.isLoading = false;
          }
        );
    }
    //Viewers
    else {
      //Lấy các post có status = 0 của account có uId là urlProfielId
      console.log('loading social posts for viewers...');
      this.forumService
        .getSocialPosts(
          this.currentPage,
          this.pageLimit,
          null,
          this.urlProfileId
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.currentPage = res.pagination.page;
              this.totalPages = res.pagination.total;
              if (!this.socialPostsToDisplay) {
                this.socialPostsToDisplay = res.data;
              } else {
                this.socialPostsToDisplay = this.socialPostsToDisplay.concat(
                  res.data
                );
              }
              setTimeout(() => {
                if (this.currentPage < this.totalPages) {
                  console.log('Maintain scroll position');
                  this.renderer.setProperty(
                    this.socialPostContainer.nativeElement,
                    'scrollTop',
                    this.currentScrollTopPosition
                  );
                  this.currentScrollTopPosition =
                    this.socialPostContainer.nativeElement.scrollTop + 2000;
                }
              }, 100);
            }
          },
          (err) => {
            this.isLoading = false;
          }
        );
    }
  }

  initializeScrollEvent() {
    if (this.socialPostContainer) {
      console.log('socialPostContainer is ready');
      this.attachScrollEvent();
    } else {
      console.error('socialPostContainer is still not ready');
      // Retry attaching the event after a slight delay
      setTimeout(() => this.initializeScrollEvent(), 100);
    }
  }

  attachScrollEvent() {
    console.log(' before attachScrollEvent');
    if (this.socialPostContainer) {
      console.log('Attaching scroll event listener');
      this.scrollSubscription = fromEvent(
        this.socialPostContainer.nativeElement,
        'scroll'
      )
        .pipe(throttleTime(200))
        .subscribe(() => this.onScroll());
    }
  }

  onScroll() {
    console.log('Scroll event detected');
    const element = this.socialPostContainer!.nativeElement;
    console.log(
      '🚀 ~ onScroll ~ element:',
      element.scrollTop,
      this.currentScrollTopPosition
    );
    if (
      element.scrollTop >= this.currentScrollTopPosition &&
      !this.isLoading &&
      this.currentPage < this.totalPages
    ) {
      this.currentPage++;
      if (this.initialized) {
        this.loadSocialPosts();
      }
    }
  }

  changePostStatus($event: { status: number; pId: string }) {
    console.log('🚀 ~ ForumHomeComponent ~ changePostStatus ~ $event:', $event);
    this.isLoading = true;
    //Call API to update the status
    this.forumService.changeSocialPostStatus($event.pId).subscribe((res) => {
      if (res.data) {
        this.isLoading = false;
        this.notifier.notify('success', 'Cập nhật trạng thái thành công');
        if (this.socialPostsToDisplay) {
          this.socialPostsToDisplay = this.socialPostsToDisplay!.map((post) => {
            if (post!._id === $event.pId) {
              post!._status = $event.status;
              return post;
            }
            return post;
          });
        }
      }
    });
  }
}
