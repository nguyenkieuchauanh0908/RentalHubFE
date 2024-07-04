import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { resDataDTO } from 'src/app/shared/resDataDTO';
import { ForumService } from '../forum.service';
import {
  ChatBotService,
  UserChatsType,
} from 'src/app/shared/chat-bot/chat-bot.service';
import { User } from 'src/app/auth/user.model';
import { NotifierService } from 'angular-notifier';
import { SocialPostEditDialogComponent } from '../social-post-edit-dialog/social-post-edit-dialog.component';
import { ForumPostModel } from './forum-post.model';
import { state } from '@angular/animations';
import { PostCommentDialogComponent } from 'src/app/shared/post-comment-dialog/post-comment-dialog.component';
import { PostCommentModel } from 'src/app/shared/post-comment/write-post-comment-form/post-comment.model';
import { ReportDialogComponent } from 'src/app/posts/report-dialog/report-dialog.component';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss'],
})
export class ForumPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialContentToDisplay') socialContentToDisplay:
    | ElementRef
    | undefined;
  @Input() notiCommentTree: PostCommentModel[] | null = null;
  @Input() post!: ForumPostModel;
  @Output() changePostStatus: EventEmitter<{ status: number; pId: string }> =
    new EventEmitter();
  $destroy: Subject<Boolean> = new Subject();
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  seeMore: boolean = false;
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;

  postCommentsToDisplay: PostCommentModel[] | null = null;
  currentCommentPage: number = 0;
  commentLimt: number = 5;
  totalCommentPage: number = 1;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private notifierService: NotifierService,
    private forumService: ForumService
  ) {}
  ngAfterViewInit(): void {
    this.socialContentToDisplay!.nativeElement.innerHTML = this.post._content;
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.isAuthenticated = !!user;
          this.currentUser = user;
          if (this.post) {
            this.isLoading = false;
            if (this.post._totalComment > 0) {
              this.loadComments();
            }
          }
        } else {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  seeMoreContentClick() {
    this.seeMore = !this.seeMore;
  }

  seeComments() {
    if (this.isAuthenticated) {
      window.scrollTo(0, 0); // Scrolls the page to the top

      const dialogRef = this.dialog.open(PostCommentDialogComponent, {
        width: '800px',
        data: {
          pId: this.post._id,
          firstPageComments: this.postCommentsToDisplay,
          totalCommentPage: this.totalCommentPage,
        },
      });
    } else {
      window.scrollTo(0, 0); // Scrolls the page to the top

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: 'Bạn cần phải đăng nhập để xem toàn bộ bình luận',
      });
      const sub = dialogRef.componentInstance.confirmYes
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.$destroy))
        .subscribe(() => {
          sub.unsubscribe();
        });
    }
  }

  loadComments() {
    if (this.currentCommentPage < this.totalCommentPage) {
      this.isLoading = false;
      this.currentCommentPage += 1;
      this.forumService
        .getParentCommentsOfPost(
          this.post._id,
          this.currentCommentPage,
          this.commentLimt
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              let resDt: any[] = res.data;
              if (this.notiCommentTree) {
                resDt = res.data.filter(
                  (cmt: any) => cmt._id !== this.notiCommentTree![0]._id
                );
              }
              this.totalCommentPage = res.pagination.total;
              if (!this.postCommentsToDisplay) {
                this.postCommentsToDisplay = resDt;
              } else {
                this.postCommentsToDisplay =
                  this.postCommentsToDisplay.concat(resDt);
              }
            }
          },
          (err) => {}
        );
    }
  }

  addToContactAndGoToChatBot() {
    console.log('addToContactAndGoToChatBot');
    if (this.currentUser && this.post._authorId) {
      //Thêm chat mới vào chat's list (nếu chưa có trong chat list); update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
      let updatedChats: UserChatsType[] | null = null;
      this.chatBotService
        .createNewChat(this.currentUser._id, this.post._authorId)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.chatBotService.setChatBotMenuOpened(true);
            this.chatBotService.setSeeContactList(false);
            this.chatBotService.getCurrentUserChats.subscribe((chats) => {
              if (chats) {
                updatedChats = chats;
              }
            });
            //Kiểm tra xem chat đã tồn tại chưa, nếu chưa thì cập nhật lại userChats
            let chatExisted = false;
            for (let i = 0; i < updatedChats!.length; i++) {
              if (updatedChats![i]._id === res.data._id) {
                chatExisted = true;
                break;
              }
            }
            if (!chatExisted) {
              this.chatBotService.setCurrentUserChats([
                res.data,
                ...updatedChats!,
              ]);
            }

            this.chatBotService.setCurrentChat(res.data);
          }
        });
    }
  }

  editPost() {
    console.log('On editing post...');
    window.scrollTo(0, 0); // Scrolls the page to the top

    const dialogRef = this.dialog.open(SocialPostEditDialogComponent, {
      width: '800px',
      data: this.post,
    });
    const sub = dialogRef.componentInstance.updateSucess.subscribe(
      (updatedPost) => {
        console.log(
          '🚀 ~ ForumPostComponent ~ editPost ~ updatedPost:',
          updatedPost
        );
        this.post._title = updatedPost._title;
        this.post._content = updatedPost._content;
        if (updatedPost._images) {
          this.post._images = updatedPost._images;
        }
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  updateStatusTo(updatedStatus: number) {
    console.log('On update status to', updatedStatus);
    this.changePostStatus.emit({ status: updatedStatus, pId: this.post._id });
  }

  seeProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        profileName: this.post._authorName,
        profileImage: this.post._images,
      },
    };

    this.router.navigate(
      ['/forum/profile', this.post._authorId],
      navigationExtras
    );
  }

  likePost(liked: boolean) {
    console.log('Like or unlike post:', liked);
    this.forumService
      .likeOrUnlikePost(this.post._id)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.post._isLiked = liked;
          this.post._totalLike = res.data._totalLike;
        }
      });
  }

  createCommentSuccess(event: any) {
    console.log(event);
    if (event !== null) {
      console.log('updated UI comment...');
      if (this.postCommentsToDisplay) {
        this.postCommentsToDisplay!.unshift(event);
      } else {
        this.postCommentsToDisplay = event;
      }
    }
  }

  openReportDialog(postId: String) {
    const dialog = this.dialog.open(ReportDialogComponent, {
      width: '600px',
      data: { postId: postId, postType: 1 },
    });
  }

  //Xóa bình luận trực tiếp của bài viết
  deleteCommentSuccess(commentId: string) {
    console.log('Update UI after delete successfully', commentId);
    this.postCommentsToDisplay = this.postCommentsToDisplay!.filter(
      (cmt: PostCommentModel) => {
        // if (cmt.totalReplies > 0) {
        //   cmt.totalReplies = cmt.totalReplies - 1;
        // }

        return cmt._id !== commentId;
      }
    );
    console.log(
      '🚀 ~ ForumPostComponent ~ deleteComment ~ this.postCommentsToDisplay:',
      this.postCommentsToDisplay
    );
  }
}
