import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ForumService } from '../forum.service';
import { User } from 'src/app/auth/user.model';
import { ForumPostModel } from '../forum-post/forum-post.model';
import { PostCommentComponent } from 'src/app/shared/post-comment/post-comment.component';
import { PostCommentDialogComponent } from 'src/app/shared/post-comment-dialog/post-comment-dialog.component';
import { PostCommentModel } from 'src/app/shared/post-comment/write-post-comment-form/post-comment.model';

@Component({
  selector: 'app-forum-post-detail',
  templateUrl: './forum-post-detail.component.html',
  styleUrls: ['./forum-post-detail.component.scss'],
})
export class ForumPostDetailComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject();
  moment!: any;
  isLoading = false;
  initialized: boolean = false;
  currentUser: User | null = null;
  postId: string | null = null;
  currentPost: ForumPostModel | null = null;
  isAuthenticated: boolean = false;
  commentId: string | null = null;
  notiCommentTree: PostCommentModel[] | null = null;
  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private notifier: NotifierService
  ) {}
  ngOnInit(): void {
    console.log('ngOnInit called');
    window.scrollTo(0, 0); // Scrolls the page to the top
    this.isLoading = true;
    this.initialized = false;
    this.moment = moment;
    this.moment.locale('vn');
    this.postId = this.route.snapshot.paramMap.get('pId');
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('Authentication status checked');
        this.isAuthenticated = !!user;
        this.currentUser = user;
        if (this.isAuthenticated) {
          console.log('User is authenticated');
          this.route.params.subscribe((params) => {
            this.postId = params['pId'];
            this.currentPost = null;
            if (this.postId) {
              this.loadPostDetail();
              const stateData = history.state;
              if (stateData) {
                this.commentId = stateData['data']._commentId;
                this.loadNotiComment(this.commentId!);
              }
              this.initialized = true;
              this.isLoading = false;
            }
          });
        }
      });
    this.isLoading = false;
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  loadPostDetail() {
    this.isLoading = true;
    if (this.postId) {
      this.forumService
        .getSocialPostById(this.postId)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.currentPost = res.data;
              // const dialogRef = this.dialog.open(PostCommentDialogComponent, {
              //   width: '600px',
              //   data: {
              //     pId: this.postId,
              //     firstPageComments: null,
              //     totalCommentPage: 5,
              //   },
              // });
              this.isLoading = false;
            }
          },
          (err) => {
            this.isLoading = false;
          }
        );
    }
  }

  loadNotiComment(commentId: string) {
    this.forumService
      .getCommentTrees(commentId)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.notiCommentTree = res.data;
        }
      });
  }

  changePostStatus($event: any) {
    console.log('🚀 ~ ForumHomeComponent ~ changePostStatus ~ $event:', $event);
    this.forumService.changeSocialPostStatus($event.pId).subscribe((res) => {
      if (res.data) {
        this.isLoading = false;
        this.notifier.notify('success', 'Cập nhật trạng thái thành công');
      }
    });
  }
}
