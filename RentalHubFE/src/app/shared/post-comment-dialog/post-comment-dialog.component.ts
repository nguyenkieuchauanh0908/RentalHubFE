import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  Subject,
  Subscription,
  fromEvent,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { ForumService } from 'src/app/forum/forum.service';

@Component({
  selector: 'app-post-comment-dialog',
  templateUrl: './post-comment-dialog.component.html',
  styleUrls: ['./post-comment-dialog.component.scss'],
})
export class PostCommentDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('socialCommentsContainer', { static: false })
  private socialCommentsContainer!: ElementRef;
  scrollSubscription: Subscription | undefined;
  currentScrollTopPosition: number = 25;
  isLoading = false;
  initialized: boolean = false;
  $destroy: Subject<Boolean> = new Subject();
  isAuthenticated: boolean = false;
  currentUser: User | null = null;
  title = 'Bình luận';
  postCommentsToDisplay: any[] | null = null;
  currentCommentPage: number = 1;
  commentLimt: number = 5;
  totalCommentPage: number = 0;

  constructor(
    private accountService: AccountService,
    private forumService: ForumService,
    private router: Router,
    private renderer: Renderer2,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pId: string;
      firstPageComments: any[];
      totalCommentPage: number;
    }
  ) {
    if (data) {
      this.postCommentsToDisplay = data.firstPageComments;
      this.totalCommentPage = data.totalCommentPage;
      console.log(
        '🚀 ~ PostCommentDialogComponent ~ postCommentsToDisplay:',
        this.postCommentsToDisplay,
        this.totalCommentPage
      );
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }
  ngAfterViewInit(): void {
    console.log('forum-home component ngAfterViewInit');
    setTimeout(() => {
      this.initializeScrollEvent();
    }, 100);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.isAuthenticated = !!user;
          this.currentUser = user;
          if (!this.postCommentsToDisplay && this.currentCommentPage === 1) {
            this.loadComments();
          }
          this.isLoading = false;
          this.initialized = true;
        } else {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  loadComments() {
    this.isLoading = true;
    this.forumService
      .getParentCommentsOfPost(
        this.data.pId,
        this.currentCommentPage,
        this.commentLimt
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            this.isLoading = false;
            this.totalCommentPage = res.pagination.total;
            if (!this.postCommentsToDisplay) {
              this.postCommentsToDisplay = res.data;
            } else {
              this.postCommentsToDisplay = this.postCommentsToDisplay.concat(
                res.data
              );
            }
            setTimeout(() => {
              if (this.currentCommentPage < this.totalCommentPage) {
                console.log('Maintain scroll position');
                this.renderer.setProperty(
                  this.socialCommentsContainer.nativeElement,
                  'scrollTop',
                  this.currentScrollTopPosition
                );
                this.currentScrollTopPosition =
                  this.socialCommentsContainer.nativeElement.scrollTop + 25;
              }
            }, 100);
          }
        },
        (err) => {}
      );
  }

  initializeScrollEvent() {
    if (this.socialCommentsContainer) {
      console.log('socialCommentsContainer is ready');
      this.attachScrollEvent();
    } else {
      console.error('socialCommentsContainer is still not ready');
      // Retry attaching the event after a slight delay
      setTimeout(() => this.initializeScrollEvent(), 100);
    }
  }

  attachScrollEvent() {
    console.log(' before attachScrollEvent');
    if (this.socialCommentsContainer) {
      console.log('Attaching scroll event listener');
      this.scrollSubscription = fromEvent(
        this.socialCommentsContainer.nativeElement,
        'scroll'
      )
        .pipe(throttleTime(200))
        .subscribe(() => this.onScroll());
    }
  }

  onScroll() {
    console.log('Scroll event detected');
    const element = this.socialCommentsContainer!.nativeElement;
    console.log(
      '🚀 ~ onScroll ~ element:',
      element.scrollTop,
      this.currentScrollTopPosition
    );
    if (
      element.scrollTop >= this.currentScrollTopPosition &&
      !this.isLoading &&
      this.currentCommentPage < this.totalCommentPage
    ) {
      console.log('Loading more comment...');
      this.currentCommentPage++;
      if (this.initialized) {
        this.loadComments();
      }
    }
  }
}
